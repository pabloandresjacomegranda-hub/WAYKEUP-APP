/*
# Add audio_mode and voice_clone_id to alarms

1. New Columns on `alarms`
- `audio_mode` (text, default 'tts') — how the alarm plays audio:
  'tts' = generate speech from script/custom text using selected voice
  'direct' = play the uploaded audio file as-is
  'clone' = clone the voice from the uploaded audio and use it to speak the custom text
- `voice_clone_id` (text, nullable) — ElevenLabs voice ID created from cloning,
  stored so we can reuse it without re-cloning on every trigger.

2. Notes
- Existing rows get default 'tts' (current behavior — no change).
- No security changes — RLS already enabled on `alarms`.
*/

ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS audio_mode text NOT NULL DEFAULT 'tts';

ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS voice_clone_id text;
