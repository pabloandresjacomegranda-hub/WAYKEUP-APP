import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../locales/en.ts';
import de from '../locales/de.ts';
import es from '../locales/es.ts';
import fr from '../locales/fr.ts';
import pt from '../locales/pt.ts';
import it from '../locales/it.ts';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      fr: { translation: fr },
      pt: { translation: pt },
      it: { translation: it },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'de', 'es', 'fr', 'pt', 'it'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'waykeup_lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
