/*
# Disable background Web Push delivery

1. Platform changes
- Unschedule the recurring `waykeup-alarm-push` job so the project no longer sends background Web Push notifications.

2. Data safety
- No alarm rows, user rows, subscriptions, delivery records, or configuration values are deleted.
- Existing push-related tables remain intact so this change does not destroy stored data.

3. Important notes
- The application no longer registers Web Push subscriptions or displays push controls.
- Local alarm behavior remains separate from Web Push delivery.
*/

SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname = 'waykeup-alarm-push';
