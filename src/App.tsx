import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { AlarmModal } from '@/components/AlarmModal';
import { TestSimulator } from '@/components/TestSimulator';
import { FocusTimer } from '@/components/FocusTimer';
import { AIAssistant } from '@/components/AIAssistant';
import { BottomNav, type Tab } from '@/components/BottomNav';
import { LanguageToggle } from '@/components/LanguageToggle';
import { SettingsModal } from '@/components/SettingsModal';
import { ActiveAlarm } from '@/components/ActiveAlarm';
import { useAlarms } from '@/hooks/useAlarms';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useNow } from '@/hooks/useNow';
import type { Alarm, AlarmInsert } from '@/lib/types';
import { resumeAudioContext, forceStopAllAudio } from '@/lib/audioUnlock';
import { App as CapacitorApp } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { requestLocalAlarmPermission, syncLocalAlarmNotifications } from '@/lib/localAlarmNotifications';

function AppContent() {
  const statusNow = useNow(1000);
  const { session, loading: authLoading, signIn, signUp, signOut, resetPassword } = useAuth();
  const { alarms, loading, error, add, patch, remove } = useAlarms();
  const { isPremium, settings, updateTier, updateApiKey } = useSettings();
  const [tab, setTab] = useState<Tab>('alarms');
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editing, setEditing] = useState<Alarm | null>(null);
  const [simulating, setSimulating] = useState<Alarm | null>(null);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const lastTriggerRef = useRef<string | null>(null);
  const snoozeAlarmRef = useRef<Alarm | null>(null);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (alarm: Alarm) => {
    setEditing(alarm);
    setModalOpen(true);
  };

  const handleSave = useCallback(
    async (alarm: AlarmInsert, id?: string) => {
      try {
        if (id) {
          await patch(id, alarm);
        } else {
          await add(alarm);
        }
        setModalOpen(false);
        setEditing(null);
      } catch (e) {
        console.error(e);
      }
    },
    [add, patch]
  );

  useEffect(() => {
    void requestLocalAlarmPermission().catch((error: unknown) => {
      console.error('local notification permission failed', error);
    });
  }, []);

  useEffect(() => {
    void syncLocalAlarmNotifications(alarms).catch((error: unknown) => {
      console.error('local alarm scheduling failed', error);
    });
  }, [alarms]);

  useEffect(() => {
    const openNotificationAlarm = (notification: { extra?: { alarmId?: unknown } }) => {
      const alarmId = notification.extra?.alarmId;
      const match = typeof alarmId === 'string' ? alarms.find((alarm) => alarm.id === alarmId) : undefined;
      if (match) setActiveAlarm(match);
    };
    const receivedListener = LocalNotifications.addListener('localNotificationReceived', (notification) => {
      openNotificationAlarm(notification);
    });
    const actionListener = LocalNotifications.addListener('localNotificationActionPerformed', ({ notification }) => {
      openNotificationAlarm(notification);
    });
    return () => {
      receivedListener.then((handle) => handle.remove()).catch(() => {});
      actionListener.then((handle) => handle.remove()).catch(() => {});
    };
  }, [alarms]);

  const handleToggle = useCallback(
    async (alarm: Alarm, enabled: boolean) => {
      try {
        await patch(alarm.id, { enabled });
      } catch (e) {
        console.error(e);
      }
    },
    [patch]
  );

  const handleDelete = useCallback(
    async (alarm: Alarm) => {
      try {
        await remove(alarm.id);
      } catch (e) {
        console.error(e);
      }
    },
    [remove]
  );

  const handleTrigger = useCallback((alarm: Alarm) => {
    setSimulating(alarm);
  }, []);

  const handleTestReal = useCallback((alarm: Alarm) => {
    setActiveAlarm(alarm);
  }, []);

  useEffect(() => {
    if (activeAlarm || simulating) return;
    const checkAlarms = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hh}:${mm}`;
      const dayIdx = now.getDay();
      const triggerKey = `${currentTime}-${dayIdx}`;
      if (lastTriggerRef.current === triggerKey) return;
      const match = alarms.find(
        (a) => a.enabled && a.time.slice(0, 5) === currentTime && a.days[dayIdx]
      );
      if (match) {
        lastTriggerRef.current = triggerKey;
        setActiveAlarm(match);
      }
    };
    checkAlarms();
    const id = setInterval(checkAlarms, 1000);
    return () => clearInterval(id);
  }, [alarms, activeAlarm, simulating]);

  // When the page becomes visible again (user returns to the app),
  // resume the audio context and check for missed alarms immediately.
  // Also check the previous minute in case the alarm time passed while
  // the tab was in the background and the setInterval was throttled.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (activeAlarm || simulating) return;
      void resumeAudioContext();
      const now = new Date();
      const dayIdx = now.getDay();
      // Check current minute and the previous one (in case we missed it)
      for (const offset of [0, 1]) {
        const checkTime = new Date(now.getTime() - offset * 60000);
        const hh = String(checkTime.getHours()).padStart(2, '0');
        const mm = String(checkTime.getMinutes()).padStart(2, '0');
        const timeStr = `${hh}:${mm}`;
        const triggerKey = `${timeStr}-${dayIdx}`;
        if (lastTriggerRef.current === triggerKey) continue;
        const match = alarms.find(
          (a) => a.enabled && a.time.slice(0, 5) === timeStr && a.days[dayIdx]
        );
        if (match) {
          lastTriggerRef.current = triggerKey;
          setActiveAlarm(match);
          break;
        }
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [alarms, activeAlarm, simulating]);

  // Capacitor App lifecycle: when the app returns to foreground, kill any
  // orphan audio that survived from a dismissed alarm while in background.
  useEffect(() => {
    const listener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) return;
      if (!activeAlarm && !simulating) {
        forceStopAllAudio();
      }
    });
    return () => {
      listener.then((l) => l.remove()).catch(() => {});
    };
  }, [activeAlarm, simulating]);

  const handleDismissAlarm = useCallback(() => {
    setActiveAlarm(null);
  }, []);

  const handleSnoozeAlarm = useCallback(() => {
    if (!activeAlarm) return;
    snoozeAlarmRef.current = activeAlarm;
    setActiveAlarm(null);
    setTimeout(() => {
      if (snoozeAlarmRef.current) {
        setActiveAlarm(snoozeAlarmRef.current);
        snoozeAlarmRef.current = null;
      }
    }, 5 * 60 * 1000);
  }, [activeAlarm]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <Loader2 className="h-8 w-8 animate-spin text-accent-cyan" />
      </div>
    );
  }

  if (!session) {
    return (
      <WelcomeScreen
        onSignIn={signIn}
        onSignUp={signUp}
        onResetPassword={resetPassword}
      />
    );
  }

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-ink-950">
      <div className="flex items-center justify-between px-5 pt-3 text-slate-300">
        <span className="text-xs font-medium tabular-nums">
          {String(statusNow.getHours()).padStart(2, '0')}:{String(statusNow.getMinutes()).padStart(2, '0')}
        </span>
        <LanguageToggle />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {tab === 'alarms' && (
          <Dashboard
            alarms={alarms}
            loading={loading}
            error={error}
            onAdd={openNew}
            onEdit={openEdit}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onTrigger={handleTrigger}
            onTestReal={handleTestReal}
            onOpenSettings={() => setSettingsOpen(true)}
            isPremium={isPremium}
            onUpgrade={() => updateTier('premium')}
          />
        )}
        {tab === 'focus' && <FocusTimer />}
        {tab === 'assistant' && <AIAssistant />}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      <AlarmModal
        open={modalOpen}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        isPremium={isPremium}
        apiKey={settings?.elevenlabs_api_key ?? null}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isPremium={isPremium}
        apiKey={settings?.elevenlabs_api_key ?? null}
        onUpdateTier={updateTier}
        onUpdateApiKey={updateApiKey}
        onSignOut={signOut}
      />

      {simulating && (
        <TestSimulator
          alarm={simulating}
          onClose={() => setSimulating(null)}
          isPremium={isPremium}
          apiKey={settings?.elevenlabs_api_key ?? null}
        />
      )}

      {activeAlarm && (
        <ActiveAlarm
          alarm={activeAlarm}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
          apiKey={settings?.elevenlabs_api_key ?? null}
        />
      )}
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
