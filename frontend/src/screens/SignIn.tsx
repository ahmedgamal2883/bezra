'use client';
// Sign in. Not in the V11 artboards; built only from V11 parts (Landing header, mascot speech
// bubble, segmented control, inset field, CTA button, provenance pill).
// Demo only: no account system yet, the code is not checked and nothing is sent anywhere.
import Link from 'next/link';
import { useState } from 'react';
import { BrandMark, Mascot, Foot, ArrowUpRight } from '@/components/chrome';

export default function SignInScreen() {
  const [role, setRole] = useState<'farmer' | 'engineer'>('farmer');
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState('');
  const dest = role === 'farmer' ? '/field/north-plot' : '/engineer';
  const seg = (id: 'farmer' | 'engineer', label: string) => (
    <button type="button" className={'segb press' + (role === id ? ' on' : '')} aria-pressed={role === id} onClick={() => setRole(id)} style={{ flex: 1 }}>
      {label}
    </button>
  );
  const input = { flex: '1', height: '46px', border: '0', outline: '0', fontSize: '16px', background: 'transparent', fontFamily: 'inherit', color: 'var(--ink)', fontWeight: 600 } as const;

  return (
    <div className="root">
      <div className="shell">
        <header className="top">
          <Link href="/" className="brand" aria-label="Bezra, home">
            <BrandMark />
            {'bezra'}
          </Link>
          <div className="tools">
            <Link href="/onboarding" className="btn soft press">{'Add my field'}</Link>
          </div>
        </header>
        <main className="main" style={{ minHeight: '640px', alignItems: 'center', justifyContent: 'center' }}>
          <section className="col rise" style={{ '--d': '1', width: '480px', maxWidth: '100%', gap: '18px', padding: '26px', borderRadius: 'var(--r-hero)', background: '#fff', boxSizing: 'border-box' } as React.CSSProperties}>
            <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
              <Mascot />
              <div className="col" style={{ gap: '6px', padding: '12px 16px', borderRadius: '6px 18px 18px 18px', background: 'var(--inset)' }}>
                <span className="ar-t" lang="ar" dir="rtl" style={{ fontSize: '18px', fontWeight: 600 }}>{'أهلاً بيك تاني'}</span>
                <span className="tl">{'Sign in with your phone number'}</span>
              </div>
            </div>
            <h1 className="h3">{'Sign in'}</h1>
            <div role="group" aria-label="I am" className="seg">
              {seg('farmer', 'Farmer')}
              {seg('engineer', 'Engineer')}
            </div>
            <label className="col" style={{ gap: '6px' }}>
              <span className="h2" style={{ fontSize: '14px' }}>{'Phone number'}</span>
              <span className="inset" style={{ height: '46px', fontSize: '15px', justifyContent: 'flex-start' }}>
                <b style={{ color: 'var(--muted)' }}>{'+20'}</b>
                <input type="tel" inputMode="tel" autoComplete="tel-national" placeholder="1x xxxx xxxx" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} />
              </span>
            </label>
            {sent ? (
              <label className="col" style={{ gap: '6px' }}>
                <span className="row sp">
                  <span className="h2" style={{ fontSize: '14px' }}>{'Code we sent by SMS'}</span>
                  <span className="pill pv-demo">{'Demo: any code works'}</span>
                </span>
                <span className="inset" style={{ height: '46px', fontSize: '15px' }}>
                  <input inputMode="numeric" autoComplete="one-time-code" placeholder="4 digits" maxLength={4} style={{ ...input, letterSpacing: '6px' }} />
                </span>
              </label>
            ) : null}
            {sent ? (
              <Link href={dest} className="btn cta press">{'Sign in'}<ArrowUpRight /></Link>
            ) : (
              <button type="button" className="btn cta press" onClick={() => setSent(true)}>{'Send me a code'}<ArrowUpRight /></button>
            )}
            <span className="sub">
              {'New to Bezra? '}
              <Link href="/onboarding" style={{ color: 'var(--ink)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>{'Add my field'}</Link>
            </span>
          </section>
          <div style={{ alignSelf: 'stretch' }}>
            <Foot note="No passwords. A code by SMS is enough." />
          </div>
        </main>
      </div>
    </div>
  );
}
