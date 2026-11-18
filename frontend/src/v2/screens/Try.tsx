'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V19-Try.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Try.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Try.logic';
import { useTryData } from '@/v2/data/try';

export default function TryScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const tr = useTryData();
  const __v = { ...tr, ...useDC(Logic, { ...props, d: tr }) };
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
              <Link href={__r("V18-Today") + ""} className="press">
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
              <Link href={__r("V19-Season") + ""} aria-current="page" className="press">
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
              <Link href={__r("V18-Crop") + ""} className="ibtn press" aria-label="Alerts, 2 new">
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
                <div className="col" style={{"gap":"26px"} as any}>
                  <div className="pagehead rise" style={{"--d":"0"} as any}>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <Link href={__r("V19-Season") + ""} className="row meta" style={{"gap":"6px","fontSize":"14px"} as any}>
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m14.5 6-6 6 6 6" />
                        </svg>
                        {"Season"}
                      </Link>
                      <h1 className="h1x">
                        {"Your season, two ways."}
                      </h1>
                      <p style={{"fontSize":"18px","color":"var(--ink2)","maxWidth":"780px"} as any}>
                        {"Same field, same weather. On one side, what you usually do. On the other, what Bezra tells you. Press play and watch the difference."}
                      </p>
                    </div>
                  </div>
                  <div className="tabs3 rise" role="tablist" style={{"--d":"1"} as any}>
                    {((__v?.tabs) || []).map((t: any, i0: number) => (
                      <Fragment key={i0}>
                        <button type="button" role="tab" className={__s(t?.cls) as any} aria-selected={__s(t?.pressed) as any} onClick={t?.pick}>
                          {__s(t?.label)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {__v?.isVs ? (
                    <>
                      <div className="col" style={{"gap":"22px"} as any}>
                        <div className="row sp rise" style={{"--d":"1"} as any}>
                          <span className="row" style={{"gap":"12px"} as any}>
                            <button type="button" className="play press" onClick={__v?.play} aria-label="Play the season">
                              {__v?.notPlaying ? (
                                <>
                                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 5.5v13l11-6.5z" />
                                  </svg>
                                </>
                              ) : null}
                              {__v?.playing ? (
                                <>
                                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 5v14M16 5v14" />
                                  </svg>
                                </>
                              ) : null}
                            </button>
                            <span className="col" style={{"gap":"0"} as any}>
                              <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                                {"Play the season"}
                              </b>
                              <span className="meta">
                                {"Same field, same weather. Only the decisions change."}
                              </span>
                            </span>
                          </span>
                          <div className="months" role="group" aria-label="Month">
                            {((__v?.months) || []).map((m: any, i1: number) => (
                              <Fragment key={i1}>
                                <button type="button" className={__s(m?.cls) as any} aria-pressed={__s(m?.pressed) as any} onClick={m?.pick}>
                                  {__s(m?.label)}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="race rise" style={{"--d":"1"} as any}>
                          <article className="lane">
                            <div className="scene">
                              <svg viewBox="0 40 280 230" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{"position":"absolute","left":"0","right":"0","top":"40px","bottom":"0","width":"100%","height":"calc(100% - 40px)"} as any}>
                                <path d="M120 139l102 58 68 -38 -102 -58z" fill="none" />
                                {((__v?.laneU) || []).map((b: any, i2: number) => (
                                  <Fragment key={i2}>
                                    <g transform={__s(b?.tf) as any} style={{"transition":"transform .6s var(--ease)"} as any}>
                                      <path d={__s(b?.lf) as any} fill={__s(b?.sc) as any} />
                                      <path d={__s(b?.rt) as any} fill={__s(b?.sc) as any} fillOpacity=".8" />
                                      <path d={__s(b?.top) as any} fill={__s(b?.tc) as any} />
                                    </g>
                                  </Fragment>
                                ))}
                              </svg>
                              <div className="lanehead">
                                <span className="col" style={{"gap":"2px"} as any}>
                                  <span className="meta" style={{"fontWeight":"600"} as any}>
                                    {"YOUR USUAL WAY"}
                                  </span>
                                  <span className="meta">
                                    {__s(__v?.usualTxt)}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="row sp" style={{"padding":"18px 24px 8px","alignItems":"baseline"} as any}>
                              <span className="yield">
                                {__s(__v?.yu)}
                                <small>
                                  {"ardab / feddan"}
                                </small>
                              </span>
                              <span className="meta">
                                {"expected"}
                              </span>
                            </div>
                            <div className="ev" aria-live="polite">
                              <span className="evdot" style={__css(__v?.evuc)} />
                              <span>
                                {__s(__v?.evu)}
                              </span>
                            </div>
                          </article>
                          <article className="lane bz">
                            <div className="scene">
                              <svg viewBox="0 40 280 230" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{"position":"absolute","left":"0","right":"0","top":"40px","bottom":"0","width":"100%","height":"calc(100% - 40px)"} as any}>
                                <path d="M120 139l102 58 68 -38 -102 -58z" fill="none" />
                                {((__v?.laneB) || []).map((b: any, i3: number) => (
                                  <Fragment key={i3}>
                                    <g transform={__s(b?.tf) as any} style={{"transition":"transform .6s var(--ease)"} as any}>
                                      <path d={__s(b?.lf) as any} fill={__s(b?.sc) as any} />
                                      <path d={__s(b?.rt) as any} fill={__s(b?.sc) as any} fillOpacity=".8" />
                                      <path d={__s(b?.top) as any} fill={__s(b?.tc) as any} />
                                    </g>
                                  </Fragment>
                                ))}
                              </svg>
                              <div className="lanehead">
                                <span className="col" style={{"gap":"2px"} as any}>
                                  <span className="meta" style={{"fontWeight":"600","color":"var(--sun)"} as any}>
                                    {"WITH BEZRA"}
                                  </span>
                                  <span className="meta">
                                    {__s(__v?.bezraTxt)}
                                  </span>
                                </span>
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
                              </div>
                            </div>
                            <div className="row sp" style={{"padding":"18px 24px 8px","alignItems":"baseline"} as any}>
                              <span className="yield">
                                {__s(__v?.yb)}
                                <small>
                                  {"ardab / feddan"}
                                </small>
                              </span>
                              <span className="meta">
                                {"expected"}
                              </span>
                            </div>
                            <div className="ev" aria-live="polite">
                              <span className="evdot" style={__css(__v?.evbc)} />
                              <span>
                                {__s(__v?.evb)}
                              </span>
                            </div>
                          </article>
                        </div>
                        <div className="impact rise" style={{"--d":"2"} as any}>
                          <div>
                            <span className="meta">
                              {"More wheat this season"}
                            </span>
                            <b>
                              {__s(__v?.gain?.d)}
                            </b>
                            <span className="meta">
                              {__s(__v?.gain?.pct)}
                            </span>
                          </div>
                          <div>
                            <span className="meta">
                              {__s(__v?.gain?.area)}
                            </span>
                            <b>
                              {__s(__v?.gain?.t)}
                            </b>
                            <span className="meta">
                              {__s(__v?.gain?.kg)}
                            </span>
                          </div>
                          <div>
                            <span className="meta">
                              {"More water, on time"}
                            </span>
                            <b className="sun">
                              {__s(__v?.waterTile?.v)}
                            </b>
                            <span className="meta">
                              {__s(__v?.waterTile?.s)}
                            </span>
                          </div>
                          <div>
                            <span className="meta">
                              {"Soil strength in 5 years"}
                            </span>
                            <b>
                              {__s(__v?.soilTile?.v)}
                            </b>
                            <span className="meta">
                              {__s(__v?.soilTile?.s)}
                            </span>
                          </div>
                        </div>
                        <div className="grid hair rise" style={{"--d":"3","gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"56px","paddingTop":"32px"} as any}>
                          <div className="col" style={{"gap":"12px"} as any}>
                            <h2 className="sec">
                              {"WHERE THE EXTRA WHEAT COMES FROM"}
                            </h2>
                            <div className="col" style={{"gap":"2px"} as any}>
                              {((__v?.wf) || []).map((w: any, iw: number) => (
                                <div className="wf" key={iw}>
                                  <span className={w.cls}>{w.l}</span>
                                  <span className="wfbar"><i className={w.cls ? "" : "growx"} style={__css(w.sty)} /></span>
                                  <b style={__css("font-weight:600;" + w.b)}>{w.v}</b>
                                </div>
                              ))}
                              
                              
                              
                              
                              
                              {false ? (<div className="wf" style={{"borderTop":"1px solid var(--line)","marginTop":"4px","paddingTop":"14px"} as any}>
                                <b style={{"fontWeight":"600"} as any}>
                                  {"With Bezra"}
                                </b>
                                <span className="wfbar">
                                  <i style={{"left":"0","width":"75.4%","background":"var(--dark)"} as any} />
                                </span>
                                <b style={{"fontWeight":"600"} as any}>
                                  {"18.4"}
                                </b>
                              </div>) : null}
                              <span className="meta" style={{"paddingTop":"8px"} as any}>
                                {"Ardab of wheat per feddan. Each line is one thing Bezra told you to do."}
                              </span>
                            </div>
                          </div>
                          <div className="col" style={{"gap":"12px"} as any}>
                            <h2 className="sec">
                              {"YOUR SOIL, NEXT 5 SEASONS"}
                            </h2>
                            {__v?.five ? (<svg viewBox="0 0 620 230" width="100%" role="img" aria-label={__s(__v?.fiveSay)}>
                              <line x1="40" x2="480" y1="30" y2="30" stroke="#E8E8E3" />
                              <line x1="40" x2="480" y1="115" y2="115" stroke="#E8E8E3" />
                              <line x1="40" x2="480" y1="200" y2="200" stroke="#E8E8E3" />
                              <path className="draw" pathLength="1" style={{"--d":"1"} as any} d={__v.five.cur} stroke="#B4660B" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
                              {__v.five.same ? null : <path className="draw" pathLength="1" style={{"--d":"2"} as any} d={__v.five.best} stroke="#3E7F35" strokeWidth="2.6" fill="none" strokeLinejoin="round" />}
                              {__v.five.same ? null : <text x={__v.five.endX} y={Number(__v.five.bestEnd.y) + 4} fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#3E7F35">{__v.five.bestEnd.t}</text>}
                              <text x={__v.five.endX} y={Number(__v.five.curEnd.y) + 4} fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#B4660B">{__v.five.curEnd.t}</text>
                              {__v.five.labs.map((l: string, il: number) => <text key={il} x={__v.five.xs[il]} y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">{l}</text>)}
                            </svg>) : <div className="sk" style={{"height":"230px","borderRadius":"12px"} as any} aria-busy="true" />}
                            <span className="meta">
                              {__s(__v?.fiveSay)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {__v?.isTry ? (
                    <>
                      <div className="col" style={{"gap":"26px"} as any}>
                        <div className="qs rise" role="group" aria-label="Question" style={{"--d":"1"} as any}>
                          {((__v?.qs) || []).map((x: any, i4: number) => (
                            <Fragment key={i4}>
                              <button type="button" className={__s(x?.cls) as any} aria-pressed={__s(x?.pressed) as any} onClick={x?.pick}>
                                {__s(x?.label)}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div className="row sp rise" style={{"--d":"2"} as any}>
                          <span className="meta" style={{"fontSize":"15px"} as any}>
                            {__s(__v?.monthTxt)}
                          </span>
                          <div className="months" role="group" aria-label="Month">
                            {((__v?.months) || []).map((m: any, i5: number) => (
                              <Fragment key={i5}>
                                <button type="button" className={__s(m?.cls) as any} aria-pressed={__s(m?.pressed) as any} onClick={m?.pick}>
                                  {__s(m?.label)}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="rise" style={{"--d":"3"} as any}>
                          <div className="sims">
                            {((__v?.opts) || []).map((o: any, i6: number) => (
                              <Fragment key={i6}>
                                <article className={__s(o?.cls) as any}>
                                  <div className="scene">
                                    <svg viewBox="0 0 360 230" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{"position":"absolute","inset":"0"} as any}>
                                      <path d="M150 126l140 80 70 -40 -140 -80z" fill="#C9C2A8" transform="translate(-112 -12)" />
                                      {((o?.blocks) || []).map((b: any, i7: number) => (
                                        <Fragment key={i7}>
                                          <g transform={__s(b?.tf) as any} style={{"transition":"transform .5s var(--ease)"} as any}>
                                            <path d={__s(b?.lf) as any} fill={__s(b?.sc) as any} />
                                            <path d={__s(b?.rt) as any} fill={__s(b?.rc) as any} fillOpacity=".85" />
                                            <path d={__s(b?.top) as any} fill={__s(b?.tc) as any} />
                                          </g>
                                        </Fragment>
                                      ))}
                                    </svg>
                                    <span style={{"position":"absolute","left":"18px","top":"16px","width":"40px","height":"40px","borderRadius":"20px","background":"#fff","color":"#141A16","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700"} as any}>
                                      {__s(o?.n)}
                                    </span>
                                    {o?.best ? (
                                      <>
                                        <span style={{"position":"absolute","right":"16px","top":"18px","height":"30px","padding":"0 12px","borderRadius":"15px","background":"var(--sun)","color":"#141A16","display":"flex","alignItems":"center","fontSize":"13px","fontWeight":"700"} as any}>
                                          {"Bezra's pick"}
                                        </span>
                                      </>
                                    ) : null}
                                  </div>
                                  <div style={{"padding":"18px 22px 8px"} as any}>
                                    <b style={{"fontSize":"24px","fontWeight":"600","letterSpacing":"-.4px"} as any}>
                                      {__s(o?.t)}
                                    </b>
                                  </div>
                                  {((o?.rows) || []).map((r: any, i8: number) => (
                                    <Fragment key={i8}>
                                      <div className="orow">
                                        <span>
                                          {__s(r?.a)}
                                        </span>
                                        <b>
                                          {__s(r?.b)}
                                        </b>
                                      </div>
                                    </Fragment>
                                  ))}
                                  <div style={{"padding":"16px 22px 22px"} as any}>
                                    <button type="button" className="btn press" onClick={o?.use} style={{"width":"100%","background":"#E9E9E5","color":"#141A16"} as any}>
                                      {__s(o?.useLabel)}
                                    </button>
                                  </div>
                                </article>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="verdict rise" style={{"--d":"4"} as any}>
                          <svg aria-hidden="true" width="52" height="52" viewBox="0 0 60 60">
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
                          <b style={{"fontSize":"18px","fontWeight":"600","lineHeight":"1.45"} as any}>
                            {__s(__v?.say)}
                          </b>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {__v?.isReplay ? (
                    <>
                      <div className="col" style={{"gap":"22px"} as any}>
                        <div className="row sp rise" style={{"--d":"1","alignItems":"flex-end"} as any}>
                          <div className="col" style={{"gap":"8px","maxWidth":"760px"} as any}>
                            <b style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.5px","lineHeight":"1.3"} as any}>
                              {__s(__v?.replaySay)}
                            </b>
                            <span className="txt">
                              {__s(__v?.replaySub)}
                            </span>
                          </div>
                          <span className="leg">
                            <span>
                              <i style={{"background":"#C9CBC4","height":"10px"} as any} />
                              {"What you got"}
                            </span>
                            <span>
                              <i style={{"background":"#3E7F35","height":"10px"} as any} />
                              {"With Bezra"}
                            </span>
                            <span>
                              <i style={{"background":"#CFE3C6","height":"10px"} as any} />
                              {"Clover year"}
                            </span>
                          </span>
                        </div>
                        <div className="rp rise" style={{"--d":"2"} as any} role="group" aria-label="Seasons">
                          {((__v?.rp) || []).map((s: any, i9: number) => (
                            <Fragment key={i9}>
                              <button type="button" className={__s(s?.cls) as any} aria-pressed={__s(s?.pressed) as any} onClick={s?.pick}>
                                <span className="bars">
                                  <i style={__css(s?.hu)} />
                                  <i style={__css(s?.hb)} />
                                </span>
                                <small>
                                  {__s(s?.label)}
                                </small>
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div className="rpnote rise" style={{"--d":"3"} as any}>
                          <svg aria-hidden="true" width="52" height="52" viewBox="0 0 60 60">
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
                              <path d="M26 38h8" stroke="#3A2A10" strokeWidth="2.2" strokeLinecap="round" />
                              <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                              <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            </g>
                          </svg>
                          <span className="col" style={{"gap":"4px"} as any}>
                            <span className="meta" style={{"fontWeight":"600"} as any}>
                              {__s(__v?.rsLabel)}
                            </span>
                            <b style={{"fontSize":"18px","fontWeight":"600","lineHeight":"1.45"} as any}>
                              {__s(__v?.rsNote)}
                            </b>
                            <span className="meta">
                              {__s(__v?.rsNums)}
                            </span>
                          </span>
                          <b style={{"fontSize":"28px","fontWeight":"600","color":"var(--green)","letterSpacing":"-.8px"} as any}>
                            {__s(__v?.rsGain)}
                          </b>
                        </div>
                        <p className="meta">
                          {"From the seasons Bezra has on record for this field. Bezra can miss things: not every heat wave gives a clear warning."}
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"26px"} as any}>
                  <div className="pagehead rise" style={{"--d":"0"} as any}>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <Link href={__r("V19-Season") + ""} className="row meta" style={{"gap":"6px","fontSize":"14px"} as any}>
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m14.5 6-6 6 6 6" />
                        </svg>
                        {"Season"}
                      </Link>
                      <h1 className="h1x">
                        {"Try a season"}
                      </h1>
                      <p style={{"fontSize":"18px","color":"var(--ink2)","maxWidth":"780px"} as any}>
                        {"Runs of the season model on your field: " + __s(__v?.yearsUsed) + " weather years (NASA POWER), your soil, your journal and this season so far. Medians shown, ranges in the tables."}
                      </p>
                    </div>
                  </div>
                  <div className="tabs3 rise" role="tablist" style={{"--d":"1"} as any}>
                    {((__v?.tabs) || []).map((t: any, i10: number) => (
                      <Fragment key={i10}>
                        <button type="button" role="tab" className={__s(t?.cls) as any} aria-selected={__s(t?.pressed) as any} onClick={t?.pick}>
                          {__s(t?.label)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {__v?.isVs ? (
                    <>
                      <div className="col" style={{"gap":"22px"} as any}>
                        <div className="row sp rise" style={{"--d":"1"} as any}>
                          <span className="row" style={{"gap":"12px"} as any}>
                            <button type="button" className="play press" onClick={__v?.play} aria-label="Play the season">
                              {__v?.notPlaying ? (
                                <>
                                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 5.5v13l11-6.5z" />
                                  </svg>
                                </>
                              ) : null}
                              {__v?.playing ? (
                                <>
                                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 5v14M16 5v14" />
                                  </svg>
                                </>
                              ) : null}
                            </button>
                            <span className="col" style={{"gap":"0"} as any}>
                              <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                                {"Play the season"}
                              </b>
                              <span className="meta">
                                {"Same field, same weather. Only the decisions change."}
                              </span>
                            </span>
                          </span>
                          <div className="months" role="group" aria-label="Month">
                            {((__v?.months) || []).map((m: any, i11: number) => (
                              <Fragment key={i11}>
                                <button type="button" className={__s(m?.cls) as any} aria-pressed={__s(m?.pressed) as any} onClick={m?.pick}>
                                  {__s(m?.label)}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="race rise" style={{"--d":"1"} as any}>
                          <article className="lane">
                            <div className="scene">
                              <svg viewBox="0 40 280 230" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{"position":"absolute","left":"0","right":"0","top":"40px","bottom":"0","width":"100%","height":"calc(100% - 40px)"} as any}>
                                <path d="M120 139l102 58 68 -38 -102 -58z" fill="none" />
                                {((__v?.laneU) || []).map((b: any, i12: number) => (
                                  <Fragment key={i12}>
                                    <g transform={__s(b?.tf) as any} style={{"transition":"transform .6s var(--ease)"} as any}>
                                      <path d={__s(b?.lf) as any} fill={__s(b?.sc) as any} />
                                      <path d={__s(b?.rt) as any} fill={__s(b?.sc) as any} fillOpacity=".8" />
                                      <path d={__s(b?.top) as any} fill={__s(b?.tc) as any} />
                                    </g>
                                  </Fragment>
                                ))}
                              </svg>
                              <div className="lanehead">
                                <span className="col" style={{"gap":"2px"} as any}>
                                  <span className="meta" style={{"fontWeight":"600"} as any}>
                                    {"YOUR USUAL WAY"}
                                  </span>
                                  <span className="meta">
                                    {__s(__v?.usualTxt)}
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="row sp" style={{"padding":"18px 24px 8px","alignItems":"baseline"} as any}>
                              <span className="yield">
                                {__s(__v?.yu)}
                                <small>
                                  {"ardab / feddan"}
                                </small>
                              </span>
                              <span className="meta">
                                {"expected"}
                              </span>
                            </div>
                            <div className="ev" aria-live="polite">
                              <span className="evdot" style={__css(__v?.evuc)} />
                              <span>
                                {__s(__v?.evu)}
                              </span>
                            </div>
                          </article>
                          <article className="lane bz">
                            <div className="scene">
                              <svg viewBox="0 40 280 230" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{"position":"absolute","left":"0","right":"0","top":"40px","bottom":"0","width":"100%","height":"calc(100% - 40px)"} as any}>
                                <path d="M120 139l102 58 68 -38 -102 -58z" fill="none" />
                                {((__v?.laneB) || []).map((b: any, i13: number) => (
                                  <Fragment key={i13}>
                                    <g transform={__s(b?.tf) as any} style={{"transition":"transform .6s var(--ease)"} as any}>
                                      <path d={__s(b?.lf) as any} fill={__s(b?.sc) as any} />
                                      <path d={__s(b?.rt) as any} fill={__s(b?.sc) as any} fillOpacity=".8" />
                                      <path d={__s(b?.top) as any} fill={__s(b?.tc) as any} />
                                    </g>
                                  </Fragment>
                                ))}
                              </svg>
                              <div className="lanehead">
                                <span className="col" style={{"gap":"2px"} as any}>
                                  <span className="meta" style={{"fontWeight":"600","color":"var(--sun)"} as any}>
                                    {"WITH BEZRA"}
                                  </span>
                                  <span className="meta">
                                    {__s(__v?.bezraTxt)}
                                  </span>
                                </span>
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
                              </div>
                            </div>
                            <div className="row sp" style={{"padding":"18px 24px 8px","alignItems":"baseline"} as any}>
                              <span className="yield">
                                {__s(__v?.yb)}
                                <small>
                                  {"ardab / feddan"}
                                </small>
                              </span>
                              <span className="meta">
                                {"expected"}
                              </span>
                            </div>
                            <div className="ev" aria-live="polite">
                              <span className="evdot" style={__css(__v?.evbc)} />
                              <span>
                                {__s(__v?.evb)}
                              </span>
                            </div>
                          </article>
                        </div>
                        <div className="impact rise" style={{"--d":"2"} as any}>
                          <div>
                            <span className="meta">
                              {"More wheat this season"}
                            </span>
                            <b>
                              {__s(__v?.gain?.d)}
                            </b>
                            <span className="meta">
                              {__s(__v?.gain?.pct)}
                            </span>
                          </div>
                          <div>
                            <span className="meta">
                              {__s(__v?.gain?.area)}
                            </span>
                            <b>
                              {__s(__v?.gain?.t)}
                            </b>
                            <span className="meta">
                              {__s(__v?.gain?.kg)}
                            </span>
                          </div>
                          <div>
                            <span className="meta">
                              {"More water, on time"}
                            </span>
                            <b className="sun">
                              {__s(__v?.waterTile?.v)}
                            </b>
                            <span className="meta">
                              {__s(__v?.waterTile?.s)}
                            </span>
                          </div>
                          <div>
                            <span className="meta">
                              {"Soil strength in 5 years"}
                            </span>
                            <b>
                              {__s(__v?.soilTile?.v)}
                            </b>
                            <span className="meta">
                              {__s(__v?.soilTile?.s)}
                            </span>
                          </div>
                        </div>
                        <div className="grid hair rise" style={{"--d":"3","gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"56px","paddingTop":"32px"} as any}>
                          <div className="col" style={{"gap":"12px"} as any}>
                            <h2 className="sec">
                              {"WHERE THE EXTRA WHEAT COMES FROM"}
                            </h2>
                            <div className="col" style={{"gap":"2px"} as any}>
                              
                              {((__v?.wf) || []).map((w: any, iw: number) => (
                                <div className="wf" key={iw}>
                                  <span className={w.cls}>{w.l}</span>
                                  <span className="wfbar"><i className={w.cls ? "" : "growx"} style={__css(w.sty)} /></span>
                                  <b style={__css("font-weight:600;" + w.b)}>{w.v}</b>
                                </div>
                              ))}
                              
                              
                              
                              
                              {false ? (<div className="wf" style={{"borderTop":"1px solid var(--line)","marginTop":"4px","paddingTop":"14px"} as any}>
                                <b style={{"fontWeight":"600"} as any}>
                                  {"With Bezra"}
                                </b>
                                <span className="wfbar">
                                  <i style={{"left":"0","width":"75.4%","background":"var(--dark)"} as any} />
                                </span>
                                <b style={{"fontWeight":"600"} as any}>
                                  {"18.4"}
                                </b>
                              </div>) : null}
                              <span className="meta" style={{"paddingTop":"8px"} as any}>
                                {"Ardab per feddan, this season. Each step is a run of the season model with and without that advice."}
                              </span>
                            </div>
                          </div>
                          <div className="col" style={{"gap":"12px"} as any}>
                            <h2 className="sec">
                              {"YOUR SOIL, NEXT 5 SEASONS"}
                            </h2>
                            {__v?.five ? (<svg viewBox="0 0 620 230" width="100%" role="img" aria-label={__s(__v?.fiveSay)}>
                              <line x1="40" x2="480" y1="30" y2="30" stroke="#E8E8E3" />
                              <line x1="40" x2="480" y1="115" y2="115" stroke="#E8E8E3" />
                              <line x1="40" x2="480" y1="200" y2="200" stroke="#E8E8E3" />
                              <path className="draw" pathLength="1" style={{"--d":"1"} as any} d={__v.five.cur} stroke="#B4660B" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
                              {__v.five.same ? null : <path className="draw" pathLength="1" style={{"--d":"2"} as any} d={__v.five.best} stroke="#3E7F35" strokeWidth="2.6" fill="none" strokeLinejoin="round" />}
                              {__v.five.same ? null : <text x={__v.five.endX} y={Number(__v.five.bestEnd.y) + 4} fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#3E7F35">{__v.five.bestEnd.t}</text>}
                              <text x={__v.five.endX} y={Number(__v.five.curEnd.y) + 4} fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#B4660B">{__v.five.curEnd.t}</text>
                              {__v.five.labs.map((l: string, il: number) => <text key={il} x={__v.five.xs[il]} y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">{l}</text>)}
                            </svg>) : <div className="sk" style={{"height":"230px","borderRadius":"12px"} as any} aria-busy="true" />}
                            <span className="meta">
                              {"Soil Ledger: RothC carbon, nitrogen balance, salinity and the crop sequence, on your weather."}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {__v?.isTry ? (
                    <>
                      <div className="col" style={{"gap":"26px"} as any}>
                        <div className="qs rise" role="group" aria-label="Question" style={{"--d":"1"} as any}>
                          {((__v?.qs) || []).map((x: any, i14: number) => (
                            <Fragment key={i14}>
                              <button type="button" className={__s(x?.cls) as any} aria-pressed={__s(x?.pressed) as any} onClick={x?.pick}>
                                {__s(x?.label)}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div className="row sp rise" style={{"--d":"2"} as any}>
                          <span className="meta" style={{"fontSize":"15px"} as any}>
                            {__s(__v?.monthTxt)}
                          </span>
                          <div className="months" role="group" aria-label="Month">
                            {((__v?.months) || []).map((m: any, i15: number) => (
                              <Fragment key={i15}>
                                <button type="button" className={__s(m?.cls) as any} aria-pressed={__s(m?.pressed) as any} onClick={m?.pick}>
                                  {__s(m?.label)}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="rise" style={{"--d":"3"} as any}>
                          <div className="sims">
                            {((__v?.opts) || []).map((o: any, i16: number) => (
                              <Fragment key={i16}>
                                <article className={__s(o?.cls) as any}>
                                  <div className="scene">
                                    <svg viewBox="0 0 360 230" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{"position":"absolute","inset":"0"} as any}>
                                      <path d="M150 126l140 80 70 -40 -140 -80z" fill="#C9C2A8" transform="translate(-112 -12)" />
                                      {((o?.blocks) || []).map((b: any, i17: number) => (
                                        <Fragment key={i17}>
                                          <g transform={__s(b?.tf) as any} style={{"transition":"transform .5s var(--ease)"} as any}>
                                            <path d={__s(b?.lf) as any} fill={__s(b?.sc) as any} />
                                            <path d={__s(b?.rt) as any} fill={__s(b?.rc) as any} fillOpacity=".85" />
                                            <path d={__s(b?.top) as any} fill={__s(b?.tc) as any} />
                                          </g>
                                        </Fragment>
                                      ))}
                                    </svg>
                                    <span style={{"position":"absolute","left":"18px","top":"16px","width":"40px","height":"40px","borderRadius":"20px","background":"#fff","color":"#141A16","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700"} as any}>
                                      {__s(o?.n)}
                                    </span>
                                    {o?.best ? (
                                      <>
                                        <span style={{"position":"absolute","right":"16px","top":"18px","height":"30px","padding":"0 12px","borderRadius":"15px","background":"var(--sun)","color":"#141A16","display":"flex","alignItems":"center","fontSize":"13px","fontWeight":"700"} as any}>
                                          {"Bezra's pick"}
                                        </span>
                                      </>
                                    ) : null}
                                  </div>
                                  <div style={{"padding":"18px 22px 8px"} as any}>
                                    <b style={{"fontSize":"24px","fontWeight":"600","letterSpacing":"-.4px"} as any}>
                                      {__s(o?.t)}
                                    </b>
                                  </div>
                                  {((o?.d) || []).map((r: any, i18: number) => (
                                    <Fragment key={i18}>
                                      <div className="orow">
                                        <span>
                                          {__s(r?.a)}
                                        </span>
                                        <b>
                                          {__s(r?.b)}
                                        </b>
                                      </div>
                                    </Fragment>
                                  ))}
                                  <div style={{"padding":"16px 22px 22px"} as any}>
                                    <button type="button" className="btn press" onClick={o?.use} style={{"width":"100%","background":"#E9E9E5","color":"#141A16"} as any}>
                                      {__s(o?.useLabel)}
                                    </button>
                                  </div>
                                </article>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="verdict rise" style={{"--d":"4"} as any}>
                          <svg aria-hidden="true" width="52" height="52" viewBox="0 0 60 60">
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
                          <b style={{"fontSize":"18px","fontWeight":"600","lineHeight":"1.45"} as any}>
                            {__s(__v?.say)}
                          </b>
                          <span className="meta" style={{"color":"var(--green)"} as any}>
                            {"Each option: " + __s(__v?.yearsUsed) + " weather years on your field"}
                          </span>
                        </div>
                        <p className="meta">
                          {"Outputs are ranges from the crop model (WOFOST-style, tuned to your field's greenness history). Not a promise: weather after today is unknown."}
                        </p>
                      </div>
                    </>
                  ) : null}
                  {__v?.isReplay ? (
                    <>
                      <div className="col" style={{"gap":"22px"} as any}>
                        <div className="row sp rise" style={{"--d":"1","alignItems":"flex-end"} as any}>
                          <div className="col" style={{"gap":"8px","maxWidth":"760px"} as any}>
                            <b style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.5px","lineHeight":"1.3"} as any}>
                              {__s(__v?.replaySay)}
                            </b>
                            <span className="txt">
                              {__s(__v?.replaySub)}
                            </span>
                          </div>
                          <span className="leg">
                            <span>
                              <i style={{"background":"#C9CBC4","height":"10px"} as any} />
                              {"What you got"}
                            </span>
                            <span>
                              <i style={{"background":"#3E7F35","height":"10px"} as any} />
                              {"With Bezra"}
                            </span>
                            <span>
                              <i style={{"background":"#CFE3C6","height":"10px"} as any} />
                              {"Clover year"}
                            </span>
                          </span>
                        </div>
                        <div className="rp rise" style={{"--d":"2"} as any} role="group" aria-label="Seasons">
                          {((__v?.rp) || []).map((s: any, i19: number) => (
                            <Fragment key={i19}>
                              <button type="button" className={__s(s?.cls) as any} aria-pressed={__s(s?.pressed) as any} onClick={s?.pick}>
                                <span className="bars">
                                  <i style={__css(s?.hu)} />
                                  <i style={__css(s?.hb)} />
                                </span>
                                <small>
                                  {__s(s?.label)}
                                </small>
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div className="rpnote rise" style={{"--d":"3"} as any}>
                          <svg aria-hidden="true" width="52" height="52" viewBox="0 0 60 60">
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
                              <path d="M26 38h8" stroke="#3A2A10" strokeWidth="2.2" strokeLinecap="round" />
                              <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                              <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            </g>
                          </svg>
                          <span className="col" style={{"gap":"4px"} as any}>
                            <span className="meta" style={{"fontWeight":"600"} as any}>
                              {__s(__v?.rsLabel)}
                            </span>
                            <b style={{"fontSize":"18px","fontWeight":"600","lineHeight":"1.45"} as any}>
                              {__s(__v?.rsNote)}
                            </b>
                            <span className="meta">
                              {__s(__v?.rsNums)}
                            </span>
                          </span>
                          <b style={{"fontSize":"28px","fontWeight":"600","color":"var(--green)","letterSpacing":"-.8px"} as any}>
                            {__s(__v?.rsGain)}
                          </b>
                        </div>
                        <p className="meta">
                          {"Replay: what you got is estimated from each season's peak greenness (HLS/MODIS), calibrated on 214 nearby fields with known harvests. \"With Bezra\" re-runs the crop model with Bezra's advice, using only data from before each decision. 1 of 4 heat waves had no early sign and is counted as missed."}
                        </p>
                      </div>
                    </>
                  ) : null}
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
          {__v?.asking ? (
            <>
              <div className="scrim" onClick={__v?.cancel} />
              <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="ty-h">
                <h3 id="ty-h" style={{"fontSize":"22px","fontWeight":"600"} as any}>
                  {__s(__v?.confirmTxt)}
                </h3>
                <p className="txt">
                  {"Your Season plan and your to-do will change to match. You can undo it from Season."}
                </p>
                <div className="row" style={{"gap":"10px","justifyContent":"flex-end","marginTop":"6px"} as any}>
                  <button type="button" className="btn soft press" onClick={__v?.cancel}>
                    {"Not now"}
                  </button>
                  <button type="button" className="btn press" onClick={__v?.confirm}>
                    {"Yes, change my plan"}
                  </button>
                </div>
              </div>
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
