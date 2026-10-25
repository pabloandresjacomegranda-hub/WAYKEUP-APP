/*
# Add voice naturalness columns to alarms

1. New Columns on `alarms`
- `voice_speed` (real, default 1.0) — playback speed multiplier (0.7 to 1.3)
- `voice_stability` (real, default 0.5) — ElevenLabs stability parameter (0 to 1)
- `voice_similarity` (real, default 0.75) — ElevenLabs similarity_boost parameter (0 to 1)

2. Notes
- All three columns are nullable-safe with defaults so existing alarm rows
  automatically get sensible values without a backfill.
- No security changes — RLS already enabled on `alarms` with owner-scoped policies.
*/

ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS voice_speed real NOT NULL DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS voice_stability real NOT NULL DEFAULT 0.5,
  ADD COLUMN IF NOT EXISTS voice_similarity real NOT NULL DEFAULT 0.75;
