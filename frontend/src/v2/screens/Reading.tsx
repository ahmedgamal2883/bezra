'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Reading.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Reading.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Reading.logic';
import { useReading } from '@/v2/data/reading';

export default function ReadingScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const rd = useReading();
  const __v = { ...useDC(Logic, props), ...rd };
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
          <main className="main" style={{"gap":"24px"} as any}>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 7fr) minmax(0, 5fr)","gap":"48px","alignItems":"stretch","minHeight":"720px"} as any}>
              <section className="hero rise" style={{"--d":"0","background":"#D9D6C8"} as any} aria-label="Your field on the satellite map, being read">
                {" "}
                <svg role="img" aria-label="Your field on the satellite map" width="100%" height="100%" viewBox="400 66 570 460" preserveAspectRatio="xMidYMid slice" style={{"position":"absolute","inset":"0"} as any}><rect x="-400" y="-400" width="2160" height="1320" fill="#55603F" />{__v?.photo ? <image href={__v.photo} x="0" y="0" width="1360" height="520" preserveAspectRatio="none" /> : null}{__v?.outline ? <polygon points={__v.outline} fill="rgba(242,155,30,.18)" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" /> : null}</svg>
                {" "}
                <div className="scan" aria-hidden="true" />
                <div style={{"position":"absolute","left":"20px","bottom":"20px","padding":"12px 16px","borderRadius":"14px","background":"rgba(255,255,255,.88)","backdropFilter":"blur(10px)","display":"flex","flexDirection":"column","gap":"2px"} as any}>
                  <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                    {__s(__v?.name)}{__v?.area ? " · " + __v.area + " feddan" : ""}
                  </b>
                  <span className="meta">
                    {"Your field from space"}
                  </span>
                </div>
              </section>
              <div className="col" style={{"gap":"20px","padding":"8px 4px","justifyContent":"center"} as any}>
                <span className="row rise" style={{"--d":"0","gap":"10px"} as any}>
                  <svg aria-hidden="true" width="44" height="44" viewBox="0 0 60 60">
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
                  <span className="meta">
                    {"Saved just now · "}{__s(__v?.name)}
                  </span>
                </span>
                <h1 className="big rise" style={{"--d":"1","fontSize":"40px"} as any}>
                  {"Reading the history of your field."}
                </h1>
                <p className="txt rise" style={{"--d":"1"} as any}>
                  {"Before you log anything, NASA already has a long memory of this land. This takes about a minute."}
                </p>
                <div className="col" aria-live="polite">
                  {((__v?.rows) || []).map((r: any, ir: number) => (
                    <div className="src hair rise" key={ir} style={{"--d": String(ir + 2)} as any}>
                      <span className="tick" style={{"opacity": r.done ? 1 : 0.25, "animation": "none"} as any}>
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                      </span>
                      <div className="col" style={{"gap":"2px","minWidth":"0"} as any}>
                        <b style={{"fontSize":"16px","fontWeight":"600"} as any}>{r.name}</b>
                        <span className="meta">{r.what}</span>
                        <div className="bar"><i style={{"animation": r.done ? "none" : undefined, "width": r.done ? "100%" : undefined} as any} /></div>
                      </div>
                      <span className="meta" style={{"color":"var(--ink)","fontWeight":"600","fontVariantNumeric":"tabular-nums"} as any}>{r.done ? r.v : "Reading…"}</span>
                    </div>
                  ))}
                </div>
                <div className="row rise" style={{"--d":"9","gap":"12px","marginTop":"8px"} as any}>
                  <Link href={__s(__v?.next)} aria-disabled={!__v?.ready} className="btn cta press" style={{"height":"52px","fontSize":"15px","padding":"0 6px 0 22px"} as any}>
                    {__v?.ready ? "Open my field" : "Reading… " + __s(__v?.done) + " of " + __s(__v?.total)}
                    <span className="ar">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </Link>
                  <span className="meta">
                    {"The long history keeps loading in the background"}
                  </span>
                </div>
                <span className="rise" style={{"--d":"10"} as any} />
              </div>
            </div>
            <footer className="foot" style={{"paddingTop":"24px"} as any}>
              <span>
                {"Bezra helps you think. It doesn't decide for you."}
              </span>
              <span />
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
