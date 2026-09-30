-- Insert Venues
INSERT INTO venues (id, name, address, city, description, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'HoshiSasa Cafe',
  'Plot No. 123, Jubilee Enclave',
  'Hyderabad',
  'A cozy cafe in Madhapur.',
  true
) ON CONFLICT DO NOTHING;

-- Insert Events
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

-- Insert Ticket Types
INSERT INTO ticket_types (id, code, name, description, seats_per_unit, sort_order)
VALUES 
  ('00000000-0000-0000-0000-000000000011', 'solo', 'Solo', 'One ticket, one plant, one bingo card.', 1, 1),
  ('00000000-0000-0000-0000-000000000012', 'couple', 'Couple', 'Two tickets, two plants, two bingo cards.', 2, 2)
ON CONFLICT (code) DO NOTHING;

-- Insert Sessions
INSERT INTO sessions (id, event_id, starts_at, ends_at, capacity, booking_cutoff_at, status)
VALUES
  (
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000002',
    '2026-10-03T10:30:00Z', -- 4:00 PM IST
    '2026-10-03T12:00:00Z', -- 5:30 PM IST
    20,
    '2026-10-03T09:30:00Z',
    'published'
  ),
  (
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000002',
    '2026-10-04T05:30:00Z', -- 11:00 AM IST
    '2026-10-04T07:00:00Z', -- 12:30 PM IST
    20,
    '2026-10-04T04:30:00Z',
    'published'
  )
ON CONFLICT DO NOTHING;

-- Insert Session Ticket Types
INSERT INTO session_ticket_types (session_id, ticket_type_id, price_paise, max_per_booking)
VALUES
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000011', 64900, 4),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000012', 120000, 2),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000011', 64900, 4),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000012', 120000, 2)
ON CONFLICT DO NOTHING;

-- Insert Plants
INSERT INTO plants (id, name, blurb, care_level, in_giveaway, in_bingo_pool, stock_per_session, image_url)
VALUES
  (gen_random_uuid(), 'Monstera Deliciosa', 'The classic Swiss cheese plant.', 'easy', true, true, 5, 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&q=80&w=600&h=600'),
  (gen_random_uuid(), 'Ficus Lyrata', 'Fiddle leaf fig.', 'medium', true, true, 2, 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&q=80&w=600&h=600'),
  (gen_random_uuid(), 'Snake Plant', 'Perfect for low light.', 'easy', true, true, 10, 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&q=80&w=600&h=600'),
  (gen_random_uuid(), 'ZZ Plant', 'Thrives on neglect.', 'easy', true, true, 5, 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&q=80&w=600&h=600')
ON CONFLICT DO NOTHING;

-- Insert Hosts
INSERT INTO hosts (id, name, role, bio, image_url)
VALUES
  ('00000000-0000-0000-0000-000000000051', 'Meenu', 'Plant Mom', 'Obsessed with aroids. Has killed at least 3 calatheas.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=600'),
  ('00000000-0000-0000-0000-000000000052', 'Lavanya', 'Bingo Master', 'Will absolutely judge you if you cheat.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600&h=600')
ON CONFLICT DO NOTHING;

-- Insert FAQs
INSERT INTO faqs (id, question, answer, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000061', 'Do I need to know anything about plants?', 'Not at all! We''ll teach you everything you need to know. The bingo caller announces plant names with photos, descriptions, and quirky fun facts so anyone can play and win.', 1),
  ('00000000-0000-0000-0000-000000000062', 'What is included with my ticket?', 'Every ticket includes admission, your official plant bingo game card and marker, a complimentary welcome drink, and a guaranteed live potted plant to take home!', 2),
  ('00000000-0000-0000-0000-000000000063', 'Can I come alone or do I need a partner?', 'Solo attendees are very welcome! Over 50% of our guests come solo. Our seating and social atmosphere make it super easy to chat, laugh, and make plant-loving friends.', 3),
  ('00000000-0000-0000-0000-000000000064', 'Can I bring my own food or drinks?', 'Outside food and drinks are not allowed, but our host cafes (like HoshiSasa Cafe) have full artisan food, specialty coffee, and snack menus available for purchase.', 4),
  ('00000000-0000-0000-0000-000000000065', 'What happens if I win the bingo round?', 'Full house and line winners get to choose from our grand prize pool of rare and exotic indoor plants, plus exclusive Shrubs merch!', 5),
  ('00000000-0000-0000-0000-000000000066', 'Can I cancel or transfer my booking?', 'Tickets are non-refundable, but you are welcome to transfer your ticket to a friend if you inform us at least 24 hours prior to the session via Instagram or email.', 6),
  ('00000000-0000-0000-0000-000000000067', 'What time should I arrive at the venue?', 'Please arrive 15 minutes before your scheduled start time. This gives you time to check in, grab your welcome drink, select your favorite seats, and get your bingo card ready!', 7)
ON CONFLICT DO NOTHING;

-- Insert Quiz Questions
INSERT INTO quiz_questions (id, question, options, answer_index, sort_order)
VALUES
  ('00000000-0000-0000-0000-000000000071', 'What''s your ideal weekend energy?', '["Netflix, chill, and zero responsibilities", "Hiking, exploring, and being outdoors", "Café hopping and people watching", "DIY projects and redecorating my room"]'::jsonb, 0, 1),
  ('00000000-0000-0000-0000-000000000072', 'How do you handle needy people?', '["I have endless patience for them", "I set very strict boundaries", "I am the needy person", "I just ignore them completely"]'::jsonb, 1, 2),
  ('00000000-0000-0000-0000-000000000073', 'What is your biggest toxic trait?', '["I am incredibly dramatic", "I hold grudges forever", "I need constant attention to thrive", "I push people away when I''m stressed"]'::jsonb, 0, 3)
ON CONFLICT DO NOTHING;

