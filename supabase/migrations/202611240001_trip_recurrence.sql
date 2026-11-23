alter table public.trips
  add column if not exists direction text not null default 'Sola andata',
  add column if not exists return_departure_at timestamptz,
  add column if not exists is_recurring boolean not null default false,
  add column if not exists recurrence_days integer[],
  add column if not exists recurrence_until date,
  add column if not exists recurrence_group_id uuid;
