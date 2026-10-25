/*
# Schedule background alarm delivery

1. Platform changes
- Enable Supabase's `pg_cron` scheduler and `pg_net` HTTP client.
- Run the alarm push sender once per minute.

2. Security
- The scheduled request includes a private token checked by the Edge Function.
- The browser never calls the scheduler directly.

3. Important notes
- The sender claims each alarm occurrence atomically before delivering it, preventing duplicate notifications if a scheduler retry occurs.
- Existing schedules with the same name are removed before creating the current schedule.
*/

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'waykeup-alarm-push';

SELECT cron.schedule(
  'waykeup-alarm-push',
  '* * * * *',
  $$
    SELECT net.http_post(
      url := 'https://atkwebsbugouftzanmdv.supabase.co/functions/v1/send-alarm-push',
      headers := '{"Content-Type":"application/json","X-Cron-Token":"S5HME3fSUZonQyIcv801GU32c0XUHd1XIHvAlLt1W4g"}'::jsonb,
      body := '{}'::jsonb
    );
  $$
);