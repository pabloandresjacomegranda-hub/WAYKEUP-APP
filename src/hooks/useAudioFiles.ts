import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface AudioFile {
  id: string;
  name: string;
  storage_path: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  duration_seconds: number | null;
  created_at: string;
}

export function useAudioFiles() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audio_files')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setFiles(data as AudioFile[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (file: File): Promise<AudioFile | null> => {
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav', 'audio/mp4', 'audio/x-m4a', 'audio/m4a'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
        return null;
      }
      const duration = await getAudioDuration(file);
      const MAX_DURATION = 60;
      if (duration != null && duration > MAX_DURATION) {
        throw new Error('AUDIO_TOO_LONG');
      }
      const storagePath = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage
        .from('alarm-audio')
        .upload(storagePath, file);
      if (uploadError) return null;
      const { data: urlData } = supabase.storage
        .from('alarm-audio')
        .getPublicUrl(storagePath);

      const { data, error } = await supabase
        .from('audio_files')
        .insert({
          name: file.name.replace(/\.[^.]+$/, ''),
          storage_path: storagePath,
          url: urlData.publicUrl,
          mime_type: file.type || null,
          size_bytes: file.size,
          duration_seconds: duration,
        })
        .select()
        .single();
      if (error || !data) return null;
      setFiles((prev) => [data as AudioFile, ...prev]);
      return data as AudioFile;
    },
    []
  );

  const rename = useCallback(async (id: string, name: string) => {
    const { data, error } = await supabase
      .from('audio_files')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      setFiles((prev) => prev.map((f) => (f.id === id ? (data as AudioFile) : f)));
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file) {
      await supabase.storage.from('alarm-audio').remove([file.storage_path]);
    }
    await supabase.from('audio_files').delete().eq('id', id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, [files]);

  return { files, loading, reload: load, add, rename, remove };
}

function getAudioDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration ? Math.round(audio.duration * 10) / 10 : null);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    audio.src = url;
  });
}
