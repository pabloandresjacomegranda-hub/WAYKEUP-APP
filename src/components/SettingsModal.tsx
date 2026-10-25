import { useEffect, useState } from 'react';
import { ArrowLeft, Key, Loader2, Lock, LogOut, Sparkles, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { fetchElevenLabsVoices } from '@/lib/elevenlabs';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  isPremium: boolean;
  apiKey: string | null;
  onUpdateTier: (tier: 'standard' | 'premium') => void;
  onUpdateApiKey: (key: string) => void;
  onSignOut: () => void;
}

export function SettingsModal({
  open,
  onClose,
  isPremium,
  apiKey,
  onUpdateTier,
  onUpdateApiKey,
  onSignOut,
}: SettingsModalProps) {
  const { t } = useLanguage();
  const [keyInput, setKeyInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (open) {
      setKeyInput(apiKey ?? '');
      setSaved(false);
    }
  }, [open, apiKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSaveKey = () => {
    onUpdateApiKey(keyInput.trim());
    setSaved(true);
    setTestResult(null);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestKey = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setTestResult({ ok: false, msg: t('settings.testEmpty') });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      await fetchElevenLabsVoices(trimmed);
      setTestResult({ ok: true, msg: t('settings.testOk') });
    } catch (e) {
      setTestResult({ ok: false, msg: e instanceof Error ? e.message : t('settings.testFail') });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-ink-950/95 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-4">
        <h2 className="font-display text-lg font-semibold text-white">
          {t('settings.title')}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-ink-600 bg-ink-800 text-slate-300 transition-all hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-300 active:scale-[0.95]"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-5 py-5">
        {/* Subscription Tier Toggle */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('settings.subscription')}
          </label>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('settings.subscriptionDesc')}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onUpdateTier('standard')}
              className={`relative rounded-xl border p-4 text-left transition-all ${
                !isPremium
                  ? 'border-accent-cyan/50 bg-ink-800'
                  : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-slate-400" />
                <p className="text-sm font-semibold text-white">{t('settings.standardPlan')}</p>
              </div>
              <p className="mt-1 text-xs text-slate-400">{t('settings.standardPlanDesc')}</p>
            </button>
            <button
              type="button"
              onClick={() => onUpdateTier('premium')}
              className={`relative rounded-xl border p-4 text-left transition-all ${
                isPremium
                  ? 'border-accent-indigo/50 bg-ink-800'
                  : 'border-ink-700 bg-ink-900/60 hover:border-ink-600'
              }`}
            >
              <span className="absolute right-2 top-2 rounded-full bg-accent-indigo/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-indigo">
                {t('alarm.pro')}
              </span>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-indigo" />
                <p className="text-sm font-semibold text-white">{t('settings.premiumPlan')}</p>
              </div>
              <p className="mt-1 text-xs text-slate-400">{t('settings.premiumPlanDesc')}</p>
            </button>
          </div>
        </section>

        {/* ElevenLabs API Key */}
        <section>
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('settings.apiKey')}
          </label>
          <p className="mt-0.5 text-[11px] text-slate-600">{t('settings.apiKeyDesc')}</p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-4 py-3">
            <Key className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
              placeholder={t('settings.apiKeyPlaceholder')}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-600">
              {apiKey
                ? t('settings.apiKeyConnected')
                : t('settings.apiKeyNotSet')}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing}
                className="rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-all hover:border-accent-cyan hover:text-accent-cyan disabled:opacity-50 active:scale-[0.98]"
              >
                {testing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : t('settings.testKey')}
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="rounded-lg bg-accent-cyan px-4 py-2 text-xs font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
              >
                {saved ? t('settings.saved') : t('settings.saveKey')}
              </button>
            </div>
          </div>
          {testResult && (
            <div className={`mt-2 rounded-lg border p-2.5 ${
              testResult.ok
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-rose-500/30 bg-rose-500/10'
            }`}>
              <p className={`text-[11px] leading-relaxed ${
                testResult.ok ? 'text-emerald-300' : 'text-rose-300'
              }`}>
                {testResult.msg}
              </p>
            </div>
          )}
        </section>

        {/* Plan info */}
        <section className="rounded-2xl border border-ink-700 bg-ink-900/60 p-4">
          <p className="text-xs font-semibold text-slate-300">
            {isPremium ? t('settings.premiumActive') : t('settings.standardActive')}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            {isPremium ? t('settings.premiumInfo') : t('settings.standardInfo')}
          </p>
        </section>

        {/* Sign out */}
        <section>
          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/5 py-3.5 font-semibold text-rose-300 transition-all hover:border-rose-500/50 hover:bg-rose-500/10 active:scale-[0.98]"
          >
            <LogOut className="h-5 w-5" />
            {t('auth.signOut')}
          </button>
        </section>
      </div>

      <div className="flex items-center gap-3 border-t border-ink-700/60 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-800 py-3.5 font-semibold text-slate-200 transition-all hover:border-ink-500 hover:text-white active:scale-[0.98]"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('settings.back')}
        </button>
        <button
          type="button"
          onClick={handleSaveKey}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-cyan py-3.5 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
        >
          <Sparkles className="h-5 w-5" />
          {saved ? t('settings.saved') : t('settings.save')}
        </button>
      </div>
    </div>
  );
}
