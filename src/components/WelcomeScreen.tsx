import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Brain, CheckCircle2, Eye, EyeOff, Heart, Lock, Mail, ShieldCheck, Sparkles, Vibrate, Waves } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';

interface WelcomeScreenProps {
  onSignIn: (email: string, password: string) => Promise<unknown>;
  onSignUp: (email: string, password: string) => Promise<unknown>;
  onResetPassword: (email: string) => Promise<unknown>;
}

export function WelcomeScreen({ onSignIn, onSignUp, onResetPassword }: WelcomeScreenProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'welcome' | 'signin' | 'signup' | 'forgot'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        await onSignIn(email, password);
      } else if (mode === 'forgot') {
        await onResetPassword(email);
        setResetSent(true);
      } else {
        if (!consent) {
          setError(t('auth.consentRequired'));
          setBusy(false);
          return;
        }
        await onSignUp(email, password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-ink-950 p-4 sm:p-6">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-accent-cyan/10 blur-[120px]" />
        <div className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-accent-indigo/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Language toggle */}
        <div className="absolute right-0 top-0">
          <LanguageToggle />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center pt-8">
          <img src="/image.png" alt="WaykeUp" className="h-32 w-40 rounded-2xl shadow-xl shadow-accent-cyan/20 ring-1 ring-accent-cyan/20" />
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white">
            Wayke<span className="bg-gradient-to-r from-accent-cyan to-accent-indigo bg-clip-text text-transparent">Up</span>
          </h1>
        </div>

        {mode === 'welcome' && (
          <>
            {/* Top auth buttons */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="flex-1 rounded-xl bg-accent-cyan py-2.5 text-sm font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
              >
                {t('auth.createAccount')}
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="flex-1 rounded-xl border border-ink-600 bg-ink-800/50 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:border-ink-500 hover:bg-ink-800 active:scale-[0.98]"
              >
                {t('auth.signIn')}
              </button>
            </div>

            {/* Marketing copy */}
            <div className="mt-6 space-y-4">
              <p className="text-center text-lg font-semibold leading-snug text-white">
                {t('auth.tagline')}
              </p>
              <p className="text-center text-sm leading-relaxed text-slate-400">
                {t('auth.intro')}
              </p>
              <p className="text-center text-sm leading-relaxed text-slate-400">
                {t('auth.introVoices')}
              </p>
            </div>

            {/* Feature highlights */}
            <div className="mt-6 space-y-3">
              <FeatureRow icon={<Brain className="h-4 w-4" />} title={t('auth.featureSubconscious')} desc={t('auth.featureSubconsciousDesc')} />
              <FeatureRow icon={<Vibrate className="h-4 w-4" />} title={t('auth.featureVibration')} desc={t('auth.featureVibrationDesc')} />
              <FeatureRow icon={<Waves className="h-4 w-4" />} title={t('auth.feature432')} desc={t('auth.feature432Desc')} />
              <FeatureRow icon={<Sparkles className="h-4 w-4" />} title={t('auth.featureAudio')} desc={t('auth.featureAudioDesc')} />
              <FeatureRow icon={<Heart className="h-4 w-4" />} title={t('auth.featureEmotionalTone')} desc={t('auth.featureEmotionalToneDesc')} />
            </div>

            {/* Loved voice benefits */}
            <div className="mt-6 rounded-2xl border border-accent-cyan/20 bg-gradient-to-b from-accent-cyan/5 to-transparent p-5">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent-cyan" />
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-accent-cyan">
                  {t('auth.lovedVoiceTitle')}
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {t('auth.lovedVoiceIntro')}
              </p>
              <ul className="mt-3 space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-cyan/15 text-accent-cyan">
                    <Heart className="h-3 w-3" />
                  </span>
                  <span className="text-xs leading-relaxed text-slate-300">{t('auth.lovedVoiceBenefit1')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-cyan/15 text-accent-cyan">
                    <Brain className="h-3 w-3" />
                  </span>
                  <span className="text-xs leading-relaxed text-slate-300">{t('auth.lovedVoiceBenefit2')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-cyan/15 text-accent-cyan">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  <span className="text-xs leading-relaxed text-slate-300">{t('auth.lovedVoiceBenefit3')}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-cyan/15 text-accent-cyan">
                    <Waves className="h-3 w-3" />
                  </span>
                  <span className="text-xs leading-relaxed text-slate-300">{t('auth.lovedVoiceBenefit4')}</span>
                </li>
              </ul>
            </div>

            {/* Plan comparison */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-ink-700 bg-ink-900/60 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t('auth.standard')}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{t('auth.standardDesc')}</p>
              </div>
              <div className="rounded-xl border border-accent-indigo/30 bg-accent-indigo/5 p-4">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-accent-indigo">{t('auth.premium')}</p>
                  <Sparkles className="h-3 w-3 text-accent-indigo" />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{t('auth.premiumDesc')}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="w-full rounded-xl bg-accent-cyan py-3.5 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
              >
                {t('auth.createAccount')}
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="w-full rounded-xl border border-ink-600 bg-ink-800/50 py-3.5 font-semibold text-slate-200 transition-all hover:border-ink-500 hover:bg-ink-800 active:scale-[0.98]"
              >
                {t('auth.signIn')}
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              {t('auth.ctaFooter')}
            </p>
          </>
        )}

        {mode === 'forgot' && (
          <>
            <div className="mt-8">
              <h2 className="text-center text-xl font-bold text-white">
                {t('auth.forgotTitle')}
              </h2>
              <p className="mt-1 text-center text-sm text-slate-400">
                {t('auth.forgotSub')}
              </p>
            </div>

            {resetSent ? (
              <div className="mt-6 flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{t('auth.resetSent')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    {t('auth.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder')}
                      className="w-full rounded-xl border border-ink-600 bg-ink-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-accent-cyan"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-xl bg-accent-cyan py-3.5 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98] disabled:opacity-50"
                >
                  {busy ? t('auth.processing') : t('auth.sendReset')}
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                  setResetSent(false);
                }}
                className="text-xs text-slate-400 transition-colors hover:text-accent-cyan"
              >
                {t('auth.backToSignIn')}
              </button>
            </div>
          </>
        )}

        {mode !== 'welcome' && mode !== 'forgot' && (
          <>
            <div className="mt-8">
              <h2 className="text-center text-xl font-bold text-white">
                {mode === 'signin' ? t('auth.signInTitle') : t('auth.signUpTitle')}
              </h2>
              <p className="mt-1 text-center text-sm text-slate-400">
                {mode === 'signin' ? t('auth.signInSub') : t('auth.signUpSub')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full rounded-xl border border-ink-600 bg-ink-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-accent-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    className="w-full rounded-xl border border-ink-600 bg-ink-800/50 py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-accent-cyan"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-300">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'signup' && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="flex w-full items-start gap-3 rounded-xl border border-ink-700 bg-ink-900/40 p-3 text-left transition-colors hover:border-ink-600"
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${consent ? 'border-accent-cyan bg-accent-cyan text-ink-950' : 'border-ink-500 bg-ink-800'}`}>
                      {consent && <CheckCircle2 className="h-4 w-4" />}
                    </span>
                    <span className="text-xs leading-relaxed text-slate-400">
                      {t('auth.consentPrefix')}{' '}
                      <span className="font-semibold text-accent-cyan underline">{t('auth.consentLink')}</span>{' '}
                      {t('auth.consentSuffix')}
                    </span>
                  </button>

                  {showTerms && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowTerms(false)}>
                      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border border-ink-600 bg-ink-900 p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-accent-cyan" />
                          <h3 className="font-display text-lg font-bold text-white">{t('auth.termsTitle')}</h3>
                        </div>
                        <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-400">
                          <p>{t('auth.termsIntro')}</p>
                          <p className="font-semibold text-slate-300">{t('auth.termsVoiceCloningTitle')}</p>
                          <p>{t('auth.termsVoiceCloning1')}</p>
                          <p>{t('auth.termsVoiceCloning2')}</p>
                          <p>{t('auth.termsVoiceCloning3')}</p>
                          <p className="font-semibold text-slate-300">{t('auth.termsDataTitle')}</p>
                          <p>{t('auth.termsData1')}</p>
                          <p>{t('auth.termsData2')}</p>
                          <p className="font-semibold text-slate-300">{t('auth.termsProhibitedTitle')}</p>
                          <p>{t('auth.termsProhibited1')}</p>
                          <p>{t('auth.termsProhibited2')}</p>
                          <p>{t('auth.termsProhibited3')}</p>
                        </div>
                        <div className="mt-5 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowTerms(false)}
                            className="flex-1 rounded-xl border border-ink-600 bg-ink-800/50 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-ink-500 hover:bg-ink-800"
                          >
                            {t('auth.termsClose')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setConsent(true);
                              setShowTerms(false);
                            }}
                            className="flex-1 rounded-xl bg-accent-cyan py-2.5 text-sm font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
                          >
                            {t('auth.termsAccept')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-accent-cyan py-3.5 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98] disabled:opacity-50"
              >
                {busy ? t('auth.processing') : mode === 'signin' ? t('auth.signIn') : t('auth.createAccount')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                }}
                className="text-xs text-slate-400 transition-colors hover:text-accent-cyan"
              >
                {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}
              </button>
            </div>

            {mode === 'signin' && (
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setError(null);
                    setResetSent(false);
                  }}
                  className="text-xs text-slate-500 transition-colors hover:text-accent-cyan"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            )}

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('welcome');
                  setError(null);
                }}
                className="text-xs text-slate-500 transition-colors hover:text-slate-300"
              >
                {t('auth.back')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-ink-700/60 bg-ink-900/40 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-cyan/15 text-accent-cyan">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs leading-relaxed text-slate-400">{desc}</p>
      </div>
    </div>
  );
}
