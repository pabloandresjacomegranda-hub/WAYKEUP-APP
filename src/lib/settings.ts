import { supabase } from './supabase';
import type { AppSettings, Language } from './types';

export async function fetchSettings(): Promise<AppSettings | null> {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data as AppSettings | null;
}

export async function saveLanguage(lang: Language): Promise<void> {
  const existing = await fetchSettings();
  if (existing) {
    const { error } = await supabase
      .from('app_settings')
      .update({ language: lang, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('app_settings')
      .insert({ language: lang });
    if (error) throw error;
  }
}

export async function saveSubscriptionTier(tier: 'standard' | 'premium'): Promise<void> {
  const existing = await fetchSettings();
  if (existing) {
    const { error } = await supabase
      .from('app_settings')
      .update({ subscription_tier: tier, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('app_settings')
      .insert({ subscription_tier: tier });
    if (error) throw error;
  }
}

export async function saveApiKey(key: string): Promise<void> {
  const trimmed = key.trim();
  const existing = await fetchSettings();
  if (existing) {
    const { error } = await supabase
      .from('app_settings')
      .update({ elevenlabs_api_key: trimmed || null, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('app_settings')
      .insert({ elevenlabs_api_key: trimmed || null });
    if (error) throw error;
  }
}
