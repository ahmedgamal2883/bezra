'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V19-Soil.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Soil.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Tour from '@/v2/tour/Tour';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Soil.logic';
import { useSoilData } from '@/v2/data/soil';

export default function SoilScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const soil = useSoilData();
  const __v = { ...soil, ...useDC(Logic, { ...props, d: soil }) };
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
              <Link href={__r("V19-Soil") + ""} aria-current="page" className="press">
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
                <div className="col" style={{"gap":"40px"} as any}>
                  <div className="pagehead rise" style={{"--d":"0"} as any}>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <span className="meta" style={{"fontSize":"15px"} as any}>
                        {__s(__v?.field)}{__v?.histYears ? " · read from " + __v.histYears + " seasons of satellite images and your journal" : ""}
                      </span>
                      {__v?.bareSay ? <span className="txt" style={{"fontSize":"15px"} as any}>{__v.bareSay}</span> : null}
                      {__v?.ready ? (
                        <>
                          <h1 className="h1x">{__v?.falling ? "Your soil is getting tired." : "Your soil is holding up."}</h1>
                          <p style={{"fontSize":"19px","color":"var(--ink2)","maxWidth":"760px"} as any}>
                            {__v?.falling ? "Each winter the land around your field gets a little less green. " : "Winter greenness around your field is steady. "}
                            {__v?.restTxt ? "Next winter, give the soil a rest with " + __v.restTxt + "." : ""}
                          </p>
                        </>
                      ) : <div className="sk" style={{"height":"110px","borderRadius":"16px","maxWidth":"760px"} as any} aria-busy="true" />}
                    </div>
                  </div>
                  {__v?.strip ? (
                  <section className="col rise" style={{"--d":"1","gap":"16px"} as any} aria-labelledby="sh-h">
                    <h2 id="sh-h" className="sec">{"HOW GREEN EACH WINTER GOT, SEASON BY SEASON"}</h2>
                    <svg viewBox="0 0 1080 220" width="100%" role="img" aria-label={__s(__v.trendTxt)}>
                      <rect x="44" y="58.5" width="1016" height="42.5" fill="#E4EFE7" />
                      <text x="52" y="74.5" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#6A716C">{"Greener"}</text>
                      <rect x="44" y="101.0" width="1016" height="34.0" fill="#F3F1E6" />
                      <text x="52" y="117.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#6A716C">{"Usual"}</text>
                      <rect x="44" y="135.0" width="1016" height="51.0" fill="#F8EBDD" />
                      <text x="52" y="151.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#6A716C">{"Less green"}</text>
                      <path className="draw" pathLength="1" style={{"--d":"2"} as any} d={__v.strip.d} stroke="#141A16" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
                      {__v.strip.pts.map((p: any, i: number) => (
                        <g key={i}>
                          <circle cx={p.x} cy={p.y} r={i === __v.strip.pts.length - 1 ? 6 : 4} fill={i === __v.strip.pts.length - 1 ? "#D9762B" : "#141A16"} stroke="#F4F4F1" strokeWidth="2" />
                          <text x={p.x} y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">{p.lab}</text>
                        </g>
                      ))}
                    </svg>
                    <div className="seasons" role="img" aria-label="What grew around your field each season, seen from space">
                      {((__v?.seasons) || []).map((x: any, i: number) => (
                        <div className="sea" key={i}>
                          <b className={x.w[1]}>{x.w[0]}</b>
                          <b className={x.s[1]}>{x.s[0]}</b>
                          <span className="meta" style={{"fontSize":"11px"} as any}>{x.lab}</span>
                        </div>
                      ))}
                    </div>
                    <span className="meta">{__s(__v?.causeTxt)}</span>
                  </section>
                  ) : null}
                  {__v?.five ? (
                  <section className="grid rise" style={{"--d":"2","gridTemplateColumns":"minmax(0, 1fr) 380px","gap":"48px","alignItems":"center"} as any}>
                    <div className="chart">
                      <h2 className="sec">{__v.five.same ? "YOUR SOIL · NEXT 5 SEASONS" : "IF NOTHING CHANGES vs WITH BEZRA · NEXT 5 SEASONS"}</h2>
                      <svg viewBox="0 0 760 240" width="100%" role="img" aria-label={__s(__v?.fiveSay)}>
                        <line x1="40" x2="620" y1="40" y2="40" stroke="#E8E8E3" />
                        <line x1="40" x2="620" y1="120" y2="120" stroke="#E8E8E3" />
                        <line x1="40" x2="620" y1="200" y2="200" stroke="#E8E8E3" />
                        <path className="draw" pathLength="1" style={{"--d":"1"} as any} d={__v.five.cur} stroke="#B4660B" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
                        {__v.five.same ? null : <path className="draw" pathLength="1" style={{"--d":"2"} as any} d={__v.five.best} stroke="#3E7F35" strokeWidth="2.6" fill="none" strokeLinejoin="round" />}
                        {__v.five.same ? null : <text x="628" y={Number(__v.five.bestEnd.y) + 4} fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#3E7F35">{__v.five.bestEnd.t}</text>}
                        <text x="628" y={Number(__v.five.curEnd.y) + 4} fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#B4660B">{__v.five.curEnd.t}</text>
                        {__v.five.labs.map((l: string, i: number) => (
                          <text key={i} x={40 + i * 116} y="230" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">{l}</text>
                        ))}
                      </svg>
                      <span className="meta">{"How much of the harvest the soil allows, in % (100 = today)."}</span>
                    </div>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <b style={{"fontSize":"24px","fontWeight":"600","lineHeight":"1.3","letterSpacing":"-.4px"} as any}>{__s(__v?.fiveSay)}</b>
                      <Link href={__r("V19-Try") + ""} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600"} as any}>
                        {"See it in Try a season"}
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9.5 6 6 6-6 6" /></svg>
                      </Link>
                    </div>
                  </section>
                  ) : null}
                  {__v?.options?.length ? (
                  <section className="col hair rise" style={{"--d":"2","gap":"18px","paddingTop":"32px"} as any} aria-labelledby="nx-h">
                    <div className="row sp">
                      <h2 id="nx-h" className="sec">{"WHAT TO PLANT NEXT WINTER · " + __s(__v?.nextYear)}</h2>
                      <Link href={__r("V19-Try") + ""} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600"} as any}>
                        {"Compare them in Try a season"}
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9.5 6 6 6-6 6" /></svg>
                      </Link>
                    </div>
                    <div className="col" style={{"gap":"8px","margin":"4px 0 12px"} as any}>
                      <span className="meta" style={{"fontWeight":"600"} as any}>{"What matters most to you?"}</span>
                      <div className="row" role="radiogroup" style={{"gap":"8px","flexWrap":"wrap"} as any}>
                        {[["soil", "Stronger soil"], ["water", "Less water"], ["money", "More harvest"], ["fodder", "Fodder"]].map(([k, t]) => (
                          <button key={k} type="button" role="radio" aria-checked={__v?.prio === k} className={"btn press" + (__v?.prio === k ? "" : " soft")} style={{"height":"40px","borderRadius":"20px","padding":"0 16px","fontSize":"14px"} as any} onClick={() => __v?.setPrio?.(k)}>{t}</button>
                        ))}
                      </div>
                      {__v?.moneyNote ? <span className="meta">{__v.moneyNote}</span> : null}
                    </div>
                    <div className="opt3">
                      {__v.options.map((o: any, i: number) => (
                        <article key={i} className={"ocard" + (i === 0 ? " best" : "")}>
                          <span className={"rank " + o.cls}>{o.rank}</span>
                          <b style={{"fontSize":"24px","fontWeight":"600","letterSpacing":"-.4px"} as any}>{o.name}</b>
                          <span className="txt" style={{"fontSize":"16px"} as any}>{o.line}</span>
                          <ul>
                            {o.bullets.map((t: string, j: number) => (
                              <li key={j}>
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                                <span>{t}</span>
                              </li>
                            ))}
                            {o.warn ? <li><span className="meta">{o.warn}</span></li> : null}
                          </ul>
                          <details className="why">
                            <summary className="meta" style={{"cursor":"pointer","fontWeight":"600"} as any}>{"Why this?"}</summary>
                            <dl className="col" style={{"gap":"8px","marginTop":"8px","fontSize":"14px"} as any}>
                              {o.why ? <><dt className="meta">{"Why"}</dt><dd>{o.why}</dd></> : null}
                              <dt className="meta">{"Evidence"}</dt>
                              <dd>{o.evidence?.length ? o.evidence.map((ev: any, k: number) => (
                                <a key={k} href={ev.url} target="_blank" rel="noopener noreferrer" style={{"display":"block","textDecoration":"underline"} as any}>{ev.label}</a>
                              )) : "No outside study yet: this is your field compared with itself."}</dd>
                              {o.gaps ? <><dt className="meta">{"What we don't know"}</dt><dd>{o.gaps}</dd></> : null}
                              <dd className="meta">{"Risks to check with your engineer"}</dd>
                            </dl>
                          </details>
                          {__v?.next?.crop === o.crop ? (
                            <span className="doneline" style={{"marginTop":"auto"} as any}>
                              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                              {"In your plan"}
                            </span>
                          ) : (
                            <button type="button" className={"btn press" + (i === 0 ? " sun" : " soft")} onClick={() => __v?.pick?.(o)} style={{"alignSelf":"flex-start","marginTop":"auto"} as any}>
                              {i === 2 ? "Keep " + o.name.toLowerCase() : "Plan it for next winter"}
                            </button>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                  ) : null}
                  {__v?.problems?.length ? (
                  <section className="col hair rise" style={{"--d":"3","paddingTop":"32px"} as any} aria-labelledby="ag-h">
                    <h2 id="ag-h" className="sec" style={{"paddingBottom":"8px"} as any}>{"PROBLEMS THAT KEEP COMING BACK"}</h2>
                    {__v.problems.map((p: any, i: number) => (
                      <article className="again" key={i}>
                        <span className="rki" style={{"background":"#FFF4E3","color":"#9A5608"} as any}>
                          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" /></svg>
                        </span>
                        <span className="col" style={{"gap":"4px"} as any}>
                          <b style={{"fontSize":"18px","fontWeight":"600"} as any}>{p.t}</b>
                          <span className="txt">{p.why}</span>
                        </span>
                        <b style={{"fontSize":"15px","fontWeight":"600"} as any}>{p.n}</b>
                        <span className="col" style={{"gap":"2px"} as any}>
                          <span className="meta">{"How to fix it"}</span>
                          <span style={{"fontSize":"15px","fontWeight":"500"} as any}>{p.fix}</span>
                        </span>
                      </article>
                    ))}
                  </section>
                  ) : null}
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"36px"} as any}>
                  <div className="pagehead rise" style={{"--d":"0"} as any}>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <span className="meta" style={{"fontSize":"15px"} as any}>{__s(__v?.field)}{" · soil from SoilGrids, history from MODIS, 10-year runs on NASA POWER"}</span>
                      <h1 className="h1x" style={{"fontSize":"40px"} as any}>{__v?.texture ? __v.texture + ", organic carbon " + (__v?.soc?.value ?? "—") + " t/ha in the top 30 cm" : "Your soil"}</h1>
                      <p className="txt">{__s(__v?.trendTxt)}</p>
                    </div>
                  </div>
                  {__v?.ready ? (
                  <section className="grid rise" style={{"--d":"1","gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"48px"} as any}>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <h2 className="sec">{"THE SOIL TODAY · 0–30 CM"}</h2>
                      <table className="tbl">
                        <thead><tr><th>{"What"}</th><th>{"Value"}</th><th>{"Likely range"}</th></tr></thead>
                        <tbody>
                          {((__v?.props) || []).map((p: any, i: number) => (<tr key={i}><td>{p.l}</td><td><b>{p.v}</b></td><td className="meta">{p.r}</td></tr>))}
                          {__v?.ece ? <tr><td>{"Salinity (ECe)"}</td><td><b>{__v.ece.value + " " + __v.ece.unit}</b></td><td className="meta">{(__v.ece.range || []).join("–")}</td></tr> : null}
                        </tbody>
                      </table>
                      <span className="pq sat">{__s(__v?.soilSrc)}</span>
                      <span className="meta">{"A lab soil test replaces these map values everywhere. Add one from your profile."}</span>
                    </div>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <h2 className="sec">{"ROTATIONS · 10 YEARS ON YOUR WEATHER"}</h2>
                      <table className="tbl">
                        <thead><tr><th>{"Rotation"}</th><th>{"Soil, year 10"}</th><th>{"Water m³/feddan/yr"}</th><th>{"Heat years"}</th></tr></thead>
                        <tbody>
                          {((__v?.strategies) || []).map((s: any, i: number) => (
                            <tr key={i}>
                              <td><b>{s.name}</b>{s.cur ? " · now" : ""}{s.pick ? " · best" : ""}<br /><span className="meta">{s.seq}</span></td>
                              <td>{s.soil + (s.vs ? " (" + (s.vs > 0 ? "+" : "") + s.vs + "%)" : "")}</td>
                              <td>{s.water}</td>
                              <td>{s.heat}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <span className="pq sat">{__s(__v?.method)}</span>
                      {__v?.warming ? <span className="pq sat">{"2040 warming: " + __v.warming}</span> : null}
                    </div>
                  </section>
                  ) : <div className="sk" style={{"height":"320px","borderRadius":"16px"} as any} aria-busy="true" />}
                  {__v?.strip ? (
                  <section className="col hair rise" style={{"--d":"2","gap":"12px","paddingTop":"28px"} as any}>
                    <h2 className="sec">{"PEAK WINTER GREENNESS AROUND YOUR FIELD (NDVI)"}</h2>
                    <table className="tbl">
                      <thead><tr><th>{"Season"}</th>{__v.strip.pts.map((p: any, i: number) => <th key={i}>{p.lab}</th>)}</tr></thead>
                      <tbody><tr><td>{"NDVI"}</td>{__v.strip.pts.map((p: any, i: number) => <td key={i}>{p.v != null ? p.v.toFixed(2) : "—"}</td>)}</tr></tbody>
                    </table>
                    <span className="pq sat">{__s(__v?.histSrc)}</span>
                    <span className="meta">{__s(__v?.causeTxt)}</span>
                  </section>
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
              <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="sd-h">
                <h3 id="sd-h" style={{"fontSize":"22px","fontWeight":"600"} as any}>
                  {"Plan "}
                  {__s(__v?.askName)}
                  {" for next winter?"}
                </h3>
                <p className="txt">
                  {"Bezra will build next winter's plan around it, starting next October. Nothing changes this season. You can change it any time."}
                </p>
                <div className="row" style={{"gap":"10px","justifyContent":"flex-end","marginTop":"6px"} as any}>
                  <button type="button" className="btn soft press" onClick={__v?.cancel}>
                    {"Not now"}
                  </button>
                  <button type="button" className="btn press" onClick={__v?.confirm}>
                    {"Yes, plan it"}
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
      <Tour page="Soil" />
    </>
  );
}
