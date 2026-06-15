'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Zap, Square, Disc3, Upload, Play, Star, ChevronRight, Activity, Globe, Music, Flame, Search, Monitor, ExternalLink, Headphones, Clock } from 'lucide-react';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';
import EqualizerBars from '@/components/EqualizerBars';

const ACCENTS = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF'];

/* ─── Floating Musical Shapes ─────────────────────────────── */
const SHAPES = ['♩','♪','♫','♬','●','▲','✦','♩','♫','●'];
function FloatingShapes({ count = 8 }: { count?: number }) {
  return (
    <>
      {SHAPES.slice(0, count).map((s, i) => {
        const color = ACCENTS[i % ACCENTS.length];
        const size = [24,48,32,64,40,56,28,72,36,48][i];
        const top = [10,20,60,30,75,15,85,40,55,25][i];
        const left = [5,80,15,65,30,90,50,10,75,45][i];
        return (
          <span
            key={i}
            className="anim-float"
            style={{
              position: 'absolute',
              top: `${top}%`, left: `${left}%`,
              fontSize: size,
              color, opacity: 0.25,
              animationDelay: `${i * 0.5}s`,
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: 1,
            }}
          >
            {s}
          </span>
        );
      })}
    </>
  );
}

/* ─── Sonar Rings ─────────────────────────────────────────── */
function SonarRings({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', animation: 'ring-spin 3s linear infinite', zIndex: 0 }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 250, height: 250, transform: 'translate(-50%, -50%)',
        borderRadius: '50%', border: '8px dashed #FF007F', pointerEvents: 'none',
        animation: 'sonar-ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite'
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 250, height: 250, transform: 'translate(-50%, -50%)',
        borderRadius: '50%', border: '8px dashed #00E5FF', pointerEvents: 'none',
        animation: 'sonar-ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite 0.3s'
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 250, height: 250, transform: 'translate(-50%, -50%)',
        borderRadius: '50%', border: '8px dashed #FFEA00', pointerEvents: 'none',
        animation: 'sonar-ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite 0.6s'
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%', width: 250, height: 250, transform: 'translate(-50%, -50%)',
        borderRadius: '50%', border: '8px dashed #7000FF', pointerEvents: 'none',
        animation: 'sonar-ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite 0.9s'
      }} />
    </div>
  );
}

/* ─── Particle Burst (Canvas) ─────────────────────────────── */
function ParticleBurst({ trigger }: { trigger: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!trigger || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const symbols = ['BANG!','POW!','BAM!','POP!','CRASH!'];

    const particles = Array.from({ length: 40 }).map(() => ({
      x: cx, y: cy,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      life: 1,
      decay: 0.02 + Math.random() * 0.02,
      color: ACCENTS[Math.floor(Math.random() * ACCENTS.length)],
      sym: symbols[Math.floor(Math.random() * symbols.length)],
      size: 20 + Math.random() * 40,
      angle: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.5; // heavy gravity for comic book
        p.life -= p.decay;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.font = `900 ${p.size}px Bangers, cursive`;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillText(p.sym, 0, 0);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, width: '100vw', height: '100vh',
        pointerEvents: 'none', zIndex: 300,
      }}
    />
  );
}

/* ─── Real-time Waveform Canvas ───────────────────────────── */
function WaveformCanvas({ analyser }: { analyser: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 360; canvas.height = 360;
    const ctx = canvas.getContext('2d')!;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const cx = 180, cy = 180, r = 90;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, 360, 360);
      const grad = ctx.createLinearGradient(0,0,360,360);
      grad.addColorStop(0,'#FF007F');
      grad.addColorStop(0.5,'#00E5FF');
      grad.addColorStop(1,'#FFEA00');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2;
        const barH = data[i] * 0.45;
        ctx.moveTo(cx + Math.cos(angle)*r, cy + Math.sin(angle)*r);
        ctx.lineTo(cx + Math.cos(angle)*(r+barH), cy + Math.sin(angle)*(r+barH));
      }
      ctx.stroke();
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        width: 360, height: 360,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

/* ─── Song Card ───────────────────────────────────────────── */
interface SongCardProps {
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  spotifyUrl?: string;
  idx: number;
  slam?: boolean;
  lyrics?: string;
  youtubeUrl?: string;
  genre?: string;
  appleMusicUrl?: string;
  shazamUrl?: string;
}
export function SongCard({
  title,
  artist,
  album,
  cover,
  spotifyUrl,
  idx,
  slam,
  lyrics,
  youtubeUrl,
  genre,
  appleMusicUrl,
  shazamUrl,
}: SongCardProps) {
  const border = ACCENTS[idx % ACCENTS.length];
  const shadow1 = ACCENTS[(idx + 2) % ACCENTS.length];
  const shadow2 = ACCENTS[(idx + 4) % ACCENTS.length];
  const rotate = [2, -2, 4, -4, 1][idx % 5];
  const [showLyrics, setShowLyrics] = useState(false);

  return (
    <div
      className={`song-card ${slam ? 'anim-slam' : ''}`}
      style={{
        background: '#111111',
        border: `4px solid ${border}`,
        borderRadius: 8, // Less rounded for pop art
        boxShadow: `8px 8px 0 ${shadow1}, 16px 16px 0 ${shadow2}`,
        transform: `rotate(${rotate}deg) ${idx % 2 === 0 ? 'translateY(16px)' : 'translateY(0)'}`,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Pattern background */}
      <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 0 }} />

      {/* Mini EQ at top */}
      <div style={{ marginBottom: 12, position: 'relative', zIndex: 1 }}>
        <EqualizerBars barCount={8} maxHeight={24} active={true} variant="mini" />
      </div>

      {/* Album art + Info */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {cover ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cover} alt={title} style={{ width: 80, height: 80, borderRadius: 0, objectFit: 'cover', border: `4px solid ${border}`, filter: 'contrast(1.2)' }} />
        ) : (
          <div className="anim-gradient" style={{
            width: 80, height: 80, borderRadius: 0,
            background: `linear-gradient(135deg, ${ACCENTS[idx%5]}, ${ACCENTS[(idx+2)%5]})`,
            border: `4px solid ${border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Music size={32} color="white" />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p className="font-heading text-shadow-card" style={{ fontSize: '1.2rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title.toUpperCase()}</p>
          <p style={{ color: '#00E5FF', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>{artist}</p>
          {album && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>{album}</p>}
          {genre && (
            <div style={{ display: 'flex' }}>
              <span style={{ background: '#FFEA00', color: '#000', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', padding: '2px 8px', border: '2px solid #000', marginTop: 4 }}>
                {genre}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 20, position: 'relative', zIndex: 1 }}>
        {(() => {
          const encodedSearch = encodeURIComponent(`${title} ${artist}`.trim());
          const finalSpotifyUrl = spotifyUrl || `https://open.spotify.com/search/${encodedSearch}`;
          const finalAppleUrl = appleMusicUrl || `https://music.apple.com/us/search?term=${encodedSearch}`;
          const finalYoutubeUrl = youtubeUrl || `https://www.youtube.com/results?search_query=${encodedSearch}`;
          const finalShazamUrl = shazamUrl || `https://www.google.com/search?q=${encodedSearch}+shazam`;

          const ActionBtn = ({ label, url, color, bg, isFallback }: { label: string, url: string, color: string, bg: string, isFallback: boolean }) => {
            return (
              <a href={url} target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  padding: '8px 4px', background: bg, border: '3px solid #000',
                  color: color, textDecoration: 'none',
                  fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'all 0.2s ease', boxShadow: '3px 3px 0 #000',
                  opacity: isFallback ? 0.8 : 1,
                  filter: isFallback ? 'saturate(0.5)' : 'none'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-1px, -1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #000'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)'; (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #000'; }}
                title={isFallback ? `Search for ${label}` : `Open on ${label}`}
              >
                {isFallback ? `Search ${label}` : label} <ExternalLink size={12} />
              </a>
            );
          };

          return (
            <>
              <ActionBtn label="Spotify" url={finalSpotifyUrl} bg="#1DB954" color="#000" isFallback={!spotifyUrl} />
              <ActionBtn label="Apple" url={finalAppleUrl} bg="#FC3C44" color="#fff" isFallback={!appleMusicUrl} />
              <ActionBtn label="Video" url={finalYoutubeUrl} bg="#FF0000" color="#fff" isFallback={!youtubeUrl} />
              <ActionBtn label="Shazam" url={finalShazamUrl} bg="#0088FF" color="#fff" isFallback={!shazamUrl} />
            </>
          );
        })()}
      </div>

      {/* Expandable Lyrics / Fallback Search */}
      <div style={{ marginTop: 16, position: 'relative', zIndex: 1 }}>
        {lyrics ? (
          <>
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              style={{
                width: '100%',
                background: showLyrics ? '#FF3300' : '#7000FF',
                color: '#fff',
                border: '3px solid #000',
                padding: '8px 0',
                fontWeight: 900,
                textTransform: 'uppercase',
                boxShadow: '3px 3px 0 #000',
                cursor: 'none',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'transform 0.1s ease',
              }}
              onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)'; }}
              onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              {showLyrics ? 'Hide Lyrics ✕' : 'Show Lyrics 🎤'}
            </button>
            {showLyrics && (
              <div style={{
                marginTop: 12,
                maxHeight: 180,
                overflowY: 'auto',
                background: '#000',
                border: '3px solid #000',
                padding: 12,
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                textAlign: 'left'
              }}>
                {lyrics}
              </div>
            )}
          </>
        ) : (
          <a
            href={`https://genius.com/search?q=${encodeURIComponent(`${title} ${artist}`.trim())}`}
            target="_blank" rel="noreferrer"
            style={{
              width: '100%',
              background: '#222',
              color: '#fff',
              border: '3px solid #000',
              padding: '8px 0',
              fontWeight: 900,
              textTransform: 'uppercase',
              boxShadow: '3px 3px 0 #000',
              cursor: 'none',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              textDecoration: 'none',
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-1px, -1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)'; }}
            title="Search Lyrics on Genius"
          >
            Search Lyrics <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Stat Card ───────────────────────────────────────────── */
function StatCard({ number, label, icon: Icon, idx }: { number: string; label: string; icon: React.ElementType; idx: number }) {
  const border = ACCENTS[idx % ACCENTS.length];
  const shadow = ACCENTS[(idx+2) % ACCENTS.length];
  const offset = idx % 2 === 0 ? 16 : 0;
  return (
    <div
      className="song-card"
      style={{
        background: '#181818',
        border: `4px solid ${border}`,
        borderRadius: 8,
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: `8px 8px 0 ${shadow}`,
        transform: `translateY(${offset}px)`,
        position: 'relative',
      }}
    >
      <Icon size={36} className="anim-float-lg" style={{ color: border, marginBottom: 16, margin: '0 auto' }} />
      <div
        className="text-gradient font-heading"
        style={{ fontSize: '4rem', margin: 0, lineHeight: 1, textShadow: '4px 4px 0 #000' }}
      >
        {number}
      </div>
      <p style={{ color: border, fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 12, textShadow: '2px 2px 0 #000' }}>
        {label}
      </p>
    </div>
  );
}

/* ─── LIVE FEED MARQUEE ───────────────────────────────────── */
const LIVE_SONGS = [
  { t: 'Blinding Lights', a: 'The Weeknd' },
  { t: 'Midnight City', a: 'M83' },
  { t: 'Nightcall', a: 'Kavinsky' },
  { t: 'Resonance', a: 'HOME' },
  { t: 'Space Song', a: 'Beach House' },
  { t: 'After Dark', a: 'Mr.Kitty' },
  { t: 'New Flesh', a: 'Current Value' },
  { t: 'Numb', a: 'Linkin Park' },
  { t: 'Levitating', a: 'Dua Lipa' },
  { t: 'Starboy', a: 'The Weeknd' },
  { t: 'Cruel Summer', a: 'Taylor Swift' },
  { t: 'As It Was', a: 'Harry Styles' },
  { t: 'Bad Guy', a: 'Billie Eilish' },
  { t: 'Shape of You', a: 'Ed Sheeran' },
  { t: 'Dance Monkey', a: 'Tones and I' },
  { t: 'Watermelon Sugar', a: 'Harry Styles' },
  { t: 'Stay', a: 'The Kid LAROI' },
  { t: 'Peaches', a: 'Justin Bieber' },
  { t: 'Montero', a: 'Lil Nas X' },
  { t: 'Industry Baby', a: 'Lil Nas X' },
  { t: 'Save Your Tears', a: 'The Weeknd' },
  { t: 'Good 4 U', a: 'Olivia Rodrigo' },
  { t: 'Drivers License', a: 'Olivia Rodrigo' },
  { t: 'Heat Waves', a: 'Glass Animals' },
  { t: 'Telepatía', a: 'Kali Uchis' },
  { t: 'Kiss Me More', a: 'Doja Cat' },
  { t: 'Need To Know', a: 'Doja Cat' },
  { t: 'Mood', a: '24kGoldn' },
  { t: 'Sunflower', a: 'Post Malone' },
  { t: 'Lucid Dreams', a: 'Juice WRLD' },
  { t: 'Dreams', a: 'Fleetwood Mac' },
  { t: 'Somebody That I Used To Know', a: 'Gotye' },
  { t: 'Rolling in the Deep', a: 'Adele' },
  { t: 'Uptown Funk', a: 'Mark Ronson' },
  { t: 'Take Me To Church', a: 'Hozier' },
  { t: 'Thinking Out Loud', a: 'Ed Sheeran' },
  { t: 'Radioactive', a: 'Imagine Dragons' },
  { t: 'Royals', a: 'Lorde' },
  { t: 'Counting Stars', a: 'OneRepublic' },
  { t: 'Chandelier', a: 'Sia' },
  { t: 'Wake Me Up', a: 'Avicii' },
  { t: 'Lean On', a: 'Major Lazer' },
  { t: 'Stressed Out', a: 'Twenty One Pilots' },
  { t: 'Let Her Go', a: 'Passenger' },
  { t: 'Demons', a: 'Imagine Dragons' },
  { t: 'Pompeii', a: 'Bastille' },
  { t: 'Havana', a: 'Camila Cabello' },
  { t: 'Señorita', a: 'Shawn Mendes' },
  { t: 'Believer', a: 'Imagine Dragons' },
  { t: 'Thunder', a: 'Imagine Dragons' },
  { t: 'Closer', a: 'The Chainsmokers' },
  { t: 'Perfect', a: 'Ed Sheeran' },
  { t: 'Shallow', a: 'Lady Gaga' },
  { t: 'Rockstar', a: 'Post Malone' },
  { t: 'God\'s Plan', a: 'Drake' },
  { t: 'One Dance', a: 'Drake' },
  { t: 'Despacito', a: 'Luis Fonsi' },
  { t: 'Someone You Loved', a: 'Lewis Capaldi' },
  { t: 'Bad Habits', a: 'Ed Sheeran' },
  { t: 'Easy On Me', a: 'Adele' },
  { t: 'Anti-Hero', a: 'Taylor Swift' },
  { t: 'Flowers', a: 'Miley Cyrus' },
  { t: 'Kill Bill', a: 'SZA' },
  { t: 'Creepin\'', a: 'Metro Boomin' },
  { t: 'Calm Down', a: 'Rema' },
  { t: 'Boy\'s a liar Pt. 2', a: 'PinkPantheress' },
  { t: 'Die For You', a: 'The Weeknd' }
];

function InfiniteCardCarousel() {
  const [shuffled, setShuffled] = useState<{t: string, a: string, cover?: string, apple?: string}[]>([]);
  const [term, setTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    fetch('/api/random-songs')
      .then(res => res.json())
      .then(data => {
        if (data.songs && data.songs.length > 0) {
          setShuffled(data.songs);
          setTerm(data.term || 'RANDOM');
        } else {
          const fallback = [...LIVE_SONGS].sort(() => 0.5 - Math.random()).slice(0, 10);
          setShuffled(fallback);
          setTerm('TRENDING');
        }
        setMounted(true);
      })
      .catch(() => {
        const fallback = [...LIVE_SONGS].sort(() => 0.5 - Math.random()).slice(0, 10);
        setShuffled(fallback);
        setTerm('TRENDING');
        setMounted(true);
      });
  }, []);

  const items = [...shuffled, ...shuffled, ...shuffled, ...shuffled];

  useEffect(() => {
    if (!mounted) return;
    let raf: number;
    const loop = () => {
      if (scrollRef.current && !isDown.current && !scrollRef.current.matches(':hover')) {
        scrollRef.current.scrollLeft += 1;
        // 340px width + 40px gap = 380px per item. 10 items = 3800px.
        if (scrollRef.current.scrollLeft >= 3800 * 2) {
          scrollRef.current.scrollLeft -= 3800;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  if (!mounted) {
    return <div style={{ height: 420, marginTop: 64, width: '100%' }} />;
  }

  return (
    <>
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', color: '#000', margin: 0, textShadow: '4px 4px 0 #fff' }}>
            SONGS BEING FOUND RIGHT NOW
          </h2>
          <div className="anim-pulse" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FF3300', border: '4px solid #000', padding: '8px 16px', boxShadow: '4px 4px 0 #000' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fff' }} />
            <span className="font-heading" style={{ color: '#fff', fontSize: '1rem', letterSpacing: '0.1em' }}>LIVE</span>
          </div>
        </div>
        <p style={{ color: '#000', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 60, background: '#FFEA00', display: 'inline-block', padding: '8px 16px', border: '3px solid #000' }}>
          SEED KEYWORD: {term.toUpperCase()}
        </p>
      </div>

      <div style={{ marginBottom: 40 }}>
        <LiveMarquee />
      </div>

      <div style={{
        width: '100%',
        position: 'relative',
        mask: 'linear-gradient(90deg, transparent, black 2%, black 98%, transparent)',
        WebkitMask: 'linear-gradient(90deg, transparent, black 2%, black 98%, transparent)'
      }}>
        <style>{`
          .carousel-track::-webkit-scrollbar { display: none; }
          .carousel-track { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div
          ref={scrollRef}
          className="carousel-track"
          style={{
            display: 'flex',
            gap: 40,
            overflowX: 'auto',
            cursor: 'grab',
            padding: '60px 40px', // Extra vertical padding to prevent vertical clipping of rotated cards!
          }}
          onMouseDown={(e) => {
          isDown.current = true;
          if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grabbing';
            startX.current = e.pageX - scrollRef.current.offsetLeft;
            scrollLeft.current = scrollRef.current.scrollLeft;
          }
        }}
        onMouseLeave={() => {
          isDown.current = false;
          if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
        }}
        onMouseUp={() => {
          isDown.current = false;
          if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (!isDown.current || !scrollRef.current) return;
          e.preventDefault();
          const x = e.pageX - scrollRef.current.offsetLeft;
          const walk = (x - startX.current) * 2;
          scrollRef.current.scrollLeft = scrollLeft.current - walk;
        }}
      >
        {items.map((s, i) => (
          <div key={i} style={{ width: 340, flexShrink: 0 }} onDragStart={e => e.preventDefault()}>
            <SongCard 
              title={s.t} 
              artist={s.a} 
              idx={i} 
              cover={s.cover || `https://picsum.photos/seed/${encodeURIComponent(s.t + s.a)}/400/400`}
              appleMusicUrl={s.apple}
            />
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

function LiveMarquee() {
  const doubled = [...LIVE_SONGS, ...LIVE_SONGS];
  return (
    <div style={{ overflow: 'hidden', mask: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)', WebkitMask: 'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)' }}>
      <div className="marquee-track anim-marquee" style={{ gap: 24 }}>
        {doubled.map((s, i) => {
          const color = ACCENTS[i % ACCENTS.length];
          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#111',
                border: `4px solid ${color}`,
                borderRadius: 8, padding: '10px 20px',
                whiteSpace: 'nowrap',
                boxShadow: '4px 4px 0 #000'
              }}
            >
              <Disc3 size={20} className="anim-spin-slow" style={{ color }} />
              <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{s.t}</span>
              <span style={{ color: color, fontSize: '0.9rem', fontWeight: 700 }}>— {s.a}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ───────────────────────────────────────────── */
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState<'idle'|'recording'|'processing'|'success'|'error'>('idle');
  const [result, setResult] = useState<{
    title: string;
    artist: string;
    album?: string;
    cover_art?: string | null;
    spotify_url?: string | null;
    lyrics?: string | null;
    youtube_url?: string | null;
    genre?: string | null;
    apple_music_url?: string | null;
    shazam_url?: string | null;
  } | null>(null);
  const [burst, setBurst] = useState(false);
  const [vignetteFlash, setVignetteFlash] = useState(false);
  const [activeAnalyser, setActiveAnalyser] = useState<AnalyserNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout|null>(null);
  const analyserRef = useRef<AnalyserNode|null>(null);
  const audioCtxRef = useRef<AudioContext|null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  }, [isRecording]);

  /* Auto-stop at 8s */
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(p => {
          if (p >= 8) { stopRecording(); return 8; }
          return p + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording, stopRecording]);

  const startRecording = async (mode: 'mic' | 'system' = 'mic') => {
    try {
      setStatus('recording'); setResult(null);
      setVignetteFlash(true);
      setTimeout(() => setVignetteFlash(false), 400);

      let stream: MediaStream;
      let originalDisplayStream: MediaStream | null = null;
      
      if (mode === 'system') {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
        const audioTracks = displayStream.getAudioTracks();
        if (audioTracks.length === 0) {
          displayStream.getTracks().forEach(t => t.stop());
          alert("Please make sure to check 'Also share tab audio' or 'Share system audio' in the browser prompt!");
          setStatus('idle');
          return;
        }
        stream = new MediaStream([audioTracks[0]]);
        originalDisplayStream = displayStream;
      } else {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: false, echoCancellation: false } });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      audioCtxRef.current.createMediaStreamSource(stream).connect(analyserRef.current);
      setActiveAnalyser(analyserRef.current);

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        processAudio(new Blob(audioChunksRef.current, { type: 'audio/webm' }));
        stream.getTracks().forEach(t => t.stop());
        if (originalDisplayStream) originalDisplayStream.getTracks().forEach(t => t.stop());
        analyserRef.current = null;
        setActiveAnalyser(null);
      };
      mr.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch { setStatus('error'); }
  };

  const processAudio = async (blob: Blob) => {
    setStatus('processing');
    try {
      const fd = new FormData();
      fd.append('file', blob, 'recording.webm');
      const res = await fetch('/api/recognize', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setStatus('success');
      setBurst(true);
      setTimeout(() => setBurst(false), 1500);
    } catch { setStatus('error'); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File exceeds 10MB'); return; }
    setResult(null);
    processAudio(file);
  };

  /* Easter egg — hold anywhere in hero for 1.5s */
  const holdTimer = useRef<NodeJS.Timeout|null>(null);
  const onHeroMouseDown = () => {
    if (isRecording || status === 'processing') return;
    holdTimer.current = setTimeout(() => {
      setStatus('success');
      setResult({
        title: 'YOUR HEARTBEAT', artist: 'You',
        album: '72 BPM — Genre: Human',
        cover_art: null, spotify_url: null,
      });
      setBurst(true);
      setTimeout(() => setBurst(false), 1500);
    }, 1500);
  };
  const onHeroMouseUp = () => { if (holdTimer.current) clearTimeout(holdTimer.current); };

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      {vignetteFlash && <div className="vignette-flash" />}
      <ParticleBurst trigger={burst} />

      {/* ──────── SECTION 1 — HERO ──────── */}
      <section
        id="hero"
        onMouseDown={onHeroMouseDown}
        onMouseUp={onHeroMouseUp}
        onMouseLeave={onHeroMouseUp}
        style={{
          minHeight: '100vh', position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '80px 24px',
          overflow: 'hidden',
          background: '#050505',
        }}
      >
        {/* Layered background patterns */}
        <div className="pattern-dots-cyan" style={{ position: 'absolute', inset: 0, opacity: 0.15, zIndex: 0 }} />
        <div className="pattern-sonic-mesh" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

        {/* Giant watermark */}
        <div className="bg-watermark font-heading" style={{ fontSize: '20rem', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#000' }}>
          QUEMELO
        </div>

        {/* Floating shapes */}
        <FloatingShapes count={10} />

        {/* Vinyl record decoration */}
        <div className="anim-spin-slow" style={{ position: 'absolute', bottom: -100, right: -100, opacity: 0.2, zIndex: 1 }}>
          <Disc3 size={380} color="#FF007F" strokeWidth={1} />
        </div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 800, gap: 24 }}>

          {/* Label */}
          <div className="anim-wiggle" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFEA00', padding: '8px 16px', borderRadius: 0, border: '4px solid #000', boxShadow: '4px 4px 0 #FF007F' }}>
            <Zap size={16} color="#000" />
            <span style={{ color: '#000', fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              MUSIC RECOGNITION EVOLVED
            </span>
          </div>

          {/* Hero headline */}
          <h1 className="font-heading" style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', margin: 0, lineHeight: 0.9 }}>
            <span className="text-gradient" style={{ display: 'block', transform: 'rotate(-2deg)' }}>THAT SONG.</span>
            <span style={{ display: 'block', color: '#FF007F', textShadow: '6px 6px 0 #000, 12px 12px 0 #00E5FF, 18px 18px 0 #FFEA00', transform: 'rotate(2deg)' }}>
              RIGHT NOW.
            </span>
          </h1>

          <p style={{ color: '#00E5FF', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 900, textTransform: 'uppercase', textShadow: '2px 2px 0 #000', margin: '20px 0 0' }}>
            &quot;Damn, I&apos;ve heard this somewhere…&quot;
          </p>
          <p style={{ color: 'white', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 700, margin: 0, maxWidth: 500 }}>
            Quemelo catches the song in your head before it escapes.
          </p>

          {/* ─── THE LISTEN BUTTONS ─── */}
          {status !== 'success' && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 32, marginBottom: 8, height: 240 }}>
              {/* Sonar rings */}
              <SonarRings active={isRecording || status === 'processing'} />

              {/* Waveform canvas (when recording) */}
              {isRecording && activeAnalyser && <WaveformCanvas analyser={activeAnalyser} />}

              {!isRecording && status !== 'processing' && (
                <>
                  <button
                    onClick={() => startRecording('mic')}
                    title="Record Microphone"
                    style={{
                      width: 140, height: 140,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FF007F, #7000FF)',
                      border: '6px solid #000',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                      cursor: 'none',
                      position: 'relative', zIndex: 10,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      boxShadow: '10px 10px 0 #00E5FF, 20px 20px 0 #FF007F',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.9)'; e.stopPropagation(); }}
                    onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                  >
                    <Mic size={48} color="#000" />
                    <span className="font-heading" style={{ fontSize: '1.1rem', letterSpacing: '0.1em', color: '#000' }}>MIC</span>
                  </button>

                  <button
                    onClick={() => startRecording('system')}
                    title="Record System Audio"
                    style={{
                      width: 140, height: 140,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00E5FF, #FFEA00)',
                      border: '6px solid #000',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                      cursor: 'none',
                      position: 'relative', zIndex: 10,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      boxShadow: '10px 10px 0 #FF007F, 20px 20px 0 #FFEA00',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                    onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.9)'; e.stopPropagation(); }}
                    onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                  >
                    <Monitor size={48} color="#000" />
                    <span className="font-heading" style={{ fontSize: '1.1rem', letterSpacing: '0.1em', color: '#000' }}>SYSTEM</span>
                  </button>
                </>
              )}

              {(isRecording || status === 'processing') && (
                <button
                  onClick={stopRecording}
                  disabled={status === 'processing'}
                  style={{
                    width: 200, height: 200,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF3300, #FFEA00)',
                    border: '8px solid #000',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                    cursor: status === 'processing' ? 'not-allowed' : 'none',
                    position: 'relative', zIndex: 10,
                    animation: isRecording ? 'recording-glow-intense 0.8s infinite alternate' : 'none',
                  }}
                  onMouseEnter={e => { if (isRecording) (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                  onMouseLeave={e => { if (isRecording) (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                  onMouseDown={e => { if (isRecording) (e.currentTarget as HTMLElement).style.transform = 'scale(0.9)'; e.stopPropagation(); }}
                  onMouseUp={e => { if (isRecording) (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
                >
                  {isRecording
                    ? <Square fill="#000" size={64} color="#000" />
                    : <Disc3 size={64} color="#000" className="anim-spin-fast" />
                  }
                  <span className="font-heading" style={{ fontSize: '1.5rem', letterSpacing: '0.2em', color: '#000', marginTop: 8 }}>
                    {isRecording ? `${8 - recordingTime}s` : '...'}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Status messages */}
          {status === 'recording' && (
            <p className="anim-blink" style={{ color: '#FF007F', fontWeight: 900, fontSize: '1.4rem', textShadow: '2px 2px 0 #000' }}>
              CATCHING THE WAVE… {8 - recordingTime}S LEFT
            </p>
          )}
          {status === 'processing' && (
            <p className="anim-blink" style={{ color: '#00E5FF', fontWeight: 900, fontSize: '1.4rem', textShadow: '2px 2px 0 #000' }}>
              SYNTHESIZING FREQUENCIES…
            </p>
          )}
          {status === 'error' && (
            <p style={{ color: '#FF3300', fontWeight: 900, fontSize: '1.4rem', textShadow: '2px 2px 0 #000' }}>
              SIGNAL LOST. HIT LISTEN AGAIN.
            </p>
          )}

          {/* Result card */}
          {status === 'success' && result && (
            <div style={{ width: '100%', maxWidth: 480, marginTop: 24 }}>
              <SongCard
                title={result.title}
                artist={result.artist}
                album={result.album}
                cover={result.cover_art}
                spotifyUrl={result.spotify_url || undefined}
                lyrics={result.lyrics || undefined}
                youtubeUrl={result.youtube_url || undefined}
                genre={result.genre || undefined}
                appleMusicUrl={result.apple_music_url || undefined}
                shazamUrl={result.shazam_url || undefined}
                idx={0}
                slam
              />
              <button
                onClick={() => setStatus('idle')}
                style={{ marginTop: 24, background: '#FF007F', border: '4px solid #000', color: '#fff', cursor: 'none', fontFamily: 'inherit', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', padding: '12px 24px', boxShadow: '4px 4px 0 #00E5FF' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #00E5FF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #00E5FF'; }}
              >
                IDENTIFY ANOTHER
              </button>
            </div>
          )}

          {/* File upload */}
          {status !== 'recording' && status !== 'processing' && status !== 'success' && (
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: '4px solid #00E5FF', background: '#000',
              padding: '16px 32px', cursor: 'none',
              color: '#00E5FF', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em',
              transition: 'all 0.2s ease',
              marginTop: 16,
              boxShadow: '4px 4px 0 #FF007F'
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#00E5FF'; (e.currentTarget as HTMLElement).style.color = '#000'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#000'; (e.currentTarget as HTMLElement).style.color = '#00E5FF'; }}
            >
              <Upload size={20} strokeWidth={3} />
              DROP A FILE
              <input type="file" accept="audio/mp3,audio/wav" style={{ display: 'none' }} onChange={handleFile} />
            </label>
          )}

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 700, marginTop: 8 }}>
            (MP3/WAV, MAX 10MB)
          </p>
        </div>

        {/* Bottom EQ bars */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <EqualizerBars barCount={48} maxHeight={60} active={isRecording} />
        </div>
      </section>

      {/* ──────── SECTION 2 — HOW IT WORKS ──────── */}
      <section style={{ padding: '100px 24px', position: 'relative', background: '#FFEA00', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />

        <div className="bg-watermark font-heading" style={{ fontSize: '14rem', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#000', opacity: 0.1 }}>
          FOUND
        </div>
        <FloatingShapes count={6} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', textAlign: 'center', color: '#000', marginBottom: 80, textShadow: '4px 4px 0 #FF007F, 8px 8px 0 #00E5FF' }}>
            THE MOMENT OF RECOGNITION
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48 }}>
            {[
              {
                icon: Headphones, color: '#FF007F', bg: '#000', border: '#000',
                title: '"You know you know it…"',
                desc: 'That feeling hits. You\'ve heard this before. It\'s RIGHT THERE. Your body knows the song even when your brain doesn\'t.',
                detail: '↓ SLOW PULSE, UNCERTAIN…',
              },
              {
                icon: Mic, color: '#000', bg: '#00E5FF', border: '#000',
                title: '"Hit Quemelo."',
                desc: 'Open the app. Hit LISTEN. Let Quemelo catch the frequency. 8 seconds is all it needs.',
                detail: '→ EQUALIZER GOES WILD ⚡',
              },
              {
                icon: Zap, color: '#000', bg: '#FF3300', border: '#000',
                title: '"THERE IT IS."',
                desc: 'Song name. Artist. Album. Links. Everything — in 0.3 seconds flat. Your brain finally rests.',
                detail: '💥 SLAM. IT\'S YOURS NOW.',
              },
            ].map((step, i) => {
              const Icon = step.icon;
              const shadow = ACCENTS[(i + 2) % 5];
              return (
                <div
                  key={i}
                  className="song-card"
                  style={{
                    background: step.bg,
                    border: `4px solid ${step.border}`,
                    borderRadius: 0,
                    padding: 36,
                    boxShadow: `12px 12px 0 ${shadow}, 24px 24px 0 #000`,
                    transform: i % 2 === 0 ? 'rotate(2deg)' : 'rotate(-2deg)',
                    textAlign: 'center',
                  }}
                >
                  <div className="anim-wiggle" style={{ padding: 24, borderRadius: '50%', background: '#fff', border: '4px solid #000', display: 'inline-flex', marginBottom: 24, boxShadow: `6px 6px 0 ${step.color}` }}>
                    <Icon size={48} style={{ color: step.color }} />
                  </div>
                  <h3 className="font-heading" style={{ fontSize: '1.8rem', color: step.bg === '#000' ? '#fff' : '#000', marginBottom: 12, textShadow: step.bg === '#000' ? `2px 2px 0 ${step.color}` : 'none' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: step.bg === '#000' ? 'rgba(255,255,255,0.8)' : '#000', fontWeight: 700, lineHeight: 1.5, fontSize: '1.1rem', marginBottom: 20 }}>
                    {step.desc}
                  </p>
                  <p style={{ color: step.bg === '#000' ? step.color : '#000', fontSize: '1rem', fontWeight: 900, background: step.bg === '#000' ? 'transparent' : '#fff', padding: '4px 8px', display: 'inline-block', border: step.bg === '#000' ? 'none' : '2px solid #000' }}>
                    {step.detail}
                  </p>
                  {i === 1 && <div style={{ marginTop: 24 }}><EqualizerBars barCount={8} maxHeight={32} active={true} variant="mini" /></div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────── SECTION 3 — LIVE FEED ──────── */}
      <section style={{ padding: '100px 0', background: '#00E5FF', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div className="bg-watermark font-heading" style={{ fontSize: '16rem', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#000', opacity: 0.1 }}>
          LISTEN
        </div>

        {/* Infinite Song Cards Carousel */}
        <div style={{ maxWidth: '100vw', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <InfiniteCardCarousel />
        </div>
      </section>

      {/* ──────── SECTION 4 — STATS ──────── */}
      <section style={{ padding: '120px 24px', background: '#050505', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-stripes" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
          <h2 className="font-heading text-gradient" style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', textAlign: 'center', marginBottom: 80 }}>
            THE NUMBERS DON&apos;T LIE
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
            <StatCard number="50M+" label="Songs Identified" icon={Music} idx={0} />
            <StatCard number="196" label="Countries Active" icon={Globe} idx={1} />
            <StatCard number="0.3s" label="Avg Identify Time" icon={Clock} idx={2} />
            <StatCard number="99.1%" label="Accuracy Rate" icon={Star} idx={3} />
          </div>
        </div>
      </section>

      {/* ──────── SECTION 5 — FEATURES ──────── */}
      <section style={{ padding: '120px 24px', background: '#FF007F', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-dots-cyan" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        <div className="bg-watermark font-heading" style={{ fontSize: '18rem', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#000', opacity: 0.1 }}>
          YOURS
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#000', textAlign: 'center', marginBottom: 80, textShadow: '4px 4px 0 #00E5FF, 8px 8px 0 #FFEA00' }}>
            EVERYTHING YOU NEED TO KNOW THE SONG
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 40 }}>
            {[
              { emoji: '🎤', label: 'Mic Recognition', desc: 'Instant audio capture in any environment' },
              { emoji: '🎵', label: 'Lyrics Sync', desc: 'Word by word, real-time playback' },
              { emoji: '🧬', label: 'Genre DNA', desc: 'Visual genre fingerprint' },
              { emoji: '🥁', label: 'BPM Detector', desc: 'Auto-detect tempo & rhythm' },
              { emoji: '🎸', label: 'Chord Finder', desc: 'Guitar & piano chord overlay' },
              { emoji: '📜', label: 'History Timeline', desc: 'Every song you\'ve ever found' },
              { emoji: '📤', label: 'Playlist Export', desc: 'Spotify / Apple Music / YouTube' },
              { emoji: '📡', label: 'Offline Mode', desc: 'Works without internet' },
            ].map((f, i) => {
              const border = ACCENTS[(i+1) % ACCENTS.length];
              const rotate = [2, -2, 4, -4, 1, -1, 3, -3][i];
              return (
                <div
                  key={i}
                  className="song-card"
                  style={{
                    background: '#000',
                    border: `4px solid ${border}`,
                    borderRadius: 0,
                    padding: 32,
                    boxShadow: `8px 8px 0 ${border}, 16px 16px 0 #fff`,
                    transform: `rotate(${rotate}deg) translateY(${i%2===0?24:0}px)`,
                  }}
                >
                  <div className="anim-wiggle" style={{ fontSize: '3rem', marginBottom: 16 }}>{f.emoji}</div>
                  <h3 className="font-heading" style={{ fontSize: '1.4rem', color: border, margin: '12px 0 8px', letterSpacing: '0.05em' }}>
                    {f.label.toUpperCase()}
                  </h3>
                  <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, lineHeight: 1.4, margin: 0 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────── SECTION 6 — TESTIMONIALS ──────── */}
      <section style={{ padding: '120px 24px', background: '#7000FF', position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bpm" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
        <FloatingShapes count={6} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#FFEA00', textAlign: 'center', marginBottom: 80, textShadow: '4px 4px 0 #000, 8px 8px 0 #FF007F' }}>
            THEY FOUND THEIR SONG
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 48 }}>
            {[
              { q: 'I\'ve been chasing this song for 3 years. Quemelo found it in 2 seconds at a festival.', name: 'Arjun K.', stars: 5, idx: 0 },
              { q: 'Playing from my car speakers, windows down. It still identified it. That\'s insane.', name: 'Sofia M.', stars: 5, idx: 1 },
              { q: 'It found a song from an old TV ad from the 90s. I\'m still crying.', name: 'Renzo P.', stars: 5, idx: 2 },
              { q: 'I hummed 8 seconds of a tune I heard in a café and it got it right. Witchcraft.', name: 'Priya D.', stars: 5, idx: 3 },
            ].map((t) => {
              const border = ACCENTS[t.idx % ACCENTS.length];
              return (
                <div
                  key={t.idx}
                  className="song-card"
                  style={{
                    background: '#fff',
                    border: `4px solid #000`,
                    borderRadius: 0,
                    padding: 40,
                    boxShadow: `12px 12px 0 #000, 24px 24px 0 ${border}`,
                    transform: `rotate(${t.idx%2===0?2:-2}deg)`,
                    position: 'relative',
                  }}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    {Array(t.stars).fill(0).map((_, s) => (
                      <Star key={s} size={24} fill="#FFEA00" strokeWidth={2} color="#000" />
                    ))}
                  </div>
                  <p style={{ color: '#000', fontSize: '1.2rem', fontWeight: 900, lineHeight: 1.5, marginBottom: 24, textTransform: 'uppercase' }}>&quot;{t.q}&quot;</p>
                  <p style={{ color: '#000', fontWeight: 900, fontSize: '1rem', background: border, display: 'inline-block', padding: '4px 12px', border: '2px solid #000' }}>{t.name}</p>

                  {/* Bg vinyl */}
                  <Disc3 size={160} className="anim-spin-slow" style={{ position: 'absolute', bottom: -30, right: -30, opacity: 0.1 }} color="#000" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────── SECTION 7 — CTA ──────── */}
      <section style={{ minHeight: '100vh', padding: '120px 24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#050505' }}>
        <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div className="pattern-sonic-mesh" style={{ position: 'absolute', inset: 0 }} />
        <div className="pattern-stripes" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        <FloatingShapes count={8} />

        <div className="bg-watermark font-heading" style={{ fontSize: '24rem', color: '#000', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.3 }}>
          FIND IT
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 800 }}>
          <h2 className="font-heading" style={{ fontSize: 'clamp(4rem,9vw,8rem)', marginBottom: 24, color: '#FFEA00', textShadow: '6px 6px 0 #FF007F, 12px 12px 0 #00E5FF, 18px 18px 0 #000' }}>
            FIND EVERY SONG THAT EVER GOT YOU.
          </h2>
          <p style={{ color: '#00E5FF', fontSize: '1.5rem', fontWeight: 900, marginBottom: 64, textTransform: 'uppercase', background: '#000', padding: '12px 24px', display: 'inline-block', border: '4px solid #00E5FF' }}>
            50 million songs identified. Yours is next.
          </p>

          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              style={{
                display: 'inline-block',
                background: '#FF007F',
                border: '6px solid #000',
                borderRadius: 0,
                padding: '24px 56px',
                color: '#fff',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: '1.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                boxShadow: '12px 12px 0 #FFEA00, 24px 24px 0 #00E5FF',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translate(-4px, -4px)';
                el.style.boxShadow = '16px 16px 0 #FFEA00, 32px 32px 0 #00E5FF';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translate(0, 0)';
                el.style.boxShadow = '12px 12px 0 #FFEA00, 24px 24px 0 #00E5FF';
              }}
            >
              🎵 START FREE
            </Link>
            <button
              onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-block',
                background: '#00E5FF',
                border: '6px solid #000',
                borderRadius: 0,
                padding: '24px 56px',
                color: '#000',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: '1.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: '12px 12px 0 #FF007F, 24px 24px 0 #FFEA00',
                transition: 'all 0.2s ease',
                cursor: 'none',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translate(-4px, -4px)';
                el.style.boxShadow = '16px 16px 0 #FF007F, 32px 32px 0 #FFEA00';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translate(0, 0)';
                el.style.boxShadow = '12px 12px 0 #FF007F, 24px 24px 0 #FFEA00';
              }}
            >
              TRY THE MIC →
            </button>
          </div>

          <div style={{ marginTop: 80 }}>
            <EqualizerBars barCount={48} maxHeight={80} active={true} />
          </div>
        </div>
      </section>

      {/* ──────── FOOTER ──────── */}
      <footer style={{
        padding: '64px 40px',
        background: '#111',
        borderTop: '8px solid #FF007F',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 32,
        position: 'relative',
      }}>
        <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
        <span className="font-heading text-gradient anim-pulse" style={{ fontSize: '3rem', position: 'relative', textShadow: '4px 4px 0 #000' }}>QUEMELO</span>
        <p style={{ color: '#00E5FF', fontSize: '1.1rem', fontWeight: 900, position: 'relative', textAlign: 'center', textTransform: 'uppercase', background: '#000', padding: '8px 16px', border: '2px solid #00E5FF' }}>
          Every song has a name. Find yours.
        </p>
        <div style={{ display: 'flex', gap: 32, position: 'relative' }}>
          <Link href="/discover" style={{ color: '#FFEA00', textDecoration: 'none', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.target as HTMLElement).style.transform='translateY(-4px)'}
            onMouseLeave={e => (e.target as HTMLElement).style.transform='translateY(0)'}
          >Discover</Link>
          <Link href="/about" style={{ color: '#FF007F', textDecoration: 'none', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.target as HTMLElement).style.transform='translateY(-4px)'}
            onMouseLeave={e => (e.target as HTMLElement).style.transform='translateY(0)'}
          >Technology</Link>
          <Link href="/profile" style={{ color: '#00E5FF', textDecoration: 'none', fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'transform 0.2s' }}
            onMouseEnter={e => (e.target as HTMLElement).style.transform='translateY(-4px)'}
            onMouseLeave={e => (e.target as HTMLElement).style.transform='translateY(0)'}
          >Library</Link>
        </div>
      </footer>
    </>
  );
}
