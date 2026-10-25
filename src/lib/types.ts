export type Language = 'en' | 'de' | 'es' | 'fr' | 'pt' | 'it';

export const LANGUAGES: Language[] = ['en', 'de', 'es', 'fr', 'pt', 'it'];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  it: 'Italiano',
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  en: '🇬🇧',
  de: '🇩🇪',
  es: '🇪🇸',
  fr: '🇫🇷',
  pt: '🇵🇹',
  it: '🇮🇹',
};

export const LOCALE_MAP: Record<Language, string> = {
  en: 'en-US',
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
  pt: 'pt-PT',
  it: 'it-IT',
};

export type EmotionalTone = 'energetic' | 'firm' | 'warm' | 'gentle';

export const EMOTIONAL_TONES: {
  id: EmotionalTone;
  name: Record<Language, string>;
  description: Record<Language, string>;
  stability: number;
  similarity: number;
  style: number;
  aiInstruction: Record<Language, string>;
}[] = [
  {
    id: 'energetic',
    name: {
      en: 'Energetic',
      de: 'Energetisch',
      es: 'Enérgico',
      fr: 'Énergique',
      pt: 'Enérgico',
      it: 'Energetico',
    },
    description: {
      en: 'High energy, enthusiastic, motivating',
      de: 'Hohe Energie, begeistert, motivierend',
      es: 'Alta energía, entusiasta, motivador',
      fr: 'Haute énergie, enthousiaste, motivant',
      pt: 'Alta energia, entusiasmado, motivador',
      it: 'Alta energia, entusiasta, motivante',
    },
    stability: 0.35,
    similarity: 0.75,
    style: 0.5,
    aiInstruction: {
      en: 'Write with high energy and enthusiasm. Use exclamation points, dynamic verbs, and an uplifting, motivating tone.',
      de: 'Schreibe mit hoher Energie und Begeisterung. Verwende Ausrufezeichen, dynamische Verben und einen erhebenden, motivierenden Ton.',
      es: 'Escribe con alta energía y entusiasmo. Usa signos de exclamación, verbos dinámicos y un tono edificante y motivador.',
      fr: 'Écris avec une haute énergie et de l\'enthousiasme. Utilise des points d\'exclamation, des verbes dynamiques et un ton motivant.',
      pt: 'Escreva com alta energia e entusiasmo. Use pontos de exclamação, verbos dinâmicos e um tom edificante e motivador.',
      it: 'Scrivi con alta energia ed entusiasmo. Usa punti esclamativi, verbi dinamici e un tono edificante e motivante.',
    },
  },
  {
    id: 'firm',
    name: {
      en: 'Firm / Disciplined',
      de: 'Fest / Diszipliniert',
      es: 'Firme / Disciplinado',
      fr: 'Ferme / Discipliné',
      pt: 'Firme / Disciplinado',
      it: 'Fermo / Disciplinato',
    },
    description: {
      en: 'Direct, authoritative, no-nonsense',
      de: 'Direkt, autoritär, kein Unsinn',
      es: 'Directo, autoritario, sin rodeos',
      fr: 'Direct, autoritaire, sans détour',
      pt: 'Direto, autoritário, sem rodeios',
      it: 'Diretto, autorevole, senza giri di parole',
    },
    stability: 0.35,
    similarity: 0.75,
    style: 0.5,
    aiInstruction: {
      en: 'Write with firm authority and discipline. Use direct commands, no softeners, and a no-excuses tone.',
      de: 'Schreibe mit fester Autorität und Disziplin. Verwende direkte Befehle, keine Abschwächungen und einen Ton ohne Ausreden.',
      es: 'Escribe con autoridad firme y disciplina. Usa comandos directos, sin suavizadores y un tono sin excusas.',
      fr: 'Écris avec une autorité ferme et de la discipline. Utilise des commandes directes, sans adoucissements et un ton sans excuses.',
      pt: 'Escreva com autoridade firme e disciplina. Use comandos diretos, sem suavizações e um tom sem desculpas.',
      it: 'Scrivi con autorità ferma e disciplina. Usa comandi diretti, senza attenuanti e un tono senza scuse.',
    },
  },
  {
    id: 'warm',
    name: {
      en: 'Warm / Calm',
      de: 'Warm / Ruhig',
      es: 'Cálido / Calmado',
      fr: 'Chaleureux / Calme',
      pt: 'Caloroso / Calmo',
      it: 'Caldo / Calmo',
    },
    description: {
      en: 'Warm, nurturing, reassuring',
      de: 'Warm, fürsorglich, beruhigend',
      es: 'Cálido, protector, tranquilizador',
      fr: 'Chaleureux, nourricier, rassurant',
      pt: 'Caloroso, acolhedor, tranquilizador',
      it: 'Caldo, accogliente, rassicurante',
    },
    stability: 0.4,
    similarity: 0.8,
    style: 0.15,
    aiInstruction: {
      en: 'Write with warmth and calm. Use gentle, nurturing language, soft reassurance, and a comforting tone.',
      de: 'Schreibe mit Wärme und Ruhe. Verwende sanfte, fürsorgliche Sprache, sanfte Bestätigung und einen beruhigenden Ton.',
      es: 'Escribe con calidez y calma. Usa lenguaje gentil y nutritivo, suave reafirmación y un tono reconfortante.',
      fr: 'Écris avec chaleur et calme. Utilise un langage doux et nourricier, une douce reassurance et un ton réconfortant.',
      pt: 'Escreva com calor e calma. Use linguagem gentil e acolhedora, suave reafirmação e um tom reconfortante.',
      it: 'Scrivi con calore e calma. Usa un linguaggio gentile e accogliente, rassicurazione dolce e un tono confortante.',
    },
  },
  {
    id: 'gentle',
    name: {
      en: 'Gentle',
      de: 'Sanft',
      es: 'Suave',
      fr: 'Doux',
      pt: 'Suave',
      it: 'Dolce',
    },
    description: {
      en: 'Soft, slow, tender, soothing',
      de: 'Weich, langsam, zart, beruhigend',
      es: 'Suave, lento, tierno, reconfortante',
      fr: 'Doux, lent, tendre, apaisant',
      pt: 'Suave, lento, terno, calmante',
      it: 'Morbido, lento, tenero, lenitivo',
    },
    stability: 0.3,
    similarity: 0.8,
    style: 0.1,
    aiInstruction: {
      en: 'Write with extreme gentleness. Use slow, tender, soothing words, as if speaking to someone half-asleep.',
      de: 'Schreibe mit extremer Sanftheit. Verwende langsame, zarte, beruhigende Worte, als würdest du zu jemandem sprechen, der halb schläft.',
      es: 'Escribe con extrema suavidad. Usa palabras lentas, tiernas y reconfortantes, como si le hablaras a alguien medio dormido.',
      fr: 'Écris avec une extrême douceur. Utilise des mots lents, tendres et apaisants, comme si tu parlais à quelqu\'un à moitié endormi.',
      pt: 'Escreva com extrema suavidade. Use palavras lentas, ternas e calmantes, como se falasse com alguém meio adormecido.',
      it: 'Scrivi con estrema dolcezza. Usa parole lente, tenere e lenitive, come se parlassi a qualcuno mezzo addormentato.',
    },
  },
];

export type VoiceTier = 'standard' | 'premium';

export type VibrationPattern = 'standard' | '432hz' | '528hz' | '639hz' | 'gentle_wave';

export type AudioMode = 'tts' | 'direct' | 'clone';

export type RegionalAccent = 'none' | 'paisa' | 'costeno' | 'serrano' | 'carioca' | 'gaucho' | 'andaluz' | 'chilango' | 'rioplatense';

export const VIBRATION_PATTERNS: { id: VibrationPattern; name: Record<Language, string>; description: Record<Language, string>; frequency: string }[] = [
  {
    id: '432hz',
    name: { en: '432 Hz', de: '432 Hz', es: '432 Hz', fr: '432 Hz', pt: '432 Hz', it: '432 Hz' },
    description: {
      en: 'Deep Harmony',
      de: 'Tiefe Harmonie',
      es: 'Armonía Profunda',
      fr: 'Harmonie Profonde',
      pt: 'Harmonia Profunda',
      it: 'Armonia Profonda',
    },
    frequency: '432 Hz',
  },
  {
    id: '528hz',
    name: { en: '528 Hz', de: '528 Hz', es: '528 Hz', fr: '528 Hz', pt: '528 Hz', it: '528 Hz' },
    description: {
      en: 'Transformation & Repair',
      de: 'Transformation & Heilung',
      es: 'Transformación y Reparación',
      fr: 'Transformation et Réparation',
      pt: 'Transformação e Reparação',
      it: 'Trasformazione e Riparazione',
    },
    frequency: '528 Hz',
  },
  {
    id: '639hz',
    name: { en: '639 Hz', de: '639 Hz', es: '639 Hz', fr: '639 Hz', pt: '639 Hz', it: '639 Hz' },
    description: {
      en: 'Balance',
      de: 'Gleichgewicht',
      es: 'Equilibrio',
      fr: 'Équilibre',
      pt: 'Equilíbrio',
      it: 'Equilibrio',
    },
    frequency: '639 Hz',
  },
  {
    id: 'gentle_wave',
    name: {
      en: 'Gentle Wave Pulse',
      de: 'Sanfte Wellenpulse',
      es: 'Pulso de Onda Suave',
      fr: 'Pulsation d\'Onde Douce',
      pt: 'Pulso de Onda Suave',
      it: 'Pulsazione Onda Dolce',
    },
    description: {
      en: 'Rhythmic wave-like pulses',
      de: 'Rhythmische wellenartige Pulse',
      es: 'Pulsos rítmicos tipo onda',
      fr: 'Pulsations rythmiques en vague',
      pt: 'Pulsos rítmicos tipo onda',
      it: 'Pulsazioni ritmiche a onda',
    },
    frequency: '—',
  },
  {
    id: 'standard',
    name: {
      en: 'Standard Vibration',
      de: 'Standard-Vibration',
      es: 'Vibración Estándar',
      fr: 'Vibration Standard',
      pt: 'Vibração Padrão',
      it: 'Vibrazione Standard',
    },
    description: {
      en: 'Default device vibration',
      de: 'Standard-Gerätevibration',
      es: 'Vibración predeterminada del dispositivo',
      fr: 'Vibration par défaut du dispositif',
      pt: 'Vibração padrão do dispositivo',
      it: 'Vibrazione predefinita del dispositivo',
    },
    frequency: '—',
  },
];

export interface VoicePersona {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  tier: VoiceTier;
  accent: string;
}

export interface ClonedVoice {
  id: string;
  name: Record<Language, string>;
  role: Record<Language, string>;
  description: Record<Language, string>;
  accent: string;
}

export interface Motivator {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
}

export interface ScriptCategory {
  id: string;
  name: Record<Language, string>;
  icon: string;
}

export interface Script {
  id: string;
  categoryId: string;
  text: Record<Language, string>;
}

export interface Alarm {
  id: string;
  label: string;
  time: string;
  days: boolean[];
  enabled: boolean;
  voice_tier: VoiceTier;
  voice_persona: string;
  motivator: string;
  subconscious_mode: boolean;
  subconscious_volume: number;
  subconscious_repeats: number;
  cloned_voice: string | null;
  script_id: string | null;
  language: Language;
  custom_text: string | null;
  audio_file_url: string | null;
  audio_mode: AudioMode;
  voice_clone_id: string | null;
  vibration_pattern: VibrationPattern;
  emotional_tone: EmotionalTone;
  voice_speed: number;
  voice_stability: number;
  voice_similarity: number;
  regional_accent: string;
  transcription_text: string | null;
  dialect_text: string | null;
  created_at: string;
}

export type AlarmInsert = Omit<Alarm, 'id' | 'created_at'>;

export interface FocusSession {
  id: string;
  target_minutes: number;
  elapsed_seconds: number;
  status: 'active' | 'success' | 'failed';
  cloned_voice: string | null;
  language: Language;
  started_at: string;
  ended_at: string | null;
}

export type FocusSessionInsert = Omit<FocusSession, 'id' | 'started_at' | 'ended_at'>;

export interface AppSettings {
  id: string;
  language: Language;
  subscription_tier: 'standard' | 'premium';
  elevenlabs_api_key: string | null;
  updated_at: string;
}

export const DAY_LABELS: Record<Language, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
};

export const DAY_LABELS_SHORT: Record<Language, string[]> = {
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  de: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  es: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  fr: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  pt: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  it: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
};

const PRESET_PREFIX = 'preset:';

export function translateLabel(label: string, t: (key: string) => string): string {
  if (label.startsWith(PRESET_PREFIX)) {
    const key = label.slice(PRESET_PREFIX.length);
    const translated = t(`presets.${key}`);
    return translated === `presets.${key}` ? key : translated;
  }
  return label;
}
