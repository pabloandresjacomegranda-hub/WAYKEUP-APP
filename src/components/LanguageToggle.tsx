import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { LANGUAGES, LANGUAGE_LABELS, LANGUAGE_FLAGS, type Language } from '@/lib/types';

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full border border-ink-600 bg-ink-800 px-2.5 py-1 text-xs font-medium text-slate-200 transition-all hover:border-accent-cyan/50"
        aria-label={t('language.toggle')}
      >
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <span className="uppercase">{lang}</span>
        <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[60] mt-2 max-h-[calc(100dvh-5rem)] w-44 overflow-y-auto overscroll-contain rounded-xl border border-ink-600 bg-ink-800 py-1 shadow-2xl shadow-black/50">
          {LANGUAGES.map((l: Language) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                lang === l
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-slate-300 hover:bg-ink-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">{LANGUAGE_FLAGS[l]}</span>
                {LANGUAGE_LABELS[l]}
              </span>
              {lang === l && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
