import { supabase } from './supabase';
import type { Alarm, AlarmInsert } from './types';

export async function fetchAlarms(): Promise<Alarm[]> {
  const { data, error } = await supabase
    .from('alarms')
    .select('*')
    .order('time', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Alarm[];
}

export async function createAlarm(alarm: AlarmInsert): Promise<Alarm> {
  const { data, error } = await supabase
    .from('alarms')
    .insert(alarm)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as Alarm;
}

export async function updateAlarm(
  id: string,
  patch: Partial<AlarmInsert>
): Promise<void> {
  const { error } = await supabase.from('alarms').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteAlarmRow(id: string): Promise<void> {
  const { error } = await supabase.from('alarms').delete().eq('id', id);
  if (error) throw error;
}
