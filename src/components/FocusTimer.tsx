import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  Clock,
  Pause,
  Play,
  Trophy,
  X,
} from 'lucide-react';
import { Waveform } from './Waveform';
import { CLONED_VOICES, getClonedVoice } from '@/lib/clonedVoices';
import { useLanguage } from '@/hooks/useLanguage';
import { useFocusSessions } from '@/hooks/useFocusSessions';
import { REWARD_TEXT, PUNISHMENT_TEXT } from '@/lib/focusTexts';
import { LANGUAGES, LANGUAGE_LABELS, LOCALE_MAP, type FocusSession, type Language } from '@/lib/types';

export function FocusTimer() {
  const { lang, t } = useLanguage();
  const { sessions, add, patch } = useFocusSessions();

  const [targetMinutes, setTargetMinutes] = useState(25);
  const [clonedVoice, setClonedVoice] = useState<string | null>('oma');
  const [sessionLang, setSessionLang] = useState<Language>(lang);
  const [active, setActive] = useState<FocusSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [outcome, setOutcome] = useState<'success' | 'failed' | null>(null);
  const [, setLeftApp] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hiddenRef = useRef(false);

  // Track tab visibility — leaving the app = focus lost
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && active && !paused) {
        hiddenRef.current = true;
        setLeftApp(true);
        handleFail();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  });

  // Tick the timer
  useEffect(() => {
    if (!active || paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next >= active.target_minutes * 60) {
          handleSuccess();
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  });

  // Keep DB elapsed in sync periodically
  useEffect(() => {
    if (!active || paused) return;
    const sync = setInterval(async () => {
      try {
        await patch(active.id, { elapsed_seconds: elapsed });
      } catch {
        // ignore
      }
    }, 10000);
    return () => clearInterval(sync);
  }, [active, elapsed, paused, patch]);

  async function handleStart() {
    setElapsed(0);
    setPaused(false);
    setOutcome(null);
    setLeftApp(false);
    hiddenRef.current = false;
    const created = await add({
      target_minutes: targetMinutes,
      elapsed_seconds: 0,
      status: 'active',
      cloned_voice: clonedVoice,
      language: sessionLang,
    });
    setActive(created);
  }

  async function handleSuccess() {
    if (!active) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setOutcome('success');
    await patch(active.id, {
      status: 'success',
      elapsed_seconds: active.target_minutes * 60,
      ended_at: new Date().toISOString(),
    });
  }

  async function handleFail() {
    if (!active) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setOutcome('failed');
    await patch(active.id, {
      status: 'failed',
      elapsed_seconds: elapsed,
      ended_at: new Date().toISOString(),
    });
  }

  function handleCancel() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (active && outcome === null) {
      handleFail();
    }
    setActive(null);
    setOutcome(null);
    setElapsed(0);
    setPaused(false);
  }

  function handleDone() {
    setActive(null);
    setOutcome(null);
    setElapsed(0);
    setPaused(false);
  }

  const remainingSeconds = active ? active.target_minutes * 60 - elapsed : 0;
  const mm = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
  const ss = String(remainingSeconds % 60).padStart(2, '0');
  const progress = active ? (elapsed / (active.target_minutes * 60)) * 100 : 0;
  const voice = getClonedVoice(clonedVoice);

  // Outcome screen
  if (outcome && active) {
    const isSuccess = outcome === 'success';
    const message = isSuccess ? REWARD_TEXT[sessionLang] : PUNISHMENT_TEXT[sessionLang];
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-3xl ${
            isSuccess ? 'bg-emerald-500/15' : 'bg-rose-500/15'
          }`}
        >
          {isSuccess ? (
            <Trophy className="h-10 w-10 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-10 w-10 text-rose-400" />
          )}
        </div>
        <h2
          className={`mt-6 font-display text-2xl font-bold ${
            isSuccess ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {isSuccess ? t('focus.completed') : t('focus.failed')}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {isSuccess ? t('focus.completedDesc') : t('focus.failedDesc')}
        </p>

        <div className="mt-6 w-full max-w-sm">
          <Waveform active bars={32} />
          <div className="mt-4 rounded-2xl border border-ink-700 bg-ink-800 p-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: voice?.accent ?? '#22d3ee' }}
              />
              <span className="text-xs font-medium text-slate-300">
                {voice?.name?.[lang] ?? '—'} · {isSuccess ? t('focus.reward') : t('focus.punishment')}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{message}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDone}
          className="mt-6 w-full max-w-xs rounded-2xl bg-accent-cyan py-3.5 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
        >
          {t('common.close')}
        </button>
      </div>
    );
  }

  // Active session
  if (active) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-cyan">
          {t('focus.focusActive')}
        </p>
        <div className="mt-4 font-mono text-7xl font-bold tabular-nums text-white">
          {mm}:{ss}
        </div>
        <p className="mt-2 text-sm text-slate-500">{t('focus.stayFocused')}</p>

        <div className="mt-6 w-full max-w-xs">
          <div className="h-2 overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-ink-600 bg-ink-800 text-slate-200 transition-all hover:border-accent-cyan/50 active:scale-95"
            aria-label={paused ? t('focus.resume') : t('focus.pause')}
          >
            {paused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95"
            aria-label={t('focus.cancel')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }

  // Setup screen
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-600 bg-ink-800">
            <Clock className="h-5 w-5 text-accent-indigo" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{t('focus.title')}</h1>
            <p className="text-xs text-slate-500">{t('focus.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-5 py-6">
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('focus.target')}
          </label>
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setTargetMinutes((m) => Math.max(5, m - 5))}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-600 bg-ink-800 text-2xl text-slate-200 transition-all hover:border-accent-cyan/50 active:scale-95"
            >
              −
            </button>
            <div className="text-center">
              <span className="font-mono text-5xl font-bold text-white tabular-nums">
                {targetMinutes}
              </span>
              <p className="text-xs text-slate-500">{t('focus.minutes')}</p>
            </div>
            <button
              type="button"
              onClick={() => setTargetMinutes((m) => Math.min(120, m + 5))}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-600 bg-ink-800 text-2xl text-slate-200 transition-all hover:border-accent-cyan/50 active:scale-95"
            >
              +
            </button>
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {[15, 25, 45, 60].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTargetMinutes(preset)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  targetMinutes === preset
                    ? 'bg-accent-cyan/15 text-accent-cyan ring-1 ring-accent-cyan/40'
                    : 'bg-ink-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset} {t('focus.minutes')}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('focus.selectVoice')}
          </label>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('focus.selectVoiceDesc')}</p>
          <div className="mt-2 space-y-2">
            {CLONED_VOICES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setClonedVoice(v.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  clonedVoice === v.id
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
                {clonedVoice === v.id && <Check className="h-5 w-5 text-accent-indigo" />}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('focus.language')}
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setSessionLang(l)}
                className={`rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  sessionLang === l
                    ? 'border-accent-cyan/50 bg-ink-800 text-white'
                    : 'border-ink-700 bg-ink-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {LANGUAGE_LABELS[l]}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('focus.history')}
          </h3>
          <div className="mt-2 space-y-2">
            {sessions.length === 0 && (
              <p className="py-4 text-center text-xs text-slate-600">{t('focus.noHistory')}</p>
            )}
            {sessions.slice(0, 6).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-ink-700 bg-ink-900/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      s.status === 'success'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : s.status === 'failed'
                          ? 'bg-rose-500/15 text-rose-400'
                          : 'bg-ink-700 text-slate-400'
                    }`}
                  >
                    {s.status === 'success' ? (
                      <Trophy className="h-4 w-4" />
                    ) : s.status === 'failed' ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {s.target_minutes} {t('focus.minutes')}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(s.started_at).toLocaleDateString(
                        LOCALE_MAP[s.language],
                        { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    s.status === 'success'
                      ? 'text-emerald-400'
                      : s.status === 'failed'
                        ? 'text-rose-400'
                        : 'text-slate-500'
                  }`}
                >
                  {s.status === 'success'
                    ? t('focus.success')
                    : s.status === 'failed'
                      ? t('focus.failed_status')
                      : '—'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-ink-700/60 px-5 py-4">
        <button
          type="button"
          onClick={handleStart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-indigo py-3.5 font-semibold text-white transition-all hover:shadow-glow-indigo active:scale-[0.98]"
        >
          <Play className="h-5 w-5" />
          {t('focus.start')}
        </button>
      </div>
    </div>
  );
}
