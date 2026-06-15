'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom glowing cursor with trailing dots
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const positions = useRef<{ x: number; y: number }[]>(
    Array(8).fill({ x: 0, y: 0 })
  );

  useEffect(() => {
    const accents = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF', '#FF007F', '#00E5FF', '#FFEA00'];
    let mouseX = 0, mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Main cursor
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
      }

      // Update trail positions (shift back)
      positions.current = [{ x: mouseX, y: mouseY }, ...positions.current.slice(0, 7)];

      trailRefs.current.forEach((el, i) => {
        if (!el) return;
        const scale = 1 - (i + 1) * 0.1;
        const alpha = 1 - (i + 1) * 0.12;
        el.style.transform = `translate(${positions.current[i].x - 4}px, ${positions.current[i].y - 4}px) scale(${scale})`;
        el.style.opacity = `${alpha}`;
        el.style.backgroundColor = accents[i];
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          width: 12, height: 12,
          backgroundColor: '#FF007F',
          boxShadow: '0 0 12px #FF007F, 0 0 24px #FF007F',
        }}
      />
      {/* Trail dots */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="custom-cursor"
          ref={el => { if (el) trailRefs.current[i] = el; }}
          style={{
            width: 8 - i * 0.5,
            height: 8 - i * 0.5,
            backgroundColor: '#00E5FF',
            transition: `opacity 80ms`,
          }}
        />
      ))}
    </>
  );
}
