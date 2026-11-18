'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Story.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Story.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Story.logic';
import { useStory } from '@/v2/data/story';

export default function StoryScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const st = useStory();
  const __v = { ...useDC(Logic, props), ...st };
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
                <div className="col" style={{"gap":"8px"} as any}>
                  <div className="row sp rise" style={{"--d":"0","alignItems":"flex-end","paddingTop":"24px"} as any}>
                    <div className="col" style={{"gap":"14px","maxWidth":"860px"} as any}>
                      <span className="row" style={{"gap":"12px"} as any}>
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
                            <path d="M24 36q6 7 12 0z" fill="#3A2A10" />
                            <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          </g>
                        </svg>
                        <span className="meta" style={{"fontSize":"15px"} as any}>
                          {__s(__v?.head)}
                        </span>
                      </span>
                      <h1 className="h1x">
                        {__s(__v?.title)}
                      </h1>
                    </div>
                  </div>
                  {((__v?.findings) || []).map((f: any, jf: number) => (
                  <article className="dcard rise" key={jf} style={{"--d": String(jf + 2),"gridTemplateColumns":"minmax(0, 680px) 360px"} as any}>
                    <div className="col" style={{"gap":"16px"} as any}>
                      <div className="row" style={{"gap":"14px"} as any}>
                        <span className="dnum">{jf + 1}</span>
                        <h2 style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.4px"} as any}>{f.title}</h2>
                      </div>
                      <p style={{"fontSize":"18px","lineHeight":"1.6","color":"var(--ink2)"} as any}>{f.body}</p>
                      {f.dots.length ? (<div className="col" style={{"gap":"8px"} as any}>
                        <div className="dots10" aria-hidden="true">{f.dots.map((b: boolean, jd: number) => <i key={jd} className={b ? "bad" : ""} />)}</div>
                        <span className="meta">{f.note}</span>
                      </div>) : null}
                    </div>
                    <div className="decide">
                      <span className="k">{"What to do"}</span>
                      <b>{f.todo}</b>
                      <span className="meta">{f.sub}</span>
                      <Link href={f.href} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600"} as any}>{f.link}</Link>
                    </div>
                  </article>
                ))}
                {__v?.ready ? null : <div className="sk" style={{"height":"260px","borderRadius":"24px"} as any} aria-busy="true" />}
                  
                  
                  <div className="row hair rise" style={{"--d":"6","gap":"14px","paddingTop":"28px"} as any}>
                    <Link href={__r("V18-Today") + ""} className="btn cta press" style={{"height":"54px","fontSize":"16px","padding":"0 6px 0 22px"} as any}>
                      {"Go to my field"}
                      <span className="ar">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                    <span className="meta" style={{"fontSize":"14px"} as any}>
                      {"Want the charts and numbers? Switch to "}
                      <b style={{"color":"var(--ink)"} as any}>
                        {"Details"}
                      </b>
                      {" at the top."}
                    </span>
                  </div>
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"24px"} as any}>
                  <div className="col" style={{"gap":"10px"} as any}>
                    <span className="meta" style={{"fontSize":"15px"} as any}>{__s(__v?.head)}</span>
                    <h1 className="h1x" style={{"fontSize":"clamp(28px, 6vw, 40px)","overflowWrap":"anywhere"} as any}>{"Here's what we already know about your field."}</h1>
                  </div>
                  <section className="col" style={{"gap":"10px"} as any}>
                    <h2 className="sec">{"WINTER GREENNESS AROUND YOUR FIELD, SEASON BY SEASON (NDVI)"}</h2>
                    <div style={{"overflowX":"auto","maxWidth":"100%"} as any}><table className="tbl">
                      <thead><tr><th>{"Season"}</th>{((__v?.seasons) || []).map((x: any, jx: number) => <th key={jx}>{x.y}</th>)}</tr></thead>
                      <tbody>
                        <tr><td>{"Winter peak"}</td>{((__v?.seasons) || []).map((x: any, jx: number) => <td key={jx}>{x.v}</td>)}</tr>
                        <tr><td>{"Summer, from space"}</td>{((__v?.seasons) || []).map((x: any, jx: number) => <td key={jx}>{x.s === "rice" ? "Rice" : x.s === "bare" ? "Bare" : "Crop"}</td>)}</tr>
                      </tbody>
                    </table></div>
                    <span className="pq sat">{__s(__v?.histSrc)}</span>
                  </section>
                  {((__v?.findings) || []).map((f: any, jf: number) => (
                    <div className="row sp" key={jf} style={{"padding":"12px 0","borderTop":"1px solid var(--line)","gap":"24px"} as any}>
                      <b style={{"fontWeight":"600"} as any}>{f.title}</b><span className="meta">{f.body}</span>
                    </div>
                  ))}
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
