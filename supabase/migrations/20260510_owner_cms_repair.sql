create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to anon, authenticated;

create or replace function app_private.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and active = true
  );
$$;

grant execute on function app_private.is_admin() to anon, authenticated;

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.complaints add column if not exists updated_at timestamptz not null default now();
update public.complaints set status = 'requested' where status = 'pending';
alter table public.complaints alter column status set default 'requested';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'complaints_status_check'
      and conrelid = 'public.complaints'::regclass
  ) then
    alter table public.complaints
      add constraint complaints_status_check
      check (status in ('requested', 'confirmed', 'cancelled'));
  end if;
end $$;

alter table public.complaints enable row level security;

drop trigger if exists set_complaints_updated_at on public.complaints;
create trigger set_complaints_updated_at
before update on public.complaints
for each row execute function public.set_updated_at();

alter table public.reservations add column if not exists reservation_date date;
alter table public.reservations add column if not exists reservation_time time;
alter table public.reservations add column if not exists phone text;
alter table public.reservations add column if not exists message text;
alter table public.reservations add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reservations'
      and column_name = 'date'
  ) then
    update public.reservations
    set reservation_date = nullif(date::text, '')::date
    where reservation_date is null
      and date::text ~ '^\d{4}-\d{2}-\d{2}$';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'reservations'
      and column_name = 'time'
  ) then
    update public.reservations
    set reservation_time = nullif(time::text, '')::time
    where reservation_time is null
      and time::text ~ '^\d{2}:\d{2}(:\d{2})?$';
  end if;
end $$;

update public.reservations set status = 'requested' where status = 'pending';
alter table public.reservations alter column status set default 'requested';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'reservations_status_check'
      and conrelid = 'public.reservations'::regclass
  ) then
    alter table public.reservations
      add constraint reservations_status_check
      check (status in ('requested', 'confirmed', 'cancelled'));
  end if;
end $$;

alter table public.menu_items enable row level security;
alter table public.reservations enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_users enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.menu_items to anon, authenticated;
grant insert, update, delete on public.menu_items to authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant insert on public.reservations to anon, authenticated;
grant select, update, delete on public.reservations to authenticated;
grant insert on public.complaints to anon, authenticated;
grant select, update, delete on public.complaints to authenticated;
grant select on public.admin_users to authenticated;

drop policy if exists "Public can read active menu items" on public.menu_items;
create policy "Public can read active menu items"
on public.menu_items for select
to anon, authenticated
using (active = true or app_private.is_admin());

drop policy if exists "Admins can insert menu items" on public.menu_items;
create policy "Admins can insert menu items"
on public.menu_items for insert
to authenticated
with check (app_private.is_admin());

drop policy if exists "Admins can update menu items" on public.menu_items;
create policy "Admins can update menu items"
on public.menu_items for update
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

drop policy if exists "Admins can delete menu items" on public.menu_items;
create policy "Admins can delete menu items"
on public.menu_items for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "Public can create reservation requests" on public.reservations;
drop policy if exists "Allow public insert on reservations" on public.reservations;
create policy "Public can create reservation requests"
on public.reservations for insert
to anon, authenticated
with check (status = 'requested');

drop policy if exists "Admins can read reservations" on public.reservations;
create policy "Admins can read reservations"
on public.reservations for select
to authenticated
using (app_private.is_admin());

drop policy if exists "Admins can update reservations" on public.reservations;
create policy "Admins can update reservations"
on public.reservations for update
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

drop policy if exists "Admins can delete reservations" on public.reservations;
create policy "Admins can delete reservations"
on public.reservations for delete
to authenticated
using (app_private.is_admin());

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

drop policy if exists "Admins can update site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings for all
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users for select
to authenticated
using (app_private.is_admin() or user_id = auth.uid());

drop policy if exists "Allow public insert on complaints" on public.complaints;
drop policy if exists "Public can create complaints" on public.complaints;
create policy "Public can create complaints"
on public.complaints for insert
to anon, authenticated
with check (status = 'requested');

drop policy if exists "Admins can read complaints" on public.complaints;
create policy "Admins can read complaints"
on public.complaints for select
to authenticated
using (app_private.is_admin());

drop policy if exists "Admins can update complaints" on public.complaints;
create policy "Admins can update complaints"
on public.complaints for update
to authenticated
using (app_private.is_admin())
with check (app_private.is_admin());

drop policy if exists "Admins can delete complaints" on public.complaints;
create policy "Admins can delete complaints"
on public.complaints for delete
to authenticated
using (app_private.is_admin());

do $$
begin
  if to_regclass('storage.buckets') is not null and to_regclass('storage.objects') is not null then
    execute $sql$
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
          allowed_mime_types = excluded.allowed_mime_types
    $sql$;

    execute 'drop policy if exists "Public can read restaurant media" on storage.objects';
    execute $sql$
      create policy "Public can read restaurant media"
      on storage.objects for select
      to anon, authenticated
      using (bucket_id = 'restaurant-media')
    $sql$;

    execute 'drop policy if exists "Admins can upload restaurant media" on storage.objects';
    execute $sql$
      create policy "Admins can upload restaurant media"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'restaurant-media' and app_private.is_admin())
    $sql$;

    execute 'drop policy if exists "Admins can update restaurant media" on storage.objects';
    execute $sql$
      create policy "Admins can update restaurant media"
      on storage.objects for update
      to authenticated
      using (bucket_id = 'restaurant-media' and app_private.is_admin())
      with check (bucket_id = 'restaurant-media' and app_private.is_admin())
    $sql$;

    execute 'drop policy if exists "Admins can delete restaurant media" on storage.objects';
    execute $sql$
      create policy "Admins can delete restaurant media"
      on storage.objects for delete
      to authenticated
      using (bucket_id = 'restaurant-media' and app_private.is_admin())
    $sql$;
  end if;
end $$;

do $$
begin
  if to_regprocedure('public.is_admin()') is not null then
    revoke execute on function public.is_admin() from anon, authenticated;
  end if;
end $$;

drop function if exists public.is_admin();
