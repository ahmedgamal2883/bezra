'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V19-Season.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Season.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Tour from '@/v2/tour/Tour';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Season.logic';
import { useSeasonData } from '@/v2/data/season';

export default function SeasonScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const season = useSeasonData();
  const __v = { ...season, ...useDC(Logic, { ...props, d: season }) };
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
              <Link href={__r("V19-Soil") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
                </svg>
                {"Soil"}
              </Link>
              <Link href={__r("V19-Season") + ""} aria-current="page" className="press">
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
            {__v?.ready ? null : <div className="sk" style={{"height":"260px","borderRadius":"24px"} as any} aria-busy="true" />}
            {__v?.simple ? (
              <>
                <div className="col" style={{"gap":"32px"} as any}>
                  <div className="pagehead rise" style={{"--d":"0"} as any}>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <span className="meta" style={{"fontSize":"15px"} as any}>
                        {__s(__v?.head)}
                      </span>
                      {__v?.nextWinter ? <span className="meta" style={{"fontSize":"14px","color":"var(--green)","fontWeight":"600"} as any}>{__v.nextWinter}</span> : null}
                      <h1 className="h1x">
                        {__s(__v?.title)}
                      </h1>
                    </div>
                    <Link href={__r("V19-Try") + ""} className="btn press" style={{"height":"52px","fontSize":"15px"} as any}>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                      {"Try a change first"}
                    </Link>
                  </div>
                  <section className="rise" style={{"--d":"1","paddingTop":"24px"} as any}>
                    <div className="stages" role="img" aria-label={"Season stages. " + __s(__v?.here?.t)}>
                      {((__v?.stages) || []).map((g: any, ig: number) => (
                        <div className="stg" key={ig} style={__css(g.sty)}>{g.t}<small>{g.s}</small></div>
                      ))}
                      {__v?.here ? <span className="here" style={__css(__v.here.left)}><span>{__v.here.t}</span></span> : null}
                    </div>
                  </section>
                  <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 360px","gap":"56px","alignItems":"start"} as any}>
                    <section className="col rise" style={{"--d":"2"} as any}>
                      {((__v?.weeks) || []).map((w: any, i0: number) => (
                        <Fragment key={i0}>
                          <section className="col">
                            <div className="wkh">
                              <h2 style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {__s(w?.h)}
                              </h2>
                              <span className="meta">
                                {__s(w?.sub)}
                              </span>
                            </div>
                            {((w?.rows) || []).map((r: any, i1: number) => (
                              <Fragment key={i1}>
                                <div className={__s(r?.cls) as any}>
                                  {r?.live ? (
                                    <>
                                      <button type="button" className={__s(r?.box) as any} role="checkbox" aria-checked={__s(r?.checked) as any} aria-label={__s(r?.label) as any} onClick={r?.toggle}>
                                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                                        </svg>
                                      </button>
                                    </>
                                  ) : null}
                                  {r?.notLive ? (
                                    <>
                                      <span className={__s(r?.box) as any} aria-hidden="true">
                                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                                        </svg>
                                      </span>
                                    </>
                                  ) : null}
                                  <span className="meta" style={{"paddingTop":"5px","color":"var(--ink2)","fontWeight":"600"} as any}>
                                    {__s(r?.d)}
                                  </span>
                                  <span className="col" style={{"gap":"2px"} as any}>
                                    <span className="tt" style={{"fontSize":"17px"} as any}>
                                      {__s(r?.t)}
                                    </span>
                                    <span className="meta">
                                      {__s(r?.s)}
                                    </span>
                                  </span>
                                  <span />
                                </div>
                              </Fragment>
                            ))}
                          </section>
                        </Fragment>
                      ))}
                    </section>
                    <aside className="col" style={{"gap":"14px","position":"sticky","top":"96px"} as any}>
                      <div className="col" style={{"gap":"10px","padding":"24px","borderRadius":"24px","background":"#fff"} as any}>
                        <span className="sec">
                          {"THIS SEASON SO FAR"}
                        </span>
                        {((__v?.soFar) || []).map((x: any, ix: number) => (
                          <div className="row sp" key={ix} style={{"padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                            <span className="meta" style={{"fontSize":"14px"} as any}>{x.l}</span>
                            <b style={{"fontWeight":"600"} as any}>{x.v}</b>
                          </div>
                        ))}
                        
                        
                        
                        <div className="col" style={{"gap":"4px","padding":"14px 16px","marginTop":"8px","borderRadius":"16px","background":"var(--green-tint)","color":"var(--green)"} as any}>
                          <span style={{"fontSize":"13px","fontWeight":"600"} as any}>
                            {"Bezra effect, this season"}
                          </span>
                          <b style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.8px"} as any}>
                            {__s(__v?.effect?.v)}
                          </b>
                          <span style={{"fontSize":"13px"} as any}>
                            {__s(__v?.effect?.s)}
                          </span>
                        </div>
                      </div>
                      <Link href={__r("V19-Try") + ""} className="col press" style={{"gap":"8px","padding":"24px","borderRadius":"24px","background":"var(--dark)","color":"#fff"} as any}>
                        <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                          {"See your season two ways"}
                        </b>
                        <span style={{"color":"rgba(255,255,255,.75)","fontSize":"15px"} as any}>
                          {"Your usual way vs Bezra's plan, month by month, on your own field."}
                        </span>
                        <span className="row" style={{"gap":"6px","fontWeight":"600","color":"var(--sun)","marginTop":"4px"} as any}>
                          {"Play the season"}
                          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9.5 6 6 6-6 6" />
                          </svg>
                        </span>
                      </Link>
                    </aside>
                  </div>
                  {__v?.hot ? (<section className="grid hair" style={{"gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"48px","paddingTop":"28px","alignItems":"center"} as any}>
                    <div className="chart">
                      <span className="sec">
                        {"YOUR SPRINGS ARE GETTING HOTTER"}
                      </span>
                      <div style={{"display":"flex","alignItems":"flex-end","gap":"3px","height":"110px"} as any} role="img" aria-label={__s(__v?.hotSay)}>
                        {((__v?.hot) || []).map((b: any, ib: number) => <span key={ib} className="grow" title={b.l + ": " + b.v} style={__css(b.sty)} />)}
                      </div>
                      <div className="row sp meta">
                        {((__v?.hot) || []).map((b: any, ib: number) => <span key={ib}>{b.l}</span>)}
                      </div>
                    </div>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <b style={{"fontSize":"22px","fontWeight":"600","lineHeight":"1.35"} as any}>
                        {__s(__v?.hotSay)}
                      </b>
                      <p className="txt" style={{"fontSize":"16px"} as any}>
                        {__v?.twin ? "Fields near " + __v.twin.name + " already have springs like yours will. What helps there: " + __v.twin.practice : ""}
                      </p>
                      <span className="doneline" style={{"alignSelf":"flex-start"} as any}>
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                        {__s(__v?.sownLine)}
                      </span>
                    </div>
                  </section>) : null}
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
                        {__s(__v?.titleD)}
                      </h1>
                    </div>
                    <Link href={__r("V19-TryD") + ""} className="btn press">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                      {"Try a season"}
                    </Link>
                  </div>
                  <section className="rise" style={{"--d":"1","paddingTop":"24px"} as any}>
                    <div className="stages" role="img" aria-label={"Season stages. " + __s(__v?.here?.t)}>
                      {((__v?.stages) || []).map((g: any, ig: number) => (
                        <div className="stg" key={ig} style={__css(g.sty)}>{g.t}<small>{g.s}</small></div>
                      ))}
                      {__v?.here ? <span className="here" style={__css(__v.here.left)}><span>{__v.here.t}</span></span> : null}
                    </div>
                    <div className="row sp meta" style={{"marginTop":"10px"} as any}>
                      <span>
                        {""}
                      </span>
                      <span>
                        {""}
                      </span>
                      <span>
                        {""}
                      </span>
                      <span>
                        {""}
                      </span>
                      <span>
                        {""}
                      </span>
                    </div>
                  </section>
                  <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"48px","alignItems":"start"} as any}>
                    <section className="col rise" style={{"--d":"2"} as any}>
                      {((__v?.weeks) || []).map((w: any, i2: number) => (
                        <Fragment key={i2}>
                          <section className="col">
                            <div className="wkh">
                              <h2 style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {__s(w?.h)}
                              </h2>
                              <span className="meta">
                                {__s(w?.sub)}
                              </span>
                            </div>
                            {((w?.rows) || []).map((r: any, i3: number) => (
                              <Fragment key={i3}>
                                <div className={__s(r?.cls) as any}>
                                  {r?.live ? (
                                    <>
                                      <button type="button" className={__s(r?.box) as any} role="checkbox" aria-checked={__s(r?.checked) as any} aria-label={__s(r?.label) as any} onClick={r?.toggle}>
                                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                                        </svg>
                                      </button>
                                    </>
                                  ) : null}
                                  {r?.notLive ? (
                                    <>
                                      <span className={__s(r?.box) as any} aria-hidden="true">
                                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                                        </svg>
                                      </span>
                                    </>
                                  ) : null}
                                  <span className="meta" style={{"paddingTop":"5px","color":"var(--ink2)","fontWeight":"600"} as any}>
                                    {__s(r?.d)}
                                  </span>
                                  <span className="col" style={{"gap":"2px"} as any}>
                                    <span className="tt" style={{"fontSize":"17px"} as any}>
                                      {__s(r?.t)}
                                    </span>
                                    <span className="meta">
                                      {__s(r?.s)}
                                    </span>
                                  </span>
                                  <span />
                                </div>
                              </Fragment>
                            ))}
                          </section>
                        </Fragment>
                      ))}
                    </section>
                    <div className="col" style={{"gap":"28px"} as any}>
                      <div className="col" style={{"gap":"8px"} as any}>
                        <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                          {"Water plan"}
                        </b>
                        <table className="tbl">
                          <thead>
                            <tr>
                              <th>
                                {"Date"}
                              </th>
                              <th>
                                {"Status"}
                              </th>
                              <th>
                                {"For your field"}
                              </th>
                              <th>
                                {"Soil water"}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {((__v?.water) || []).map((w: any, iw: number) => (<tr key={iw}><td>{w.d}</td><td>{w.st}</td><td>{w.amt}</td><td className="meta">{w.note}</td></tr>))}
                            <tr><td colSpan={4} className="meta">{__s(__v?.waterTotal)}</td></tr>
                          </tbody>
                        </table>
                        <span className="pq est">
                          {"FAO-56 water balance on NASA POWER + Open-Meteo, and your log"}
                        </span>
                      </div>
                      <div className="col" style={{"gap":"8px"} as any}>
                        <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                          {"Feeding plan"}
                        </b>
                        <table className="tbl">
                          <thead>
                            <tr>
                              <th>
                                {"Date"}
                              </th>
                              <th>
                                {"What"}
                              </th>
                              <th>
                                {"Amount"}
                              </th>
                              <th>
                                {"Status"}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {((__v?.feed) || []).map((w: any, iw: number) => (<tr key={iw}><td>{w.d}</td><td>{w.what}</td><td>{w.amt}</td><td>{w.st}</td></tr>))}
                          </tbody>
                        </table>
                        <span className="pq est">
                          {"Amounts: about what the Ministry recommends for your crop and field. Check them with your engineer."}
                        </span>
                      </div>
                    </div>
                  </div>
                  {__v?.hot ? (<section className="grid hair" style={{"gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"48px","paddingTop":"28px"} as any}>
                    <div className="chart">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Hot days over 32 °C in March–April"}
                      </b>
                      <div style={{"display":"flex","alignItems":"flex-end","gap":"3px","height":"110px"} as any} role="img" aria-label={__s(__v?.hotSay)}>
                        {((__v?.hot) || []).map((b: any, ib: number) => <span key={ib} className="grow" title={b.l + ": " + b.v} style={__css(b.sty)} />)}
                      </div>
                      <div className="row sp meta">
                        {((__v?.hot) || []).map((b: any, ib: number) => <span key={ib}>{b.l}</span>)}
                      </div>
                      <span className="pq sat">
                        {__s(__v?.hotSrc)}
                      </span>
                    </div>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <span className="sec">
                        {"CLIMATE TWIN"}
                      </span>
                      <b style={{"fontSize":"20px","fontWeight":"600","lineHeight":"1.35"} as any}>
                        {__v?.twin ? __v.twin.name + " already has the spring heat your field is heading to." : ""}
                      </b>
                      <p className="txt">
                        {__v?.twin ? "Similarity " + __v.twin.sim + "%. What helps there: " + __v.twin.practice : ""}
                      </p>
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="pq sat">
                          {__s(__v?.twin?.src)}
                        </span>
                      </span>
                    </div>
                  </section>) : null}
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
      <Tour page="Season" />
    </>
  );
}
