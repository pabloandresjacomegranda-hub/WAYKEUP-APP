/*
# Add background alarm delivery

1. New tables
- `push_subscriptions` stores one browser or phone notification subscription per device, owned by the signed-in user.
- `alarm_push_deliveries` records each alarm occurrence that has already been claimed so a scheduled retry cannot send duplicates.
- `push_config` stores server-only Web Push credentials and the scheduler token; it is never readable or writable by browser roles.

2. Security
- Enable row-level security on all new tables.
- Allow signed-in users to manage only their own push subscriptions.
- Do not expose delivery records or push credentials to browser roles.
- The service role used by the background sender can read the private configuration and delivery state.

3. Important notes
- The browser never receives the private Web Push key or scheduler token.
- The endpoint is unique so refreshing or reopening the app updates one device subscription instead of creating duplicates.
*/

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  timezone text NOT NULL DEFAULT 'UTC',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.alarm_push_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alarm_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occurrence_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (alarm_id, occurrence_key)
);

CREATE TABLE IF NOT EXISTS public.push_config (
  id integer PRIMARY KEY CHECK (id = 1),
  vapid_public_key text NOT NULL,
  vapid_private_key text NOT NULL,
  cron_token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alarm_push_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "select_own_push_subscriptions" ON public.push_subscriptions FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "insert_own_push_subscriptions" ON public.push_subscriptions FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "update_own_push_subscriptions" ON public.push_subscriptions FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_push_subscriptions" ON public.push_subscriptions;
CREATE POLICY "delete_own_push_subscriptions" ON public.push_subscriptions FOR DELETE
TO authenticated USING (auth.uid() = user_id);

REVOKE ALL ON public.alarm_push_deliveries FROM anon, authenticated;
REVOKE ALL ON public.push_config FROM anon, authenticated;

INSERT INTO public.push_config (id, vapid_public_key, vapid_private_key, cron_token)
VALUES (
  1,
  'BBcru2PJdwihW2gqU809KvHyO-qW4WmACT2NiB5TF7Ius5rd0RpVqFQ59HG1WGhAgGIpAkxpcBldEfMVu1OBap4',
  'MIGHAgEAMBMGByqGSM49AwEHBG0wawIBAQQgHOox8BiOS1z-0duY-ZQ2PqWNfokFmUVcN40rWl2dwgChRANCAAQXK7tjyXcIoVtoKlPNPSrx8jvqluFpgAk9jYgeUxeyLrOa3dEaVahUOfRxtVhoQIBiKQJMaXAZXRHzFbtTgWqe',
  'S5HME3fSUZonQyIcv801GU32c0XUHd1XIHvAlLt1W4g'
)
ON CONFLICT (id) DO NOTHING;