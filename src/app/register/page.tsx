'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Music2, Eye, EyeOff } from 'lucide-react';

const ACCENTS = ['#FF007F', '#00E5FF', '#FFEA00', '#FF3300', '#7000FF'];

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      router.push('/login');
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
      <div className="pattern-dots" style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
      <div className="pattern-sonic-mesh" style={{ position: 'absolute', inset: 0 }} />

      {/* Floating background elements */}
      {['JOIN', 'PLAY', 'FIND', 'SEEK', 'SYNC'].map((s, i) => (
        <span
          key={i}
          className="anim-float font-heading"
          style={{
            position: 'absolute',
            fontSize: [40, 28, 48, 32, 56][i],
            color: ACCENTS[(i+1)%5],
            opacity: 0.3,
            top: `${[15, 65, 5, 80, 35][i]}%`,
            left: `${[80, 15, 55, 85, 30][i]}%`,
            animationDelay: `${i * 0.5}s`,
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
          border: '4px solid #00E5FF',
          borderRadius: 0,
          padding: 40,
          boxShadow: '12px 12px 0 #FF007F, 24px 24px 0 #000',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="anim-pulse" style={{ width: 64, height: 64, borderRadius: 0, background: 'linear-gradient(135deg, #00E5FF, #7000FF)', border: '4px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '6px 6px 0 #FF007F', marginBottom: 16 }}>
            <Music2 size={32} color="#fff" />
          </div>
          <h1 className="font-heading" style={{ fontSize: '2.5rem', color: '#fff', margin: 0, textShadow: '2px 2px 0 #00E5FF' }}>CREATE ACCOUNT</h1>
          <p style={{ color: '#FF007F', fontSize: '1rem', fontWeight: 700, margin: '8px 0 0', textTransform: 'uppercase' }}>Your library awaits</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                boxShadow: '4px 4px 0 #00E5FF'
              }}
              onFocus={e => (e.target.style.borderColor = '#FF007F')}
              onBlur={e => (e.target.style.borderColor = '#fff')}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#FFEA00', fontSize: '0.9rem', fontWeight: 900, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} required minLength={6}
                value={password} onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', background: '#000', border: '4px solid #fff', borderRadius: 0,
                  padding: '16px', color: '#fff', fontSize: '1rem', fontWeight: 700,
                  outline: 'none', transition: 'border-color 0.2s', paddingRight: 48,
                  boxShadow: '4px 4px 0 #00E5FF'
                }}
                onFocus={e => (e.target.style.borderColor = '#FF007F')}
                onBlur={e => (e.target.style.borderColor = '#fff')}
                placeholder="Min 6 chars"
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
              width: '100%', background: '#FF007F', border: '4px solid #000', borderRadius: 0,
              padding: '16px', color: '#fff', fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em',
              cursor: 'none', transition: 'all 0.2s ease', marginTop: 8,
              boxShadow: '6px 6px 0 #00E5FF'
            }}
            onMouseEnter={e => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.transform = 'translate(-2px, -2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0 #00E5FF';
              }
            }}
            onMouseLeave={e => {
              if (!loading) {
                (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #00E5FF';
              }
            }}
          >
            {loading ? 'CREATING...' : 'SIGN UP'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 32, color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 700 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#00E5FF', fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase' }}
            onMouseEnter={e => (e.target as HTMLElement).style.textDecoration='underline'}
            onMouseLeave={e => (e.target as HTMLElement).style.textDecoration='none'}
          >
            Log in
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
