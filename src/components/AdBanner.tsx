import { Sparkles, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface AdBannerProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export function AdBanner({ onClose, onUpgrade }: AdBannerProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-3 border-t border-ink-700/60 bg-gradient-to-r from-ink-800 to-ink-900 px-4 py-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-indigo/15">
        <Sparkles className="h-4 w-4 text-accent-indigo" />
      </span>
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-600">
          {t('ad.sponsored')}
        </p>
        <p className="text-xs leading-tight text-slate-300">{t('ad.message')}</p>
      </div>
      <button
        type="button"
        onClick={onUpgrade}
        className="shrink-0 rounded-lg bg-accent-indigo px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-accent-indigo/80 active:scale-[0.97]"
      >
        {t('ad.upgrade')}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-lg p-1 text-slate-500 transition-colors hover:bg-ink-700 hover:text-slate-300"
        aria-label={t('common.close')}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
