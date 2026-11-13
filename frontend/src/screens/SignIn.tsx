'use client';
import { useT } from '@/lib/i18n';
// Sign in / Create account (Phase 2 §D). Built only from V11 parts: Landing header, mascot speech bubble,
// segmented control, inset fields, CTA button. Email + password; the backend keeps the session in an
// httpOnly cookie. After sign in: farmer -> own field, engineer -> Engineer page, new account -> Add your field.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { API } from '@/lib/api';
import { BrandMark, Mascot, Foot, ArrowUpRight } from '@/components/chrome';

type Mode = 'signin' | 'signup';

export default function SignInScreen() {
  const tr = useT();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [next, setNext] = useState<string | null>(null);
  const [demo, setDemo] = useState<{ email: string; password: string } | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setNext(q.get('next'));
    if (q.get('mode') === 'signup') setMode('signup');
    fetch(API + '/demo').then((r) => r.json()).then((d) => d.enabled && setDemo(d)).catch(() => {});
  }, []);

  const go = async () => {
    setErr('');
    setBusy(true);
    try {
      const r = await fetch(API + (mode === 'signin' ? '/auth/signin' : '/auth/signup'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'signin' ? { email, password: pw } : { email, password: pw, name }),
      });
      const js = await r.json();
      if (!r.ok) throw new Error(js.detail || 'Something went wrong');
      let dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '';
      if (!dest) {
        if (mode === 'signup') dest = '/onboarding';
        else if (js.role !== 'farmer') dest = '/engineer';
        else {
          const fl = await (await fetch(API + '/fields')).json();
          dest = fl.length ? `/field/${fl[0].id}` : '/onboarding';
        }
      }
      window.location.href = dest; // full load so every screen picks up the new session
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  const seg = (id: Mode, label: string) => (
    <button type="button" className={'segb press' + (mode === id ? ' on' : '')} aria-pressed={mode === id} onClick={() => { setMode(id); setErr(''); }} style={{ flex: 1 }}>
      {label}
    </button>
  );
  const input = { flex: '1', height: '46px', border: '0', outline: '0', fontSize: '16px', background: 'transparent', fontFamily: 'inherit', color: 'var(--ink)', fontWeight: 600 } as const;
  const field = (label: string, el: React.ReactNode) => (
    <label className="col" style={{ gap: '6px' }}>
      <span className="h2" style={{ fontSize: '14px' }}>{label}</span>
      <span className="inset" style={{ height: '46px', fontSize: '15px' }}>{el}</span>
    </label>
  );

  return (
    <div className="root">
      <div className="shell">
        <header className="top">
          <Link href="/" className="brand" aria-label="Bezra, home">
            <BrandMark />
            {'bezra'}
          </Link>
        </header>
        <main className="main" style={{ minHeight: '640px', alignItems: 'center', justifyContent: 'center' }}>
          <form
            className="col rise"
            onSubmit={(e) => { e.preventDefault(); if (!busy) go(); }}
            style={{ '--d': '1', width: '480px', maxWidth: '100%', gap: '18px', padding: '26px', borderRadius: 'var(--r-hero)', background: '#fff', boxSizing: 'border-box' } as React.CSSProperties}
          >
            <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
              <Mascot />
              <div className="col" style={{ gap: '6px', padding: '12px 16px', borderRadius: '6px 18px 18px 18px', background: 'var(--inset)' }}>
                <span style={{ fontSize: '18px', fontWeight: 600 }}>{mode === 'signin' ? tr('Welcome back', 'أهلاً بيك تاني') : tr('Welcome to Bezra', 'أهلاً بيك في بذرة')}</span>
                <span className="tl">{mode === 'signin' ? 'Sign in to see your fields' : 'Create your account, then add your field'}</span>
              </div>
            </div>
            <div role="group" aria-label="Sign in or create an account" className="seg">
              {seg('signin', 'Sign in')}
              {seg('signup', 'Create account')}
            </div>
            {mode === 'signup' ? field('Your name', <input autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} style={input} required />) : null}
            {field('Email', <input type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} required />)}
            {field('Password', <input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={pw} onChange={(e) => setPw(e.target.value)} style={input} required minLength={mode === 'signup' ? 8 : undefined} />)}
            {mode === 'signup' ? <span className="tl">{'At least 8 characters.'}</span> : null}
            {err ? (
              <div className="row" role="alert" style={{ gap: '10px', padding: '12px 14px', borderRadius: '12px', background: 'var(--risk-tint)', color: '#8F2A17', fontSize: '14px' }}>{err}</div>
            ) : null}
            <button type="submit" className="btn cta press" disabled={busy}>
              {busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}
              <ArrowUpRight />
            </button>
            {mode === 'signin' ? (
              <span className="sub">{'Forgot your password? Ask your engineer or the Bezra team to reset it.'}</span>
            ) : null}
            {demo && mode === 'signin' ? (
              <div className="col" style={{ gap: '6px', padding: '12px 14px', borderRadius: '12px', background: 'var(--sun-tint)' }}>
                <span className="row sp">
                  <b style={{ fontSize: '14px' }}>{'Try the demo farmer'}</b>
                  <span className="pill pv-demo">{'Demo mode'}</span>
                </span>
                <span className="tl" style={{ color: 'var(--ink2)' }}>{demo.email} · {demo.password}</span>
                <button type="button" className="btn soft sm press" style={{ alignSelf: 'flex-start' }} onClick={() => { setEmail(demo.email); setPw(demo.password); }}>
                  {'Fill it in'}
                </button>
              </div>
            ) : null}
          </form>
          <div style={{ alignSelf: 'stretch' }}>
            <Foot note="Your password is stored safely hashed. Bezra never shows it." />
          </div>
        </main>
      </div>
    </div>
  );
}
