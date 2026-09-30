-- ==============================================================================
-- SHRUBS BINGO: Complete Database Setup Script
-- Tables, Functions, Row-Level Security (RLS), and Initial Data Seeds
--
-- How to run:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/kcnqfgfygxlruqrmpyow/sql/new
-- 2. Paste this entire script into the SQL Editor.
-- 3. Click "Run" (or Ctrl+Enter).
-- ==============================================================================

create extension if not exists pgcrypto;

-- 1. Media
create table if not exists media (
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

-- 2. Venues
create table if not exists venues (
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

-- 3. Events
create table if not exists events (
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
    check (booking_mode in ('external','direct','closed')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Sessions
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity int not null check (capacity >= 0),
  sales_open_at timestamptz,
  booking_cutoff_at timestamptz not null,
  almost_full_threshold int not null default 4 check (almost_full_threshold >= 0),
  status text not null default 'draft' check (status in ('draft','published','closed','cancelled','available','almost_full','sold_out','coming_soon')),
  external_ticket_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

-- 5. Ticket Types
create table if not exists ticket_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  seats_per_unit int not null check (seats_per_unit > 0),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. Session Ticket Types
create table if not exists session_ticket_types (
  session_id uuid not null references sessions(id) on delete cascade,
  ticket_type_id uuid not null references ticket_types(id),
  price_paise int not null check (price_paise >= 0),
  max_per_booking int not null default 4 check (max_per_booking > 0),
  is_active boolean not null default true,
  primary key (session_id, ticket_type_id)
);

-- 7. Bookings
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  session_id uuid references sessions(id),
  status text not null default 'held',
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  whatsapp_opt_in boolean not null default false,
  seats_total int not null default 1,
  subtotal_paise int not null default 0,
  fees_paise int not null default 0,
  total_paise int not null default 0,
  currency text not null default 'INR',
  hold_expires_at timestamptz,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text,
  quiz_response_id uuid,
  attribution jsonb not null default '{}'::jsonb,
  access_token_hash text not null default '',
  idempotency_key text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Plants Inventory
create table if not exists plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  blurb text,
  image_url text,
  care_level text check (care_level in ('easy','medium','expert')),
  light text,
  tags text[] not null default '{}',
  photo_media_id uuid references media(id),
  in_bingo_pool boolean not null default false,
  in_giveaway boolean not null default false,
  stock_per_session int check (stock_per_session >= 0),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. Hosts Directory
create table if not exists hosts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. FAQs
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 11. Quiz Questions
create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null default '[]'::jsonb,
  answer_index int not null default 0,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12. Attendees
create table if not exists attendees (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  session_id uuid references sessions(id),
  position int not null default 1,
  full_name text not null,
  participant_no int,
  checked_in_at timestamptz,
  plant_taken_id uuid references plants(id)
);

-- 13. Payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  provider text not null default 'upi',
  provider_order_id text,
  provider_payment_id text,
  amount_paise int not null default 0,
  currency text not null default 'INR',
  status text not null default 'pending',
  method text,
  captured_at timestamptz,
  refunded_paise int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table venues enable row level security;
alter table events enable row level security;
alter table sessions enable row level security;
alter table ticket_types enable row level security;
alter table session_ticket_types enable row level security;
alter table bookings enable row level security;
alter table plants enable row level security;
alter table hosts enable row level security;
alter table faqs enable row level security;
alter table quiz_questions enable row level security;
alter table attendees enable row level security;

-- Public READ access
create policy "Allow public read venues" on venues for select using (true);
create policy "Allow public read events" on events for select using (true);
create policy "Allow public read sessions" on sessions for select using (true);
create policy "Allow public read ticket_types" on ticket_types for select using (true);
create policy "Allow public read session_ticket_types" on session_ticket_types for select using (true);
create policy "Allow public read plants" on plants for select using (true);
create policy "Allow public read hosts" on hosts for select using (true);
create policy "Allow public read faqs" on faqs for select using (true);
create policy "Allow public read quiz_questions" on quiz_questions for select using (true);
create policy "Allow public insert bookings" on bookings for insert with check (true);

-- Authenticated / Service Role full access
create policy "Allow full access for service_role venues" on venues for all using (true) with check (true);
create policy "Allow full access for service_role sessions" on sessions for all using (true) with check (true);
create policy "Allow full access for service_role bookings" on bookings for all using (true) with check (true);
create policy "Allow full access for service_role plants" on plants for all using (true) with check (true);
create policy "Allow full access for service_role hosts" on hosts for all using (true) with check (true);
create policy "Allow full access for service_role faqs" on faqs for all using (true) with check (true);
create policy "Allow full access for service_role quiz_questions" on quiz_questions for all using (true) with check (true);
create policy "Allow full access for service_role attendees" on attendees for all using (true) with check (true);

-- ==============================================================================
-- INITIAL DATA SEEDS
-- ==============================================================================

-- Venues
INSERT INTO venues (id, name, address, city, description, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'HoshiSasa Cafe',
  'Plot No. 123, Jubilee Enclave, Madhapur, Hyderabad',
  'Hyderabad',
  'A cozy cafe in Madhapur.',
  true
) ON CONFLICT (id) DO NOTHING;

-- Events
INSERT INTO events (id, slug, title, tagline, description, venue_id, hold_minutes, max_seats_per_booking, booking_mode, status)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'shrubs-bingo-october',
  'Shrubs Bingo',
  'Hyderabad''s first plant-themed bingo',
  'What if bingo grew leaves? No numbers. Just plants. Come to a café, play, meet new people and take a plant home.',
  '00000000-0000-0000-0000-000000000001',
  10,
  4,
  'direct',
  'published'
) ON CONFLICT (slug) DO NOTHING;

-- Ticket Types
INSERT INTO ticket_types (id, code, name, description, seats_per_unit, sort_order)
VALUES 
  ('00000000-0000-0000-0000-000000000011', 'solo', 'Solo', 'One ticket, one plant, one bingo card.', 1, 1),
  ('00000000-0000-0000-0000-000000000012', 'couple', 'Couple', 'Two tickets, two plants, two bingo cards.', 2, 2)
ON CONFLICT (code) DO NOTHING;

-- Sessions
INSERT INTO sessions (id, event_id, starts_at, ends_at, capacity, booking_cutoff_at, status, notes)
VALUES
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', '2026-10-03T10:30:00Z', '2026-10-03T12:00:00Z', 30, '2026-10-03T09:30:00Z', 'published', '4:00 PM – 5:30 PM | HoshiSasa Cafe, Madhapur'),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', '2026-10-04T05:30:00Z', '2026-10-04T07:00:00Z', 30, '2026-10-04T04:30:00Z', 'published', '11:00 AM – 12:30 PM | HoshiSasa Cafe, Madhapur'),
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000002', '2026-10-05T10:30:00Z', '2026-10-05T12:00:00Z', 30, '2026-10-05T09:30:00Z', 'published', '4:00 PM – 5:30 PM | HoshiSasa Cafe, Madhapur'),
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000002', '2026-10-10T10:30:00Z', '2026-10-10T12:00:00Z', 30, '2026-10-10T09:30:00Z', 'published', '4:00 PM – 5:30 PM | HoshiSasa Cafe, Madhapur'),
  ('00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000002', '2026-10-11T05:30:00Z', '2026-10-11T07:00:00Z', 30, '2026-10-11T04:30:00Z', 'published', '11:00 AM – 12:30 PM | HoshiSasa Cafe, Madhapur')
ON CONFLICT (id) DO NOTHING;

-- Session Ticket Types
INSERT INTO session_ticket_types (session_id, ticket_type_id, price_paise, max_per_booking)
VALUES
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000011', 49900, 4),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000012', 89900, 2),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000011', 49900, 4),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000012', 89900, 2)
ON CONFLICT DO NOTHING;

-- Plants
INSERT INTO plants (id, name, blurb, image_url, in_giveaway, in_bingo_pool, stock_per_session)
VALUES
  ('00000000-0000-0000-0000-000000000031', 'Monstera Deliciosa', 'The classic Swiss cheese plant.', 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600&h=600', true, true, 10),
  ('00000000-0000-0000-0000-000000000032', 'Ficus Lyrata', 'Fiddle leaf fig.', 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&q=80&w=600&h=600', true, true, 8),
  ('00000000-0000-0000-0000-000000000033', 'Snake Plant', 'Perfect for low light.', 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&q=80&w=600&h=600', true, true, 15),
  ('00000000-0000-0000-0000-000000000034', 'ZZ Plant', 'Thrives on neglect.', 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=600&h=600', true, true, 12)
ON CONFLICT (id) DO NOTHING;

-- Hosts
INSERT INTO hosts (id, name, role, bio, image_url)
VALUES
  ('00000000-0000-0000-0000-000000000051', 'Meenu', 'Plant Mom', 'Obsessed with aroids. Has killed at least 3 calatheas.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600'),
  ('00000000-0000-0000-0000-000000000052', 'Lavanya', 'Bingo Master', 'Will absolutely judge you if you cheat.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=600')
ON CONFLICT (id) DO NOTHING;

-- FAQs
INSERT INTO faqs (id, question, answer, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000061', 'Do I need to know anything about plants?', 'Not at all! We''ll teach you everything you need to know. The bingo caller announces plant names with photos, descriptions, and quirky fun facts so anyone can play and win.', 1),
  ('00000000-0000-0000-0000-000000000062', 'What is included with my ticket?', 'Every ticket includes admission, your official plant bingo game card and marker, a complimentary welcome drink, and a guaranteed live potted plant to take home!', 2),
  ('00000000-0000-0000-0000-000000000063', 'Can I come alone or do I need a partner?', 'Solo attendees are very welcome! Over 50% of our guests come solo. Our seating and social atmosphere make it super easy to chat, laugh, and make plant-loving friends.', 3),
  ('00000000-0000-0000-0000-000000000064', 'Can I bring my own food or drinks?', 'Outside food and drinks are not allowed, but our host cafes (like HoshiSasa Cafe) have full artisan food, specialty coffee, and snack menus available for purchase.', 4),
  ('00000000-0000-0000-0000-000000000065', 'What happens if I win the bingo round?', 'Full house and line winners get to choose from our grand prize pool of rare and exotic indoor plants, plus exclusive Shrubs merch!', 5),
  ('00000000-0000-0000-0000-000000000066', 'Can I cancel or transfer my booking?', 'Tickets are non-refundable, but you are welcome to transfer your ticket to a friend if you inform us at least 24 hours prior to the session via Instagram or email.', 6),
  ('00000000-0000-0000-0000-000000000067', 'What time should I arrive at the venue?', 'Please arrive 15 minutes before your scheduled start time. This gives you time to check in, grab your welcome drink, select your favorite seats, and get your bingo card ready!', 7)
ON CONFLICT (id) DO NOTHING;

-- Quiz Questions
INSERT INTO quiz_questions (id, question, options, answer_index, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000071', 'What''s your ideal weekend energy?', '["Netflix, chill, and zero responsibilities", "Hiking, exploring, and being outdoors", "Café hopping and people watching", "DIY projects and redecorating my room"]'::jsonb, 0, 1),
  ('00000000-0000-0000-0000-000000000072', 'How do you handle needy people?', '["I have endless patience for them", "I set very strict boundaries", "I am the needy person", "I just ignore them completely"]'::jsonb, 1, 2),
  ('00000000-0000-0000-0000-000000000073', 'What is your biggest toxic trait?', '["I am incredibly dramatic", "I hold grudges forever", "I need constant attention to thrive", "I push people away when I''m stressed"]'::jsonb, 0, 3)
ON CONFLICT (id) DO NOTHING;
