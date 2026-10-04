-- SACTORIA FASHION INSTITUTE — Supabase schema
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run

-- 1. CATALOGUE ITEMS -----------------------------------------------------
create table if not exists public.catalogue_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(12,2) not null default 0,
  category text not null default 'Uncategorised',
  image_url text,
  whatsapp_message text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalogue_items_category_idx on public.catalogue_items (category);
create index if not exists catalogue_items_visible_idx on public.catalogue_items (is_visible);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_catalogue_items_updated_at on public.catalogue_items;
create trigger trg_catalogue_items_updated_at
before update on public.catalogue_items
for each row execute procedure public.set_updated_at();

alter table public.catalogue_items enable row level security;

drop policy if exists "Public can view visible items" on public.catalogue_items;
create policy "Public can view visible items"
  on public.catalogue_items for select
  to anon
  using (is_visible = true);

drop policy if exists "Admins can view all items" on public.catalogue_items;
create policy "Admins can view all items"
  on public.catalogue_items for select
  to authenticated
  using (true);

drop policy if exists "Admins can insert items" on public.catalogue_items;
create policy "Admins can insert items"
  on public.catalogue_items for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update items" on public.catalogue_items;
create policy "Admins can update items"
  on public.catalogue_items for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete items" on public.catalogue_items;
create policy "Admins can delete items"
  on public.catalogue_items for delete
  to authenticated
  using (true);

-- 2. SITE SETTINGS (single editable row) ---------------------------------
create table if not exists public.site_settings (
  id int primary key default 1,
  institute_name text not null default 'SACTORIA FASHION INSTITUTE',
  tagline text not null default 'Learn. Create. Design. Become.',
  logo_url text,
  phone text default '',
  whatsapp_number text default '',
  email text default '',
  address text default '',
  instagram_url text default '',
  facebook_url text default '',
  tiktok_url text default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1)
  on conflict (id) do nothing;

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute procedure public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public can view settings" on public.site_settings;
create policy "Public can view settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can update settings" on public.site_settings;
create policy "Admins can update settings"
  on public.site_settings for update
  to authenticated
  using (true)
  with check (true);

-- 3. STORAGE BUCKET FOR CATALOGUE IMAGES ---------------------------------
insert into storage.buckets (id, name, public)
values ('catalogue-images', 'catalogue-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view catalogue images" on storage.objects;
create policy "Public can view catalogue images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'catalogue-images');

drop policy if exists "Admins can upload catalogue images" on storage.objects;
create policy "Admins can upload catalogue images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'catalogue-images');

drop policy if exists "Admins can update catalogue images" on storage.objects;
create policy "Admins can update catalogue images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'catalogue-images')
  with check (bucket_id = 'catalogue-images');

drop policy if exists "Admins can delete catalogue images" on storage.objects;
create policy "Admins can delete catalogue images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'catalogue-images');
