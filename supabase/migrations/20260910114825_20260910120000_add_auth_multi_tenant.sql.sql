/*
# Convert to multi-tenant with authentication

1. Modified Tables
- `alarms` — add `user_id uuid NOT NULL DEFAULT auth.uid()`
- `app_settings` — add `user_id uuid NOT NULL DEFAULT auth.uid()`
- `focus_sessions` — add `user_id uuid NOT NULL DEFAULT auth.uid()`

2. Security
- Replace all anon+authenticated permissive policies with authenticated-only, owner-scoped policies
- Each table gets 4 policies scoped to auth.uid() = user_id

3. Important Notes
- App now requires sign-in
- Existing data preserved with placeholder user_id (inaccessible without auth)
- DEFAULT auth.uid() ensures new inserts work without client passing user_id
- No FK constraint to auth.users since placeholder UUIDs would violate it; RLS enforces isolation instead
*/

-- Add user_id to alarms
ALTER TABLE alarms ADD COLUMN IF NOT EXISTS user_id uuid;
UPDATE alarms SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
DO $$ BEGIN
  ALTER TABLE alarms ALTER COLUMN user_id SET NOT NULL;
  ALTER TABLE alarms ALTER COLUMN user_id SET DEFAULT auth.uid();
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Add user_id to app_settings
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS user_id uuid;
UPDATE app_settings SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
DO $$ BEGIN
  ALTER TABLE app_settings ALTER COLUMN user_id SET NOT NULL;
  ALTER TABLE app_settings ALTER COLUMN user_id SET DEFAULT auth.uid();
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Add user_id to focus_sessions
ALTER TABLE focus_sessions ADD COLUMN IF NOT EXISTS user_id uuid;
UPDATE focus_sessions SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
DO $$ BEGIN
  ALTER TABLE focus_sessions ALTER COLUMN user_id SET NOT NULL;
  ALTER TABLE focus_sessions ALTER COLUMN user_id SET DEFAULT auth.uid();
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Replace alarms policies
DROP POLICY IF EXISTS "anon_select_alarms" ON alarms;
DROP POLICY IF EXISTS "anon_insert_alarms" ON alarms;
DROP POLICY IF EXISTS "anon_update_alarms" ON alarms;
DROP POLICY IF EXISTS "anon_delete_alarms" ON alarms;

DROP POLICY IF EXISTS "select_own_alarms" ON alarms;
CREATE POLICY "select_own_alarms" ON alarms FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_alarms" ON alarms;
CREATE POLICY "insert_own_alarms" ON alarms FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_alarms" ON alarms;
CREATE POLICY "update_own_alarms" ON alarms FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_alarms" ON alarms;
CREATE POLICY "delete_own_alarms" ON alarms FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Replace app_settings policies
DROP POLICY IF EXISTS "anon_select_app_settings" ON app_settings;
DROP POLICY IF EXISTS "anon_insert_app_settings" ON app_settings;
DROP POLICY IF EXISTS "anon_update_app_settings" ON app_settings;
DROP POLICY IF EXISTS "anon_delete_app_settings" ON app_settings;

DROP POLICY IF EXISTS "select_own_app_settings" ON app_settings;
CREATE POLICY "select_own_app_settings" ON app_settings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_app_settings" ON app_settings;
CREATE POLICY "insert_own_app_settings" ON app_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_app_settings" ON app_settings;
CREATE POLICY "update_own_app_settings" ON app_settings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_app_settings" ON app_settings;
CREATE POLICY "delete_own_app_settings" ON app_settings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Replace focus_sessions policies
DROP POLICY IF EXISTS "anon_select_focus_sessions" ON focus_sessions;
DROP POLICY IF EXISTS "anon_insert_focus_sessions" ON focus_sessions;
DROP POLICY IF EXISTS "anon_update_focus_sessions" ON focus_sessions;
DROP POLICY IF EXISTS "anon_delete_focus_sessions" ON focus_sessions;

DROP POLICY IF EXISTS "select_own_focus_sessions" ON focus_sessions;
CREATE POLICY "select_own_focus_sessions" ON focus_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_focus_sessions" ON focus_sessions;
CREATE POLICY "insert_own_focus_sessions" ON focus_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_focus_sessions" ON focus_sessions;
CREATE POLICY "update_own_focus_sessions" ON focus_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_focus_sessions" ON focus_sessions;
CREATE POLICY "delete_own_focus_sessions" ON focus_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
