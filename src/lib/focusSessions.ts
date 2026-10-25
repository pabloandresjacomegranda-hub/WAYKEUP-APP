import { supabase } from './supabase';
import type { FocusSession, FocusSessionInsert } from './types';

export async function fetchFocusSessions(): Promise<FocusSession[]> {
  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as FocusSession[];
}

export async function createFocusSession(
  session: FocusSessionInsert
): Promise<FocusSession> {
  const { data, error } = await supabase
    .from('focus_sessions')
    .insert(session)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as FocusSession;
}

export async function updateFocusSession(
  id: string,
  patch: Partial<FocusSession>
): Promise<void> {
  const { error } = await supabase
    .from('focus_sessions')
    .update(patch)
    .eq('id', id);
  if (error) throw error;
}
