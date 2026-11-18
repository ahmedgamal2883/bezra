'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Data.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Data.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Data.logic';

export default function DataScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const __v = useDC(Logic, props);
  return (
    <>
      <div className="v2 root">
        <div className="shell">
          <header className="top">
            <Link href={__r("V18-Today") + ""} className="brand" aria-label="Bezra, Today">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <nav aria-label="Main" className="nav">
              <Link href={__r("V18-Today") + ""} aria-current="page" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                </svg>
                {"Today"}
              </Link>
              <Link href={__r("V18-Crop") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                </svg>
                {"Crop"}
              </Link>
              <Link href={__r("V19-Soil") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
                </svg>
                {"Soil"}
              </Link>
              <Link href={__r("V19-Season") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                </svg>
                {"Season"}
              </Link>
              <Link href={__r("V18-Journal") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4zM5 16a4 4 0 0 1 4-4h10" />
                </svg>
                {"Journal"}
              </Link>
            </nav>
            <div className="tools">
              <div role="group" aria-label="How much detail" className="seg">
                <button type="button" className={__s(__v?.segS) as any} onClick={__v?.pickS} aria-pressed={__s(__v?.isS) as any}>
                  {"Simple"}
                </button>
                <button type="button" className={__s(__v?.segD) as any} onClick={__v?.pickD} aria-pressed={__s(__v?.isD) as any}>
                  {"Details"}
                </button>
              </div>
              <Link href="/notifications" className="ibtn press" aria-label="Notifications">
                <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
                </svg>
                <span className="dot" />
              </Link>
              <Link href={__r("V18-Profile") + ""} className="who" aria-label="Your profile, fields and settings">
                <span className="av" aria-hidden="true">
                  {__s(__w.initials)}
                </span>
                <span>
                  <b>
                    {__s(__w.userName)}
                  </b>
                  <small>
                    {__s(__w.fieldLabel)}
                  </small>
                </span>
              </Link>
            </div>
          </header>
          <main className="main" style={{"gap":"28px","paddingTop":"8px"} as any}>
            {__v?.simple ? (
              <>
                <div className="col" style={{"gap":"28px","paddingTop":"24px"} as any}>
                  <div className="col" style={{"gap":"10px"} as any}>
                    <span className="meta" style={{"fontSize":"15px"} as any}>
                      {"North plot · from 7 NASA datasets and your journal"}
                    </span>
                    <h1 className="h1x">
                      {"Your field in six sentences."}
                    </h1>
                  </div>
                  <div className="col">
                    <div className="again" style={{"gridTemplateColumns":"56px minmax(0, 1fr)"} as any}>
                      <span className="rki" style={{"background":"#fff"} as any}>
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"The soil needs water today."}
                        </b>
                        <span className="txt" style={{"fontSize":"16px"} as any}>
                          {"It dried out since you watered on 22 Nov. No rain is coming this week."}
                        </span>
                      </span>
                    </div>
                    <div className="again" style={{"gridTemplateColumns":"56px minmax(0, 1fr)"} as any}>
                      <span className="rki" style={{"background":"#fff"} as any}>
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Your wheat is growing a little ahead of normal."}
                        </b>
                        <span className="txt" style={{"fontSize":"16px"} as any}>
                          {"It is as green as the middle of the last 10 seasons, a bit greener."}
                        </span>
                      </span>
                    </div>
                    <div className="again" style={{"gridTemplateColumns":"56px minmax(0, 1fr)"} as any}>
                      <span className="rki" style={{"background":"#fff"} as any}>
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Square C1 is behind, again."}
                        </b>
                        <span className="txt" style={{"fontSize":"16px"} as any}>
                          {"It was the weakest part in 7 of 10 seasons. Water reaches it last."}
                        </span>
                      </span>
                    </div>
                    <div className="again" style={{"gridTemplateColumns":"56px minmax(0, 1fr)"} as any}>
                      <span className="rki" style={{"background":"#fff"} as any}>
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"No heat this month. April is the risky month."}
                        </b>
                        <span className="txt" style={{"fontSize":"16px"} as any}>
                          {"Hot spring days went from about 3 a year to about 9."}
                        </span>
                      </span>
                    </div>
                    <div className="again" style={{"gridTemplateColumns":"56px minmax(0, 1fr)"} as any}>
                      <span className="rki" style={{"background":"#fff"} as any}>
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Your soil is clay and holds water well."}
                        </b>
                        <span className="txt" style={{"fontSize":"16px"} as any}>
                          {"The lowest corner, A4, can stay wet after a heavy watering."}
                        </span>
                      </span>
                    </div>
                    <div className="again" style={{"gridTemplateColumns":"56px minmax(0, 1fr)"} as any}>
                      <span className="rki" style={{"background":"#fff"} as any}>
                        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />
                        </svg>
                      </span>
                      <span className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Wheat has grown here 6 winters in a row."}
                        </b>
                        <span className="txt" style={{"fontSize":"16px"} as any}>
                          {"The soil is getting tired. Clover next winter would help."}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className="meta" style={{"fontSize":"14px"} as any}>
                    {"All the numbers and charts are in "}
                    <b style={{"color":"var(--ink)"} as any}>
                      {"Details"}
                    </b>
                    {" at the top."}
                  </span>
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"28px"} as any}>
                  <div className="row sp rise" style={{"--d":"0","alignItems":"flex-end"} as any}>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <span className="meta">
                        {"North plot · data sheet · read when the field was saved"}
                      </span>
                      <h1 className="big" style={{"fontSize":"44px","letterSpacing":"-1.6px"} as any}>
                        {"Everything satellites know about this field."}
                      </h1>
                    </div>
                    <span />
                  </div>
                  <section className="ident rise" style={{"--d":"1"} as any}>
                    <div className="hero" style={{"height":"240px","background":"#D9D6C8","borderRadius":"20px"} as any}>
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
                    </div>
                    <div className="col" style={{"gap":"6px","justifyContent":"center"} as any}>
                      <div className="facts">
                        <div>
                          <span className="meta">
                            {"Area"}
                          </span>
                          <b>
                            {"2.4 feddan"}
                          </b>
                          <span className="pq farm">
                            {"You drew it"}
                          </span>
                        </div>
                        <div>
                          <span className="meta">
                            {"Location"}
                          </span>
                          <b>
                            {"30.55° N, 31.01° E"}
                          </b>
                          <span className="pq farm">
                            {"GPS"}
                          </span>
                        </div>
                        <div>
                          <span className="meta">
                            {"Height"}
                          </span>
                          <b>
                            {"14 m"}
                          </b>
                          <span className="pq sat">
                            {"SRTM 30 m"}
                          </span>
                        </div>
                        <div>
                          <span className="meta">
                            {"Slope"}
                          </span>
                          <b>
                            {"0.3%"}
                          </b>
                          <span className="pq sat">
                            {"SRTM 30 m"}
                          </span>
                        </div>
                        <div>
                          <span className="meta">
                            {"Crop now"}
                          </span>
                          <b>
                            {"Wheat, day 28"}
                          </b>
                          <span className="pq sat">
                            {"From greenness"}
                          </span>
                        </div>
                        <div>
                          <span className="meta">
                            {"Sown on"}
                          </span>
                          <b>
                            {"5 Nov"}
                          </b>
                          <span className="pq farm">
                            {"Your journal"}
                          </span>
                        </div>
                        <div>
                          <span className="meta">
                            {"Land use"}
                          </span>
                          <b>
                            {"Farmland since 2001"}
                          </b>
                          <span className="pq sat">
                            {"MODIS land cover"}
                          </span>
                        </div>
                        <div>
                          <span className="meta">
                            {"Last clear image"}
                          </span>
                          <b>
                            {"1 Dec"}
                          </b>
                          <span className="pq sat">
                            {"Sentinel-2 via HLS"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>
                  <div className="ds rise" style={{"--d":"2"} as any}>
                    <nav className="idx" aria-label="On this page">
                      <a href="#glance" className="on">
                        {"At a glance"}
                        <small>
                          {"6"}
                        </small>
                      </a>
                      <a href="#green">
                        {"Crop greenness"}
                        <small>
                          {"2"}
                        </small>
                      </a>
                      <a href="#water">
                        {"Water"}
                        <small>
                          {"3"}
                        </small>
                      </a>
                      <a href="#heat">
                        {"Heat and weather"}
                        <small>
                          {"3"}
                        </small>
                      </a>
                      <a href="#land">
                        {"Land and soil"}
                        <small>
                          {"4"}
                        </small>
                      </a>
                      <a href="#climate">
                        {"Climate change here"}
                        <small>
                          {"2"}
                        </small>
                      </a>
                      <a href="#sources">
                        {"Data sources"}
                        <small>
                          {"7"}
                        </small>
                      </a>
                      <div className="col hair" style={{"gap":"8px","marginTop":"16px","paddingTop":"16px"} as any}>
                        <a href="#" className="btn soft sm press" style={{"justifyContent":"flex-start"} as any}>
                          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
                          </svg>
                          {"Download CSV"}
                        </a>
                        <a href="#" className="btn soft sm press" style={{"justifyContent":"flex-start"} as any}>
                          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 15V4m-4 4 4-4 4 4M5 13v6h14v-6" />
                          </svg>
                          {"Share with engineer"}
                        </a>
                      </div>
                    </nav>
                    <div className="col">
                      <section id="glance" className="dsec">
                        <span className="sec">
                          {"AT A GLANCE · TODAY"}
                        </span>
                        <p className="take">
                          {"The crop is a little ahead. The soil reached the refill line today, so water today."}
                        </p>
                        <div className="kpis r2">
                          <div className="kpi">
                            <span className="kl">
                              {"Crop greenness"}
                            </span>
                            <span className="kv">
                              {"0.31"}
                              <small>
                                {"NDVI"}
                              </small>
                            </span>
                            <div className="row sp" style={{"alignItems":"flex-end","gap":"8px"} as any}>
                              <span className="tag ok">
                                {"Normal for this week"}
                              </span>
                              <svg viewBox="0 0 120 32" width="120" height="32" aria-hidden="true">
                                <polyline points="0.0,29.0 24.0,27.0 48.0,23.0 72.0,17.0 96.0,11.0 120.0,3.0" fill="none" stroke="#3E7F35" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="pq sat">
                              {"HLS 30 m · 2 days ago"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Soil water, root zone"}
                            </span>
                            <span className="kv">
                              {"0.24"}
                              <small>
                                {"m³/m³"}
                              </small>
                            </span>
                            <div className="row sp" style={{"alignItems":"flex-end","gap":"8px"} as any}>
                              <span className="tag watch">
                                {"At refill · water today"}
                              </span>
                              <svg viewBox="0 0 120 32" width="120" height="32" aria-hidden="true">
                                <polyline points="0.0,3.0 24.0,6.7 48.0,14.1 72.0,10.4 96.0,21.6 120.0,29.0" fill="none" stroke="#2F6FA8" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="pq sat">
                              {"SMAP 9 km · today"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Rain, last 30 days"}
                            </span>
                            <span className="kv">
                              {"4"}
                              <small>
                                {"mm"}
                              </small>
                            </span>
                            <div className="row sp" style={{"alignItems":"flex-end","gap":"8px"} as any}>
                              <span className="tag watch">
                                {"Below normal"}
                              </span>
                              <svg viewBox="0 0 120 32" width="120" height="32" aria-hidden="true">
                                <polyline points="0.0,29.0 24.0,16.0 48.0,29.0 72.0,3.0 96.0,16.0 120.0,29.0" fill="none" stroke="#2F6FA8" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="pq sat">
                              {"GPM IMERG · yesterday"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Water the crop uses"}
                            </span>
                            <span className="kv">
                              {"1.9"}
                              <small>
                                {"mm / day"}
                              </small>
                            </span>
                            <div className="row sp" style={{"alignItems":"flex-end","gap":"8px"} as any}>
                              <span className="tag ok">
                                {"Normal"}
                              </span>
                              <svg viewBox="0 0 120 32" width="120" height="32" aria-hidden="true">
                                <polyline points="0.0,29.0 24.0,23.8 48.0,13.4 72.0,18.6 96.0,8.2 120.0,3.0" fill="none" stroke="#141A16" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="pq sat">
                              {"NASA POWER · yesterday"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Hottest day, next 7"}
                            </span>
                            <span className="kv">
                              {"27"}
                              <small>
                                {"°C"}
                              </small>
                            </span>
                            <div className="row sp" style={{"alignItems":"flex-end","gap":"8px"} as any}>
                              <span className="tag ok">
                                {"No heat risk"}
                              </span>
                              <svg viewBox="0 0 120 32" width="120" height="32" aria-hidden="true">
                                <polyline points="0.0,20.3 24.0,11.7 48.0,29.0 72.0,3.0 96.0,11.7 120.0,20.3" fill="none" stroke="#D9762B" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="pq sat">
                              {"NASA POWER forecast"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Leaf temperature"}
                            </span>
                            <span className="kv">
                              {"23"}
                              <small>
                                {"°C"}
                              </small>
                            </span>
                            <div className="row sp" style={{"alignItems":"flex-end","gap":"8px"} as any}>
                              <span className="tag ok">
                                {"Not stressed"}
                              </span>
                              <svg viewBox="0 0 120 32" width="120" height="32" aria-hidden="true">
                                <polyline points="0.0,3.0 24.0,16.0 48.0,16.0 72.0,29.0 96.0,16.0 120.0,29.0" fill="none" stroke="#D9762B" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
                              </svg>
                            </div>
                            <span className="pq sat">
                              {"ECOSTRESS 70 m · 5 days ago"}
                            </span>
                          </div>
                        </div>
                      </section>
                      <section id="green" className="dsec">
                        <span className="sec">
                          {"CROP GREENNESS"}
                        </span>
                        <p className="take">
                          {"This season started a little greener than the middle of the last 10. The north-east corner is behind again."}
                        </p>
                        <div className="chart">
                          <svg viewBox="0 0 980 260" width="100%" role="img" aria-label="Greenness this season compared with the last 10 seasons. This season is slightly above the middle so far.">
                            <line x1="40" x2="970" y1="198.5" y2="198.5" stroke="#E8E8E3" />
                            <text x="0" y="202.5" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"0.2"}
                            </text>
                            <line x1="40" x2="970" y1="143.6" y2="143.6" stroke="#E8E8E3" />
                            <text x="0" y="147.6" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"0.4"}
                            </text>
                            <line x1="40" x2="970" y1="88.7" y2="88.7" stroke="#E8E8E3" />
                            <text x="0" y="92.7" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"0.6"}
                            </text>
                            <line x1="40" x2="970" y1="33.7" y2="33.7" stroke="#E8E8E3" />
                            <text x="0" y="37.7" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"0.8"}
                            </text>
                            <path d="M40.0 203.5 L55.5 203.3 L71.0 203.0 L86.5 202.6 L102.0 202.1 L117.5 201.4 L133.0 200.5 L148.5 199.3 L164.0 197.8 L179.5 195.9 L195.0 193.5 L210.5 190.7 L226.0 187.2 L241.5 183.0 L257.0 178.1 L272.5 172.4 L288.0 165.8 L303.5 158.4 L319.0 150.2 L334.5 141.2 L350.0 131.5 L365.5 121.3 L381.0 110.7 L396.5 99.8 L412.0 89.0 L427.5 78.4 L443.0 68.4 L458.5 59.2 L474.0 51.1 L489.5 44.3 L505.0 39.1 L520.5 35.6 L536.0 33.9 L551.5 34.1 L567.0 36.1 L582.5 40.0 L598.0 45.6 L613.5 52.6 L629.0 61.0 L644.5 70.3 L660.0 80.5 L675.5 91.1 L691.0 102.0 L706.5 112.8 L722.0 123.4 L737.5 133.5 L753.0 143.1 L768.5 151.9 L784.0 160.0 L799.5 167.2 L815.0 173.6 L830.5 179.1 L846.0 183.9 L861.5 187.9 L877.0 191.3 L892.5 194.1 L908.0 196.3 L923.5 198.1 L939.0 199.6 L954.5 200.7 L970.0 201.6 L970.0 201.4 L954.5 200.6 L939.0 199.5 L923.5 198.2 L908.0 196.6 L892.5 194.6 L877.0 192.2 L861.5 189.4 L846.0 186.1 L830.5 182.3 L815.0 177.9 L799.5 173.1 L784.0 167.8 L768.5 162.0 L753.0 155.9 L737.5 149.4 L722.0 142.8 L706.5 136.1 L691.0 129.6 L675.5 123.3 L660.0 117.4 L644.5 112.2 L629.0 107.7 L613.5 104.1 L598.0 101.5 L582.5 100.0 L567.0 99.7 L551.5 100.5 L536.0 102.4 L520.5 105.4 L505.0 109.4 L489.5 114.2 L474.0 119.7 L458.5 125.8 L443.0 132.2 L427.5 138.8 L412.0 145.5 L396.5 152.0 L381.0 158.4 L365.5 164.4 L350.0 170.0 L334.5 175.1 L319.0 179.7 L303.5 183.9 L288.0 187.5 L272.5 190.6 L257.0 193.2 L241.5 195.4 L226.0 197.3 L210.5 198.8 L195.0 200.0 L179.5 201.0 L164.0 201.7 L148.5 202.3 L133.0 202.8 L117.5 203.1 L102.0 203.4 L86.5 203.6 L71.0 203.7 L55.5 203.8 L40.0 203.9 Z" fill="#3E7F35" fillOpacity=".12" />
                            <path d="M40.0 203.7 L55.5 203.6 L71.0 203.4 L86.5 203.1 L102.0 202.7 L117.5 202.3 L133.0 201.6 L148.5 200.8 L164.0 199.8 L179.5 198.4 L195.0 196.8 L210.5 194.7 L226.0 192.2 L241.5 189.1 L257.0 185.5 L272.5 181.3 L288.0 176.5 L303.5 170.9 L319.0 164.7 L334.5 157.8 L350.0 150.3 L365.5 142.3 L381.0 133.9 L396.5 125.2 L412.0 116.5 L427.5 107.8 L443.0 99.4 L458.5 91.6 L474.0 84.5 L489.5 78.4 L505.0 73.4 L520.5 69.7 L536.0 67.5 L551.5 66.7 L567.0 67.5 L582.5 69.7 L598.0 73.4 L613.5 78.4 L629.0 84.5 L644.5 91.6 L660.0 99.4 L675.5 107.8 L691.0 116.5 L706.5 125.2 L722.0 133.9 L737.5 142.3 L753.0 150.3 L768.5 157.8 L784.0 164.7 L799.5 170.9 L815.0 176.5 L830.5 181.3 L846.0 185.5 L861.5 189.1 L877.0 192.2 L892.5 194.7 L908.0 196.8 L923.5 198.4 L939.0 199.8 L954.5 200.8 L970.0 201.6" stroke="#7D9A73" strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
                            <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M40.0 203.7 L55.5 203.1 L71.0 202.4 L86.5 201.6 L102.0 200.7 L117.5 199.7 L133.0 198.6 L148.5 197.3 L164.0 195.7 L179.5 193.9 L195.0 191.7 L210.5 189.1 L226.0 186.1 L241.5 182.5 L257.0 178.4 L272.5 173.7 L288.0 168.3" stroke="#141A16" strokeWidth="2.6" fill="none" strokeLinecap="round" />
                            <line x1="291.1" x2="291.1" y1="20" y2="226" stroke="#141A16" strokeDasharray="2 3" />
                            <circle cx="291.1" cy="167.2" r="5" fill="#141A16" />
                            <text x="299.1" y="32" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#141A16">
                              {"Today 0.31"}
                            </text>
                            <text x="40.0" y="254" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                              {"Nov"}
                            </text>
                            <text x="195.0" y="254" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                              {"Dec"}
                            </text>
                            <text x="350.0" y="254" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                              {"Jan"}
                            </text>
                            <text x="505.0" y="254" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                              {"Feb"}
                            </text>
                            <text x="660.0" y="254" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                              {"Mar"}
                            </text>
                            <text x="815.0" y="254" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                              {"Apr"}
                            </text>
                            <text x="970.0" y="254" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                              {"May"}
                            </text>
                          </svg>
                          <div className="leg">
                            <span>
                              <i style={{"background":"#141A16"} as any} />
                              {"This season"}
                            </span>
                            <span>
                              <i style={{"background":"#7D9A73"} as any} />
                              {"Middle of 10 seasons"}
                            </span>
                            <span>
                              <i style={{"background":"#3E7F35","opacity":".25","height":"10px"} as any} />
                              {"Range of 10 seasons"}
                            </span>
                          </div>
                          <span className="pq sat">
                            {"MODIS 250 m 2000→, HLS 30 m 2015→"}
                          </span>
                        </div>
                        <div className="grid hair" style={{"gridTemplateColumns":"220px minmax(0, 1fr)","gap":"40px","paddingTop":"28px","alignItems":"center"} as any}>
                          <svg viewBox="0 0 220 220" width="220" role="img" aria-label="Greenness per 30 m square. The north-east corner is lowest.">
                            <rect x="4" y="4" width="52" height="52" rx="6" fill="#3E7F35" />
                            <text x="30" y="34" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.34"}
                            </text>
                            <rect x="58" y="4" width="52" height="52" rx="6" fill="#7FA65A" />
                            <text x="84" y="34" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.33"}
                            </text>
                            <rect x="112" y="4" width="52" height="52" rx="6" fill="#C9C77A" />
                            <text x="138" y="34" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.29"}
                            </text>
                            <rect x="166" y="4" width="52" height="52" rx="6" fill="#E0A43A" />
                            <text x="192" y="34" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.24"}
                            </text>
                            <rect x="4" y="58" width="52" height="52" rx="6" fill="#3E7F35" />
                            <text x="30" y="88" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.35"}
                            </text>
                            <rect x="58" y="58" width="52" height="52" rx="6" fill="#3E7F35" />
                            <text x="84" y="88" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.34"}
                            </text>
                            <rect x="112" y="58" width="52" height="52" rx="6" fill="#7FA65A" />
                            <text x="138" y="88" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.31"}
                            </text>
                            <rect x="166" y="58" width="52" height="52" rx="6" fill="#C9C77A" />
                            <text x="192" y="88" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.27"}
                            </text>
                            <rect x="4" y="112" width="52" height="52" rx="6" fill="#3E7F35" />
                            <text x="30" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.36"}
                            </text>
                            <rect x="58" y="112" width="52" height="52" rx="6" fill="#3E7F35" />
                            <text x="84" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.35"}
                            </text>
                            <rect x="112" y="112" width="52" height="52" rx="6" fill="#7FA65A" />
                            <text x="138" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.33"}
                            </text>
                            <rect x="166" y="112" width="52" height="52" rx="6" fill="#C9C77A" />
                            <text x="192" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.30"}
                            </text>
                            <rect x="4" y="166" width="52" height="52" rx="6" fill="#3E7F35" />
                            <text x="30" y="196" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.35"}
                            </text>
                            <rect x="58" y="166" width="52" height="52" rx="6" fill="#3E7F35" />
                            <text x="84" y="196" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.36"}
                            </text>
                            <rect x="112" y="166" width="52" height="52" rx="6" fill="#3E7F35" />
                            <text x="138" y="196" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.34"}
                            </text>
                            <rect x="166" y="166" width="52" height="52" rx="6" fill="#7FA65A" />
                            <text x="192" y="196" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#fff">
                              {"0.33"}
                            </text>
                          </svg>
                          <div className="col" style={{"gap":"12px"} as any}>
                            <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                              {"Each 30 m square of your field"}
                            </b>
                            <p className="txt">
                              {"Three squares in the north-east are under 0.30. That part was the weakest in 7 of the last 10 seasons, so it is a lasting problem, not this week's."}
                            </p>
                            <div className="leg">
                              <span>
                                <i style={{"background":"#3E7F35","height":"10px"} as any} />
                                {"0.34 and up"}
                              </span>
                              <span>
                                <i style={{"background":"#7FA65A","height":"10px"} as any} />
                                {"0.31–0.33"}
                              </span>
                              <span>
                                <i style={{"background":"#C9C77A","height":"10px"} as any} />
                                {"0.27–0.30"}
                              </span>
                              <span>
                                <i style={{"background":"#E0A43A","height":"10px"} as any} />
                                {"under 0.27"}
                              </span>
                            </div>
                            <span className="pq sat">
                              {"HLS 30 m, clear image of 1 Dec"}
                            </span>
                          </div>
                        </div>
                      </section>
                      <section id="water" className="dsec">
                        <span className="sec">
                          {"WATER"}
                        </span>
                        <p className="take">
                          {"Soil water has dropped since you watered on 22 Nov. It reached the refill line today. Rain will not help: November is almost dry here."}
                        </p>
                        <div className="grid" style={{"gridTemplateColumns":"minmax(0, 2fr) minmax(0, 1fr)","gap":"48px"} as any}>
                          <div className="chart">
                            <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                              {"Soil water in the root zone, last 12 months"}
                            </b>
                            <svg viewBox="0 0 700 210" width="100%" role="img" aria-label="Root-zone soil moisture over the last 12 months, now 0.24, close to the refill line.">
                              <rect x="36" y="44.2" width="654" height="67.9" fill="#2F6FA8" fillOpacity=".07" />
                              <line x1="36" x2="690" y1="44.2" y2="44.2" stroke="#2F6FA8" strokeDasharray="3 4" strokeOpacity=".6" />
                              <text x="690" y="39.2" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#2F6FA8">
                                {"Full 0.34"}
                              </text>
                              <line x1="36" x2="690" y1="112.1" y2="112.1" stroke="#B4660B" strokeDasharray="3 4" strokeOpacity=".6" />
                              <text x="690" y="107.1" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#B4660B">
                                {"Refill 0.25"}
                              </text>
                              <line x1="36" x2="690" y1="164.9" y2="164.9" stroke="#C2412A" strokeDasharray="3 4" strokeOpacity=".6" />
                              <text x="690" y="159.9" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#C2412A">
                                {"Plants struggle 0.18"}
                              </text>
                              <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M36.0 66.8 L64.4 74.4 L92.9 89.5 L121.3 104.5 L149.7 112.1 L178.2 81.9 L206.6 51.7 L235.0 59.3 L263.5 74.4 L291.9 97.0 L320.3 112.1 L348.8 119.6 L377.2 134.7 L405.7 104.5 L434.1 74.4 L462.5 81.9 L491.0 97.0 L519.4 112.1 L547.8 119.6 L576.3 104.5 L604.7 81.9 L633.1 89.5 L661.6 104.5 L690.0 119.6" stroke="#2F6FA8" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
                              <circle cx="690.0" cy="119.6" r="5" fill="#2F6FA8" />
                              <text x="36.0" y="206" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"Dec"}
                              </text>
                              <text x="145.0" y="206" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"Feb"}
                              </text>
                              <text x="254.0" y="206" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"Apr"}
                              </text>
                              <text x="363.0" y="206" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"Jun"}
                              </text>
                              <text x="472.0" y="206" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"Aug"}
                              </text>
                              <text x="581.0" y="206" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"Oct"}
                              </text>
                              <text x="690.0" y="206" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"Nov"}
                              </text>
                            </svg>
                            <span className="pq sat">
                              {"SMAP L4 9 km, scaled to your field"}
                            </span>
                          </div>
                          <div className="chart">
                            <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                              {"Rain per month"}
                            </b>
                            <svg viewBox="0 0 300 200" width="100%" role="img" aria-label="Rain per month this year against the normal. A little below normal.">
                              <rect className="grow" style={{"--i":"0"} as any} x="6" y="44" width="14" height="126" rx="3" fill="#2F6FA8" />
                              <line x1="4" x2="22" y1="58" y2="58" stroke="#141A16" strokeWidth="2" />
                              <text x="13" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"D"}
                              </text>
                              <rect className="grow" style={{"--i":"1"} as any} x="30" y="72" width="14" height="98" rx="3" fill="#2F6FA8" />
                              <line x1="28" x2="46" y1="44" y2="44" stroke="#141A16" strokeWidth="2" />
                              <text x="37" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"J"}
                              </text>
                              <rect className="grow" style={{"--i":"2"} as any} x="54" y="100" width="14" height="70" rx="3" fill="#2F6FA8" />
                              <line x1="52" x2="70" y1="72" y2="72" stroke="#141A16" strokeWidth="2" />
                              <text x="61" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"F"}
                              </text>
                              <rect className="grow" style={{"--i":"3"} as any} x="78" y="114" width="14" height="56" rx="3" fill="#2F6FA8" />
                              <line x1="76" x2="94" y1="100" y2="100" stroke="#141A16" strokeWidth="2" />
                              <text x="85" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"M"}
                              </text>
                              <rect className="grow" style={{"--i":"4"} as any} x="102" y="142" width="14" height="28" rx="3" fill="#2F6FA8" />
                              <line x1="100" x2="118" y1="128" y2="128" stroke="#141A16" strokeWidth="2" />
                              <text x="109" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"A"}
                              </text>
                              <rect className="grow" style={{"--i":"5"} as any} x="126" y="170" width="14" height="1" rx="3" fill="#2F6FA8" />
                              <line x1="124" x2="142" y1="156" y2="156" stroke="#141A16" strokeWidth="2" />
                              <text x="133" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"M"}
                              </text>
                              <rect className="grow" style={{"--i":"6"} as any} x="150" y="170" width="14" height="1" rx="3" fill="#2F6FA8" />
                              <line x1="148" x2="166" y1="170" y2="170" stroke="#141A16" strokeWidth="2" />
                              <text x="157" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"J"}
                              </text>
                              <rect className="grow" style={{"--i":"7"} as any} x="174" y="170" width="14" height="1" rx="3" fill="#2F6FA8" />
                              <line x1="172" x2="190" y1="170" y2="170" stroke="#141A16" strokeWidth="2" />
                              <text x="181" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"J"}
                              </text>
                              <rect className="grow" style={{"--i":"8"} as any} x="198" y="170" width="14" height="1" rx="3" fill="#2F6FA8" />
                              <line x1="196" x2="214" y1="170" y2="170" stroke="#141A16" strokeWidth="2" />
                              <text x="205" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"A"}
                              </text>
                              <rect className="grow" style={{"--i":"9"} as any} x="222" y="156" width="14" height="14" rx="3" fill="#2F6FA8" />
                              <line x1="220" x2="238" y1="156" y2="156" stroke="#141A16" strokeWidth="2" />
                              <text x="229" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"S"}
                              </text>
                              <rect className="grow" style={{"--i":"10"} as any} x="246" y="128" width="14" height="42" rx="3" fill="#2F6FA8" />
                              <line x1="244" x2="262" y1="114" y2="114" stroke="#141A16" strokeWidth="2" />
                              <text x="253" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"O"}
                              </text>
                              <rect className="grow" style={{"--i":"11"} as any} x="270" y="114" width="14" height="56" rx="3" fill="#2F6FA8" />
                              <line x1="268" x2="286" y1="86" y2="86" stroke="#141A16" strokeWidth="2" />
                              <text x="277" y="194" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"N"}
                              </text>
                            </svg>
                            <div className="leg">
                              <span>
                                <i style={{"background":"#2F6FA8","height":"10px"} as any} />
                                {"This year"}
                              </span>
                              <span>
                                <i style={{"background":"#141A16"} as any} />
                                {"Normal"}
                              </span>
                            </div>
                            <span className="pq sat">
                              {"GPM IMERG 10 km"}
                            </span>
                          </div>
                        </div>
                        <div className="kpis hair">
                          <div className="kpi">
                            <span className="kl">
                              {"Rain, whole season so far"}
                            </span>
                            <span className="kv">
                              {"11"}
                              <small>
                                {"mm"}
                              </small>
                            </span>
                            <span className="meta">
                              {"Normal is 18 mm"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Water the crop used this season"}
                            </span>
                            <span className="kv">
                              {"54"}
                              <small>
                                {"mm"}
                              </small>
                            </span>
                            <span className="meta">
                              {"Irrigation covered the rest"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Next likely rain"}
                            </span>
                            <span className="kv">
                              {"Dec"}
                              <small>
                                {"about 8 mm"}
                              </small>
                            </span>
                            <span className="meta">
                              {"From 25 years of December rain"}
                            </span>
                          </div>
                        </div>
                      </section>
                      <section id="heat" className="dsec">
                        <span className="sec">
                          {"HEAT AND WEATHER"}
                        </span>
                        <p className="take">
                          {"The season is running about 6% warmer than normal, so the crop is a few days ahead. The risky time is April."}
                        </p>
                        <div className="chart">
                          <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                            {"Heat units since sowing (growing degree days)"}
                          </b>
                          <svg viewBox="0 0 1080 220" width="100%" role="img" aria-label="Heat units since sowing, slightly ahead of the normal season.">
                            <line x1="40" x2="1070" y1="194.0" y2="194.0" stroke="#E8E8E3" />
                            <text x="0" y="198.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"0"}
                            </text>
                            <line x1="40" x2="1070" y1="120.7" y2="120.7" stroke="#E8E8E3" />
                            <text x="0" y="124.7" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"1000"}
                            </text>
                            <line x1="40" x2="1070" y1="47.3" y2="47.3" stroke="#E8E8E3" />
                            <text x="0" y="51.3" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"2000"}
                            </text>
                            <path d="M40.0 194.0 L74.3 191.7 L108.7 188.5 L143.0 184.9 L177.3 181.0 L211.7 176.8 L246.0 172.4 L280.3 167.8 L314.7 163.1 L349.0 158.2 L383.3 153.1 L417.7 148.0 L452.0 142.7 L486.3 137.3 L520.7 131.8 L555.0 126.2 L589.3 120.5 L623.7 114.7 L658.0 108.8 L692.3 102.8 L726.7 96.8 L761.0 90.7 L795.3 84.5 L829.7 78.3 L864.0 71.9 L898.3 65.5 L932.7 59.1 L967.0 52.6 L1001.3 46.0 L1035.7 39.4 L1070.0 32.7" stroke="#9EA39C" strokeWidth="1.6" strokeDasharray="4 4" fill="none" />
                            <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M40.0 194.0 L74.3 191.6 L108.7 188.2 L143.0 184.4 L177.3 180.2 L211.7 175.8 L246.0 171.1 L280.3 166.3 L314.7 161.2" stroke="#F29B1E" strokeWidth="2.6" fill="none" />
                            <line x1="399.5" x2="399.5" y1="14" y2="194" stroke="#E2E2DD" />
                            <text x="395.5" y="24" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#6A716C">
                              {"Tillering"}
                            </text>
                            <line x1="677.6" x2="677.6" y1="14" y2="194" stroke="#E2E2DD" />
                            <text x="673.6" y="24" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#6A716C">
                              {"Heading"}
                            </text>
                            <line x1="863.0" x2="863.0" y1="14" y2="194" stroke="#E2E2DD" />
                            <text x="859.0" y="24" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#6A716C">
                              {"Grain filling"}
                            </text>
                            <line x1="1069.0" x2="1069.0" y1="14" y2="194" stroke="#E2E2DD" />
                            <text x="1065.0" y="24" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#6A716C">
                              {"Harvest"}
                            </text>
                            <text x="40" y="214" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"Sowing"}
                            </text>
                            <text x="1070" y="214" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                              {"May"}
                            </text>
                          </svg>
                          <div className="leg">
                            <span>
                              <i style={{"background":"#F29B1E"} as any} />
                              {"This season"}
                            </span>
                            <span>
                              <i style={{"background":"#9EA39C"} as any} />
                              {"Normal season"}
                            </span>
                          </div>
                          <span className="pq sat">
                            {"NASA POWER daily temperature"}
                          </span>
                        </div>
                        <div className="kpis hair">
                          <div className="kpi">
                            <span className="kl">
                              {"Hot days over 32 °C in spring"}
                            </span>
                            <span className="kv">
                              {"9"}
                              <small>
                                {"a year now"}
                              </small>
                            </span>
                            <span className="meta">
                              {"It was 3 a year in the 1990s"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Frost nights in winter"}
                            </span>
                            <span className="kv">
                              {"0"}
                              <small>
                                {"in 10 years"}
                              </small>
                            </span>
                            <span className="meta">
                              {"Frost is not a risk here"}
                            </span>
                          </div>
                          <div className="kpi">
                            <span className="kl">
                              {"Sunshine"}
                            </span>
                            <span className="kv">
                              {"14.2"}
                              <small>
                                {"MJ/m² a day"}
                              </small>
                            </span>
                            <span className="meta">
                              {"Normal for November"}
                            </span>
                          </div>
                        </div>
                      </section>
                      <section id="land" className="dsec">
                        <span className="sec">
                          {"LAND AND SOIL"}
                        </span>
                        <p className="take">
                          {"Flat field, clay soil that holds water well. The low south-west corner can stay wet after a heavy watering."}
                        </p>
                        <div className="grid" style={{"gridTemplateColumns":"220px minmax(0, 1fr)","gap":"40px","alignItems":"center"} as any}>
                          <svg viewBox="0 0 220 240" width="220" role="img" aria-label="Height of the field. The south-west corner is about 40 cm lower.">
                            <rect x="4" y="4" width="52" height="52" rx="6" fill="rgb(196,190,156)" />
                            <rect x="58" y="4" width="52" height="52" rx="6" fill="rgb(206,198,164)" />
                            <rect x="112" y="4" width="52" height="52" rx="6" fill="rgb(216,206,172)" />
                            <rect x="166" y="4" width="52" height="52" rx="6" fill="rgb(226,214,180)" />
                            <rect x="4" y="58" width="52" height="52" rx="6" fill="rgb(174,172,138)" />
                            <rect x="58" y="58" width="52" height="52" rx="6" fill="rgb(184,180,146)" />
                            <rect x="112" y="58" width="52" height="52" rx="6" fill="rgb(194,188,154)" />
                            <rect x="166" y="58" width="52" height="52" rx="6" fill="rgb(204,196,162)" />
                            <rect x="4" y="112" width="52" height="52" rx="6" fill="rgb(152,154,120)" />
                            <rect x="58" y="112" width="52" height="52" rx="6" fill="rgb(162,162,128)" />
                            <rect x="112" y="112" width="52" height="52" rx="6" fill="rgb(172,170,136)" />
                            <rect x="166" y="112" width="52" height="52" rx="6" fill="rgb(182,178,144)" />
                            <rect x="4" y="166" width="52" height="52" rx="6" fill="rgb(130,136,102)" />
                            <rect x="58" y="166" width="52" height="52" rx="6" fill="rgb(140,144,110)" />
                            <rect x="112" y="166" width="52" height="52" rx="6" fill="rgb(150,152,118)" />
                            <rect x="166" y="166" width="52" height="52" rx="6" fill="rgb(160,160,126)" />
                            <text x="110" y="234" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#6A716C">
                              {"darker = lower ground"}
                            </text>
                          </svg>
                          <table className="tbl">
                            <thead>
                              <tr>
                                <th>
                                  {"What"}
                                </th>
                                <th>
                                  {"Value"}
                                </th>
                                <th>
                                  {"Means for you"}
                                </th>
                                <th>
                                  {"Source"}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {"Height"}
                                </td>
                                <td>
                                  {"14.2 – 14.6 m"}
                                </td>
                                <td>
                                  {"About 40 cm drop to the south-west"}
                                </td>
                                <td>
                                  <span className="pq sat">
                                    {"SRTM 30 m"}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  {"Soil type"}
                                </td>
                                <td>
                                  {"Clay, 48% clay"}
                                </td>
                                <td>
                                  {"Holds water, drains slowly"}
                                </td>
                                <td>
                                  <span className="pq est">
                                    {"ISRIC SoilGrids 250 m"}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  {"Water the soil can hold"}
                                </td>
                                <td>
                                  {"160 mm per metre"}
                                </td>
                                <td>
                                  {"About 10 days between waterings in spring"}
                                </td>
                                <td>
                                  <span className="pq est">
                                    {"From soil type"}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  {"Salt risk"}
                                </td>
                                <td>
                                  {"Low"}
                                </td>
                                <td>
                                  {"No white crust seen from space"}
                                </td>
                                <td>
                                  <span className="pq sat">
                                    {"HLS salinity index"}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="col hair" style={{"gap":"14px","paddingTop":"24px"} as any}>
                          <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                            {"What grew here, by season (read from greenness)"}
                          </b>
                          <div className="row" style={{"gap":"6px"} as any}>
                            <div className="crop">
                              <b style={{"background":"#E7D9A8","color":"#6B5410"} as any}>
                                {"Wheat"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"16/17"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#E7D9A8","color":"#6B5410"} as any}>
                                {"Wheat"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"17/18"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#CFE3C6","color":"#2D5B2A"} as any}>
                                {"Clover"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"18/19"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#E7D9A8","color":"#6B5410"} as any}>
                                {"Wheat"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"19/20"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#E7D9A8","color":"#6B5410"} as any}>
                                {"Wheat"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"20/21"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#CFE3C6","color":"#2D5B2A"} as any}>
                                {"Clover"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"21/22"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#E7D9A8","color":"#6B5410"} as any}>
                                {"Wheat"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"22/23"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#E7D9A8","color":"#6B5410"} as any}>
                                {"Wheat"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"23/24"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#E7D9A8","color":"#6B5410"} as any}>
                                {"Wheat"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"24/25"}
                              </span>
                            </div>
                            <div className="crop">
                              <b style={{"background":"#E7D9A8","color":"#6B5410"} as any}>
                                {"Wheat"}
                              </b>
                              <span className="meta" style={{"fontSize":"11px"} as any}>
                                {"25/26"}
                              </span>
                            </div>
                          </div>
                          <span className="meta">
                            {"Wheat 8 of 10 winters. Clover twice. Wheat every winter since 2021/22: peak greenness fell about 3% a year."}
                          </span>
                          <span className="pq est">
                            {"Crop type from the shape of the green-up curve"}
                          </span>
                        </div>
                      </section>
                      <section id="climate" className="dsec">
                        <span className="sec">
                          {"CLIMATE CHANGE HERE"}
                        </span>
                        <p className="take">
                          {"Your field is about 1.4 °C warmer than in 1990. Springs warmed the most."}
                        </p>
                        <div className="grid" style={{"gridTemplateColumns":"minmax(0, 2fr) minmax(0, 1fr)","gap":"48px","alignItems":"center"} as any}>
                          <div className="chart">
                            <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                              {"Average yearly temperature"}
                            </b>
                            <svg viewBox="0 0 700 190" width="100%" role="img" aria-label="Average yearly temperature from 1990 to 2025, up about 1.4 degrees.">
                              <line x1="36" x2="690" y1="164.0" y2="164.0" stroke="#E8E8E3" />
                              <text x="0" y="168.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"21°"}
                              </text>
                              <line x1="36" x2="690" y1="112.7" y2="112.7" stroke="#E8E8E3" />
                              <text x="0" y="116.7" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"22°"}
                              </text>
                              <line x1="36" x2="690" y1="61.3" y2="61.3" stroke="#E8E8E3" />
                              <text x="0" y="65.3" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"23°"}
                              </text>
                              <line x1="36" x2="690" y1="10.0" y2="10.0" stroke="#E8E8E3" />
                              <text x="0" y="14.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"24°"}
                              </text>
                              <circle cx="36.0" cy="133.2" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="54.7" cy="143.5" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="73.4" cy="117.8" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="92.1" cy="128.1" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="110.7" cy="138.3" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="129.4" cy="122.9" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="148.1" cy="112.7" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="166.8" cy="117.8" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="185.5" cy="107.5" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="204.2" cy="97.3" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="222.9" cy="112.7" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="241.5" cy="102.4" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="260.2" cy="92.1" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="278.9" cy="107.5" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="297.6" cy="87.0" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="316.3" cy="97.3" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="335.0" cy="81.9" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="353.7" cy="92.1" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="372.3" cy="76.7" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="391.0" cy="87.0" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="409.7" cy="71.6" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="428.4" cy="66.5" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="447.1" cy="81.9" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="465.8" cy="61.3" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="484.5" cy="71.6" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="503.1" cy="56.2" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="521.8" cy="66.5" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="540.5" cy="51.1" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="559.2" cy="61.3" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="577.9" cy="45.9" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="596.6" cy="56.2" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="615.3" cy="40.8" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="633.9" cy="51.1" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="652.6" cy="35.7" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="671.3" cy="45.9" r="3" fill="#D9762B" fillOpacity=".55" />
                              <circle cx="690.0" cy="30.5" r="3" fill="#D9762B" fillOpacity=".55" />
                              <line className="draw" pathLength="1" style={{"--d":"2"} as any} x1="36.0" y1="135.8" x2="690.0" y2="35.7" stroke="#141A16" strokeWidth="2.2" />
                              <text x="36.0" y="186" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"1990"}
                              </text>
                              <text x="222.9" y="186" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"2000"}
                              </text>
                              <text x="409.7" y="186" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"2010"}
                              </text>
                              <text x="690.0" y="186" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                                {"2025"}
                              </text>
                            </svg>
                            <span className="pq sat">
                              {"NASA POWER 1990→2025"}
                            </span>
                          </div>
                          <div className="col" style={{"gap":"12px"} as any}>
                            <span className="kl">
                              {"Farms that already have your future weather"}
                            </span>
                            <b style={{"fontSize":"20px","fontWeight":"600","lineHeight":"1.35"} as any}>
                              {"Fields near Beni Suef had today's Menoufia springs 15 years ago."}
                            </b>
                            <p className="txt">
                              {"They moved sowing earlier and switched to a heat-tolerant wheat."}
                            </p>
                            <Link href={__r("V19-Soil") + ""} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600"} as any}>
                              {"See climate twins"}
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9.5 6 6 6-6 6" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </section>
                      <section id="sources" className="dsec">
                        <span className="sec">
                          {"DATA SOURCES"}
                        </span>
                        <p className="take">
                          {"7 NASA datasets, 28,400 readings of this field. All loaded."}
                        </p>
                        <table className="tbl">
                          <thead>
                            <tr>
                              <th>
                                {"Dataset"}
                              </th>
                              <th>
                                {"What it gives"}
                              </th>
                              <th>
                                {"Detail"}
                              </th>
                              <th>
                                {"Years"}
                              </th>
                              <th>
                                {"Last update"}
                              </th>
                              <th>
                                {"Status"}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                {"NASA POWER"}
                              </td>
                              <td>
                                {"Daily weather, sun, water use"}
                              </td>
                              <td>
                                {"0.5°"}
                              </td>
                              <td>
                                {"1990 → today"}
                              </td>
                              <td>
                                {"Yesterday"}
                              </td>
                              <td>
                                <span className="row" style={{"gap":"6px","color":"var(--green)","fontWeight":"600"} as any}>
                                  <span className="tick" style={{"width":"18px","height":"18px"} as any}>
                                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                  </span>
                                  {"Loaded"}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {"MODIS"}
                              </td>
                              <td>
                                {"Greenness, land cover"}
                              </td>
                              <td>
                                {"250 m"}
                              </td>
                              <td>
                                {"2000 → today"}
                              </td>
                              <td>
                                {"3 days ago"}
                              </td>
                              <td>
                                <span className="row" style={{"gap":"6px","color":"var(--green)","fontWeight":"600"} as any}>
                                  <span className="tick" style={{"width":"18px","height":"18px"} as any}>
                                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                  </span>
                                  {"Loaded"}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {"HLS (Landsat + Sentinel-2)"}
                              </td>
                              <td>
                                {"Greenness per 30 m square"}
                              </td>
                              <td>
                                {"30 m"}
                              </td>
                              <td>
                                {"2015 → today"}
                              </td>
                              <td>
                                {"2 days ago"}
                              </td>
                              <td>
                                <span className="row" style={{"gap":"6px","color":"var(--green)","fontWeight":"600"} as any}>
                                  <span className="tick" style={{"width":"18px","height":"18px"} as any}>
                                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                  </span>
                                  {"Loaded"}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {"SMAP L4"}
                              </td>
                              <td>
                                {"Soil water, root zone"}
                              </td>
                              <td>
                                {"9 km"}
                              </td>
                              <td>
                                {"2015 → today"}
                              </td>
                              <td>
                                {"Today"}
                              </td>
                              <td>
                                <span className="row" style={{"gap":"6px","color":"var(--green)","fontWeight":"600"} as any}>
                                  <span className="tick" style={{"width":"18px","height":"18px"} as any}>
                                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                  </span>
                                  {"Loaded"}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {"GPM IMERG"}
                              </td>
                              <td>
                                {"Rain"}
                              </td>
                              <td>
                                {"10 km"}
                              </td>
                              <td>
                                {"2000 → today"}
                              </td>
                              <td>
                                {"Yesterday"}
                              </td>
                              <td>
                                <span className="row" style={{"gap":"6px","color":"var(--green)","fontWeight":"600"} as any}>
                                  <span className="tick" style={{"width":"18px","height":"18px"} as any}>
                                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                  </span>
                                  {"Loaded"}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {"ECOSTRESS"}
                              </td>
                              <td>
                                {"Leaf temperature"}
                              </td>
                              <td>
                                {"70 m"}
                              </td>
                              <td>
                                {"2018 → today"}
                              </td>
                              <td>
                                {"5 days ago"}
                              </td>
                              <td>
                                <span className="row" style={{"gap":"6px","color":"var(--green)","fontWeight":"600"} as any}>
                                  <span className="tick" style={{"width":"18px","height":"18px"} as any}>
                                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                  </span>
                                  {"Loaded"}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                {"SRTM"}
                              </td>
                              <td>
                                {"Height of the land"}
                              </td>
                              <td>
                                {"30 m"}
                              </td>
                              <td>
                                {"One map"}
                              </td>
                              <td>
                                {"—"}
                              </td>
                              <td>
                                <span className="row" style={{"gap":"6px","color":"var(--green)","fontWeight":"600"} as any}>
                                  <span className="tick" style={{"width":"18px","height":"18px"} as any}>
                                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                                    </svg>
                                  </span>
                                  {"Loaded"}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <span className="meta">
                          {"Big squares (SMAP 9 km, GPM 10 km) cover your whole area. We scale them to your field with HLS and your soil type, so they are marked Estimated where they are used."}
                        </span>
                      </section>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            <footer className="foot" style={{"paddingTop":"24px"} as any}>
              <span>
                {"Bezra helps you think. It doesn't decide for you."}
              </span>
              <span />
            </footer>
          </main>
          <Link href={__r("V18-Ask") + ""} className="fab press" aria-label="Ask Bezra" title="Ask Bezra">
            <svg aria-hidden="true" width="50" height="50" viewBox="0 0 60 60">
              <g className="">
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
          </Link>
        </div>
      </div>
    </>
  );
}
