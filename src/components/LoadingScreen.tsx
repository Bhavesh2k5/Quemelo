'use client';

import { useEffect, useState } from 'react';

/**
 * Loading screen — typewriter QUEMELO + rising equalizer bars
 */
export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [typed, setTyped] = useState('');
  const letters = 'QUEMELO';

  // Static bar heights to avoid hydration mismatch
  const [barHeights] = useState(() =>
    [24, 45, 12, 38, 55, 18, 42, 28, 60, 34, 15, 48, 22, 50, 19, 36, 58, 27, 44, 14]
  );

  const ACCENTS = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF'];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(letters.slice(0, i + 1));
      i++;
      if (i >= letters.length) clearInterval(interval);
    }, 100);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 1800);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        backgroundColor: '#080818',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.4s ease',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, #FF007F 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px', opacity: 0.06,
      }} />

      <h1 style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 900,
        fontSize: '5rem', letterSpacing: '0.2em',
        position: 'relative', zIndex: 1, margin: 0,
        background: 'linear-gradient(90deg, #FF007F, #00E5FF, #FFEA00, #FF3300, #7000FF)',
        backgroundSize: '300% 300%',
        backgroundClip: 'text', WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animationName: 'gradient-shift',
        animationDuration: '4s',
        animationTimingFunction: 'ease',
        animationIterationCount: 'infinite',
      }}>
        {typed}
        <span style={{ color: '#FF007F', WebkitTextFillColor: '#FF007F' }}>|</span>
      </h1>

      <div style={{ display: 'flex', gap: 6, marginTop: 32, alignItems: 'flex-end', height: 64 }}>
        {barHeights.map((h, i) => (
          <div
            key={i}
            style={{
              width: 4,
              backgroundColor: ACCENTS[i % 5],
              borderRadius: 4,
              height: `${h}px`,
              animationName: 'waveform-bar',
              animationDuration: `${0.4 + (i % 5) * 0.15}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDelay: `${i * 0.05}s`,
              '--bar-height': `${h}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
