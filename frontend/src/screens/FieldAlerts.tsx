'use client';
// Phase 3 alerts, built only from V11 parts (head, card, inset, chip tints, pill / lv badges, btn).
// Each alert says: what we saw, where (squares on a small map), how sure we are, the likely causes (ranked with
// the farmer's own answers), one action, and the proof. It closes only when the farmer says so, or when the next
// clear satellite image shows the spot has recovered. Data: GET/POST /fields/{id}/field-alerts.
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FarmerHeader, Foot } from '@/components/chrome';
import CheckIn from '@/components/CheckIn';
import { API, toSignIn } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CHIP: Record<string, string> = { spot: 'chip s', water: 'chip w', rust: 'chip r', heat: 'chip s', task: 'chip' };
const ICON: Record<string, string> = {
  spot: 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  water: 'M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z',
  rust: 'M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6',
  heat: 'M12 3v9.5a3.5 3.5 0 1 0 0 0zM12 3a2 2 0 0 1 2 2v7.6M12 3a2 2 0 0 0-2 2v7.6',
  task: 'M5 12.5 9.5 17 19 7.5',
};
const LEVEL: Record<string, [string, string, string]> = { high: ['lv lv-high', 'Act now', 'مهم'], med: ['lv lv-med', 'Look', 'بص عليها'], low: ['lv lv-low', 'Low', 'بسيط'] };
const SURE: Record<string, [string, string]> = { high: ['Sure', 'متأكدين'], med: ['Fairly sure', 'متأكدين نوعاً ما'], low: ['Not sure', 'مش متأكدين'] };
const ANSWER: Record<string, [string, string]> = {
  fine: ['It looks fine', 'شكلها كويس'], yellow: ['Yellow leaves', 'ورق أصفر'], spots: ['Spots or powder', 'بقع أو تراب على الورق'],
  insects: ['Insects', 'حشرات'], dry: ['Dry or wilting', 'ناشفة أو دبلانة'], waterlogged: ['Water standing', 'مية واقفة'],
  fixed: ['I fixed it', 'صلّحتها'], done: ['Done', 'عملتها'],
};

function speak(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-EG';
  const v = window.speechSynthesis.getVoices().find((x) => x.lang && x.lang.startsWith('ar'));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

export function MiniMap({ rows, cols, squares, size = 18 }: { rows: number; cols: number; squares: number[][]; size?: number }) {
  const on = new Set(squares.map(([r, c]) => `${r},${c}`));
  return (
    <span className="minimap" style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }} aria-hidden="true" dir="ltr">
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        return <i key={i} className={on.has(`${r},${c}`) ? 'on' : ''} style={{ width: size, height: size }} />;
      })}
    </span>
  );
}

export default function FieldAlertsScreen() {
  const tr = useT();
  const p = useParams();
  const id = String(p?.id || '');
  const [A, setA] = useState<any>(null);
  const [err, setErr] = useState('');
  const load = useCallback((n = 0) => {
    fetch(`${API}/fields/${id}/field-alerts`, { credentials: 'include' })
      .then(async (r) => { if (r.status === 401) toSignIn(); if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((j) => { setA(j); setErr(''); })
      .catch(() => (n < 3 ? setTimeout(() => load(n + 1), 3000 * (n + 1)) : setErr(tr('Could not load the alerts.', 'معرفناش نجيب التنبيهات.'))));
  }, [id, tr]);
  useEffect(() => { if (id) load(); }, [id, load]);

  const answer = async (a: any, ans: string) => {
    const r = await fetch(`${API}/fields/${id}/field-alerts/${encodeURIComponent(a.id)}`, { method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answer: ans }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setA(j.alerts);
  };
  const open = (A?.alerts || []).filter((a: any) => a.state === 'open');
  const closed = (A?.alerts || []).filter((a: any) => a.state === 'closed');

  return (
    <div className="root">
      <div className="shell">
        <FarmerHeader active="field" />
        <main className="main" style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
          <div className="head">
            <div className="col rise" style={{ '--d': '0', gap: '6px' } as React.CSSProperties}>
              <Link href={`/field/${id}`} className="eyebrow press">{tr('My field', 'أرضي')}</Link>
              <h1 className="h1">{tr('Alerts', 'التنبيهات')}</h1>
            </div>
            {A ? <span className={open.length ? 'lv lv-med' : 'lv lv-low'}><i />{open.length ? tr(`${open.length} open`, `${open.length} مفتوح`) : tr('All clear', 'كله تمام')}</span> : null}
          </div>
          {err ? <section className="card"><span className="body">{err}</span></section> : null}
          {!A && !err ? <span className="sub">{tr('Reading your field…', 'بنقرا أرضك…')}</span> : null}

          {A ? (
            <>
              {open.map((a: any, i: number) => <AlertCard key={a.id} a={a} fid={id} tr={tr} answer={answer} d={i + 1} />)}
              {!open.length ? (
                <section className="card rise" style={{ '--d': '1' } as React.CSSProperties}>
                  <h2 className="h2">{tr('Nothing needs you right now', 'مفيش حاجة محتاجاك دلوقتي')}</h2>
                  <p className="body">{tr('Bezra checks the weather every morning and looks for new satellite images every 6 hours.', 'بذرة بتبص على الطقس كل يوم الصبح، وبتدور على صور قمر صناعي جديدة كل 6 ساعات.')}</p>
                </section>
              ) : null}
              <CheckIn id={id} />
              {closed.length ? (
                <section className="card rise" style={{ '--d': '4' } as React.CSSProperties}>
                  <h2 className="h2">{tr('Closed', 'اتقفلت')}</h2>
                  <div className="col" style={{ gap: '6px' }}>
                    {closed.map((a: any) => (
                      <div key={a.id} className="inset">
                        <span className="row" style={{ gap: '8px', color: 'var(--ink)' }}>
                          <span className={CHIP[a.kind] || 'chip'} style={{ width: '28px', height: '28px' }}><Ico k={a.kind} /></span>
                          <b>{a.title}</b>
                        </span>
                        <span className="pill">{a.closed_by === 'recovery' ? tr('Recovered (satellite)', 'رجعت كويسة (القمر الصناعي)') : tr('You closed it', 'إنت قفلتها')}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
          <Foot />
        </main>
      </div>
    </div>
  );
}

const Ico = ({ k, s = 16 }: { k: string; s?: number }) => (
  <svg aria-hidden="true" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={ICON[k] || ICON.task} /></svg>
);

function AlertCard({ a, fid, tr, answer, d }: any) {
  const [busy, setBusy] = useState('');
  const lv = LEVEL[a.level] || LEVEL.low;
  const go = async (x: string) => { setBusy(x); try { await answer(a, x); } finally { setBusy(''); } };
  return (
    <section className="card rise alert-card" style={{ '--d': String(d) } as React.CSSProperties}>
      <div className="row sp" style={{ alignItems: 'flex-start', gap: '10px' }}>
        <span className="row" style={{ gap: '10px', alignItems: 'flex-start' }}>
          <span className={CHIP[a.kind] || 'chip'}><Ico k={a.kind} /></span>
          <h2 className="h3" style={{ fontSize: '19px' }}>{a.title}</h2>
        </span>
        <span className="row" style={{ gap: '6px' }}>
          <span className={lv[0]}><i />{tr(lv[1], lv[2])}</span>
          {a.voice ? <button type="button" className="ibtn press" style={{ width: '36px', height: '36px' }} aria-label={tr('Listen', 'اسمع')} onClick={() => speak(a.voice)}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7" /></svg>
          </button> : null}
        </span>
      </div>

      <div className="alert-grid">
        <div className="col" style={{ gap: '4px' }}>
          <span className="sub">{tr('What we saw', 'شفنا إيه')}</span>
          <p className="body" style={{ fontSize: '15px' }}>{a.seen}</p>
        </div>
        {a.where ? (
          <div className="row" style={{ gap: '10px', alignItems: 'center' }}>
            <MiniMap rows={a.where.rows} cols={a.where.cols} squares={a.where.squares} />
            <span className="col" style={{ gap: '2px' }}>
              <span className="sub">{tr('Where', 'فين')}</span>
              <b style={{ fontSize: '15px' }}>{a.where.name}</b>
              <span className="sub" style={{ fontSize: '12px' }}>{tr('North is up', 'الشمال فوق')}</span>
            </span>
          </div>
        ) : null}
      </div>

      <div className="inset" style={{ alignItems: 'flex-start' }}>
        <span>{tr('How sure', 'متأكدين قد إيه')}</span>
        <span className="col" style={{ gap: '2px', alignItems: 'flex-end', textAlign: 'end' }}>
          <b>{tr(...(SURE[a.sure] || SURE.low))}</b>
          <span className="sub" style={{ fontSize: '12.5px' }}>{a.sure_why}</span>
        </span>
      </div>

      {a.causes?.length ? (
        <div className="col" style={{ gap: '6px' }}>
          <span className="sub">{tr('Likely causes, most likely first', 'الأسباب المحتملة، الأقرب الأول')}</span>
          {a.causes.map((c: any, i: number) => (
            <div key={c.key} className="cause">
              <span className="cause-n">{i + 1}</span>
              <span className="col" style={{ gap: '2px', minWidth: 0 }}>
                <b style={{ fontSize: '14px' }}>{c.label}</b>
                {c.why.map((w: string) => <span key={w} className="sub" style={{ fontSize: '12.5px' }}>{w}</span>)}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="do-this">
        <span className="sub" style={{ color: 'rgba(255,255,255,.7)' }}>{tr('Do this', 'اعمل كده')}</span>
        <b>{a.action}</b>
      </div>

      {a.ask?.length ? (
        <div className="col" style={{ gap: '8px' }}>
          <span className="sub">{a.kind === 'spot' || a.kind === 'rust' ? tr('What did you see?', 'شفت إيه؟') : tr('Did you do it?', 'عملتها؟')}</span>
          <div className="row wrap" style={{ gap: '8px' }}>
            {a.ask.map((x: string) => (
              <button key={x} type="button" className={'btn sm press' + (a.answer === x ? '' : ' line')} disabled={!!busy} aria-pressed={a.answer === x} onClick={() => go(x)}>
                {tr(...(ANSWER[x] || [x, x]))}
              </button>
            ))}
          </div>
          {a.answer && a.state === 'open' ? <span className="sub">{tr('Thanks. The causes above now use your answer.', 'شكراً. الأسباب اللي فوق اتعدلت حسب إجابتك.')}</span> : null}
        </div>
      ) : null}

      <div className="row wrap sp" style={{ gap: '8px' }}>
        <span className="sub" style={{ fontSize: '12.5px' }}>{tr('From: ', 'المصدر: ')}<span>{a.source}</span></span>
        {a.evidence ? <Link href={a.evidence.href} className="sub press" style={{ textDecoration: 'underline', textUnderlineOffset: '3px', color: 'var(--ink)', fontWeight: 600 }}>{tr('Is it real? See the proof', 'حقيقية؟ شوف الإثبات')}</Link> : null}
      </div>
    </section>
  );
}
