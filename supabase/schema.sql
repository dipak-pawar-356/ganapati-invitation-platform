-- Run this in Neon Database SQL Console / PostgreSQL client--

create extension if not exists "pgcrypto";

create table if not exists mandals (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  mandal_name text not null,
  language text not null default 'mr',              -- 'mr' | 'hi' | 'en'
  invite_message text not null,
  established_year text,
  contact text not null,
  address text not null,
  map_embed_url text,
  maps_link text,
  instagram_url text,
  timeline jsonb not null default '[]',              -- [{title, summary, date, time, place}]
  gallery jsonb not null default '[]',                -- [{url, caption}]
  murti_photos jsonb not null default '[]',           -- [url, url, ...]
  music_url text,
  status text not null default 'pending',             -- 'pending' | 'approved' | 'rejected'
  created_at timestamptz not null default now()
);

create index if not exists mandals_slug_idx on mandals (slug);
create index if not exists mandals_status_idx on mandals (status);

alter table mandals enable row level security;

-- Anyone can submit a new invitation request (status defaults to pending)
create policy "public can insert" on mandals
  for insert to anon
  with check (status = 'pending');

-- Anyone can view an APPROVED invitation (this is what the live page reads)
create policy "public can read approved" on mandals
  for select to anon
  using (status = 'approved');

-- Only the service role (used server-side in the admin panel) can update/delete/see everything.
-- No policy needed for service_role — it bypasses RLS by default.

-- ===== STORAGE =====
-- Create a public bucket named "mandal-photos" from the Supabase dashboard
-- (Storage → New bucket → name: mandal-photos → Public bucket: ON)
-- Then allow anonymous uploads for the submission form:

insert into storage.buckets (id, name, public)
values ('mandal-photos', 'mandal-photos', true)
on conflict (id) do nothing;

create policy "public can upload photos" on storage.objects
  for insert to anon
  with check (bucket_id = 'mandal-photos');

create policy "public can view photos" on storage.objects
  for select to anon
  using (bucket_id = 'mandal-photos');
