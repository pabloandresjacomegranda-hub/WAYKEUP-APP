import type { ClonedVoice } from './types';

export const CLONED_VOICES: ClonedVoice[] = [
  {
    id: 'oma',
    name: {
      en: 'Oma',
      de: 'Oma',
      es: 'Abuela',
      fr: 'Mamie',
      pt: 'Vovó',
      it: 'Nonna',
    },
    role: {
      en: 'Grandmother',
      de: 'Großmutter',
      es: 'Abuela',
      fr: 'Grand-mère',
      pt: 'Avó',
      it: 'Nonna',
    },
    description: {
      en: 'Loving and nurturing, the warmth of family',
      de: 'Liebevoll und fürsorglich, die Wärme der Familie',
      es: 'Amorosa y protectora, el calor de la familia',
      fr: 'Aimante et nourricière, la chaleur de la famille',
      pt: 'Amorosa e acolhedora, o calor da família',
      it: 'Amorosa e premurosa, il calore della famiglia',
    },
    accent: '#f9a8d4',
  },
  {
    id: 'mentor',
    name: {
      en: 'Mentor',
      de: 'Mentor',
      es: 'Mentor',
      fr: 'Mentor',
      pt: 'Mentor',
      it: 'Mentore',
    },
    role: {
      en: 'Mentor',
      de: 'Mentor',
      es: 'Mentor',
      fr: 'Mentor',
      pt: 'Mentor',
      it: 'Mentore',
    },
    description: {
      en: 'Wise and guiding, pushes you to grow',
      de: 'Weise und leitend, fordert dich zum Wachsen auf',
      es: 'Sabio y guía, te empuja a crecer',
      fr: 'Sage et guidant, vous pousse à grandir',
      pt: 'Sábio e guia, te impulsiona a crescer',
      it: 'Saggio e guida, ti spinge a crescere',
    },
    accent: '#60a5fa',
  },
  {
    id: 'partner',
    name: {
      en: 'Partner',
      de: 'Partner',
      es: 'Pareja',
      fr: 'Partenaire',
      pt: 'Parceiro',
      it: 'Partner',
    },
    role: {
      en: 'Partner',
      de: 'Partner',
      es: 'Pareja',
      fr: 'Partenaire',
      pt: 'Parceiro',
      it: 'Partner',
    },
    description: {
      en: 'Intimate and encouraging, your biggest supporter',
      de: 'Intim und ermutigend, dein größter Unterstützer',
      es: 'Íntima y alentadora, tu mayor apoyo',
      fr: 'Intime et encourageant, votre plus grand soutien',
      pt: 'Íntimo e encorajador, seu maior apoiador',
      it: 'Intimo e incoraggiante, il tuo più grande sostenitore',
    },
    accent: '#fbbf24',
  },
  {
    id: 'coach',
    name: {
      en: 'Coach',
      de: 'Trainer',
      es: 'Entrenador',
      fr: 'Coach',
      pt: 'Treinador',
      it: 'Allenatore',
    },
    role: {
      en: 'Coach',
      de: 'Trainer',
      es: 'Entrenador',
      fr: 'Coach',
      pt: 'Treinador',
      it: 'Allenatore',
    },
    description: {
      en: 'Firm and motivating, no excuses accepted',
      de: 'Strikt und motivierend, keine Ausreden akzeptiert',
      es: 'Firme y motivador, no se aceptan excusas',
      fr: 'Ferme et motivant, aucune excuse acceptée',
      pt: 'Firme e motivador, sem desculpas aceitas',
      it: 'Fermo e motivante, nessuna scusa accettata',
    },
    accent: '#34d399',
  },
];

export function getClonedVoice(id: string | null): ClonedVoice | undefined {
  if (!id) return undefined;
  return CLONED_VOICES.find((v) => v.id === id);
}
