create extension if not exists "pgcrypto";

create type destination_name as enum ('Bari Centro','Lungomare');
create type fuel_type_name as enum ('benzina','diesel','gpl','metano','elettrico');
create type trip_type as enum ('offer','request');
create type trip_status as enum ('active','cancelled','completed');
create type request_status as enum ('pending','accepted','declined','completed','cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_destination destination_name,
  starting_zone text,
  maps_label text,
  maps_url text,
  fuel_type fuel_type_name,
  consumption_km_l numeric(5,2),
  onboarding_completed boolean not null default false,
  theme text not null default 'light',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.profiles(id) on delete cascade,
  type trip_type not null,
  origin_zone text not null,
  destination destination_name not null,
  departure_at timestamptz not null,
  seats_available integer not null default 1,
  price_per_passenger numeric(8,2) not null default 0,
  fuel_type fuel_type_name,
  distance_km numeric(6,2),
  note text,
  maps_label text,
  maps_url text,
  status trip_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.trip_requests (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  passenger_id uuid not null references public.profiles(id) on delete cascade,
  status request_status not null default 'pending',
  seats integer not null default 1,
  created_at timestamptz not null default now(),
  unique(trip_id,passenger_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete set null,
  participant_ids uuid[] not null,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text,
  maps_url text,
  maps_label text,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  favorite_user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,favorite_user_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  trip_request_id uuid not null unique references public.trip_requests(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check(rating between 1 and 5),
  tags text[] not null default '{}',
  comment text,
  created_at timestamptz not null default now()
);

create table public.fuel_prices (
  fuel_type fuel_type_name primary key,
  price numeric(8,3) not null,
  region text not null default 'Puglia',
  updated_at timestamptz not null default now()
);

insert into public.fuel_prices(fuel_type,price) values
('benzina',1.820),('diesel',1.690),('gpl',0.740),('metano',1.450),('elettrico',0.310)
on conflict(fuel_type) do nothing;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,full_name,onboarding_completed)
  values (new.id,coalesce(new.raw_user_meta_data->>'full_name',''),false)
  on conflict(id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;

create policy "profiles readable" on public.profiles for select using (true);
create policy "profiles own update" on public.profiles for update using (auth.uid()=id);
create policy "profiles own insert" on public.profiles for insert with check (auth.uid()=id);

create policy "trips readable" on public.trips for select using (true);
create policy "trips own write" on public.trips for all using (auth.uid()=driver_id) with check (auth.uid()=driver_id);

create policy "requests readable" on public.trip_requests for select using (auth.uid()=passenger_id or auth.uid()=(select driver_id from public.trips where id=trip_id));
create policy "requests create" on public.trip_requests for insert with check (auth.uid()=passenger_id);
create policy "requests update" on public.trip_requests for update using (auth.uid()=passenger_id or auth.uid()=(select driver_id from public.trips where id=trip_id));

create policy "conversations participant" on public.conversations for select using (auth.uid()=any(participant_ids));
create policy "messages participant" on public.messages for select using (exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid()=any(c.participant_ids)));
create policy "messages sender" on public.messages for insert with check (auth.uid()=sender_id and exists(select 1 from public.conversations c where c.id=conversation_id and auth.uid()=any(c.participant_ids)));

create policy "favorites own" on public.favorites for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "reviews readable" on public.reviews for select using (true);
create policy "reviews accepted request only" on public.reviews for insert with check (
  auth.uid()=reviewer_id and exists (
    select 1 from public.trip_requests r
    where r.id=trip_request_id and r.passenger_id=auth.uid()
      and r.status in ('accepted','completed')
  )
);

alter publication supabase_realtime add table public.messages, public.trip_requests;
