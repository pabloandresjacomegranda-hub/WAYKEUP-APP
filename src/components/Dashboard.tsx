import { useState } from 'react';
import { Plus, Settings, Zap } from 'lucide-react';
import { Clock } from '@/components/Clock';
import { AlarmCard } from '@/components/AlarmCard';
import { AdBanner } from '@/components/AdBanner';
import { GoPremiumModal } from '@/components/GoPremiumModal';
import { useNow } from '@/hooks/useNow';
import { useLanguage } from '@/hooks/useLanguage';
import { formatNextAlarm } from '@/lib/nextAlarm';
import { getMotivator } from '@/lib/motivators';
import { getVoicePersona } from '@/lib/voices';
import { getClonedVoice } from '@/lib/clonedVoices';
import type { Alarm } from '@/lib/types';

interface DashboardProps {
  alarms: Alarm[];
  loading: boolean;
  error: string | null;
  onAdd: () => void;
  onEdit: (alarm: Alarm) => void;
  onToggle: (alarm: Alarm, enabled: boolean) => void;
  onDelete: (alarm: Alarm) => void;
  onTrigger: (alarm: Alarm) => void;
  onTestReal: (alarm: Alarm) => void;
  onOpenSettings: () => void;
  isPremium: boolean;
  onUpgrade: () => void;
}

export function Dashboard({
  alarms,
  loading,
  error,
  onAdd,
  onEdit,
  onToggle,
  onDelete,
  onTrigger,
  onTestReal,
  onOpenSettings,
  isPremium,
  onUpgrade,
}: DashboardProps) {
  const now = useNow(30000);
  const { lang, t } = useLanguage();
  const nextText = formatNextAlarm(now, alarms, lang);
  const nextAlarm = alarms.find((a) => a.enabled);
  const [adDismissed, setAdDismissed] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  const showAd = !isPremium && !adDismissed;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain">
      <div className="px-5 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">WaykeUp</h1>
            <p className="text-xs text-slate-500">{t('app.tagline')}</p>
          </div>
          <div className="flex items-center gap-2">
            {isPremium && (
              <span className="rounded-full bg-accent-indigo/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-indigo">
                {t('alarm.pro')}
              </span>
            )}
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-600 bg-ink-800 transition-all hover:border-accent-cyan/50 hover:text-accent-cyan"
              aria-label={t('settings.title')}
            >
              <Settings className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6">
        <Clock />
        <div className="mt-4 rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-800 to-ink-900 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t('dashboard.nextAlarm')}
          </p>
          {nextText ? (
            <p className="mt-1 font-medium text-accent-cyan">{nextText}</p>
          ) : (
            <p className="mt-1 font-medium text-slate-500">{t('dashboard.noActive')}</p>
          )}
          {nextAlarm && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: (getClonedVoice(nextAlarm.cloned_voice) ?? getVoicePersona(nextAlarm.voice_persona))?.accent,
                }}
              />
              <span>
                {(getClonedVoice(nextAlarm.cloned_voice) ?? getVoicePersona(nextAlarm.voice_persona))?.name?.[lang]}
              </span>
              <span className="text-slate-600">·</span>
              <span>{getMotivator(nextAlarm.motivator)?.name[lang]}</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => {
            const first = alarms.find((a) => a.enabled) ?? alarms[0];
            if (first) onTestReal(first);
          }}
          disabled={alarms.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent-cyan/30 bg-accent-cyan/10 py-3 text-sm font-semibold text-accent-cyan transition-all hover:bg-accent-cyan/15 disabled:opacity-40 active:scale-[0.98]"
        >
          <Zap className="h-5 w-5" />
          Reproducir alarma ahora
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between px-5">
        <h2 className="font-display text-lg font-semibold text-white">{t('dashboard.alarms')}</h2>
        <span className="text-xs text-slate-500">
          {alarms.filter((a) => a.enabled).length} {t('dashboard.active')}
        </span>
      </div>

      <div className="no-scrollbar mt-3 flex-none space-y-3 overflow-visible px-5 pb-4">
        {loading && (
          <div className="flex items-center justify-center py-10 text-sm text-slate-500">
            {t('dashboard.loading')}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}
        {!loading && !error && alarms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-800">
              <Plus className="h-7 w-7 text-accent-cyan" />
            </div>
            <p className="text-sm font-medium text-slate-300">{t('dashboard.noAlarms')}</p>
            <p className="mt-1 text-xs text-slate-500">{t('dashboard.noAlarmsDesc')}</p>
          </div>
        )}
        {!loading &&
          alarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              alarm={alarm}
              onToggle={(enabled) => onToggle(alarm, enabled)}
              onEdit={() => onEdit(alarm)}
              onDelete={() => onDelete(alarm)}
            />
          ))}
      </div>

      {showAd && (
        <AdBanner
          onClose={() => setAdDismissed(true)}
          onUpgrade={() => setPremiumOpen(true)}
        />
      )}

      <div className="border-t border-ink-700/60 bg-ink-900 px-5 py-4">
        <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent-cyan py-3 font-semibold text-ink-950 transition-all hover:shadow-glow active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          {t('dashboard.newAlarm')}
        </button>
        <button
          type="button"
          onClick={() => {
            const first = alarms.find((a) => a.enabled) ?? alarms[0];
            if (first) onTrigger(first);
          }}
          disabled={alarms.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-4 py-3 font-semibold text-slate-200 transition-all hover:border-accent-indigo/50 hover:text-white disabled:opacity-40 active:scale-[0.98]"
        >
          <Zap className="h-5 w-5 text-accent-indigo" />
          {t('dashboard.test')}
        </button>
        </div>
      </div>


      <GoPremiumModal
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        onUpgrade={() => {
          setPremiumOpen(false);
          onUpgrade();
        }}
      />
    </div>
  );
}
