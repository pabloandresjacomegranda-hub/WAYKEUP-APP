/*
# Add subconscious mode, focus sessions, and app settings

1. Modified Tables
- `alarms`
  - `subconscious_mode` (boolean, default false) — enables silent self-stopping alarm that plays once at low volume during light sleep and fades out without waking the user.
  - `subconscious_volume` (integer, default 3) — volume level 1-10% for subconscious playback.
  - `cloned_voice` (text, nullable) — id of a cloned voice persona (e.g. 'oma', 'mentor', 'partner') used instead of a synthetic voice.
  - `script_id` (text, nullable) — id of a pre-built motivation script (e.g. 'wealth_mindset', 'fitness_discipline', 'emotional_healing').
  - `language` (text, default 'en') — language code ('en' or 'de') for this alarm's script.

2. New Tables
- `focus_sessions`
  - `id` (uuid, primary key)
  - `target_minutes` (integer, not null) — the planned focus duration in minutes.
  - `elapsed_seconds` (integer, default 0) — how many seconds of focus were completed.
  - `status` (text, default 'active') — 'active', 'success', or 'failed'.
  - `cloned_voice` (text, nullable) — cloned voice to play reward/punishment messages.
  - `language` (text, default 'en') — language for the messages.
  - `started_at` (timestamptz, default now())
  - `ended_at` (timestamptz, nullable)

- `app_settings`
  - `id` (uuid, primary key, default gen_random_uuid())
  - `language` (text, default 'en') — the app-wide UI language ('en' or 'de').
  - `updated_at` (timestamptz, default now())

3. Security
- Enable RLS on `focus_sessions` and `app_settings`.
- Allow anon + authenticated CRUD on both (single-tenant, no auth app).
- Existing alarms policies unchanged; new columns inherit the existing permissive policies.

4. Important Notes
- All new columns use ADD COLUMN IF NOT EXISTS for idempotency.
- The alarms table's existing RLS policies already cover the new columns since they grant access to all columns.
- app_settings is designed as a singleton row; the app upserts the first row.
*/

-- Add columns to alarms
ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS subconscious_mode boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS subconscious_volume integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS cloned_voice text,
  ADD COLUMN IF NOT EXISTS script_id text,
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'en';

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_minutes integer NOT NULL,
  elapsed_seconds integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  cloned_voice text,
  language text NOT NULL DEFAULT 'en',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_select_focus_sessions" ON focus_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_insert_focus_sessions" ON focus_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_update_focus_sessions" ON focus_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_focus_sessions" ON focus_sessions;
CREATE POLICY "anon_delete_focus_sessions" ON focus_sessions FOR DELETE
  TO anon, authenticated USING (true);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language text NOT NULL DEFAULT 'en',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_app_settings" ON app_settings;
CREATE POLICY "anon_select_app_settings" ON app_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_app_settings" ON app_settings;
CREATE POLICY "anon_insert_app_settings" ON app_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_settings" ON app_settings;
CREATE POLICY "anon_update_app_settings" ON app_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_app_settings" ON app_settings;
CREATE POLICY "anon_delete_app_settings" ON app_settings FOR DELETE
  TO anon, authenticated USING (true);

-- Seed a default settings row if none exists
INSERT INTO app_settings (language)
SELECT 'en'
WHERE NOT EXISTS (SELECT 1 FROM app_settings);
