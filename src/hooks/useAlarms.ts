import { useCallback, useEffect, useState } from 'react';
import {
  createAlarm,
  deleteAlarmRow,
  fetchAlarms,
  updateAlarm,
} from '@/lib/alarms';
import { DEFAULT_ALARMS } from '@/lib/defaultAlarms';
import type { Alarm, AlarmInsert } from '@/lib/types';

function generateId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toAlarm(insert: AlarmInsert, id: string): Alarm {
  return { ...insert, id, created_at: new Date().toISOString() };
}

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbAvailable, setDbAvailable] = useState(true);

  const load = useCallback(async () => {
    try {
      setError(null);
      const rows = await fetchAlarms();
      setAlarms(rows);
      setDbAvailable(true);
    } catch {
      setDbAvailable(false);
      setError(null);
      setAlarms(
        DEFAULT_ALARMS.map((a, i) =>
          toAlarm(a, `default-${i}`)
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (alarm: AlarmInsert) => {
      if (dbAvailable) {
        try {
          const created = await createAlarm(alarm);
          setAlarms((prev) => [...prev, created].sort((a, b) => a.time.localeCompare(b.time)));
          return created;
        } catch {
          setDbAvailable(false);
        }
      }
      const created = toAlarm(alarm, generateId());
      setAlarms((prev) => [...prev, created].sort((a, b) => a.time.localeCompare(b.time)));
      return created;
    },
    [dbAvailable]
  );

  const patch = useCallback(
    async (id: string, p: Partial<AlarmInsert>) => {
      if (dbAvailable && !id.startsWith('default-') && !id.startsWith('local-')) {
        try {
          await updateAlarm(id, p);
        } catch {
          setDbAvailable(false);
        }
      }
      setAlarms((prev) =>
        prev
          .map((a) => (a.id === id ? { ...a, ...p } : a))
          .sort((a, b) => a.time.localeCompare(b.time))
      );
    },
    [dbAvailable]
  );

  const remove = useCallback(
    async (id: string) => {
      if (dbAvailable && !id.startsWith('default-') && !id.startsWith('local-')) {
        try {
          await deleteAlarmRow(id);
        } catch {
          setDbAvailable(false);
        }
      }
      setAlarms((prev) => prev.filter((a) => a.id !== id));
    },
    [dbAvailable]
  );

  return { alarms, loading, error, reload: load, add, patch, remove };
}
