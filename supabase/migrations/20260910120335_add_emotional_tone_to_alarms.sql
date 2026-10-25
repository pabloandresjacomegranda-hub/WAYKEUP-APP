/*
# Add emotional_tone column to alarms table

1. Modified Tables
- `alarms`
- Add `emotional_tone` (text, NOT NULL, default 'warm') — stores the selected emotional tone for the alarm script.
  Values: 'energetic', 'firm', 'warm', 'gentle'.
2. Security
- No changes to existing RLS policies. The column inherits the same anon/authenticated access as the rest of the table.
3. Notes
- The column is additive (no data loss). Existing rows default to 'warm'.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'alarms' AND column_name = 'emotional_tone'
  ) THEN
    ALTER TABLE alarms ADD COLUMN emotional_tone text NOT NULL DEFAULT 'warm';
  END IF;
END $$;
