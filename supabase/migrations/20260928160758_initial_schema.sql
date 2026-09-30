create extension if not exists pgcrypto;

create table media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media-public',
  path text not null unique,
  alt_text text not null,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp','image/avif')),
  size_bytes int not null check (size_bytes <= 5*1024*1024),
  width int, height int,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  locality text,
  city text not null default 'Hyderabad',
  maps_url text,
  latitude numeric(9,6), longitude numeric(9,6),
  description text, hours_note text,
  image_media_id uuid references media(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  venue_id uuid references venues(id),
  timezone text not null default 'Asia/Kolkata',
  hold_minutes int not null default 10 check (hold_minutes between 5 and 30),
  max_seats_per_booking int not null default 4 check (max_seats_per_booking between 1 and 20),
  booking_mode text not null default 'external'
    check (booking_mode in ('external','direct','closed')),   -- kill switch: external = link out to BMS/District/ticket URL
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity int not null check (capacity >= 0),
  sales_open_at timestamptz,
  booking_cutoff_at timestamptz not null,
  almost_full_threshold int not null default 4 check (almost_full_threshold >= 0),
  status text not null default 'draft' check (status in ('draft','published','closed','cancelled')),
  external_ticket_url text,          -- Launch Slice CTA / other channels
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (booking_cutoff_at <= starts_at)
);

create table ticket_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                     -- 'solo' | 'couple'
  name text not null,
  description text,
  seats_per_unit int not null check (seats_per_unit > 0),   -- solo 1, couple 2
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table session_ticket_types (
  session_id uuid not null references sessions(id) on delete cascade,
  ticket_type_id uuid not null references ticket_types(id),
  price_paise int not null check (price_paise >= 0),         -- 64900 / 120000
  max_per_booking int not null default 4 check (max_per_booking > 0),
  is_active boolean not null default true,
  primary key (session_id, ticket_type_id)
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                                  -- SB-XXXXXX
  session_id uuid not null references sessions(id),
  status text not null check (status in ('held','confirmed','expired','cancelled','needs_review')),
  customer_name text not null,
  customer_phone text not null,                               -- E.164
  customer_email text,
  whatsapp_opt_in boolean not null default false,
  seats_total int not null check (seats_total > 0),
  subtotal_paise int not null check (subtotal_paise >= 0),
  fees_paise int not null default 0 check (fees_paise >= 0),
  total_paise int not null check (total_paise >= 0),
  currency text not null default 'INR',
  hold_expires_at timestamptz,
  confirmed_at timestamptz, cancelled_at timestamptz, cancel_reason text,
  quiz_response_id uuid,
  attribution jsonb not null default '{}'::jsonb,             -- utm_*, referrer
  access_token_hash text not null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (total_paise = subtotal_paise + fees_paise)
);

create table booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  ticket_type_id uuid not null references ticket_types(id),
  quantity int not null check (quantity > 0),
  unit_price_paise int not null,           -- snapshot
  seats_per_unit int not null,             -- snapshot
  line_total_paise int not null,
  check (line_total_paise = unit_price_paise * quantity)
);

create table plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  blurb text,
  care_level text check (care_level in ('easy','medium','expert')),
  light text,
  tags text[] not null default '{}',
  photo_media_id uuid references media(id),
  in_bingo_pool boolean not null default false,   -- one of the 25 called names
  in_giveaway boolean not null default false,     -- physically available
  stock_per_session int check (stock_per_session >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table attendees (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  session_id uuid not null references sessions(id),
  position int not null,                          -- 1..n within booking
  full_name text not null,
  participant_no int,                             -- assigned on run sheet
  checked_in_at timestamptz,
  plant_taken_id uuid references plants(id),      -- optional post-event record
  unique (booking_id, position),
  unique (session_id, participant_no)
);

create table attendee_wishlist (
  attendee_id uuid not null references attendees(id) on delete cascade,
  plant_id uuid not null references plants(id),
  rank int not null check (rank between 1 and 3),
  primary key (attendee_id, rank),
  unique (attendee_id, plant_id)
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id),
  provider text not null default 'razorpay',
  provider_order_id text not null unique,
  provider_payment_id text unique,
  amount_paise int not null,
  currency text not null default 'INR',
  status text not null check (status in ('created','pending','captured','failed','refunded','partially_refunded')),
  method text, failure_code text, failure_reason text,
  captured_at timestamptz,
  refunded_paise int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payment_events (              -- immutable webhook log
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  provider_event_id text not null unique,  -- idempotency
  event_type text not null,
  payload jsonb not null,
  signature_valid boolean not null,
  processed_at timestamptz,
  processing_error text,
  received_at timestamptz not null default now()
);

create table refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id),
  provider_refund_id text unique,
  amount_paise int not null check (amount_paise > 0),
  reason text not null,
  status text not null check (status in ('pending','processed','failed')),
  requested_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table seat_adjustments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id),
  seats int not null check (seats <> 0),          -- + blocks seats, - releases
  reason text not null check (reason in ('external_channel','comp','hold_back','correction')),
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create or replace function seats_remaining(p_session uuid) returns int
language sql stable as $$
  select s.capacity
   - coalesce((select sum(b.seats_total) from bookings b
               where b.session_id = s.id
                 and (b.status = 'confirmed' or (b.status = 'held' and b.hold_expires_at > now()))), 0)
   - coalesce((select sum(a.seats) from seat_adjustments a where a.session_id = s.id), 0)
  from sessions s where s.id = p_session;
$$;
