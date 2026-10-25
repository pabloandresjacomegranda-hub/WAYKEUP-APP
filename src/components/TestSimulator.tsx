import { useEffect, useRef, useState } from 'react';
import { AlarmClock, Lock, Megaphone, Moon, Pause, Play, Sparkles, Trophy, X } from 'lucide-react';
import { Waveform } from './Waveform';
import { getVoicePersona } from '@/lib/voices';
import { getClonedVoice } from '@/lib/clonedVoices';
import { getMotivator } from '@/lib/motivators';
import { getScript, SCRIPTS } from '@/lib/scripts';
import { useLanguage } from '@/hooks/useLanguage';
import { LOCALE_MAP, translateLabel, type Alarm, type Language } from '@/lib/types';
import { PITCH_432 } from '@/lib/audio432';
import { generateSpeech, generateSpeechWithVoice } from '@/lib/elevenlabs';
import { blobTo432Url } from '@/lib/audio432';

interface TestSimulatorProps {
  alarm: Alarm;
  onClose: () => void;
  isPremium: boolean;
  apiKey: string | null;
}

type ClipId = 'subconscious' | 'reward' | 'accountability';

interface Clip {
  id: ClipId;
  scriptId: string;
  icon: typeof Moon;
  accentClass: string;
  bgClass: string;
  labelKey: string;
  descKey: string;
}

const CLIPS: Clip[] = [
  {
    id: 'subconscious',
    scriptId: 'subconscious_1',
    icon: Moon,
    accentClass: 'text-violet-300',
    bgClass: 'bg-violet-500/15',
    labelKey: 'sim.subconscious',
    descKey: 'sim.subconsciousDesc',
  },
  {
    id: 'reward',
    scriptId: 'reward_1',
    icon: Trophy,
    accentClass: 'text-accent-cyan',
    bgClass: 'bg-accent-cyan/15',
    labelKey: 'sim.reward',
    descKey: 'sim.rewardDesc',
  },
  {
    id: 'accountability',
    scriptId: 'accountability_1',
    icon: Megaphone,
    accentClass: 'text-rose-300',
    bgClass: 'bg-rose-500/15',
    labelKey: 'sim.accountability',
    descKey: 'sim.accountabilityDesc',
  },
];

export function TestSimulator({ alarm, onClose, isPremium, apiKey }: TestSimulatorProps) {
  const { lang, t } = useLanguage();
  const voice = getVoicePersona(alarm.voice_persona);
  const cloned = getClonedVoice(alarm.cloned_voice);
  const motivator = getMotivator(alarm.motivator);
  const script = getScript(alarm.script_id);
  const [now, setNow] = useState(new Date());
  const [playing, setPlaying] = useState<ClipId | null>(null);
  const [use432, setUse432] = useState(false);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }
    };
  }, []);

  const currentTime = now.toLocaleTimeString(LOCALE_MAP[lang as Language], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const displayName = (cloned?.name ?? voice?.name)?.[lang] ?? '—';
  const accentColor = (cloned ?? voice)?.accent ?? '#22d3ee';

  const stopAll = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    setPlaying(null);
  };

  const speakWithBrowser = (text: string, clipId: ClipId) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_MAP[lang as Language];
    utterance.rate = clipId === 'subconscious' ? 0.8 : clipId === 'accountability' ? 1.1 : 1.0;
    const basePitch = clipId === 'subconscious' ? 0.9 : clipId === 'accountability' ? 1.1 : 1.0;
    utterance.pitch = use432 ? basePitch * PITCH_432 : basePitch;
    utterance.onend = () => setPlaying(null);
    utterance.onerror = () => setPlaying(null);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setPlaying(clipId);
  };

  const speakWithElevenLabs = async (text: string, clipId: ClipId) => {
    if (!apiKey) {
      speakWithBrowser(text, clipId);
      return;
    }

    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current = null;
    }
    setTtsError(null);
    setPlaying(clipId);

    try {
      const isCloned = alarm.audio_mode === 'clone' && alarm.voice_clone_id;
      const voiceId = isCloned
        ? alarm.voice_clone_id!
        : alarm.cloned_voice ?? alarm.voice_persona;
      const audioBlob = isCloned
        ? await generateSpeechWithVoice({
            apiKey,
            text,
            voiceId,
            language: lang as Language,
            emotionalTone: alarm.emotional_tone,
          })
        : await generateSpeech({
            apiKey,
            text,
            voiceId,
            language: lang as Language,
            emotionalTone: alarm.emotional_tone,
          });
      const originalUrl = URL.createObjectURL(audioBlob);
      const audioUrl = use432 ? await blobTo432Url(audioBlob, originalUrl) : originalUrl;
      const audio = new Audio(audioUrl);
      ttsAudioRef.current = audio;
      audio.onended = () => {
        ttsAudioRef.current = null;
        setPlaying(null);
        URL.revokeObjectURL(audioUrl);
        if (audioUrl !== originalUrl) URL.revokeObjectURL(originalUrl);
      };
      audio.onerror = () => {
        ttsAudioRef.current = null;
        setPlaying(null);
        URL.revokeObjectURL(audioUrl);
        if (audioUrl !== originalUrl) URL.revokeObjectURL(originalUrl);
      };
      await audio.play();
    } catch (e) {
      const raw = e instanceof Error ? e.message : '';
      const msg = raw.includes('402') ? t('alarm.ttsNoCredits') : (raw || t('alarm.ttsFailed'));
      setTtsError(msg);
      speakWithBrowser(text, clipId);
    }
  };

  const playOriginalAudio = async (clipId: ClipId) => {
    if (!alarm.audio_file_url) return;

    const audio = new Audio(alarm.audio_file_url);
    ttsAudioRef.current = audio;
    setPlaying(clipId);
    audio.onended = () => {
      ttsAudioRef.current = null;
      setPlaying(null);
    };
    audio.onerror = () => {
      ttsAudioRef.current = null;
      setPlaying(null);
    };

    try {
      await audio.play();
    } catch {
      ttsAudioRef.current = null;
      setPlaying(null);
    }
  };

  const speak = (text: string, clipId: ClipId) => {
    if (playing === clipId) {
      stopAll();
      return;
    }
    stopAll();
    if (alarm.audio_file_url) {
      void playOriginalAudio(clipId);
      return;
    }
    if (apiKey) {
      void speakWithElevenLabs(text, clipId);
    } else {
      speakWithBrowser(text, clipId);
    }
  };

  const stopSpeaking = () => {
    stopAll();
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-ink-950/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent-cyan" />
          <h2 className="font-display text-lg font-semibold text-white">{t('sim.title')}</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            onClose();
          }}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-ink-700 hover:text-white"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-5">
        {/* Simulated alarm overlay */}
        <div className="relative overflow-hidden rounded-3xl border border-ink-700 bg-gradient-to-b from-ink-800 to-ink-900 p-8">
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ backgroundColor: `${accentColor}1a` }}
            />
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent-cyan/30 bg-ink-800">
              <AlarmClock className="h-8 w-8 animate-pulse-slow text-accent-cyan" />
            </div>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-accent-cyan">
              {t('sim.simulatedAlarm')}
            </p>
            <p className="mt-2 font-mono text-6xl font-bold tabular-nums text-white">
              {currentTime}
            </p>
            <p className="mt-2 max-w-xs text-balance text-sm text-slate-400">
              {translateLabel(alarm.label, t)}
            </p>
          </div>

          <div className="relative mt-6">
            <Waveform active={playing !== null} bars={32} />
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
              <span className="font-medium text-slate-300">{displayName}</span>
              <span className="text-slate-600">·</span>
              <span>{motivator?.name[lang] ?? '—'}</span>
            </div>
            {(alarm.custom_text ?? script?.text[lang as Language] ?? motivator?.description[lang as Language]) && (
              <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">
                {alarm.custom_text ?? script?.text[lang as Language] ?? motivator?.description[lang as Language]}
              </p>
            )}
          </div>
        </div>

        {/* 432 Hz toggle */}
        <div className={`mt-6 flex items-center justify-between rounded-2xl border p-4 ${
          isPremium ? 'border-ink-700 bg-ink-900/60' : 'border-ink-700/50 bg-ink-900/30 opacity-60'
        }`}>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-cyan/15 text-accent-cyan">
              {isPremium ? <Sparkles className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{t('sim.frequency432')}</p>
                {!isPremium && (
                  <span className="rounded-full bg-accent-indigo/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-indigo">
                    {t('alarm.upgrade')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{t('sim.frequency432Desc')}</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={use432}
            disabled={!isPremium}
            onClick={() => isPremium && setUse432((v) => !v)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
              use432 && isPremium ? 'bg-accent-cyan' : 'bg-ink-600'
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                use432 && isPremium ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Audio preview clips */}
        <div className="mt-6">
          <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('sim.previewClips')}
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('sim.previewDesc')}</p>
          <div className="mt-3 space-y-3">
            {CLIPS.map((clip) => {
              const clipScript = SCRIPTS.find((s) => s.id === clip.scriptId);
              if (!clipScript) return null;
              const Icon = clip.icon;
              const isPlaying = playing === clip.id;
              return (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => speak(clipScript.text[lang as Language], clip.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    isPlaying
                      ? 'border-accent-cyan/50 bg-ink-800'
                      : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${clip.bgClass} ${clip.accentClass}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{t(clip.labelKey)}</p>
                    <p className="text-xs text-slate-400">{t(clip.descKey)}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-600 text-slate-300 transition-colors hover:border-accent-cyan hover:text-accent-cyan">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TTS error */}
        {ttsError && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
            <p className="text-xs leading-relaxed text-rose-300">{ttsError}</p>
          </div>
        )}

        {/* TTS notice */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-ink-700 bg-ink-900/60 p-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-ink-700 text-accent-cyan">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <p className="text-[11px] leading-relaxed text-slate-500">
            {apiKey ? t('sim.ttsNotice') : t('sim.ttsNoticeFallback')}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-ink-700/60 px-5 py-4">
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            onClose();
          }}
          className="w-full rounded-xl bg-accent-cyan py-3.5 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
        >
          {t('sim.close')}
        </button>
      </div>
    </div>
  );
}
