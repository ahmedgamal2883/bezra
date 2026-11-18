'use client';
// Tutorial (V21): the welcome sheet on first open, then 7 short page tours (Today, Journal, Crop, Soil, Season, Try,
// Ask). Steps and copy come from the design (steps.json, extracted from design/source/V21-Tour-*.dc.html, English
// and Arabic). Each step points at the real element on the page (its selector); a step whose element is not on the
// page is skipped. The state is the server's (GET/PUT /me/tour), so it follows the person across devices.
// ?tour=welcome opens the sheet, ?tour=1 starts this page's tour (the sheet and the end toast link the pages).
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { API } from '@/lib/api';
import { useField, useUser } from '@/lib/field';
import { useLang } from '@/lib/i18n';
import { Mascot } from '@/components/chrome';
import STEPS from './steps.json';

type Page = 'Today' | 'Journal' | 'Crop' | 'Soil' | 'Season' | 'Try' | 'Ask';
type TourData = { sec: string; of: string; next: string; back: string; done: string; skip: string; close: string; endTxt: string; nextLabel: string; nextHref: string; steps: { s: string | null; t: string; b: string }[] };
const ORDER: Page[] = ['Today', 'Journal', 'Crop', 'Soil', 'Season', 'Try', 'Ask'];
const PATH: Record<Page, (id: string) => string> = {
  Today: (id) => `/field/${id}/today`, Journal: (id) => `/field/${id}/journal`, Crop: (id) => `/field/${id}/crop`, Soil: (id) => `/field/${id}/soil`,
  Season: (id) => `/field/${id}/season`, Try: (id) => `/field/${id}/season/try`, Ask: () => '/ask',
};
const put = (body: Record<string, unknown>) => fetch(`${API}/me/tour`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {});

export default function Tour({ page }: { page: Page }) {
  const { id } = useField();
  const { user } = useUser();
  const { lang } = useLang();
  const T = ((STEPS as Record<string, TourData>)[lang === 'ar' ? `${page}-AR` : page] || (STEPS as Record<string, TourData>)[page]);
  const [mode, setMode] = useState<'off' | 'welcome' | 'steps' | 'end'>('off');
  const [i, setI] = useState(0);
  const [box, setBox] = useState<{ spot: React.CSSProperties; card: React.CSSProperties } | null>(null);
  const steps = T.steps;

  // start: ?tour=..., or the first open of Today when the server says the tour was never offered
  useEffect(() => {
    if (!user) return;
    const q = new URLSearchParams(window.location.search).get('tour');
    if (q === 'welcome' && page === 'Today') { setMode('welcome'); return; }
    if (q) { setMode('steps'); setI(0); put({ status: 'in_progress', step: ORDER.indexOf(page) + 1 }); return; }
    if (page !== 'Today') return;
    fetch(`${API}/me/tour`).then((r) => (r.ok ? r.json() : null)).then((t) => {
      if (t && t.status === 'not_offered') { setMode('welcome'); put({ status: 'offered' }); }
    }).catch(() => {});
  }, [user, page]);

  // place the spotlight on the real element (and skip a step whose element is not on the page)
  const place = useCallback(() => {
    if (mode !== 'steps') return;
    const st = steps[i];
    const el = st?.s ? (document.querySelector(`.v2 ${st.s}`) as HTMLElement | null) : null;
    if (!el) { if (i < steps.length - 1) setI(i + 1); else setMode('end'); return; }
    const r = el.getBoundingClientRect(), fixed = getComputedStyle(el).position === 'fixed';
    const top = r.top + (fixed ? 0 : window.scrollY), h = Math.min(r.height, 420), pad = 8;
    const spot: React.CSSProperties = { left: Math.max(4, r.left - pad), top: top - pad, width: Math.min(window.innerWidth - 8, r.width + pad * 2), height: h + pad * 2, position: fixed ? 'fixed' : 'absolute' };
    const phone = window.innerWidth <= 760;
    let card: React.CSSProperties;
    if (phone) card = fixed ? { top: 76, bottom: 'auto' } : {};
    else if (r.right + 24 + 380 < window.innerWidth) card = { left: r.right + 24, top: Math.max(top, window.scrollY + 90) };
    else if (r.left - 24 - 380 > 0) card = { left: r.left - 24 - 380, top: Math.max(top, window.scrollY + 90) };
    else card = { left: Math.min(Math.max(16, r.left), window.innerWidth - 396), top: top + h + pad + 14 };
    setBox({ spot, card });
    if (!fixed) window.scrollTo({ top: Math.max(0, top - 90), behavior: 'smooth' });
  }, [mode, i, steps]);
  useLayoutEffect(() => { const t = setTimeout(place, 60); return () => clearTimeout(t); }, [place]);
  useEffect(() => {
    if (mode !== 'steps') return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMode('off'); put({ status: 'skipped', skippedAt: new Date().toISOString() }); } };
    window.addEventListener('keydown', k); window.addEventListener('resize', place);
    return () => { window.removeEventListener('keydown', k); window.removeEventListener('resize', place); };
  }, [mode, place]);

  if (mode === 'off' || !id) return null;
  const nextPage = ORDER[ORDER.indexOf(page) + 1];
  const guest = !!user?.demo_account;
  if (mode === 'welcome') {
    const ar = lang === 'ar';
    return (
      <div className="v2" style={{ position: 'fixed', inset: 0, zIndex: 75 }}>
        <div className="scrim" />
        <div className="welcome" role="dialog" aria-modal="true" aria-labelledby="wl-h">
          <div className="row" style={{ gap: '14px' }}>
            <Mascot size={56} />
            <span className="col" style={{ gap: '4px' }}>
              <span className="meta">{guest ? (ar ? 'أهلاً يا ضيف' : 'Welcome, guest') : (ar ? `أهلاً يا ${(user?.name || '').split(' ')[0]}` : `Welcome, ${(user?.name || '').split(' ')[0]}`)}</span>
              <h2 id="wl-h" style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-.6px' }}>{guest ? (ar ? 'دي أرض عينة. اتفرج براحتك.' : 'This is a sample field. Have a look around.') : (ar ? 'أرضك جاهزة.' : 'Your field is ready.')}</h2>
            </span>
          </div>
          <p className="txt">{ar ? 'بذرة بتقرا أرضك من الفضاء وبتقولك تعمل إيه يوم بيوم. تحب جولة سريعة؟ بتاخد حوالي دقيقتين.' : 'Bezra reads your field from space and tells you what to do, day by day. Want a quick tour? It takes about 2 minutes.'}</p>
          <div className="row" style={{ gap: '10px', marginTop: '4px' }}>
            <button type="button" className="btn press" style={{ height: '54px', fontSize: '16px', flex: 1 }} autoFocus onClick={() => { setMode('steps'); setI(0); put({ status: 'in_progress', step: 1 }); }}>{ar ? 'فرّجني' : 'Show me around'}</button>
            <button type="button" className="btn soft press" style={{ height: '54px', fontSize: '16px', flex: 1 }} onClick={() => { setMode('off'); put({ status: 'skipped', skippedAt: new Date().toISOString() }); }}>{ar ? 'هتفرج لوحدي' : "I'll explore on my own"}</button>
          </div>
          <span className="meta" style={{ textAlign: 'center' }}>{ar ? 'تقدر تعيد الجولة في أي وقت من حسابك.' : 'You can replay the tour any time from your profile.'}</span>
        </div>
      </div>
    );
  }
  if (mode === 'end') {
    const last = !nextPage;
    return (
      <div className="v2" style={{ position: 'fixed', inset: 'auto 0 0 0', zIndex: 72 }}>
        <div className="toast" role="status" style={{ zIndex: 72 }}>
          {last ? (lang === 'ar' ? 'خلصت الجولة. أرضك مستنياك.' : "That's the tour. Your field is waiting.") : T.endTxt}
          {last ? <Link href={PATH.Today(id)} className="btn sm press" style={{ background: 'var(--sun)', color: '#141A16' }}>{lang === 'ar' ? 'افتح النهارده' : 'Open Today'}</Link>
            : <Link href={PATH[nextPage](id) + '?tour=1'} className="btn sm press" style={{ background: 'var(--sun)', color: '#141A16' }}>{T.nextLabel}</Link>}
          <button type="button" onClick={() => setMode('off')} aria-label={T.close}>✕</button>
        </div>
      </div>
    );
  }
  const st = steps[i];
  const finish = () => { setMode('end'); put(nextPage ? { status: 'in_progress', step: ORDER.indexOf(page) + 2 } : { status: 'completed', completedAt: new Date().toISOString() }); };
  return (
    <div className="v2" style={{ position: 'absolute', inset: 0, zIndex: 70, pointerEvents: 'none' }} aria-live="polite">
      {box ? <div className="tspot" style={box.spot} /> : null}
      <div className="tcard" role="dialog" aria-modal="true" aria-labelledby="tc-h" style={{ ...(box?.card || {}), pointerEvents: 'auto' }}>
        <div className="row sp">
          <span className="row" style={{ gap: '8px' }}><Mascot size={30} /><span className="meta" style={{ fontWeight: 600 }}>{`${T.sec} · ${i + 1} ${T.of} ${steps.length}`}</span></span>
          <div className="tdots" aria-hidden="true">{steps.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
        </div>
        <h3 id="tc-h">{st.t}</h3>
        <p>{st.b}</p>
        <div className="row sp" style={{ marginTop: '6px' }}>
          <button type="button" className="tskip" onClick={() => { setMode('off'); put({ status: 'skipped', skippedAt: new Date().toISOString() }); }}>{T.skip}</button>
          <span className="row" style={{ gap: '8px' }}>
            {i > 0 ? <button type="button" className="btn soft sm press" onClick={() => setI(i - 1)}>{T.back}</button> : null}
            <button type="button" className="btn sm press" autoFocus onClick={() => (i === steps.length - 1 ? finish() : setI(i + 1))}>{i === steps.length - 1 ? T.done : T.next}</button>
          </span>
        </div>
      </div>
    </div>
  );
}
