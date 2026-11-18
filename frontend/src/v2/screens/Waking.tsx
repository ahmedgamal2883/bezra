'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V24-Waking.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Waking.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Waking.logic';

export default function WakingScreen(props: Record<string, unknown> = {}) {
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
            <span />
          </header>
          <main className="main">
            <div className="wk-wrap">
              <div className="row" style={{"gap":"14px","alignItems":"center"} as any}>
                <svg aria-hidden="true" width="56" height="56" viewBox="0 0 60 60">
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
                    <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                    <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                    <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                  </g>
                </svg>
                <span className="col" style={{"gap":"2px"} as any}>
                  <span className="meta">
                    {"North plot · Shibin El Kom"}
                  </span>
                  <h1 className="h1x" style={{"fontSize":"36px"} as any}>
                    {"Getting your field ready."}
                  </h1>
                </span>
              </div>
              <section className="col" style={{"gap":"14px"} as any} aria-live="polite">
                <div className="wk-eta">
                  <b>
                    {__s(__v?.eta)}
                  </b>
                </div>
                <p className="txt" style={{"fontSize":"16px","marginTop":"-6px"} as any}>
                  {__s(__v?.etaSub)}
                </p>
                <div className="wk-bar" role="progressbar" aria-label="Loading your field">
                  <i style={__css(__v?.pct)} />
                </div>
                {__v?.isSlow ? (
                  <>
                    <div className="wk-slow">
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                      </svg>
                      <span>
                        {"The free server is slow to wake today. Nothing is wrong with your field."}
                      </span>
                    </div>
                  </>
                ) : null}
                <div className="wk-steps">
                  <div className={__s(__v?.sServer) as any}>
                    <i>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </i>
                    <span>
                      <b>
                        {"Server"}
                      </b>
                      {"Waking up"}
                    </span>
                  </div>
                  <div className={__s(__v?.sMap) as any}>
                    <i>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </i>
                    <span>
                      <b>
                        {"Map and squares"}
                      </b>
                      {"Comes first"}
                    </span>
                  </div>
                  <div className={__s(__v?.sRest) as any}>
                    <i>
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </i>
                    <span>
                      <b>
                        {"Water, risks, plan"}
                      </b>
                      {"Fills in after"}
                    </span>
                  </div>
                </div>
              </section>
              <section className="col" style={{"gap":"12px"} as any} aria-labelledby="wk-h">
                <h2 id="wk-h" className="sec">
                  {"How do you want to start?"}
                </h2>
                <div className="wk-opts">
                  {__v?.nowReady ? (
                    <>
                      <Link href={__r("V24-Today-Loading") + ""} className="wk-opt press on">
                        <b>
                          {"Open my field now"}
                        </b>
                        <span>
                          {"Your map and the squares are ready. Water, risks and your plan fill in while you look."}
                        </span>
                        <span className="go">
                          {"Open the map →"}
                        </span>
                      </Link>
                    </>
                  ) : null}
                  {__v?.nowNotReady ? (
                    <>
                      <button type="button" className={__s(__v?.oNow) as any} onClick={__v?.pickNow}>
                        <b>
                          {"Open my field now"}
                        </b>
                        <span>
                          {"See your map and the squares first. Water, risks and your plan fill in while you look."}
                        </span>
                        <span className="go wait">
                          {__s(__v?.mapEta)}
                        </span>
                      </button>
                    </>
                  ) : null}
                  <button type="button" className={__s(__v?.oWait) as any} onClick={__v?.pickWait}>
                    <b>
                      {"Wait here"}
                    </b>
                    <span>
                      {"Everything opens at once, "}
                      {__s(__v?.etaLow)}
                      {". You can leave this tab open."}
                    </span>
                    <span className="go wait">
                      {__s(__v?.waitTxt)}
                    </span>
                  </button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
