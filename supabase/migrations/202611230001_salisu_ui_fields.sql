alter table public.profiles
  add column if not exists car_info text;

create or replace function public.get_active_route_nodes()
returns table(starting_zone text, destination text, users_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.starting_zone,
    p.preferred_destination::text as destination,
    count(*)::bigint as users_count
  from public.profiles p
  where p.onboarding_completed
    and p.starting_zone is not null
    and p.preferred_destination is not null
  group by p.starting_zone, p.preferred_destination;
$$;

grant execute on function public.get_active_route_nodes() to authenticated;
