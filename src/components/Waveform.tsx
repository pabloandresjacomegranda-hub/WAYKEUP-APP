import { useEffect, useRef, useState } from 'react';

interface WaveformProps {
  active: boolean;
  bars?: number;
  className?: string;
}

export function Waveform({ active, bars = 48, className = '' }: WaveformProps) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: bars }, () => 0.2)
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setHeights(Array.from({ length: bars }, () => 0.15));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    let last = 0;
    const tick = (t: number) => {
      if (t - last > 90) {
        last = t;
        setHeights((prev) =>
          prev.map((_, i) => {
            const base = 0.3 + 0.5 * Math.sin((t / 400) + i * 0.5);
            const jitter = Math.random() * 0.25;
            return Math.max(0.12, Math.min(1, base + jitter));
          })
        );
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, bars]);

  return (
    <div className={`flex h-20 items-center justify-center gap-1 ${className}`}>
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-accent-indigo to-accent-cyan transition-[height] duration-100 ease-out"
          style={{ height: `${Math.round(h * 100)}%` }}
        />
      ))}
    </div>
  );
}
