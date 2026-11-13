'use client';
/* eslint-disable */
// Generated from design/html/V11-Health.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Health.logic.js (verbatim from the design).
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Logic from './Health.logic';

export default function HealthScreen() {
  const __v = useDC(Logic);
  return (
    <>
      <div className="root">
        <div className="shell">
          <header className="top">
            <Link href="/field/north-plot" className="brand" aria-label="Bezra, my field">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <nav aria-label="Main" className="nav">
              <Link href="/field/north-plot" aria-current="page" className="press">
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
              <Link href="/field/north-plot/alerts" className="ibtn press" aria-label="Alerts, 2 new">
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
                    {"North plot, Menoufia"}
                  </small>
                </span>
              </span>
            </div>
          </header>
          <main className="main">
            <div className="head">
              <div className="col rise" style={{"--d":"0","gap":"6px"} as any}>
                <span className="eyebrow">
                  {"North plot. Latest clear image 10 November, HLS 30 m."}
                </span>
                <h1 className="h1">
                  {"Field health"}
                </h1>
              </div>
              <div role="group" aria-label="Index" className="seg rise" style={{"--d":"1"} as any}>
                {((__v?.idx) || []).map((x: any, i0: number) => (
                  <Fragment key={i0}>
                    <button type="button" className={__s(x?.cls) as any} onClick={x?.pick} aria-pressed={__s(x?.p) as any}>
                      {__s(x?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <nav aria-label="North plot sections" className="tabs rise" style={{"--d":"0"} as any}>
              <Link href="/field/north-plot">
                {"Today"}
              </Link>
              <Link href="/field/north-plot/plan">
                {"Season plan"}
              </Link>
              <Link href="/field/north-plot/health" aria-current="page">
                {"Field health"}
              </Link>
              <Link href="/field/north-plot/calendar">
                {"Calendar"}
              </Link>
              <Link href="/field/north-plot/next">
                {"Next season"}
              </Link>
              <Link href="/field/north-plot/alerts">
                {"Alerts"}
              </Link>
            </nav>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 380px","alignItems":"stretch"} as any}>
              <section aria-labelledby="hm-h" className="hero rise" style={{"--d":"2","minHeight":"540px","background":"#D9D6C8"} as any}>
                <i className="sk map" aria-hidden="true" style={{"--d":"2"} as any} />
                <h2 id="hm-h" className="vh">
                  {"Greenness map"}
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
                      {((__v?.parcels) || []).map((p: any, i1: number) => (
                        <Fragment key={i1}>
                          <rect x={__s(p?.x) as any} y={__s(p?.y) as any} width={__s(p?.w) as any} height={__s(p?.h) as any} fill={__s(p?.fill) as any} />
                        </Fragment>
                      ))}
                    </g>
                    {" "}
                    <g fill="url(#rows)">
                      {((__v?.rowed) || []).map((p: any, i2: number) => (
                        <Fragment key={i2}>
                          <rect x={__s(p?.x) as any} y={__s(p?.y) as any} width={__s(p?.w) as any} height={__s(p?.h) as any} opacity={__s(p?.op) as any} />
                        </Fragment>
                      ))}
                    </g>
                    {" "}
                    <rect x="1040" y="-80" width="300" height="190" rx="40" fill="#9A9485" />
                    {" "}
                    {((__v?.houses) || []).map((h: any, i3: number) => (
                      <Fragment key={i3}>
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
                    {((__v?.cells) || []).map((c: any, i4: number) => (
                      <Fragment key={i4}>
                        <rect className="pop" style={__css(c?.st)} x={__s(c?.x) as any} y={__s(c?.y) as any} width={__s(c?.w) as any} height={__s(c?.h) as any} fill={__s(c?.fill) as any} fillOpacity={__s(c?.op) as any} stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="1" />
                      </Fragment>
                    ))}
                    {" "}
                    {__v?.showNum ? (
                      <>
                        {((__v?.cells) || []).map((c: any, i5: number) => (
                          <Fragment key={i5}>
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
                    <g transform="translate(738 147) rotate(9)">
                      <circle r="9" fill="#F29B1E" className="pulse" />
                      <circle r="9" fill="#F29B1E" stroke="#FFFFFF" strokeWidth="3" />
                    </g>
                    {" "}
                  </g>
                  {" "}
                  <rect width="1360" height="520" fill="url(#fadeB)" />
                  {" "}
                </svg>
                {" "}
                <div style={{"position":"absolute","left":"18px","bottom":"18px"} as any}>
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
                <span className="float" style={{"position":"absolute","right":"18px","top":"18px","height":"34px","padding":"0 12px","borderRadius":"17px","display":"flex","alignItems":"center","gap":"8px","fontSize":"13px","fontWeight":"500"} as any}>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                  {__s(__v?.idxNote)}
                </span>
              </section>
              <div className="col" style={{"gap":"14px"} as any}>
                <section className="card rise " style={{"--d":"3"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                  <div className="row sp">
                    <span className="lv lv-med">
                      <i />
                      {"Check this spot"}
                    </span>
                    <span className="tl">
                      {"NE corner, ~0.25 feddan"}
                    </span>
                  </div>
                  <h2 className="h3">
                    {"This corner looks weaker"}
                  </h2>
                  <p className="body">
                    {"It has been 20% less green than the rest of your field in the last two satellite images. It is also the driest corner. The satellite can't tell why, so please go and look."}
                  </p>
                  <span className="tl" style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                    {"What did you see there?"}
                  </span>
                  <div className="grid" style={{"gridTemplateColumns":"1fr 1fr","gap":"6px"} as any}>
                    {((__v?.seen) || []).map((o: any, i7: number) => (
                      <Fragment key={i7}>
                        <button type="button" className={__s(o?.cls) as any} onClick={o?.pick} aria-pressed={__s(o?.p) as any}>
                          {__s(o?.label)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <Link href="/field/north-plot/diagnose" className="btn cta press">
                    {"Take a photo"}
                    <span className="ar">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </Link>
                </section>
                <section className="card rise " style={{"--d":"4"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                  <div className="row sp">
                    <h2 className="h2">
                      {"This season vs a normal year"}
                    </h2>
                    <span className="pill pv-sat">
                      {"Satellite"}
                    </span>
                  </div>
                  <svg viewBox="0 0 320 150" width="100%" role="img" aria-label="Greenness this season tracks slightly above the 5 year average for North plot.">
                    <g stroke="#EDEDE9">
                      <path d="M0 30H320M0 70H320M0 110H320" />
                    </g>
                    <path d="M10 135C60 132 90 110 130 80S220 30 300 26" stroke="#B9BDB6" strokeWidth="2" strokeDasharray="4 5" fill="none" />
                    <path className="draw" pathLength="1" style={{"--d":"4"} as any} d="M10 136C50 130 80 112 110 92S150 70 170 64" stroke="#1F4A33" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle className="pop" style={{"--i":"8"} as any} cx="170" cy="64" r="6" fill="#1F4A33" stroke="#fff" strokeWidth="2.5" />
                    <g fontFamily="Hanken Grotesk, sans-serif" fontSize="10" fill="#8B918C">
                      <text x="8" y="148">
                        {"Oct"}
                      </text>
                      <text x="100" y="148">
                        {"Dec"}
                      </text>
                      <text x="196" y="148">
                        {"Feb"}
                      </text>
                      <text x="284" y="148">
                        {"Apr"}
                      </text>
                    </g>
                  </svg>
                  <div className="row" style={{"gap":"14px","fontSize":"12px","color":"var(--ink2)"} as any}>
                    <span className="row" style={{"gap":"6px"} as any}>
                      <i style={{"width":"14px","height":"3px","borderRadius":"2px","background":"var(--green)"} as any} />
                      {"This season"}
                    </span>
                    <span className="row" style={{"gap":"6px"} as any}>
                      <i style={{"width":"14px","height":"0","borderTop":"2px dashed #B9BDB6"} as any} />
                      {"Your 5 year normal"}
                    </span>
                  </div>
                  <p className="sub">
                    {"Slightly better than a normal year for mid November."}
                  </p>
                </section>
              </div>
            </div>
            {__v?.details ? (
              <>
                <div className="grid" style={{"gridTemplateColumns":"repeat(5, minmax(0, 1fr))"} as any}>
                  <section className="card rise " style={{"--d":"5","gap":"8px"} as any}>
                    <i className="sk " aria-hidden="true" style={{"--d":"5"} as any} />
                    <span className="tl">
                      {"NDVI, field median"}
                    </span>
                    <span className="num">
                      {"0.61"}
                      <small />
                    </span>
                    <span className="row wrap" style={{"gap":"4px"} as any}>
                      <span className="pill pv-sat">
                        {"Satellite"}
                      </span>
                      <span className="pill">
                        {"HLS 30 m"}
                      </span>
                    </span>
                  </section>
                  <section className="card rise " style={{"--d":"6","gap":"8px"} as any}>
                    <i className="sk " aria-hidden="true" style={{"--d":"6"} as any} />
                    <span className="tl">
                      {"EVI"}
                    </span>
                    <span className="num">
                      {"0.38"}
                      <small />
                    </span>
                    <span className="row wrap" style={{"gap":"4px"} as any}>
                      <span className="pill pv-sat">
                        {"Satellite"}
                      </span>
                      <span className="pill">
                        {"HLS 30 m"}
                      </span>
                    </span>
                  </section>
                  <section className="card rise " style={{"--d":"7","gap":"8px"} as any}>
                    <i className="sk " aria-hidden="true" style={{"--d":"7"} as any} />
                    <span className="tl">
                      {"NDMI, moisture"}
                    </span>
                    <span className="num">
                      {"0.22"}
                      <small />
                    </span>
                    <span className="row wrap" style={{"gap":"4px"} as any}>
                      <span className="pill pv-sat">
                        {"Satellite"}
                      </span>
                      <span className="pill">
                        {"HLS 30 m"}
                      </span>
                    </span>
                  </section>
                  <section className="card rise " style={{"--d":"8","gap":"8px"} as any}>
                    <i className="sk " aria-hidden="true" style={{"--d":"8"} as any} />
                    <span className="tl">
                      {"Surface temperature"}
                    </span>
                    <span className="num">
                      {"24"}
                      <small>
                        {" °C"}
                      </small>
                    </span>
                    <span className="row wrap" style={{"gap":"4px"} as any}>
                      <span className="pill pv-sat">
                        {"Satellite"}
                      </span>
                      <span className="pill">
                        {"ECOSTRESS 70 m, 27 Oct"}
                      </span>
                    </span>
                  </section>
                  <section className="card rise " style={{"--d":"9","gap":"8px"} as any}>
                    <i className="sk " aria-hidden="true" style={{"--d":"9"} as any} />
                    <span className="tl">
                      {"Root zone moisture"}
                    </span>
                    <span className="num">
                      {"0.31"}
                      <small>
                        {" m³/m³"}
                      </small>
                    </span>
                    <span className="row wrap" style={{"gap":"4px"} as any}>
                      <span className="pill pv-sat">
                        {"Satellite"}
                      </span>
                      <span className="pill">
                        {"SMAP 9 km"}
                      </span>
                    </span>
                  </section>
                </div>
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
                {"All numbers on this screen are demo data."}
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
