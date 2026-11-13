'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// From design/html/V11-Onboarding.html (layout and copy 1:1 for step 2, "Basics").
// Steps 1, 3 and 4 of the design's own step bar are built from the same parts:
// map panel, mascot speech bubble, inset fields, chips, segmented controls, accuracy card, CTA row.
import { Fragment, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { MapDrawHandle, LatLon } from '@/components/MapDraw';
import { areaM2 } from '@/components/MapDraw';
import { API } from '@/lib/api';

const MapDraw = dynamic(() => import('@/components/MapDraw'), { ssr: false });
import { useField, FieldWho, EngName } from '@/lib/field';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Logic from './Onboarding.logic';

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

export default function OnboardingScreen({ initialStep = 1 }: { initialStep?: number }) {
  const tr = useT();
  const { fp } = useField();
  const __v = useDC(Logic, { initialStep });
  const step: number = __v.step;
  const mapRef = useRef<MapDrawHandle>(null);
  const [corners, setCorners] = useState<LatLon[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [q, setQ] = useState('');
  const [place, setPlace] = useState('');
  const [name, setName] = useState('');
  const [sow, setSow] = useState(iso(new Date()));
  const [prev, setPrev] = useState('Maize');
  const [nextTurn, setNextTurn] = useState(iso(new Date(Date.now() + 10 * 86400000)));
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const fed = areaM2(corners) / 4200.83;
  const hasField = corners.length >= 3 && !drawing;
  const find = async () => {
    if (!q.trim()) return;
    setErr('');
    const a = await mapRef.current?.search(q.trim());
    if (a) setPlace(a); else setErr('Could not find that place. Try the village and governorate.');
  };
  const save = async () => {
    setErr('');
    if (!hasField) { setErr('Draw your field on the map first.'); return; }
    setSaving(true);
    try {
      const r = await fetch(`${API}/fields`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, polygon: corners, place: place || q, crop: CROP_KEY[__v.crop] || 'wheat', variety: VAR_KEY[__v.variety] || null,
          sow_date: sow, prev_crop: prev.toLowerCase(), mesqa: __v.mesqaPick, next_turn: nextTurn || null, tenure: __v.tenurePick }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(typeof j.detail === 'string' ? j.detail : 'Could not save. Check the answers.'); return; }
      window.location.assign(`/field/${j.id}`); // full load so the header and field chips include the new field
    } catch { setErr('Can not reach Bezra. Check the internet.'); } finally { setSaving(false); }
  };
  const errBox = err ? <div role="alert" className="row" style={{ padding: '12px 14px', borderRadius: '12px', background: '#FBE3DC', color: '#8A2A12', fontSize: '14px' }}>{err}</div> : null;

  const accuracy = (
    <div className="col" style={{ gap: '8px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)' }}>
      <div className="row sp">
        <span style={{ fontSize: '15px', fontWeight: '600' }}>{__v.acc >= 75 ? tr('High accuracy', 'دقة عالية') : __v.acc > 40 ? tr('Medium accuracy', 'دقة متوسطة') : tr('Low accuracy', 'دقة قليلة')}</span>
        <b>{__s(__v?.acc)}{'%'}</b>
      </div>
      <span style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,.7)', overflow: 'hidden' }}>
        <span style={__css(__v?.accBar)} />
      </span>
      <span className="tl">{'Accuracy grows with every answer'}</span>
    </div>
  );

  const actions = (back: ReactNode, next: ReactNode) => (
    <div className="row" style={{ gap: '8px', marginTop: 'auto' }}>
      {back}
      {next}
    </div>
  );
  const backBtn = (to: number) => (
    <button type="button" className="btn soft press" onClick={__v.goStep(to)}>
      <BackIcon />
      {'Back'}
    </button>
  );

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
            <div className="row rise" style={{ '--d': '0', gap: '12px', flex: '2', justifyContent: 'center' } as any} aria-label={`Step ${step} of 4`}>
              {(__v.steps as any[]).map((st, i) => (
                <Fragment key={st.n}>
                  {i > 0 ? <span style={{ width: '40px', height: '2px', background: '#D7D8D2', borderRadius: '1px' }} /> : null}
                  <span className="row" aria-current={st.cur ? 'step' : undefined} style={{ gap: '8px', fontSize: '14px', fontWeight: '600', color: st.textColor }}>
                    <span style={__css(st.dot)}>
                      {st.done ? (
                        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      ) : (
                        String(st.n)
                      )}
                    </span>
                    {st.label}
                  </span>
                </Fragment>
              ))}
            </div>
            <div className="tools">
              <Link href={fp("")} className="btn soft sm press">
                {'Skip for now'}
              </Link>
            </div>
          </header>
          <main className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 560px', alignItems: 'stretch', minHeight: '760px' }}>
            <section className="hero rise" style={{ '--d': '1', background: '#D9D6C8' } as any}>
              <MapDraw ref={mapRef} start={[30.5535, 30.9891]} corners={corners} onCorners={setCorners} onDrawing={setDrawing} />
              <div className="float" style={{ zIndex: 500, position: 'absolute', left: '18px', top: '18px', right: '18px', height: '52px', padding: '0 8px 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />
                </svg>
                <input dir="auto" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') find(); }}
                  placeholder={tr('Shibin El Kom, Menoufia', 'شبين الكوم، المنوفية')} aria-label="Search your village" style={{ flex: '1', minWidth: 0, fontSize: '15px', border: 0, background: 'transparent', outline: 'none', color: 'var(--ink)' }} />
                <button type="button" className="btn sm press" aria-pressed={drawing} onClick={() => { if (!drawing) mapRef.current?.draw(); }}>
                  <Icon d={I.pencil} />
                  {drawing ? (corners.length >= 3 ? 'Tap first corner' : 'Tap corners') : 'Draw'}
                </button>
                <button type="button" className="btn soft sm press" onClick={() => mapRef.current?.pin()}>
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                  </svg>
                  {'Drop pin'}
                </button>
              </div>
              <div className="float rise" style={{ '--d': '6', zIndex: 500, position: 'absolute', left: '18px', bottom: '18px', padding: '14px 18px', display: 'flex', gap: '22px' } as any}>
                <span className="col">
                  <span className="tl">{'Area'}</span>
                  <b style={{ fontSize: '22px', fontWeight: '600' }}>{hasField ? fed.toFixed(1) : '–'}<small className="unit">{' feddan'}</small></b>
                </span>
                <span className="col">
                  <span className="tl">{'Same as'}</span>
                  <b style={{ fontSize: '22px', fontWeight: '600' }}>{hasField ? (fed * 0.42).toFixed(1) : '–'}<small className="unit">{' ha'}</small></b>
                </span>
              </div>
            </section>

            <section key={step} className="col rise" style={{ '--d': '2', gap: '18px', padding: '26px', borderRadius: 'var(--r-hero)', background: '#fff' } as any}>
              {step === 1 ? (
                <>
                  <Bubble en="Where is your field?" ar="فين أرضك؟" sub="Find your field, then draw its edges" />
                  <div className="col" style={{ gap: '8px' }}>
                    <span className="h2">{'How to draw it'}</span>
                    {[
                      'Search your village, or zoom the map to your field.',
                      'Tap Draw, then tap each corner of your field.',
                      'Check the area. Drag a corner to fix it.',
                    ].map((t, i) => (
                      <div key={i} className="inset" style={{ justifyContent: 'flex-start', gap: '12px', fontSize: '14px' }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'var(--ink2)', flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ color: 'var(--ink)' }}>{t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InField label="Field name" value={name} placeholder="e.g. Home plot" onChange={(e) => setName(e.target.value)} maxLength={40} icon={I.pencil} />
                    <Field label="Area" value={hasField ? fed.toFixed(1) + ' feddan' : 'Draw it first'} icon={I.list} />
                  </div>
                  <div className="row" style={{ gap: '12px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)', color: '#5A3B0B', fontSize: '14px', lineHeight: '1.45' }}>
                    {'Bezra uses the edges to read NASA data for your field only, square by square.'}
                  </div>
                  {errBox}
                  {actions(
                    <Link href="/" className="btn soft press"><BackIcon />{'Back'}</Link>,
                    <button type="button" className="btn cta press" style={{ flex: '1' }} onClick={() => { if (hasField) { setErr(''); __v.goStep(2)(); } else setErr('Draw your field on the map first.'); }}>{'Next: the basics'}<Arrow /></button>,
                  )}
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <Bubble en="What did you plant?" ar="قولي زرعت إيه؟" sub="Level 1 of 3, about 2 minutes" />
                  <div className="col" style={{ gap: '8px' }}>
                    <span className="h2">{'Crop this season'}</span>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {((__v?.crops) || []).map((c: any, i0: number) => (
                        <button key={i0} type="button" className="press" onClick={c?.pick} aria-pressed={__s(c?.p) as any} style={__css(c?.style)}>{__s(c?.label)}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InField label="Sowing date" type="date" value={sow} onChange={(e) => setSow(e.target.value)} icon={I.cal} />
                    <InField label="Last crop" value={prev} onChange={(e) => setPrev(e.target.value)} maxLength={20} icon={I.sprout} />
                    <Field label="Water source" value="Canal, mesqa" icon={I.drop} />
                    <InField label="Next turn" type="date" value={nextTurn} onChange={(e) => setNextTurn(e.target.value)} icon={I.cal} />
                  </div>
                  <div className="col" style={{ gap: '8px' }}>
                    <span className="h2" style={{ fontSize: '14px' }}>{'You are'}</span>
                    <div className="seg" style={{ alignSelf: 'flex-start' }}>
                      <button type="button" className={__v.tenure.owner.cls} onClick={__v.tenure.owner.pick} aria-pressed={__v.tenure.owner.p}>{'Owner'}</button>
                      <button type="button" className={__v.tenure.tenant.cls} onClick={__v.tenure.tenant.pick} aria-pressed={__v.tenure.tenant.p}>{'Tenant'}</button>
                    </div>
                  </div>
                  {accuracy}
                  {errBox}
                  {actions(
                    backBtn(1),
                    <button type="button" className="btn cta press" style={{ flex: '1' }} onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save and see my field'}<Arrow /></button>,
                  )}
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <Bubble en="Want sharper advice?" ar="عايز نصايح أدق؟" sub="Level 2 of 3, optional, about 2 minutes" />
                  <div className="col" style={{ gap: '8px' }}>
                    <span className="h2">{'Variety'}</span>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {((__v?.varieties) || []).map((c: any, i0: number) => (
                        <button key={i0} type="button" className="press" onClick={c?.pick} aria-pressed={__s(c?.p) as any} style={__css(c?.style)}>{__s(c?.label)}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <Field label="Last 3 yields" value="18, 17, ? ardeb" icon={I.list} />
                    <Field label="Past problems" value="Thirst 2024" icon={I.alert} />
                  </div>
                  <div className="col" style={{ gap: '8px' }}>
                    <span className="h2" style={{ fontSize: '14px' }}>{'Where is your field on the mesqa?'}</span>
                    <div className="seg" style={{ alignSelf: 'flex-start' }}>
                      <button type="button" className={__v.mesqa.head.cls} onClick={__v.mesqa.head.pick} aria-pressed={__v.mesqa.head.p}>{'Head'}</button>
                      <button type="button" className={__v.mesqa.middle.cls} onClick={__v.mesqa.middle.pick} aria-pressed={__v.mesqa.middle.p}>{'Middle'}</button>
                      <button type="button" className={__v.mesqa.tail.cls} onClick={__v.mesqa.tail.pick} aria-pressed={__v.mesqa.tail.p}>{'Tail'}</button>
                    </div>
                  </div>
                  {accuracy}
                  {actions(
                    backBtn(2),
                    <button type="button" className="btn cta press" style={{ flex: '1' }} onClick={__v.goStep(4)}>{'Save and continue'}<Arrow /></button>,
                  )}
                </>
              ) : null}

              {step === 4 ? (
                <>
                  <Bubble en="Do you have a soil test?" ar="عندك تحليل تربة؟" sub="Level 3 of 3, optional" />
                  <div className="col" style={{ gap: '10px' }}>
                    <Field label="Lab soil test (ECe)" value="Not yet" icon={I.flask} />
                    <Field label="Water EC" value="Not yet" icon={I.drop} />
                    <Field label="Sensors" value="None" icon={I.chip} />
                  </div>
                  <div className="row" style={{ gap: '12px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)', color: '#5A3B0B', fontSize: '14px', lineHeight: '1.45' }}>
                    <>{"Don't have these? That's fine. "}<EngName />{" can add them after a visit."}</>
                  </div>
                  {accuracy}
                  {actions(
                    backBtn(3),
                    <Link href={fp("")} className="btn cta press" style={{ flex: '1' }}>{'Save and see my field'}<Arrow /></Link>,
                  )}
                </>
              ) : null}
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
