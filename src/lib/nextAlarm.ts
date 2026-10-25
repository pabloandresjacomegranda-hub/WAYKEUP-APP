import { DAY_LABELS, type Alarm, type Language } from './types';

const TODAY_LABELS: Record<Language, string> = {
  en: 'Today',
  de: 'Heute',
  es: 'Hoy',
  fr: 'Aujourd\'hui',
  pt: 'Hoje',
  it: 'Oggi',
};

const TOMORROW_LABELS: Record<Language, string> = {
  en: 'Tomorrow',
  de: 'Morgen',
  es: 'Mañana',
  fr: 'Demain',
  pt: 'Amanhã',
  it: 'Domani',
};

const HOUR_LABELS: Record<Language, string> = {
  en: 'h',
  de: 'Std',
  es: 'h',
  fr: 'h',
  pt: 'h',
  it: 'h',
};

const MINUTE_LABELS: Record<Language, string> = {
  en: 'm',
  de: 'Min',
  es: 'm',
  fr: 'min',
  pt: 'min',
  it: 'min',
};

export function formatNextAlarm(now: Date, alarms: Alarm[], lang: Language = 'en'): string | null {
  const enabled = alarms.filter((a) => a.enabled);
  if (enabled.length === 0) return null;

  const todayIdx = now.getDay();
  const reference = new Date(now);
  reference.setSeconds(0, 0);
  const labels = DAY_LABELS[lang];

  let best: { alarm: Alarm; target: Date; delta: number; offset: number } | null = null;

  for (const alarm of enabled) {
    for (let offset = 0; offset < 8; offset++) {
      const checkDay = (todayIdx + offset) % 7;
      if (!alarm.days[checkDay]) continue;

      const [h, m] = alarm.time.split(':').map(Number);
      const target = new Date(reference);
      target.setDate(reference.getDate() + offset);
      target.setHours(h, m, 0, 0);
      if (target < reference) continue;

      const delta = target.getTime() - reference.getTime();
      if (!best || delta < best.delta) {
        best = { alarm, target, delta, offset };
      }
    }
  }

  if (!best) return null;

  const totalMinutes = Math.floor(best.delta / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const dayName =
    best.offset === 0
      ? TODAY_LABELS[lang]
      : best.offset === 1
        ? TOMORROW_LABELS[lang]
        : labels[best.target.getDay()];

  return `${dayName} · ${best.alarm.time.slice(0, 5)} · ${hours}${HOUR_LABELS[lang]} ${minutes}${MINUTE_LABELS[lang]}`;
}
