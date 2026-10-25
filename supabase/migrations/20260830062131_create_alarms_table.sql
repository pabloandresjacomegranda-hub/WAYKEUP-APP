/*
# Create alarms table (single-tenant, no auth)

1. New Tables
- `alarms`
- `id` (uuid, primary key)
- `label` (text, optional name for the alarm, defaults to 'Alarm')
- `time` (time, the time of day the alarm fires, e.g. 06:30)
- `days` (boolean[7], which weekdays the alarm is active, index 0=Sunday..6=Saturday)
- `enabled` (boolean, whether the alarm is on, defaults to true)
- `voice_tier` (text, 'standard' or 'premium')
- `voice_persona` (text, the selected voice persona id)
- `motivator` (text, the selected motivator id, e.g. 'daily_goal', 'fitness', 'coach')
- `created_at` (timestamptz, defaults to now())

2. Security
- Enable RLS on `alarms`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in app).
*/

CREATE TABLE IF NOT EXISTS alarms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT 'Alarm',
  time time NOT NULL DEFAULT '07:00',
  days boolean[7] NOT NULL DEFAULT ARRAY[true, true, true, true, true, false, false],
  enabled boolean NOT NULL DEFAULT true,
  voice_tier text NOT NULL DEFAULT 'standard',
  voice_persona text NOT NULL DEFAULT 'aura',
  motivator text NOT NULL DEFAULT 'daily_goal',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE alarms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_alarms" ON alarms;
CREATE POLICY "anon_select_alarms" ON alarms FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_alarms" ON alarms;
CREATE POLICY "anon_insert_alarms" ON alarms FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_alarms" ON alarms;
CREATE POLICY "anon_update_alarms" ON alarms FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_alarms" ON alarms;
CREATE POLICY "anon_delete_alarms" ON alarms FOR DELETE
  TO anon, authenticated USING (true);
