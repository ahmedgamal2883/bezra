'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// From design/html/V11-Onboarding.html (layout and copy 1:1 for step 2, "Basics").
// Steps 1, 3 and 4 of the design's own step bar are built from the same parts:
// map panel, mascot speech bubble, inset fields, chips, segmented controls, accuracy card, CTA row.
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { MapDrawHandle, LatLon } from '@/components/MapDraw';
import { areaM2 } from '@/components/MapDraw';
import { API } from '@/lib/api';

const MapDraw = dynamic(() => import('@/components/MapDraw'), { ssr: false });
import { useField, FieldWho, EngName } from '@/lib/field';
import Link from 'next/link';

const Mascot = () => (
  <svg aria-hidden="true" width="60" height="60" viewBox="0 0 60 60">
    <g className="sway">
      <path d="M30 13C25 4 16 4 12 7c4 6 11 8 18 6z" fill="#5E9A45" />
      <path d="M30 13c4-9 13-11 18-8-3 7-11 10-18 8z" fill="#3E7F35" />
      <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
      <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="blink" style={{ transformOrigin: '30px 31px' }}>
        <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
        <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
      </g>
      <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
      <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
    </g>
  </svg>
);

const Bubble = ({ en, ar, sub }: { en: string; ar: string; sub: string }) => (
  <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
    <Mascot />
    <div className="col" style={{ gap: '6px', padding: '12px 16px', borderRadius: '6px 18px 18px 18px', background: 'var(--inset)' }}>
      <span style={{ fontSize: '18px', fontWeight: '600' }}><T en={en} ar={ar} /></span>
      <span className="tl">{sub}</span>
    </div>
  </div>
);

const I = {
  cal: <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  sprout: <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />,
  drop: <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />,
  list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  alert: <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />,
  flask: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" />,
  chip: <path d="M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />,
  pencil: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
};
const Icon = ({ d }: { d: ReactNode }) => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const Field = ({ label, value, icon }: { label: string; value: string; icon: ReactNode }) => (
  <label className="col" style={{ gap: '6px' }}>
    <span className="h2" style={{ fontSize: '14px' }}>{label}</span>
    <span className="inset" style={{ height: '46px', fontSize: '15px' }}>
      <b>{value}</b>
      <Icon d={icon} />
    </span>
  </label>
);

// Same look as Field, but the value can be typed (checkpoint 3: onboarding saves a real field).
const InField = ({ label, icon, ...p }: { label: string; icon: ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <label className="col" style={{ gap: '6px' }}>
    <span className="h2" style={{ fontSize: '14px' }}>{label}</span>
    <span className="inset" style={{ height: '46px', fontSize: '15px' }}>
      <input {...p} style={{ flex: 1, minWidth: 0, border: 0, background: 'transparent', font: 'inherit', fontWeight: 700, color: 'var(--ink)', outline: 'none' }} />
      <Icon d={icon} />
    </span>
  </label>
);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const CROP_KEY: Record<string, string> = { Wheat: 'wheat', Maize: 'maize', Rice: 'rice', Berseem: 'berseem', Cotton: 'cotton', 'Sugar beet': 'sugar beet', Other: 'other' };
const VAR_KEY: Record<string, string> = { 'Sakha 95': 'sakha95', 'Giza 171': 'giza171' };

const Arrow = () => (
  <span className="ar">
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  </span>
);
const BackIcon = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14.5 6-6 6 6 6" />
  </svg>
);

// Rework C: accuracy is computed from every answer (same points as the backend's fields.accuracy), every
// Level 2 / 3 answer is a real input, and ?edit=<field id> opens the same steps filled in to change a field.
const PROBLEMS = ['Thirst', 'Heat', 'Rust', 'Weeds', 'Insects', 'Salty soil', 'Standing water'];
const chipStyle = (on: boolean): React.CSSProperties => ({ minHeight: '44px', padding: '0 10px', border: 0, borderRadius: '12px', fontSize: '14px', fontWeight: 600,
  background: on ? '#17251C' : '#F4F4F1', color: on ? '#fff' : '#141A16' });
const KEY_CROP: Record<string, string> = Object.fromEntries(Object.entries(CROP_KEY).map(([k, v]) => [v, k]));
const KEY_VAR: Record<string, string> = Object.fromEntries(Object.entries(VAR_KEY).map(([k, v]) => [v, k]));

function Chips({ items, value, onPick, multi = false, cols = 4 }: { items: string[]; value: string | string[]; onPick: (v: any) => void; multi?: boolean; cols?: number }) {
  const on = (x: string) => (multi ? (value as string[]).includes(x) : value === x);
  return (
    <div className="grid keep-cols" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${cols >= 4 ? 96 : 120}px, 1fr))`, gap: '6px' }}>
      {items.map((x) => (
        <button key={x} type="button" className="press" aria-pressed={on(x)} style={chipStyle(on(x))}
          onClick={() => onPick(multi ? (on(x) ? (value as string[]).filter((y) => y !== x) : [...(value as string[]), x]) : x)}>{x}</button>
      ))}
    </div>
  );
}
function Seg({ items, value, onPick }: { items: [string, string][]; value: string; onPick: (v: string) => void }) {
  return (
    <div className="seg" style={{ alignSelf: 'flex-start', flexWrap: 'wrap' }}>
      {items.map(([k, l]) => <button key={k} type="button" className={'segb press' + (value === k ? ' on' : '')} aria-pressed={value === k} onClick={() => onPick(k)}>{l}</button>)}
    </div>
  );
}

export default function OnboardingScreen({ initialStep = 1, editId = '' }: { initialStep?: number; editId?: string }) {
  const tr = useT();
  const [step, setStep] = useState(initialStep);
  const go = (n: number) => { setStep(n); window.scrollTo(0, 0); };
  const mapRef = useRef<MapDrawHandle>(null);
  const [corners, setCorners] = useState<LatLon[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [q, setQ] = useState('');
  const [place, setPlace] = useState('');
  const [F, setF] = useState<any>({ name: '', crop: 'Wheat', variety: 'Sakha 95', sow: iso(new Date()), prev: '', water: '', irrigation: '',
    turn: '', nextTurn: iso(new Date(Date.now() + 10 * 86400000)), tenure: '', mesqa: '', y1: '', y2: '', y3: '', problems: [] as string[],
    pump: '', soil: '', wec: '', sensors: 'None' });
  const set = (o: any) => setF((x: any) => ({ ...x, ...o }));
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!editId);
  const [oldCenter, setOldCenter] = useState<LatLon | null>(null);

  // Edit: fill every step with the saved answers
  useEffect(() => {
    if (!editId) return;
    fetch(`${API}/fields/${editId}`, { credentials: 'include' }).then((r) => r.json()).then((f) => {
      const y = String(f.yields || '').split(',').map((s: string) => s.trim());
      setF({ name: f.name, crop: KEY_CROP[f.crop] || 'Wheat', variety: KEY_VAR[f.variety] || 'Other', sow: f.sow_date, prev: f.prev_crop ? f.prev_crop[0].toUpperCase() + f.prev_crop.slice(1) : '',
        water: f.water_kind || 'canal', irrigation: f.irrigation || 'flood', turn: String(f.turn_days || 10), nextTurn: f.next_turn || '', tenure: f.tenure || 'owner',
        mesqa: f.mesqa_position || 'middle', y1: y[0] || '', y2: y[1] || '', y3: y[2] || '', problems: f.problems || [], pump: f.pump_flow ? String(f.pump_flow) : '',
        soil: f.soil_ec ? String(f.soil_ec) : '', wec: f.water_ec ? String(f.water_ec) : '', sensors: f.sensors || 'None' });
      setPlace([f.village, f.governorate].filter(Boolean).join(', '));
      setOldCenter([f.lat, f.lon]);
      if (f.polygon) { setCorners(f.polygon); setTimeout(() => mapRef.current?.fit(f.polygon), 600); }
      else setTimeout(() => mapRef.current?.center([f.lat, f.lon], 17), 600);
      setLoaded(true);
    }).catch(() => setErr('Could not load this field.'));
  }, [editId]);

  const fed = areaM2(corners) / 4200.83;
  const hasField = (corners.length >= 3 && !drawing) || (!!editId && !!oldCenter && !drawing && corners.length === 0);
  const yields = [F.y1, F.y2, F.y3].filter((x: string) => x.trim()).join(', ');
  // Same points as backend fields.accuracy (location 30, drawn field 5, Level 1 2 each, Level 2 / 3 extras)
  const acc = Math.min(100, 30 + (corners.length >= 3 ? 5 : 0) + 2 * [F.crop, F.sow, F.prev, F.tenure, F.water, F.turn].filter(Boolean).length
    + (F.crop === 'Wheat' && VAR_KEY[F.variety] ? 5 : 0) + (yields ? 6 : 0) + (F.problems.length ? 3 : 0) + (F.mesqa ? 2 : 0)
    + (F.soil ? 12 : 0) + (F.wec ? 10 : 0) + (F.sensors && F.sensors !== 'None' ? 8 : 0));

  const find = async () => {
    if (!q.trim()) return;
    setErr('');
    const a = await mapRef.current?.search(q.trim());
    if (a) setPlace(a); else setErr('Could not find that place. Try the village and governorate.');
  };
  const save = async () => {
    setErr('');
    if (!hasField) { setErr('Draw your field on the map first.'); go(1); return; }
    if (!F.name.trim()) { setErr('Please give your field a name.'); go(1); return; }
    setSaving(true);
    const body = { name: F.name, polygon: corners.length >= 3 ? corners : null, place: place || q, crop: CROP_KEY[F.crop] || 'wheat',
      variety: VAR_KEY[F.variety] || null, sow_date: F.sow, prev_crop: (F.prev || '').toLowerCase(), mesqa: F.mesqa || 'middle', turn_days: Number(F.turn) || 10,
      next_turn: F.nextTurn || null, tenure: F.tenure || 'owner', water_kind: F.water || null, irrigation: F.irrigation || null, pump_flow: Number(F.pump) || null,
      yields: yields || null, problems: F.problems, soil_ec: Number(F.soil) || null, water_ec: Number(F.wec) || null,
      sensors: F.sensors !== 'None' ? F.sensors : null };
    try {
      const r = await fetch(`${API}/fields${editId ? '/' + editId : ''}`, { method: editId ? 'PUT' : 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(typeof j.detail === 'string' ? j.detail : 'Could not save. Check the answers.'); return; }
      window.location.assign(`/field/${j.id}`); // full load so the header and field chips include the change
    } catch { setErr('Can not reach Bezra. Check the internet.'); } finally { setSaving(false); }
  };
  const errBox = err ? <div role="alert" className="row" style={{ padding: '12px 14px', borderRadius: '12px', background: '#FBE3DC', color: '#8A2A12', fontSize: '14px' }}>{err}</div> : null;
  const level = acc >= 75 ? tr('High accuracy', 'دقة عالية') : acc > 40 ? tr('Medium accuracy', 'دقة متوسطة') : tr('Low accuracy', 'دقة قليلة');
  const accuracy = (
    <div className="col" aria-live="polite" style={{ gap: '8px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)' }}>
      <div className="row sp">
        <span style={{ fontSize: '15px', fontWeight: 600 }}>{level}</span>
        <b>{acc}{'%'}</b>
      </div>
      <span style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.7)', overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: acc + '%', borderRadius: '4px', background: '#F29B1E', transition: 'width .5s cubic-bezier(.16,1,.3,1)' }} />
      </span>
      <span className="tl">{'Accuracy grows with every answer'}</span>
    </div>
  );
  const sub = (t: string) => <span className="h2" style={{ fontSize: '14px' }}>{t}</span>;
  const nav = (back: ReactNode, next?: ReactNode) => (
    <div className="row wrap" style={{ gap: '8px', marginTop: 'auto' }}>
      {back}
      {step >= 2 ? <button type="button" className={'btn press' + (next ? ' soft' : ' cta')} style={next ? undefined : { flex: 1 }} onClick={save} disabled={saving || !loaded}>
        {saving ? 'Saving…' : editId ? 'Save changes' : next ? 'Save now' : 'Save and see my field'}{next ? null : <Arrow />}</button> : null}
      {next}
    </div>
  );
  const backBtn = (to: number) => <button type="button" className="btn soft press" onClick={() => go(to)}><BackIcon />{'Back'}</button>;
  const nextBtn = (to: number, label: string) => <button type="button" className="btn cta press" style={{ flex: 1 }} onClick={() => go(to)}>{label}<Arrow /></button>;
  const steps = [['Your field', 1], ['Basics', 2], ['More accurate', 3], ['Expert', 4]] as const;

  return (
    <>
      <div className="root">
        <div className="shell">
          <header className="top">
            <Link href="/" className="brand" aria-label="Bezra, home">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {'bezra'}
            </Link>
            <nav className="row ob-steps" style={{ gap: '12px', flex: '2', justifyContent: 'center' }} aria-label={`Step ${step} of 4`}>
              {steps.map(([label, n], i) => (
                <Fragment key={n}>
                  {i > 0 ? <span className="ob-sep" style={{ width: '40px', height: '2px', background: '#D7D8D2', borderRadius: '1px' }} /> : null}
                  <button type="button" className="row press ghost" aria-current={n === step ? 'step' : undefined} onClick={() => (n === 1 || hasField ? go(n) : setErr('Draw your field on the map first.'))}
                    style={{ gap: '8px', fontSize: '14px', fontWeight: 600, color: n <= step ? 'var(--ink)' : 'var(--muted)', border: 0, background: 'transparent', padding: 0 }}>
                    <span style={{ width: '26px', height: '26px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                      background: n < step ? 'var(--green)' : n === step ? 'var(--dark)' : '#fff', color: n <= step ? '#fff' : 'inherit' }}>
                      {n < step ? <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg> : String(n)}
                    </span>
                    <span className="ob-label">{label}</span>
                  </button>
                </Fragment>
              ))}
            </nav>
            <div className="tools">
              <Link href={editId ? `/field/${editId}` : '/profile'} className="btn soft sm press">{editId ? 'Cancel' : 'Skip for now'}</Link>
            </div>
          </header>
          <main className="grid ob-main">
            <section className="hero ob-map" style={{ background: '#D9D6C8' }}>
              <MapDraw ref={mapRef} start={[30.5535, 30.9891]} corners={corners} onCorners={setCorners} onDrawing={setDrawing} />
              <div className="float ob-bar" style={{ zIndex: 500, position: 'absolute', left: '12px', top: '12px', right: '12px', minHeight: '52px', padding: '6px 6px 6px 14px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />
                </svg>
                <input dir="auto" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') find(); }}
                  placeholder={tr('Shibin El Kom, Menoufia', 'شبين الكوم، المنوفية')} aria-label="Search your village" style={{ flex: '1 1 140px', minWidth: 0, fontSize: '15px', border: 0, background: 'transparent', outline: 'none', color: 'var(--ink)' }} />
                {drawing ? (
                  <>
                    <button type="button" className="btn soft sm press" onClick={() => mapRef.current?.undo()} disabled={!corners.length}>{'Undo'}</button>
                    <button type="button" className="btn sm press" onClick={() => mapRef.current?.finish()} disabled={corners.length < 3}>{corners.length >= 3 ? 'Finish' : `Tap ${3 - corners.length} more`}</button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn sm press" onClick={() => mapRef.current?.draw()}><Icon d={I.pencil} />{corners.length ? 'Redraw' : 'Draw'}</button>
                    <button type="button" className="btn soft sm press" onClick={() => mapRef.current?.pin()}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                      </svg>
                      {'Drop pin'}
                    </button>
                  </>
                )}
              </div>
              <div className="float" style={{ zIndex: 500, position: 'absolute', left: '12px', bottom: '12px', padding: '12px 16px', display: 'flex', gap: '22px' }}>
                <span className="col">
                  <span className="tl">{'Area'}</span>
                  <b style={{ fontSize: '22px', fontWeight: 600 }}>{corners.length >= 3 ? fed.toFixed(1) : '–'}<small className="unit">{' feddan'}</small></b>
                </span>
                <span className="col">
                  <span className="tl">{'Same as'}</span>
                  <b style={{ fontSize: '22px', fontWeight: 600 }}>{corners.length >= 3 ? (fed * 0.42).toFixed(1) : '–'}<small className="unit">{' ha'}</small></b>
                </span>
              </div>
            </section>

            <section key={step} className="col" style={{ gap: '16px', padding: '24px', borderRadius: 'var(--r-hero)', background: '#fff' }}>
              {step === 1 ? (
                <>
                  <Bubble en={editId ? 'Your field' : 'Where is your field?'} ar={editId ? 'أرضك' : 'فين أرضك؟'} sub={editId ? 'Redraw the edges if they changed' : 'Find your field, then draw its edges'} />
                  <div className="col" style={{ gap: '8px' }}>
                    {sub('How to draw it')}
                    {['Search your village, or zoom the map to your field.', 'Tap Draw, then tap each corner of your field. Undo removes the last one.',
                      'Tap Finish (or the first corner). Drag any corner to fix it.'].map((t, i) => (
                      <div key={i} className="inset" style={{ justifyContent: 'flex-start', gap: '12px', fontSize: '14px' }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--ink2)', flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ color: 'var(--ink)' }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InField label="Field name" value={F.name} placeholder="e.g. Home plot" onChange={(e) => set({ name: e.target.value })} maxLength={40} icon={I.pencil} />
                    <Field label="Area" value={corners.length >= 3 ? fed.toFixed(1) + ' feddan' : editId ? 'Kept as saved' : 'Draw it first'} icon={I.list} />
                  </div>
                  <div className="row" style={{ gap: '12px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)', color: '#5A3B0B', fontSize: '14px', lineHeight: 1.45 }}>
                    {'Bezra uses the edges to read NASA data for your field only, square by square.'}
                  </div>
                  {errBox}
                  {nav(<Link href="/" className="btn soft press"><BackIcon />{'Back'}</Link>,
                    <button type="button" className="btn cta press" style={{ flex: 1 }} onClick={() => { if (!hasField) setErr('Draw your field on the map first.'); else if (!F.name.trim()) setErr('Please give your field a name.'); else { setErr(''); go(2); } }}>{'Next: the basics'}<Arrow /></button>)}
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <Bubble en="What did you plant?" ar="قولي زرعت إيه؟" sub="Level 1 of 3, about 2 minutes" />
                  <div className="col" style={{ gap: '8px' }}>{sub('Crop this season')}<Chips items={['Wheat', 'Maize', 'Rice', 'Berseem', 'Cotton', 'Sugar beet', 'Other']} value={F.crop} onPick={(v) => set({ crop: v })} /></div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InField label="Sowing date" type="date" value={F.sow} onChange={(e) => set({ sow: e.target.value })} icon={I.cal} />
                    <InField label="Last crop" value={F.prev} placeholder="e.g. Maize" onChange={(e) => set({ prev: e.target.value })} maxLength={20} icon={I.sprout} />
                    <InField label="Water turn every (days)" type="number" min={3} max={30} placeholder="e.g. 10" value={F.turn} onChange={(e) => set({ turn: e.target.value })} icon={I.drop} />
                    <InField label="Next turn" type="date" value={F.nextTurn} onChange={(e) => set({ nextTurn: e.target.value })} icon={I.cal} />
                  </div>
                  <div className="col" style={{ gap: '8px' }}>{sub('Water comes from')}<Seg items={[['canal', 'Canal, mesqa'], ['well', 'Well'], ['both', 'Both']]} value={F.water} onPick={(v) => set({ water: v })} /></div>
                  <div className="col" style={{ gap: '8px' }}>{sub('You are')}<Seg items={[['owner', 'Owner'], ['tenant', 'Tenant']]} value={F.tenure} onPick={(v) => set({ tenure: v })} /></div>
                  {accuracy}
                  {errBox}
                  {nav(backBtn(1), nextBtn(3, 'Next: sharper advice'))}
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <Bubble en="Want sharper advice?" ar="عايز نصايح أدق؟" sub="Level 2 of 3, optional, about 2 minutes" />
                  {F.crop === 'Wheat' ? <div className="col" style={{ gap: '8px' }}>{sub('Variety')}<Chips items={['Sakha 95', 'Giza 171', 'Misr 3', 'Other']} value={F.variety} onPick={(v) => set({ variety: v })} /></div> : null}
                  <div className="col" style={{ gap: '8px' }}>
                    {sub('Your last 3 harvests (ardeb per feddan)')}
                    <div className="grid keep-cols" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' }}>
                      {(['y1', 'y2', 'y3'] as const).map((k, i) => <InField key={k} label={['Last year', '2 years ago', '3 years ago'][i]} type="number" min={0} max={40} value={F[k]} onChange={(e) => set({ [k]: e.target.value })} icon={I.list} />)}
                    </div>
                  </div>
                  <div className="col" style={{ gap: '8px' }}>{sub('Problems you had before (tap all that apply)')}<Chips items={PROBLEMS} value={F.problems} multi onPick={(v) => set({ problems: v })} /></div>
                  <div className="col" style={{ gap: '8px' }}>{sub('Where is your field on the mesqa?')}<Seg items={[['head', 'Head'], ['middle', 'Middle'], ['tail', 'Tail']]} value={F.mesqa} onPick={(v) => set({ mesqa: v })} /></div>
                  <div className="col" style={{ gap: '8px' }}>{sub('How do you water?')}<Seg items={[['flood', 'Flood'], ['furrow', 'Furrows'], ['drip', 'Drip or sprinkler']]} value={F.irrigation} onPick={(v) => set({ irrigation: v })} /></div>
                  <InField label="Pump flow, m³ per hour (if you know it)" type="number" min={0} max={500} placeholder="e.g. 40" value={F.pump} onChange={(e) => set({ pump: e.target.value })} icon={I.drop} />
                  <span className="tl">{'With the pump flow, Bezra can tell you watering in hours, not only m³.'}</span>
                  {accuracy}
                  {errBox}
                  {nav(backBtn(2), nextBtn(4, 'Next: expert'))}
                </>
              ) : null}

              {step === 4 ? (
                <>
                  <Bubble en="Do you have a soil test?" ar="عندك تحليل تربة؟" sub="Level 3 of 3, optional" />
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InField label="Lab soil test, ECe (dS/m)" type="number" step="0.1" min={0} max={30} placeholder="Not yet" value={F.soil} onChange={(e) => set({ soil: e.target.value })} icon={I.flask} />
                    <InField label="Water EC (dS/m)" type="number" step="0.1" min={0} max={20} placeholder="Not yet" value={F.wec} onChange={(e) => set({ wec: e.target.value })} icon={I.drop} />
                  </div>
                  <div className="col" style={{ gap: '8px' }}>{sub('Sensors in the field')}<Chips items={['None', 'Soil moisture', 'Weather station']} value={F.sensors} onPick={(v) => set({ sensors: v })} cols={3} /></div>
                  <div className="row" style={{ gap: '12px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)', color: '#5A3B0B', fontSize: '14px', lineHeight: 1.45 }}>
                    <>{"Don't have these? That's fine. "}<EngName />{' can add them after a visit.'}</>
                  </div>
                  {accuracy}
                  {errBox}
                  {nav(backBtn(3))}
                </>
              ) : null}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
