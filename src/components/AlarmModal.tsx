import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Brain,
  Clock,
  FileAudio,
  Check,
  ChevronDown,
  Dumbbell,
  HeartHandshake,
  Loader2,
  Lock,
  Megaphone,
  MessageCircle,
  Moon,
  Pause,
  Pencil,
  Play,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  Vibrate,
  Volume2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { generateSpeechWithVoice, resolveVoiceId, cloneVoiceFromAudio, transcribeAudioFromUrl } from '@/lib/elevenlabs';
import { getRegionalAccentsForLanguage, applyAccentToText, type RegionalAccent } from '@/lib/regionalAccents';
import { blobTo432Url } from '@/lib/audio432';
import { VOICE_PERSONAS } from '@/lib/voices';
import { CLONED_VOICES, getClonedVoice } from '@/lib/clonedVoices';
import { MOTIVATORS } from '@/lib/motivators';
import { SCRIPT_CATEGORIES, getScriptsByCategory, getScript } from '@/lib/scripts';
import { useLanguage } from '@/hooks/useLanguage';
import { useAudioFiles } from '@/hooks/useAudioFiles';
import { DAY_LABELS, LOCALE_MAP, VIBRATION_PATTERNS, EMOTIONAL_TONES, translateLabel, type Alarm, type AlarmInsert, type AudioMode, type EmotionalTone, type Language, type VibrationPattern, type VoiceTier } from '@/lib/types';

interface AlarmModalProps {
  open: boolean;
  initial: Alarm | null;
  onClose: () => void;
  onSave: (alarm: AlarmInsert, id?: string) => void;
  isPremium: boolean;
  apiKey: string | null;
}

const makeDefaultInsert = (lang: Language): AlarmInsert => ({
  label: 'preset:wakeUp',
  time: '07:00',
  days: [true, true, true, true, true, false, false],
  enabled: true,
  voice_tier: 'standard',
  voice_persona: 'aura',
  motivator: 'daily_goal',
  subconscious_mode: false,
  subconscious_volume: 3,
  subconscious_repeats: 1,
  cloned_voice: null,
  script_id: null,
  language: lang,
  custom_text: null,
  audio_file_url: null,
  audio_mode: 'tts' as AudioMode,
  voice_clone_id: null,
  vibration_pattern: 'standard',
  emotional_tone: 'warm',
  voice_speed: 1.0,
  voice_stability: 0.5,
  voice_similarity: 1.0,
  regional_accent: 'none',
  transcription_text: null,
  dialect_text: null,
});

export function AlarmModal({ open, initial, onClose, onSave, isPremium, apiKey }: AlarmModalProps) {
  const { lang, t } = useLanguage();
  const [form, setForm] = useState<AlarmInsert>(() => makeDefaultInsert(lang));
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [originalPresetKey, setOriginalPresetKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [use432, setUse432] = useState(false);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, loading: audioFilesLoading, add: addAudioFile, rename: renameAudioFile, remove: removeAudioFile } = useAudioFiles();
  const [playingFileId, setPlayingFileId] = useState<string | null>(null);
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');

  const accentSampleText = t('alarm.accentPreviewSample');
  const [accentInputText, setAccentInputText] = useState('');
  const [accentPreviewPlaying, setAccentPreviewPlaying] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [showAudioText, setShowAudioText] = useState(false);

  const selectedScript = getScript(form.script_id);
  const effectiveScriptText = selectedScript?.text[form.language] ?? null;
  const accentBaseText = accentInputText.trim()
    || form.custom_text?.trim()
    || effectiveScriptText
    || accentSampleText;
  const accentPreviewText = form.regional_accent && form.regional_accent !== 'none'
    ? applyAccentToText(accentBaseText, form.regional_accent as RegionalAccent)
    : accentBaseText;

  useEffect(() => {
    if (open) {
      const presetKey = initial?.label?.startsWith('preset:') ? initial.label : null;
      setOriginalPresetKey(presetKey);
      setForm(
        initial
          ? {
              label: translateLabel(initial.label, t),
              time: initial.time,
              days: initial.days,
              enabled: initial.enabled,
              voice_tier: initial.voice_tier,
              voice_persona: initial.voice_persona,
              motivator: initial.motivator,
              subconscious_mode: initial.subconscious_mode,
              subconscious_volume: initial.subconscious_volume,
              subconscious_repeats: initial.subconscious_repeats ?? 1,
              cloned_voice: initial.cloned_voice,
              script_id: initial.script_id,
              language: initial.language,
              custom_text: initial.custom_text,
              audio_file_url: initial.audio_file_url,
              audio_mode: initial.audio_mode ?? 'tts',
              voice_clone_id: initial.voice_clone_id ?? null,
              vibration_pattern: initial.vibration_pattern ?? 'standard',
              emotional_tone: initial.emotional_tone ?? 'warm',
              voice_speed: initial.voice_speed ?? 1.0,
              voice_stability: initial.voice_stability ?? 0.5,
              voice_similarity: initial.voice_similarity ?? 1.0,
              regional_accent: initial.regional_accent ?? 'none',
              transcription_text: initial.transcription_text ?? null,
              dialect_text: initial.dialect_text ?? null,
            }
          : makeDefaultInsert(lang)
      );
      setPreviewing(null);
      setShowAudioText(false);
    }
  }, [open, initial, t]);

  useEffect(() => {
    if (open && form.language !== lang) {
      setForm((f) => ({ ...f, language: lang }));
    }
  }, [lang, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const [hh, mm] = form.time.split(':');
  const dayLabels = DAY_LABELS[lang];
  const filteredVoices = VOICE_PERSONAS.filter((v) => v.tier === form.voice_tier);
  const personaValid = filteredVoices.some((v) => v.id === form.voice_persona);
  const effectivePersona = personaValid ? form.voice_persona : filteredVoices[0]?.id;

  const toggleDay = (i: number) =>
    setForm((f) => ({ ...f, days: f.days.map((d, idx) => (idx === i ? !d : d)) }));

  const setTier = (tier: VoiceTier) => {
    const firstOfTier = VOICE_PERSONAS.find((v) => v.tier === tier)?.id;
    setForm((f) => ({ ...f, voice_tier: tier, voice_persona: firstOfTier ?? f.voice_persona }));
  };

  const PREVIEW_TEXT: Record<Language, string> = {
    en: 'Good morning. This is a voice preview. Rise and shine.',
    de: 'Guten Morgen. Dies ist eine Stimmvorschau. Wach auf und strahle.',
    es: 'Buenos días. Esta es una vista previa de la voz. Levántate y brilla.',
    fr: 'Bonjour. Ceci est un aperçu de la voix. Lève-toi et brille.',
    pt: 'Bom dia. Esta é uma prévia da voz. Levante-se e brilhe.',
    it: 'Buongiorno. Questa è un\'anteprima della voce. Alzati e brilla.',
  };

  const handlePreviewVoice = async (voiceId: string) => {
    if (previewing === voiceId) {
      setPreviewing(null);
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }
      return;
    }
    setPreviewing(voiceId);
    if (!apiKey) {
      setTtsError(t('alarm.ttsNoKey'));
      setPreviewing(null);
      return;
    }
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    setTtsError(null);
    try {
      const effectiveVoiceId = (form.audio_mode === 'clone' && form.voice_clone_id)
        ? form.voice_clone_id
        : resolveVoiceId(voiceId, form.language);
      const audioBlob = await generateSpeechWithVoice({
        apiKey,
        text: PREVIEW_TEXT[form.language],
        voiceId: effectiveVoiceId,
        language: form.language,
        emotionalTone: form.emotional_tone,
        speed: form.voice_speed,
        stability: form.voice_stability,
        similarityBoost: form.voice_similarity,
        regionalAccent: form.regional_accent as RegionalAccent,
      });
      const originalUrl = URL.createObjectURL(audioBlob);
      const audioUrl = use432 ? await blobTo432Url(audioBlob, originalUrl) : originalUrl;
      const audio = new Audio(audioUrl);
      ttsAudioRef.current = audio;
      audio.onended = () => {
        ttsAudioRef.current = null;
        setPreviewing(null);
        URL.revokeObjectURL(audioUrl);
        if (audioUrl !== originalUrl) URL.revokeObjectURL(originalUrl);
      };
      await audio.play();
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('alarm.ttsFailed');
      setTtsError(msg);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(PREVIEW_TEXT[form.language]);
        utterance.lang = LOCALE_MAP[form.language];
        utterance.onend = () => setPreviewing(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setPreviewing(null);
      }
    }
  };

  const handleTranscribeAudio = async (audioUrl = form.audio_file_url) => {
    if (!audioUrl || !apiKey) return;
    setTranscribing(true);
    setTtsError(null);
    try {
      const text = await transcribeAudioFromUrl(apiKey, audioUrl, form.language);
      const dialectText = form.regional_accent && form.regional_accent !== 'none'
        ? applyAccentToText(text, form.regional_accent as RegionalAccent)
        : text;
      setForm((f) => ({
        ...f,
        transcription_text: text,
        dialect_text: dialectText,
      }));
    } catch (e) {
      setTtsError(e instanceof Error ? e.message : t('alarm.transcriptionFailed'));
    } finally {
      setTranscribing(false);
    }
  };

  const handleAudioUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      let uploaded: Awaited<ReturnType<typeof addAudioFile>>;
      try {
        uploaded = await addAudioFile(file);
      } catch (e) {
        if (e instanceof Error && e.message === 'AUDIO_TOO_LONG') {
          alert(t('alarm.audioTooLong'));
        } else {
          alert(t('alarm.uploadFailed'));
        }
        return;
      }
      if (!uploaded) {
        alert(t('alarm.uploadFailed'));
        return;
      }
      setForm((f) => ({ ...f, audio_file_url: uploaded.url, audio_mode: 'direct', voice_clone_id: null, custom_text: null, transcription_text: null, dialect_text: null }));
      if (apiKey) void handleTranscribeAudio(uploaded.url);
    } finally {
      setUploading(false);
    }
  };

  const toggleLibraryAudio = (file: { id: string; url: string }) => {
    if (playingFileId === file.id) {
      ttsAudioRef.current?.pause();
      ttsAudioRef.current = null;
      setPlayingFileId(null);
      return;
    }
    ttsAudioRef.current?.pause();
    const audio = new Audio(file.url);
    ttsAudioRef.current = audio;
    setPlayingFileId(file.id);
    audio.onended = () => {
      ttsAudioRef.current = null;
      setPlayingFileId(null);
    };
    audio.play().catch(() => setPlayingFileId(null));
  };

  const formatLibraryDuration = (seconds: number | null) => {
    if (seconds == null) return '—';
    return `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`;
  };

  const confirmLibraryRename = async (id: string) => {
    const name = renameDraft.trim();
    if (name) await renameAudioFile(id, name);
    setRenamingFileId(null);
  };

  const handleTestTTS = async (overrideText?: string) => {
    const text = (overrideText ?? form.custom_text)?.trim();
    if (!text) return;
    if (!apiKey) {
      setTtsError(t('alarm.ttsNoKey'));
      return;
    }
    const voiceId = (form.audio_mode === 'clone' && form.voice_clone_id)
      ? form.voice_clone_id
      : resolveVoiceId(form.cloned_voice ?? form.voice_persona, form.language);
    if (!voiceId) {
      setTtsError(t('alarm.ttsNoVoice'));
      return;
    }
    setTtsLoading(true);
    setTtsError(null);
    try {
      const audioBlob = await generateSpeechWithVoice({
        apiKey,
        text,
        voiceId,
        language: form.language,
        emotionalTone: form.emotional_tone,
        speed: form.voice_speed,
        stability: form.voice_stability,
        similarityBoost: form.voice_similarity,
        regionalAccent: form.regional_accent as RegionalAccent,
      });
      const originalUrl = URL.createObjectURL(audioBlob);
      const audioUrl = use432 ? await blobTo432Url(audioBlob, originalUrl) : originalUrl;
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      ttsAudioRef.current = audio;
      audio.onended = () => {
        ttsAudioRef.current = null;
        URL.revokeObjectURL(audioUrl);
        if (audioUrl !== originalUrl) URL.revokeObjectURL(originalUrl);
      };
      await audio.play();
    } catch (e) {
      const raw = e instanceof Error ? e.message : '';
      const msg = raw.includes('402') ? t('alarm.ttsNoCredits') : (raw || t('alarm.ttsFailed'));
      setTtsError(msg);
    } finally {
      setTtsLoading(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setForm((f) => ({ ...f, custom_text: text.trim() || null }));
      }
    } catch {
      // clipboard read may be blocked; ignore silently
    }
  };

  const handleAccentPreviewPlay = async () => {
    if (accentPreviewPlaying) {
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }
      setAccentPreviewPlaying(false);
      return;
    }
    const textToPlay = accentPreviewText.trim();
    if (!textToPlay) return;
    if (!apiKey) {
      setTtsError(t('alarm.ttsNoKey'));
      return;
    }
    const voiceId = (form.audio_mode === 'clone' && form.voice_clone_id)
      ? form.voice_clone_id
      : resolveVoiceId(form.cloned_voice ?? form.voice_persona, form.language);
    if (!voiceId) {
      setTtsError(t('alarm.ttsNoVoice'));
      return;
    }
    setAccentPreviewPlaying(true);
    setTtsError(null);
    try {
      const audioBlob = await generateSpeechWithVoice({
        apiKey,
        text: textToPlay,
        voiceId,
        language: form.language,
        emotionalTone: form.emotional_tone,
        speed: form.voice_speed,
        stability: form.voice_stability,
        similarityBoost: form.voice_similarity,
        regionalAccent: form.regional_accent as RegionalAccent,
      });
      const originalUrl = URL.createObjectURL(audioBlob);
      const audioUrl = use432 ? await blobTo432Url(audioBlob, originalUrl) : originalUrl;
      if (ttsAudioRef.current) ttsAudioRef.current.pause();
      const audio = new Audio(audioUrl);
      ttsAudioRef.current = audio;
      audio.onended = () => {
        ttsAudioRef.current = null;
        setAccentPreviewPlaying(false);
        URL.revokeObjectURL(audioUrl);
        if (audioUrl !== originalUrl) URL.revokeObjectURL(originalUrl);
      };
      await audio.play();
    } catch (e) {
      const raw = e instanceof Error ? e.message : '';
      const msg = raw.includes('402') ? t('alarm.ttsNoCredits') : (raw || t('alarm.ttsFailed'));
      setTtsError(msg);
      setAccentPreviewPlaying(false);
    }
  };

  const handleCloneVoice = async () => {
    if (!form.audio_file_url || !apiKey) return;
    setCloning(true);
    setTtsError(null);
    try {
      const voiceId = await cloneVoiceFromAudio(
        apiKey,
        form.audio_file_url,
        `WaykeUp-${Date.now()}`,
      );
      setForm((f) => ({ ...f, voice_clone_id: voiceId, audio_mode: 'clone' }));
    } catch (e) {
      const raw = e instanceof Error ? e.message : '';
      setTtsError(raw.includes('voice_limit_reached')
        ? t('alarm.voiceLimitReached')
        : (raw || t('alarm.cloneFailed')));
    } finally {
      setCloning(false);
    }
  };

  const handleSave = () => {
    let labelToSave = form.label;
    if (originalPresetKey && translateLabel(originalPresetKey, t) === form.label) {
      labelToSave = originalPresetKey;
    }
    const payload = { ...form, label: labelToSave, voice_persona: effectivePersona ?? form.voice_persona };
    if (!isPremium && !form.subconscious_mode) {
      payload.custom_text = null;
      payload.cloned_voice = null;
    }
    onSave(payload, initial?.id);
  };

  const useCloned = form.cloned_voice !== null;
  const hasAudio = form.audio_file_url !== null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-ink-950/95 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-white">
          {initial ? t('alarm.editAlarm') : t('alarm.newAlarm')}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-ink-700 hover:text-white"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('alarm.label')}
          </label>
          <input
            type="text"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-white outline-none transition-colors focus:border-accent-cyan"
            placeholder={t('alarm.labelPlaceholder')}
          />
        </section>

        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('alarm.time')}
          </label>
          <div className="mt-2 flex items-center justify-center gap-3 rounded-2xl border border-ink-600 bg-ink-800 py-6">
            <TimeWheel
              value={Number(hh)}
              min={0}
              max={23}
              onChange={(v) =>
                setForm((f) => ({ ...f, time: `${String(v).padStart(2, '0')}:${mm}` }))
              }
            />
            <span className="font-mono text-4xl text-accent-cyan/60">:</span>
            <TimeWheel
              value={Number(mm)}
              min={0}
              max={59}
              onChange={(v) =>
                setForm((f) => ({ ...f, time: `${hh}:${String(v).padStart(2, '0')}` }))
              }
            />
          </div>
        </section>

        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('alarm.repeat')}
          </label>
          <div className="mt-2 flex justify-between gap-1.5">
            {dayLabels.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={`flex h-11 flex-1 items-center justify-center rounded-xl text-xs font-medium transition-all ${
                  form.days[i]
                    ? 'bg-accent-cyan/15 text-accent-cyan ring-1 ring-accent-cyan/40'
                    : 'bg-ink-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Voice tier */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('alarm.voiceTier')}
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <TierButton
              active={form.voice_tier === 'standard'}
              onClick={() => setTier('standard')}
              title={t('alarm.standard')}
              subtitle={t('alarm.standardSub')}
            />
            <TierButton
              active={form.voice_tier === 'premium'}
              onClick={() => setTier('premium')}
              title={t('alarm.premium')}
              subtitle={t('alarm.premiumSub')}
              badge={t('alarm.pro')}
            />
          </div>
        </section>

        {/* Audio File Upload (Standard mode) */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('alarm.audioFile')}
          </label>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('alarm.audioFileDesc')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.m4a,audio/mpeg,audio/wav,audio/mp4,audio/x-m4a,audio/m4a"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAudioUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`mt-2 flex w-full items-center gap-3 rounded-xl border border-ink-600 bg-ink-800 p-4 text-left transition-all hover:border-accent-cyan/50 disabled:opacity-50 ${
              hasAudio ? 'border-accent-cyan/40' : ''
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-700 text-accent-cyan">
              {hasAudio ? <FileAudio className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                {uploading
                  ? t('alarm.uploading')
                  : hasAudio
                    ? t('alarm.audioUploaded')
                    : t('alarm.uploadAudio')}
              </p>
              <p className="text-xs text-slate-400">
                {hasAudio ? t('alarm.audioReplaceHint') : t('alarm.audioFormats')}
              </p>
            </div>
          </button>

          <div className="mt-3 rounded-xl border border-ink-700 bg-ink-900/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  {t('audioLibrary.title')}
                </p>
                <span className="text-[10px] text-slate-600">{files.length}</span>
              </div>
              <div className="space-y-1.5">
                {audioFilesLoading && (
                  <p className="py-2 text-center text-[11px] text-slate-500">{t('audioLibrary.loading')}</p>
                )}
                {!audioFilesLoading && files.length === 0 && (
                  <p className="py-2 text-center text-[11px] text-slate-500">{t('audioLibrary.emptyDesc')}</p>
                )}
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${
                      form.audio_file_url === file.url
                        ? 'border-accent-cyan/40 bg-accent-cyan/5'
                        : 'border-ink-700 bg-ink-800/60'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleLibraryAudio(file)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-accent-cyan hover:bg-ink-700"
                      aria-label={playingFileId === file.id ? t('audioLibrary.pause') : t('audioLibrary.play')}
                    >
                      {playingFileId === file.id ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                      setForm((f) => ({ ...f, audio_file_url: file.url, audio_mode: 'direct', voice_clone_id: null, custom_text: null, transcription_text: null, dialect_text: null }));
                      if (apiKey) void handleTranscribeAudio(file.url);
                    }}
                      className="min-w-0 flex-1 text-left"
                    >
                      {renamingFileId === file.id ? (
                        <input
                          type="text"
                          value={renameDraft}
                          onChange={(e) => setRenameDraft(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') confirmLibraryRename(file.id);
                            if (e.key === 'Escape') setRenamingFileId(null);
                          }}
                          autoFocus
                          className="w-full rounded border border-accent-cyan/40 bg-ink-950 px-1.5 py-0.5 text-xs text-white outline-none"
                        />
                      ) : (
                        <span className="block truncate text-xs font-medium text-slate-200">{file.name}</span>
                      )}
                      <span className={`flex items-center gap-1 text-[10px] ${file.duration_seconds != null && file.duration_seconds > 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                        <Clock className="h-2.5 w-2.5" /> {formatLibraryDuration(file.duration_seconds)}
                        {file.duration_seconds != null && file.duration_seconds > 60 && ' · >60s'}
                      </span>
                    </button>
                    {renamingFileId === file.id ? (
                      <button
                        type="button"
                        onClick={() => confirmLibraryRename(file.id)}
                        className="rounded p-1 text-accent-cyan hover:bg-ink-700"
                        aria-label={t('audioLibrary.rename')}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setRenamingFileId(file.id);
                            setRenameDraft(file.name);
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-ink-700 hover:text-accent-cyan"
                          aria-label={t('audioLibrary.rename')}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAudioFile(file.id)}
                          className="rounded p-1 text-slate-500 hover:bg-ink-700 hover:text-rose-400"
                          aria-label={t('audioLibrary.delete')}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

          {hasAudio && form.audio_mode === 'direct' && (
            <button
              type="button"
              onClick={() => setShowAudioText((visible) => !visible)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-2.5 text-xs font-semibold text-accent-cyan transition-all hover:bg-accent-cyan/20 active:scale-[0.98]"
            >
              <FileAudio className="h-4 w-4" />
              {showAudioText ? t('alarm.hideAudioText') : t('alarm.showAudioText')}
            </button>
          )}

          {hasAudio && (
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, audio_file_url: null, audio_mode: 'tts', voice_clone_id: null }))}
              className="mt-1 text-xs font-medium text-rose-400 transition-colors hover:text-rose-300"
            >
              {t('alarm.removeAudio')}
            </button>
          )}
          {hasAudio && (
            <div className="mt-3 rounded-xl border border-ink-700 bg-ink-900/60 p-3">
              <p className="text-xs font-medium text-slate-400">{t('alarm.audioModeTitle')}</p>
              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAudioText(false);
                    setForm((f) => ({ ...f, audio_mode: 'direct', custom_text: null }));
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-all ${
                    form.audio_mode === 'direct'
                      ? 'border-accent-cyan/50 bg-ink-800'
                      : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                  }`}
                >
                  <FileAudio className="h-4 w-4 shrink-0 text-accent-cyan" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t('alarm.audioModeDirect')}</p>
                    <p className="text-[11px] text-slate-500">{t('alarm.audioModeDirectDesc')}</p>
                  </div>
                  {form.audio_mode === 'direct' && <Check className="ml-auto h-4 w-4 text-accent-cyan" />}
                </button>
                {isPremium && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAudioText(false);
                      setForm((f) => ({ ...f, audio_mode: 'clone' }));
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-all ${
                      form.audio_mode === 'clone'
                        ? 'border-accent-indigo/50 bg-ink-800'
                        : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 shrink-0 text-accent-indigo" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{t('alarm.audioModeClone')}</p>
                      <p className="text-[11px] text-slate-500">{t('alarm.audioModeCloneDesc')}</p>
                    </div>
                    {form.audio_mode === 'clone' && <Check className="ml-auto h-4 w-4 text-accent-indigo" />}
                  </button>
                )}
              </div>
              {form.audio_mode === 'clone' && isPremium && (
                <div className="mt-2">
                  {form.voice_clone_id ? (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                      {t('alarm.voiceCloned')}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCloneVoice}
                      disabled={cloning || !apiKey}
                      className="flex items-center gap-2 rounded-lg border border-accent-indigo/40 bg-accent-indigo/10 px-3 py-2 text-xs font-semibold text-accent-indigo transition-all hover:bg-accent-indigo/20 disabled:opacity-40 active:scale-[0.98]"
                    >
                      {cloning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {cloning ? t('alarm.cloning') : t('alarm.cloneVoice')}
                    </button>
                  )}
                  {!apiKey && (
                    <p className="mt-1 text-[11px] text-slate-500">{t('alarm.ttsNoKeyHint')}</p>
                  )}
                </div>
              )}
              {form.audio_mode === 'clone' && !isPremium && (
                <p className="mt-2 text-[11px] text-slate-500">{t('alarm.audioModeClonePremium')}</p>
              )}
            </div>
          )}
        </section>

        {/* Audio words and dialect editor */}
        {hasAudio && form.audio_mode === 'direct' && showAudioText && (
          <section className="rounded-2xl border border-accent-cyan/25 bg-accent-cyan/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{t('alarm.transcriptionTitle')}</p>
                <p className="mt-0.5 text-xs text-slate-400">{t('alarm.transcriptionDesc')}</p>
              </div>
              {transcribing && (
                <span className="flex items-center gap-1.5 rounded-full bg-accent-cyan/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-accent-cyan">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {t('alarm.transcribing')}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => void handleTranscribeAudio()}
              disabled={transcribing || !apiKey}
              className="mt-3 flex items-center gap-2 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-2 text-xs font-semibold text-accent-cyan transition-all hover:bg-accent-cyan/20 disabled:opacity-40 active:scale-[0.98]"
            >
              {transcribing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileAudio className="h-4 w-4" />}
              {transcribing ? t('alarm.transcribing') : t('alarm.transcribeAudio')}
            </button>
            <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {t('alarm.originalTranscript')}
            </label>
            <textarea
              value={form.transcription_text ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, transcription_text: e.target.value.slice(0, 750) || null }))}
              maxLength={750}
              rows={3}
              placeholder={t('alarm.transcriptionPlaceholder')}
              className="mt-2 w-full resize-none rounded-xl border border-ink-600 bg-ink-800 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent-cyan"
            />
            <p className="mt-1 text-right text-[10px] text-slate-600">
              {(form.transcription_text ?? '').length}/750
            </p>
            <div className="mt-4 flex items-center justify-between">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {t('alarm.dialectVersion')}
              </label>
              <select
                value={form.regional_accent}
                onChange={(e) => {
                  const accent = e.target.value as RegionalAccent;
                  setForm((f) => {
                    const source = f.transcription_text ?? f.custom_text ?? '';
                    return {
                      ...f,
                      regional_accent: accent,
                      dialect_text: source
                        ? (accent === 'none' ? source : applyAccentToText(source, accent))
                        : f.dialect_text,
                    };
                  });
                }}
                className="rounded-lg border border-ink-600 bg-ink-800 px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-accent-cyan"
              >
                {getRegionalAccentsForLanguage(form.language).map((accent) => (
                  <option key={accent.id} value={accent.id}>{accent.name[form.language]}</option>
                ))}
              </select>
            </div>
            {form.regional_accent !== 'none' && (
              <>
                <textarea
                  value={form.dialect_text ?? ''}
                  onChange={(e) => setForm((f) => ({
                    ...f,
                    dialect_text: e.target.value || null,
                  }))}
                  rows={3}
                  placeholder={t('alarm.dialectPlaceholder')}
                  className="mt-2 w-full resize-none rounded-xl border border-accent-cyan/30 bg-ink-800 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-accent-cyan"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const text = form.dialect_text?.trim();
                      if (text) void handleTestTTS(text);
                    }}
                    disabled={ttsLoading || !form.dialect_text?.trim() || !apiKey}
                    className="flex items-center gap-2 rounded-lg bg-accent-cyan px-3 py-2 text-xs font-semibold text-ink-950 transition-all hover:shadow-glow disabled:opacity-40 active:scale-[0.98]"
                  >
                    {ttsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
                    {t('alarm.testDialectAlarm')}
                  </button>

                </div>
              </>
            )}
            {!apiKey && <p className="mt-2 text-[11px] text-slate-500">{t('alarm.ttsNoKeyHint')}</p>}
          </section>
        )}

        {/* Custom Text (Premium only) */}
        <section className={`rounded-2xl border p-4 ${isPremium ? 'border-accent-indigo/30 bg-accent-indigo/5' : 'border-ink-700 bg-ink-900/40'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isPremium ? 'bg-accent-indigo/15 text-accent-indigo' : 'bg-ink-700 text-slate-500'}`}>
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{t('alarm.customText')}</p>
                <p className="text-xs text-slate-400">{t('alarm.customTextDesc')}</p>
              </div>
            </div>
            {!isPremium && !form.subconscious_mode && (
              <span className="rounded-full bg-accent-indigo/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-indigo">
                {t('alarm.upgrade')}
              </span>
            )}
          </div>
          {isPremium || form.subconscious_mode ? (
            <>
              <textarea
                value={form.custom_text ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, custom_text: e.target.value.slice(0, 750) || null }))}
                maxLength={750}
                className="mt-3 w-full resize-none rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-accent-indigo"
                rows={3}
                placeholder={t('alarm.customTextPlaceholder')}
              />
              <p className="mt-1 text-right text-[10px] text-slate-600">
                {(form.custom_text ?? '').length}/750
              </p>
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="mt-2 flex items-center gap-2 rounded-lg border border-accent-indigo/40 bg-accent-indigo/10 px-3 py-2 text-xs font-semibold text-accent-indigo transition-all hover:bg-accent-indigo/20 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                {t('alarm.pasteFromWhatsapp')}
              </button>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTestTTS()}
                  disabled={ttsLoading || !form.custom_text?.trim()}
                  className="flex items-center gap-2 rounded-lg border border-accent-indigo/40 bg-accent-indigo/10 px-3 py-2 text-xs font-semibold text-accent-indigo transition-all hover:bg-accent-indigo/20 disabled:opacity-40 active:scale-[0.98]"
                >
                  {ttsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                  {ttsLoading ? t('alarm.ttsGenerating') : t('alarm.ttsTest')}
                </button>
                {!apiKey && (
                  <span className="text-[11px] text-slate-500">{t('alarm.ttsNoKeyHint')}</span>
                )}
              </div>
              {ttsError && (
                <p className="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                  {ttsError}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-ink-600 bg-ink-800/50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent-cyan" />
                  <div>
                    <p className="text-xs font-semibold text-white">{t('alarm.frequency432')}</p>
                    <p className="text-[10px] text-slate-500">{t('alarm.frequency432Desc')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={use432}
                  onClick={() => setUse432((v) => !v)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
                    use432 ? 'bg-accent-cyan' : 'bg-ink-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      use432 ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800/50 px-4 py-3 text-sm text-slate-500">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{t('alarm.upgradeForCustomText')}</span>
            </div>
          )}
        </section>

        {/* Regional Accent Selector with Live Preview */}
        {getRegionalAccentsForLanguage(form.language).length > 1 && (
          <section className="rounded-2xl border border-ink-700 bg-ink-900/60 p-4">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t('alarm.regionalAccent')}
            </label>
            <p className="mt-0.5 text-[11px] text-slate-600">{t('alarm.regionalAccentDesc')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {getRegionalAccentsForLanguage(form.language).map((accent) => (
                <button
                  key={accent.id}
                  type="button"
                  onClick={() => setForm((f) => {
                          const source = f.transcription_text ?? f.custom_text ?? '';
                          return {
                            ...f,
                            regional_accent: accent.id,
                            dialect_text: source
                              ? (accent.id === 'none' ? source : applyAccentToText(source, accent.id))
                              : f.dialect_text,
                          };
                        })}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    form.regional_accent === accent.id
                      ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
                      : 'border-ink-700 bg-ink-900/60 text-slate-400 hover:text-slate-200 hover:border-ink-600'
                  }`}
                >
                  <span className="text-base">{accent.emoji}</span>
                  {accent.name[form.language]}
                </button>
              ))}
            </div>
            {form.regional_accent !== 'none' && (
              <p className="mt-2 text-[10px] text-slate-500">
                {getRegionalAccentsForLanguage(form.language).find((a) => a.id === form.regional_accent)?.description[form.language]}
              </p>
            )}
            {form.regional_accent !== 'none' && (
              <div className="mt-3 rounded-xl border border-accent-cyan/20 bg-ink-950/60 p-3">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-accent-cyan" />
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-accent-cyan">
                    {t('alarm.accentPreview')}
                  </p>
                </div>
                <p className="text-[10px] text-slate-600 mb-2">{t('alarm.accentPreviewHint')}</p>
                <input
                  type="text"
                  value={accentInputText}
                  onChange={(e) => setAccentInputText(e.target.value)}
                  placeholder={t('alarm.accentPreviewInputPlaceholder')}
                  className="mb-2 w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-xs text-white outline-none transition-colors focus:border-accent-cyan"
                />
                <div className="space-y-2">
                  <div className="rounded-lg border border-ink-700 bg-ink-800/40 p-2.5">
                    <div className="mb-1 flex items-center gap-1.5">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-600">{t('alarm.originalLabel')}</p>
                      {accentInputText.trim() ? (
                        <span className="rounded-full bg-ink-700 px-1.5 py-0.5 text-[8px] text-slate-400">{t('alarm.accentPreviewInputPlaceholder').slice(0, 12)}</span>
                      ) : form.custom_text?.trim() ? (
                        <span className="rounded-full bg-accent-indigo/20 px-1.5 py-0.5 text-[8px] text-accent-indigo">{t('alarm.customText')}</span>
                      ) : effectiveScriptText ? (
                        <span className="rounded-full bg-accent-cyan/20 px-1.5 py-0.5 text-[8px] text-accent-cyan">{t('alarm.script')}</span>
                      ) : null}
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">{accentBaseText}</p>
                  </div>
                  <div className="rounded-lg border border-accent-cyan/30 bg-accent-cyan/5 p-2.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-accent-cyan mb-1">
                      {getRegionalAccentsForLanguage(form.language).find((a) => a.id === form.regional_accent)?.name[form.language]}
                    </p>
                    <p className="text-xs leading-relaxed text-accent-cyan/90">{accentPreviewText}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAccentPreviewPlay}
                  disabled={!apiKey && !accentPreviewText.trim()}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-accent-cyan/40 bg-accent-cyan/10 px-3 py-2 text-xs font-semibold text-accent-cyan transition-all hover:bg-accent-cyan/20 disabled:opacity-40 active:scale-[0.98]"
                >
                  {accentPreviewPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      {t('alarm.accentPreviewStop')}
                    </>
                  ) : (
                    <>
                      {ttsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      {t('alarm.accentPreviewPlay')}
                    </>
                  )}
                </button>
                {!apiKey && (
                  <p className="mt-1.5 text-center text-[10px] text-slate-600">{t('alarm.ttsNoKeyHint')}</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* Emotional Tone Selector (Premium only) */}
        <section className={`rounded-2xl border p-4 ${isPremium ? 'border-accent-cyan/20 bg-ink-900/40' : 'border-ink-700 bg-ink-900/40'}`}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t('alarm.emotionalTone')}
            </label>
            {!isPremium && (
              <span className="rounded-full bg-accent-indigo/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-indigo">
                {t('alarm.upgrade')}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('alarm.emotionalToneDesc')}</p>
          {isPremium ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {EMOTIONAL_TONES.map((tone) => {
                const isActive = form.emotional_tone === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, emotional_tone: tone.id as EmotionalTone }))}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? 'border-accent-cyan/50 bg-ink-800'
                        : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${isActive ? 'text-accent-cyan' : 'text-white'}`}>
                      {tone.name[lang]}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                      {tone.description[lang]}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800/50 px-4 py-3 text-sm text-slate-500">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{t('alarm.upgradeForEmotionalTone')}</span>
            </div>
          )}
        </section>

        {/* Voice Naturalness Controls (Premium only) */}
        <section className={`rounded-2xl border p-4 ${isPremium ? 'border-accent-cyan/20 bg-ink-900/40' : 'border-ink-700 bg-ink-900/40'}`}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t('alarm.voiceSettings')}
            </label>
            {!isPremium && (
              <span className="rounded-full bg-accent-indigo/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-indigo">
                {t('alarm.upgrade')}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('alarm.voiceSettingsDesc')}</p>
          {isPremium ? (
            <div className="mt-3 space-y-4">
              <VoiceSlider
                label={t('alarm.voiceSpeed')}
                value={form.voice_speed}
                min={0.7}
                max={1.3}
                step={0.05}
                format={(v) => `${v.toFixed(2)}x`}
                onChange={(v) => setForm((f) => ({ ...f, voice_speed: v }))}
              />
              <VoiceSlider
                label={t('alarm.voiceStability')}
                hint={t('alarm.voiceStabilityHint')}
                value={form.voice_stability}
                min={0}
                max={1}
                step={0.05}
                format={(v) => `${Math.round(v * 100)}%`}
                onChange={(v) => setForm((f) => ({ ...f, voice_stability: v }))}
              />
              <VoiceSlider
                label={t('alarm.voiceSimilarity')}
                hint={t('alarm.voiceSimilarityHint')}
                value={form.voice_similarity}
                min={0}
                max={1}
                step={0.05}
                format={(v) => `${Math.round(v * 100)}%`}
                onChange={(v) => setForm((f) => ({ ...f, voice_similarity: v }))}
              />
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800/50 px-4 py-3 text-sm text-slate-500">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{t('alarm.upgradeForVoiceSettings')}</span>
            </div>
          )}
        </section>

        {/* Vibration & Frequency Pattern */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('alarm.vibrationPattern')}
          </label>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('alarm.vibrationPatternDesc')}</p>
          <div className="mt-2 space-y-2">
            {VIBRATION_PATTERNS.map((vp) => {
              const isActive = form.vibration_pattern === vp.id;
              return (
                <button
                  key={vp.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, vibration_pattern: vp.id as VibrationPattern }))}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    isActive
                      ? 'border-accent-cyan/50 bg-ink-800'
                      : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                  }`}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-accent-cyan/15 text-accent-cyan' : 'bg-ink-700 text-slate-400'}`}>
                    <Vibrate className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{vp.name[lang]}</p>
                      {vp.frequency !== '—' && (
                        <span className="rounded-full bg-ink-700 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">
                          {vp.frequency}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{vp.description[lang]}</p>
                  </div>
                  {isActive && <Check className="h-5 w-5 text-accent-cyan" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* Voice persona / Cloned voice toggle */}
        <section>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {useCloned ? t('alarm.clonedVoice') : t('alarm.voicePersona')}
            </label>
            <button
              type="button"
              disabled={!isPremium}
              onClick={() =>
                setForm((f) => ({
                  ...f,
                  cloned_voice: f.cloned_voice === null ? 'oma' : null,
                }))
              }
              className={`text-xs font-medium transition-colors ${
                isPremium
                  ? 'text-accent-cyan hover:text-accent-cyan/80'
                  : 'cursor-not-allowed text-slate-600'
              }`}
            >
              {useCloned ? t('alarm.voicePersona') : t('alarm.clonedVoice')}
            </button>
          </div>

          {!useCloned ? (
            <div className="mt-2 space-y-2">
              {filteredVoices.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, voice_persona: v.id }))}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    effectivePersona === v.id
                      ? 'border-accent-cyan/50 bg-ink-800'
                      : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                  }`}
                >
                  <span
                    className="h-9 w-9 shrink-0 rounded-full"
                    style={{ backgroundColor: v.accent }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{v.name[lang]}</p>
                    <p className="text-xs text-slate-400">{v.description[lang]}</p>
                  </div>
                  <PreviewButton
                    active={previewing === v.id}
                    onClick={() => handlePreviewVoice(v.id)}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {CLONED_VOICES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, cloned_voice: v.id }))}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    form.cloned_voice === v.id
                      ? 'border-accent-indigo/50 bg-ink-800'
                      : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                  }`}
                >
                  <span
                    className="h-9 w-9 shrink-0 rounded-full"
                    style={{ backgroundColor: v.accent }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{v.name[lang]}</p>
                    <p className="text-xs text-slate-400">{v.description[lang]}</p>
                  </div>
                  <PreviewButton
                    active={previewing === v.id}
                    onClick={() => handlePreviewVoice(v.id)}
                  />
                </button>
              ))}
            </div>
          )}
          {previewing && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-ink-800 px-3 py-2 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-cyan" />
              {t('alarm.previewing')}{' '}
              {(getClonedVoice(previewing) ?? VOICE_PERSONAS.find((v) => v.id === previewing))?.name?.[lang]}…
            </div>
          )}
        </section>

        {/* Motivation Script Library */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('alarm.script')}
          </label>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('alarm.scriptSub')}</p>
          <div className="mt-2 space-y-3">
            {SCRIPT_CATEGORIES.map((cat) => {
              const Icon = iconFor(cat.icon);
              const catScripts = getScriptsByCategory(cat.id);
              return (
                <div key={cat.id} className="rounded-xl border border-ink-700 bg-ink-900/60 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-700 text-accent-cyan">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-white">{cat.name[form.language]}</p>
                  </div>
                  <div className="mt-2 space-y-2">
                    {catScripts.map((s) => (
                      <div
                        key={s.id}
                        className={`rounded-lg border p-2 transition-all ${
                          form.script_id === s.id
                            ? 'border-accent-cyan/40 bg-ink-800'
                            : 'border-transparent hover:bg-ink-800/50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              script_id: f.script_id === s.id ? null : s.id,
                            }))
                          }
                          className="flex w-full items-start gap-2 text-left"
                        >
                          <span
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                              form.script_id === s.id
                                ? 'border-accent-cyan bg-accent-cyan'
                                : 'border-ink-500'
                            }`}
                          >
                            {form.script_id === s.id && (
                              <Check className="h-3 w-3 text-ink-950" />
                            )}
                          </span>
                          <p className="text-xs leading-relaxed text-slate-400">
                            {s.text[form.language]}
                          </p>
                        </button>
                        <div className="mt-2 flex gap-2 pl-6">
                          <button
                            type="button"
                            onClick={() =>
                              setForm((f) => ({ ...f, custom_text: s.text[f.language] }))
                            }
                            className="rounded-md border border-ink-600 px-2 py-1 text-[10px] font-medium text-slate-300 transition-colors hover:border-accent-cyan hover:text-accent-cyan"
                          >
                            {t('alarm.useScriptText')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTestTTS(s.text[form.language])}
                            disabled={ttsLoading}
                            className="flex items-center gap-1 rounded-md border border-ink-600 px-2 py-1 text-[10px] font-medium text-slate-300 transition-colors hover:border-accent-cyan hover:text-accent-cyan disabled:opacity-40"
                          >
                            {ttsLoading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                            {ttsLoading ? t('alarm.ttsGenerating') : t('alarm.ttsTest')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Subconscious Mode */}
        <section className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                <Moon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{t('alarm.subconsciousMode')}</p>
                <p className="mt-0.5 text-xs text-slate-400">{t('alarm.subconsciousDesc')}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.subconscious_mode}
              onClick={() => setForm((f) => ({ ...f, subconscious_mode: !f.subconscious_mode }))}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                form.subconscious_mode ? 'bg-violet-500' : 'bg-ink-600'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  form.subconscious_mode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {form.subconscious_mode && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t('alarm.volume')}</span>
                <span className="font-mono font-semibold text-violet-300">
                  {form.subconscious_volume}%
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={form.subconscious_volume}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subconscious_volume: Number(e.target.value) }))
                }
                className="mt-2 w-full accent-violet-500"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-600">
                <span>1%</span>
                <span>10%</span>
              </div>
            </div>
          )}
          {form.subconscious_mode && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{t('alarm.subconsciousRepeats')}</span>
                <span className="font-mono font-semibold text-violet-300">
                  {form.subconscious_repeats}x
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-600">{t('alarm.subconsciousRepeatsHint')}</p>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, subconscious_repeats: n }))}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all ${
                      form.subconscious_repeats === n
                        ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                        : 'border-ink-700 bg-ink-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {n}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Volume control — always visible */}
        <section className="rounded-2xl border border-ink-700 bg-ink-900/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t('alarm.volume')}</span>
            <span className="font-mono font-semibold text-accent-cyan">
              {form.subconscious_volume}%
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-600">{t('alarm.volumeAlwaysDesc')}</p>
          <input
            type="range"
            min={1}
            max={10}
            value={form.subconscious_volume}
            onChange={(e) =>
              setForm((f) => ({ ...f, subconscious_volume: Number(e.target.value) }))
            }
            className="mt-2 w-full accent-accent-cyan"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-600">
            <span>1%</span>
            <span>10%</span>
          </div>
        </section>

        {/* Motivator */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('alarm.motivator')}
          </label>
          <div className="mt-2 space-y-2">
            {MOTIVATORS.map((m) => {
              const Icon = iconFor(m.icon);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, motivator: m.id }))}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    form.motivator === m.id
                      ? 'border-accent-indigo/50 bg-ink-800'
                      : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-700 text-accent-indigo">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{m.name[lang]}</p>
                    <p className="text-xs text-slate-400">{m.description[lang]}</p>
                  </div>
                  {form.motivator === m.id && <Check className="h-5 w-5 text-accent-indigo" />}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="border-t border-ink-700/60 px-5 py-4">
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-xl bg-accent-cyan py-3.5 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
        >
          {initial ? t('alarm.saveChanges') : t('alarm.save')}
        </button>
      </div>
    </div>
  );
}

function TimeWheel({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const { t } = useTranslation();
  const wrap = (v: number) => ((v - min + (max - min + 1)) % (max - min + 1)) + min;
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => onChange(wrap(value + 1))}
        className="text-slate-600 transition-colors hover:text-accent-cyan"
        aria-label={t('alarm.increment')}
      >
        <ChevronDown className="h-5 w-5 rotate-180" />
      </button>
      <span className="my-1 font-mono text-5xl font-semibold tabular-nums text-white">
        {String(value).padStart(2, '0')}
      </span>
      <button
        type="button"
        onClick={() => onChange(wrap(value - 1))}
        className="text-slate-600 transition-colors hover:text-accent-cyan"
        aria-label={t('alarm.decrement')}
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
}

function TierButton({
  active,
  onClick,
  title,
  subtitle,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-xl border p-3 text-left transition-all ${
        active
          ? 'border-accent-cyan/50 bg-ink-800'
          : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
      }`}
    >
      {badge && (
        <span className="absolute right-2 top-2 rounded-full bg-accent-indigo/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-indigo">
          {badge}
        </span>
      )}
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </button>
  );
}

function PreviewButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-600 text-slate-300 transition-colors hover:border-accent-cyan hover:text-accent-cyan"
      aria-label={t('alarm.previewVoice')}
    >
      {active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </button>
  );
}

function iconFor(name: string): LucideIcon {
  const map: Record<string, LucideIcon> = {
    Target,
    Dumbbell,
    Megaphone,
    HeartHandshake,
    Brain,
    TrendingUp,
    Moon,
    Trophy,
  };
  return map[name] ?? Target;
}

function VoiceSlider({
  label,
  hint,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono font-semibold text-accent-cyan">{format(value)}</span>
      </div>
      {hint && <p className="mt-0.5 text-[10px] text-slate-600">{hint}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-accent-cyan"
      />
    </div>
  );
}
