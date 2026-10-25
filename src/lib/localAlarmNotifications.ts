import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { Alarm } from '@/lib/types';

const NOTIFICATION_ID_BASE = 240000000;

function notificationId(alarmId: string, day: number): number {
  let hash = 0;
  for (let index = 0; index < alarmId.length; index += 1) {
    hash = (hash * 31 + alarmId.charCodeAt(index)) | 0;
  }
  return NOTIFICATION_ID_BASE + Math.abs(hash % 1000000) * 10 + day;
}

function nextDateForDay(time: string, day: number): Date {
  const [hours, minutes] = time.slice(0, 5).split(':').map(Number);
  const now = new Date();
  const next = new Date(now);
  next.setHours(hours, minutes, 0, 0);
  const daysUntil = (day - now.getDay() + 7) % 7;
  next.setDate(now.getDate() + daysUntil);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 7);
  return next;
}

function alarmTitle(alarm: Alarm): string {
  return alarm.label.startsWith('preset:') ? 'WaykeUp' : alarm.label;
}

export async function requestLocalAlarmPermission(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display === 'prompt' || permission.display === 'prompt-with-rationale') {
    await LocalNotifications.requestPermissions();
  }
}

export async function syncLocalAlarmNotifications(alarms: Alarm[]): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel({
      notifications: pending.notifications.map(({ id }) => ({ id })),
    });
  }

  const notifications = alarms.flatMap((alarm) => {
    if (!alarm.enabled) return [];
    return alarm.days.flatMap((enabled, day) => {
      if (!enabled) return [];
      return [{
        id: notificationId(alarm.id, day),
        title: alarmTitle(alarm),
        body: `${alarm.time.slice(0, 5)} · ${alarm.custom_text ?? 'Es hora de despertar'}`,
        schedule: {
          at: nextDateForDay(alarm.time, day),
          repeats: true,
          every: 'week' as const,
          allowWhileIdle: true,
        },
        sound: 'default',
        extra: { alarmId: alarm.id },
      }];
    });
  });

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
}
