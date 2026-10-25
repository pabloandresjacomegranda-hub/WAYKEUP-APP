/**
 * Shared AudioContext that survives across the app lifecycle.
 *
 * Browsers block audio playback without a prior user gesture. We create an
 * AudioContext on the first interaction and keep it in a "running" state so
 * that oscillator-based alarm tones can play later without another gesture.
 */

let ctx: AudioContext | null = null;
let wakeLock: WakeLockSentinel | null = null;
let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

function getCtx(): AudioContext | null {
  if (ctx && ctx.state !== 'closed') return ctx;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  try {
    ctx = new Ctor();
  } catch {
    return null;
  }
  return ctx;
}

function unlockAudio() {
  const c = getCtx();
  if (!c) return;

  if (c.state === 'suspended') {
    c.resume().catch(() => {});
  }

  try {
    const osc = c.createOscillator();
    const gain = c.createGain();
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.01);
  } catch {
    // ignore
  }

  if (window.speechSynthesis) {
    try {
      const u = new SpeechSynthesisUtterance(' ');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    } catch {
      // ignore
    }
  }
}

export function initAudioUnlock() {
  if (typeof document === 'undefined') return;
  const events = ['touchstart', 'touchend', 'click', 'keydown'];
  events.forEach((e) => document.addEventListener(e, unlockAudio, true));

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const c = getCtx();
        if (c && c.state === 'suspended') c.resume().catch(() => {});
      }
    });
  }
}

export function isAudioUnlocked() {
  const c = getCtx();
  if (!c) return false;
  return c.state === 'running';
}

export function getAudioContext(): AudioContext | null {
  return getCtx();
}

export function canPlayAudio(): boolean {
  const c = getCtx();
  if (!c) return false;
  return c.state === 'running';
}

export async function resumeAudioContext(): Promise<boolean> {
  const c = getCtx();
  if (!c) return false;
  if (c.state === 'running') return true;
  try {
    await c.resume();
    return c.state === ('running' as AudioContextState);
  } catch {
    return false;
  }
}

/**
 * Generate a repeating beep WAV file as a data URL.
 * This can be used with <audio> elements as a fallback to the Web Audio API.
 */
let alarmBeepUrl: string | null = null;

export function getAlarmBeepUrl(): string {
  if (alarmBeepUrl) return alarmBeepUrl;

  const sampleRate = 44100;
  const beepDuration = 0.15;
  const silenceDuration = 0.1;
  const totalBeeps = 8;
  const totalDuration = totalBeeps * (beepDuration + silenceDuration);
  const totalSamples = Math.ceil(sampleRate * totalDuration);
  const numChannels = 1;
  const bytesPerSample = 2;
  const dataSize = totalSamples * numChannels * bytesPerSample;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  // WAV header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Generate beeps — 880 Hz sine wave with gaps
  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const time = i / sampleRate;
    const beepCycle = time % (beepDuration + silenceDuration);
    let sample = 0;
    if (beepCycle < beepDuration) {
      const envelope = Math.min(1, beepCycle * 40) * Math.min(1, (beepDuration - beepCycle) * 40);
      sample = Math.sin(2 * Math.PI * 880 * time) * envelope * 0.5;
    }
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  alarmBeepUrl = `data:audio/wav;base64,${btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))}`;
  return alarmBeepUrl;
}

/**
 * Play a persistent alarm tone using the Web Audio API.
 * Returns a stop function. The tone loops until stopped.
 */
export function playAlarmTone(volume = 1): (() => void) | null {
  const c = getCtx();
  if (!c) return null;

  if (c.state === 'suspended') {
    c.resume().catch(() => {});
  }

  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();

  osc.type = 'sine';
  osc.frequency.value = 880;
  gain.gain.value = 0;

  lfo.type = 'square';
  lfo.frequency.value = 4;
  lfoGain.gain.value = volume * 0.3;
  lfo.connect(lfoGain);
  lfoGain.connect(gain.gain);

  osc.connect(gain);
  gain.connect(c.destination);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.05);

  osc.start(now);
  lfo.start(now);

  return () => {
    try {
      const stopTime = c.currentTime + 0.1;
      gain.gain.cancelScheduledValues(c.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, c.currentTime);
      gain.gain.linearRampToValueAtTime(0, stopTime);
      osc.stop(stopTime);
      lfo.stop(stopTime);
    } catch {
      // already stopped
    }
  };
}

export async function requestWakeLock(): Promise<void> {
  if (!('wakeLock' in navigator)) return;
  try {
    wakeLock = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<WakeLockSentinel> } }).wakeLock.request('screen');
  } catch {
    // wake lock may fail if page is not visible
  }
}

export function releaseWakeLock(): void {
  if (wakeLock) {
    wakeLock.release().catch(() => {});
    wakeLock = null;
  }
}

export function startKeepAlive(): void {
  if (keepAliveInterval) return;
  keepAliveInterval = setInterval(() => {
    const c = getCtx();
    if (c && c.state === 'suspended') {
      c.resume().catch(() => {});
    }
  }, 5000);
}

export function stopKeepAlive(): void {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
  }
}

/**
 * Force-close the shared AudioContext and cancel every periodic timer.
 * Called on alarm dismissal, foreground return, and component unmount
 * to prevent zombie audio loops from surviving in the iOS media subsystem.
 */
export function forceStopAllAudio(): void {
  stopKeepAlive();

  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  if (ctx) {
    try {
      if (ctx.state !== 'closed') {
        ctx.close();
      }
    } catch {
      // ignore
    }
    ctx = null;
  }
}
