import { useNow } from '@/hooks/useNow';
import { useLanguage } from '@/hooks/useLanguage';
import { LOCALE_MAP } from '@/lib/types';

export function Clock() {
  const now = useNow(1000);
  const { lang } = useLanguage();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const dateStr = now.toLocaleDateString(LOCALE_MAP[lang], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="text-center">
      <div className="flex items-end justify-center gap-1 font-mono font-medium tracking-tight">
        <span className="text-6xl text-white tabular-nums">{hh}</span>
        <span className="text-5xl text-accent-cyan/70 tabular-nums">:</span>
        <span className="text-6xl text-white tabular-nums">{mm}</span>
        <span className="ml-1 mb-2 text-2xl text-slate-500 tabular-nums">{ss}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-400">{dateStr}</p>
    </div>
  );
}
