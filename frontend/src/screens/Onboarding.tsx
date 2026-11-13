'use client';
/* eslint-disable */
// From design/html/V11-Onboarding.html (layout and copy 1:1 for step 2, "Basics").
// Steps 1, 3 and 4 of the design's own step bar are built from the same parts:
// map panel, mascot speech bubble, inset fields, chips, segmented controls, accuracy card, CTA row.
import { Fragment, type ReactNode } from 'react';
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

const Bubble = ({ ar, sub }: { ar: string; sub: string }) => (
  <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
    <Mascot />
    <div className="col" style={{ gap: '6px', padding: '12px 16px', borderRadius: '6px 18px 18px 18px', background: 'var(--inset)' }}>
      <span className="ar-t" lang="ar" dir="rtl" style={{ fontSize: '18px', fontWeight: '600' }}>{ar}</span>
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
  const __v = useDC(Logic, { initialStep });
  const step: number = __v.step;

  const accuracy = (
    <div className="col" style={{ gap: '8px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)' }}>
      <div className="row sp">
        <span className="ar-t" lang="ar" dir="rtl" style={{ fontSize: '15px', fontWeight: '600' }}>{__s(__v?.accAr)}</span>
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
              <Link href="/field/north-plot" className="btn soft sm press">
                {'Skip for now'}
              </Link>
            </div>
          </header>
          <main className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 560px', alignItems: 'stretch', minHeight: '760px' }}>
            <section className="hero rise" style={{ '--d': '1', background: '#D9D6C8' } as any}>
              <i className="sk map" aria-hidden="true" style={{ '--d': '1' } as any} />
              <svg viewBox="0 0 800 760" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: '0' }} aria-label="Satellite map with your field drawn as a polygon" role="img">
                <rect x="0" y="0" width="180" height="300" fill="#8C9C5A" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="180" y="0" width="140" height="260" fill="#5A7A3C" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="320" y="0" width="240" height="200" fill="#B1A584" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="560" y="0" width="240" height="320" fill="#8FA05B" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="0" y="300" width="220" height="460" fill="#628342" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="220" y="260" width="120" height="500" fill="#B6AC8E" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="340" y="200" width="240" height="300" fill="#8C9C5A" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="580" y="320" width="220" height="440" fill="#4E6E36" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="340" y="500" width="240" height="260" fill="#95A463" stroke="#D8D1BA" strokeWidth="1" />
                <path d="M0 640C200 610 420 700 800 650" stroke="#3B6E8F" strokeWidth="12" fill="none" />
                <path className="draw" pathLength="1" style={{ '--d': '2' } as any} d="M360 220L560 210 572 480 352 492Z" fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
                <path d="M360 220L560 210 572 480 352 492Z" fill="#F29B1E" fillOpacity=".22" className="fade" style={{ '--d': '5' } as any} />
                <circle className="pop" style={{ '--i': '0' } as any} cx="360" cy="220" r="8" fill="#fff" stroke="#141A16" strokeWidth="2.5" />
                <circle className="pop" style={{ '--i': '3' } as any} cx="560" cy="210" r="8" fill="#fff" stroke="#141A16" strokeWidth="2.5" />
                <circle className="pop" style={{ '--i': '6' } as any} cx="572" cy="480" r="8" fill="#fff" stroke="#141A16" strokeWidth="2.5" />
                <circle className="pop" style={{ '--i': '9' } as any} cx="352" cy="492" r="8" fill="#fff" stroke="#141A16" strokeWidth="2.5" />
              </svg>
              <div className="float" style={{ position: 'absolute', left: '18px', top: '18px', right: '18px', height: '52px', padding: '0 8px 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />
                </svg>
                <span className="ar-t" style={{ flex: '1', fontSize: '15px', color: 'var(--muted)' }}>{'شبين الكوم، المنوفية'}</span>
                <button type="button" className="btn sm press">
                  <Icon d={I.pencil} />
                  {'Draw'}
                </button>
                <button type="button" className="btn soft sm press">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                  </svg>
                  {'Drop pin'}
                </button>
              </div>
              <div className="float rise" style={{ '--d': '6', position: 'absolute', left: '18px', bottom: '18px', padding: '14px 18px', display: 'flex', gap: '22px' } as any}>
                <span className="col">
                  <span className="tl">{'Area'}</span>
                  <b style={{ fontSize: '22px', fontWeight: '600' }}>{'2.4'}<small className="unit">{' feddan'}</small></b>
                </span>
                <span className="col">
                  <span className="tl">{'Same as'}</span>
                  <b style={{ fontSize: '22px', fontWeight: '600' }}>{'1.0'}<small className="unit">{' ha'}</small></b>
                </span>
              </div>
            </section>

            <section key={step} className="col rise" style={{ '--d': '2', gap: '18px', padding: '26px', borderRadius: 'var(--r-hero)', background: '#fff' } as any}>
              {step === 1 ? (
                <>
                  <Bubble ar="فين أرضك؟" sub="Find your field, then draw its edges" />
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
                    <Field label="Field name" value="North plot" icon={I.pencil} />
                    <Field label="Area" value="2.4 feddan" icon={I.list} />
                  </div>
                  <div className="row" style={{ gap: '12px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)', color: '#5A3B0B', fontSize: '14px', lineHeight: '1.45' }}>
                    {'Bezra uses the edges to read NASA data for your field only, square by square.'}
                  </div>
                  {actions(
                    <Link href="/" className="btn soft press"><BackIcon />{'Back'}</Link>,
                    <button type="button" className="btn cta press" style={{ flex: '1' }} onClick={__v.goStep(2)}>{'Next: the basics'}<Arrow /></button>,
                  )}
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <Bubble ar="قولي زرعت إيه؟" sub="Level 1 of 3, about 2 minutes" />
                  <div className="col" style={{ gap: '8px' }}>
                    <span className="h2">{'Crop this season'}</span>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {((__v?.crops) || []).map((c: any, i0: number) => (
                        <button key={i0} type="button" className="press" onClick={c?.pick} aria-pressed={__s(c?.p) as any} style={__css(c?.style)}>{__s(c?.label)}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <Field label="Sowing date" value="15 October" icon={I.cal} />
                    <Field label="Last crop" value="Maize" icon={I.sprout} />
                    <Field label="Water source" value="Canal, mesqa" icon={I.drop} />
                    <Field label="Next turn" value="Thursday 19 Nov" icon={I.cal} />
                  </div>
                  <div className="col" style={{ gap: '8px' }}>
                    <span className="h2" style={{ fontSize: '14px' }}>{'You are'}</span>
                    <div className="seg" style={{ alignSelf: 'flex-start' }}>
                      <button type="button" className={__v.tenure.owner.cls} onClick={__v.tenure.owner.pick} aria-pressed={__v.tenure.owner.p}>{'Owner'}</button>
                      <button type="button" className={__v.tenure.tenant.cls} onClick={__v.tenure.tenant.pick} aria-pressed={__v.tenure.tenant.p}>{'Tenant'}</button>
                    </div>
                  </div>
                  {accuracy}
                  {actions(
                    backBtn(1),
                    <Link href="/field/north-plot" className="btn cta press" style={{ flex: '1' }}>{'Save and see my field'}<Arrow /></Link>,
                  )}
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <Bubble ar="عايز نصايح أدق؟" sub="Level 2 of 3, optional, about 2 minutes" />
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
                  <Bubble ar="عندك تحليل تربة؟" sub="Level 3 of 3, optional" />
                  <div className="col" style={{ gap: '10px' }}>
                    <Field label="Lab soil test (ECe)" value="Not yet" icon={I.flask} />
                    <Field label="Water EC" value="Not yet" icon={I.drop} />
                    <Field label="Sensors" value="None" icon={I.chip} />
                  </div>
                  <div className="row" style={{ gap: '12px', padding: '14px', borderRadius: '12px', background: 'var(--sun-tint)', color: '#5A3B0B', fontSize: '14px', lineHeight: '1.45' }}>
                    {"Don't have these? That's fine. Eng. Mona can add them after a visit."}
                  </div>
                  {accuracy}
                  {actions(
                    backBtn(3),
                    <Link href="/field/north-plot" className="btn cta press" style={{ flex: '1' }}>{'Save and see my field'}<Arrow /></Link>,
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
