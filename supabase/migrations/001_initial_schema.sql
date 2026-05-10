create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and active = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price_nok integer not null check (price_nok >= 0),
  category text not null default 'Menu',
  image_path text,
  image_alt text,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_date date not null,
  reservation_time time not null,
  party_size integer not null check (party_size between 1 and 20),
  name text not null,
  email text not null,
  phone text not null,
  message text,
  status text not null default 'requested' check (status in ('requested', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'main' check (id = 'main'),
  hero_headline text not null default 'Pasha International Food & Bar',
  hero_subcopy text not null default 'A luxurious culinary journey in Bergen.',
  foodora_url text not null default 'https://www.foodora.no/',
  opening_hours text not null default 'Daily 12:00-22:00',
  hero_image_path text default '/images/polloalaparrila.jpg',
  og_image_path text default '/images/polloalaparrila.jpg',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.menu_items enable row level security;
alter table public.reservations enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read active menu items" on public.menu_items;
create policy "Public can read active menu items"
on public.menu_items for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "Admins can insert menu items" on public.menu_items;
create policy "Admins can insert menu items"
on public.menu_items for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update menu items" on public.menu_items;
create policy "Admins can update menu items"
on public.menu_items for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete menu items" on public.menu_items;
create policy "Admins can delete menu items"
on public.menu_items for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can create reservation requests" on public.reservations;
create policy "Public can create reservation requests"
on public.reservations for insert
to anon, authenticated
with check (status = 'requested');

drop policy if exists "Admins can read reservations" on public.reservations;
create policy "Admins can read reservations"
on public.reservations for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can update reservations" on public.reservations;
create policy "Admins can update reservations"
on public.reservations for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete reservations" on public.reservations;
create policy "Admins can delete reservations"
on public.reservations for delete
to authenticated
using (public.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
on public.site_settings for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users for select
to authenticated
using (public.is_admin() or user_id = auth.uid());

insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;

insert into public.menu_items
  (name, slug, description, price_nok, category, image_path, image_alt, featured, active, sort_order)
values
  ('Pollo a la parrilla', 'pollo-a-la-parrilla', 'Char-grilled chicken with rice, crisp potatoes, salad, and house vinaigrette.', 219, 'Grill', '/images/polloalaparrila.jpg', 'Grilled chicken plate with rice, potatoes, and salad', true, true, 10),
  ('Peruvian lomo saltado', 'peruvian-lomo-saltado', 'A hot pan classic with tender beef, vegetables, potatoes, rice, and bright Peruvian flavor.', 239, 'Peruvian', '/images/lomosaltado.jpg', 'Peruvian lomo saltado served with rice and potatoes', true, true, 20),
  ('Peruvian empanadas', 'peruvian-empanadas', 'Golden pastry with a savory filling, served as a weekend favorite when available.', 89, 'Specials', '/images/empanadas.jpg', 'Freshly baked Peruvian empanadas on a plate', true, true, 30),
  ('Single empanada', 'single-empanada', 'A warm pastry for the table, crisp outside and deeply seasoned inside.', 49, 'Small plates', '/images/empanada.jpg', 'Single golden empanada with garnish', false, true, 40),
  ('Torta tres leches', 'torta-tres-leches', 'Soft milk cake with a delicate finish for a calm, sweet close to dinner.', 95, 'Dessert', '/images/torta3leches.jpg', 'Slice of torta tres leches dessert', false, true, 50)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'restaurant-media',
  'restaurant-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read restaurant media" on storage.objects;
create policy "Public can read restaurant media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'restaurant-media');

drop policy if exists "Admins can upload restaurant media" on storage.objects;
create policy "Admins can upload restaurant media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'restaurant-media' and public.is_admin());

drop policy if exists "Admins can update restaurant media" on storage.objects;
create policy "Admins can update restaurant media"
on storage.objects for update
to authenticated
using (bucket_id = 'restaurant-media' and public.is_admin())
with check (bucket_id = 'restaurant-media' and public.is_admin());

drop policy if exists "Admins can delete restaurant media" on storage.objects;
create policy "Admins can delete restaurant media"
on storage.objects for delete
to authenticated
using (bucket_id = 'restaurant-media' and public.is_admin());
