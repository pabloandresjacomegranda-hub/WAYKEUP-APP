/*
# Create audio_files table for audio library

1. New Tables
- `audio_files`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to authenticated user, references auth.users)
  - `name` (text, display name the user can rename)
  - `storage_path` (text, path in the alarm-audio bucket)
  - `url` (text, public URL of the file)
  - `mime_type` (text, file MIME type)
  - `size_bytes` (bigint, file size)
  - `duration_seconds` (numeric, audio duration, nullable)
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `audio_files`.
- Owner-scoped CRUD: each authenticated user can only access their own audio files.
- 4 separate policies (select/insert/update/delete) scoped to `TO authenticated` with `auth.uid() = user_id`.

3. Notes
- `user_id` defaults to `auth.uid()` so inserts that omit it still satisfy the INSERT policy.
- The `alarm-audio` storage bucket already exists and is public.
*/

CREATE TABLE IF NOT EXISTS audio_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  mime_type text,
  size_bytes bigint,
  duration_seconds numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_audio_files" ON audio_files;
CREATE POLICY "select_own_audio_files"
ON audio_files FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_audio_files" ON audio_files;
CREATE POLICY "insert_own_audio_files"
ON audio_files FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_audio_files" ON audio_files;
CREATE POLICY "update_own_audio_files"
ON audio_files FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_audio_files" ON audio_files;
CREATE POLICY "delete_own_audio_files"
ON audio_files FOR DELETE
TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_audio_files_user_id ON audio_files(user_id);
CREATE INDEX IF NOT EXISTS idx_audio_files_created_at ON audio_files(created_at DESC);
