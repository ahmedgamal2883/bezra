'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Crop.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Crop.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Tour from '@/v2/tour/Tour';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Crop.logic';
import { useCropData } from '@/v2/data/crop';

export default function CropScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const crop = useCropData();
  const __v = { ...useDC(Logic, props), ...crop };
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
              <Link href={__r("V18-Crop") + ""} aria-current="page" className="press">
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
                <div className="col" style={{"gap":"32px"} as any}>
                  <div className="pagehead rise" style={{"--d":"0"} as any}>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <span className="meta" style={{"fontSize":"15px"} as any}>
                        {__s(__v?.head)}
                      </span>
                      <h1 className="h1x">
                        {__s(__v?.headline)}
                      </h1>
                    </div>
                  </div>
                  <section className="col rise" style={{"--d":"1"} as any} aria-label="Risks this week">
                    {((__v?.risks) || []).map((r: any, ir: number) => (
                      <article className="rk" key={ir}>
                        <span className="rki" style={__css(r.sty)}><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={r.path} /></svg></span>
                        <div className="col" style={{"gap":"4px"} as any}>
                          <b style={{"fontSize":"20px","fontWeight":"600"} as any}>{__s(r.name)}</b>
                          <span style={{"fontSize":"16px","color":"var(--ink2)"} as any}>{__s(r.why)}</span>
                        </div>
                        <span className={"lvlpill " + r.cls}><i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />{__s(r.lvl)}</span>
                        {r.href ? <Link href={__r(r.href === 'rust' ? "V18-Crop-Rust" : "V18-Today")} className="go press">{__s(r.go)}<span className="ar"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8" /></svg></span></Link>
                          : <span className="go" style={{"cursor":"default"} as any}>{__s(r.go)}</span>}
                      </article>
                    ))}
                    {__v?.risks ? null : <div className="sk" style={{"height":"220px","borderRadius":"16px"} as any} aria-busy="true" />}
                  </section>
                  <Link href={__r("V18-Check") + ""} className="bigcta press rise" style={{"--d":"3"} as any}>
                    <svg aria-hidden="true" width="64" height="64" viewBox="0 0 60 60">
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
                      <b style={{"fontSize":"24px","fontWeight":"600"} as any}>
                        {"Something looks wrong?"}
                      </b>
                      <span style={{"color":"rgba(255,255,255,.75)","fontSize":"16px"} as any}>
                        {"Pick what you see from pictures. Bezra tells you what it most likely is and what to do."}
                      </span>
                    </span>
                    <span className="btn sun" style={{"height":"52px","fontSize":"15px"} as any}>
                      {"Check a problem"}
                    </span>
                  </Link>
                  <section className="grid hair rise" style={{"--d":"4","gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"56px","paddingTop":"32px"} as any}>
                    <div className="col" style={{"gap":"8px"} as any}>
                      <h2 className="sec">
                        {"WHAT COST YOUR HARVEST LAST SEASON"}{__v?.past ? " · " + __v.past.season : ""}
                      </h2>
                      {((__v?.past?.rows) || []).map((x: any, ih: number) => (
                        <div className="hist" key={ih}>
                          <span>{__s(x.t)}</span>
                          <span className="hbar"><i className="growx" style={__css(x.w)} /></span>
                          <b style={{"fontWeight":"600"} as any}>{__s(x.v)}</b>
                        </div>
                      ))}
                      
                      
                      
                    </div>
                    <div className="col" style={{"gap":"12px","justifyContent":"center"} as any}>
                      <b style={{"fontSize":"22px","fontWeight":"600","lineHeight":"1.35"} as any}>
                        {__s(__v?.past?.say)}
                      </b>
                      <p className="txt">
                        {__s(__v?.past?.sub)}
                      </p>
                      <Link href={__r("V19-Soil") + ""} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600"} as any}>
                        {"See how your soil is doing"}
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9.5 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </div>
                  </section>
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"28px"} as any}>
                  <div className="pagehead rise" style={{"--d":"0"} as any}>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <span className="meta">
                        {__s(__v?.headD)}
                      </span>
                      <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                        {"Crop risks this week"}
                      </h1>
                    </div>
                    <Link href={__r("V18-Check") + ""} className="btn press" style={{"height":"50px"} as any}>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />
                      </svg>
                      {"Check a problem"}
                    </Link>
                  </div>
                  <section className="col rise" style={{"--d":"1"} as any}>
                    {((__v?.risks) || []).map((r: any, ir: number) => (
                      <article className="rk" key={ir} style={{"gridTemplateColumns":"56px 220px minmax(0, 1fr) 130px 40px"} as any}>
                        <span className="rki" style={__css(r.sty)}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={r.path} /></svg></span>
                        <b style={{"fontWeight":"600"} as any}>{__s(r.line || r.name)}</b>
                        <span className="col" style={{"gap":"4px"} as any}><span className="meta" style={{"color":"var(--ink2)","fontSize":"14px"} as any}>{__s(r.why)}</span><span className="pq sat">{__s(r.src)}</span></span>
                        <span className={"lvlpill " + r.cls}><i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />{__s(r.lvl)}</span>
                        <span />
                      </article>
                    ))}
                    
                    
                    
                    
                  </section>
                  <section className="grid hair rise" style={{"--d":"2","gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"48px","paddingTop":"28px"} as any}>
                    <div className="chart">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>{"Rust weather this week"}</b>
                      {__v?.damp ? (<div className="col" style={{"gap":"10px"} as any}>
                        <b style={{"fontSize":"22px","fontWeight":"600"} as any}>{__s(__v.damp.sub)}</b>
                        <p className="txt">{__s(__v.damp.line)} {__s(__v.damp.why)}</p>
                        <p className="meta">{__s(__v.damp.check)}</p>
                        <span className="pq sat">{__s(__v.damp.src)}</span>
                      </div>) : <div className="sk" style={{"height":"160px","borderRadius":"12px"} as any} aria-busy="true" />}
                    </div>
                    <div className="chart">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>{"Highest temperature, next 7 days"}</b>
                      {__v?.heat ? (<svg style={{"maxWidth":"520px"} as any} viewBox="0 0 420 150" width="100%" role="img" aria-label={__v.heat.hot ? "Highest temperature for the next 7 days, some days over 32 degrees." : "Highest temperature for the next 7 days, all under 32 degrees."}>
                        {__v.heat.bars.map((b: any, ib: number) => (<g key={ib}>
                          <rect className="grow" style={{"--i": String(ib)} as any} x={b.x} y={b.y} width="40" height={b.h} rx="6" fill={b.fill} />
                          <text x={b.tx} y={b.ty} textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">{b.t}</text>
                          <text x={b.tx} y="146" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">{b.day}</text>
                        </g>))}
                        <line x1="0" x2="420" y1={__v.heat.lineY} y2={__v.heat.lineY} stroke="#C2412A" strokeDasharray="5 5" />
                        <text x="418" y={Number(__v.heat.lineY) - 5} textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#C2412A">{"32° risk line"}</text>
                      </svg>) : <div className="sk" style={{"height":"150px","borderRadius":"12px"} as any} aria-busy="true" />}
                      <span className="pq sat">{"Open-Meteo forecast"}</span>
                    </div>
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
      <Tour page="Crop" />
    </>
  );
}
