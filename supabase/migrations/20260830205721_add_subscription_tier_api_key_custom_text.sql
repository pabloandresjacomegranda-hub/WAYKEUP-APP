/*
# Add subscription tier, ElevenLabs API key, custom text, and audio file support

1. Modified Tables
- `app_settings`
  - `subscription_tier` (text, default 'standard') — 'standard' or 'premium' plan toggle for testing UI behavior.
  - `elevenlabs_api_key` (text, nullable) — user-provided ElevenLabs API key for voice synthesis.
- `alarms`
  - `custom_text` (text, nullable) — user-written custom motivation text for synthesized voice (Premium only).
  - `audio_file_url` (text, nullable) — URL to a user-uploaded .mp3/.wav file used as the alarm audio (Standard mode).

2. New Storage
- `alarm-audio` bucket (public read) — stores user-uploaded audio files (.mp3/.wav) for use as alarm sounds.

3. Security
- Existing RLS policies on app_settings and alarms already cover all columns (permissive anon + authenticated CRUD).
- Storage bucket is public for read so alarms can play uploaded audio; writes are anon+authenticated.

4. Important Notes
- All new columns use ADD COLUMN IF NOT EXISTS for idempotency.
- The storage bucket is created with public read access since alarm audio needs to be playable without authentication.
- subscription_tier defaults to 'standard' so existing behavior is unchanged until the user toggles to Premium.
*/

-- Add columns to app_settings
ALTER TABLE app_settings
  ADD COLUMN IF NOT EXISTS subscription_tier text NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS elevenlabs_api_key text;

-- Add columns to alarms
ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS custom_text text,
  ADD COLUMN IF NOT EXISTS audio_file_url text;

-- Create storage bucket for alarm audio uploads
INSERT INTO storage.buckets (id, name, public)
SELECT 'alarm-audio', 'alarm-audio', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'alarm-audio');

-- Storage policies for alarm-audio bucket
DROP POLICY IF EXISTS "anon_read_alarm_audio" ON storage.objects;
CREATE POLICY "anon_read_alarm_audio" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'alarm-audio');

DROP POLICY IF EXISTS "anon_insert_alarm_audio" ON storage.objects;
CREATE POLICY "anon_insert_alarm_audio" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'alarm-audio');

DROP POLICY IF EXISTS "anon_update_alarm_audio" ON storage.objects;
CREATE POLICY "anon_update_alarm_audio" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'alarm-audio') WITH CHECK (bucket_id = 'alarm-audio');

DROP POLICY IF EXISTS "anon_delete_alarm_audio" ON storage.objects;
CREATE POLICY "anon_delete_alarm_audio" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'alarm-audio');
