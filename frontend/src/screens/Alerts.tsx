'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// Generated from design/html/V11-Alerts.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Alerts.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho, UserName, UserInitials, EngineerTab } from '@/lib/field';
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { useApi } from '@/lib/api';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Alerts.logic';

export default function AlertsScreen() {
  const { fp, id } = useField();
  const al = useApi(`/fields/${id}/alerts`);
  const __v = useDC(Logic, { data: al.data, loading: al.loading, fieldId: id });
  return (
    <>
      <div className="root">
        <div className="shell">
          <header className="top">
            <Link href={fp("")} className="brand" aria-label="Bezra, my field">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <nav aria-label="Main" className="nav">
              <Link href={fp("")} aria-current="page" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />
                </svg>
                {"My field"}
              </Link>
              <Link href="/sim" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 4v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v2M18 4v4M6 20v-2M3 7l3-3 3 3M15 7l3-3 3 3" />
                </svg>
                {"Simulator"}
              </Link>
              <Link href="/ask" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 18.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8.5zM9 9h6M9 12h3" />
                </svg>
                {"Ask Bezra"}
              </Link>
              <Link href="/profile" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0" />
                </svg>
                {"Profile"}
              </Link>
              <EngineerTab />
            </nav>
            <div className="tools">
              <DataLive />
              <div role="group" aria-label="Detail level" className="seg">
                <button type="button" className={__s(__v?.segS) as any} onClick={__v?.pickS} aria-pressed={__s(__v?.isS) as any}>
                  {"Simple"}
                </button>
                <button type="button" className={__s(__v?.segD) as any} onClick={__v?.pickD} aria-pressed={__s(__v?.isD) as any}>
                  {"Details"}
                </button>
              </div>
              <Link href={fp("/alerts")} className="ibtn press" aria-label="Alerts, 2 new">
                <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
                </svg>
                <span className="dot" />
              </Link>
              <span className="who">
                <span className="av" aria-hidden="true">
                  <UserInitials />
                </span>
                <span>
                  <b>
                    <UserName />
                  </b>
                  <small>
                    <FieldWho />
                  </small>
                </span>
              </span>
            </div>
          </header>
          <main className="main">
            <div className="head">
              <div className="col rise" style={{"--d":"0","gap":"6px"} as any}>
                <span className="eyebrow">
                  {__v.headline}
                </span>
                <h1 className="h1">
                  {"Alerts"}
                </h1>
              </div>
              <div className="row rise" style={{"--d":"1","gap":"8px"} as any}>
                <span className="pill" style={{"height":"32px","padding":"0 12px","fontSize":"13px"} as any}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
                  </svg>
                  {" Voice notes on"}
                </span>
                <span className="pill" style={{"height":"32px","padding":"0 12px","fontSize":"13px"} as any}>
                  {"WhatsApp on"}
                </span>
              </div>
            </div>
            <nav aria-label="Field sections" className="tabs rise" style={{"--d":"0"} as any}>
              <Link href={fp("")}>
                {"Today"}
              </Link>
              <Link href={fp("/plan")}>
                {"Season plan"}
              </Link>
              <Link href={fp("/health")}>
                {"Field health"}
              </Link>
              <Link href={fp("/calendar")}>
                {"Calendar"}
              </Link>
              <Link href={fp("/next")}>
                {"Next season"}
              </Link>
              <Link href={fp("/alerts")} aria-current="page">
                {"Alerts"}
              </Link>
            </nav>
            <div className="grid" style={{"gridTemplateColumns":"420px minmax(0, 1fr)","alignItems":"start"} as any}>
              <div className="col" style={{"gap":"8px"} as any}>
                <button type="button" onClick={__v?.a0?.pick} aria-pressed={__s(__v?.a0?.p) as any} className="press rise" style={__css(`--d:2; ${__s(__v?.a0?.style)}`)}>
                  <span className="chip w">
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                    </svg>
                  </span>
                  <span className="col" style={{"flex":"1","gap":"3px","textAlign":"left"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.L[0].title}
                    </b>
                    <span className="tl">
                      {__v.L[0].when}
                    </span>
                  </span>
                  <span className={__v.L[0].lv}>
                    <i />
                    {__v.L[0].lvL}
                  </span>
                </button>
                <button type="button" onClick={__v?.a1?.pick} aria-pressed={__s(__v?.a1?.p) as any} className="press rise" style={__css(`--d:3; ${__s(__v?.a1?.style)}`)}>
                  <span className="chip r">
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8M10 12h.01M14 9h.01M13 14h.01" />
                    </svg>
                  </span>
                  <span className="col" style={{"flex":"1","gap":"3px","textAlign":"left"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.L[1].title}
                    </b>
                    <span className="tl">
                      {__v.L[1].when}
                    </span>
                  </span>
                  <span className={__v.L[1].lv}>
                    <i />
                    {__v.L[1].lvL}
                  </span>
                </button>
                <button type="button" onClick={__v?.a2?.pick} aria-pressed={__s(__v?.a2?.p) as any} className="press rise" style={__css(`--d:4; ${__s(__v?.a2?.style)}`)}>
                  <span className="chip g">
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
                    </svg>
                  </span>
                  <span className="col" style={{"flex":"1","gap":"3px","textAlign":"left"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.L[2].title}
                    </b>
                    <span className="tl">
                      {__v.L[2].when}
                    </span>
                  </span>
                  <span className={__v.L[2].lv}>
                    <i />
                    {__v.L[2].lvL}
                  </span>
                </button>
                <button type="button" onClick={__v?.a3?.pick} aria-pressed={__s(__v?.a3?.p) as any} className="press rise" style={__css(`--d:5; ${__s(__v?.a3?.style)}`)}>
                  <span className="chip g">
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                    </svg>
                  </span>
                  <span className="col" style={{"flex":"1","gap":"3px","textAlign":"left"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.L[3].title}
                    </b>
                    <span className="tl">
                      {__v.L[3].when}
                    </span>
                  </span>
                  <span className={__v.L[3].lv}>
                    <i />
                    {__v.L[3].lvL}
                  </span>
                </button>
                <button type="button" onClick={__v?.a4?.pick} aria-pressed={__s(__v?.a4?.p) as any} className="press rise" style={__css(`--d:6; ${__s(__v?.a4?.style)}`)}>
                  <span className="chip s">
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7" />
                    </svg>
                  </span>
                  <span className="col" style={{"flex":"1","gap":"3px","textAlign":"left"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.L[4].title}
                    </b>
                    <span className="tl">
                      {__v.L[4].when}
                    </span>
                  </span>
                  <span className={__v.L[4].lv}>
                    <i />
                    {__v.L[4].lvL}
                  </span>
                </button>
              </div>
              <section className="card rise " style={{"--d":"3","padding":"26px","gap":"16px"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                {__v?.is0 ? (
                  <>
                    <div className="row sp">
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="chip w" style={{"width":"40px","height":"40px","borderRadius":"12px"} as any}>
                          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                          </svg>
                        </span>
                        <span className="tl">
                          {__v.L[0].when}
                        </span>
                      </span>
                      <span className={__v.L[0].lv}>
                        <i />
                        {__v.L[0].lvL}
                      </span>
                    </div>
                  </>
                ) : null}
                {__v?.is1 ? (
                  <>
                    <div className="row sp">
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="chip r" style={{"width":"40px","height":"40px","borderRadius":"12px"} as any}>
                          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8M10 12h.01M14 9h.01M13 14h.01" />
                          </svg>
                        </span>
                        <span className="tl">
                          {__v.L[1].when}
                        </span>
                      </span>
                      <span className={__v.L[1].lv}>
                        <i />
                        {__v.L[1].lvL}
                      </span>
                    </div>
                  </>
                ) : null}
                {__v?.is2 ? (
                  <>
                    <div className="row sp">
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="chip g" style={{"width":"40px","height":"40px","borderRadius":"12px"} as any}>
                          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
                          </svg>
                        </span>
                        <span className="tl">
                          {__v.L[2].when}
                        </span>
                      </span>
                      <span className={__v.L[2].lv}>
                        <i />
                        {__v.L[2].lvL}
                      </span>
                    </div>
                  </>
                ) : null}
                {__v?.is3 ? (
                  <>
                    <div className="row sp">
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="chip g" style={{"width":"40px","height":"40px","borderRadius":"12px"} as any}>
                          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8" />
                          </svg>
                        </span>
                        <span className="tl">
                          {__v.L[3].when}
                        </span>
                      </span>
                      <span className={__v.L[3].lv}>
                        <i />
                        {__v.L[3].lvL}
                      </span>
                    </div>
                  </>
                ) : null}
                {__v?.is4 ? (
                  <>
                    <div className="row sp">
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="chip s" style={{"width":"40px","height":"40px","borderRadius":"12px"} as any}>
                          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7" />
                          </svg>
                        </span>
                        <span className="tl">
                          {__v.L[4].when}
                        </span>
                      </span>
                      <span className={__v.L[4].lv}>
                        <i />
                        {__v.L[4].lvL}
                      </span>
                    </div>
                  </>
                ) : null}
                <h2 style={{"fontSize":"32px","lineHeight":"1.1","fontWeight":"600","letterSpacing":"-1px"} as any}>
                  {__s(__v?.title)}
                </h2>
                <p className="body" style={{"fontSize":"16px"} as any}>
                  {__s(__v?.why)}
                </p>
                <div className="row" style={{"gap":"14px","padding":"12px","borderRadius":"12px","background":"var(--dark)","color":"#fff"} as any}>
                  <button type="button" className="ibtn press" onClick={__v?.togglePlay} aria-label={__s(__v?.playLabel) as any} style={{"background":"var(--sun)","color":"var(--ink)"} as any}>
                    {__v?.play ? (
                      <>
                        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 5v14M16 5v14" />
                        </svg>
                      </>
                    ) : null}
                    {__v?.paused ? (
                      <>
                        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 5.5v13l11-6.5z" />
                        </svg>
                      </>
                    ) : null}
                  </button>
                  <div style={{"flex":"1","display":"flex","alignItems":"center","gap":"3px","height":"34px"} as any} aria-hidden="true">
                    {((__v?.wave) || []).map((w: any, i0: number) => (
                      <Fragment key={i0}>
                        <span style={__css(w)} />
                      </Fragment>
                    ))}
                  </div>
                  <span className="col" style={{"alignItems":"flex-end"} as any}>
                    <span style={{"fontSize":"14px"} as any}>
                      <T en="Voice message from Bezra" ar="رسالة صوتية من بذرة" />
                    </span>
                    <span style={{"fontSize":"12px","color":"rgba(255,255,255,.65)"} as any}>
                      {__v.voiceLen}
                    </span>
                  </span>
                </div>
                <span className="tl" style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                  {"What to do"}
                </span>
                <ol style={{"margin":"0","padding":"0","listStyle":"none","display":"flex","flexDirection":"column","gap":"6px"} as any}>
                  {((__v?.steps) || []).map((s: any, i1: number) => (
                    <Fragment key={i1}>
                      <li className="inset" style={{"justifyContent":"flex-start","fontSize":"14px"} as any}>
                        <span style={__css(s?.n)}>
                          {__s(s?.k)}
                        </span>
                        <b style={{"fontWeight":"500"} as any}>
                          {__s(s?.t)}
                        </b>
                      </li>
                    </Fragment>
                  ))}
                </ol>
                <div className="row wrap" style={{"gap":"6px"} as any}>
                  {__v?.is0 ? (
                    <>
                      <span className={__v.pvCls}>
                        {__v.pvL}
                      </span>
                    </>
                  ) : null}
                  {__v?.is1 ? (
                    <>
                      <span className={__v.pvCls}>
                        {__v.pvL}
                      </span>
                    </>
                  ) : null}
                  {__v?.is2 ? (
                    <>
                      <span className={__v.pvCls}>
                        {__v.pvL}
                      </span>
                    </>
                  ) : null}
                  {__v?.is3 ? (
                    <>
                      <span className={__v.pvCls}>
                        {__v.pvL}
                      </span>
                    </>
                  ) : null}
                  {__v?.is4 ? (
                    <>
                      <span className={__v.pvCls}>
                        {__v.pvL}
                      </span>
                    </>
                  ) : null}
                  <span className="pill">
                    {"Confidence: "}
                    {__s(__v?.conf)}
                  </span>
                  <span className="pill">
                    {"Source: "}
                    {__s(__v?.src)}
                  </span>
                </div>
                <div className="row" style={{"gap":"8px"} as any}>
                  <button type="button" className={__s(__v?.doneCls) as any} onClick={__v?.toggleDone} aria-pressed={__s(__v?.doneP) as any}>
                    {__s(__v?.doneL)}
                  </button>
                  <Link href="/ask" className="btn soft cta press" style={{"flex":"1"} as any}>
                    {"Ask Bezra about this"}
                    <span className="ar">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </section>
            </div>
            <footer className="foot">
              <span>
                <T en="Bezra helps you think. It doesn&apos;t decide for you." ar="الأداة دي بتساعدك تفكر، مش بتقرر بدالك." />
              </span>
              <span>
                {__v.foot}
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
