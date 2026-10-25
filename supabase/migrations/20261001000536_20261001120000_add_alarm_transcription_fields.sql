/*
# Add editable audio transcription fields to alarms

1. Modified Tables
- `alarms`
  - `transcription_text` (text, nullable) — the words recognized from the uploaded audio.
  - `dialect_text` (text, nullable) — the user-editable version transformed for the selected regional accent.

2. Data Safety
- Existing alarms are preserved unchanged; both fields are nullable so older rows remain valid.
- No columns are removed, renamed, or changed in type.

3. Security
- The existing owner-scoped RLS policies on `alarms` remain unchanged and protect both new columns automatically.

4. Notes
- The original transcription and dialect version are kept separate so users can edit either without losing the recognized audio text.
*/

ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS transcription_text text;

ALTER TABLE alarms
  ADD COLUMN IF NOT EXISTS dialect_text text;
