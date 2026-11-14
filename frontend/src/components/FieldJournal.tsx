'use client';
// Rework F: the season so far + the field's journal, built from V11 parts (card, inset, pill, lv, btn).
// The journal mixes the four things Bezra knows, each line marked with where it comes from:
// satellite (NASA / ESA images), weather (observed), Bezra's estimates, and what the farmer logged.
// The farmer can add any kind of entry in one tap; the quick questions keep the plan true.
import { useEffect, useState } from 'react';
import { API } from '@/lib/api';
import { LogSheet, SatelliteAsk, logAction } from '@/components/PlanToday';

/* eslint-disable @typescript-eslint/no-explicit-any */
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const short = (s: string) => new Date(s + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const SRC: Record<string, { label: string; color: string; bg: string }> = {
  farmer: { label: 'You', color: '#3A3F3B', bg: '#ECECE8' },
  satellite: { label: 'Satellite', color: 'var(--green)', bg: 'var(--green-tint)' },
  weather: { label: 'Weather', color: '#1D4F73', bg: 'var(--water-tint)' },
  estimate: { label: 'Bezra', color: '#7A4A0B', bg: '#FBEBD2' },
  plan: { label: 'Plan', color: '#8A2A12', bg: '#FBE3DC' },
};
const ADD: [string, string][] = [['water', 'Watered'], ['fertilizer', 'Fertilizer'], ['spray', 'Spray'], ['weeding', 'Weeding'],
  ['observe', 'Saw a problem'], ['note', 'Note'], ['harvest', 'Harvest']];

export function useJournal(id: string) {
  const [data, setData] = useState<any>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!id) return;
    let alive = true;
    fetch(`${API}/fields/${id}/journal`, { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (alive && j) setData(j); }).catch(() => {});
    return () => { alive = false; };
  }, [id, n]);
  return { data, reload: () => setN((x) => x + 1) };
}

/** The last 30 days: Bezra's soil water (line), observed rain (blue bars), hot days (orange dots). */
function Chart30({ s }: { s: any[] }) {
  const W = 600, H = 120, n = s.length, x = (i: number) => 8 + (i * (W - 16)) / (n - 1);
  const y = (v: number) => H - 18 - (v / 100) * (H - 30);
  const line = s.map((d, i) => (d.soil == null ? null : `${x(i).toFixed(1)},${y(d.soil).toFixed(1)}`)).filter(Boolean).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Last 30 days: soil water, rain and hot days" style={{ display: "block", maxWidth: "720px", maxHeight: "150px" }}>
      <line x1="8" x2={W - 8} y1={y(50)} y2={y(50)} stroke="#E2BE6A" strokeDasharray="4 4" />
      <text x={W - 8} y={y(50) - 4} textAnchor="end" fontSize="10" fill="#7A5A12">{'refill 50%'}</text>
      {s.map((d, i) => (d.rain ? <rect key={'r' + i} x={x(i) - 3} y={H - 18 - Math.min(40, d.rain * 4)} width="6" height={Math.min(40, d.rain * 4)} rx="2" fill="#3B6E8F" opacity=".7" /> : null))}
      {s.map((d, i) => (d.tmax != null && d.tmax >= 32 ? <circle key={'h' + i} cx={x(i)} cy={H - 8} r="3.5" fill="#F29B1E" /> : null))}
      {line ? <polyline points={line} fill="none" stroke="#1F4A33" strokeWidth="2.5" strokeLinejoin="round" /> : null}
      <text x="8" y={H - 1} fontSize="10" fill="#8A8F8A">{short(s[0].date)}</text>
      <text x={W - 8} y={H - 1} textAnchor="end" fontSize="10" fill="#8A8F8A">{'Today'}</text>
    </svg>
  );
}

export function SeasonSoFar({ data }: { data: any }) {
  const S = data?.season;
  const tile = (label: string, value: any, sub?: string) => (
    <div className="inset" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px', padding: '10px 12px' }}>
      <span className="tl">{label}</span>
      <b style={{ fontSize: '19px', color: 'var(--ink)' }}>{value ?? '…'}</b>
      {sub ? <span className="tl">{sub}</span> : null}
    </div>
  );
  const pct = S?.day != null && S?.days ? Math.min(100, Math.round((S.day / S.days) * 100)) : 0;
  return (
    <section className="card rise" style={{ '--d': '4' } as React.CSSProperties} aria-labelledby="sofar-h">
      <div className="row sp wrap" style={{ gap: '8px' }}>
        <h2 id="sofar-h" className="h2">{'Season so far'}</h2>
        {S?.on_plan ? <span className="pill">{S.on_plan}</span> : null}
      </div>
      {S?.day != null ? (
        <div className="col" style={{ gap: '6px' }}>
          <span className="row sp" style={{ fontSize: '14px' }}>
            <b>{`Day ${S.day} of about ${S.days}`}</b>
            <span className="tl">{S.days_to_harvest != null ? `${S.days_to_harvest} days to harvest (from ${short(S.harvest_from)})` : ''}</span>
          </span>
          <span style={{ height: '8px', borderRadius: '4px', background: 'var(--inset)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: pct + '%', background: 'var(--green)', borderRadius: '4px' }} />
          </span>
        </div>
      ) : null}
      <div className="grid sofar-grid keep-cols">
        {tile('Stage', S?.stage)}
        {tile('Water you logged', S ? `${S.water_used_m3} m³` : null, S ? `${S.water_per_feddan_m3} m³ per feddan` : undefined)}
        {tile('Rain since sowing', S ? `${S.rain_mm} mm` : null)}
        {tile('Hot days (over 32 °C)', S?.hot_days)}
        {tile('Greenness', S?.greenness_vs_normal ? S.greenness_vs_normal.replace(' a normal year for', ' normal for').replace(/\.$/, '') : (S ? 'Not enough images yet' : null))}
        {tile('Satellite images', S?.images, S ? `${S.logged} things you logged` : undefined)}
      </div>
      {data?.series ? (
        <div className="col" style={{ gap: '4px' }}>
          <span className="tl"><b style={{ color: 'var(--ink)' }}>{'Last 30 days'}</b>{' · green line: water in the roots · blue: rain · orange: hot day'}</span>
          <Chart30 s={data.series} />
        </div>
      ) : null}
    </section>
  );
}

export default function FieldJournal({ id, data, details, onChange, askWatered }: { id: string; data: any; details: boolean; onChange: () => void; askWatered: boolean }) {
  const [kind, setKind] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [more, setMore] = useState(false);
  const [asked, setAsked] = useState<'ask' | 'pick' | 'done'>('ask');
  const days = Array.from({ length: 10 }, (_, i) => iso(new Date(Date.now() - i * 86400000)));
  const ev = (data?.events || []).filter((e: any) => filter === 'all' || e.source === filter);
  const shown = more ? ev : ev.slice(0, 12);
  return (
    <section className="card rise" style={{ '--d': '5' } as React.CSSProperties} aria-labelledby="journal-h">
      <div className="row sp wrap" style={{ gap: '8px' }}>
        <h2 id="journal-h" className="h2">{'Field journal'}</h2>
        <span className="tl">{'Satellite, weather, Bezra and you, in one place'}</span>
      </div>

      {askWatered && asked !== 'done' ? (
        <div className="col inset" style={{ alignItems: 'stretch', gap: '8px' }}>
          <b style={{ color: 'var(--ink)', fontSize: '15px' }}>{'Did you water in the last 10 days?'}</b>
          {asked === 'ask' ? (
            <span className="row" style={{ gap: '6px' }}>
              <button type="button" className="btn sm press" style={{ flex: 1 }} onClick={() => setAsked('pick')}>{'Yes'}</button>
              <button type="button" className="btn soft sm press" style={{ flex: 1 }} onClick={() => setAsked('done')}>{'No'}</button>
            </span>
          ) : (
            <span className="row wrap" style={{ gap: '4px' }}>
              {days.map((d, i) => (
                <button key={d} type="button" className="btn soft sm press" style={{ height: '34px', padding: '0 10px' }}
                  onClick={async () => { await logAction(id, 'water', d).catch(() => {}); setAsked('done'); onChange(); }}>
                  {i === 0 ? 'Today' : i === 1 ? 'Yesterday' : short(d)}
                </button>
              ))}
            </span>
          )}
        </div>
      ) : null}
      <SatelliteAsk fieldId={id} details={details} onDone={onChange} />

      <div className="col" style={{ gap: '6px' }}>
        <span className="tl"><b style={{ color: 'var(--ink)' }}>{'Add to your journal'}</b></span>
        <div className="row wrap" style={{ gap: '6px' }}>
          {ADD.map(([k, l]) => <button key={k} type="button" className="btn soft sm press" onClick={() => setKind(k)}>{'+ ' + l}</button>)}
        </div>
      </div>

      <div role="group" aria-label="Show" className="row wrap" style={{ gap: '4px' }}>
        {[['all', 'All'], ['farmer', 'You'], ['satellite', 'Satellite'], ['weather', 'Weather'], ['estimate', 'Bezra'], ['plan', 'Plan']].map(([k, l]) => (
          <button key={k} type="button" className={'btn sm press' + (filter === k ? '' : ' line')} aria-pressed={filter === k} onClick={() => setFilter(k)} style={{ height: '32px' }}>{l}</button>
        ))}
      </div>

      {!data ? [0, 1, 2, 3].map((i) => <span key={i} className="inset" style={{ height: '52px', opacity: 0.6 }} />) : null}
      {data && !ev.length ? <span className="sub">{'Nothing here yet.'}</span> : null}
      <ol className="col journal" style={{ gap: '2px', margin: 0, padding: 0 }}>
        {shown.map((e: any, i: number) => {
          const s = SRC[e.source];
          const newDay = i === 0 || shown[i - 1].date !== e.date;
          return (
            <li key={i} style={{ listStyle: 'none' }}>
              {newDay ? <span className="tl journal-day">{new Date(e.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span> : null}
              <div className="row journal-row" style={{ gap: '10px', alignItems: 'flex-start' }}>
                <span className="pill journal-src" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                <span className="col" style={{ gap: '1px', minWidth: 0 }}>
                  <span style={{ color: 'var(--ink)', fontSize: '14px', fontWeight: 600 }}>{e.title}</span>
                  {e.detail ? <span className="tl">{e.detail}</span> : null}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      {ev.length > 12 ? <button type="button" className="btn line sm press" onClick={() => setMore((m) => !m)}>{more ? 'Show less' : `Show all ${ev.length}`}</button> : null}
      <LogSheet fieldId={id} open={!!kind} initial={kind || 'water'} onClose={() => setKind(null)} onSaved={onChange} />
    </section>
  );
}
