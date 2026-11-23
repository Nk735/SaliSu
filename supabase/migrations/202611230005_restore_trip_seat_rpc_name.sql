drop function if exists public.request_trip_seat(uuid);

create function public.request_trip_seat(trip_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  trip_row record;
  conversation_id uuid;
begin
  select t.id, t.driver_id, t.seats_available, t.status
    into trip_row
    from public.trips t
   where t.id = $1
   for update of t;

  if not found then raise exception 'Tragitto non trovato'; end if;
  if trip_row.driver_id = auth.uid() then raise exception 'Non puoi prenotare il tuo tragitto'; end if;
  if trip_row.status <> 'active' then raise exception 'Tragitto non disponibile'; end if;
  if trip_row.seats_available < 1 then raise exception 'Non ci sono posti disponibili'; end if;

  insert into public.trip_requests(trip_id, passenger_id, status, seats)
  values ($1, auth.uid(), 'pending', 1)
  on conflict(trip_id, passenger_id) do update
     set status = 'pending', seats = 1
   where public.trip_requests.status in ('declined','cancelled');

  select c.id into conversation_id
    from public.conversations c
   where c.trip_id = $1
     and c.participant_ids @> array[trip_row.driver_id, auth.uid()]::uuid[]
   limit 1;

  if conversation_id is null then
    insert into public.conversations(trip_id, participant_ids)
    values ($1, array[trip_row.driver_id, auth.uid()]::uuid[])
    returning id into conversation_id;
  end if;

  return conversation_id;
end;
$$;

grant execute on function public.request_trip_seat(uuid) to authenticated;

notify pgrst, 'reload schema';
