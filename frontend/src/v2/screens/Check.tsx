'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Check.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Check.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Check.logic';
import { useCheckData } from '@/v2/data/check';

export default function CheckScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const ck = useCheckData();
  const __v = useDC(Logic, { ...props, d: ck });
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
                <div className="wizard col" style={{"gap":"24px"} as any}>
                  <div className="col" style={{"gap":"10px","paddingTop":"24px"} as any}>
                    <Link href={__r("V18-Crop") + ""} className="row meta" style={{"gap":"6px","fontSize":"14px"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14.5 6-6 6 6 6" />
                      </svg>
                      {"Crop"}
                    </Link>
                    {__v?.notRes ? (
                      <>
                        <div className="row" style={{"gap":"10px"} as any}>
                          <div className="steps" aria-hidden="true">
                            {((__v?.bars) || []).map((b: any, i0: number) => (
                              <Fragment key={i0}>
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
                  </div>
                  {__v?.s1 ? (
                    <>
                      <h1 className="h1x" style={{"fontSize":"38px"} as any}>
                        {"What do you see?"}
                      </h1>
                      <p className="txt" style={{"fontSize":"17px"} as any}>
                        {"Pick the picture that looks closest."}
                      </p>
                      <div className="pgrid" role="group" aria-label="What you see">
                        {((__v?.opts) || []).map((o: any, i1: number) => (
                          <Fragment key={i1}>
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
                              <span style={{"fontSize":"15px"} as any}>
                                {__s(o?.label)}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {__v?.s2 ? (
                    <>
                      <h1 className="h1x" style={{"fontSize":"38px"} as any}>
                        {"Where in your field?"}
                      </h1>
                      <p className="txt" style={{"fontSize":"17px"} as any}>
                        {"Tap the squares, as they are on your map."}
                      </p>
                      <div className="mini" role="group" aria-label="Squares" style={{"transform":"rotate(-6deg) scale(1.25)","margin":"40px auto"} as any}>
                        {((__v?.mini) || []).map((m: any, i2: number) => (
                          <Fragment key={i2}>
                            <button type="button" style={__css(m?.st)} aria-pressed={__s(m?.pressed) as any} onClick={m?.pick}>
                              {__s(m?.label)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {__v?.s3 ? (
                    <>
                      <h1 className="h1x" style={{"fontSize":"38px"} as any}>
                        {"Add a photo "}
                        <span className="meta" style={{"fontSize":"18px","fontWeight":"500"} as any}>
                          {"· so Bezra and your engineer can see it"}
                        </span>
                      </h1>
                      <button type="button" className="drop press" onClick={__v?.choosePhoto} style={{"height":"240px","backgroundImage": __v?.photo ? `url(${__v.photo})` : undefined,"backgroundSize":"cover","backgroundPosition":"center"} as any}>
                        <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        </svg>
                        <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                          {__s(__v?.photoTxt)}
                        </b>
                        <span className="meta">
                          {"One leaf, close up, in daylight"}
                        </span>
                      </button>
                    </>
                  ) : null}
                  {__v?.res ? (
                    <>
                      <div className="col" style={{"gap":"18px"} as any}>
                        <span className="meta" style={{"fontSize":"15px"} as any}>{__s(__v?.resTitle)}</span>
                        <h1 className="h1x" style={{"fontSize":"38px"} as any}>{"Most likely: " + __s(__v?.top) + "."}</h1>
                        <span className="pq sat">{__s(__v?.topPct)}{" · Check it on the plants before you act."}</span>
                        {__v?.why ? (<div className="col" style={{"gap":"8px"} as any}><span className="sec">{"WHY WE THINK SO"}</span><p className="txt">{__s(__v?.why)}</p></div>) : null}
                        {__v?.hasOthers ? <p className="meta">{"Less likely: " + __s(__v?.others) + "."}</p> : null}
                        {((__v?.ladder) || []).length ? (
                          <div className="col" style={{"gap":"10px"} as any}>
                            <span className="sec">{"WHAT TO DO"}</span>
                            {__v.ladder.map((x: any, ix: number) => (
                              <div className="row" key={ix} style={{"gap":"12px","alignItems":"flex-start"} as any}>
                                <span className="num" style={{"minWidth":"28px","height":"28px","borderRadius":"14px","background":"var(--green-tint)","color":"var(--green)","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"600"} as any}>{ix + 1}</span>
                                <span className="col" style={{"gap":"2px"} as any}><b style={{"fontWeight":"600"} as any}>{x.t}</b><span className="txt">{x.s}</span></span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        <p className="meta">{"Bezra never suggests a spray or a dose. Your engineer or the product label does."}</p>
                        <div className="row" style={{"gap":"10px","flexWrap":"wrap"} as any}>
                          {__v?.notSaved ? <button type="button" className="btn press" onClick={__v?.save} style={{"height":"52px"} as any}>{"Save to journal"}</button> : <span className="doneline">{"Saved to your journal"}</span>}
                          {__v?.notSent ? <button type="button" className="btn soft press" onClick={__v?.send} style={{"height":"52px"} as any}>{"Send to my engineer"}</button> : <span className="doneline">{"Your engineer can see this check"}</span>}
                          <button type="button" className="btn soft press" onClick={__v?.restart} style={{"height":"52px"} as any}>{"Check something else"}</button>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {__v?.uns ? (
                    <>
                      <div className="col" style={{"gap":"22px","paddingTop":"8px"} as any}>
                        <svg aria-hidden="true" width="64" height="64" viewBox="0 0 60 60">
                          <g className="sway">
                            <path d="M30 14C24 9 15 11 12 15c5 4 12 3 18-1z" fill="#5E9A45" />
                            <path d="M30 14c5-6 14-6 18-2-4 5-12 6-18 2z" fill="#3E7F35" />
                            <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
                            <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
                            <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <g className="blink" style={{"transformOrigin":"30px 31px"} as any}>
                              <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
                              <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
                            </g>
                            <path d="M22 27l4-1.5M38 27l-4-1.5" stroke="#3A2A10" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M25 39q5-4 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                            <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          </g>
                        </svg>
                        <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                          {"We are not sure what this is."}
                        </h1>
                        <p style={{"fontSize":"18px","lineHeight":"1.6","color":"var(--ink2)","maxWidth":"640px"} as any}>
                          {"The satellite and the weather do not point to one cause. A person needs to see it. Send it to your engineer with a photo."}
                        </p>
                        <div className="row" style={{"gap":"10px"} as any}>
                          {__v?.notSent ? (
                            <>
                              <button type="button" className="btn press" onClick={__v?.send} style={{"height":"52px"} as any}>
                                {"Send to my engineer"}
                              </button>
                            </>
                          ) : null}
                          {__v?.sent ? (
                            <>
                              <span className="doneline">
                                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                                </svg>
                                {"Sent. " + __s(__v?.engineer) + " can see it with your photo."}
                              </span>
                            </>
                          ) : null}
                          <button type="button" className="btn soft press" onClick={__v?.restart} style={{"height":"52px"} as any}>
                            {"Start again"}
                          </button>
                        </div>
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
                  {__v?.notRes ? (
                    <>
                      <div className="row sp hair" style={{"paddingTop":"20px"} as any}>
                        {__v?.hasBack ? (
                          <>
                            <button type="button" className="btn soft press" onClick={__v?.back}>
                              {"Back"}
                            </button>
                          </>
                        ) : null}
                        <span />
                        <button type="button" className="btn press" onClick={__v?.go} style={{"height":"52px","minWidth":"160px","fontSize":"15px"} as any}>
                          {__s(__v?.nextLabel)}
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="wizard col" style={{"gap":"24px"} as any}>
                  <div className="col" style={{"gap":"10px","paddingTop":"24px"} as any}>
                    <Link href={__r("V18-Crop") + ""} className="row meta" style={{"gap":"6px","fontSize":"14px"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m14.5 6-6 6 6 6" />
                      </svg>
                      {"Crop"}
                    </Link>
                    {__v?.notRes ? (
                      <>
                        <div className="row" style={{"gap":"10px"} as any}>
                          <div className="steps" aria-hidden="true">
                            {((__v?.bars) || []).map((b: any, i3: number) => (
                              <Fragment key={i3}>
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
                  </div>
                  {__v?.s1 ? (
                    <>
                      <h1 className="h1x" style={{"fontSize":"38px"} as any}>
                        {"What do you see?"}
                      </h1>
                      <p className="txt" style={{"fontSize":"17px"} as any}>
                        {"Pick the picture that looks closest."}
                      </p>
                      <div className="pgrid" role="group" aria-label="What you see">
                        {((__v?.opts) || []).map((o: any, i4: number) => (
                          <Fragment key={i4}>
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
                              <span style={{"fontSize":"15px"} as any}>
                                {__s(o?.label)}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {__v?.s2 ? (
                    <>
                      <h1 className="h1x" style={{"fontSize":"38px"} as any}>
                        {"Where in your field?"}
                      </h1>
                      <p className="txt" style={{"fontSize":"17px"} as any}>
                        {"Tap the squares, as they are on your map."}
                      </p>
                      <div className="mini" role="group" aria-label="Squares" style={{"transform":"rotate(-6deg) scale(1.25)","margin":"40px auto"} as any}>
                        {((__v?.mini) || []).map((m: any, i5: number) => (
                          <Fragment key={i5}>
                            <button type="button" style={__css(m?.st)} aria-pressed={__s(m?.pressed) as any} onClick={m?.pick}>
                              {__s(m?.label)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {__v?.s3 ? (
                    <>
                      <h1 className="h1x" style={{"fontSize":"38px"} as any}>
                        {"Add a photo "}
                        <span className="meta" style={{"fontSize":"18px","fontWeight":"500"} as any}>
                          {"· so Bezra and your engineer can see it"}
                        </span>
                      </h1>
                      <button type="button" className="drop press" onClick={__v?.choosePhoto} style={{"height":"240px","backgroundImage": __v?.photo ? `url(${__v.photo})` : undefined,"backgroundSize":"cover","backgroundPosition":"center"} as any}>
                        <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                        </svg>
                        <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                          {__s(__v?.photoTxt)}
                        </b>
                        <span className="meta">
                          {"One leaf, close up, in daylight"}
                        </span>
                      </button>
                    </>
                  ) : null}
                  {__v?.res ? (
                    <>
                      <div className="col" style={{"gap":"18px"} as any}>
                        <span className="meta" style={{"fontSize":"15px"} as any}>{__s(__v?.resTitle)}</span>
                        <h1 className="h1x" style={{"fontSize":"38px"} as any}>{"Most likely: " + __s(__v?.top) + "."}</h1>
                        <span className="pq sat">{__s(__v?.topPct)}{" · Check it on the plants before you act."}</span>
                        {__v?.why ? (<div className="col" style={{"gap":"8px"} as any}><span className="sec">{"WHY WE THINK SO"}</span><p className="txt">{__s(__v?.why)}</p></div>) : null}
                        {__v?.hasOthers ? <p className="meta">{"Less likely: " + __s(__v?.others) + "."}</p> : null}
                        {((__v?.ladder) || []).length ? (
                          <div className="col" style={{"gap":"10px"} as any}>
                            <span className="sec">{"WHAT TO DO"}</span>
                            {__v.ladder.map((x: any, ix: number) => (
                              <div className="row" key={ix} style={{"gap":"12px","alignItems":"flex-start"} as any}>
                                <span className="num" style={{"minWidth":"28px","height":"28px","borderRadius":"14px","background":"var(--green-tint)","color":"var(--green)","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"600"} as any}>{ix + 1}</span>
                                <span className="col" style={{"gap":"2px"} as any}><b style={{"fontWeight":"600"} as any}>{x.t}</b><span className="txt">{x.s}</span></span>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        <p className="meta">{"Bezra never suggests a spray or a dose. Your engineer or the product label does."}</p>
                        <div className="row" style={{"gap":"10px","flexWrap":"wrap"} as any}>
                          {__v?.notSaved ? <button type="button" className="btn press" onClick={__v?.save} style={{"height":"52px"} as any}>{"Save to journal"}</button> : <span className="doneline">{"Saved to your journal"}</span>}
                          {__v?.notSent ? <button type="button" className="btn soft press" onClick={__v?.send} style={{"height":"52px"} as any}>{"Send to my engineer"}</button> : <span className="doneline">{"Your engineer can see this check"}</span>}
                          <button type="button" className="btn soft press" onClick={__v?.restart} style={{"height":"52px"} as any}>{"Check something else"}</button>
                        </div>
                      </div>
                    </>
                  ) : null}
                  {__v?.uns ? (
                    <>
                      <div className="col" style={{"gap":"22px","paddingTop":"8px"} as any}>
                        <svg aria-hidden="true" width="64" height="64" viewBox="0 0 60 60">
                          <g className="sway">
                            <path d="M30 14C24 9 15 11 12 15c5 4 12 3 18-1z" fill="#5E9A45" />
                            <path d="M30 14c5-6 14-6 18-2-4 5-12 6-18 2z" fill="#3E7F35" />
                            <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
                            <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
                            <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
                            <g className="blink" style={{"transformOrigin":"30px 31px"} as any}>
                              <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
                              <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
                            </g>
                            <path d="M22 27l4-1.5M38 27l-4-1.5" stroke="#3A2A10" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M25 39q5-4 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                            <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          </g>
                        </svg>
                        <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                          {"We are not sure what this is."}
                        </h1>
                        <p style={{"fontSize":"18px","lineHeight":"1.6","color":"var(--ink2)","maxWidth":"640px"} as any}>
                          {"The satellite and the weather do not point to one cause. A person needs to see it. Send it to your engineer with a photo."}
                        </p>
                        <div className="row" style={{"gap":"10px"} as any}>
                          {__v?.notSent ? (
                            <>
                              <button type="button" className="btn press" onClick={__v?.send} style={{"height":"52px"} as any}>
                                {"Send to my engineer"}
                              </button>
                            </>
                          ) : null}
                          {__v?.sent ? (
                            <>
                              <span className="doneline">
                                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                                </svg>
                                {"Sent. " + __s(__v?.engineer) + " can see it with your photo."}
                              </span>
                            </>
                          ) : null}
                          <button type="button" className="btn soft press" onClick={__v?.restart} style={{"height":"52px"} as any}>
                            {"Start again"}
                          </button>
                        </div>
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
                  {__v?.notRes ? (
                    <>
                      <div className="row sp hair" style={{"paddingTop":"20px"} as any}>
                        {__v?.hasBack ? (
                          <>
                            <button type="button" className="btn soft press" onClick={__v?.back}>
                              {"Back"}
                            </button>
                          </>
                        ) : null}
                        <span />
                        <button type="button" className="btn press" onClick={__v?.go} style={{"height":"52px","minWidth":"160px","fontSize":"15px"} as any}>
                          {__s(__v?.nextLabel)}
                        </button>
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
