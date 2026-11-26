create extension if not exists pg_cron;

select cron.schedule(
  'complete-expired-trips-hourly',
  '0 * * * *',
  'select public.complete_expired_trips();'
);
