'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music2, User } from 'lucide-react';
import { useState, useEffect } from 'react';


export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string, username?: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data && !data.error) setUser(data);
      })
      .catch(() => {});
  }, [pathname]);

  const links = [
    { href: '/', label: 'Identify' },
    { href: '/discover', label: 'Discover' },
    { href: '/about', label: 'Technology' },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: 80, zIndex: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px',
          background: 'rgba(13, 13, 26, 0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '4px solid #FF3AF2',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #C850C0, #4158D0, #43C6AC)',
              backgroundSize: '200% 200%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(200,80,192,0.5)',
              animationName: 'gradient-shift, float-gentle',
              animationDuration: '4s, 5s',
              animationTimingFunction: 'ease, ease-in-out',
              animationIterationCount: 'infinite, infinite',
            }}
          >
            <Music2 size={22} color="white" strokeWidth={2.5} />
          </div>
          <span
            className="font-heading text-gradient animate-glitch"
            style={{ fontSize: '1.5rem' }}
          >
            QUEMELO
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '0.85rem',
                color: pathname === l.href ? '#C850C0' : 'rgba(240,238,248,0.55)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = '#C850C0';
                (e.target as HTMLElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.color = pathname === l.href ? '#C850C0' : 'rgba(240,238,248,0.55)';
                (e.target as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              {l.label}
            </Link>
          ))}

          {/* Conditional Auth UI */}
          {user ? (
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginLeft: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00E5FF, #7000FF)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #FFEA00', boxShadow: '0 0 10px rgba(0,229,255,0.5)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
              >
                <User size={20} color="#000" strokeWidth={3} />
              </div>
              <span className="font-heading" style={{ color: '#fff', fontSize: '1rem', letterSpacing: '0.05em' }}>
                {user.username || user.email.split('@')[0]}
              </span>
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginLeft: 16 }}>
              <Link
                href="/login"
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'rgba(240,238,248,0.7)', textDecoration: 'none', transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,238,248,0.7)'; }}
              >
                Login
              </Link>
              <Link
                href="/register"
                style={{
                  background: 'linear-gradient(135deg, #C850C0, #4158D0)',
                  border: '4px solid #FFCC70',
                  borderRadius: 9999,
                  padding: '8px 20px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'inline-block',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'scale(1.06)';
                  el.style.boxShadow = '0 0 24px rgba(200,80,192,0.7), 0 0 48px rgba(255,204,112,0.4)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'scale(1)';
                  el.style.boxShadow = 'none';
                }}
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 490,
          background: '#0D0D1A',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 48,
        }}>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: '3rem',
                textTransform: 'uppercase',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
