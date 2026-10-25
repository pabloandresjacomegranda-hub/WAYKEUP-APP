/*
# Add vibration_pattern column to alarms table

1. Changes
- Adds `vibration_pattern` text column to the `alarms` table.
- Defaults to 'standard' (Standard Vibration).
- Allows storing Solfeggio frequency vibration styles: 432hz, 528hz, 639hz, gentle_wave, standard.
2. Security
- No changes to existing RLS policies. The new column inherits the table's existing policies.
3. Notes
- The column is nullable-safe with a default so existing rows get 'standard' automatically.
- No data is lost; this is a purely additive migration.
*/

ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS vibration_pattern text NOT NULL DEFAULT 'standard';
