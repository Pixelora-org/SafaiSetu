-- SafaiSetu Phase 0 schema
create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated, anon;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

grant execute on function private.is_admin() to authenticated, anon;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  city text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create table public.organizations (
  id text primary key,
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  city text,
  coverage text[] not null default '{}',
  website text,
  how_to_join text,
  verified boolean not null default false,
  category text not null default 'ngo'
);

alter table public.organizations enable row level security;

create policy "orgs_select_public"
  on public.organizations for select
  using (true);

create policy "orgs_admin_write"
  on public.organizations for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create table public.spots (
  id text primary key,
  name text not null,
  name_hi text,
  category text not null,
  status text not null,
  source text not null,
  lat double precision not null,
  lng double precision not null,
  state text not null,
  city text,
  description text,
  cpcb_priority smallint,
  source_citation jsonb not null default '{}'::jsonb,
  photo_url text,
  updated_at timestamptz not null default now(),
  feed_item_id text,
  created_by uuid references public.profiles (id)
);

create index spots_geo_idx on public.spots (lat, lng);
create index spots_category_idx on public.spots (category);
create index spots_status_idx on public.spots (status);
create index spots_source_idx on public.spots (source);
create index spots_state_idx on public.spots (state);

alter table public.spots enable row level security;

create policy "spots_select_public"
  on public.spots for select
  using (true);

create policy "spots_admin_write"
  on public.spots for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  display_name text,
  category text not null,
  status text not null,
  lat double precision not null,
  lng double precision not null,
  city text,
  story text not null default '',
  media_type text not null,
  media_path text not null,
  moderation_status text not null default 'pending',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  spot_id text references public.spots (id)
);

create index submissions_moderation_idx on public.submissions (moderation_status, created_at desc);
create index submissions_user_idx on public.submissions (user_id, created_at desc);

alter table public.submissions enable row level security;

create policy "submissions_select_own_or_admin"
  on public.submissions for select
  to authenticated
  using ((select auth.uid()) = user_id or private.is_admin());

create policy "submissions_select_approved_public"
  on public.submissions for select
  using (moderation_status = 'approved');

create policy "submissions_insert_own"
  on public.submissions for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and moderation_status = 'pending'
  );

create policy "submissions_admin_update"
  on public.submissions for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create table public.feed_items (
  id text primary key,
  kind text not null,
  title text not null,
  story text,
  place text,
  state text,
  source_label text,
  youtube_video_id text,
  embed_url text,
  image_url text,
  spot_id text references public.spots (id),
  org_slug text,
  published_at timestamptz not null default now(),
  featured boolean not null default false,
  published boolean not null default true,
  submission_id uuid references public.submissions (id)
);

alter table public.feed_items enable row level security;

create policy "feed_select_published"
  on public.feed_items for select
  using (published = true);

create policy "feed_admin_write"
  on public.feed_items for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create table public.events (
  id text primary key,
  title text not null,
  org_slug text,
  org_name text,
  starts_at timestamptz not null,
  city text,
  state text,
  lat double precision,
  lng double precision,
  what_to_bring text,
  confirm_note text,
  website text
);

alter table public.events enable row level security;

create policy "events_select_public"
  on public.events for select
  using (true);

create policy "events_admin_write"
  on public.events for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create table public.stats (
  key text primary key,
  label text not null,
  value numeric not null,
  as_of date,
  source_name text not null,
  source_url text not null,
  notes text,
  live boolean not null default false
);

alter table public.stats enable row level security;

create policy "stats_select_public"
  on public.stats for select
  using (true);

create policy "stats_admin_write"
  on public.stats for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

insert into storage.buckets (id, name, public)
values
  ('submissions', 'submissions', false),
  ('feed-media', 'feed-media', true)
on conflict (id) do nothing;

create policy "submissions_upload_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'submissions'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "submissions_select_own_or_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'submissions'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or private.is_admin()
    )
  );

create policy "feed_media_public_read"
  on storage.objects for select
  using (bucket_id = 'feed-media');

create policy "feed_media_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'feed-media' and private.is_admin());

create policy "feed_media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'feed-media' and private.is_admin())
  with check (bucket_id = 'feed-media' and private.is_admin());
