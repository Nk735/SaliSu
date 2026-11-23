create or replace function public.request_trip_seat(trip_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  trip_row record;
  conversation_id uuid;
begin
  select id, driver_id, seats_available, status
    into trip_row
    from public.trips
   where id = $1
   for update;

  if not found then raise exception 'Tragitto non trovato'; end if;
  if trip_row.driver_id = auth.uid() then raise exception 'Non puoi prenotare il tuo tragitto'; end if;
  if trip_row.status <> 'active' then raise exception 'Tragitto non disponibile'; end if;
  if trip_row.seats_available < 1 then raise exception 'Non ci sono posti disponibili'; end if;

  insert into public.trip_requests(trip_id, passenger_id, status, seats)
  values ($1, auth.uid(), 'pending', 1)
  on conflict(trip_id, passenger_id) do update
     set status = 'pending', seats = 1
   where public.trip_requests.status = 'declined' or public.trip_requests.status = 'cancelled';

  select id into conversation_id
    from public.conversations
   where trip_id = $1
     and participant_ids @> array[trip_row.driver_id, auth.uid()]::uuid[]
   limit 1;

  if conversation_id is null then
    insert into public.conversations(trip_id, participant_ids)
    values ($1, array[trip_row.driver_id, auth.uid()]::uuid[])
    returning id into conversation_id;
  end if;

  return conversation_id;
end;
$$;

create or replace function public.accept_trip_request(request_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  request_row record;
  conversation_id uuid;
begin
  select r.id, r.trip_id, r.passenger_id, r.seats, r.status,
         t.driver_id, t.seats_available
    into request_row
    from public.trip_requests r
    join public.trips t on t.id = r.trip_id
   where r.id = $1
   for update of r, t;

  if not found then raise exception 'Richiesta non trovata'; end if;
  if request_row.driver_id <> auth.uid() then raise exception 'Non autorizzato'; end if;
  if request_row.status <> 'pending' then raise exception 'La richiesta non è più in attesa'; end if;
  if request_row.seats_available < request_row.seats then raise exception 'Posti non disponibili'; end if;

  update public.trip_requests set status = 'accepted' where id = request_row.id;
  update public.trips
     set seats_available = seats_available - request_row.seats
   where id = request_row.trip_id;

  select id into conversation_id
    from public.conversations
   where trip_id = request_row.trip_id
     and participant_ids @> array[request_row.driver_id, request_row.passenger_id]::uuid[]
   limit 1;

  if conversation_id is null then
    insert into public.conversations(trip_id, participant_ids)
    values (request_row.trip_id, array[request_row.driver_id, request_row.passenger_id]::uuid[])
    returning id into conversation_id;
  end if;

  return conversation_id;
end;
$$;

create or replace function public.update_trip_request(request_id uuid, next_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  request_row record;
begin
  select r.id, r.trip_id, r.passenger_id, r.status, t.driver_id
    into request_row
    from public.trip_requests r
    join public.trips t on t.id = r.trip_id
   where r.id = $1
   for update of r;

  if not found then raise exception 'Richiesta non trovata'; end if;
  if next_status = 'cancelled' and request_row.passenger_id <> auth.uid() then raise exception 'Non autorizzato'; end if;
  if next_status = 'declined' and request_row.driver_id <> auth.uid() then raise exception 'Non autorizzato'; end if;
  if next_status not in ('declined','cancelled') then raise exception 'Stato non valido'; end if;
  if request_row.status <> 'pending' then raise exception 'La richiesta non è più in attesa'; end if;

  update public.trip_requests set status = next_status where id = request_row.id;
end;
$$;

grant execute on function public.request_trip_seat(uuid) to authenticated;
grant execute on function public.accept_trip_request(uuid) to authenticated;
grant execute on function public.update_trip_request(uuid,text) to authenticated;
