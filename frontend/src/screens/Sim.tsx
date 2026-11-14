'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// Generated from design/html/V11-Sim.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Sim.logic.js (verbatim from the design).
import { Fragment, useEffect, useState } from 'react';
import { useApi } from '@/lib/api';
import { useField, FieldWho, UserName, UserInitials, EngineerTab } from '@/lib/field';
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Sim.logic';

export default function SimScreen() {
  const { fp, id } = useField();
  // The simulator asks the backend for the season that matches the current choices (POST /sim).
  const [req, setReq] = useState<any>({ field_id: id, sow: "2026-10-25", variety: "sakha95", watering: "every", year: "normal" });
  const sim = useApi("/sim", req);
  const __v = useDC(Logic, { data: sim.data, loading: sim.loading, fieldId: id });
  const reqKey = JSON.stringify(__v.req);
  useEffect(() => { setReq(JSON.parse(reqKey)); }, [reqKey]);
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
              <Link href={fp("")} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                </svg>
                {"My field"}
              </Link>
              <Link href="/sim" aria-current="page" className="press">
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
                  {sim.data?.field ? `Next season on ${sim.data.field.name}, ${sim.data.field.crop.toLowerCase()} ${new Date().getMonth() >= 5 ? new Date().getFullYear() + 1 : new Date().getFullYear()}. Nothing changes on your real field.` : "Next season on your field. Nothing changes on your real field."}
                </span>
                <h1 className="h1">
                  {"Try your season first"}
                </h1>
              </div>
              <div className="row rise" style={{"--d":"1","gap":"8px"} as any}>
                <span className="pill" style={{"height":"30px","padding":"0 12px","fontSize":"12.5px"} as any}>
                  <span style={{"width":"8px","height":"8px","borderRadius":"4px","background":"#8C9C5A"} as any} />
                  {sim.data?.ground?.date ? <>{"Ground: satellite image, " + new Date(sim.data.ground.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}{" "}<span className="pill pv-sat" style={{ height: "18px" }}>Satellite</span></> : <>{"Ground: satellite image, 12 Nov"}{" "}<span className="pill pv-demo" style={{ height: "18px" }}>Demo</span></>}
                </span>
                <span className="pill pv-est" style={{"height":"30px","padding":"0 12px","fontSize":"12.5px"} as any}>
                  {"Crop: simulated"}
                </span>
              </div>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 380px","alignItems":"stretch"} as any}>
              <div className="col" style={{"gap":"12px"} as any}>
                <section aria-labelledby="sc-h" className="hero rise" style={{"--d":"2","height":"600px","background":"#CFC9B6"} as any}>
                  <i className="sk map" aria-hidden="true" style={{"--d":"2"} as any} />
                  <h2 id="sc-h" className="vh">
                    {"Your field in 3D"}
                  </h2>
                  {" "}
                  <svg role="img" aria-label={__s(__v?.sceneLabel) as any} viewBox="0 0 1000 640" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{"position":"absolute","inset":"0"} as any}>
                    {" "}
                    <defs>
                      <radialGradient id="haze" cx=".5" cy=".55" r=".6">
                        <stop offset="0" stopColor="#F29B1E" stopOpacity=".38" />
                        <stop offset="1" stopColor="#F29B1E" stopOpacity="0" />
                      </radialGradient>
                      {" "}
                      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#F4F4F1" stopOpacity=".9" />
                        <stop offset=".35" stopColor="#F4F4F1" stopOpacity="0" />
                      </linearGradient>
                      {" "}
                      <filter id="gr" x="0" y="0" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" />
                        <feColorMatrix type="saturate" values="0" />
                        <feComponentTransfer>
                          <feFuncA type="table" tableValues="0 .45" />
                        </feComponentTransfer>
                      </filter>
                    </defs>
                    {" "}
                    <rect width="1000" height="640" fill="#CFC9B6" />
                    {" "}
                    <g stroke="#D9D2BC" strokeWidth=".8">
                      {((__v?.sc?.ground) || []).map((g: any, i0: number) => (
                        <Fragment key={i0}>
                          <polygon points={__s(g?.pts) as any} fill={__s(g?.fill) as any} />
                        </Fragment>
                      ))}
                    </g>
                    {" "}
                    <polygon points={__s(__v?.sc?.road) as any} fill="#DDD6C2" />
                    <polygon points={__s(__v?.sc?.canal) as any} fill="#3B6E8F" />
                    {" "}
                    <rect width="1000" height="640" filter="url(#gr)" opacity=".16" style={{"mixBlendMode":"multiply"} as any} />
                    {" "}
                    <polygon points={__s(__v?.sc?.edgeR) as any} fill="#5B4632" />
                    <polygon points={__s(__v?.sc?.edgeF) as any} fill="#4A3828" />
                    <polygon points={__s(__v?.sc?.soil) as any} fill="#8A6E4E" />
                    {" "}
                    {__v?.wetOn ? (
                      <>
                        <polygon points={__s(__v?.sc?.wet) as any} fill="#5FA6D6" opacity=".55" className="fade" />
                      </>
                    ) : null}
                    {" "}
                    <g className="fade" style={{"--d":"2"} as any}>
                      {((__v?.sc?.prisms) || []).map((p: any, i1: number) => (
                        <Fragment key={i1}>
                          <polygon points={__s(p?.r) as any} fill={__s(p?.cr) as any} />
                          <polygon points={__s(p?.f) as any} fill={__s(p?.cf) as any} />
                          <polygon points={__s(p?.top) as any} fill={__s(p?.c) as any} stroke="rgba(255,255,255,.18)" strokeWidth=".6" />
                          <path d={__s(p?.rows) as any} stroke="#1A2414" strokeOpacity=".22" strokeWidth="1" />
                        </Fragment>
                      ))}
                    </g>
                    {" "}
                    {__v?.rustOn ? (
                      <>
                        {((__v?.rustDots) || []).map((r: any, i2: number) => (
                          <Fragment key={i2}>
                            <circle cx={__s(r?.rx) as any} cy={__s(r?.ry) as any} r="5" fill="#D9762B" stroke="#fff" strokeWidth="1.5" className="pop" />
                          </Fragment>
                        ))}
                      </>
                    ) : null}
                    {" "}
                    {__v?.hazeOn ? (
                      <>
                        <rect width="1000" height="640" fill="url(#haze)" className="fade" />
                      </>
                    ) : null}
                    {" "}
                    <rect width="1000" height="640" fill="url(#sky)" />
                    {" "}
                  </svg>
                  {" "}
                  <article className="float rise" style={{"--d":"4","position":"absolute","left":"18px","top":"18px","width":"300px","padding":"16px","boxSizing":"border-box","display":"flex","flexDirection":"column","gap":"10px"} as any}>
                    <div className="row sp">
                      <span className="tl">
                        {__s(__v?.when)}
                      </span>
                      <span className="pill">
                        {sim.data?.field ? `${sim.data.field.name}, ${sim.data.field.area_feddan} feddan` : "…"}
                      </span>
                    </div>
                    <h3 className="h3">
                      {__s(__v?.stage)}
                    </h3>
                    <p className="body">
                      {__s(__v?.ev)}
                    </p>
                    <div className="grid" style={{"gridTemplateColumns":"1fr 1fr","gap":"6px"} as any}>
                      <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"2px"} as any}>
                        <span>
                          {"Crop height"}
                        </span>
                        <b style={{"fontSize":"20px"} as any}>
                          {__s(__v?.height)}
                          <small className="unit">
                            {" cm"}
                          </small>
                        </b>
                      </div>
                      <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"2px"} as any}>
                        <span>
                          {"Soil water"}
                        </span>
                        <b style={{"fontSize":"20px"} as any}>
                          {__s(__v?.soilW)}
                          <small className="unit">
                            {"%"}
                          </small>
                        </b>
                      </div>
                    </div>
                  </article>
                  {__v?.hazeChip ? (
                    <>
                      <span className="float pop" style={{"position":"absolute","left":"52%","top":"22%","height":"36px","padding":"0 14px","borderRadius":"18px","display":"flex","alignItems":"center","gap":"8px","fontSize":"14px","fontWeight":"600","color":"#8A4E06","background":"rgba(255,244,227,.95)"} as any}>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7" />
                        </svg>
                        {__s(__v?.hotDays)}
                        {" hot days now"}
                      </span>
                    </>
                  ) : null}
                  <div className="float" style={{"position":"absolute","right":"18px","top":"18px","padding":"10px 14px","display":"flex","flexDirection":"column","gap":"6px","fontSize":"12.5px"} as any}>
                    <span className="row" style={{"gap":"8px"} as any}>
                      <i style={{"width":"12px","height":"12px","borderRadius":"3px","background":"#3F7D33"} as any} />
                      {"Healthy"}
                    </span>
                    <span className="row" style={{"gap":"8px"} as any}>
                      <i style={{"width":"12px","height":"12px","borderRadius":"3px","background":"#CDBB6E"} as any} />
                      {"Stressed, shorter"}
                    </span>
                    <span className="row" style={{"gap":"8px"} as any}>
                      <i style={{"width":"12px","height":"12px","borderRadius":"6px","background":"#D9762B"} as any} />
                      {"Rust spots"}
                    </span>
                    <span className="row" style={{"gap":"8px"} as any}>
                      <i style={{"width":"12px","height":"12px","borderRadius":"3px","background":"#5FA6D6"} as any} />
                      {"Wet soil"}
                    </span>
                  </div>
                </section>
                <div className="card rise sim-steps" style={{"--d":"5","flexDirection":"row","alignItems":"center","gap":"10px","padding":"10px"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"5"} as any} />
                  <button type="button" className="ibtn press" onClick={__v?.back} aria-label="One month back" style={{"background":"var(--inset)","boxShadow":"none"} as any}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m14.5 6-6 6 6 6" />
                    </svg>
                  </button>
                  <div role="group" aria-label="Month" style={{"flex":"1","display":"flex","gap":"2px"} as any}>
                    {((__v?.steps) || []).map((s: any, i3: number) => (
                      <Fragment key={i3}>
                        <button type="button" onClick={s?.pick} aria-pressed={__s(s?.p) as any} style={__css(s?.style)}>
                          <span style={__css(s?.dot)} />
                          <span style={{"fontSize":"13px","fontWeight":"600"} as any}>
                            {__s(s?.label)}
                          </span>
                          <span style={{"fontSize":"11px","opacity":".75"} as any}>
                            {__s(s?.sub)}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <button type="button" className="btn soft press" onClick={__v?.next1}>
                    {"+1 month"}
                  </button>
                  <button type="button" className="btn press" onClick={__v?.next3}>
                    {"+3 months"}
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9.5 6 6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <aside className="col" style={{"gap":"14px"} as any}>
                <section className="card rise " style={{"--d":"3","gap":"16px"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                  <h2 className="h2">
                    {"Your choices"}
                  </h2>
                  <div className="col" style={{"gap":"8px"} as any}>
                    <span className="h2" style={{"fontSize":"14px"} as any}>
                      {"Sowing date"}
                    </span>
                    <div role="group" aria-label="Sowing date" className="seg" style={{"height":"auto","flexWrap":"wrap","borderRadius":"14px"} as any}>
                      {((__v?.sow) || []).map((o: any, i4: number) => (
                        <Fragment key={i4}>
                          <button type="button" className={__s(o?.cls) as any} onClick={o?.pick} aria-pressed={__s(o?.p) as any} style={{"flex":"1","borderRadius":"10px"} as any}>
                            {__s(o?.label)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="col" style={{"gap":"8px"} as any}>
                    <span className="h2" style={{"fontSize":"14px"} as any}>
                      {"Variety"}
                    </span>
                    <div role="group" aria-label="Variety" className="seg" style={{"height":"auto","flexWrap":"wrap","borderRadius":"14px"} as any}>
                      {((__v?.va) || []).map((o: any, i5: number) => (
                        <Fragment key={i5}>
                          <button type="button" className={__s(o?.cls) as any} onClick={o?.pick} aria-pressed={__s(o?.p) as any} style={{"flex":"1","borderRadius":"10px"} as any}>
                            {__s(o?.label)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="col" style={{"gap":"8px"} as any}>
                    <span className="h2" style={{"fontSize":"14px"} as any}>
                      {"Watering"}
                    </span>
                    <div role="group" aria-label="Watering" className="seg" style={{"height":"auto","flexWrap":"wrap","borderRadius":"14px"} as any}>
                      {((__v?.wa) || []).map((o: any, i6: number) => (
                        <Fragment key={i6}>
                          <button type="button" className={__s(o?.cls) as any} onClick={o?.pick} aria-pressed={__s(o?.p) as any} style={{"flex":"1","borderRadius":"10px"} as any}>
                            {__s(o?.label)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="col" style={{"gap":"8px"} as any}>
                    <span className="h2" style={{"fontSize":"14px"} as any}>
                      {"Weather"}
                    </span>
                    <div role="group" aria-label="Weather" className="seg" style={{"height":"auto","flexWrap":"wrap","borderRadius":"14px"} as any}>
                      {((__v?.yr) || []).map((o: any, i7: number) => (
                        <Fragment key={i7}>
                          <button type="button" className={__s(o?.cls) as any} onClick={o?.pick} aria-pressed={__s(o?.p) as any} style={{"flex":"1","borderRadius":"10px"} as any}>
                            {__s(o?.label)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </section>
                <section className="card rise tint-s" style={{"--d":"4"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                  <div className="row" style={{"gap":"12px","alignItems":"center"} as any}>
                    {__v?.good ? (
                      <>
                        <svg aria-hidden="true" width="52" height="52" viewBox="0 0 60 60">
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
                      </>
                    ) : null}
                    {__v?.bad ? (
                      <>
                        <svg aria-hidden="true" width="52" height="52" viewBox="0 0 60 60">
                          <g className="sway">
                            <path d="M30 14C24 9 15 11 12 15c5 4 12 3 18-1z" fill="#5E9A45" />
                            <path d="M30 14c5-6 14-6 18-2-4 5-12 6-18 2z" fill="#3E7F35" />
                            <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
                            <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
                            <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <g className="blink" style={{"transformOrigin":"30px 31px"} as any}>
                              <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
                              <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
                            </g>
                            <path d="M22 27l4-1.5M38 27l-4-1.5" stroke="#3A2A10" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M25 39q5-4 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                            <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          </g>
                        </svg>
                      </>
                    ) : null}
                    <div className="col" style={{"gap":"2px"} as any}>
                      <span className="tl">
                        {"Expected harvest at the end"}
                      </span>
                      <span className="row" style={{"alignItems":"baseline","gap":"6px"} as any}>
                        <b style={{"fontSize":"44px","lineHeight":"1","fontWeight":"600","letterSpacing":"-1.6px"} as any}>
                          {__s(__v?.yieldPct)}
                          {"%"}
                        </b>
                        <span className="tl">
                          {"of what this field can give"}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="grid" style={{"gridTemplateColumns":"1fr 1fr","gap":"6px"} as any}>
                    <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"2px"} as any}>
                      <span>
                        {"Water per feddan"}
                      </span>
                      <b style={{"fontSize":"18px"} as any}>
                        {__s(__v?.wUse)}
                        <small className="unit">
                          {" m³"}
                        </small>
                      </b>
                    </div>
                    <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"2px"} as any}>
                      <span>
                        {"Hot days at grain fill"}
                      </span>
                      <b style={{"fontSize":"18px"} as any}>
                        {__s(__v?.hotDays)}
                      </b>
                    </div>
                  </div>
                  <span className="row" style={{"gap":"4px"} as any}>
                    <span className={__v.estCls}>
                      {__v.estLabel}
                    </span>
                    <span className="pill">
                      {__v.checked}
                    </span>
                  </span>
                  {__v?.hasPin ? (
                    <>
                      <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"4px","background":"var(--sun-tint)"} as any}>
                        <span style={{"color":"#8A4E06"} as any}>
                          {"Pinned: "}
                          {__s(__v?.pinLabel)}
                          {", "}
                          {__s(__v?.pinY)}
                          {"%"}
                        </span>
                        <b>
                          {__s(__v?.diffTxt)}
                        </b>
                      </div>
                    </>
                  ) : null}
                  <div className="row" style={{"gap":"8px"} as any}>
                    <button type="button" className="btn soft press" onClick={__v?.pinIt} style={{"flex":"1"} as any}>
                      {"Pin to compare"}
                    </button>
                    <Link href={fp("/plan")} className="btn cta press" style={{"flex":"1.3"} as any}>
                      {"Use in my plan"}
                      <span className="ar">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </section>
              </aside>
            </div>
            <footer className="foot">
              <span>
                <T en="Bezra helps you think. It doesn&apos;t decide for you." ar="الأداة دي بتساعدك تفكر، مش بتقرر بدالك." />
              </span>
              <span>
                {__v.foot}
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
