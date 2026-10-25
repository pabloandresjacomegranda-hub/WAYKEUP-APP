import type { EmotionalTone, Language, RegionalAccent } from './types';
import { EMOTIONAL_TONES } from './types';
import { applyAccentToText } from './regionalAccents';

const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

export interface ClonedVoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

const voiceSettingsCache: Map<string, ClonedVoiceSettings> = new Map();

export async function fetchVoiceSettings(apiKey: string, voiceId: string): Promise<ClonedVoiceSettings | null> {
  if (voiceSettingsCache.has(voiceId)) {
    return voiceSettingsCache.get(voiceId) ?? null;
  }
  try {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/${voiceId}/settings`, {
      headers: { 'xi-api-key': apiKey },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const settings: ClonedVoiceSettings = {
      stability: data.stability ?? 0.5,
      similarity_boost: data.similarity_boost ?? 0.95,
      style: data.style ?? 0,
      use_speaker_boost: data.use_speaker_boost ?? true,
    };
    voiceSettingsCache.set(voiceId, settings);
    return settings;
  } catch {
    return null;
  }
}

const ACCENT_VOICE_OVERRIDES: Record<RegionalAccent, {
  stability: number;
  similarity_boost: number;
  style: number;
  speed_adjustment: number;
}> = {
  none: { stability: 0.65, similarity_boost: 0.90, style: 0.0, speed_adjustment: 1.0 },
  paisa: { stability: 0.62, similarity_boost: 0.88, style: 0.06, speed_adjustment: 0.97 },
  costeno: { stability: 0.60, similarity_boost: 0.87, style: 0.08, speed_adjustment: 0.95 },
  serrano: { stability: 0.72, similarity_boost: 0.90, style: 0.0, speed_adjustment: 0.93 },
  carioca: { stability: 0.60, similarity_boost: 0.87, style: 0.07, speed_adjustment: 0.96 },
  gaucho: { stability: 0.65, similarity_boost: 0.88, style: 0.04, speed_adjustment: 0.97 },
  andaluz: { stability: 0.58, similarity_boost: 0.86, style: 0.10, speed_adjustment: 0.94 },
  chilango: { stability: 0.60, similarity_boost: 0.87, style: 0.08, speed_adjustment: 0.98 },
  rioplatense: { stability: 0.63, similarity_boost: 0.88, style: 0.05, speed_adjustment: 0.98 },
};

function getAccentAwareSettings(
  cloned: boolean,
  accent: RegionalAccent | undefined,
  inherentSettings: ClonedVoiceSettings | null,
  userStability?: number,
  userSimilarity?: number,
  userStyle?: number,
): { stability: number; similarity_boost: number; style: number; use_speaker_boost: boolean } {
  if (!cloned) {
    return {
      stability: userStability ?? 0.4,
      similarity_boost: userSimilarity ?? 0.8,
      style: userStyle ?? 0.1,
      use_speaker_boost: true,
    };
  }

  const accentKey = (accent ?? 'none') as RegionalAccent;
  const overrides = ACCENT_VOICE_OVERRIDES[accentKey] ?? ACCENT_VOICE_OVERRIDES.none;
  const base = inherentSettings ?? { stability: 0.5, similarity_boost: 0.95, style: 0.0 };

  const blendedStability = (base.stability + overrides.stability) / 2;
  const blendedSimilarity = Math.min((base.similarity_boost + overrides.similarity_boost) / 2 + 0.02, 1.0);
  const blendedStyle = Math.max(base.style + overrides.style - 0.05, 0.0);

  return {
    stability: userStability ?? blendedStability,
    similarity_boost: userSimilarity ?? blendedSimilarity,
    style: userStyle ?? blendedStyle,
    use_speaker_boost: true,
  };
}

export function isElevenLabsAuthError(error: unknown): boolean {
  return error instanceof Error && /invalid_api_key|authentication_error|401|403/i.test(error.message);
}

function parseElevenLabsError(status: number, body: string): string {
  let detail = body;
  try {
    const parsed = JSON.parse(body);
    detail = parsed.detail?.message || parsed.detail || parsed.message || body;
    if (typeof detail === 'object') detail = body;
  } catch {
    // body wasn't JSON — use raw text
  }
  const statusText = responseStatusText(status);
  return `ElevenLabs error ${status} ${statusText}: ${detail}`;
}

function responseStatusText(status: number): string {
  const map: Record<number, string> = {
    401: 'Unauthorized - invalid API key',
    402: 'Payment required - your ElevenLabs credits are exhausted or your plan has expired',
    403: 'Forbidden - check your ElevenLabs subscription',
    422: 'Unprocessable - check voice ID or text',
    429: 'Rate limit exceeded - check your quota',
    500: 'Server error',
    503: 'Service unavailable',
    504: 'Gateway timeout',
  };
  return map[status] || '';
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: { accent?: string; description?: string; gender?: string };
  preview_url: string;
}

export interface ElevenLabsModel {
  model_id: string;
  name: string;
  can_do_text_to_speech: boolean;
}

export async function fetchElevenLabsVoices(apiKey: string): Promise<ElevenLabsVoice[]> {
  const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
    headers: { 'xi-api-key': apiKey },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`ElevenLabs voices failed (${response.status}): ${body}`);
  }
  const data = await response.json();
  return (data.voices ?? []) as ElevenLabsVoice[];
}

export async function fetchElevenLabsModels(apiKey: string): Promise<ElevenLabsModel[]> {
  const response = await fetch(`${ELEVENLABS_BASE_URL}/models`, {
    headers: { 'xi-api-key': apiKey },
  });
  if (!response.ok) {
    throw new Error(`ElevenLabs models failed (${response.status})`);
  }
  const data = await response.json();
  return (data ?? []) as ElevenLabsModel[];
}

const VOICE_ID_MAP: Record<string, string> = {
  aura: '21m00Tcm4TlvDq8ikWAM',
  ember: 'EXAVITQu4vr4xnSDxMaL',
  sage: 'ErXwobaYiN019PkySvjV',
  nova: 'AZnzlk1XvdvUeBnXmlld',
  onyx: 'TxGEqnHWuWfNDDDT0TxF',
  lumen: 'MF3mGyE0ClA1gsT3GTkC',
  oma: '21m00Tcm4TlvDq8ikWAM',
  mentor: 'ErXwobaYiN019PkySvjV',
  partner: 'EXAVITQu4vr4xnSDxMaL',
  coach: 'TxGEqnHWuWfNDDDT0TxF',
};

const LANGUAGE_VOICE_OVERRIDES: Partial<Record<Language, Partial<Record<string, string>>>> = {
  de: {
    aura: 'oxnbzdXqVokeUrUyaExS',
    ember: 'H1RPikOCj3XUOKuTygkn',
    sage: 'o6xBTVWnD2n3kEp4n1Jd',
    nova: 'C8ZGTRs8koIlo6hG4dtq',
    onyx: 'UuZLlnj1jBHG1hpRKs2G',
    lumen: 'UuZLlnj1jBHG1hpRKs2G',
    oma: 'oxnbzdXqVokeUrUyaExS',
    mentor: 'o6xBTVWnD2n3kEp4n1Jd',
    partner: 'H1RPikOCj3XUOKuTygkn',
    coach: 'UuZLlnj1jBHG1hpRKs2G',
  },
  es: {
    aura: 'EXAVITQu4vr4xnSDxMaL',
    ember: 'FGY2Wh1qk4qLpW2n7p8H',
    sage: 'ErXwobaYiN019PkySvjV',
    nova: 'AZnzlk1XvdvUeBnXmlld',
    onyx: 'TxGEqnHWuWfNDDDT0TxF',
    lumen: 'MF3mGyE0ClA1gsT3GTkC',
    oma: 'EXAVITQu4vr4xnSDxMaL',
    mentor: 'ErXwobaYiN019PkySvjV',
    partner: 'FGY2Wh1qk4qLpW2n7p8H',
    coach: 'TxGEqnHWuWfNDDDT0TxF',
  },
  fr: {
    aura: 'EXAVITQu4vr4xnSDxMaL',
    ember: 'FGY2Wh1qk4qLpW2n7p8H',
    sage: 'ErXwobaYiN019PkySvjV',
    nova: 'AZnzlk1XvdvUeBnXmlld',
    onyx: 'TxGEqnHWuWfNDDDT0TxF',
    lumen: 'MF3mGyE0ClA1gsT3GTkC',
    oma: 'EXAVITQu4vr4xnSDxMaL',
    mentor: 'ErXwobaYiN019PkySvjV',
    partner: 'FGY2Wh1qk4qLpW2n7p8H',
    coach: 'TxGEqnHWuWfNDDDT0TxF',
  },
  pt: {
    aura: 'EXAVITQu4vr4xnSDxMaL',
    ember: 'FGY2Wh1qk4qLpW2n7p8H',
    sage: 'ErXwobaYiN019PkySvjV',
    nova: 'AZnzlk1XvdvUeBnXmlld',
    onyx: 'TxGEqnHWuWfNDDDT0TxF',
    lumen: 'MF3mGyE0ClA1gsT3GTkC',
    oma: 'EXAVITQu4vr4xnSDxMaL',
    mentor: 'ErXwobaYiN019PkySvjV',
    partner: 'FGY2Wh1qk4qLpW2n7p8H',
    coach: 'TxGEqnHWuWfNDDDT0TxF',
  },
  it: {
    aura: 'EXAVITQu4vr4xnSDxMaL',
    ember: 'FGY2Wh1qk4qLpW2n7p8H',
    sage: 'ErXwobaYiN019PkySvjV',
    nova: 'AZnzlk1XvdvUeBnXmlld',
    onyx: 'TxGEqnHWuWfNDDDT0TxF',
    lumen: 'MF3mGyE0ClA1gsT3GTkC',
    oma: 'EXAVITQu4vr4xnSDxMaL',
    mentor: 'ErXwobaYiN019PkySvjV',
    partner: 'FGY2Wh1qk4qLpW2n7p8H',
    coach: 'TxGEqnHWuWfNDDDT0TxF',
  },
};

const LANGUAGE_ACCENT_MAP: Record<Language, string[]> = {
  en: ['american', 'english', 'british', 'us', 'uk'],
  de: ['german', 'deutsch', 'de'],
  es: ['spanish', 'español', 'espanol', 'castilian', 'castellano', 'es'],
  fr: ['french', 'français', 'francais', 'fr'],
  pt: ['portuguese', 'português', 'portugues', 'brazilian', 'brasilian', 'brasil', 'pt'],
  it: ['italian', 'italiano', 'it'],
};

const GENDER_MAP: Record<string, 'female' | 'male'> = {
  aura: 'female',
  ember: 'female',
  sage: 'male',
  nova: 'female',
  onyx: 'male',
  lumen: 'male',
  oma: 'female',
  mentor: 'male',
  partner: 'female',
  coach: 'male',
};

const voiceByAccentCache: Map<string, string> = new Map();

export function clearVoiceCache() {
  voiceByAccentCache.clear();
}

async function findVoiceByAccent(
  apiKey: string,
  internalId: string,
  language: Language,
): Promise<string | null> {
  const cacheKey = `${language}:${internalId}`;
  if (voiceByAccentCache.has(cacheKey)) {
    const cached = voiceByAccentCache.get(cacheKey)!;
    return cached || null;
  }

  const accents = LANGUAGE_ACCENT_MAP[language] ?? [];
  const gender = GENDER_MAP[internalId] ?? 'female';

  try {
    const voices = await fetchElevenLabsVoices(apiKey);

    // First try: match by accent AND gender
    const accentVoices = voices.filter((v) => {
      const accent = v.labels?.accent;
      return (
        accent != null &&
        accents.some((a) => accent.toLowerCase().includes(a.toLowerCase()))
      );
    });
    const genderMatch = accentVoices.find((v) => v.labels?.gender === gender);
    const accentChosen = genderMatch ?? accentVoices[0];
    if (accentChosen) {
      voiceByAccentCache.set(cacheKey, accentChosen.voice_id);
      return accentChosen.voice_id;
    }

    // Second try: match by gender only (any accent/language)
    const genderOnly = voices.find((v) => v.labels?.gender === gender);
    if (genderOnly) {
      voiceByAccentCache.set(cacheKey, genderOnly.voice_id);
      return genderOnly.voice_id;
    }

    // Third try: just use the first available voice
    if (voices.length > 0) {
      voiceByAccentCache.set(cacheKey, voices[0].voice_id);
      return voices[0].voice_id;
    }
  } catch {
    // API call failed — fall back to hardcoded voice
  }

  voiceByAccentCache.set(cacheKey, '');
  return null;
}

export function resolveVoiceId(internalId: string, language?: Language): string {
  const overrides = language ? LANGUAGE_VOICE_OVERRIDES[language] : undefined;
  return overrides?.[internalId] ?? VOICE_ID_MAP[internalId] ?? internalId;
}

export async function resolveVoiceIdAsync(
  internalId: string,
  language: Language | undefined,
  apiKey: string,
): Promise<string> {
  // Always try to find a voice from the user's account first
  const accentVoice = await findVoiceByAccent(apiKey, internalId, language ?? 'en');
  if (accentVoice) return accentVoice;

  // Fall back to hardcoded overrides
  if (language) {
    const override = LANGUAGE_VOICE_OVERRIDES[language]?.[internalId];
    if (override) return override;
  }
  return VOICE_ID_MAP[internalId] ?? internalId;
}

export async function resolveVoiceWithInfo(
  internalId: string,
  language: Language | undefined,
  apiKey: string,
): Promise<{ voiceId: string; matchedLanguage: boolean; fallback: boolean }> {
  const accentVoice = await findVoiceByAccent(apiKey, internalId, language ?? 'en');
  if (accentVoice) return { voiceId: accentVoice, matchedLanguage: true, fallback: false };

  if (language) {
    const override = LANGUAGE_VOICE_OVERRIDES[language]?.[internalId];
    if (override) return { voiceId: override, matchedLanguage: true, fallback: false };
  }
  return { voiceId: VOICE_ID_MAP[internalId] ?? internalId, matchedLanguage: language === 'en', fallback: language !== 'en' };
}

export interface TTSRequest {
  apiKey: string;
  text: string;
  voiceId: string;
  language?: Language;
  emotionalTone?: EmotionalTone;
  speed?: number;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  regionalAccent?: RegionalAccent;
}

function addNaturalPauses(text: string): string {
  let r = text;
  r = r.replace(/\s+/g, ' ').trim();
  r = r.replace(/\s*,\s*/g, ', ');
  r = r.replace(/\s*\.\s*/g, '. ');
  r = r.replace(/\s*!\s*/g, '! ');
  r = r.replace(/\s*\?\s*/g, '? ');
  r = r.replace(/\s*;\s*/g, '; ');
  r = r.replace(/\s*:\s*/g, ': ');
  r = r.replace(/\s+/g, ' ').trim();
  r = r.replace(/\s+([.,!?;:])/g, '$1');
  return r;
}

export async function generateSpeech({
  apiKey,
  text,
  voiceId,
  language,
  emotionalTone,
  speed,
  stability,
  similarityBoost,
  style,
  regionalAccent,
}: TTSRequest): Promise<Blob> {
  const resolvedVoiceId = await resolveVoiceIdAsync(voiceId, language, apiKey);
  const cloned = isClonedVoiceId(resolvedVoiceId);

  const toneConfig = emotionalTone
    ? EMOTIONAL_TONES.find((t) => t.id === emotionalTone)
    : undefined;

  const inherentSettings = cloned
    ? await fetchVoiceSettings(apiKey, resolvedVoiceId)
    : null;

  let voiceSettings;
  if (cloned) {
    voiceSettings = getAccentAwareSettings(
      true, regionalAccent, inherentSettings,
      stability, similarityBoost, style,
    );
  } else if (toneConfig) {
    voiceSettings = {
      stability: stability ?? toneConfig.stability,
      similarity_boost: similarityBoost ?? toneConfig.similarity,
      style: style ?? toneConfig.style,
      use_speaker_boost: true,
    };
  } else {
    voiceSettings = {
      stability: stability ?? 0.5,
      similarity_boost: similarityBoost ?? 0.85,
      style: style ?? 0.0,
      use_speaker_boost: true,
    };
  }

  const accentText = regionalAccent && regionalAccent !== 'none'
    ? applyAccentToText(text, regionalAccent)
    : text;
  const finalText = addNaturalPauses(accentText);

  const accentKey = (regionalAccent ?? 'none') as RegionalAccent;
  const speedAdjust = cloned ? (ACCENT_VOICE_OVERRIDES[accentKey]?.speed_adjustment ?? 1.0) : 1.0;
  const effectiveSpeed = speed ?? speedAdjust;

  if (effectiveSpeed !== undefined && effectiveSpeed > 0 && effectiveSpeed !== 1.0) {
    voiceSettings = { ...voiceSettings, speed: effectiveSpeed };
  }

  const requestBody: Record<string, unknown> = {
    text: finalText,
    model_id: 'eleven_turbo_v2_5',
    language_code: language ?? 'en',
    voice_settings: voiceSettings,
  };

  const response = await fetch(
    `${ELEVENLABS_BASE_URL}/text-to-speech/${resolvedVoiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify(requestBody),
    },
  );
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(parseElevenLabsError(response.status, errorBody));
  }
  return response.blob();
}

export async function transcribeAudioFromUrl(
  apiKey: string,
  audioUrl: string,
  language?: Language,
): Promise<string> {
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) {
    throw new Error(`Audio download failed (${audioResponse.status})`);
  }

  const audioBlob = await audioResponse.blob();
  const formData = new FormData();
  formData.append('file', audioBlob, 'alarm-audio');
  formData.append('model_id', 'scribe_v1');
  if (language) formData.append('language_code', language);

  const response = await fetch(`${ELEVENLABS_BASE_URL}/speech-to-text`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: formData,
  });
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(parseElevenLabsError(response.status, errorBody));
  }

  const data = await response.json();
  if (typeof data.text !== 'string' || !data.text.trim()) {
    throw new Error('No speech was detected in the audio');
  }
  return data.text.trim();
}

export function languageToElevenLabsCode(lang: Language): string {
  return lang;
}

const PRESET_VOICE_IDS = new Set([
  '21m00Tcm4TlvDq8ikWAM',
  'EXAVITQu4vr4xnSDxMaL',
  'ErXwobaYiN019PkySvjV',
  'AZnzlk1XvdvUeBnXmlld',
  'TxGEqnHWuWfNDDDT0TxF',
  'MF3mGyE0ClA1gsT3GTkC',
  'oxnbzdXqVokeUrUyaExS',
  'H1RPikOCj3XUOKuTygkn',
  'o6xBTVWnD2n3kEp4n1Jd',
  'C8ZGTRs8koIlo6hG4dtq',
  'UuZLlnj1jBHG1hpRKs2G',
  'FGY2Wh1qk4qLpW2n7p8H',
]);

function isClonedVoiceId(voiceId: string): boolean {
  return !PRESET_VOICE_IDS.has(voiceId);
}

export async function cloneVoiceFromAudio(
  apiKey: string,
  audioUrl: string,
  name: string,
): Promise<string> {
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) {
    throw new Error(`Failed to download audio file (${audioResponse.status})`);
  }
  const audioBlob = await audioResponse.blob();

  const formData = new FormData();
  formData.append('name', name);
  formData.append('files', audioBlob, 'voice-sample.mp3');

  const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/add`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Voice cloning failed (${response.status}): ${errorBody}`);
  }
  const data = await response.json();
  const voiceId = data.voice_id as string;

  // Examine the newly cloned voice to cache its inherent settings
  await fetchVoiceSettings(apiKey, voiceId);

  return voiceId;
}

export async function generateSpeechWithVoice({
  apiKey,
  text,
  voiceId,
  language,
  emotionalTone,
  speed,
  stability,
  similarityBoost,
  style,
  regionalAccent,
}: TTSRequest): Promise<Blob> {
  const cloned = isClonedVoiceId(voiceId);

  const toneConfig = emotionalTone
    ? EMOTIONAL_TONES.find((t) => t.id === emotionalTone)
    : undefined;

  const inherentSettings = cloned
    ? await fetchVoiceSettings(apiKey, voiceId)
    : null;

  let voiceSettings;
  if (cloned) {
    voiceSettings = getAccentAwareSettings(
      true, regionalAccent, inherentSettings,
      stability, similarityBoost, style,
    );
  } else if (toneConfig) {
    voiceSettings = {
      stability: stability ?? toneConfig.stability,
      similarity_boost: similarityBoost ?? toneConfig.similarity,
      style: style ?? toneConfig.style,
      use_speaker_boost: true,
    };
  } else {
    voiceSettings = {
      stability: stability ?? 0.5,
      similarity_boost: similarityBoost ?? 0.85,
      style: style ?? 0.0,
      use_speaker_boost: true,
    };
  }

  const accentText = regionalAccent && regionalAccent !== 'none'
    ? applyAccentToText(text, regionalAccent)
    : text;
  const finalText = addNaturalPauses(accentText);

  const accentKey = (regionalAccent ?? 'none') as RegionalAccent;
  const speedAdjust = cloned ? (ACCENT_VOICE_OVERRIDES[accentKey]?.speed_adjustment ?? 1.0) : 1.0;
  const effectiveSpeed = speed ?? speedAdjust;

  if (effectiveSpeed !== undefined && effectiveSpeed > 0 && effectiveSpeed !== 1.0) {
    voiceSettings = { ...voiceSettings, speed: effectiveSpeed };
  }

  const requestBody: Record<string, unknown> = {
    text: finalText,
    model_id: 'eleven_turbo_v2_5',
    language_code: language ?? 'en',
    voice_settings: voiceSettings,
  };

  const response = await fetch(
    `${ELEVENLABS_BASE_URL}/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify(requestBody),
    },
  );
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(parseElevenLabsError(response.status, errorBody));
  }
  return response.blob();
}
