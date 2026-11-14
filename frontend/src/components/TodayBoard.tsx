'use client';
// Rework B: My field -> Today. Built only from V11 parts (card, inset, pill, lv badges, btn, float, hero).
// Reading order for a farmer: one status line -> the field from space with heat / soil water / humidity on it
// (each with what it means for the crop) -> warnings beside it (why + how to check yourself) -> what to do next
// -> a small check-in. Every card opens its own page: /field/{id}/insight/{item id}.
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { API, PV } from '@/lib/api';
import { LogSheet } from '@/components/PlanToday';
import FieldJournal, { SeasonSoFar, useJournal } from '@/components/FieldJournal';
import Freshness from '@/components/Freshness';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LVC: Record<string, string> = { Low: 'lv lv-low', Medium: 'lv lv-med', High: 'lv lv-high' };
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const short = (s: string) => new Date(s + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

const Icon = ({ k }: { k: string }) => {
  const d: Record<string, string> = {
    heat: 'M12 3v9.5a3.5 3.5 0 1 0 0 0zM12 3a2 2 0 0 1 2 2v7.6M12 3a2 2 0 0 0-2 2v7.6M12 15.5v2',
    water: 'M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z',
    humidity: 'M4 14h12a3 3 0 1 0-3-3M3 10h8a3 3 0 1 0-3-3M5 18h11',
    rust: 'M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6',
    spot: 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    rain: 'M7 15a4 4 0 1 1 1-7.9A5 5 0 0 1 17.6 9 3.5 3.5 0 0 1 17 16M8 19l-1 2M12 19l-1 2M16 19l-1 2',
    wind: 'M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7',
    frost: 'M12 2v20M4.9 4.9l14.2 14.2M2 12h20M4.9 19.1 19.1 4.9',
    sow: 'M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6z',
    fertilizer: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3',
    weeding: 'M5 21l7-7M14 4l6 6-8 8-6-6z',
    harvest: 'M4 20c4-1 6-5 8-12 2 7 4 11 8 12M12 8V3',
  };
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d={d[k] || d.water} />
    </svg>
  );
};
const Arrow = () => (
  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
);

export function useToday(id: string) {
  const [data, setData] = useState<any>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!id) return;
    let alive = true;
    let t: ReturnType<typeof setTimeout>;
    const go = () => fetch(`${API}/fields/${id}/today`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => { if (alive) setData(j); })
      .catch(() => { if (alive) t = setTimeout(go, 8000); });
    go();
    return () => { alive = false; clearTimeout(t); };
  }, [id, n]);
  return { data, reload: () => setN((x) => x + 1) };
}

/** Weather on the map: value + one line on what it means for the crop. */
function Weather({ w, href }: { w: any; href: string }) {
  return (
    <Link href={href} className="float lift press wx" aria-label={`${w.label} ${w.value}${w.unit}. ${w.line} Open details`}>
      <span className="row sp" style={{ gap: '8px' }}>
        <span className="row" style={{ gap: '6px', color: 'var(--ink2)', fontSize: '13px', fontWeight: 600 }}><Icon k={w.kind} />{w.label}</span>
        {w.level !== 'Low' ? <span className={LVC[w.level]}><i />{w.level}</span> : null}
      </span>
      <b className="wx-num">{w.value}<small className="unit">{w.unit === '%' ? '%' : ` ${w.unit}`}</small></b>
      <span className="wx-line">{w.line}</span>
    </Link>
  );
}

export default function TodayBoard({ id, map, details }: { id: string; map: ReactNode; details: boolean }) {
  const { data: D, reload: reloadToday } = useToday(id);
  const J = useJournal(id);
  const reload = () => { reloadToday(); J.reload(); };
  const [sheet, setSheet] = useState(false);
  const fp = (k: string) => `/field/${id}/insight/${encodeURIComponent(k)}`;
  const ready = !!D;
  return (
    <div className="col today" style={{ gap: '14px' }}>
      {/* one sentence: are you on plan? */}
      <div className="row wrap rise" style={{ '--d': '1', gap: '10px', alignItems: 'center' } as React.CSSProperties}>
        {ready ? <span className={LVC[D.status.level] || 'lv lv-low'} style={{ fontSize: '14px', height: '32px', padding: '0 12px' }}><i />{D.status.text}</span> : <span className="tl">{'Reading your field…'}</span>}
        {ready && D.tracker.due ? <Link href={`/field/${id}/plan`} className="tl press" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{D.tracker.text}</Link> : null}
      </div>
      <Freshness id={id} />

      <div className="today-top">
        <div className="today-map">
          {map}
          <div className="wx-col" aria-label="Weather on your field">
            {ready ? D.weather.map((w: any) => <Weather key={w.id} w={w} href={fp(w.id)} />)
              : [0, 1, 2].map((i) => <span key={i} className="float wx" style={{ height: '104px', opacity: 0.6 }} />)}
          </div>
        </div>

        <aside className="card rise warn-card" style={{ '--d': '3' } as React.CSSProperties} aria-label="Warnings">
          <div className="row sp">
            <h2 className="h2" style={{ color: '#fff' }}>{'Warnings'}</h2>
            {ready ? <span className="pill" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }}>{D.warnings.length ? `${D.warnings.length} this week` : 'All clear'}</span> : null}
          </div>
          {!ready ? <span style={{ color: 'rgba(255,255,255,.7)' }}>{'Checking the forecast and the latest images…'}</span> : null}
          {ready && !D.warnings.length ? (
            <div className="col" style={{ gap: '8px', color: 'rgba(255,255,255,.82)', fontSize: '14px', lineHeight: 1.5 }}>
              <span>{'Nothing to worry about this week.'}</span>
              <span style={{ color: 'rgba(255,255,255,.62)' }}>{'Bezra watches heat, water in the soil, rust weather, rain, wind, frost and weak spots in the satellite images every morning, and checks for new satellite images every 6 hours.'}</span>
            </div>
          ) : null}
          {(D?.warnings || []).map((x: any) => (
            <Link key={x.id} href={fp(x.id)} className="warn press">
              <span className="row sp" style={{ gap: '8px' }}>
                <span className="row" style={{ gap: '8px', alignItems: 'center' }}><Icon k={x.kind} /><b style={{ fontSize: '15px' }}>{x.title}</b></span>
                <span className={LVC[x.level]}><i />{x.level}</span>
              </span>
              <span className="warn-why">{x.reason}</span>
              <span className="warn-check"><b>{'How to check: '}</b>{x.how_to_check}</span>
            </Link>
          ))}
        </aside>
      </div>

      <SeasonSoFar data={J.data} />

      <div className="today-bottom">
        <section className="card rise" style={{ '--d': '4' } as React.CSSProperties} aria-labelledby="next-h">
          <div className="row sp wrap" style={{ gap: '8px' }}>
            <h2 id="next-h" className="h2">{'What to do next'}</h2>
            <span className="row" style={{ gap: '6px' }}>
              <button type="button" className="btn soft sm press" onClick={() => setSheet(true)}>{'Log what you did'}</button>
              <Link href={`/field/${id}/plan`} className="btn line sm press">{'Whole season'}</Link>
            </span>
          </div>
          {!ready ? [0, 1, 2].map((i) => <span key={i} className="inset" style={{ height: '64px', opacity: 0.6 }} />) : null}
          {ready && !D.plan.length ? <span className="sub">{'Nothing planned in the next weeks.'}</span> : null}
          <ol className="col" style={{ gap: '6px', margin: 0, padding: 0 }}>
            {(D?.plan || []).map((t: any) => (
              <li key={t.id} style={{ listStyle: 'none' }}>
                <Link href={fp(t.id)} className="inset lift press next-row">
                  <span className="next-date">
                    <b>{short(t.date).split(' ').slice(1).join(' ')}</b>
                    <span>{short(t.date).split(' ')[0]}</span>
                  </span>
                  <span className="col" style={{ gap: '3px', minWidth: 0, flex: 1 }}>
                    <span className="row wrap" style={{ gap: '6px', alignItems: 'center' }}>
                      <b style={{ color: 'var(--ink)', fontSize: '15px' }}>{t.title}</b>
                      {t.status === 'Late' ? <span className="lv lv-high"><i />{'Late'}</span> : null}
                      {t.note ? <span className="pill">{t.note}</span> : null}
                    </span>
                    <span className="tl">{[t.amount, t.when.includes(' to ') ? t.when : null].filter(Boolean).join(' · ') || t.why}</span>
                    {t.detail.get.harvest || t.detail.get.benefit ? <span className="next-get">{t.detail.get.harvest || t.detail.get.benefit}</span> : null}
                  </span>
                  <span style={{ color: 'var(--muted)' }}><Arrow /></span>
                </Link>
              </li>
            ))}
          </ol>
          <span className="tl">{'Fertilizer: dates only. Your engineer sets the amount.'}</span>
        </section>

        <FieldJournal id={id} data={J.data} details={details} onChange={reload} askWatered={!!D?.checkin?.ask_watered} />
      </div>
      <LogSheet fieldId={id} open={sheet} onClose={() => setSheet(false)} onSaved={reload} />
    </div>
  );
}
