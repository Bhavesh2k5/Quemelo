'use client';

import { useEffect, useRef, useState } from 'react';
import { Cpu, Radio, Zap, Mic, Cloud, Fingerprint, Waves, Database, Globe, Lock } from 'lucide-react';
import Link from 'next/link';
import EqualizerBars from '@/components/EqualizerBars';

const ACCENTS = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF'];

// ── Animated Audio Wave SVG ──────────────────────────────────
function WaveSVG({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <svg viewBox="0 0 400 60" style={{ width: '100%', height: 60, overflow: 'visible' }}>
      <path
        d="M0,30 C50,5 100,55 150,30 C200,5 250,55 300,30 C350,5 400,55 400,30"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="square"
        className="anim-gradient"
        style={{
          animationDuration: `${3 + delay}s`,
          opacity: 1,
          filter: `drop-shadow(4px 4px 0 #000)`,
        }}
      />
    </svg>
  );
}

// ── Circular Frequency Ring ──────────────────────────────────
function FrequencyRing({ radius, color, duration }: { radius: number; color: string; duration: number }) {
  return (
    <div
      className="anim-sonar"
      style={{
        position: 'absolute',
        width: radius * 2, height: radius * 2,
        borderRadius: '50%',
        border: `4px solid ${color}`,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.8,
        animationDuration: `${duration}s`,
        animationDelay: `${duration * 0.3}s`,
        pointerEvents: 'none',
        boxShadow: '4px 4px 0 #000',
      }}
    />
  );
}

// ── Stat Counter (client only) ───────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 33);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="font-heading text-gradient" style={{ fontSize: '4rem', lineHeight: 1, textShadow: '4px 4px 0 #000' }}>{count}{suffix}</div>;
}

// ── Tech Step Card ───────────────────────────────────────────
function TechCard({ step, title, desc, icon: Icon, color, accent, detail, children }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#111',
        border: `4px solid ${color}`,
        borderRadius: 0,
        padding: '36px 32px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        transform: hovered ? 'translate(-4px, -4px)' : 'translate(0, 0)',
        boxShadow: hovered
          ? `16px 16px 0 ${accent}, 24px 24px 0 #000`
          : `8px 8px 0 ${accent}, 16px 16px 0 #000`,
        cursor: 'none',
      }}
    >
      {/* Pattern dots bg */}
      <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 0 }} />

      {/* Step badge */}
      <div style={{
        position: 'absolute', top: 20, right: 20,
        background: color, border: '4px solid #000', padding: '6px 12px',
        fontFamily: "'Outfit', sans-serif", fontWeight: 900,
        fontSize: '0.9rem', color: '#000', letterSpacing: '0.1em',
        boxShadow: '4px 4px 0 #000', zIndex: 10
      }}>
        STEP {step}
      </div>

      {/* Icon */}
      <div className="anim-wiggle" style={{
        width: 80, height: 80, borderRadius: 0,
        background: accent,
        border: `4px solid #000`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, position: 'relative', zIndex: 10,
        boxShadow: `6px 6px 0 ${color}`,
      }}>
        <Icon size={40} color="#000" strokeWidth={3} />
      </div>

      <h3 className="font-heading" style={{ fontSize: '1.6rem', color: '#fff', marginBottom: 16, position: 'relative', zIndex: 10, textShadow: `2px 2px 0 ${color}` }}>
        {title.toUpperCase()}
      </h3>
      <p style={{ color: '#fff', lineHeight: 1.6, fontSize: '1.05rem', fontWeight: 700, marginBottom: 24, position: 'relative', zIndex: 10 }}>{desc}</p>

      {/* Detail tag */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#000', border: `4px solid ${color}`,
        padding: '8px 16px', position: 'relative', zIndex: 10,
        color: color, fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.1em',
        boxShadow: '4px 4px 0 #000'
      }}>
        {detail}
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <main style={{ background: '#050505', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative', textAlign: 'center' }}>
        <div className="pattern-dots-cyan" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        <div className="pattern-sonic-mesh" style={{ position: 'absolute', inset: 0 }} />

        {/* Floating shapes */}
        {['♩','♫','♬','♪','●'].map((s, i) => (
          <span key={i} className="anim-float" style={{ position: 'absolute', fontSize: [40,56,32,48,28][i], color: ACCENTS[i], opacity: 0.3, top: `${[15,65,10,70,40][i]}%`, left: `${[8,85,50,20,75][i]}%`, animationDelay: `${i*0.5}s`, pointerEvents: 'none', userSelect: 'none' }}>{s}</span>
        ))}

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div className="anim-wiggle" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FFEA00', border: '4px solid #000', padding: '10px 20px', marginBottom: 32, boxShadow: '6px 6px 0 #FF007F' }}>
            <div className="anim-pulse" style={{ width: 12, height: 12, borderRadius: '50%', background: '#000' }} />
            <span style={{ color: '#000', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Under the Hood</span>
          </div>

          <h1 className="font-heading" style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', color: 'white', marginBottom: 32, lineHeight: 0.9 }}>
            THE <span className="text-gradient" style={{ display: 'inline-block', transform: 'rotate(-2deg)' }}>TECHNOLOGY</span><br />
            <span style={{ color: '#00E5FF', textShadow: '6px 6px 0 #000, 12px 12px 0 #FF007F, 18px 18px 0 #FFEA00', display: 'inline-block', transform: 'rotate(2deg)' }}>BEHIND THE SOUND</span>
          </h1>
          <p style={{ color: '#FF007F', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 900, maxWidth: 700, margin: '0 auto 48px', lineHeight: 1.5, background: '#000', padding: '16px 24px', border: '4px solid #FF007F' }}>
            From raw microphone signal to song title in under a second. Here's how Quemelo turns acoustic chaos into musical truth.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <EqualizerBars barCount={32} maxHeight={48} active={true} />
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────── */}
      <div style={{ padding: '0 40px', opacity: 0.8, marginBottom: -20, position: 'relative', zIndex: 5 }}>
        <WaveSVG color="#FF007F" />
      </div>

      {/* ── HOW IT WORKS — STEP BY STEP ──────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative', background: '#FFEA00' }}>
        <div className="pattern-stripes" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#000', textAlign: 'center', marginBottom: 80, textShadow: '4px 4px 0 #FF007F, 8px 8px 0 #00E5FF' }}>
            HOW WE CATCH THE SONG
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
            <TechCard
              step={1} icon={Mic} color="#FF007F" accent="#00E5FF"
              title="Microphone Capture"
              desc="The Web Audio API's MediaStream is intercepted at the source — before any OS noise filtering applies. We grab the raw PCM audio data at 44.1kHz sample rate."
              detail="⟶ 8 sec / 44,100 Hz / Stereo"
            >
              <div style={{ marginTop: 24 }}>
                <WaveSVG color="#FF007F" delay={0} />
              </div>
            </TechCard>

            <TechCard
              step={2} icon={Fingerprint} color="#00E5FF" accent="#FFEA00"
              title="Acoustic Fingerprinting"
              desc="We apply a Short-Time Fourier Transform (STFT) to convert time-domain audio into the frequency domain, then extract a Constellation Map of peak frequencies — the song's unique DNA."
              detail="⟶ FFT size: 4096 points, 50% overlap"
            >
              <div style={{ marginTop: 24, display: 'flex', gap: 6, alignItems: 'flex-end', height: 48 }}>
                {Array.from({ length: 20 }).map((_, i) => {
                  const h = [12,36,24,48,16,40,20,32,10,28,38,14,26,34,18,30,8,22,36,16][i];
                  return (
                    <div key={i} style={{ flex: 1, height: h, backgroundColor: ACCENTS[i%5], border: '2px solid #000' }} />
                  );
                })}
              </div>
            </TechCard>

            <TechCard
              step={3} icon={Cloud} color="#FFEA00" accent="#FF3300"
              title="Cloud Matching"
              desc="The fingerprint hash is sent to our cloud endpoint which queries a database of 50M+ pre-indexed track fingerprints using locality-sensitive hashing for O(log n) lookup speed."
              detail="⟶ Avg response: 0.3s, 99.1% accuracy"
            >
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', position: 'relative', height: 80 }}>
                <FrequencyRing radius={30} color="#FFEA00" duration={1.5} />
                <FrequencyRing radius={50} color="#FF3300" duration={2} />
                <FrequencyRing radius={70} color="#7000FF" duration={2.5} />
                <Cloud size={40} color="#fff" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 2, filter: 'drop-shadow(2px 2px 0 #000)' }} />
              </div>
            </TechCard>

            <TechCard
              step={4} icon={Database} color="#FF3300" accent="#7000FF"
              title="Metadata Enrichment"
              desc="Once matched, we query multiple databases simultaneously to return the richest possible song profile: lyrics, BPM, key, genre, album art, streaming links."
              detail="⟶ Title / Artist / Album / Links"
            />

            <TechCard
              step={5} icon={Waves} color="#7000FF" accent="#FF007F"
              title="Noise Resilience"
              desc="Our algorithm filters ambient noise using spectral subtraction before fingerprinting. Whether you're in a café, car, concert, or recording from IG Reels — we find the signal."
              detail="⟶ SNR threshold: -12dB (concert level)"
            >
              <div style={{ marginTop: 24 }}>
                <WaveSVG color="#7000FF" delay={1} />
              </div>
            </TechCard>

            <TechCard
              step={6} icon={Lock} color="#00E5FF" accent="#FF007F"
              title="Privacy First"
              desc="Your audio is never stored. It's processed in memory, fingerprinted in transit, and the raw audio is discarded immediately. Only the hash travels to our servers."
              detail="⟶ Zero audio storage, TLS encrypted"
            />
          </div>
        </div>
      </section>

      {/* ── WAVE DIVIDER ─────────────────────────────────── */}
      <div style={{ padding: '0 40px', opacity: 0.8, transform: 'scaleX(-1)', position: 'relative', zIndex: 5, marginTop: -20 }}>
        <WaveSVG color="#00E5FF" />
      </div>

      {/* ── STATS PANEL ──────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative', background: '#00E5FF' }}>
        <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#000', textAlign: 'center', marginBottom: 80, textShadow: '4px 4px 0 #fff, 8px 8px 0 #FF007F' }}>
            BY THE NUMBERS
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
            {[
              { target: 50, suffix: 'M+', label: 'Songs in DB', color: '#FF007F', shadow: '#FFEA00', icon: Database },
              { target: 196, suffix: '', label: 'Countries', color: '#FFEA00', shadow: '#FF3300', icon: Globe },
              { target: 99, suffix: '.1%', label: 'Accuracy', color: '#FF3300', shadow: '#7000FF', icon: Zap },
              { target: 300, suffix: 'ms', label: 'Avg. Speed', color: '#7000FF', shadow: '#FF007F', icon: Radio },
            ].map((s, i) => {
              const Icon = s.icon;
              const rotate = [2, -2, 3, -3][i];
              return (
                <div
                  key={i}
                  style={{
                    background: '#111',
                    border: `4px solid ${s.color}`,
                    borderRadius: 0, padding: '40px 24px', textAlign: 'center',
                    boxShadow: `12px 12px 0 ${s.shadow}, 24px 24px 0 #000`,
                    transform: `rotate(${rotate}deg)`,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  <Icon size={48} color={s.color} className="anim-float" style={{ marginBottom: 24, margin: '0 auto', filter: 'drop-shadow(4px 4px 0 #000)' }} />
                  <AnimatedCounter target={s.target} suffix={s.suffix} />
                  <p style={{ color: s.color, fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 16, textShadow: '2px 2px 0 #000', background: '#000', display: 'inline-block', padding: '4px 12px', border: `2px solid ${s.color}` }}>{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TECH STACK BAND ──────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#050505', borderTop: '8px solid #FF007F', borderBottom: '8px solid #00E5FF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 className="font-heading" style={{ fontSize: '2rem', color: '#fff', textAlign: 'center', marginBottom: 48, letterSpacing: '0.2em', textShadow: '2px 2px 0 #FF007F' }}>
            BUILT WITH
          </h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { name: 'Web Audio API', color: '#FF007F' },
              { name: 'Next.js 16', color: '#00E5FF' },
              { name: 'Constellation Map', color: '#FFEA00' },
              { name: 'AudD API', color: '#FF3300' },
              { name: 'FFT / STFT', color: '#7000FF' },
              { name: 'PostgreSQL', color: '#FF007F' },
              { name: 'Three.js Canvas', color: '#00E5FF' },
              { name: 'Spectral Subtraction', color: '#FFEA00' },
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  background: '#000',
                  border: `4px solid ${t.color}`,
                  borderRadius: 0, padding: '16px 32px',
                  color: t.color, fontWeight: 900,
                  fontSize: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  cursor: 'none',
                  boxShadow: `4px 4px 0 ${t.color}`
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = t.color;
                  (e.currentTarget as HTMLElement).style.color = '#000';
                  (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0 #fff`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = '#000';
                  (e.currentTarget as HTMLElement).style.color = t.color;
                  (e.currentTarget as HTMLElement).style.transform = 'translate(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 ${t.color}`;
                }}
              >
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', background: '#7000FF' }}>
        <div className="pattern-bpm" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', marginBottom: 48, color: '#FFEA00', textShadow: '4px 4px 0 #000, 8px 8px 0 #FF007F' }}>
            READY TO FIND YOUR SONG?
          </h2>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/"
              style={{ background: '#FF007F', border: '6px solid #000', borderRadius: 0, padding: '24px 56px', color: 'white', fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', boxShadow: '12px 12px 0 #FFEA00, 24px 24px 0 #00E5FF', transition: 'all 0.2s ease', display: 'inline-block' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-4px, -4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '16px 16px 0 #FFEA00, 32px 32px 0 #00E5FF'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0 #FFEA00, 24px 24px 0 #00E5FF'; }}
            >
              🎵 TRY QUEMELO
            </Link>
            <Link href="/discover"
              style={{ background: '#00E5FF', border: '6px solid #000', borderRadius: 0, padding: '24px 56px', color: '#000', fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.4rem', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', boxShadow: '12px 12px 0 #FF007F, 24px 24px 0 #FFEA00', transition: 'all 0.2s ease', display: 'inline-block' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-4px, -4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '16px 16px 0 #FF007F, 32px 32px 0 #FFEA00'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '12px 12px 0 #FF007F, 24px 24px 0 #FFEA00'; }}
            >
              EXPLORE DISCOVER →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
