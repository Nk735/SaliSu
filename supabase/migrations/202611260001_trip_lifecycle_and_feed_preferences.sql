alter table public.profiles
  add column if not exists show_only_starting_zone boolean not null default true,
  add column if not exists additional_starting_zone text;

alter table public.conversations
  add column if not exists archived_at timestamptz;

create or replace function public.archive_completed_trip_conversations()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'completed' and old.status is distinct from new.status then
    update public.conversations
       set archived_at = coalesce(archived_at, now())
     where trip_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists archive_completed_trip_conversations on public.trips;
create trigger archive_completed_trip_conversations
after update of status on public.trips
for each row
execute function public.archive_completed_trip_conversations();

update public.conversations c
   set archived_at = coalesce(c.archived_at, now())
  from public.trips t
 where c.trip_id = t.id
   and t.status = 'completed';

drop policy if exists "messages sender" on public.messages;
create policy "messages sender"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1
        from public.conversations c
       where c.id = conversation_id
         and auth.uid() = any(c.participant_ids)
         and c.archived_at is null
    )
  );

create or replace function public.complete_expired_trips()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  completed_count integer;
begin
  update public.trips
     set status = 'completed'
   where status = 'active'
     and greatest(departure_at, coalesce(return_departure_at, departure_at)) <= now() - interval '24 hours';

  get diagnostics completed_count = row_count;
  return completed_count;
end;
$$;

revoke all on function public.complete_expired_trips() from public, anon, authenticated;
grant execute on function public.complete_expired_trips() to service_role;
