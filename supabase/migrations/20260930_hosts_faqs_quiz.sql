-- Migration: Add hosts, faqs, quiz questions and image_url to plants
-- Date: 2026-09-30

-- Add image_url directly to plants table for simplified media management
alter table plants add column if not exists image_url text;

-- Create hosts table
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

-- Create FAQs table
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create Quiz Questions table
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

-- Row Level Security (RLS) policies
alter table hosts enable row level security;
alter table faqs enable row level security;
alter table quiz_questions enable row level security;

-- Public read access
create policy "Allow public read hosts" on hosts for select using (is_active = true);
create policy "Allow public read faqs" on faqs for select using (is_active = true);
create policy "Allow public read quiz_questions" on quiz_questions for select using (is_active = true);

-- Authenticated/service_role full access
create policy "Allow full access for authenticated hosts" on hosts for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow full access for authenticated faqs" on faqs for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
create policy "Allow full access for authenticated quiz_questions" on quiz_questions for all using (auth.role() = 'authenticated' or auth.role() = 'service_role');
