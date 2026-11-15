'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// Generated from design/html/V11-Field.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Field.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho, UserName, UserInitials, EngineerTab, useUser, useDemo } from '@/lib/field';
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { LangSwitch } from '@/lib/i18n';
import { useApi } from '@/lib/api';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Field.logic';
import { useFieldPhoto } from '@/lib/fieldPhoto';
import TodayBoard from '@/components/TodayBoard';

export default function FieldScreen() {
  const { fp, id } = useField();
  // the farmer's own fields as chips (#01, #02, ...): the current field's owner
  const { fields: allFields } = useUser();
  const owner = allFields.find((f) => f.id === id)?.farmer;
  const chipFields = owner ? allFields.filter((f) => f.farmer === owner).slice(0, 3) : [] as any[];
  const summary = useApi(`/fields/${id}/summary`);
  const ndvi = useApi(`/fields/${id}/ndvi`);
  const health = useApi(`/fields/${id}/health`);
  // Real satellite photo under the squares (lib/fieldPhoto.ts).
  const { photo, outline } = useFieldPhoto(id);
  const demo = useDemo();
  const __v = useDC(Logic, { demo, data: summary.data, loading: summary.loading, fieldId: id, ndvi: ndvi.data, health: health.data });
  return (
    <>
      <div className="root">
        <div className="shell">
          <header className="top">
            <Link href={fp("")} className="brand" aria-label="Bezra, my field">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <nav aria-label="Main" className="nav">
              <Link href={fp("")} aria-current="page" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                </svg>
                {"My field"}
              </Link>
              <Link href="/sim" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v2M18 4v4M6 20v-2M3 7l3-3 3 3M15 7l3-3 3 3" />
                </svg>
                {"Simulator"}
              </Link>
              <Link href="/ask" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 18.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8.5zM9 9h6M9 12h3" />
                </svg>
                {"Ask Bezra"}
              </Link>
              <Link href="/profile" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0" />
                </svg>
                {"Profile"}
              </Link>
              <EngineerTab />
            </nav>
            <div className="tools">
              <LangSwitch />
<DataLive />
              <div role="group" aria-label="Detail level" className="seg">
                <button type="button" className={__s(__v?.segS) as any} onClick={__v?.pickS} aria-pressed={__s(__v?.isS) as any}>
                  {"Simple"}
                </button>
                <button type="button" className={__s(__v?.segD) as any} onClick={__v?.pickD} aria-pressed={__s(__v?.isD) as any}>
                  {"Details"}
                </button>
              </div>
              <Link href={fp("/alerts")} className="ibtn press" aria-label="Alerts, 2 new">
                <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
                </svg>
                <span className="dot" />
              </Link>
              <span className="who">
                <span className="av" aria-hidden="true">
                  <UserInitials />
                </span>
                <span>
                  <b>
                    <UserName />
                  </b>
                  <small>
                    <FieldWho />
                  </small>
                </span>
              </span>
            </div>
          </header>
          <main className="main">
            <div className="head">
              <div className="col rise" style={{"--d":"0","gap":"6px"} as any}>
                <span className="eyebrow">
                  {__v.T.eyebrow}
                </span>
                <h1 className="h1">
                  {__v.T.hello}
                </h1>
              </div>
              <div role="list" aria-label="Your fields" className="row rise" style={{"--d":"1","gap":"8px"} as any}>
                {chipFields.map((ff, k) => (
                <Link key={ff.id} href={`/field/${ff.id}`} className="press lift" aria-current={id === ff.id} style={{"height":"64px","paddingBlock":"0","paddingInline":"14px 8px","boxSizing":"border-box","borderRadius":"12px","background":"#fff","display":"flex","alignItems":"center","gap":"14px","boxShadow":id === ff.id ? "0 0 0 2px #141A16" : "0 1px 2px rgba(20,26,22,.05)"} as any}>
                  <span className="col" style={{"gap":"1px"} as any}>
                    <span className="tl" style={{"fontWeight":"600"} as any}>
                      {"#" + (ff.num || String(k + 1).padStart(2, "0"))}
                    </span>
                    <span style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {ff.name}
                    </span>
                    <span className="tl">
                      {`${ff.area_feddan} feddan, ${ff.crop.toLowerCase()}`}
                    </span>
                  </span>
                  <svg aria-hidden="true" width="56" height="44" viewBox="0 0 64 48" style={{"borderRadius":"8px"} as any}>
                    <rect width="64" height="48" fill="#8C9C5A" />
                    <rect width="18" height="48" fill="#5A7A3C" />
                    <rect x="48" width="16" height="48" fill="#B1A584" />
                    <rect x="21" y="9" width="24" height="30" fill="#fff" fillOpacity=".2" stroke="#fff" strokeWidth="2" />
                  </svg>
                </Link>
                ))}
                <Link href="/onboarding" className="press ghost" aria-label="Add a field" style={{"width":"64px","height":"64px","boxSizing":"border-box","borderRadius":"12px","border":"1.5px dashed #C3C6BF","display":"flex","alignItems":"center","justifyContent":"center"} as any}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </Link>
              </div>
            </div>
            <nav aria-label="Field sections" className="tabs rise" style={{"--d":"0"} as any}>
              <Link href={fp("")} aria-current="page">
                {"Today"}
              </Link>
              <Link href={fp("/plan")}>
                {"Season plan"}
              </Link>
              <Link href={fp("/health")}>
                {"Field health"}
              </Link>
              <Link href={fp("/calendar")}>
                {"Calendar"}
              </Link>
              <Link href={fp("/next")}>
                {"Next season"}
              </Link>
              <Link href={fp("/alerts")}>
                {"Alerts"}
              </Link>
            </nav>
            <TodayBoard id={id} details={!!__v?.details} map={(
            <section data-tour="map" aria-labelledby="hero-h" className="hero rise" style={{"--d":"2","minHeight":"520px","background":"#D9D6C8"} as any}>
              <i className={__v.skMap} aria-hidden="true" style={{"--d":"2"} as any} />
              <h2 id="hero-h" className="vh">
                {"Your field from above"}
              </h2>
              {" "}
              <svg role="img" aria-label={__s(__v?.mapLabel) as any} width="100%" height="100%" viewBox="0 0 1360 520" preserveAspectRatio="xMidYMid slice" style={{"position":"absolute","inset":"0"} as any}>
                {" "}
                <defs>
                  {" "}
                  <pattern id="rows" width="5" height="5" patternUnits="userSpaceOnUse">
                    <path d="M2.5 0V5" stroke="#000" strokeWidth="1" />
                  </pattern>
                  {" "}
                  <pattern id="nfhatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="6" height="6" fill="#D6D6D1" />
                    <path d="M0 0V6" stroke="#9A9A93" strokeWidth="1.6" />
                  </pattern>
                  <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="7" height="7" fill="#F29B1E" />
                    <path d="M0 0V7" stroke="#FFFFFF" strokeOpacity=".45" strokeWidth="2.5" />
                  </pattern>
                  {" "}
                  <linearGradient id="fadeB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset=".55" stopColor="#F4F4F1" stopOpacity="0" />
                    <stop offset="1" stopColor="#F4F4F1" stopOpacity=".55" />
                  </linearGradient>
                  {" "}
                  <filter id="grain" x="0" y="0" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" />
                    <feColorMatrix type="saturate" values="0" />
                    <feComponentTransfer>
                      <feFuncA type="table" tableValues="0 .5" />
                    </feComponentTransfer>
                  </filter>
                  {" "}
                </defs>
                {" "}
                {photo ? <image href={photo} x="0" y="0" width="1360" height="520" preserveAspectRatio="none" /> : (<><g transform={photo ? undefined : "rotate(-9 680 260)"}>
                  {" "}
                  <g stroke="#D8D1BA" strokeWidth="1.1" strokeOpacity=".8">
                    {((__v?.parcels) || []).map((p: any, i0: number) => (
                      <Fragment key={i0}>
                        <rect x={__s(p?.x) as any} y={__s(p?.y) as any} width={__s(p?.w) as any} height={__s(p?.h) as any} fill={__s(p?.fill) as any} />
                      </Fragment>
                    ))}
                  </g>
                  {" "}
                  <g fill="url(#rows)">
                    {((__v?.rowed) || []).map((p: any, i1: number) => (
                      <Fragment key={i1}>
                        <rect x={__s(p?.x) as any} y={__s(p?.y) as any} width={__s(p?.w) as any} height={__s(p?.h) as any} opacity={__s(p?.op) as any} />
                      </Fragment>
                    ))}
                  </g>
                  {" "}
                  <rect x="1040" y="-80" width="300" height="190" rx="40" fill="#9A9485" />
                  {" "}
                  {((__v?.houses) || []).map((h: any, i2: number) => (
                    <Fragment key={i2}>
                      <rect x={__s(h?.x) as any} y={__s(h?.y) as any} width={__s(h?.w) as any} height={__s(h?.h) as any} fill={__s(h?.fill) as any} stroke="#5E594F" strokeWidth=".6" />
                    </Fragment>
                  ))}
                  {" "}
                  <rect x="596" y="-400" width="9" height="1400" fill="#DDD6C2" />
                  {" "}
                </g>
                {" "}
                <path d="M-20 470C200 440 420 500 680 462S1100 424 1380 450" fill="none" stroke="#4A6A35" strokeWidth="22" />
                {" "}
                <path d="M-20 470C200 440 420 500 680 462S1100 424 1380 450" fill="none" stroke="#3B6E8F" strokeWidth="10" />
                {" "}</>)}
                <rect width="1360" height="520" filter="url(#grain)" opacity=".14" style={{"mixBlendMode":"multiply"} as any} />
                {" "}
                {__v?.dim ? (
                  <>
                    <rect width="1360" height="520" fill="#141A16" opacity=".14" className="fade" />
                  </>
                ) : null}
                {" "}
                <g transform={photo ? undefined : "rotate(-9 680 260)"}>
                  {" "}
                  {((__v?.cells) || []).map((c: any, i3: number) => (
                    <Fragment key={i3}>
                      <rect className="pop" style={__css(c?.st)} x={__s(c?.x) as any} y={__s(c?.y) as any} width={__s(c?.w) as any} height={__s(c?.h) as any} fill={__s(c?.fill) as any} fillOpacity={__s(c?.op) as any} stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="1" />
                    </Fragment>
                  ))}
                  {" "}
                  {__v?.showNum ? (
                    <>
                      {((__v?.cells) || []).map((c: any, i4: number) => (
                        <Fragment key={i4}>
                          <text x={__s(c?.cx) as any} y={__s(c?.cy) as any} transform={photo ? undefined : (__s(c?.tf) as any)} textAnchor="middle" dominantBaseline="central" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill={__s(c?.ink) as any}>
                            {__s(c?.label)}
                          </text>
                        </Fragment>
                      ))}
                    </>
                  ) : null}
                  {" "}
                  <rect x="605" y="120" width="160" height="220" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeOpacity=".95" />
                  {" "}
                  <rect x="605" y="120" width="160" height="220" fill="none" stroke="#141A16" strokeWidth="2" />
                  {outline ? <polygon points={outline} fill="none" stroke="#F29B1E" strokeWidth="3" strokeLinejoin="round" strokeDasharray="8 6" /> : null}
                  {" "}
                  {__v.pin ? (
                  <g transform={__v.pin}>
                    <circle r="9" fill="#F29B1E" className="pulse" />
                    <circle r="9" fill="#F29B1E" stroke="#FFFFFF" strokeWidth="3" />
                  </g>
                  ) : null}
                  {" "}
                </g>
                {" "}
                <rect width="1360" height="520" fill="url(#fadeB)" />
                {" "}
              </svg>
              {" "}
              <div className="float" role="group" aria-label="Map view" style={{"position":"absolute","left":"50%","top":"18px","transform":"translateX(-50%)","height":"44px","padding":"4px","boxSizing":"border-box","borderRadius":"22px","display":"flex","gap":"2px"} as any}>
                {((__v?.views) || []).map((v: any, i5: number) => (
                  <Fragment key={i5}>
                    <button type="button" className={__s(v?.cls) as any} onClick={v?.pick} aria-pressed={__s(v?.pressed) as any}>
                      {__s(v?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
              <Link href={fp("/map")} className="float press map-full">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
                {"Open the full map"}
              </Link>
              <div className="map-legend" style={{"position":"absolute","left":"18px","bottom":"18px","display":"flex","alignItems":"flex-end","gap":"10px"} as any}>
                <div className="float map-zoom" style={{"display":"flex","flexDirection":"column","borderRadius":"999px","overflow":"hidden"} as any}>
                  <button type="button" aria-label="Zoom in" className="ghost" style={{"width":"40px","height":"40px","border":"0","background":"transparent","display":"flex","alignItems":"center","justifyContent":"center"} as any}>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                  <span aria-hidden="true" style={{"height":"1px","margin":"0 8px","background":"var(--line)"} as any} />
                  <button type="button" aria-label="Zoom out" className="ghost" style={{"width":"40px","height":"40px","border":"0","background":"transparent","display":"flex","alignItems":"center","justifyContent":"center"} as any}>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                </div>
                {__v?.dim ? (
                  <>
                    <div className="float fade" style={{"--d":"4","padding":"10px 14px","borderRadius":"12px","display":"flex","flexDirection":"column","gap":"8px"} as any}>
                      <span className="row" style={{"gap":"14px"} as any}>
                        {((__v?.legend) || []).map((l: any, i6: number) => (
                          <Fragment key={i6}>
                            <span className="row" style={{"gap":"6px","fontSize":"13px","fontWeight":"500"} as any}>
                              <span style={__css(l?.sw)} />
                              {__s(l?.label)}
                            </span>
                          </Fragment>
                        ))}
                      </span>
                      <span className="tl">
                        {__s(__v?.legendNote)}{" "}<Link href={fp("/squares")} style={{ textDecoration: "underline", textUnderlineOffset: "3px", color: "var(--ink)", fontWeight: 600, pointerEvents: "auto" }}>{"Are they real? See the proof"}</Link>
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
              <span className="float map-stamp" style={{"position":"absolute","right":"18px","bottom":"18px","height":"34px","padding":"0 12px","borderRadius":"17px","display":"flex","alignItems":"center","gap":"8px","fontSize":"13px","fontWeight":"500"} as any}>
                <span style={{"width":"7px","height":"7px","borderRadius":"4px","background":"#2E8B4A"} as any} />
                {__s(__v?.stamp)}{__v.mapLive || !demo ? null : <>{" "}<span className="pill pv-demo">Demo</span></>}
              </span>
            </section>
            )} />
            <footer className="foot">
              <span>
                <T en="Bezra helps you think. It doesn&apos;t decide for you." ar="الأداة دي بتساعدك تفكر، مش بتقرر بدالك." />
              </span>
              <span>
                {__v.T.foot}
                <AboutLink />
              </span>
            </footer>
          </main>
          <Link href="/ask" className="press lift" aria-label="Ask Bezra" style={{"position":"fixed","right":"30px","bottom":"30px","zIndex":"20","height":"60px","paddingBlock":"0","paddingInline":"6px 20px","borderRadius":"30px","background":"var(--dark)","color":"#fff","display":"flex","alignItems":"center","gap":"8px","boxShadow":"0 18px 40px -16px rgba(20,26,22,.6)"} as any}>
            <svg aria-hidden="true" width="48" height="48" viewBox="0 0 60 60">
              <g className="sway">
                <path d="M30 13C25 4 16 4 12 7c4 6 11 8 18 6z" fill="#5E9A45" />
                <path d="M30 13c4-9 13-11 18-8-3 7-11 10-18 8z" fill="#3E7F35" />
                <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
                <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
                <g className="blink" style={{"transformOrigin":"30px 31px"} as any}>
                  <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
                  <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
                </g>
                <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
              </g>
            </svg>
            <span style={{"fontSize":"15px","fontWeight":"600"} as any}>
              <T en="Ask Bezra" ar="اسأل بذرة" />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
