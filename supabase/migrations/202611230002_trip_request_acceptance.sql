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
   where r.id = request_id
   for update of r, t;

  if not found then
    raise exception 'Richiesta non trovata';
  end if;

  if request_row.driver_id <> auth.uid() then
    raise exception 'Non autorizzato';
  end if;

  if request_row.status <> 'pending' then
    raise exception 'La richiesta non è più pendente';
  end if;

  if request_row.seats_available < request_row.seats then
    raise exception 'Posti non disponibili';
  end if;

  update public.trip_requests
     set status = 'accepted'
   where id = request_row.id;

  update public.trips
     set seats_available = seats_available - request_row.seats
   where id = request_row.trip_id;

  select c.id into conversation_id
    from public.conversations c
   where c.trip_id = request_row.trip_id
     and c.participant_ids @> array[request_row.driver_id, request_row.passenger_id]::uuid[]
   limit 1;

  if conversation_id is null then
    insert into public.conversations(trip_id, participant_ids)
    values (request_row.trip_id, array[request_row.driver_id, request_row.passenger_id]::uuid[])
    returning id into conversation_id;
  end if;

  return conversation_id;
end;
$$;

grant execute on function public.accept_trip_request(uuid) to authenticated;