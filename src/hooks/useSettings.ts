import { useCallback, useEffect, useState } from 'react';
import {
  fetchSettings,
  saveApiKey,
  saveLanguage,
  saveSubscriptionTier,
} from '@/lib/settings';
import { clearVoiceCache } from '@/lib/elevenlabs';
import type { AppSettings, Language } from '@/lib/types';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateLanguage = useCallback(async (lang: Language) => {
    await saveLanguage(lang);
    setSettings((prev) => (prev ? { ...prev, language: lang } : prev));
  }, []);

  const updateTier = useCallback(async (tier: 'standard' | 'premium') => {
    await saveSubscriptionTier(tier);
    setSettings((prev) => (prev ? { ...prev, subscription_tier: tier } : prev));
  }, []);

  const updateApiKey = useCallback(async (key: string) => {
    const trimmed = key.trim();
    await saveApiKey(trimmed);
    clearVoiceCache();
    setSettings((prev) => (prev ? { ...prev, elevenlabs_api_key: trimmed || null } : prev));
  }, []);

  const isPremium = settings?.subscription_tier === 'premium';

  return {
    settings,
    loading,
    reload: load,
    updateLanguage,
    updateTier,
    updateApiKey,
    isPremium,
  };
}
