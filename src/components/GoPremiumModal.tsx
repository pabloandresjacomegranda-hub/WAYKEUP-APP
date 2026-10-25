import { useEffect } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface GoPremiumModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function GoPremiumModal({ open, onClose, onUpgrade }: GoPremiumModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const features = [
    t('premium.feature1'),
    t('premium.feature2'),
    t('premium.feature3'),
    t('premium.feature4'),
  ];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink-950/90 px-5 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-ink-700 bg-ink-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-indigo/15">
              <Sparkles className="h-6 w-6 text-accent-indigo" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-white">{t('premium.title')}</h2>
              <p className="text-xs text-slate-500">{t('premium.subtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-ink-700 hover:text-white"
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="mt-5 space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-indigo/20">
                <Check className="h-3.5 w-3.5 text-accent-indigo" />
              </span>
              <span className="text-sm text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-ink-700 bg-ink-800 p-4 text-center">
          <p className="text-xs text-slate-500">{t('premium.priceLabel')}</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">
            {t('premium.price')}
            <span className="text-base font-normal text-slate-500">/{t('premium.month')}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className="mt-5 w-full rounded-xl bg-accent-indigo py-3.5 font-semibold text-white transition-all hover:shadow-glow active:scale-[0.98]"
        >
          {t('premium.cta')}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-xl py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-300"
        >
          {t('premium.maybeLater')}
        </button>
      </div>
    </div>
  );
}
