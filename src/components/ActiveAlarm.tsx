import { useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Haptics } from '@capacitor/haptics';
import { AlarmClock, Hand, Moon, X } from 'lucide-react';
import { Waveform } from './Waveform';
import { getVoicePersona } from '@/lib/voices';
import { getClonedVoice } from '@/lib/clonedVoices';
import { getMotivator } from '@/lib/motivators';
import { getScript } from '@/lib/scripts';
import { generateSpeech, generateSpeechWithVoice, resolveVoiceId } from '@/lib/elevenlabs';
import { LOCALE_MAP, type VibrationPattern } from '@/lib/types';
import { useLanguage } from '@/hooks/useLanguage';
import { translateLabel, type Alarm } from '@/lib/types';
import { playAlarmTone, getAlarmBeepUrl, requestWakeLock, releaseWakeLock, startKeepAlive, stopKeepAlive, resumeAudioContext, forceStopAllAudio } from '@/lib/audioUnlock';

interface ActiveAlarmProps {
  alarm: Alarm;
  onDismiss: () => void;
  onSnooze: () => void;
  apiKey: string | null;
}

export function ActiveAlarm({ alarm, onDismiss, onSnooze, apiKey }: ActiveAlarmProps) {
  const { lang, t } = useLanguage();
  const voice = getVoicePersona(alarm.voice_persona);
  const cloned = getClonedVoice(alarm.cloned_voice);
  const motivator = getMotivator(alarm.motivator);
  const script = getScript(alarm.script_id);
  const [snoozed, setSnoozed] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const beepAudioRef = useRef<HTMLAudioElement | null>(null);
  const stopToneRef = useRef<(() => void) | null>(null);
  const cancelledRef = useRef(false);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>>>(new Set());

  const isSubconscious = alarm.subconscious_mode;
  const maxRepeats = alarm.subconscious_repeats ?? 1;
  const subVolume = Math.min(1, Math.max(0, (alarm.subconscious_volume ?? 3) / 10));

  // Track every timeout/interval so stopAllAudio can cancel them all.
  const trackTimer = <T extends ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>>(id: T): T => {
    timersRef.current.add(id);
    return id;
  };
  const clearTrackedTimer = (id: ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>) => {
    clearTimeout(id);
    clearInterval(id);
    timersRef.current.delete(id);
  };
  const clearAllTimers = () => {
    timersRef.current.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    timersRef.current.clear();
  };

  const speakWithBrowser = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (cancelledRef.current) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LOCALE_MAP[alarm.language];
    utterance.rate = isSubconscious ? 0.8 : 1.0;
    utterance.volume = isSubconscious ? subVolume : 1.0;
    window.speechSynthesis.speak(utterance);
  };

  /**
   * Mandatory stop function — pauses all HTMLAudioElements, cancels speech,
   * stops the Web Audio oscillator, closes the AudioContext, and cancels
   * every tracked timer. Leaves no background process running.
   */
  const stopAllAudio = () => {
    cancelledRef.current = true;
    clearAllTimers();

    if (stopToneRef.current) {
      stopToneRef.current();
      stopToneRef.current = null;
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    if (audioRef.current) {
      audioRef.current.loop = false;
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      audioRef.current = null;
    }
    if (beepAudioRef.current) {
      beepAudioRef.current.loop = false;
      beepAudioRef.current.pause();
      beepAudioRef.current.src = '';
      beepAudioRef.current.removeAttribute('src');
      beepAudioRef.current.load();
      beepAudioRef.current = null;
    }

    // Force-close the shared AudioContext and cancel keep-alive.
    forceStopAllAudio();
  };

  // Layer 1: Web Audio API oscillator — the most reliable way to produce
  // sound once the AudioContext has been unlocked by a prior user gesture.
  const startTone = () => {
    if (stopToneRef.current) return;
    const stop = playAlarmTone(isSubconscious ? subVolume : 1.0);
    if (stop) {
      stopToneRef.current = stop;
    }
  };

  // Layer 2: Alarm WAV file played via a plain HTMLAudioElement.
  // No mediaSession metadata is ever set, so iOS will not show a
  // Now Playing / lock-screen media player for this element.
  const startBeepAudio = () => {
    if (beepAudioRef.current) return;
    try {
      const audio = new Audio('/alarm-sound.wav');
      beepAudioRef.current = audio;
      audio.loop = true;
      audio.volume = isSubconscious ? subVolume : 1.0;
      audio.play().catch(() => {
        // Fallback to embedded data URL
        try {
          const fallback = new Audio(getAlarmBeepUrl());
          fallback.loop = true;
          fallback.volume = isSubconscious ? subVolume : 1.0;
          beepAudioRef.current = fallback;
          fallback.play().catch(() => {});
        } catch {
          // ignore
        }
      });
    } catch {
      // ignore
    }
  };

  const playAlarmAudio = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const playAudioUrl = (url: string) => {
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.loop = !isSubconscious;
      audio.volume = isSubconscious ? subVolume : 1.0;
      return audio.play().catch(() => {});
    };

    if (alarm.audio_file_url) {
      await playAudioUrl(alarm.audio_file_url);
      return;
    }
    if (alarm.audio_mode === 'clone' && alarm.voice_clone_id && apiKey) {
      const text = alarm.custom_text ?? getScript(alarm.script_id)?.text[alarm.language] ?? '';
      if (text) {
        try {
          const blob = await generateSpeechWithVoice({
            apiKey,
            text,
            voiceId: alarm.voice_clone_id,
            language: alarm.language,
            emotionalTone: alarm.emotional_tone,
            speed: alarm.voice_speed,
            stability: alarm.voice_stability,
            similarityBoost: alarm.voice_similarity,
          });
          if (cancelledRef.current) return;
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.loop = !isSubconscious;
          audio.volume = isSubconscious ? subVolume : 1.0;
          audio.onended = () => URL.revokeObjectURL(url);
          await audio.play().catch(() => {});
        } catch {
          if (cancelledRef.current) return;
          if (alarm.audio_file_url) {
            await playAudioUrl(alarm.audio_file_url);
          } else {
            speakWithBrowser(text);
          }
        }
      } else if (alarm.audio_file_url) {
        await playAudioUrl(alarm.audio_file_url);
      }
      return;
    }
    if (alarm.audio_file_url) {
      await playAudioUrl(alarm.audio_file_url);
      return;
    }
    const text = alarm.custom_text ?? getScript(alarm.script_id)?.text[alarm.language] ?? motivator?.description[alarm.language] ?? '';
    if (text) {
      if (apiKey) {
        try {
          const voiceId = resolveVoiceId(alarm.cloned_voice ?? alarm.voice_persona, alarm.language);
          const blob = await generateSpeech({
            apiKey,
            text,
            voiceId,
            language: alarm.language,
            emotionalTone: alarm.emotional_tone,
            speed: alarm.voice_speed,
            stability: alarm.voice_stability,
            similarityBoost: alarm.voice_similarity,
          });
          if (cancelledRef.current) return;
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.loop = !isSubconscious;
          audio.volume = isSubconscious ? subVolume : 1.0;
          audio.onended = () => URL.revokeObjectURL(url);
          await audio.play().catch(() => {});
        } catch {
          if (cancelledRef.current) return;
          speakWithBrowser(text);
        }
      } else {
        speakWithBrowser(text);
      }
    }
  };

  // --- Main audio lifecycle effect ---
  useEffect(() => {
    cancelledRef.current = false;
    void requestWakeLock();
    startKeepAlive();

    // Start all audio layers simultaneously.
    void resumeAudioContext();
    startTone();
    if (!isSubconscious) {
      startBeepAudio();
    }
    void playAlarmAudio();

    // Single retry after 1.5s (no infinite interval) in case the
    // AudioContext was suspended when we first tried.
    const retryTimer = trackTimer(setTimeout(() => {
      if (cancelledRef.current) return;
      void resumeAudioContext().then((ok) => {
        if (ok && !stopToneRef.current && !cancelledRef.current) {
          startTone();
        }
      });
      if (!beepAudioRef.current && !isSubconscious && !cancelledRef.current) {
        startBeepAudio();
      }
    }, 1500));

    // Capacitor App lifecycle: when returning to foreground, check if the
    // alarm was already dismissed and kill any orphan audio that survived
    // in the background.
    const appListener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive && cancelledRef.current) {
        stopAllAudio();
      }
    });

    return () => {
      cancelledRef.current = true;
      clearTrackedTimer(retryTimer);
      appListener.then((l) => l.remove()).catch(() => {});
      stopAllAudio();
      releaseWakeLock();
      stopKeepAlive();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatCount, isSubconscious, alarm, apiKey]);

  // --- Repeat / vibration effect ---
  useEffect(() => {
    let stopVibration = false;
    const vibrationSequences: Record<VibrationPattern, number[]> = {
      standard: [400, 200, 400, 200, 800],
      '432hz': [700, 250, 700, 500],
      '528hz': [250, 150, 250, 150, 250, 450],
      '639hz': [500, 250, 500, 250, 500],
      gentle_wave: [180, 260, 360, 260, 540, 600],
    };

    const wait = (duration: number) => new Promise<void>((resolve) => {
      const timer = trackTimer(setTimeout(resolve, duration));
      if (stopVibration || cancelledRef.current) clearTrackedTimer(timer);
    });

    const playNativeVibration = async () => {
      const sequence = vibrationSequences[alarm.vibration_pattern] ?? vibrationSequences.standard;
      while (!stopVibration && !cancelledRef.current) {
        for (let index = 0; index < sequence.length; index += 2) {
          if (stopVibration || cancelledRef.current) return;
          const vibrationDuration = sequence[index];
          await Haptics.vibrate({ duration: vibrationDuration }).catch(() => {});
          await wait(vibrationDuration);
          const pauseDuration = sequence[index + 1];
          if (pauseDuration) await wait(pauseDuration);
        }
        await wait(1000);
      }
    };

    void playNativeVibration();

    let repeatCleanup: (() => void) | undefined;
    if (isSubconscious) {
      const playDuration = 8000;
      const fadeDuration = 4000;
      const gapBetweenRepeats = 2000;

      if (repeatCount >= maxRepeats) {
        const stopTimer = trackTimer(setTimeout(() => onDismiss(), fadeDuration));
        repeatCleanup = () => clearTrackedTimer(stopTimer);
      } else {
        const fadeTimer = trackTimer(setTimeout(() => setFadingOut(true), playDuration));
        const nextRepeatTimer = trackTimer(setTimeout(() => {
          setFadingOut(false);
          setRepeatCount((c) => c + 1);
        }, playDuration + fadeDuration + gapBetweenRepeats));
        repeatCleanup = () => {
          clearTrackedTimer(fadeTimer);
          clearTrackedTimer(nextRepeatTimer);
        };
      }
    }

    return () => {
      stopVibration = true;
      if (navigator.vibrate) navigator.vibrate(0);
      repeatCleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarm.vibration_pattern, isSubconscious, onDismiss, repeatCount, maxRepeats]);

  const handleSnooze = () => {
    setSnoozed(true);
    stopAllAudio();
    onSnooze();
  };

  const handleDismiss = () => {
    stopAllAudio();
    onDismiss();
  };

  const displayName = (cloned?.name ?? voice?.name)?.[lang] ?? '—';
  const accentColor = (cloned ?? voice)?.accent ?? '#22d3ee';

  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col items-center justify-between overflow-hidden px-6 py-12 transition-opacity duration-1000 ${
        isSubconscious
          ? 'bg-ink-950/80'
          : 'bg-ink-950'
      } ${fadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            backgroundColor: isSubconscious ? 'rgba(139,92,246,0.08)' : 'rgba(34,211,238,0.1)',
          }}
        />
        {!isSubconscious && (
          <div className="absolute bottom-0 left-1/2 h-1/2 w-1/2 -translate-x-1/2 rounded-full bg-accent-indigo/10 blur-3xl" />
        )}
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
            isSubconscious
              ? 'border-violet-500/30 bg-ink-800'
              : 'border-accent-cyan/30 bg-ink-800'
          }`}
        >
          {isSubconscious ? (
            <Moon className="h-8 w-8 animate-pulse-slow text-violet-300" />
          ) : (
            <AlarmClock className="h-8 w-8 animate-pulse-slow text-accent-cyan" />
          )}
        </div>
        <p
          className={`mt-4 text-xs font-medium uppercase tracking-[0.2em] ${
            isSubconscious ? 'text-violet-300' : 'text-accent-cyan'
          }`}
        >
          {isSubconscious
            ? t('active.subconscious')
            : snoozed
              ? t('active.snoozed')
              : t('active.timeToWake')}
        </p>
        <p className="mt-2 font-mono text-7xl font-bold tabular-nums text-white">
          {alarm.time.slice(0, 5)}
        </p>
        <p className="mt-2 max-w-xs text-balance text-sm text-slate-400">{translateLabel(alarm.label, t)}</p>
        {isSubconscious && (
          <p className="mt-2 text-xs text-violet-300/70">
            {t('active.playingSoftly')} · {alarm.subconscious_volume}%{maxRepeats > 1 && ` · ${repeatCount + 1}/${maxRepeats}`}
          </p>
        )}
      </div>

      <div className="relative w-full max-w-sm">
        <Waveform active={!snoozed && !fadingOut} bars={isSubconscious ? 24 : 40} className={isSubconscious ? 'opacity-50' : ''} />
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="font-medium text-slate-300">{displayName}</span>
          <span className="text-slate-600">·</span>
          <span>{motivator?.name[lang] ?? '—'}</span>
        </div>
        {(alarm.custom_text ?? script?.text[alarm.language] ?? motivator?.description[alarm.language]) && (
          <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">
            {alarm.custom_text ?? script?.text[alarm.language] ?? motivator?.description[alarm.language]}
          </p>
        )}
      </div>

      {!isSubconscious && (
        <div className="relative flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex items-center justify-center gap-2 rounded-2xl bg-accent-cyan py-4 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
          >
            <X className="h-5 w-5" />
            {t('active.stop')}
          </button>
          <button
            type="button"
            onClick={handleSnooze}
            disabled={snoozed}
            className="flex items-center justify-center gap-2 rounded-2xl border border-ink-600 bg-ink-800 py-4 font-semibold text-slate-200 transition-all hover:border-accent-indigo/50 hover:text-white disabled:opacity-50 active:scale-[0.98]"
          >
            <Hand className="h-5 w-5 text-accent-indigo" />
            {snoozed ? t('active.snoozedMsg') : t('active.snooze')}
          </button>
        </div>
      )}

      {isSubconscious && (
        <div className="relative flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex items-center justify-center gap-2 rounded-2xl bg-violet-500 py-4 font-semibold text-white transition-all hover:shadow-glow active:scale-[0.98]"
          >
            <X className="h-5 w-5" />
            {t('active.stop')}
          </button>
        </div>
      )}
    </div>
  );
}
