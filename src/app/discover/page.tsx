'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, PlayCircle, Sparkles } from 'lucide-react';
import EqualizerBars from '@/components/EqualizerBars';
import { SongCard } from '@/app/page';

const ACCENTS = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF'];

const FILTERS = ['ALL', 'ELECTRONIC', 'HIP-HOP', 'POP', 'ROCK', 'SYNTHWAVE'];

export default function Discover() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [trending, setTrending] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  // Fetch Trending
  useEffect(() => {
    setLoadingTrending(true);
    fetch(`/api/trending?genre=${activeFilter}`)
      .then(res => res.json())
      .then(data => {
        setTrending(data.songs || []);
        setLoadingTrending(false);
      })
      .catch(() => setLoadingTrending(false));
  }, [activeFilter]);

  // Fetch Recommendations
  useEffect(() => {
    fetch('/api/recommendations')
      .then(res => res.json())
      .then(data => {
        setRecommended(data.songs || []);
        setLoadingRecs(false);
      })
      .catch(() => setLoadingRecs(false));
  }, []);
  return (
    <main style={{ minHeight: '100vh', background: '#050505', padding: '60px 24px 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Patterns */}
      <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
      <div className="pattern-sonic-mesh" style={{ position: 'absolute', inset: 0 }} />
      <div className="bg-watermark" style={{ fontSize: '18rem', opacity: 0.2, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#00E5FF' }}>TRENDING</div>

      {/* Floating shapes */}
      {['♩','♪','♫','●','▲'].map((s,i) => (
        <span key={i} className="anim-float" style={{ position: 'absolute', fontSize: [36,52,28,48,64][i], color: ACCENTS[i], opacity: 0.3, top: `${[8,70,20,55,35][i]}%`, left: `${[88,5,40,75,20][i]}%`, animationDelay: `${i*0.6}s`, pointerEvents: 'none', userSelect: 'none' }}>{s}</span>
      ))}

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 64 }}>
          <div>
            <div className="anim-wiggle" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, background: '#FFEA00', padding: '8px 16px', border: '4px solid #000', width: 'fit-content', boxShadow: '4px 4px 0 #FF007F' }}>
              <TrendingUp size={24} style={{ color: '#000' }} />
              <span style={{ color: '#000', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>LIVE GLOBAL PULSE</span>
            </div>
            <h1 className="font-heading" style={{ fontSize: 'clamp(3rem,8vw,7rem)', margin: 0, color: 'white', textShadow: '4px 4px 0 #000, 8px 8px 0 #00E5FF, 12px 12px 0 #FF007F' }}>
              DISCOVER TRENDING
            </h1>
          </div>
          <div>
            <EqualizerBars barCount={12} maxHeight={48} active={true} />
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 64 }}>
          {FILTERS.map((f, i) => {
            const border = ACCENTS[i % ACCENTS.length];
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  background: isActive ? border : '#000',
                  border: `4px solid ${isActive ? '#000' : border}`,
                  borderRadius: 0, padding: '12px 24px',
                  color: isActive ? '#000' : border,
                  fontFamily: "'Outfit', sans-serif", fontWeight: 900,
                  fontSize: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  boxShadow: isActive ? `6px 6px 0 ${ACCENTS[(i+2)%5]}` : `4px 4px 0 ${border}`,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={e => { if(!isActive) { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0 ${border}`; } }}
                onMouseLeave={e => { if(!isActive) { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 ${border}`; } }}
              >{f}</button>
            );
          })}
        </div>

        {/* 3D broken grid */}
        {loadingTrending ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="anim-spin-fast"><EqualizerBars barCount={4} maxHeight={40} active={true} /></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 48, marginBottom: 100 }}>
            {trending.slice(0, 12).map((track, i) => {
              const border = ACCENTS[i % ACCENTS.length];
              const shadow1 = ACCENTS[(i+2) % ACCENTS.length];
              const rotate = [2,-2,4,-4,1,-1,3,-3,2.5][i % 9];
              return (
                <div
                  key={i}
                  className="song-card"
                  style={{
                    background: '#111',
                    border: `4px solid ${border}`,
                    borderRadius: 0,
                    boxShadow: `12px 12px 0 ${shadow1}, 24px 24px 0 #000`,
                    transform: `rotate(${rotate}deg) translateY(${i%2===0?24:0}px)`,
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative', height: 240, borderBottom: `4px solid ${border}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={track.img || track.cover} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.2) saturate(1.2)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)` }} />
                    
                    <div style={{ position: 'absolute', top: 12, left: 12, background: border, border: '4px solid #000', padding: '6px 12px', boxShadow: '4px 4px 0 #000' }}>
                      <span style={{ color: '#000', fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{track.genre || activeFilter}</span>
                    </div>
                    {track.appleMusicUrl && (
                      <a href={track.appleMusicUrl} target="_blank" rel="noreferrer" style={{ position: 'absolute', bottom: 16, right: 16 }}>
                        <PlayCircle size={48} className="anim-float-lg" style={{ color: border, filter: `drop-shadow(2px 2px 0 #000)`, background: '#000', borderRadius: '50%' }} />
                      </a>
                    )}
                  </div>
  
                  <div style={{ padding: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                      <EqualizerBars barCount={8} maxHeight={24} active={true} variant="mini" />
                    </div>
                    <h3 className="font-heading" style={{ fontSize: '1.5rem', color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: `2px 2px 0 ${border}` }}>{track.title.toUpperCase()}</h3>
                    <p style={{ color: ACCENTS[(i+1)%5], fontSize: '1rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '8px 0 0' }}>{track.artist}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recommended For You Section */}
        <div style={{ marginTop: 100, borderTop: '8px dashed #333', paddingTop: 80, paddingBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 64 }}>
            <div>
              <div className="anim-pulse" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, background: '#00E5FF', padding: '8px 16px', border: '4px solid #000', width: 'fit-content', boxShadow: '4px 4px 0 #FFEA00' }}>
                <Sparkles size={24} style={{ color: '#000' }} />
                <span style={{ color: '#000', fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>CUSTOM MIX ENGINE</span>
              </div>
              <h2 className="font-heading" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', margin: 0, color: 'white', textShadow: '4px 4px 0 #000, 8px 8px 0 #FF007F' }}>
                RECOMMENDED FOR YOU
              </h2>
            </div>
          </div>

          {loadingRecs ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
               <span style={{ color: '#00E5FF', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '0.1em' }} className="anim-blink">ANALYZING YOUR HISTORY...</span>
             </div>
          ) : (
            <div style={{
              width: '100%',
              position: 'relative',
              mask: 'linear-gradient(90deg, transparent, black 2%, black 98%, transparent)',
              WebkitMask: 'linear-gradient(90deg, transparent, black 2%, black 98%, transparent)'
            }}>
              <style>{`
                .rec-track::-webkit-scrollbar { display: none; }
                .rec-track { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
              <div
                className="rec-track"
                style={{
                  display: 'flex', gap: 40, overflowX: 'auto', padding: '40px 40px 60px 40px',
                }}
              >
                {recommended.map((s, i) => (
                  <div key={i} style={{ width: 340, flexShrink: 0 }}>
                    <SongCard 
                      title={s.title || s.t} 
                      artist={s.artist || s.a} 
                      idx={i} 
                      cover={s.cover || s.img || `https://picsum.photos/seed/${encodeURIComponent(s.title + s.artist)}/400/400`}
                      appleMusicUrl={s.appleMusicUrl}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
