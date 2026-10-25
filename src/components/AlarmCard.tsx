import { Moon } from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';
import { Toggle } from './Toggle';
import { getVoicePersona } from '@/lib/voices';
import { getClonedVoice } from '@/lib/clonedVoices';
import { getMotivator } from '@/lib/motivators';
import { useLanguage } from '@/hooks/useLanguage';
import { DAY_LABELS_SHORT, translateLabel, type Alarm } from '@/lib/types';

interface AlarmCardProps {
  alarm: Alarm;
  onToggle: (enabled: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AlarmCard({ alarm, onToggle, onEdit, onDelete }: AlarmCardProps) {
  const { lang, t } = useLanguage();
  const voice = getVoicePersona(alarm.voice_persona);
  const cloned = getClonedVoice(alarm.cloned_voice);
  const motivator = getMotivator(alarm.motivator);
  const isPremium = alarm.voice_tier === 'premium';
  const dayLabels = DAY_LABELS_SHORT[lang];

  return (
    <div
      className={`group rounded-2xl border p-4 transition-all duration-300 ${
        alarm.enabled
          ? 'border-ink-600 bg-ink-800/80'
          : 'border-ink-700/50 bg-ink-900/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 flex-col items-start text-left"
        >
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-3xl font-semibold tabular-nums ${
                alarm.enabled ? 'text-white' : 'text-slate-500'
              }`}
            >
              {alarm.time.slice(0, 5)}
            </span>
            {isPremium && alarm.enabled && (
              <span className="rounded-full bg-accent-indigo/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-indigo">
                {t('dashboard.premium')}
              </span>
            )}
            {alarm.subconscious_mode && alarm.enabled && (
              <span className="flex items-center gap-1 rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-300">
                <Moon className="h-3 w-3" />
                {t('dashboard.subconscious')}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-sm text-slate-400">{translateLabel(alarm.label, t)}</p>
        </button>
        <Toggle checked={alarm.enabled} onChange={onToggle} label={t('alarm.toggleAlarm')} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex gap-1">
          {dayLabels.map((d, i) => (
            <span
              key={i}
              className={`flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-medium ${
                alarm.days[i]
                  ? 'bg-accent-cyan/15 text-accent-cyan'
                  : 'bg-ink-700/50 text-slate-600'
              }`}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-ink-700/60 pt-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: (cloned ?? voice)?.accent ?? '#22d3ee' }}
          />
          <span className="font-medium text-slate-300">
            {cloned ? cloned.name[lang] : voice?.name?.[lang] ?? '—'}
          </span>
          <span className="text-slate-600">·</span>
          <span>{motivator?.name[lang] ?? '—'}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-ink-700 hover:text-white"
            aria-label={t('common.edit')}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-ink-700 hover:text-rose-400"
            aria-label={t('common.delete')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
