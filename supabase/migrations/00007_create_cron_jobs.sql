-- Enable pg_cron extension (requires Supabase dashboard or superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Expire active ideas every 5 minutes
SELECT cron.schedule(
  'expire-ideas',
  '*/5 * * * *',
  $$SELECT public.expire_ideas();$$
);

-- Note: Score recalculation is handled by a Supabase Edge Function
-- triggered via pg_cron + pg_net. Configure in Supabase dashboard:
--
-- Schedule: */10 * * * *
-- URL: https://<project-ref>.supabase.co/functions/v1/calculate-scores
-- Method: POST
-- Headers: Authorization: Bearer <service-role-key>
