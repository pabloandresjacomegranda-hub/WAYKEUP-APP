import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { fetchSettings, saveLanguage } from '@/lib/settings';
import type { Language } from '@/lib/types';

const toLanguage = (value: string): Language => {
  if (value.startsWith('de')) return 'de';
  if (value.startsWith('es')) return 'es';
  if (value.startsWith('fr')) return 'fr';
  if (value.startsWith('pt')) return 'pt';
  if (value.startsWith('it')) return 'it';
  return 'en';
};

export function useLanguage() {
  const { t } = useTranslation();
  const [lang, setLangState] = useState<Language>(() => toLanguage(i18n.language));

  useEffect(() => {
    const handleLanguageChanged = (next: string) => {
      setLangState(toLanguage(next));
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const settings = await fetchSettings();
        if (settings) {
          await i18n.changeLanguage(settings.language);
        }
      } catch {
        // keep browser-detected default
      }
    })();
  }, []);

  const setLang = useCallback((next: Language) => {
    i18n.changeLanguage(next);
    setLangState(next);
    (async () => {
      try {
        await saveLanguage(next);
      } catch {
        // ignore
      }
    })();
  }, []);

  return { lang, setLang, t };
}
