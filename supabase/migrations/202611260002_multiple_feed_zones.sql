alter table public.profiles
  add column if not exists additional_starting_zones text[] not null default '{}'::text[];

update public.profiles
   set additional_starting_zones = array[additional_starting_zone]
 where additional_starting_zone is not null
   and cardinality(additional_starting_zones) = 0;
