import { useCallback, useEffect, useState } from 'react';
import {
  createFocusSession,
  fetchFocusSessions,
  updateFocusSession,
} from '@/lib/focusSessions';
import type { FocusSession, FocusSessionInsert } from '@/lib/types';

export function useFocusSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const rows = await fetchFocusSessions();
      setSessions(rows);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(async (session: FocusSessionInsert) => {
    const created = await createFocusSession(session);
    setSessions((prev) => [created, ...prev]);
    return created;
  }, []);

  const patch = useCallback(async (id: string, p: Partial<FocusSession>) => {
    await updateFocusSession(id, p);
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...p } : s))
    );
  }, []);

  return { sessions, loading, reload: load, add, patch };
}
