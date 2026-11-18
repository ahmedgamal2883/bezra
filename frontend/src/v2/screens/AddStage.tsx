'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V23-Add-Stage.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./AddStage.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './AddStage.logic';

export default function AddStageScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const __v = useDC(Logic, props);
  return (
    <>
      <div className="v2 root">
        <div className="shell">
          <header className="top">
            <Link href={__r("V20-Landing") + ""} className="brand">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <div className="row" style={{"gap":"12px"} as any}>
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
            <Link href={__r("V20-Landing") + ""} className="btn soft sm press">
              {"Cancel"}
            </Link>
          </header>
          <main className="main" style={{"gap":"24px","paddingTop":"24px"} as any}>
            <div className="wizard col" style={{"gap":"26px","paddingTop":"24px"} as any}>
              <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                {"What is growing there now?"}
              </h1>
              <div className="row chipset" style={{"gap":"8px","flexWrap":"wrap"} as any}>
                <button type="button" className={__s(__v?.cropW) as any} onClick={__v?.pickW} style={{"height":"48px"} as any}>
                  {"Wheat"}
                </button>
                <button type="button" className={__s(__v?.cropC) as any} onClick={__v?.pickC} style={{"height":"48px"} as any}>
                  {"Clover"}
                </button>
                <button type="button" className={__s(__v?.cropF) as any} onClick={__v?.pickF} style={{"height":"48px"} as any}>
                  {"Faba beans"}
                </button>
                <button type="button" className={__s(__v?.cropO) as any} onClick={__v?.pickO} style={{"height":"48px"} as any}>
                  {"Something else"}
                </button>
              </div>
              <div className="col hair" style={{"gap":"14px","paddingTop":"22px"} as any}>
                <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                  {"Where is it in its season?"}
                </b>
                <p className="meta" style={{"marginTop":"-6px"} as any}>
                  {"You can start with Bezra at any point. It reads the days you missed from space."}
                </p>
                <div className="jn-stage" role="group" aria-label="Where is the crop in its season">
                  <button type="button" className={__s(__v?.cNot) as any} onClick={__v?.pNot} aria-pressed={__s(__v?.aNot) as any}>
                    <i>
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />
                      </svg>
                    </i>
                    <span className="col" style={{"gap":"4px"} as any}>
                      <b>
                        {"Not sown yet"}
                      </b>
                      <span>
                        {"Bezra plans the whole season, starting with the best week to sow."}
                      </span>
                    </span>
                  </button>
                  <button type="button" className={__s(__v?.cMid) as any} onClick={__v?.pMid} aria-pressed={__s(__v?.aMid) as any}>
                    <i>
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                      </svg>
                    </i>
                    <span className="col" style={{"gap":"4px"} as any}>
                      <b>
                        {"Growing now"}
                      </b>
                      <span>
                        {"Bezra fills in the weeks so far, then plans the rest."}
                      </span>
                    </span>
                  </button>
                  <button type="button" className={__s(__v?.cLate) as any} onClick={__v?.pLate} aria-pressed={__s(__v?.aLate) as any}>
                    <i>
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
                      </svg>
                    </i>
                    <span className="col" style={{"gap":"4px"} as any}>
                      <b>
                        {"Close to harvest"}
                      </b>
                      <span>
                        {"Bezra helps you protect what is left, and plans next winter."}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
              {__v?.isMid ? (
                <>
                  <div className="col" style={{"gap":"12px"} as any}>
                    <div className="jn-saw">
                      <svg aria-hidden="true" width="36" height="36" viewBox="0 0 60 60">
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
                      <span className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                          {__s(__v?.greenTxt)}
                        </b>
                        <span style={{"fontSize":"14px","color":"var(--ink2)"} as any}>
                          {__s(__v?.sowTxt)}
                          <span className="jn-src">
                            {"NASA MODIS, 250 m"}
                          </span>
                        </span>
                      </span>
                    </div>
                    {__v?.dateOk ? (
                      <>
                        <div className="row" style={{"gap":"8px","flexWrap":"wrap"} as any}>
                          <span className="dpill" style={{"height":"34px","padding":"0 14px","background":"var(--dark)","color":"#fff"} as any}>
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m5 12.5 4.5 4.5L19 7.5" />
                            </svg>
                            {" Yes, about then"}
                          </span>
                          <button type="button" className="btn soft sm press" onClick={__v?.editDate}>
                            {"No, change the date"}
                          </button>
                        </div>
                      </>
                    ) : null}
                    {__v?.dateEdit ? (
                      <>
                        <label className="col" style={{"gap":"8px","maxWidth":"320px"} as any}>
                          <span className="meta">
                            {"When did you sow?"}
                          </span>
                          <span className="row" style={{"gap":"10px","height":"52px","padding":"0 16px","borderRadius":"16px","background":"#fff"} as any}>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                            </svg>
                            <input type="date" value={__s(__v?.date)} max={__s(__v?.maxDate)} onChange={__v?.setDate} aria-label="Sowing day" style={{"border":"0","outline":"none","font":"inherit","fontSize":"16px","flex":"1","background":"transparent"} as any} />
                          </span>
                        </label>
                        <button type="button" className="btn soft sm press" onClick={__v?.okDate} style={{"alignSelf":"flex-start"} as any}>
                          {"Use this date"}
                        </button>
                      </>
                    ) : null}
                  </div>
                </>
              ) : null}
              {__v?.isLate ? (
                <>
                  <div className="jn-saw">
                    <svg aria-hidden="true" width="36" height="36" viewBox="0 0 60 60">
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
                    <span className="col" style={{"gap":"4px"} as any}>
                      <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                        {__s(__v?.greenTxt)}
                      </b>
                      <span style={{"fontSize":"14px","color":"var(--ink2)"} as any}>
                        {__s(__v?.sowTxt)}
                        <span className="jn-src">
                          {"NASA MODIS, 250 m"}
                        </span>
                      </span>
                    </span>
                  </div>
                </>
              ) : null}
              {__v?.isNot ? (
                <>
                  <span className="meta">
                    {"Good. Bezra will suggest the best week to sow."}
                  </span>
                </>
              ) : null}
              <p className="meta">
                {"Soil, water, heat and rust risk come from NASA satellites. You only tell Bezra what space can't see."}
              </p>
                {__v?.hasErr ? <div className="warnbox" role="alert"><span>{__s(__v?.err)}</span></div> : null}
              <div className="row" style={{"gap":"10px"} as any}>
                <Link href="#" onClick={__v?.back} className="btn soft press">
                  {"Back"}
                </Link>
                <a href="#" onClick={__v?.save} aria-disabled={!!__v?.busy} className="btn cta press" style={{"height":"54px","fontSize":"15px","padding":"0 6px 0 22px"} as any}>
                  {__s(__v?.saveLabel)}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
