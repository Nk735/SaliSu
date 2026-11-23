create type public.car_invite_status as enum ('pending','accepted','declined');

create table public.car_invites (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  status public.car_invite_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(trip_id, inviter_id),
  check (inviter_id <> requester_id)
);

alter table public.reviews alter column trip_request_id drop not null;
alter table public.reviews add column if not exists car_invite_id uuid references public.car_invites(id) on delete cascade;
alter table public.reviews add constraint reviews_one_trip_source check ((trip_request_id is not null) <> (car_invite_id is not null));
create unique index if not exists reviews_car_invite_unique on public.reviews(car_invite_id) where car_invite_id is not null;

alter table public.car_invites enable row level security;
create policy "car invites participants readable" on public.car_invites for select
  using (auth.uid()=inviter_id or auth.uid()=requester_id);

create or replace function public.create_car_invite(p_trip_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  trip_row record;
  existing_invite public.car_invites%rowtype;
  conversation_id uuid;
begin
  select id, driver_id, type, status into trip_row
    from public.trips where id=p_trip_id for update;
  if not found then raise exception 'Richiesta non trovata'; end if;
  if trip_row.type <> 'request' then raise exception 'Questo annuncio offre già un passaggio'; end if;
  if trip_row.status <> 'active' then raise exception 'Richiesta non più disponibile'; end if;
  if trip_row.driver_id = auth.uid() then raise exception 'Non puoi invitare te stesso'; end if;

  select * into existing_invite from public.car_invites
   where trip_id=p_trip_id and inviter_id=auth.uid() for update;
  if found and existing_invite.status in ('pending','accepted') then
    select id into conversation_id from public.conversations
     where trip_id=p_trip_id and participant_ids @> array[auth.uid(),trip_row.driver_id]::uuid[] limit 1;
    return conversation_id;
  end if;

  insert into public.car_invites(trip_id,inviter_id,requester_id,status)
    values(p_trip_id,auth.uid(),trip_row.driver_id,'pending')
    on conflict(trip_id,inviter_id) do update set status='pending',updated_at=now();

  select id into conversation_id from public.conversations
   where trip_id=p_trip_id and participant_ids @> array[auth.uid(),trip_row.driver_id]::uuid[] limit 1;
  if conversation_id is null then
    insert into public.conversations(trip_id,participant_ids)
      values(p_trip_id,array[auth.uid(),trip_row.driver_id]::uuid[])
      returning id into conversation_id;
  end if;
  return conversation_id;
end;
$$;

create or replace function public.respond_to_car_invite(p_invite_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare invite_row public.car_invites%rowtype;
begin
  select * into invite_row from public.car_invites where id=p_invite_id for update;
  if not found then raise exception 'Invito non trovato'; end if;
  if invite_row.requester_id <> auth.uid() then raise exception 'Non autorizzato'; end if;
  if invite_row.status <> 'pending' then raise exception 'Invito già gestito'; end if;
  if p_status not in ('accepted','declined') then raise exception 'Stato non valido'; end if;
  update public.car_invites set status=p_status::public.car_invite_status,updated_at=now() where id=p_invite_id;
  if p_status='accepted' then
    update public.trips set status='completed' where id=invite_row.trip_id and type='request';
  end if;
end;
$$;

drop policy if exists "reviews accepted request only" on public.reviews;
create policy "reviews accepted trip only" on public.reviews for insert with check (
  auth.uid()=reviewer_id and (
    exists (select 1 from public.trip_requests r where r.id=trip_request_id and r.passenger_id=auth.uid() and r.status in ('accepted','completed'))
    or exists (select 1 from public.car_invites i where i.id=car_invite_id and i.requester_id=auth.uid() and i.status='accepted')
  )
);

create policy "reviews own update" on public.reviews for update
  using (auth.uid()=reviewer_id) with check (auth.uid()=reviewer_id);

grant execute on function public.create_car_invite(uuid) to authenticated;
grant execute on function public.respond_to_car_invite(uuid,text) to authenticated;