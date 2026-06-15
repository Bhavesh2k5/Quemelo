'use client';

import { useEffect, useState } from 'react';

interface Props {
  barCount?: number;
  maxHeight?: number;
  active?: boolean;
  variant?: 'horizontal' | 'mini';
}

const ACCENTS = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF'];

export default function EqualizerBars({ barCount = 32, maxHeight = 80, active = false, variant = 'horizontal' }: Props) {
  const isMini = variant === 'mini';

  const [mounted, setMounted] = useState(false);
  const [bars] = useState(() =>
    Array.from({ length: barCount }).map((_, i) => ({
      h: Math.floor(Math.random() * (maxHeight - 8) + 8),
      dur: (0.4 + (i % 7) * 0.1).toFixed(2),
      delay: (i * 0.04).toFixed(2),
      color: ACCENTS[i % ACCENTS.length],
    }))
  );

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted || bars.length === 0) {
    // SSR placeholder — just empty divs at min height
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMini ? 2 : 4, height: isMini ? 32 : maxHeight + 8 }}>
        {Array.from({ length: barCount }).map((_, i) => (
          <div key={i} style={{ width: isMini ? 3 : 5, height: 4, backgroundColor: ACCENTS[i % ACCENTS.length], borderRadius: 9999, flexShrink: 0 }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMini ? 2 : 4, height: isMini ? 32 : maxHeight + 8 }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          className={active ? 'waveform-bar' : ''}
          style={{
            width: isMini ? 3 : 5,
            height: active ? 4 : bar.h,
            maxHeight,
            backgroundColor: bar.color,
            borderRadius: 9999,
            // Use separate animation properties (not shorthand) to avoid React warning
            animationName: active ? 'waveform-bar' : undefined,
            animationDuration: active ? `${bar.dur}s` : undefined,
            animationTimingFunction: active ? 'ease-in-out' : undefined,
            animationIterationCount: active ? 'infinite' : undefined,
            animationDelay: active ? `${bar.delay}s` : undefined,
            willChange: 'height',
            flexShrink: 0,
            transition: active ? 'none' : 'height 0.8s ease',
          }}
        />
      ))}
    </div>
  );
}
