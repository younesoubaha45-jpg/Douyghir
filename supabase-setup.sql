-- ════════════════════════════════════════════
-- Douyghir Village Website — Supabase Setup
-- ════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Site settings ──────────────────────────
create table if not exists site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

insert into site_settings (key, value) values
  ('site', '{"title":{"ar":"دويغير","zgh":"ⴷⵓⵢⵖⵉⵔ","en":"Douyghir"},"subtitle":{"ar":"قرية تحفظ ذاكرتها","en":"A village preserving its memory","zgh":""},"footer":{"ar":"موقع توثيقي لقرية دويغير","en":"Documentation website for Douyghir","zgh":""},"hero":"","logo":"","colors":{"clay":"#c4522a","indigo":"#1a3a6b","gold":"#c49a3c","bg":"#faf8f5"}}'::jsonb),
  ('people', '[]'::jsonb),
  ('institutions', '[]'::jsonb),
  ('history', '[]'::jsonb),
  ('gallery', '[]'::jsonb),
  ('lifestyle', '[]'::jsonb)
on conflict (key) do nothing;

-- ── Comments ───────────────────────────────
create table if not exists comments (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  msg text not null,
  date text not null,
  ts bigint not null,
  created_at timestamptz default now()
);

-- ── Media storage ──────────────────────────
-- We'll use Supabase Storage for images
insert into storage.buckets (id, name, public)
values ('douyghir-media', 'douyghir-media', true)
on conflict (id) do nothing;

-- ── RLS Policies ───────────────────────────
-- Site settings: anyone reads, only service role writes
alter table site_settings enable row level security;
create policy "Public read site_settings" on site_settings
  for select using (true);
create policy "Service write site_settings" on site_settings
  for all using (auth.role() = 'service_role');

-- Comments: anyone reads and inserts
alter table comments enable row level security;
create policy "Public read comments" on comments
  for select using (true);
create policy "Public insert comments" on comments
  for insert with check (true);
create policy "Service delete comments" on comments
  for delete using (auth.role() = 'service_role');

-- Storage policy
create policy "Public read media" on storage.objects
  for select using (bucket_id = 'douyghir-media');
create policy "Service write media" on storage.objects
  for insert using (bucket_id = 'douyghir-media');

