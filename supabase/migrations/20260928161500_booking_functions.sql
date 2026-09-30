-- Service-role only. Serialises all bookings for one session with a row lock.
create or replace function create_booking_hold(
  p_session_id uuid, p_ticket_type_id uuid, p_quantity int,
  p_customer jsonb, p_attendees jsonb, p_idempotency_key text,
  p_token_hash text, p_attribution jsonb default '{}'
) returns bookings
language plpgsql security definer set search_path = public as $$
declare s sessions; ev events; stt session_ticket_types; tt ticket_types; b bookings; v_seats int; v_subtotal int;
begin
  -- 0 idempotency: same key returns the same booking
  select * into b from bookings where idempotency_key = p_idempotency_key;
  if found then return b; end if;

  -- 1 lock the session row (this is what makes the last seat safe)
  select * into s from sessions where id = p_session_id for update;
  if not found or s.status <> 'published' then raise exception 'SESSION_UNAVAILABLE'; end if;
  if (s.sales_open_at is not null and now() < s.sales_open_at) or now() >= s.booking_cutoff_at
     then raise exception 'SALES_CLOSED'; end if;
  select * into ev from events where id = s.event_id;
  if ev.booking_mode <> 'direct' then raise exception 'BOOKING_DISABLED'; end if;

  -- 2 lazily expire stale holds (also releases the one-hold-per-phone rule)
  update bookings set status = 'expired', updated_at = now()
   where session_id = s.id and status = 'held' and hold_expires_at <= now();

  -- 3 price + seats come from the DB, never from the client
  select * into stt from session_ticket_types
   where session_id = s.id and ticket_type_id = p_ticket_type_id and is_active;
  select * into tt from ticket_types where id = p_ticket_type_id and is_active;
  if stt is null or tt is null then raise exception 'TICKET_UNAVAILABLE'; end if;
  if p_quantity < 1 or p_quantity > stt.max_per_booking then raise exception 'BAD_QUANTITY'; end if;
  v_seats := p_quantity * tt.seats_per_unit;
  if v_seats > ev.max_seats_per_booking then raise exception 'TOO_MANY_SEATS'; end if;
  if jsonb_array_length(p_attendees) <> v_seats then raise exception 'ATTENDEE_COUNT_MISMATCH'; end if;

  -- 4 capacity
  if v_seats > seats_remaining(s.id) then raise exception 'INSUFFICIENT_SEATS'; end if;

  -- 5 one active hold per phone per session
  if exists (select 1 from bookings where session_id = s.id and status = 'held'
             and customer_phone = p_customer->>'phone') then raise exception 'HOLD_EXISTS'; end if;

  -- 6 insert booking (+ items + attendees + wishlist); total = price * qty; code generated unique
  v_subtotal := stt.price_paise * p_quantity;
  
  insert into bookings(
    code, session_id, status, customer_name, customer_phone, customer_email,
    whatsapp_opt_in, seats_total, subtotal_paise, fees_paise, total_paise,
    hold_expires_at, attribution, access_token_hash, idempotency_key
  ) values (
    'SB-' || upper(substr(md5(random()::text), 1, 6)),
    s.id, 'held', p_customer->>'name', p_customer->>'phone', p_customer->>'email',
    coalesce((p_customer->>'whatsapp_opt_in')::boolean, false), v_seats,
    v_subtotal, 0, v_subtotal,
    now() + (ev.hold_minutes || ' minutes')::interval,
    p_attribution, p_token_hash, p_idempotency_key
  ) returning * into b;

  insert into booking_items(booking_id, ticket_type_id, quantity, unit_price_paise, seats_per_unit, line_total_paise)
  values (b.id, p_ticket_type_id, p_quantity, stt.price_paise, tt.seats_per_unit, v_subtotal);

  return b;
end $$;

-- Called by webhook / verify-payment. Idempotent.
create or replace function confirm_booking_from_payment(
  p_order_id text, p_payment_id text, p_amount_paise int, p_currency text, p_method text
) returns text language plpgsql security definer set search_path = public as $$
declare b bookings;
begin
  select * into b from bookings where code = p_order_id for update;
  if not found then return 'not_found'; end if;
  if b.status = 'confirmed' then return 'already_confirmed'; end if;
  
  if p_amount_paise <> b.total_paise or p_currency <> b.currency then
    update bookings set status = 'needs_review' where id = b.id;
    return 'needs_review';
  end if;

  if b.status = 'held' and b.hold_expires_at > now() then
    update bookings set status = 'confirmed', confirmed_at = now() where id = b.id;
    return 'confirmed';
  end if;
  
  -- Reacquire seats if expired
  if b.status = 'expired' or (b.status = 'held' and b.hold_expires_at <= now()) then
    if seats_remaining(b.session_id) >= b.seats_total then
      update bookings set status = 'confirmed', confirmed_at = now() where id = b.id;
      return 'reacquired';
    else
      update bookings set status = 'needs_review' where id = b.id;
      return 'needs_review';
    end if;
  end if;

  return 'invalid_state';
end $$;
