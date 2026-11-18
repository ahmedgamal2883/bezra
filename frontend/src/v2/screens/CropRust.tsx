'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Crop-Rust.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./CropRust.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './CropRust.logic';
import { useRustData } from '@/v2/data/rust';

export default function CropRustScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const rust = useRustData();
  const __v = { ...useDC(Logic, props), ...rust };
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
                  <Link href={__r("V18-Crop") + ""} className="row meta" style={{"gap":"6px","paddingTop":"20px","fontSize":"14px"} as any}>
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m14.5 6-6 6 6 6" />
                    </svg>
                    {"Crop"}
                  </Link>
                  <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 380px","gap":"56px","alignItems":"start"} as any}>
                    <div className="col" style={{"gap":"24px"} as any}>
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="lvlpill med">
                          <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                          {__s(__v?.lvl)}{" risk"}
                        </span>
                        <span className="meta">
                          {"This week · whole field"}
                        </span>
                      </span>
                      <h1 className="h1x">
                        {__s(__v?.title)}
                      </h1>
                      <p style={{"fontSize":"19px","lineHeight":"1.6","color":"var(--ink2)","maxWidth":"680px"} as any}>
                        {__s(__v?.why)}
                      </p>
                      <section className="col hair" style={{"paddingTop":"8px"} as any} aria-labelledby="rd-h">
                        <h2 id="rd-h" className="sec" style={{"padding":"16px 0 6px"} as any}>
                          {"WHAT TO DO"}
                        </h2>
                        <div className="steps3">
                          <div className="s3">
                            <span className="n">
                              {"1"}
                            </span>
                            <span className="col" style={{"gap":"4px"} as any}>
                              <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {__s(__v?.step1)}
                              </b>
                              <span className="txt">
                                {"Early morning is best, when leaves are still damp."}
                              </span>
                            </span>
                          </div>
                          <div className="s3">
                            <span className="n">
                              {"2"}
                            </span>
                            <span className="col" style={{"gap":"4px"} as any}>
                              <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {"Look at the lower leaves"}
                              </b>
                              <span className="txt">
                                {"Rust looks like small orange or brown powder spots. It rubs off on your finger."}
                              </span>
                            </span>
                          </div>
                          <div className="s3">
                            <span className="n">
                              {"3"}
                            </span>
                            <span className="col" style={{"gap":"4px"} as any}>
                              <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {"If you see it, add it to your journal with a photo"}
                              </b>
                              <span className="txt">
                                {"Your engineer sees it the same day and decides if you need to spray."}
                              </span>
                            </span>
                          </div>
                        </div>
                      </section>
                      <div className="row" style={{"gap":"10px"} as any}>
                        {false ? (
                          <>
                            <button type="button" className="btn press" onClick={__v?.add} style={{"height":"52px","fontSize":"15px"} as any}>
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                              {"Add to my to-do for Wed 9 Dec"}
                            </button>
                          </>
                        ) : null}
                        {false ? (
                          <>
                            <span className="doneline">
                              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m5 12.5 4.5 4.5L19 7.5" />
                              </svg>
                              {"On your to-do for Wed 9 Dec"}
                              <button type="button" onClick={__v?.undoAdd} style={{"border":"0","background":"transparent","font":"inherit","color":"var(--green)","textDecoration":"underline","cursor":"pointer","padding":"0 10px"} as any}>
                                {"Undo"}
                              </button>
                            </span>
                          </>
                        ) : null}
                        <Link href={__r("V18-Log-Leaf") + ""} className="btn soft press" style={{"height":"52px","fontSize":"15px"} as any}>
                          {"I already see orange spots"}
                        </Link>
                      </div>
                      <p className="meta" style={{"fontSize":"14px"} as any}>
                        {"Bezra does not suggest spray doses. If you need to spray, your engineer tells you what and how much."}
                      </p>
                    </div>
                    <aside className="col" style={{"gap":"14px","padding":"24px","borderRadius":"24px","background":"#fff"} as any}>
                      <span className="sec">
                        {"WHAT RUST LOOKS LIKE"}
                      </span>
                      <div style={{"background":"#EEF1E6","borderRadius":"18px","display":"flex","justifyContent":"center","padding":"18px"} as any}>
                        <svg viewBox="0 0 64 48" width="220" height="165" aria-hidden="true">
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
                      </div>
                      <p className="txt">
                        {"Small orange spots, in lines or scattered, mostly on older leaves."}
                      </p>
                      <div className="col hair" style={{"gap":"6px","paddingTop":"12px"} as any}>
                        <span className="meta">
                          {"On this field before"}
                        </span>
                        <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                          {__s(__v?.pastN)}
                        </b>
                        <span className="meta">
                          {__s(__v?.pastSub)}
                        </span>
                      </div>
                    </aside>
                  </div>
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"28px"} as any}>
                  <Link href={__r("V18-Crop") + ""} className="row meta" style={{"gap":"6px","paddingTop":"20px","fontSize":"14px"} as any}>
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m14.5 6-6 6 6 6" />
                    </svg>
                    {"Crop"}
                  </Link>
                  <div className="row sp" style={{"alignItems":"flex-end"} as any}>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="lvlpill med">
                          <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                          {__s(__v?.lvlD)}
                        </span>
                        <span className="meta">
                          {"Leaf and stripe rust · whole field"}
                        </span>
                      </span>
                      <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                        {__s(__v?.title)}
                      </h1>
                    </div>
                    {false ? (
                      <>
                        <button type="button" className="btn press" onClick={__v?.add}>
                          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          {"Add scouting on Wed 9 Dec"}
                        </button>
                      </>
                    ) : null}
                    {false ? (
                      <>
                        <span className="doneline">
                          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 12.5 4.5 4.5L19 7.5" />
                          </svg>
                          {"Added for Wed 9 Dec"}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="chart">
                    {__v?.days ? (<svg viewBox="0 0 980 230" width="100%" role="img" aria-label={__s(__v.daysLabel)}>
                      <line x1="40" x2="970" y1="200" y2="200" stroke="#E8E8E3" />
                      <rect x={__v.fcX} y="16" width={970 - __v.fcX} height="184" fill="#ECECE6" fillOpacity=".6" />
                      <line x1="40" x2="970" y1={__v.y85} y2={__v.y85} stroke="#C2412A" strokeDasharray="5 5" />
                      <text x="970" y={__v.y85 - 6} textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#C2412A">{"85% humidity: rust likes it"}</text>
                      {__v.days.map((d: any, j: number) => (<g key={j}>
                        <rect className="grow" style={{"--i": String(j)} as any} x={d.x} y={d.y} width="40" height={d.h} rx="6" fill={d.fill} />
                        <text x={d.cx} y={d.y - 6} textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">{d.rh}</text>
                        <text x={d.cx} y="218" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">{d.lab}</text>
                      </g>))}
                      <text x={__v.fcX + 8} y="30" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#6A716C">{"Forecast"}</text>
                    </svg>) : <div className="sk" style={{"height":"230px","borderRadius":"12px"} as any} aria-busy="true" />}
                    <span className="pq sat">{__s(__v?.src)}</span>
                  </div>
                  <div className="grid hair" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))","gap":"40px","paddingTop":"28px"} as any}>
                    <div className="chart">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Night humidity, last 7 nights"}
                      </b>
                      {__v?.past7 ? (<svg style={{"maxWidth":"380px"} as any} viewBox="0 0 420 150" width="100%" role="img" aria-label={__s(__v.humNote)}>
                        {__v.past7.map((d: any, j: number) => (<g key={j}>
                          <rect className="grow" style={{"--i": String(j)} as any} x={10 + j * 58} y={120 - d.h7} width="40" height={d.h7} rx="6" fill={d.wet ? "#2F6FA8" : "#B7C9D8"} />
                          <text x={30 + j * 58} y={114 - d.h7} textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">{d.rh}</text>
                          <text x={30 + j * 58} y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">{d.dd}</text>
                        </g>))}
                        <line x1="0" x2="420" y1={120 - 85 * 0.794} y2={120 - 85 * 0.794} stroke="#C2412A" strokeDasharray="5 5" />
                      </svg>) : <div className="sk" style={{"height":"150px","borderRadius":"12px"} as any} aria-busy="true" />}
                      <span className="meta">
                        {__s(__v?.humNote)}
                      </span>
                    </div>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Inputs today"}
                      </b>
                      <table className="tbl">
                        <tbody>
                          <tr>
                            <td>
                              {"Night temp"}
                            </td>
                            <td>
                              {__s(__v?.nightT)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Leaf wetness"}
                            </td>
                            <td>
                              {"Not measured"}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Rust weather days (7)"}
                            </td>
                            <td>
                              {__s(__v?.n7)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Crop stage"}
                            </td>
                            <td>
                              {__s(__v?.stage)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Variety"}
                            </td>
                            <td>
                              {__s(__v?.variety)}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Spores nearby"}
                            </td>
                            <td>
                              {"No data"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Rust years on this field"}
                      </b>
                      {((__v?.years) || []).map((y: any, j: number) => (
                        <div className="row sp" key={j} style={{"padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                          <b style={{"fontWeight":"600"} as any}>{y.winter}</b>
                          <span className="meta">{y.txt}</span>
                        </div>
                      ))}
                      
                      
                      <span className="meta">
                        {__s(__v?.yearsNote)}
                      </span>
                    </div>
                  </div>
                  <p className="meta">
                    {"Spray choice and dose: engineer only. Bezra shows the risk and the evidence."}
                  </p>
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
