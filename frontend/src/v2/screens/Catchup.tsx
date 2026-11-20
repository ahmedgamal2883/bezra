'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V23-Catchup.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Catchup.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Catchup.logic';
import { useCatchup } from '@/v2/data/catchup';

export default function CatchupScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const cu = useCatchup();
  const __v = { ...cu, ...useDC(Logic, { ...props, d: cu }) };
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
            <div className="col rise" style={{"gap":"10px","--d":"0"} as any}>
              <span className="meta">
                {__s(__v?.head)}
              </span>
              <h1 className="h1x" style={{"fontSize":"44px","maxWidth":"760px"} as any}>
                {__s(__v?.title)}
              </h1>
              <p className="txt" style={{"fontSize":"17px","maxWidth":"680px"} as any}>
                {"Check what we found and fix anything that is wrong. Then Bezra plans the rest of your season from today."}
              </p>
            </div>
            <div className="jn-wrap">
              <div className="col" style={{"gap":"36px"} as any}>
                <section className="col rise" style={{"--d":"1"} as any} aria-labelledby="sw-h">
                  <div className="row sp" style={{"paddingBottom":"6px"} as any}>
                    <h2 id="sw-h" className="sec">
                      {"What NASA saw before you joined"}
                    </h2>
                    <span className="meta">
                      {__s(__v?.checked)}
                    </span>
                  </div>
                  {((__v?.evs) || []).map((e: any, i0: number) => (
                    <Fragment key={i0}>
                      <div className="jn-ev">
                        <span className="d">
                          {__s(e?.d)}
                        </span>
                        <span className="col" style={{"gap":"4px"} as any}>
                          <span className="t">
                            {__s(e?.t)}
                          </span>
                          <span className="s">
                            {__s(e?.s)}
                          </span>
                          <span className="jn-src">
                            {__s(e?.src)}
                          </span>
                          {e?.isNo ? (
                            <>
                              <span className="jn-note" style={{"marginTop":"6px"} as any}>
                                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
                                </svg>
                                <span>
                                  {"Thanks. Bezra will ask for the right day in your journal, and plan without it until then."}
                                </span>
                              </span>
                            </>
                          ) : null}
                        </span>
                        {e?.ask ? (
                          <>
                            <span className="jn-yn" role="group" aria-label="Is this right?">
                              <button type="button" className={__s(e?.yes) as any} onClick={e?.pYes}>
                                {"Right"}
                              </button>
                              <button type="button" className={__s(e?.no) as any} onClick={e?.pNo}>
                                {"Wrong"}
                              </button>
                              <button type="button" className={__s(e?.dk) as any} onClick={e?.pDk}>
                                {"Not sure"}
                              </button>
                            </span>
                          </>
                        ) : null}
                        {e?.info ? (
                          <>
                            <span className="meta" style={{"fontSize":"12px"} as any}>
                              {"Nothing to check"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </Fragment>
                  ))}
                </section>
                <section className="col" style={{"gap":"14px"} as any} aria-labelledby="fq-h">
                  <div className="col" style={{"gap":"4px"} as any}>
                    <h2 id="fq-h" className="sec">
                      {"Only you know this"}
                    </h2>
                    <b style={{"fontSize":"18px","fontWeight":"600","color":"var(--ink)"} as any}>
                      {"Did you add any fertiliser yet?"}
                    </b>
                    <span className="meta">
                      {"Satellites can't see fertiliser. If you don't remember, that's fine."}
                    </span>
                  </div>
                  <div className="row chipset" style={{"gap":"8px","flexWrap":"wrap"} as any}>
                    <button type="button" className={__s(__v?.fNone) as any} onClick={__v?.pfNone} style={{"height":"46px"} as any}>
                      {"None yet"}
                    </button>
                    <button type="button" className={__s(__v?.fUrea) as any} onClick={__v?.pfUrea} style={{"height":"46px"} as any}>
                      {"Urea"}
                    </button>
                    <button type="button" className={__s(__v?.fBoth) as any} onClick={__v?.pfBoth} style={{"height":"46px"} as any}>
                      {"Urea and superphosphate"}
                    </button>
                    <button type="button" className={__s(__v?.fDk) as any} onClick={__v?.pfDk} style={{"height":"46px"} as any}>
                      {"I don't remember"}
                    </button>
                  </div>
                  {__v?.showAmt ? (
                    <>
                      <label className="col" style={{"gap":"8px","maxWidth":"320px"} as any}>
                        <span className="meta">
                          {"Urea, about how much per feddan?"}
                        </span>
                        <span className="row" style={{"gap":"10px","height":"52px","padding":"0 16px","borderRadius":"16px","background":"#fff"} as any}>
                          <input type="text" inputMode="decimal" placeholder="kg per feddan" value={__s(__v?.kg)} onChange={__v?.setKg} style={{"border":"0","outline":"none","font":"inherit","fontSize":"16px","flex":"1","minWidth":"0","background":"transparent"} as any} aria-label="Amount" />
                          <span className="meta" style={{"whiteSpace":"nowrap"} as any}>
                            {"per feddan"}
                          </span>
                        </span>
                      </label>
                    </>
                  ) : null}
                  {__v?.fertDk ? (
                    <>
                      <span className="jn-note">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                        </svg>
                        <span>
                          {"Bezra will use the usual amount for this stage. Check the next feeding with your engineer."}
                        </span>
                      </span>
                    </>
                  ) : null}
                  {__v?.fertNone ? (
                    <>
                      <span className="jn-note">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
                        </svg>
                        <span>
                          {"Then the first dose moves to this week in your plan. Bezra gives a range. Check it with your engineer."}
                        </span>
                      </span>
                    </>
                  ) : null}
                </section>
              </div>
              <aside className="jn-side" aria-labelledby="bs-h">
                <span className="sec" id="bs-h">
                  {"What this means for your harvest"}
                </span>
                <span className="col" style={{"gap":"6px"} as any}>
                  <span className="meta">
                    {"Best harvest still possible"}
                  </span>
                  <span className="row" style={{"gap":"8px","alignItems":"baseline"} as any}>
                    <span className="jn-big">
                      {__s(__v?.best)}
                    </span>
                    <span className="meta" style={{"fontSize":"15px"} as any}>
                      {__s(__v?.unit)}
                    </span>
                  </span>
                  <span style={{"fontSize":"14px","color":"var(--ink2)"} as any}>
                    {__s(__v?.bestSay)}
                  </span>
                  {__v?.hasSure ? (
                    <>
                      <span className="jn-src guess">
                        {__s(__v?.sureTxt)}
                      </span>
                    </>
                  ) : null}
                  <span className="meta" style={{"fontSize":"12px"} as any}>
                    {__s(__v?.usual)}
                  </span>
                </span>
                <div className="col">
                  <span className="meta" style={{"fontSize":"12px","fontWeight":"600","letterSpacing":".4px","textTransform":"uppercase","paddingBottom":"4px"} as any}>
                    {"Already decided"}
                  </span>
                  {((__v?.decided) || []).map((x: any, ix: number) => (
                    <div className="jn-row lock" key={ix}>
                      <span>{x.t}<br /><span className="meta" style={{"fontSize":"12px"} as any}>{x.sub}</span></span>
                      <b>{x.v}</b>
                    </div>
                  ))}
                </div>
                <div className="col">
                  <span className="meta" style={{"fontSize":"12px","fontWeight":"600","letterSpacing":".4px","textTransform":"uppercase","paddingBottom":"4px"} as any}>
                    {"Still in your hands"}
                  </span>
                  {((__v?.inHands) || []).map((x: any, ix: number) => (
                    <div className="jn-row" key={ix}>
                      <span>{x.t}</span>
                      <b>{x.v}</b>
                    </div>
                  ))}
                  
                  
                  
                </div>
                <Link href="#" onClick={__v?.build} aria-disabled={!!__v?.busy} className="btn cta press" style={{"height":"54px","fontSize":"15px","padding":"0 6px 0 22px","justifyContent":"space-between"} as any}>
                  {__s(__v?.buildLabel)}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </Link>
                <span className="meta" style={{"fontSize":"12px","textAlign":"center"} as any}>
                  {__v?.hasErr ? __s(__v?.err) : "You can fix any of this later in your journal."}
                </span>
              </aside>
            </div>
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
