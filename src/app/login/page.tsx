'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music2, Eye, EyeOff } from 'lucide-react';

const ACCENTS = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF'];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push('/profile');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', background: '#050505', overflow: 'hidden' }}>
      <div className="pattern-dots-cyan" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
      <div className="pattern-sonic-mesh" style={{ position: 'absolute', inset: 0 }} />

      {/* Floating background elements */}
      {['BEAT', 'DROP', 'SYNTH', 'BASS', 'WAVE'].map((s, i) => (
        <span
          key={i}
          className="anim-float font-heading"
          style={{
            position: 'absolute',
            fontSize: [48, 64, 36, 56, 80][i],
            color: ACCENTS[i],
            opacity: 0.3,
            top: `${[20, 60, 10, 75, 40][i]}%`,
            left: `${[10, 80, 50, 20, 70][i]}%`,
            animationDelay: `${i * 0.4}s`,
            pointerEvents: 'none',
            userSelect: 'none',
            textShadow: '4px 4px 0 #000'
          }}
        >
          {s}
        </span>
      ))}

      <div
        className="anim-slam"
        style={{
          width: '100%', maxWidth: 420,
          background: '#181818',
          border: '4px solid #FF007F',
          borderRadius: 0,
          padding: 40,
          boxShadow: '12px 12px 0 #00E5FF, 24px 24px 0 #000',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="anim-pulse" style={{ width: 64, height: 64, borderRadius: 0, background: 'linear-gradient(135deg, #FF007F, #00E5FF)', border: '4px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 0 #FFEA00', marginBottom: 16 }}>
            <Music2 size={32} color="#fff" />
          </div>
          <h1 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', margin: 0, textShadow: '2px 2px 0 #FF007F' }}>WELCOME BACK</h1>
          <p style={{ color: '#00E5FF', fontSize: '1rem', fontWeight: 700, margin: '8px 0 0', textTransform: 'uppercase' }}>Log in to access your library</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {error && (
            <div className="anim-wiggle" style={{ background: '#FF3300', border: '4px solid #000', padding: '12px 16px', color: '#fff', fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', boxShadow: '4px 4px 0 #000' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', color: '#FFEA00', fontSize: '0.9rem', fontWeight: 900, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email</label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', background: '#000', border: '4px solid #fff', borderRadius: 0,
                padding: '16px', color: '#fff', fontSize: '1rem', fontWeight: 700,
                outline: 'none', transition: 'border-color 0.2s',
                boxShadow: '4px 4px 0 #FF007F'
              }}
              onFocus={e => (e.target.style.borderColor = '#00E5FF')}
              onBlur={e => (e.target.style.borderColor = '#fff')}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#FFEA00', fontSize: '0.9rem', fontWeight: 900, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} required
                value={password} onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', background: '#000', border: '4px solid #fff', borderRadius: 0,
                  padding: '16px', color: '#fff', fontSize: '1rem', fontWeight: 700,
                  outline: 'none', transition: 'border-color 0.2s', paddingRight: 48,
                  boxShadow: '4px 4px 0 #FF007F'
                }}
                onFocus={e => (e.target.style.borderColor = '#00E5FF')}
                onBlur={e => (e.target.style.borderColor = '#fff')}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', cursor: 'none' }}
              >
                {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={loading ? '' : 'anim-pulse'}
            style={{
              width: '100%', background: '#00E5FF', border: '4px solid #000', borderRadius: 0,
              padding: '16px', color: '#000', fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em',
              cursor: 'none', transition: 'all 0.2s ease', marginTop: 8,
              boxShadow: '6px 6px 0 #FF007F'
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0 #FF007F';
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #FF007F';
              }
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 32, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 700 }}>
          New here?{' '}
          <Link href="/register" style={{ color: '#FF007F', fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase' }}
            onMouseEnter={e => (e.target as HTMLElement).style.textDecoration='underline'}
            onMouseLeave={e => (e.target as HTMLElement).style.textDecoration='none'}
          >
            Create an account
          </Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase' }}
             onMouseEnter={e => (e.target as HTMLElement).style.color='#fff'}
             onMouseLeave={e => (e.target as HTMLElement).style.color='rgba(255,255,255,0.4)'}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
