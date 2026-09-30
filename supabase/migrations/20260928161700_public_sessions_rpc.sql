create or replace function get_public_sessions(p_event_slug text) 
returns table (
  session_id uuid,
  starts_at timestamptz,
  ends_at timestamptz,
  venue_name text,
  venue_address text,
  seats_remaining int,
  session_status text,
  solo_price_paise int,
  couple_price_paise int
)
language plpgsql stable security definer set search_path = public as $$
declare
  v_event_id uuid;
begin
  select id into v_event_id from events where slug = p_event_slug and status = 'published';
  if not found then
    return;
  end if;

  return query
  select 
    s.id as session_id,
    s.starts_at,
    s.ends_at,
    v.name as venue_name,
    v.locality as venue_address,
    seats_remaining(s.id) as seats_remaining,
    case
      when s.status = 'cancelled' then 'cancelled'
      when s.status = 'closed' then 'closed'
      when seats_remaining(s.id) <= 0 then 'sold_out'
      when now() >= s.booking_cutoff_at then 'closed'
      when s.sales_open_at is not null and now() < s.sales_open_at then 'upcoming'
      when seats_remaining(s.id) <= s.almost_full_threshold then 'almost_full'
      else 'available'
    end as session_status,
    (select price_paise from session_ticket_types stt join ticket_types tt on tt.id = stt.ticket_type_id where stt.session_id = s.id and tt.code = 'solo' and stt.is_active limit 1) as solo_price_paise,
    (select price_paise from session_ticket_types stt join ticket_types tt on tt.id = stt.ticket_type_id where stt.session_id = s.id and tt.code = 'couple' and stt.is_active limit 1) as couple_price_paise
  from sessions s
  join events e on e.id = s.event_id
  left join venues v on v.id = e.venue_id
  where s.event_id = v_event_id and s.status in ('published', 'closed', 'cancelled')
  order by s.starts_at asc;
end;
$$;
