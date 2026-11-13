'use client';
/* eslint-disable */
// Generated from design/html/V11-Field.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Field.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho } from '@/lib/field';
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Field.logic';

export default function FieldScreen() {
  const { fp, id } = useField();
  const summary = useApi(`/fields/${id}/summary`);
  const ndvi = useApi(`/fields/${id}/ndvi`);
  const health = useApi(`/fields/${id}/health`);
  const __v = useDC(Logic, { data: summary.data, loading: summary.loading, fieldId: id, ndvi: ndvi.data, health: health.data });
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
            </nav>
            <div className="tools">
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
                  {"HF"}
                </span>
                <span>
                  <b>
                    {"Hassan Farouk"}
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
                <Link href="/field/north-plot" className="press lift" aria-current={id === "north-plot"} style={{"height":"64px","padding":"0 8px 0 14px","boxSizing":"border-box","borderRadius":"12px","background":"#fff","display":"flex","alignItems":"center","gap":"14px","boxShadow":id === "north-plot" ? "0 0 0 2px #141A16" : "0 1px 2px rgba(20,26,22,.05)"} as any}>
                  <span className="col" style={{"gap":"1px"} as any}>
                    <span className="tl" style={{"fontWeight":"600"} as any}>
                      {"#01"}
                    </span>
                    <span style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {"North plot"}
                    </span>
                    <span className="tl">
                      {"2.4 feddan, wheat"}
                    </span>
                  </span>
                  <svg aria-hidden="true" width="56" height="44" viewBox="0 0 64 48" style={{"borderRadius":"8px"} as any}>
                    <rect width="64" height="48" fill="#8C9C5A" />
                    <rect width="18" height="48" fill="#5A7A3C" />
                    <rect x="48" width="16" height="48" fill="#B1A584" />
                    <rect x="21" y="9" width="24" height="30" fill="#fff" fillOpacity=".2" stroke="#fff" strokeWidth="2" />
                  </svg>
                </Link>
                <Link href="/field/south-plot" className="press lift" aria-current={id === "south-plot"} style={{"height":"64px","padding":"0 8px 0 14px","boxSizing":"border-box","borderRadius":"12px","background":"#fff","display":"flex","alignItems":"center","gap":"14px","boxShadow":id === "south-plot" ? "0 0 0 2px #141A16" : "0 1px 2px rgba(20,26,22,.05)"} as any}>
                  <span className="col" style={{"gap":"1px"} as any}>
                    <span className="tl" style={{"fontWeight":"600"} as any}>
                      {"#02"}
                    </span>
                    <span style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {"South plot"}
                    </span>
                    <span className="tl">
                      {"0.6 feddan, berseem"}
                    </span>
                  </span>
                  <svg aria-hidden="true" width="56" height="44" viewBox="0 0 64 48" style={{"borderRadius":"8px"} as any}>
                    <rect width="64" height="48" fill="#628342" />
                    <rect width="18" height="48" fill="#8FA05B" />
                    <rect x="48" width="16" height="48" fill="#A39878" />
                    <rect x="21" y="9" width="24" height="30" fill="#fff" fillOpacity=".2" stroke="#fff" strokeWidth="2" />
                  </svg>
                </Link>
                <Link href="/onboarding" className="press ghost" aria-label="Add a field" style={{"width":"64px","height":"64px","boxSizing":"border-box","borderRadius":"12px","border":"1.5px dashed #C3C6BF","display":"flex","alignItems":"center","justifyContent":"center"} as any}>
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </Link>
              </div>
            </div>
            <nav aria-label="North plot sections" className="tabs rise" style={{"--d":"0"} as any}>
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
            <section aria-labelledby="hero-h" className="hero rise" style={{"--d":"2","minHeight":"520px","background":"#D9D6C8"} as any}>
              <i className={__v.skMap} aria-hidden="true" style={{"--d":"2"} as any} />
              <h2 id="hero-h" className="vh">
                {"North plot from above"}
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
                <g transform="rotate(-9 680 260)">
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
                {" "}
                <rect width="1360" height="520" filter="url(#grain)" opacity=".14" style={{"mixBlendMode":"multiply"} as any} />
                {" "}
                {__v?.dim ? (
                  <>
                    <rect width="1360" height="520" fill="#141A16" opacity=".28" className="fade" />
                  </>
                ) : null}
                {" "}
                <g transform="rotate(-9 680 260)">
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
                          <text x={__s(c?.cx) as any} y={__s(c?.cy) as any} transform={__s(c?.tf) as any} textAnchor="middle" dominantBaseline="central" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill={__s(c?.ink) as any}>
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
              <article className="float rise" style={{"--d":"5","position":"absolute","left":"18px","top":"18px","width":"288px","padding":"16px","boxSizing":"border-box","display":"flex","flexDirection":"column","gap":"12px"} as any}>
                <div className="row sp">
                  <span className="row" style={{"gap":"8px","fontSize":"14px","fontWeight":"600"} as any}>
                    <span className="chip">
                      <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                      </svg>
                    </span>
                    {"Field details"}
                  </span>
                  <Link href="/profile" className="chip press ghost" aria-label="Edit field">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
                    </svg>
                  </Link>
                </div>
                <div className="col" style={{"gap":"2px"} as any}>
                  <span className="tl">
                    {__v.T.num}
                  </span>
                  <span style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.7px"} as any}>
                    {__v.T.name}
                  </span>
                  <span style={{"fontSize":"14px","color":"var(--ink2)"} as any}>
                    {__v.T.cropLine}
                  </span>
                </div>
                <div className="col" style={{"gap":"4px"} as any}>
                  <div className="inset">
                    <span>
                      {"Area"}
                    </span>
                    <span className="row" style={{"gap":"6px"} as any}>
                      <b>
                        {__v.T.area}
                      </b>
                      <span className="pill pv-farm">
                        {"You"}
                      </span>
                    </span>
                  </div>
                  <div className="inset">
                    <span>
                      {"Soil"}
                    </span>
                    <span className="row" style={{"gap":"6px"} as any}>
                      <b>
                        {__v.T.soil}
                      </b>
                      <span className="pill pv-est">
                        {"Est."}
                      </span>
                    </span>
                  </div>
                  <div className="inset">
                    <span>
                      {"Water"}
                    </span>
                    <span className="row" style={{"gap":"6px"} as any}>
                      <b>
                        {__v.T.water}
                      </b>
                      <span className="pill pv-farm">
                        {"You"}
                      </span>
                    </span>
                  </div>
                  <div className="inset">
                    <span>
                      {"Turn"}
                    </span>
                    <span className="row" style={{"gap":"6px"} as any}>
                      <b>
                        {__v.T.turn}
                      </b>
                      <span className="pill pv-farm">
                        {"You"}
                      </span>
                    </span>
                  </div>
                </div>
              </article>
              <article aria-labelledby="act-h" className="float rise" style={{"--d":"6","position":"absolute","right":"18px","top":"18px","width":"348px","padding":"18px","boxSizing":"border-box","display":"flex","flexDirection":"column","gap":"14px"} as any}>
                <div className="row" style={{"gap":"10px","alignItems":"flex-start"} as any}>
                  <svg aria-hidden="true" width="48" height="48" viewBox="0 0 60 60">
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
                  <div className="col" style={{"gap":"4px","flex":"1"} as any}>
                    <span className="row sp">
                      <span className="tl" style={{"fontWeight":"600","color":"var(--ink2)"} as any}>
                        {"Do this today"}
                      </span>
                      <span className="lv lv-med">
                        <i />
                        {__v.T.conf}
                      </span>
                    </span>
                    <h2 id="act-h" style={{"fontSize":"23px","lineHeight":"1.15","fontWeight":"600","letterSpacing":"-.6px"} as any}>
                      {__v.T.title}
                    </h2>
                  </div>
                </div>
                <p className="body">
                  {__v.T.body}
                </p>
                <div className="row" style={{"gap":"6px"} as any}>
                  <span className="inset" style={{"flex":"1","flexDirection":"column","alignItems":"flex-start","gap":"2px"} as any}>
                    <span>
                      {"Protects your harvest by"}
                    </span>
                    <b style={{"fontSize":"20px"} as any}>
                      {__v.T.protects}
                    </b>
                  </span>
                  <span className="inset" style={{"flex":"1","flexDirection":"column","alignItems":"flex-start","gap":"2px"} as any}>
                    <span>
                      {"To apply"}
                    </span>
                    <b style={{"fontSize":"20px"} as any}>
                      {__v.T.apply}
                      <small className="unit">
                        {" m³"}
                      </small>
                    </b>
                  </span>
                </div>
                <div className="row wrap" style={{"gap":"4px"} as any}>
                  <span className="pill pv-est">
                    {__v.T.pvEst.label}
                  </span>
                  <span className="pill">
                    {"Your field"}
                  </span>
                  {__v?.details ? (
                    <>
                      <span className="pill">
                        {__v.T.method}
                      </span>
                    </>
                  ) : null}
                </div>
                <div className="row" style={{"gap":"8px"} as any}>
                  <button type="button" className={__s(__v?.doneCls) as any} onClick={__v?.toggleDone} aria-pressed={__s(__v?.doneP) as any} style={{"flex":"1"} as any}>
                    {__s(__v?.doneLabel)}
                  </button>
                  <button type="button" className="btn soft press sm" aria-label="Listen in Arabic" style={{"height":"46px","width":"46px","padding":"0"} as any}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
                    </svg>
                  </button>
                  <Link href="/ask" className="btn soft cta press" style={{"flex":"1"} as any}>
                    {__v.T.why}
                    <span className="ar">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </article>
              <div style={{"position":"absolute","left":"18px","bottom":"18px","display":"flex","alignItems":"flex-end","gap":"10px"} as any}>
                <div className="float" style={{"display":"flex","flexDirection":"column","borderRadius":"999px","overflow":"hidden"} as any}>
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
                        {__s(__v?.legendNote)}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
              <span className="float" style={{"position":"absolute","right":"18px","bottom":"18px","height":"34px","padding":"0 12px","borderRadius":"17px","display":"flex","alignItems":"center","gap":"8px","fontSize":"13px","fontWeight":"500"} as any}>
                <span style={{"width":"7px","height":"7px","borderRadius":"4px","background":"#2E8B4A"} as any} />
                {__s(__v?.stamp)}{__v.mapLive ? null : <>{" "}<span className="pill pv-demo">Demo</span></>}
              </span>
            </section>
            <section aria-label="Risks this week" className="grid" style={{"gridTemplateColumns":"repeat(4, minmax(0, 1fr))"} as any}>
              <section className="card rise lift" style={{"--d":"3","gap":"10px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"3"} as any} />
                <div className="row sp">
                  <span className="row" style={{"gap":"10px"} as any}>
                    <span className="chip s">
                      <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7" />
                      </svg>
                    </span>
                    <span className="h2">
                      {"Heat"}
                    </span>
                  </span>
                  <span className={__v.T.heat.cls}>
                    <i />
                    {__v.T.heat.lv}
                  </span>
                </div>
                <p className="sub" style={{"color":"var(--ink2)"} as any}>
                  {__v.T.heat.line}
                </p>
              </section>
              <section className="card rise lift" style={{"--d":"4","gap":"10px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"4"} as any} />
                <div className="row sp">
                  <span className="row" style={{"gap":"10px"} as any}>
                    <span className="chip w">
                      <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                      </svg>
                    </span>
                    <span className="h2">
                      {"Water"}
                    </span>
                  </span>
                  <span className={__v.T.wat.cls}>
                    <i />
                    {__v.T.wat.lv}
                  </span>
                </div>
                <p className="sub" style={{"color":"var(--ink2)"} as any}>
                  {__v.T.wat.line}
                </p>
              </section>
              <section className="card rise lift" style={{"--d":"5","gap":"10px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"5"} as any} />
                <div className="row sp">
                  <span className="row" style={{"gap":"10px"} as any}>
                    <span className="chip r">
                      <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8M10 12h.01M14 9h.01M13 14h.01" />
                      </svg>
                    </span>
                    <span className="h2">
                      {"Rust"}
                    </span>
                  </span>
                  <span className={__v.T.rust.cls}>
                    <i />
                    {__v.T.rust.lv}
                  </span>
                </div>
                <p className="sub" style={{"color":"var(--ink2)"} as any}>
                  {__v.T.rust.line}
                </p>
              </section>
              <section className="card rise lift" style={{"--d":"6","gap":"10px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"6"} as any} />
                <div className="row sp">
                  <span className="row" style={{"gap":"10px"} as any}>
                    <span className="chip g">
                      <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                      </svg>
                    </span>
                    <span className="h2">
                      {"Pests"}
                    </span>
                  </span>
                  <span className="lv lv-low">
                    <i />
                    {"Low"}
                  </span>
                </div>
                <p className="sub" style={{"color":"var(--ink2)"} as any}>
                  {"No pests reported near you."}{" "}<span className="pill pv-demo">Demo</span>
                </p>
              </section>
            </section>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1.05fr) minmax(0, .9fr) minmax(0, 1.25fr) minmax(0, .95fr)","alignItems":"stretch"} as any}>
              <section aria-label="Field numbers" className="grid" style={{"gridTemplateColumns":"1fr 1fr","gap":"10px"} as any}>
                <section className="card rise " style={{"--d":"8","padding":"14px","gap":"10px","justifyContent":"flex-start"} as any}>
                  <i className={__v.sk} aria-hidden="true" style={{"--d":"8"} as any} />
                  <div className="row" style={{"gap":"8px"} as any}>
                    <span className="chip" style={{"width":"28px","height":"28px","borderRadius":"8px"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                      </svg>
                    </span>
                    <span style={{"fontSize":"13px","color":"var(--ink2)"} as any}>
                      {"Soil water now"}
                    </span>
                  </div>
                  <span className="num">
                    {__v.T.soilW}
                    <small>
                      {"%"}
                    </small>
                  </span>
                  <span className="row wrap" style={{"gap":"4px"} as any}>
                    <span className={__v.T.pvEst.cls}>
                      {__v.T.pvEst.label}
                    </span>
                    <span className="pill">
                      {"Your field"}
                    </span>
                  </span>
                  {__v?.details ? (
                    <>
                      <span className="tl" style={{"fontSize":"11px"} as any}>
                        {__v.T.soilSrc}
                      </span>
                    </>
                  ) : null}
                </section>
                <section className="card rise " style={{"--d":"9","padding":"14px","gap":"10px","justifyContent":"flex-start"} as any}>
                  <i className={__v.sk} aria-hidden="true" style={{"--d":"9"} as any} />
                  <div className="row" style={{"gap":"8px"} as any}>
                    <span className="chip" style={{"width":"28px","height":"28px","borderRadius":"8px"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                      </svg>
                    </span>
                    <span style={{"fontSize":"13px","color":"var(--ink2)"} as any}>
                      {"Crop greenness"}
                    </span>
                  </div>
                  <span className="num">
                    {__s(__v?.green)}
                    <small>
                      {__s(__v?.greenU)}
                    </small>
                  </span>
                  <span className="row wrap" style={{"gap":"4px"} as any}>
                    <span className={__v.mapLive ? "pill pv-sat" : "pill pv-demo"}>
                      {__v.mapLive ? "Satellite" : "Demo"}
                    </span>
                    <span className="pill">
                      {"Your field"}
                    </span>
                  </span>
                  {__v?.details ? (
                    <>
                      <span className="tl" style={{"fontSize":"11px"} as any}>
                        {__v.mapLive ? __v.legendNote.split(",")[0] + ", " + __v.stamp.replace("Image from ", "").split(",")[0] : "NASA HLS v2.0, 30 m, 10 Nov"}
                      </span>
                    </>
                  ) : null}
                </section>
                <section className="card rise " style={{"--d":"10","padding":"14px","gap":"10px","justifyContent":"flex-start"} as any}>
                  <i className={__v.sk} aria-hidden="true" style={{"--d":"10"} as any} />
                  <div className="row" style={{"gap":"8px"} as any}>
                    <span className="chip" style={{"width":"28px","height":"28px","borderRadius":"8px"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 15a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17.3 8 3.5 3.5 0 0 1 17 15zM9 18l-1 2M13 18l-1 2M17 18l-1 2" />
                      </svg>
                    </span>
                    <span style={{"fontSize":"13px","color":"var(--ink2)"} as any}>
                      {"Rain since watering"}
                    </span>
                  </div>
                  <span className="num">
                    {__v.T.rain}
                    <small>
                      {" mm"}
                    </small>
                  </span>
                  <span className="row wrap" style={{"gap":"4px"} as any}>
                    <span className={__v.T.pvSat.cls}>
                      {__v.T.pvSat.label}
                    </span>
                    <span className="pill">
                      {"Your area"}
                    </span>
                  </span>
                  {__v?.details ? (
                    <>
                      <span className="tl" style={{"fontSize":"11px"} as any}>
                        {__v.T.rainSrc}
                      </span>
                    </>
                  ) : null}
                </section>
                <section className="card rise " style={{"--d":"11","padding":"14px","gap":"10px","justifyContent":"flex-start"} as any}>
                  <i className={__v.sk} aria-hidden="true" style={{"--d":"11"} as any} />
                  <div className="row" style={{"gap":"8px"} as any}>
                    <span className="chip" style={{"width":"28px","height":"28px","borderRadius":"8px"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
                      </svg>
                    </span>
                    <span style={{"fontSize":"13px","color":"var(--ink2)"} as any}>
                      {"Water used this season"}
                    </span>
                  </div>
                  <span className="num">
                    {__v.T.used}
                    <small>
                      {" m³"}
                    </small>
                  </span>
                  <span className="row wrap" style={{"gap":"4px"} as any}>
                    <span className="pill pv-farm">
                      {"Farmer"}
                    </span>
                    <span className="pill">
                      {"Your field"}
                    </span>
                  </span>
                  {__v?.details ? (
                    <>
                      <span className="tl" style={{"fontSize":"11px"} as any}>
                        {"From your watering log"}
                      </span>
                    </>
                  ) : null}
                </section>
              </section>
              <section className="card rise " style={{"--d":"12"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"12"} as any} />
                <div className="row sp">
                  <h2 className="h2">
                    {"Water in the root zone"}
                  </h2>
                  <span className={__v.T.pvEst.cls}>
                    {__v.T.pvEst.label}
                  </span>
                </div>
                <svg role="img" aria-label={__v.T.gaugeLabel} viewBox="0 -20 240 160" width="100%" style={{"maxHeight":"168px"} as any}>
                  {((__v?.gauge) || []).map((g: any, i7: number) => (
                    <Fragment key={i7}>
                      <path className="fade" style={__css(g?.st)} d={__s(g?.d) as any} stroke={__s(g?.c) as any} strokeWidth="16" strokeLinecap="round" fill="none" />
                    </Fragment>
                  ))}
                  <path d="M120 32L120 4" stroke="#141A16" strokeWidth="2.5" strokeLinecap="round" />
                  <text x="120" y="-2" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="10.5" fontWeight="600" fill="#141A16">
                    {"Refill 50%"}
                  </text>
                  <text x="120" y="112" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="34" fontWeight="600" fill="#141A16">
                    {__v.T.soilW}
                    <tspan fontSize="16" fill="#8B918C">
                      {"%"}
                    </tspan>
                  </text>
                  <text x="120" y="132" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#6A716C">
                    {__v.T.refillTxt}
                  </text>
                </svg>
                <div className="col" style={{"gap":"4px"} as any}>
                  <div className="inset">
                    <span>
                      {"Last watered"}
                    </span>
                    <b>
                      {__v.T.lastW}
                    </b>
                  </div>
                  <div className="inset">
                    <span>
                      {__v.T.afterLabel}
                    </span>
                    <b>
                      {__v.T.after}
                    </b>
                  </div>
                </div>
              </section>
              <section className="card rise " style={{"--d":"13"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"13"} as any} />
                <div className="row sp">
                  <h2 className="h2">
                    {"This field's year"}
                  </h2>
                  <span className="tl">
                    {__v.T.yearRange}
                  </span>
                </div>
                <div role="img" aria-label="Season strip by week. Wheat from mid October to mid April, a bare gap, maize May to mid September. Hot days likely in late April during grain fill. Today is week 5." style={{"position":"relative"} as any}>
                  <span style={{"position":"absolute","left":__v.T.todayLeft,"top":"0","transform":"translateX(-30%)","height":"20px","padding":"0 7px","borderRadius":"10px","background":"var(--ink)","color":"#fff","fontSize":"11px","fontWeight":"600","display":"flex","alignItems":"center"} as any} className="fade">
                    {"Today"}
                  </span>
                  <div style={{"display":"flex","alignItems":"flex-end","gap":"2px","height":"76px","marginTop":"26px"} as any}>
                    {((__v?.weeks) || []).map((w: any, i8: number) => (
                      <Fragment key={i8}>
                        <span className="grow" style={__css(w?.style)} />
                      </Fragment>
                    ))}
                  </div>
                  <div style={{"display":"grid","gridTemplateColumns":"repeat(12, minmax(0, 1fr))","marginTop":"8px","fontSize":"11px","color":"var(--faint)"} as any}>
                    <span>
                      {"Oct"}
                    </span>
                    <span />
                    <span>
                      {"Dec"}
                    </span>
                    <span />
                    <span>
                      {"Feb"}
                    </span>
                    <span />
                    <span>
                      {"Apr"}
                    </span>
                    <span />
                    <span>
                      {"Jun"}
                    </span>
                    <span />
                    <span>
                      {"Aug"}
                    </span>
                    <span />
                  </div>
                </div>
                <div className="row wrap" style={{"gap":"12px","fontSize":"12px","color":"var(--ink2)"} as any}>
                  <span className="row" style={{"gap":"6px"} as any}>
                    <i style={{"width":"10px","height":"10px","borderRadius":"3px","background":"#C9B26A"} as any} />
                    {"Wheat"}
                  </span>
                  <span className="row" style={{"gap":"6px"} as any}>
                    <i style={{"width":"10px","height":"10px","borderRadius":"3px","background":"#6E9A4A"} as any} />
                    {"Maize"}
                  </span>
                  <span className="row" style={{"gap":"6px"} as any}>
                    <i style={{"width":"10px","height":"10px","borderRadius":"3px","background":"repeating-linear-gradient(45deg,#D7D4CB 0 2px,#fff 2px 4px)","boxShadow":"inset 0 0 0 1px #D7D4CB"} as any} />
                    {"Bare"}
                  </span>
                  <span className="row" style={{"gap":"6px"} as any}>
                    <i style={{"width":"10px","height":"10px","borderRadius":"5px","background":"var(--sun)"} as any} />
                    {"Hot days"}
                  </span>
                </div>
                <div className="inset" style={{"background":"var(--sun-tint)","color":"#5A3B0B","justifyContent":"flex-start","alignItems":"flex-start","lineHeight":"1.4"} as any}>
                  <span style={{"color":"#B4660B"} as any}>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7" />
                    </svg>
                  </span>
                  {__v.T.yearNote}
                </div>
              </section>
              <div className="col" style={{"gap":"14px"} as any}>
                <Link href="/sim" className="card dk rise lift cta" style={{"--d":"14","flex":"1","justifyContent":"space-between","overflow":"hidden"} as any}>
                  <i className="sk" aria-hidden="true" style={{"--d":"14"} as any} />
                  <span className="row sp">
                    <span className="ar-t" lang="ar" dir="rtl" style={{"fontSize":"14px","color":"rgba(255,255,255,.72)"} as any}>
                      {"جرّب موسمك"}
                    </span>
                    <span className="ar" style={{"background":"var(--sun)"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </span>
                  <span className="col" style={{"gap":"4px"} as any}>
                    <span className="h3">
                      {"Try next season first"}
                    </span>
                    <span style={{"fontSize":"13px","color":"rgba(255,255,255,.72)"} as any}>
                      {"Change the sowing date or the water and watch your field grow."}
                    </span>
                  </span>
                </Link>
                <Link href={fp("/plan")} className="card rise lift cta" style={{"--d":"15","flex":"1","justifyContent":"space-between"} as any}>
                  <i className={__v.sk} aria-hidden="true" style={{"--d":"15"} as any} />
                  <span className="row sp">
                    <span className="ar-t" lang="ar" dir="rtl" style={{"fontSize":"14px","color":"var(--muted)"} as any}>
                      {"خطة موسمك"}
                    </span>
                    <span className="ar" style={{"background":"var(--inset)"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </span>
                  <span className="col" style={{"gap":"8px"} as any}>
                    <span className="h3">
                      {"Season plan"}
                    </span>
                    <span className="row" style={{"gap":"8px"} as any}>
                      <span style={{"flex":"1","height":"6px","borderRadius":"3px","background":"var(--inset)","overflow":"hidden"} as any}>
                        <span className="growx" style={{"display":"block","width":"33%","height":"100%","background":"var(--green)","borderRadius":"3px"} as any} />
                      </span>
                      <span className="tl" style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"3 of 9 done"}{" "}<span className="pill pv-demo">Demo</span>
                      </span>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
            {__v?.details ? (
              <>
                <section className="card rise " style={{"--d":"16"} as any}>
                  <i className={__v.sk} aria-hidden="true" style={{"--d":"16"} as any} />
                  <div className="row sp">
                    <h2 className="h2">
                      {"Data behind this screen"}
                    </h2>
                    <span className="tl">
                      {"Confidence: Medium, soil is a first guess"}
                    </span>
                  </div>
                  <div className="grid" style={{"gridTemplateColumns":"repeat(5, minmax(0, 1fr))","gap":"8px"} as any}>
                    <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"4px"} as any}>
                      <span>
                        {"NASA POWER"}
                      </span>
                      <b>
                        {"Heat, ET₀"}
                      </b>
                      <span className="tl">
                        {__v.T.powerLag}
                      </span>
                    </div>
                    <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"4px"} as any}>
                      <span>
                        {__v.mapLive && !String(ndvi.data?.source).startsWith("NASA") ? "Sentinel-2" : "HLS v2.0"}
                      </span>
                      <b>
                        {"Greenness, 30 m"}
                      </b>
                      <span className="tl">
                        {__v.mapLive ? "Image " + __v.stamp.replace("Image from ", "").split(",")[0] : (__v.T.demo ? "Image 10 Nov" : "Not connected")}
                      </span>
                    </div>
                    <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"4px"} as any}>
                      <span>
                        {"SMAP L4"}
                      </span>
                      <b>
                        {"Root zone, 9 km"}
                      </b>
                      <span className="tl">
                        {__v.T.demo ? "1 day lag" : "Not connected yet"}
                      </span>
                    </div>
                    <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"4px"} as any}>
                      <span>
                        {"GPM IMERG"}
                      </span>
                      <b>
                        {"Past rain"}
                      </b>
                      <span className="tl">
                        {__v.T.demo ? "1 day lag" : "Using POWER rain for now"}
                      </span>
                    </div>
                    <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start","gap":"4px"} as any}>
                      <span>
                        {"Forecast"}
                      </span>
                      <b>
                        {"Next 7 days"}
                      </b>
                      <span className="tl">
                        {__v.T.forecast}
                      </span>
                    </div>
                  </div>
                </section>
              </>
            ) : null}
            <footer className="foot">
              <span>
                <span lang="ar" dir="rtl" className="ar-t">
                  {"الأداة دي بتساعدك تفكر، مش بتقرر بدالك."}
                </span>
                {" Bezra helps you think. It doesn't decide for you."}
              </span>
              <span>
                {__v.T.foot}
                <AboutLink />
              </span>
            </footer>
          </main>
          <Link href="/ask" className="press lift" aria-label="Ask Bezra" style={{"position":"fixed","right":"30px","bottom":"30px","zIndex":"20","height":"60px","padding":"0 20px 0 6px","borderRadius":"30px","background":"var(--dark)","color":"#fff","display":"flex","alignItems":"center","gap":"8px","boxShadow":"0 18px 40px -16px rgba(20,26,22,.6)"} as any}>
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
            <span className="ar-t" lang="ar" dir="rtl" style={{"fontSize":"15px","fontWeight":"600"} as any}>
              {"اسأل بذرة"}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
