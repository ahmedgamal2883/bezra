'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Today.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Today.logic.js
import { Fragment, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Tour from '@/v2/tour/Tour';
import { useV2Href } from '@/v2/routes';
import Logic from './Today.logic';
import { useTodayData, dayMonth } from '@/v2/data/today';
import { useField, useUser } from '@/lib/field';

export default function TodayScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const { id, field } = useField();
  const { user } = useUser();
  const d = useTodayData(id);
  const who = { userName: user?.name || '', initials: (user?.name || '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase(), fieldLabel: (field?.name || '') + ' ▾' };
  const __v = { ...useDC(Logic, { ...props, d: { ...d, dayMonth } }), ...who };
  // /today?log=1 (Add to journal from other pages) opens the journal drawer once
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current || typeof window === 'undefined') return;
    if (new URLSearchParams(window.location.search).get('log') === '1') { opened.current = true; __v.openLog?.(); }
  });
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
                  {__s(__v?.initials)}
                </span>
                <span>
                  <b>
                    {__s(__v?.userName)}
                  </b>
                  <small>
                    {__s(__v?.fieldLabel)}
                  </small>
                </span>
              </Link>
            </div>
          </header>
          <main className="main" style={{"gap":"24px","paddingTop":"16px"} as any}>
            {user?.guest ? (
              <div className="gbanner" role="status">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8h.01M11 12h1v5h1" /></svg>
                <span style={{"flex":"1","fontSize":"15px"} as any}><b style={{"fontWeight":"600"} as any}>{"You are using Bezra as a guest."}</b>{" This is your own copy of a sample field. It is kept for 7 days."}</span>
                <Link href="/signup" className="btn press" style={{"height":"42px"} as any}>{"Create an account to keep it"}</Link>
              </div>
            ) : null}
            {__v?.simple ? (
              <>
                <div className="col" style={{"gap":"20px"} as any}>
                  <div className="fhead rise" style={{"--d":"0"} as any}>
                    <span className="row" style={{"gap":"14px","alignItems":"baseline"} as any}>
                      <h1 style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {__s(__v?.headName)}
                      </h1>
                      <span className="meta" style={{"fontSize":"14px"} as any}>
                        {__s(__v?.headSub)}
                      </span>
                    </span>
                    <span className="pq sat">
                      {__s(__v?.fresh)}
                    </span>
                  </div>
                  <div className="today">
                    <section className="mapbox rise" style={{"--d":"1","height":"720px"} as any} aria-label="Map of your field">
                      {" "}
                      <svg role="img" aria-label={__s(__v?.mapLabel) as any} width="100%" height="100%" viewBox="400 66 570 460" preserveAspectRatio="xMidYMid slice" style={{"position":"absolute","inset":"0"} as any}>
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
                        <rect x="-400" y="-400" width="2160" height="1320" fill="#55603F" />
{__v?.photo ? <image href={__v.photo} x="0" y="0" width="1360" height="520" preserveAspectRatio="none" /> : <rect width="1360" height="520" fill="#C9CCBF" />}
                        {" "}
                        {__v?.dim ? (
                          <>
                            <rect width="1360" height="520" fill="#141A16" opacity=".28" className="fade" />
                          </>
                        ) : null}
                        {" "}
                        <g>
                          {((__v?.cells) || []).map((c: any, i3: number) => (
                            <Fragment key={i3}>
                              <g className="cell" role="button" tabIndex={0} aria-label={__s(c?.aria) as any} aria-pressed={__s(c?.pressed) as any} onClick={c?.tap} onKeyDown={c?.key}>
                                <rect x={__s(c?.x) as any} y={__s(c?.y) as any} width={__s(c?.w) as any} height={__s(c?.h) as any} fill={__s(c?.fill) as any} fillOpacity={__s(c?.op) as any} stroke="#FFFFFF" strokeOpacity=".6" strokeWidth="1" style={{"transition":"fill .35s ease, fill-opacity .25s ease"} as any} />
                                <text x={__s(c?.cx) as any} y={__s(c?.cy) as any} transform={__s(c?.tf) as any} textAnchor="middle" dominantBaseline="central" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="700" fill={__s(c?.ink) as any} opacity={__s(c?.tOp) as any} style={{"pointerEvents":"none"} as any}>
                                  {__s(c?.label)}
                                </text>
                              </g>
                            </Fragment>
                          ))}
                          {__v?.outline ? <polygon points={__v.outline} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity=".95" strokeLinejoin="round" style={{"pointerEvents":"none"} as any} /> : null}
                          <g transform={__s(__v?.mark) as any} opacity={__v?.hasSel ? 1 : 0} style={{"pointerEvents":"none"} as any}>
                            <circle r="7" fill="#FFFFFF" className="pulse" />
                            <circle r="6" fill="#FFFFFF" />
                            <circle r="3" fill="#141A16" />
                          </g>
                        </g>
                        {" "}
                        <rect width="1360" height="520" fill="url(#fadeB)" />
                        {" "}
                      </svg>
                      {" "}
                      <div className="mfloat lgd" style={{"left":"16px","top":"16px"} as any}>
                        <span>
                          <i style={{"background":"#3E7F35"} as any} />
                          {"Good"}
                        </span>
                        <span>
                          <i style={{"background":"#D9DE9C"} as any} />
                          {"Normal"}
                        </span>
                        <span>
                          <i style={{"background":"#E8962C"} as any} />
                          {"Needs a look"}
                        </span>
                      </div>
                      <div className="mfloat" style={{"right":"16px","bottom":"16px","left":"16px","padding":"20px 22px","display":"flex","flexDirection":"column","gap":"10px"} as any} role="status" aria-live="polite">
                        <span className="meta">
                          {"Tap any square of your field"}
                        </span>
                        <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                          {__s(__v?.sTitle)}
                        </b>
                        <p style={{"fontSize":"16px","lineHeight":"1.55","color":"var(--ink2)"} as any}>
                          {__s(__v?.sDesc)}
                        </p>
                        {__v?.sAct ? (
                          <>
                            <div className="row sp" style={{"gap":"16px"} as any}>
                              <div className="dots10" aria-hidden="true">
                                {((__v?.sHist) || []).map((h: any, i4: number) => (
                                  <Fragment key={i4}>
                                    <i className={__s(h?.cls) as any} />
                                  </Fragment>
                                ))}
                              </div>
                              <Link href={__r("V18-Story") + ""} className="btn press">
                                {"What should I do?"}
                              </Link>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </section>
                    <div className="col rise" style={{"--d":"2","gap":"26px","paddingTop":"4px"} as any}>
                      <div className="col" style={{"gap":"12px"} as any}>
                        <span className="row" style={{"gap":"12px"} as any}>
                          <svg aria-hidden="true" width="46" height="46" viewBox="0 0 60 60">
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
                          <span className="meta" style={{"fontSize":"15px"} as any}>
                            {__s(__v?.dateLong)}
                          </span>
                        </span>
                        <h2 style={{"fontSize":"44px","lineHeight":"1.08","fontWeight":"600","letterSpacing":"-1.6px"} as any}>
                          {__s(__v?.headT)}
                        </h2>
                        <p style={{"fontSize":"18px","color":"var(--ink2)"} as any}>
                          {__s(__v?.headS)}
                        </p>
                      </div>
                      <section className="col hair" aria-labelledby="todo-h">
                        <div className="tdh">
                          <h2 id="todo-h" className="sec">
                            {__s(__v?.todoTitle)}
                          </h2>
                          <span className="row" style={{"gap":"10px","visibility":__v?.hasTodo ? "visible" : "hidden"} as any}>
                            <span className="meta">
                              {__s(__v?.nDone)}
                            </span>
                            <span className="prog" aria-hidden="true">
                              <i style={__css(__v?.progW)} />
                            </span>
                          </span>
                        </div>
                        <div className="col" style={{"marginTop":"6px"} as any}>
                          {((__v?.todo) || []).map((k: any, i5: number) => (
                            <Fragment key={i5}>
                              <div className={__s(k?.cls) as any}>
                                <button type="button" className={__s(k?.box) as any} role="checkbox" aria-checked={__s(k?.checked) as any} aria-label={__s(k?.label) as any} onClick={k?.toggle}>
                                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                                  </svg>
                                </button>
                                <div className="col" style={{"minWidth":"0"} as any}>
                                  <span className="tt">
                                    {__s(k?.t)}
                                  </span>
                                  <span className="ts">
                                    {__s(k?.s)}
                                  </span>
                                  {k?.hasG ? (
                                    <>
                                      <span className="tg">
                                        {__s(k?.g)}
                                      </span>
                                    </>
                                  ) : null}
                                  {k?.askOpen ? (
                                    <>
                                      <div className="achips">
                                        <span className="meta" style={{"marginRight":"4px"} as any}>
                                          {__s(k?.askQ)}
                                        </span>
                                        {((k?.asks) || []).map((a: any, i6: number) => (
                                          <Fragment key={i6}>
                                            <button type="button" className="press" onClick={a?.pick}>
                                              {__s(a?.label)}
                                            </button>
                                          </Fragment>
                                        ))}
                                      </div>
                                    </>
                                  ) : null}
                                  {k?.hasAnswer ? (
                                    <>
                                      <span className="meta" style={{"marginTop":"8px","color":"var(--green)","fontWeight":"600"} as any}>
                                        {__s(k?.answered)}
                                      </span>
                                    </>
                                  ) : null}
                                </div>
                                <span className={__s(k?.tc) as any} style={{"marginTop":"4px"} as any}>
                                  {__s(k?.tag)}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        {__v?.noTodo ? <p className="meta" style={{"padding":"14px 0 4px","fontSize":"15px"} as any}>{"Nothing to do today."}{__v?.hasComing ? " Your next tasks are under Coming up." : ""}</p> : null}
                        {__v?.allDone ? (
                          <>
                            <div className="alldone">
                              <svg aria-hidden="true" width="40" height="40" viewBox="0 0 60 60">
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
                                  <path d="M24 36q6 7 12 0z" fill="#3A2A10" />
                                  <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                                  <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                                </g>
                              </svg>
                              <span>
                                {__s(__v?.allDoneTxt)}
                              </span>
                            </div>
                          </>
                        ) : null}
                        <details className="col" style={{"gap":"0","marginTop":"4px"} as any}>
                          <summary className="row" style={{"gap":"8px","cursor":"pointer","padding":"10px 0","fontSize":"14px","fontWeight":"600","listStyle":"none"} as any}>
                            <svg style={{"transform":"rotate(90deg)"} as any} aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9.5 6 6 6-6 6" />
                            </svg>
                            {__s(__v?.comingTxt)}
                          </summary>
                          {((__v?.coming) || []).map((u: any, iu: number) => (
                            <div className="up" key={iu}>
                              <span className="dpill">{__s(u?.d)}</span>
                              <span className="col" style={{"gap":"2px"} as any}>
                                <b>{__s(u?.t)}</b>
                                <span className="meta">{__s(u?.s)}</span>
                              </span>
                            </div>
                          ))}
                          
                          
                          <Link href={__r("V19-Season") + ""} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600","paddingTop":"6px"} as any}>
                            {"See the whole season"}
                            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9.5 6 6 6-6 6" />
                            </svg>
                          </Link>
                        </details>
                      </section>
                      {__v?.ckAsk ? (
                        <>
                          <div className="chk">
                            <span className="row" style={{"gap":"8px","fontSize":"13px","fontWeight":"600","color":"var(--muted)"} as any}>
                              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                              </svg>
                              {__s(__v?.ckLabel)}
                            </span>
                            <b style={{"fontSize":"18px","fontWeight":"600","lineHeight":"1.4"} as any}>
                              {__s(__v?.ckQ)}
                            </b>
                            <div className="row" style={{"gap":"8px"} as any}>
                              <button type="button" className="btn press" onClick={__v?.openLeaf}>
                                {__s(__v?.ckYesBtn)}
                              </button>
                              <button type="button" className="btn soft press" onClick={__v?.ckSayNo}>
                                {__s(__v?.ckNoBtn)}
                              </button>
                              <button type="button" className="btn soft press" onClick={__v?.ckSayUnsure}>
                                {"Not sure"}
                              </button>
                            </div>
                          </div>
                        </>
                      ) : null}
                      {__v?.ckNo ? (
                        <>
                          <div className="chk">
                            <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                              {__s(__v?.ckMsg)}
                            </b>
                          </div>
                        </>
                      ) : null}
                      {__v?.ckUnsure ? (
                        <>
                          <div className="chk">
                            <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                              {__s(__v?.ckMsg)}
                            </b>
                          </div>
                        </>
                      ) : null}
                      {__v?.ckYes ? (
                        <>
                          <div className="chk">
                            <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                              {__s(__v?.ckMsg)}
                            </b>
                          </div>
                        </>
                      ) : null}
                      <section className="col" style={{"gap":"10px"} as any} aria-labelledby="wk-h">
                        <h2 id="wk-h" className="sec">
                          {"THIS WEEK"}
                        </h2>
                        <div className="wk">
                          {((__v?.wk) || []).map((w: any, iw: number) => (
                            <Link key={iw} href={__r("V18-Crop") + ""} className="press" style={{"display":"flex","flexDirection":"column","gap":"6px","padding":"16px","borderRadius":"16px","background":"#fff"} as any}>
                              <span className="meta" style={{"fontSize":"14px"} as any}>{__s(w?.label)}</span>
                              <span className="lvl" style={__css(w?.col)}><i style={__css(w?.sw)} />{__s(w?.value)}</span>
                            </Link>
                          ))}
                        </div>
                      </section>
                      <section className="col" style={{"gap":"6px"} as any} aria-labelledby="jn-h">
                        <div className="row sp">
                          <h2 id="jn-h" className="sec">
                            {"YOUR JOURNAL"}
                          </h2>
                          <Link href={__r("V18-Journal") + ""} className="row" style={{"gap":"4px","fontSize":"14px","fontWeight":"600"} as any}>
                            {"See all"}
                            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9.5 6 6 6-6 6" />
                            </svg>
                          </Link>
                        </div>
                        {((__v?.recent) || []).map((r: any, i7: number) => (
                          <Fragment key={i7}>
                            <div className="jrow">
                              <span className={__s(r?.cls) as any}>
                                {r?.isWater ? (
                                  <>
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                                    </svg>
                                  </>
                                ) : null}
                                {r?.isLeaf ? (
                                  <>
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                                    </svg>
                                  </>
                                ) : null}
                                {r?.isFeed ? (
                                  <>
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />
                                    </svg>
                                  </>
                                ) : null}
                                {r?.isPest ? (
                                  <>
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                                    </svg>
                                  </>
                                ) : null}
                                {r?.isSpray ? (
                                  <>
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
                                    </svg>
                                  </>
                                ) : null}
                                {r?.isPhoto ? (
                                  <>
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                    </svg>
                                  </>
                                ) : null}
                              </span>
                              <span className="col" style={{"gap":"2px","minWidth":"0"} as any}>
                                <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                                  {__s(r?.t)}
                                </b>
                                <span className="meta">
                                  {__s(r?.w)}
                                  {r?.w && r?.o ? " · " : ""}
                                  {__s(r?.o)}
                                </span>
                              </span>
                              <span className="meta">
                                {__s(r?.d)}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                        <button type="button" className="btn press" onClick={__v?.openLog} style={{"alignSelf":"flex-start","marginTop":"8px","height":"50px"} as any}>
                          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          {"Add to journal"}
                        </button>
                      </section>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"24px"} as any}>
                  <div className="fhead rise" style={{"--d":"0"} as any}>
                    <h1 style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__s(__v?.headName)}
                    </h1>
                    <span className="row" style={{"gap":"18px"} as any}>
                      <span className="meta" style={{"fontSize":"14px"} as any}>
                        {__s(__v?.headSub)}
                      </span>
                      <span className="pq sat">
                        {__s(__v?.fresh)}
                      </span>
                    </span>
                  </div>
                  <div className="today">
                    <div className="col" style={{"gap":"12px"} as any}>
                      <div className="row sp rise" style={{"--d":"1","gap":"12px","flexWrap":"wrap"} as any}>
                        <div role="group" aria-label="Map layer" className="lyr" style={{"background":"#E9E9E5"} as any}>
                          {((__v?.layers) || []).map((l: any, i8: number) => (
                            <Fragment key={i8}>
                              <button type="button" className={__s(l?.cls) as any} aria-pressed={__s(l?.pressed) as any} onClick={l?.pick}>
                                {__s(l?.label)}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div className="row" style={{"gap":"10px"} as any}>
                          <span className="meta">
                            {"Image"}
                          </span>
                          <div role="group" aria-label="Image date" className="dates">
                            {((__v?.dates) || []).map((d: any, i9: number) => (
                              <Fragment key={i9}>
                                <button type="button" className={__s(d?.cls) as any} aria-pressed={__s(d?.pressed) as any} onClick={d?.pick} style={{"background":"#E9E9E5"} as any}>
                                  {__s(d?.label)}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </div>
                      <section className="mapbox rise" style={{"--d":"1"} as any} aria-label="Field map with layers">
                        {" "}
                        <svg role="img" aria-label={__s(__v?.mapLabel) as any} width="100%" height="100%" viewBox="400 66 570 460" preserveAspectRatio="xMidYMid slice" style={{"position":"absolute","inset":"0"} as any}>
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
                          <rect x="-400" y="-400" width="2160" height="1320" fill="#55603F" />
{__v?.photo ? <image href={__v.photo} x="0" y="0" width="1360" height="520" preserveAspectRatio="none" /> : <rect width="1360" height="520" fill="#C9CCBF" />}
                          {" "}
                          {__v?.dim ? (
                            <>
                              <rect width="1360" height="520" fill="#141A16" opacity=".28" className="fade" />
                            </>
                          ) : null}
                          {" "}
                          <g>
                            {((__v?.cells) || []).map((c: any, i13: number) => (
                              <Fragment key={i13}>
                                <g className="cell" role="button" tabIndex={0} aria-label={__s(c?.aria) as any} aria-pressed={__s(c?.pressed) as any} onClick={c?.tap} onKeyDown={c?.key}>
                                  <rect x={__s(c?.x) as any} y={__s(c?.y) as any} width={__s(c?.w) as any} height={__s(c?.h) as any} fill={__s(c?.fill) as any} fillOpacity={__s(c?.op) as any} stroke="#FFFFFF" strokeOpacity=".6" strokeWidth="1" style={{"transition":"fill .35s ease, fill-opacity .25s ease"} as any} />
                                  <text x={__s(c?.cx) as any} y={__s(c?.cy) as any} transform={__s(c?.tf) as any} textAnchor="middle" dominantBaseline="central" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="700" fill={__s(c?.ink) as any} opacity={__s(c?.tOp) as any} style={{"pointerEvents":"none"} as any}>
                                    {__s(c?.label)}
                                  </text>
                                </g>
                              </Fragment>
                            ))}
                            {__v?.outline ? <polygon points={__v.outline} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity=".95" strokeLinejoin="round" style={{"pointerEvents":"none"} as any} /> : null}
                            <g transform={__s(__v?.mark) as any} opacity={__v?.hasSel ? 1 : 0} style={{"pointerEvents":"none"} as any}>
                              <circle r="7" fill="#FFFFFF" className="pulse" />
                              <circle r="6" fill="#FFFFFF" />
                              <circle r="3" fill="#141A16" />
                            </g>
                          </g>
                          {" "}
                          <rect width="1360" height="520" fill="url(#fadeB)" />
                          {" "}
                        </svg>
                        {" "}
                        <div className="mfloat" style={{"right":"16px","bottom":"16px","width":"300px","padding":"18px 20px","display":"flex","flexDirection":"column","gap":"10px"} as any} role="status" aria-live="polite">
                          <span className="meta">
                            {__s(__v?.dName)}
                          </span>
                          <span className="row" style={{"alignItems":"baseline","gap":"6px"} as any}>
                            <b style={{"fontSize":"34px","fontWeight":"600","letterSpacing":"-1px"} as any}>
                              {__s(__v?.dVal)}
                            </b>
                            <span className="meta">
                              {__s(__v?.dUnit)}
                              {" · "}
                              {__s(__v?.dLayer)}
                            </span>
                          </span>
                          <div className="row sp meta">
                            <span>
                              {"Field average "}
                              {__s(__v?.dAvg)}
                            </span>
                            <b style={{"color":"var(--ink)","fontWeight":"600"} as any}>
                              {__s(__v?.dDiff)}
                            </b>
                          </div>
                          <div className="col hair" style={{"gap":"8px","paddingTop":"10px"} as any}>
                            <span className="meta">
                              {__s(__v?.dWeak)}
                            </span>
                            <div className="dots10" aria-hidden="true">
                              {((__v?.dHist) || []).map((h: any, i14: number) => (
                                <Fragment key={i14}>
                                  <i className={__s(h?.cls) as any} style={{"width":"18px","height":"18px"} as any} />
                                </Fragment>
                              ))}
                            </div>
                          </div>
                          <span className="pq sat">
                            {__s(__v?.dSrc)}
                          </span>
                        </div>
                        <div className="mfloat lgd" style={{"left":"16px","top":"16px"} as any}>
                          {((__v?.legend) || []).map((g: any, i15: number) => (
                            <Fragment key={i15}>
                              <span>
                                <i style={__css(g?.sw)} />
                                {__s(g?.t)}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </section>
                    </div>
                    <div className="col rise" style={{"--d":"2","gap":"22px","paddingTop":"8px"} as any}>
                      <div className="col" style={{"gap":"10px"} as any}>
                        <span className="row" style={{"gap":"10px"} as any}>
                          <svg aria-hidden="true" width="40" height="40" viewBox="0 0 60 60">
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
                          <span className="meta">
                            {__s(__v?.dateLong)}
                          </span>
                        </span>
                        <h1 className="big" style={{"fontSize":"44px","letterSpacing":"-1.6px"} as any}>
                          {__s(__v?.headT)}
                        </h1>
                        <p className="txt" style={{"fontSize":"17px"} as any}>
                          {__s(__v?.headS)}
                        </p>
                      </div>
                      <section className="col hair" aria-labelledby="todo-hd">
                        <div className="tdh">
                          <h2 id="todo-hd" className="sec">
                            {__s(__v?.todoTitle)}
                          </h2>
                          <span className="row" style={{"gap":"10px","visibility":__v?.hasTodo ? "visible" : "hidden"} as any}>
                            <span className="meta">
                              {__s(__v?.nDone)}
                            </span>
                            <span className="prog" aria-hidden="true">
                              <i style={__css(__v?.progW)} />
                            </span>
                          </span>
                        </div>
                        <div className="col" style={{"marginTop":"6px"} as any}>
                          {((__v?.todo) || []).map((k: any, i16: number) => (
                            <Fragment key={i16}>
                              <div className={__s(k?.cls) as any}>
                                <button type="button" className={__s(k?.box) as any} role="checkbox" aria-checked={__s(k?.checked) as any} aria-label={__s(k?.label) as any} onClick={k?.toggle}>
                                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                                  </svg>
                                </button>
                                <div className="col" style={{"minWidth":"0"} as any}>
                                  <span className="tt">
                                    {__s(k?.t)}
                                  </span>
                                  <span className="ts">
                                    {__s(k?.ds)}
                                  </span>
                                  {k?.hasG ? (
                                    <>
                                      <span className="tg">
                                        {__s(k?.g)}
                                      </span>
                                    </>
                                  ) : null}
                                  {k?.askOpen ? (
                                    <>
                                      <div className="achips">
                                        <span className="meta" style={{"marginRight":"4px"} as any}>
                                          {__s(k?.askQ)}
                                        </span>
                                        {((k?.asks) || []).map((a: any, i17: number) => (
                                          <Fragment key={i17}>
                                            <button type="button" className="press" onClick={a?.pick}>
                                              {__s(a?.label)}
                                            </button>
                                          </Fragment>
                                        ))}
                                      </div>
                                    </>
                                  ) : null}
                                  {k?.hasAnswer ? (
                                    <>
                                      <span className="meta" style={{"marginTop":"8px","color":"var(--green)","fontWeight":"600"} as any}>
                                        {__s(k?.answered)}
                                      </span>
                                    </>
                                  ) : null}
                                </div>
                                <span className={__s(k?.tc) as any} style={{"marginTop":"4px"} as any}>
                                  {__s(k?.tag)}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                        {__v?.noTodo ? <p className="meta" style={{"padding":"14px 0 4px","fontSize":"15px"} as any}>{"Nothing to do today."}{__v?.hasComing ? " Your next tasks are under Coming up." : ""}</p> : null}
                        {__v?.allDone ? (
                          <>
                            <div className="alldone">
                              <svg aria-hidden="true" width="40" height="40" viewBox="0 0 60 60">
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
                                  <path d="M24 36q6 7 12 0z" fill="#3A2A10" />
                                  <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                                  <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                                </g>
                              </svg>
                              <span>
                                {__s(__v?.allDoneTxt)}
                              </span>
                            </div>
                          </>
                        ) : null}
                        <details className="col" style={{"gap":"0","marginTop":"4px"} as any}>
                          <summary className="row" style={{"gap":"8px","cursor":"pointer","padding":"10px 0","fontSize":"14px","fontWeight":"600","listStyle":"none"} as any}>
                            <svg style={{"transform":"rotate(90deg)"} as any} aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9.5 6 6 6-6 6" />
                            </svg>
                            {__s(__v?.comingTxt)}
                          </summary>
                          {((__v?.coming) || []).map((u: any, iu: number) => (
                            <div className="up" key={iu}>
                              <span className="dpill">{__s(u?.d)}</span>
                              <span className="col" style={{"gap":"2px"} as any}>
                                <b>{__s(u?.t)}</b>
                                <span className="meta">{__s(u?.s)}</span>
                              </span>
                            </div>
                          ))}
                          
                          
                          <Link href={__r("V19-Season") + ""} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600","paddingTop":"6px"} as any}>
                            {"See the whole season"}
                            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m9.5 6 6 6-6 6" />
                            </svg>
                          </Link>
                        </details>
                      </section>
                      {__v?.ckAsk ? (
                        <>
                          <div className="chk" style={{"background":"#fff","marginTop":"8px"} as any}>
                            <span className="row" style={{"gap":"8px","fontSize":"13px","fontWeight":"600","color":"var(--muted)"} as any}>
                              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                              </svg>
                              {__s(__v?.ckLabel)}
                            </span>
                            <b style={{"fontSize":"18px","fontWeight":"600","lineHeight":"1.4"} as any}>
                              {__s(__v?.ckQ)}
                            </b>
                            <div className="row" style={{"gap":"8px"} as any}>
                              <button type="button" className="btn press" onClick={__v?.openLeaf}>
                                {__s(__v?.ckYesBtn)}
                              </button>
                              <button type="button" className="btn soft press" onClick={__v?.ckSayNo}>
                                {__s(__v?.ckNoBtn)}
                              </button>
                              <button type="button" className="btn soft press" onClick={__v?.ckSayUnsure}>
                                {"Not sure"}
                              </button>
                            </div>
                          </div>
                        </>
                      ) : null}
                      {__v?.ckNo ? (
                        <>
                          <div className="chk" style={{"background":"#fff","marginTop":"8px"} as any}>
                            <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                              {__s(__v?.ckMsg)}
                            </b>
                          </div>
                        </>
                      ) : null}
                      {__v?.ckUnsure ? (
                        <>
                          <div className="chk" style={{"background":"#fff","marginTop":"8px"} as any}>
                            <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                              {__s(__v?.ckMsg)}
                            </b>
                          </div>
                        </>
                      ) : null}
                      {__v?.ckYes ? (
                        <>
                          <div className="chk" style={{"background":"#fff","marginTop":"8px"} as any}>
                            <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                              {__s(__v?.ckMsg)}
                            </b>
                          </div>
                        </>
                      ) : null}
                      <section className="col hair" aria-labelledby="dr-h">
                        <h2 id="dr-h" className="sec" style={{"padding":"16px 0 4px"} as any}>
                          {"THIS WEEK"}
                        </h2>
                        {((__v?.wkD) || []).map((w: any, iw: number) => (
                          <div className="risk" key={iw}>
                            <b style={{"fontWeight":"600"} as any}>{__s(w?.label)}</b>
                            <span className="lvl" style={__css(w?.col)}><i style={__css(w?.sw)} />{__s(w?.value)}</span>
                            <span className="meta">{__s(w?.line)}</span>
                          </div>
                        ))}
                        
                        
                        
                      </section>
                    </div>
                  </div>
                  <section className="col hair rise" style={{"--d":"4","gap":"6px","paddingTop":"22px"} as any} aria-labelledby="k-h">
                    <div className="row sp">
                      <h2 id="k-h" className="sec">
                        {"THE FIELD TODAY, FROM SPACE"}
                      </h2>
                      <Link href={__r("V18-Data") + ""} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600"} as any}>
                        {"Open the full data sheet"}
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9.5 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                    <div className="kpis" style={{"gridTemplateColumns":"repeat(6, minmax(0, 1fr))"} as any}>
                      {((__v?.kpis) || []).map((q: any, iq: number) => (
                        <div className="kpi" key={iq}>
                          <span className="kl">{__s(q?.l)}</span>
                          <span className="kv">{__s(q?.v)}<small>{__s(q?.u)}</small></span>
                          <div className="row sp" style={{"alignItems":"flex-end","gap":"8px"} as any}>
                            <span className={__s(q?.tagCls) as any}>{__s(q?.tag)}</span>
                            {q?.pts ? <svg viewBox="0 0 70 26" width="70" height="26" aria-hidden="true"><polyline points={q.pts} fill="none" stroke={q.stroke} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" /></svg> : null}
                          </div>
                          <span className={__s(q?.srcCls) as any}>{__s(q?.src)}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
                <section className="col hair" style={{"gap":"6px","paddingTop":"22px"} as any} aria-labelledby="jt-h">
                  <div className="row sp">
                    <h2 id="jt-h" className="sec">
                      {"JOURNAL · LAST 3 NOTES AND WHAT THEY CHANGED"}
                    </h2>
                    <span className="row" style={{"gap":"10px"} as any}>
                      <button type="button" className="btn sm press" onClick={__v?.openLog}>
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        {"Add to journal"}
                      </button>
                      <Link href={__r("V18-JournalD") + ""} className="btn soft sm press">
                        {"Open journal"}
                      </Link>
                    </span>
                  </div>
                  {((__v?.recent) || []).map((r: any, i18: number) => (
                    <Fragment key={i18}>
                      <div className="jrow" style={{"gridTemplateColumns":"44px minmax(0, 1fr) minmax(0, 1fr) 90px"} as any}>
                        <span className={__s(r?.cls) as any}>
                          {r?.isWater ? (
                            <>
                              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                              </svg>
                            </>
                          ) : null}
                          {r?.isLeaf ? (
                            <>
                              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                              </svg>
                            </>
                          ) : null}
                          {r?.isFeed ? (
                            <>
                              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />
                              </svg>
                            </>
                          ) : null}
                          {r?.isPest ? (
                            <>
                              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                              </svg>
                            </>
                          ) : null}
                          {r?.isSpray ? (
                            <>
                              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
                              </svg>
                            </>
                          ) : null}
                          {r?.isPhoto ? (
                            <>
                              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                              </svg>
                            </>
                          ) : null}
                        </span>
                        <span className="col" style={{"gap":"2px"} as any}>
                          <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                            {__s(r?.t)}
                          </b>
                          <span className="meta">
                            {__s(r?.w)}
                          </span>
                        </span>
                        <span className="meta" style={{"color":"var(--ink2)"} as any}>
                          {__s(r?.o)}
                        </span>
                        <span className="pq farm">
                          {__s(r?.d)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </section>
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
          {__v?.lg ? (
            <>
              <div className="scrim" onClick={__v?.close} />
              <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="lg-h">
                <div className="dh">
                  <div className="col" style={{"gap":"8px"} as any}>
                    {__v?.notDoneStep ? (
                      <>
                        <div className="row" style={{"gap":"10px"} as any}>
                          <div className="steps" aria-hidden="true">
                            {((__v?.stepBars) || []).map((b: any, i19: number) => (
                              <Fragment key={i19}>
                                <i className={__s(b?.cls) as any} />
                              </Fragment>
                            ))}
                          </div>
                          <span className="meta">
                            {__s(__v?.stepTxt)}
                          </span>
                        </div>
                      </>
                    ) : null}
                    <h2 id="lg-h" style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.5px"} as any}>
                      {"Add to your journal"}
                    </h2>
                  </div>
                  <button type="button" className="xbtn press" onClick={__v?.close} aria-label="Close">
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
                <div className="db">
                  {__v?.stWhat ? (
                    <>
                      <p className="txt" style={{"fontSize":"16px"} as any}>
                        {"What happened in your field?"}
                      </p>
                      <div className="types" role="group" aria-label="What happened">
                        {((__v?.types) || []).map((t: any, i20: number) => (
                          <Fragment key={i20}>
                            <button type="button" className={__s(t?.cls) as any} aria-pressed={__s(t?.pressed) as any} onClick={t?.pick}>
                              {t?.is_water ? (
                                <>
                                  <span className="jic water">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                                    </svg>
                                  </span>
                                </>
                              ) : null}
                              {t?.is_feed ? (
                                <>
                                  <span className="jic feed">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />
                                    </svg>
                                  </span>
                                </>
                              ) : null}
                              {t?.is_spray ? (
                                <>
                                  <span className="jic spray">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
                                    </svg>
                                  </span>
                                </>
                              ) : null}
                              {t?.is_pest ? (
                                <>
                                  <span className="jic pest">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                                    </svg>
                                  </span>
                                </>
                              ) : null}
                              {t?.is_leaf ? (
                                <>
                                  <span className="jic leaf">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                                    </svg>
                                  </span>
                                </>
                              ) : null}
                              {t?.is_photo ? (
                                <>
                                  <span className="jic photo">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                    </svg>
                                  </span>
                                </>
                              ) : null}
                              {t?.is_other ? (
                                <>
                                  <span className="jic other">
                                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
                                    </svg>
                                  </span>
                                </>
                              ) : null}
                              <span>
                                <b>
                                  {__s(t?.label)}
                                </b>
                                <small>
                                  {__s(t?.sub)}
                                </small>
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {__v?.stDetail ? (
                    <>
                      <span className="meta">
                        {__s(__v?.tyLabel)}
                      </span>
                      <p style={{"fontSize":"20px","fontWeight":"600"} as any}>
                        {__s(__v?.q)}
                      </p>
                      {__v?.hasOpts ? (
                        <>
                          <div className="opts" role="group" aria-label={__s(__v?.q) as any}>
                            {((__v?.opts) || []).map((o: any, i21: number) => (
                              <Fragment key={i21}>
                                <button type="button" className={__s(o?.cls) as any} aria-pressed={__s(o?.pressed) as any} onClick={o?.pick}>
                                  {o?.p_leaf_yellow ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M8 40C8 18 30 6 58 8C56 30 36 44 8 40Z" fill="#DCC54A" />
                                        <path d="M10 39C24 30 38 20 54 10" stroke="#00000022" strokeWidth="1.5" fill="none" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_leaf_orange ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M8 40C8 18 30 6 58 8C56 30 36 44 8 40Z" fill="#6E9A48" />
                                        <path d="M10 39C24 30 38 20 54 10" stroke="#00000022" strokeWidth="1.5" fill="none" />
                                        <circle cx="20" cy="32" r="2.6" fill="#E07A1F" />
                                        <circle cx="28" cy="26" r="2.6" fill="#E07A1F" />
                                        <circle cx="36" cy="22" r="2.6" fill="#E07A1F" />
                                        <circle cx="26" cy="34" r="2.6" fill="#E07A1F" />
                                        <circle cx="42" cy="18" r="2.6" fill="#E07A1F" />
                                        <circle cx="33" cy="30" r="2.6" fill="#E07A1F" />
                                        <circle cx="46" cy="24" r="2.6" fill="#E07A1F" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_leaf_brown ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M8 40C8 18 30 6 58 8C56 30 36 44 8 40Z" fill="#6E9A48" />
                                        <path d="M10 39C24 30 38 20 54 10" stroke="#00000022" strokeWidth="1.5" fill="none" />
                                        <path d="M22 24c6-4 12 0 10 6s-12 6-12 0z" fill="#8A5A2B" />
                                        <path d="M38 14c5-2 9 2 6 6s-9 2-6-6z" fill="#8A5A2B" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_leaf_tips ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M8 40C8 18 30 6 58 8C56 30 36 44 8 40Z" fill="#6E9A48" />
                                        <path d="M10 39C24 30 38 20 54 10" stroke="#00000022" strokeWidth="1.5" fill="none" />
                                        <path d="M46 8C52 8 56 8 58 8C57 16 54 21 50 25C49 18 48 12 46 8Z" fill="#B58A4B" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_leaf_white ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M8 40C8 18 30 6 58 8C56 30 36 44 8 40Z" fill="#6E9A48" />
                                        <path d="M10 39C24 30 38 20 54 10" stroke="#00000022" strokeWidth="1.5" fill="none" />
                                        <circle cx="20" cy="33" r="3.2" fill="#F4F4EE" />
                                        <circle cx="30" cy="27" r="3.2" fill="#F4F4EE" />
                                        <circle cx="40" cy="20" r="3.2" fill="#F4F4EE" />
                                        <circle cx="25" cy="36" r="3.2" fill="#F4F4EE" />
                                        <circle cx="35" cy="31" r="3.2" fill="#F4F4EE" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_leaf_unsure ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M8 40C8 18 30 6 58 8C56 30 36 44 8 40Z" fill="none" stroke="#9EA39C" strokeWidth="2" strokeDasharray="4 4" />
                                        <text x="32" y="32" textAnchor="middle" fontFamily="Hanken Grotesk" fontSize="18" fontWeight="700" fill="#6A716C">
                                          {"?"}
                                        </text>
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_bug_aphid ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M2 40C20 30 44 30 62 40" stroke="#7FA65A" strokeWidth="5" fill="none" strokeLinecap="round" />
                                        <ellipse cx="18" cy="32" rx="3.4" ry="2.4" fill="#5E9C3A" stroke="#2E5A1C" strokeWidth=".8" />
                                        <ellipse cx="24" cy="30" rx="3.4" ry="2.4" fill="#5E9C3A" stroke="#2E5A1C" strokeWidth=".8" />
                                        <ellipse cx="30" cy="29" rx="3.4" ry="2.4" fill="#5E9C3A" stroke="#2E5A1C" strokeWidth=".8" />
                                        <ellipse cx="36" cy="29" rx="3.4" ry="2.4" fill="#5E9C3A" stroke="#2E5A1C" strokeWidth=".8" />
                                        <ellipse cx="42" cy="30" rx="3.4" ry="2.4" fill="#5E9C3A" stroke="#2E5A1C" strokeWidth=".8" />
                                        <ellipse cx="27" cy="25" rx="3.4" ry="2.4" fill="#5E9C3A" stroke="#2E5A1C" strokeWidth=".8" />
                                        <ellipse cx="34" cy="24" rx="3.4" ry="2.4" fill="#5E9C3A" stroke="#2E5A1C" strokeWidth=".8" />
                                        <ellipse cx="40" cy="25" rx="3.4" ry="2.4" fill="#5E9C3A" stroke="#2E5A1C" strokeWidth=".8" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_bug_worm ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M2 40C20 30 44 30 62 40" stroke="#7FA65A" strokeWidth="5" fill="none" strokeLinecap="round" />
                                        <circle cx="14" cy="28" r="4.4" fill="#9BAA4A" stroke="#56601F" strokeWidth=".8" />
                                        <circle cx="20" cy="26" r="4.4" fill="#9BAA4A" stroke="#56601F" strokeWidth=".8" />
                                        <circle cx="26" cy="28" r="4.4" fill="#9BAA4A" stroke="#56601F" strokeWidth=".8" />
                                        <circle cx="32" cy="26" r="4.4" fill="#9BAA4A" stroke="#56601F" strokeWidth=".8" />
                                        <circle cx="38" cy="28" r="4.4" fill="#9BAA4A" stroke="#56601F" strokeWidth=".8" />
                                        <circle cx="44" cy="26" r="4.4" fill="#9BAA4A" stroke="#56601F" strokeWidth=".8" />
                                        <circle cx="50" cy="28" r="4.4" fill="#9BAA4A" stroke="#56601F" strokeWidth=".8" />
                                        <circle cx="56" cy="26" r="4.6" fill="#56601F" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_bug_mite ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M2 40C20 30 44 30 62 40" stroke="#7FA65A" strokeWidth="5" fill="none" strokeLinecap="round" />
                                        <path d="M14 18 50 30M18 30 46 16" stroke="#BDBDB4" strokeWidth=".8" />
                                        <circle cx="22" cy="22" r="1.8" fill="#C2412A" />
                                        <circle cx="30" cy="25" r="1.8" fill="#C2412A" />
                                        <circle cx="38" cy="21" r="1.8" fill="#C2412A" />
                                        <circle cx="34" cy="28" r="1.8" fill="#C2412A" />
                                        <circle cx="26" cy="28" r="1.8" fill="#C2412A" />
                                        <circle cx="42" cy="26" r="1.8" fill="#C2412A" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_bug_hopper ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M2 40C20 30 44 30 62 40" stroke="#7FA65A" strokeWidth="5" fill="none" strokeLinecap="round" />
                                        <path d="M14 26c8-6 26-8 34-4l6 6-10 2c-10 2-24 2-30-4z" fill="#8C9A3A" />
                                        <path d="M30 24l-6 12M40 24l8 12" stroke="#5E6A20" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="50" cy="24" r="1.6" fill="#141A16" />
                                      </svg>
                                    </>
                                  ) : null}
                                  {o?.p_bug_unsure ? (
                                    <>
                                      <svg viewBox="0 0 64 48" aria-hidden="true">
                                        <path d="M2 40C20 30 44 30 62 40" stroke="#7FA65A" strokeWidth="5" fill="none" strokeLinecap="round" />
                                        <text x="32" y="26" textAnchor="middle" fontFamily="Hanken Grotesk" fontSize="18" fontWeight="700" fill="#6A716C">
                                          {"?"}
                                        </text>
                                      </svg>
                                    </>
                                  ) : null}
                                  <span>
                                    {__s(o?.label)}
                                  </span>
                                  <small>
                                    {__s(o?.sub)}
                                  </small>
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </>
                      ) : null}
                      {__v?.isOther ? (
                        <>
                          <label className="col" style={{"gap":"8px"} as any}>
                            <span className="meta">
                              {"A few words are enough. Optional."}
                            </span>
                            <textarea rows={4} value={__s(__v?.note)} onChange={__v?.setNote} aria-label="What happened" placeholder="For example: the water pump broke for two days" style={{"border":"0","borderRadius":"16px","padding":"14px 16px","font":"inherit","fontSize":"15px","resize":"none"} as any} />
                          </label>
                        </>
                      ) : null}
                      {__v?.hasAmount ? (
                        <>
                          <div className="col hair" style={{"gap":"12px","paddingTop":"18px"} as any}>
                            <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                              {"How much did you use?"}
                            </b>
                            <div className="row" style={{"gap":"12px"} as any}>
                              <div className="stepper">
                                <button type="button" onClick={__v?.minus} aria-label="Less">
                                  {"−"}
                                </button>
                                <b aria-live="polite">
                                  {__s(__v?.amt)}
                                </b>
                                <button type="button" onClick={__v?.plus} aria-label="More">
                                  {"+"}
                                </button>
                              </div>
                              <span className="meta">
                                {__s(__v?.unit)}
                              </span>
                              <button type="button" className={__s(__v?.dkCls) as any} onClick={__v?.dkTap}>
                                {"I don't know"}
                              </button>
                            </div>
                            {__v?.hasSug ? (
                              <>
                                <div className="sugg">
                                  <span className="row" style={{"gap":"8px","fontSize":"13px","fontWeight":"600","color":"var(--green)"} as any}>
                                    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 60 60">
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
                                    {"Bezra suggests for this stage"}
                                  </span>
                                  <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                    {__s(__v?.sugTxt)}
                                  </b>
                                  <span className="meta" style={{"color":"var(--ink2)"} as any}>
                                    {"Based on your soil, the crop's age and your last 10 seasons. Check with your engineer before you change it."}
                                  </span>
                                </div>
                              </>
                            ) : null}
                            {__v?.tooMuch ? (
                              <>
                                <div className="warnbox" role="alert">
                                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                                  </svg>
                                  <span>
                                    {"That is more than double the usual amount. Too much can burn the roots and is lost to the water. You can still save it."}
                                  </span>
                                </div>
                              </>
                            ) : null}
                            {__v?.isSpray ? (
                              <>
                                <span className="meta" style={{"color":"var(--ink2)"} as any}>
                                  {"Write the dose from the label or the one your engineer gave you. Bezra does not suggest spray doses."}
                                </span>
                              </>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {__v?.stWhere ? (
                    <>
                      <p style={{"fontSize":"20px","fontWeight":"600"} as any}>
                        {"Where and when?"}
                      </p>
                      <span className="meta">
                        {"Tap the squares, as they are on your map."}
                      </span>
                      <div className="mini" role="group" aria-label="Squares of your field">
                        {((__v?.mini) || []).map((m: any, i22: number) => (
                          <Fragment key={i22}>
                            <button type="button" style={__css(m?.st)} aria-pressed={__s(m?.pressed) as any} onClick={m?.pick}>
                              {__s(m?.label)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      <div className="row" style={{"gap":"8px","justifyContent":"center"} as any}>
                        <button type="button" className={__s(__v?.allCls) as any} onClick={__v?.allTap}>
                          {"Whole field"}
                        </button>
                      </div>
                      <div className="col hair" style={{"gap":"10px","paddingTop":"18px"} as any}>
                        <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                          {"When?"}
                        </b>
                        <div className="row" style={{"gap":"6px"} as any}>
                          {((__v?.whens) || []).map((w: any, i23: number) => (
                            <Fragment key={i23}>
                              <button type="button" className={__s(w?.cls) as any} aria-pressed={__s(w?.pressed) as any} onClick={w?.pick}>
                                {__s(w?.label)}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                  {__v?.stPhoto ? (
                    <>
                      <p style={{"fontSize":"20px","fontWeight":"600"} as any}>
                        {"Add a photo"}
                        {__v?.photoOptional ? (
                          <>
                            <span className="meta" style={{"fontWeight":"500","fontSize":"15px"} as any}>
                              {" · optional"}
                            </span>
                          </>
                        ) : null}
                      </p>
                      {__v?.phNone ? (
                        <>
                          <button type="button" className="drop press" onClick={__v?.addPh}>
                            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                            </svg>
                            <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                              {"Take or choose a photo"}
                            </b>
                            <span className="meta">
                              {"One close photo of a leaf is best"}
                            </span>
                          </button>
                          <button type="button" onClick={__v?.badPh} className="meta" style={{"border":"0","background":"transparent","textDecoration":"underline","cursor":"pointer","alignSelf":"center"} as any}>
                            {"Preview: wrong file"}
                          </button>
                        </>
                      ) : null}
                      {__v?.phOk ? (
                        <>
                          <div className="row" style={{"gap":"14px","padding":"12px","borderRadius":"18px","background":"#fff"} as any}>
                            <svg width="88" height="66" viewBox="0 0 88 66" style={{"borderRadius":"12px"} as any} aria-hidden="true">
                              <rect width="88" height="66" fill="#5E8F44" />
                              <g transform="translate(10 6) scale(1.1)">
                                <path d="M8 40C8 18 30 6 58 8C56 30 36 44 8 40Z" fill="#DCC54A" />
                                <path d="M10 39C24 30 38 20 54 10" stroke="#00000022" strokeWidth="1.5" fill="none" />
                              </g>
                            </svg>
                            <span className="col" style={{"gap":"2px","flex":"1"} as any}>
                              <b style={{"fontWeight":"600"} as any}>
                                {"leaf_C1.jpg"}
                              </b>
                              <span className="meta">
                                {"2.1 MB · ready"}
                              </span>
                            </span>
                            <button type="button" className="ibtn2" onClick={__v?.rmPh} aria-label="Remove photo">
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" />
                              </svg>
                            </button>
                          </div>
                        </>
                      ) : null}
                      {__v?.phErr ? (
                        <>
                          <div className="errbox" role="alert">
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                            </svg>
                            <span>
                              {"That file isn't a photo. Try a JPG or PNG under 10 MB."}
                            </span>
                          </div>
                          <button type="button" className="drop press" onClick={__v?.addPh} style={{"height":"140px"} as any}>
                            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                            </svg>
                            <b style={{"fontWeight":"600"} as any}>
                              {"Try another photo"}
                            </b>
                          </button>
                        </>
                      ) : null}
                    </>
                  ) : null}
                  {__v?.stDone ? (
                    <>
                      <div className="col" style={{"gap":"16px","paddingTop":"12px"} as any}>
                        <svg aria-hidden="true" width="72" height="72" viewBox="0 0 60 60">
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
                            <path d="M24 36q6 7 12 0z" fill="#3A2A10" />
                            <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          </g>
                        </svg>
                        <p style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.5px"} as any}>
                          {"Saved to your journal."}
                        </p>
                        <p style={{"fontSize":"17px","lineHeight":"1.55","color":"var(--ink2)"} as any}>
                          {__s(__v?.rMsg)}
                        </p>
                        {__v?.rHasChange ? (
                          <>
                            <div className="chg">
                              <span className="meta" style={{"minWidth":"110px"} as any}>
                                {__s(__v?.rWhat)}
                              </span>
                              <s>
                                {__s(__v?.rFrom)}
                              </s>
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9.5 6 6 6-6 6" />
                              </svg>
                              <b style={{"fontWeight":"600"} as any}>
                                {__s(__v?.rTo)}
                              </b>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                  {__v?.hasErr ? (
                    <>
                      <div className="errbox" role="alert">
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                        </svg>
                        <span>
                          {__s(__v?.err)}
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
                {__v?.notDoneStep ? (
                  <>
                    <div className="df">
                      {__v?.hasBack ? (
                        <>
                          <button type="button" className="btn soft press" onClick={__v?.back}>
                            {"Back"}
                          </button>
                        </>
                      ) : null}
                      <span />
                      <button type="button" className="btn press" onClick={__v?.next} style={{"minWidth":"140px","height":"50px"} as any}>
                        {__s(__v?.nextLabel)}
                      </button>
                    </div>
                  </>
                ) : null}
                {__v?.stDone ? (
                  <>
                    <div className="df">
                      <button type="button" className="btn soft press" onClick={__v?.undoSave}>
                        {"Undo"}
                      </button>
                      <span className="row" style={{"gap":"8px"} as any}>
                        <button type="button" className="btn soft press" onClick={__v?.again}>
                          {"Add another"}
                        </button>
                        <button type="button" className="btn press" onClick={__v?.doneTap} style={{"minWidth":"110px"} as any}>
                          {"Done"}
                        </button>
                      </span>
                    </div>
                  </>
                ) : null}
              </aside>
              {__v?.lgConf ? (
                <>
                  <div className="scrim" style={{"zIndex":"59"} as any} />
                  <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="cf-h">
                    <h3 id="cf-h" style={{"fontSize":"22px","fontWeight":"600"} as any}>
                      {"Leave without saving?"}
                    </h3>
                    <p className="txt">
                      {"What you picked so far will be lost."}
                    </p>
                    <div className="row" style={{"gap":"10px","justifyContent":"flex-end","marginTop":"6px"} as any}>
                      <button type="button" className="btn soft press" onClick={__v?.discard}>
                        {"Leave"}
                      </button>
                      <button type="button" className="btn press" onClick={__v?.keep}>
                        {"Keep going"}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </>
          ) : null}
          {__v?.hasToast ? (
            <>
              <div className="toast" role="status">
                {__s(__v?.toast)}
                <button type="button" onClick={__v?.closeToast}>
                  {"OK"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <Tour page="Today" />
    </>
  );
}
