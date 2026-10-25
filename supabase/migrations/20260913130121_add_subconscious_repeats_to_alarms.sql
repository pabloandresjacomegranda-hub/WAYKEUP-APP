/*
# Add subconscious_repeats column to alarms

1. New Column on `alarms`
- `subconscious_repeats` (integer, default 1) — how many times the subconscious
  playback repeats (1 to 3) before auto-dismissing.

2. Notes
- Existing rows get default value 1 (single playback, current behavior).
- No security changes — RLS already enabled on `alarms`.
*/

ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS subconscious_repeats integer NOT NULL DEFAULT 1;
