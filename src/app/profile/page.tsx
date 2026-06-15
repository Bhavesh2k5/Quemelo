'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Disc3, ExternalLink, LogOut, ArrowLeft, Headphones, Mic } from 'lucide-react';
import Link from 'next/link';
import EqualizerBars from '@/components/EqualizerBars';
import { SongCard } from '@/app/page';

const ACCENTS = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF'];

interface User {
  email: string;
  username?: string;
}

interface HistoryItem {
  id: number;
  title: string;
  artist: string;
  album?: string;
  cover_art?: string;
  spotify_url?: string;
  lyrics?: string;
  youtube_url?: string;
  genre?: string;
  apple_music_url?: string;
  shazam_url?: string;
  created_at: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<number>(0);
  const router = useRouter();

  // Settings form state
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCurrentPassword, setEditCurrentPassword] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setNow(Date.now()), 0);
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) throw new Error();
        const userData = await res.json();
        if (!isMounted) return;
        setUser(userData);
        setEditUsername(userData.username || '');
        setEditEmail(userData.email || '');
        const h = await fetch('/api/history');
        if (h.ok) setHistory(await h.json());
      } catch {
        if (isMounted) router.push('/login');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; clearTimeout(t); };
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus('UPDATING...');
    try {
      const payload: any = { email: editEmail, username: editUsername };
      if (editPassword) {
        payload.password = editPassword;
        payload.currentPassword = editCurrentPassword;
      }
      
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json();
        setUpdateStatus(`ERROR: ${err.error}`);
        return;
      }
      setUpdateStatus('SUCCESS! DETAILS UPDATED.');
      setUser(prev => prev ? { ...prev, email: editEmail, username: editUsername } : null);
      setEditPassword('');
      setEditCurrentPassword('');
      setTimeout(() => setUpdateStatus(''), 3000);
    } catch {
      setUpdateStatus('ERROR UPDATING');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <span className="font-heading text-gradient anim-pulse" style={{ fontSize: '4rem', textShadow: '4px 4px 0 #000' }}>TUNING IN...</span>
        <EqualizerBars barCount={16} maxHeight={40} active={true} />
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050505', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Patterns */}
      <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
      <div className="pattern-sonic-mesh" style={{ position: 'absolute', inset: 0 }} />

      {/* Watermark */}
      <div className="font-heading bg-watermark" style={{ fontSize: '18rem', opacity: 0.2, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#7000FF' }}>
        LIBRARY
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          background: '#111',
          border: '4px solid #FF007F', borderRadius: 0, padding: '24px 32px',
          boxShadow: '12px 12px 0 #00E5FF, 24px 24px 0 #000',
          marginBottom: 64,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: '#000', border: '4px solid #FF007F', borderRadius: 0, color: '#fff', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '4px 4px 0 #000' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#FF007F'; (e.currentTarget as HTMLElement).style.color='#000'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='#000'; (e.currentTarget as HTMLElement).style.color='#fff'; }}
            ><ArrowLeft size={24} strokeWidth={3} /></Link>
            <div>
              <h1 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', margin: 0, textShadow: '2px 2px 0 #FF007F' }}>MY LIBRARY</h1>
              <p style={{ color: '#00E5FF', margin: 0, fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', marginTop: 4 }}>
                {user?.username ? `${user.username} | ${user.email}` : user?.email}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="anim-wiggle" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFEA00', border: '4px solid #000', padding: '10px 20px', boxShadow: '4px 4px 0 #000' }}>
              <Headphones size={20} style={{ color: '#000' }} />
              <span style={{ color: '#000', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase' }}>{history.length} scans</span>
            </div>
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FF3300', border: '4px solid #000', padding: '10px 20px', color: '#000', fontFamily: 'inherit', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', cursor: 'none', transition: 'all 0.2s', boxShadow: '4px 4px 0 #000' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #000'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #000'; }}
            >
              <LogOut size={20} strokeWidth={3} /> LOGOUT
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div style={{ marginBottom: 64, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Details Card */}
            <div style={{ background: '#111', border: '4px solid #7000FF', padding: 32, boxShadow: '8px 8px 0 #00E5FF' }}>
              <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#00E5FF', margin: '0 0 24px 0', textShadow: '2px 2px 0 #000', textTransform: 'uppercase' }}>Profile Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.1em' }}>USERNAME</label>
                  <input 
                    type="text" 
                    value={editUsername} 
                    onChange={e => setEditUsername(e.target.value)}
                    placeholder="YOUR ALIAS"
                    style={{ background: '#000', border: '2px solid #333', color: 'white', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#00E5FF'}
                    onBlur={e => e.target.style.borderColor = '#333'}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.1em' }}>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={e => setEditEmail(e.target.value)}
                    style={{ background: '#000', border: '2px solid #333', color: 'white', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#00E5FF'}
                    onBlur={e => e.target.style.borderColor = '#333'}
                  />
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div style={{ background: '#111', border: '4px solid #FF007F', padding: 32, boxShadow: '8px 8px 0 #FFEA00' }}>
              <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#FF007F', margin: '0 0 24px 0', textShadow: '2px 2px 0 #000', textTransform: 'uppercase' }}>Security / Password</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '0 0 24px 0' }}>Leave these blank if you do not wish to change your password.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.1em' }}>CURRENT PASSWORD</label>
                  <input 
                    type="password" 
                    value={editCurrentPassword} 
                    onChange={e => setEditCurrentPassword(e.target.value)}
                    placeholder="Verify current password..."
                    style={{ background: '#000', border: '2px solid #333', color: 'white', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#FF007F'}
                    onBlur={e => e.target.style.borderColor = '#333'}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.1em' }}>NEW PASSWORD</label>
                  <input 
                    type="password" 
                    value={editPassword} 
                    onChange={e => setEditPassword(e.target.value)}
                    placeholder="Enter new password..."
                    style={{ background: '#000', border: '2px solid #333', color: 'white', padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#FF007F'}
                    onBlur={e => e.target.style.borderColor = '#333'}
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <button 
                type="submit" 
                style={{ background: '#FFEA00', border: '4px solid #000', color: '#000', padding: '16px 40px', fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '4px 4px 0 #000', textTransform: 'uppercase' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #00E5FF'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #000'; }}
              >
                SAVE ALL CHANGES
              </button>
              {updateStatus && (
                <span className="font-heading anim-blink" style={{ color: updateStatus.includes('SUCCESS') ? '#00E5FF' : '#FF3300', fontSize: '1.2rem', letterSpacing: '0.1em', background: '#000', padding: '8px 16px', border: '2px solid currentColor' }}>
                  {updateStatus}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 64 }}>
          {[
            { label: 'Total Scans', value: history.length, color: '#FF007F', shadow: '#00E5FF' },
            { label: 'This Week', value: now > 0 ? history.filter(h => new Date(h.created_at) > new Date(now - 7*24*60*60*1000)).length : 0, color: '#00E5FF', shadow: '#FFEA00' },
            { label: 'Matched', value: history.filter(h => h.title).length, color: '#FFEA00', shadow: '#FF007F' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#181818', border: `4px solid ${s.color}`, borderRadius: 0, padding: '32px', textAlign: 'center', boxShadow: `8px 8px 0 ${s.shadow}`, transform: `rotate(${i%2===0?2:-2}deg)` }}>
              <div className="font-heading text-gradient" style={{ fontSize: '3.5rem', marginBottom: 8, textShadow: '4px 4px 0 #000' }}>{s.value}</div>
              <p style={{ color: s.color, fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* History heading */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <Mic size={32} style={{ color: '#FF007F' }} />
          <h2 className="font-heading" style={{ fontSize: '2.5rem', color: 'white', margin: 0, textShadow: '2px 2px 0 #FF007F' }}>RECENT SCANS</h2>
        </div>

        {/* History grid */}
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, border: '4px dashed #FF007F', background: '#111', boxShadow: '12px 12px 0 #00E5FF' }}>
            <p className="font-heading" style={{ fontSize: '3rem', color: '#FF007F', textShadow: '2px 2px 0 #000', margin: 0 }}>NO SONGS YET</p>
            <p style={{ color: '#00E5FF', fontWeight: 900, marginTop: 16, fontSize: '1.2rem', textTransform: 'uppercase' }}>Hit the mic and start discovering.</p>
            <Link href="/" style={{ display: 'inline-block', marginTop: 32, background: '#FF007F', border: '4px solid #000', padding: '16px 40px', color: '#fff', fontFamily: "'Outfit', sans-serif", fontWeight: 900, textDecoration: 'none', fontSize: '1.1rem', textTransform: 'uppercase', boxShadow: '6px 6px 0 #00E5FF' }}>
              START LISTENING →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 40 }}>
            {history.map((scan, i) => (
              <SongCard
                key={scan.id}
                title={scan.title || 'Unknown'}
                artist={scan.artist || 'Unknown'}
                album={scan.album}
                cover={scan.cover_art}
                spotifyUrl={scan.spotify_url || undefined}
                lyrics={scan.lyrics || undefined}
                youtubeUrl={scan.youtube_url || undefined}
                genre={scan.genre || undefined}
                appleMusicUrl={scan.apple_music_url || undefined}
                shazamUrl={scan.shazam_url || undefined}
                idx={i}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
