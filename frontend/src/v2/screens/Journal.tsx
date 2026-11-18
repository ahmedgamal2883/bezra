'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Journal.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Journal.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Journal.logic';
import { useJournalData } from '@/v2/data/journal-page';

export default function JournalScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const d = useJournalData();
  const __v = useDC(Logic, { ...props, d });
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
              <Link href={__r("V19-Season") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                </svg>
                {"Season"}
              </Link>
              <Link href={__r("V18-Journal") + ""} aria-current="page" className="press">
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
          <main className="main" style={{"gap":"24px","paddingTop":"24px","maxWidth":"1100px","width":"100%","margin":"0 auto"} as any}>
            <div className="row sp" style={{"alignItems":"flex-end"} as any}>
              <div className="col" style={{"gap":"8px"} as any}>
                <span className="meta">
                  {__s(__w.fieldName)}{" · this season"}
                </span>
                <h1 className="big" style={{"fontSize":"44px","letterSpacing":"-1.6px"} as any}>
                  {"Journal"}
                </h1>
                <p className="txt" style={{"fontSize":"17px"} as any}>
                  {"What you did and saw in your field. "}
                  <b style={{"color":"var(--ink)","fontWeight":"600"} as any}>
                    {__s(__v?.count)}
                  </b>
                  {" this season."}
                </p>
              </div>
              <span className="row" style={{"gap":"10px"} as any}>
                {__v?.details ? (
                  <>
                    <a href="#" className="btn soft press" onClick={__v?.exportCsv}>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
                      </svg>
                      {"Export CSV"}
                    </a>
                  </>
                ) : null}
                <Link href={__r("V18-Log-What") + ""} className="btn press" style={{"height":"50px"} as any}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  {"Add to journal"}
                </Link>
              </span>
            </div>
            <div className="fchips" role="group" aria-label="Show">
              {((__v?.filters) || []).map((f: any, i0: number) => (
                <Fragment key={i0}>
                  <button type="button" className={__s(f?.cls) as any} aria-pressed={__s(f?.pressed) as any} onClick={f?.pick}>
                    {__s(f?.label)}
                  </button>
                </Fragment>
              ))}
            </div>
            {__v?.has ? (
              <>
                <div className="col">
                  {__v?.simple ? (
                    <>
                      {((__v?.rows) || []).map((e: any, i1: number) => (
                        <Fragment key={i1}>
                          <article className="ent">
                            <span className="meta" style={{"paddingTop":"12px","color":"var(--ink2)","fontWeight":"600"} as any}>
                              {__s(e?.d)}
                            </span>
                            <span className={__s(e?.cls) as any} style={{"width":"52px","height":"52px","borderRadius":"16px"} as any}>
                              {e?.isWater ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isLeaf ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isFeed ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isPest ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isSpray ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isPhoto ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                  </svg>
                                </>
                              ) : null}
                            </span>
                            <span className="col" style={{"gap":"6px","minWidth":"0"} as any}>
                              <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {__s(e?.t)}
                              </b>
                              <span className="row" style={{"gap":"6px"} as any}>
                                {((e?.sq) || []).map((q: any, i2: number) => (
                                  <Fragment key={i2}>
                                    <span className="sqchip">
                                      {__s(q?.x)}
                                    </span>
                                  </Fragment>
                                ))}
                              </span>
                              {e?.o ? (<span className="row" style={{"gap":"8px","alignItems":"flex-start","color":"var(--ink2)","fontSize":"15px","lineHeight":"1.5"} as any}>
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
                                <span>
                                  {__s(e?.o)}
                                </span>
                              </span>) : null}
                            </span>
                            <span className="row" style={{"gap":"6px"} as any}>
                              <button type="button" className="ibtn2 press" onClick={e?.edit} aria-label={__s(e?.editLabel) as any}>
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
                                </svg>
                              </button>
                              <button type="button" className="ibtn2 press" onClick={e?.del} aria-label={__s(e?.delLabel) as any}>
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" />
                                </svg>
                              </button>
                            </span>
                          </article>
                        </Fragment>
                      ))}
                    </>
                  ) : null}
                  {__v?.details ? (
                    <>
                      <div className="ent d" style={{"borderTop":"0","padding":"0 0 8px"} as any}>
                        <span className="sec">
                          {"DATE"}
                        </span>
                        <span />
                        <span className="sec">
                          {"NOTE"}
                        </span>
                        <span className="sec">
                          {"WHAT IT CHANGED"}
                        </span>
                        <span />
                      </div>
                      {((__v?.rows) || []).map((e: any, i3: number) => (
                        <Fragment key={i3}>
                          <article className="ent d">
                            <span className="meta" style={{"paddingTop":"12px","color":"var(--ink2)","fontWeight":"600"} as any}>
                              {__s(e?.d)}
                            </span>
                            <span className={__s(e?.cls) as any} style={{"width":"52px","height":"52px","borderRadius":"16px"} as any}>
                              {e?.isWater ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isLeaf ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isFeed ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isPest ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isSpray ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
                                  </svg>
                                </>
                              ) : null}
                              {e?.isPhoto ? (
                                <>
                                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                  </svg>
                                </>
                              ) : null}
                            </span>
                            <span className="col" style={{"gap":"6px","minWidth":"0"} as any}>
                              <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {__s(e?.t)}
                              </b>
                              <span className="row" style={{"gap":"6px"} as any}>
                                {((e?.sq) || []).map((q: any, i4: number) => (
                                  <Fragment key={i4}>
                                    <span className="sqchip">
                                      {__s(q?.x)}
                                    </span>
                                  </Fragment>
                                ))}
                              </span>
                              {e?.o ? (<span className="row" style={{"gap":"8px","alignItems":"flex-start","color":"var(--ink2)","fontSize":"15px","lineHeight":"1.5"} as any}>
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
                                <span>
                                  {__s(e?.o)}
                                </span>
                              </span>) : null}
                            </span>
                            <span className="col" style={{"gap":"6px","paddingTop":"4px"} as any}>
                              <b style={{"fontSize":"14px","fontWeight":"600"} as any}>
                                {__s(e?.fx)}
                              </b>
                              <span className="pq farm">
                                {__s(e?.src)}
                              </span>
                            </span>
                            <span className="row" style={{"gap":"6px"} as any}>
                              <button type="button" className="ibtn2 press" onClick={e?.edit} aria-label={__s(e?.editLabel) as any}>
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
                                </svg>
                              </button>
                              <button type="button" className="ibtn2 press" onClick={e?.del} aria-label={__s(e?.delLabel) as any}>
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" />
                                </svg>
                              </button>
                            </span>
                          </article>
                        </Fragment>
                      ))}
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {__v?.empty ? (
              <>
                <div className="col" style={{"alignItems":"center","gap":"14px","padding":"72px 0","textAlign":"center"} as any}>
                  <svg aria-hidden="true" width="80" height="80" viewBox="0 0 60 60">
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
                      <path d="M26 38h8" stroke="#3A2A10" strokeWidth="2.2" strokeLinecap="round" />
                      <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                    </g>
                  </svg>
                  <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                    {__s(__v?.emptyTxt)}
                  </b>
                  <p className="txt" style={{"maxWidth":"420px"} as any}>
                    {"When you water, feed, spray or see something odd, add it here. Bezra uses it to make your plan fit your field."}
                  </p>
                  <Link href={__r("V18-Log-What") + ""} className="btn press">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    {"Add to journal"}
                  </Link>
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
          {__v?.asking ? (
            <>
              <div className="scrim" onClick={__v?.cancel} />
              <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dl-h">
                <h3 id="dl-h" style={{"fontSize":"22px","fontWeight":"600"} as any}>
                  {"Delete this note?"}
                </h3>
                <p className="txt">
                  <b style={{"color":"var(--ink)","fontWeight":"600"} as any}>
                    {__s(__v?.askT)}
                  </b>
                  {". Bezra will stop using it for your plan. You can undo right after."}
                </p>
                <div className="row" style={{"gap":"10px","justifyContent":"flex-end","marginTop":"6px"} as any}>
                  <button type="button" className="btn soft press" onClick={__v?.cancel}>
                    {"Cancel"}
                  </button>
                  <button type="button" className="btn press" onClick={__v?.confirm} style={{"background":"var(--risk)"} as any}>
                    {"Delete"}
                  </button>
                </div>
              </div>
            </>
          ) : null}
          {__v?.hasToast ? (
            <>
              <div className="toast" role="status">
                {__s(__v?.toast)}
                {__v?.canUndo ? (
                  <>
                    <button type="button" onClick={__v?.undo}>
                      {"Undo"}
                    </button>
                  </>
                ) : null}
                <button type="button" onClick={__v?.closeToast} aria-label="Close">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
