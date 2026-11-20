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
import { useDataSheet } from '@/v2/data/datasheet';
import ReviewBox from '@/v2/ReviewBox';

export default function DataScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const ds = useDataSheet();
  const __v = { ...useDC(Logic, props), ...ds };
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
              <Link href={__r("V18-Overview") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                {"Overview"}
              </Link>
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
                      {__s(__v?.name)}{" · from NASA and ESA satellites and your journal"}
                    </span>
                    <h1 className="h1x">
                      {"Your field in six sentences."}
                    </h1>
                  </div>
                  <div className="col">
                    {((__v?.six) || []).map((x: any, ix: number) => (
                      <div className="again" key={ix} style={{"gridTemplateColumns":"56px minmax(0, 1fr)"} as any}>
                        <span className="rki" style={{"background":"#fff","fontWeight":"600"} as any}>{ix + 1}</span>
                        <span className="col" style={{"gap":"4px"} as any}>
                          <b style={{"fontSize":"20px","fontWeight":"600"} as any}>{x.t}</b>
                          <span className="txt" style={{"fontSize":"16px"} as any}>{x.s}</span>
                        </span>
                      </div>
                    ))}
                    {__v?.ready ? null : <div className="sk" style={{"height":"300px","borderRadius":"16px"} as any} aria-busy="true" />}
                  </div>
                  <span className="meta" style={{"fontSize":"14px"} as any}>
                    {"All the numbers and charts are in "}
                    <b style={{"color":"var(--ink)"} as any}>
                      {"Details"}
                    </b>
                    {" at the top."}
                  </span>
                  <section id="ask" className="col" style={{"gap":"10px","scrollMarginTop":"90px"} as any}>
                    <h2 className="sec">{"CHECK THIS WITH YOUR ENGINEER"}</h2>
                    <ReviewBox v={__v} />
                  </section>
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"28px"} as any}>
                  <div className="row sp" style={{"alignItems":"flex-end","gap":"16px","flexWrap":"wrap"} as any}>
                    <div className="col" style={{"gap":"8px"} as any}>
                      <span className="meta" style={{"fontSize":"15px"} as any}>{__s(__v?.name)}{" · data sheet"}</span>
                      <h1 className="h1x" style={{"fontSize":"clamp(28px, 6vw, 40px)","overflowWrap":"anywhere"} as any}>{"Everything Bezra knows about this field."}</h1>
                    </div>
                    <span className="row" style={{"gap":"10px"} as any}>
                      <button type="button" className="btn soft press" onClick={() => __v?.csv?.()} disabled={!__v?.ready}>{"Download CSV"}</button>
                      <a href="#ask" className="btn press">{"Check with my engineer"}</a>
                    </span>
                  </div>
                  {__v?.loadingSome && __v?.ready ? <span className="pq est">{"Some numbers are still being read from NASA. They appear when you open this page again."}</span> : null}
                  {__v?.ready ? ([["NOW", __v?.now], ["EXPECTED", __v?.expected], ["BEFORE THIS SEASON AND SO FAR", __v?.past]] as any[]).map(([h, rows]: any, js: number) => (
                    <section className="col" key={js} style={{"gap":"8px"} as any}>
                      <h2 className="sec">{h}</h2>
                      <div style={{"overflowX":"auto","maxWidth":"100%"} as any}><table className="tbl">
                        <thead><tr><th>{"What"}</th><th>{"Value"}</th><th>{"Source"}</th></tr></thead>
                        <tbody>{(rows || []).map((f: any, jf: number) => <tr key={jf}><td>{f[0]}</td><td><b>{f[1]}</b></td><td className="meta">{f[2]}</td></tr>)}</tbody>
                      </table></div>
                    </section>
                  )) : <div className="sk" style={{"height":"420px","borderRadius":"16px"} as any} aria-busy="true" />}
                  {__v?.ready ? (
                    <section className="col" style={{"gap":"8px"} as any}>
                      <h2 className="sec">{"WHAT YOU TOLD BEZRA"}</h2>
                      {((__v?.feedback) || []).length ? (
                        <div style={{"overflowX":"auto","maxWidth":"100%"} as any}><table className="tbl">
                          <tbody>{(__v?.feedback || []).map((f: any, jf: number) => <tr key={jf}><td className="meta">{f[0]}</td><td>{f[1]}</td></tr>)}</tbody>
                        </table></div>
                      ) : <p className="meta">{"Nothing logged yet. Log waterings, fertilizer and what you see from Today."}</p>}
                      {__v?.feedbackNote ? <span className="meta">{__v.feedbackNote}</span> : null}
                    </section>
                  ) : null}
                  <section id="ask" className="col" style={{"gap":"10px","scrollMarginTop":"90px"} as any}>
                    <h2 className="sec">{"CHECK THIS WITH YOUR ENGINEER"}</h2>
                    <ReviewBox v={__v} />
                  </section>
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
