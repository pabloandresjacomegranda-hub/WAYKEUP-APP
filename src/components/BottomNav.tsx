import { AlarmClock, Clock, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export type Tab = 'alarms' | 'focus' | 'assistant';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-around border-t border-ink-700/60 bg-ink-900/80 px-6 py-2 backdrop-blur">
      <button
        type="button"
        onClick={() => onChange('alarms')}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
          active === 'alarms' ? 'text-accent-cyan' : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <AlarmClock className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t('nav.alarms')}</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('focus')}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
          active === 'focus' ? 'text-accent-indigo' : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <Clock className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t('nav.focus')}</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('assistant')}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
          active === 'assistant' ? 'text-accent-cyan' : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-[10px] font-medium">{t('nav.assistant')}</span>
      </button>
    </div>
  );
}
