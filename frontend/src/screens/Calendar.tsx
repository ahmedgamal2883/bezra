'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// Generated from design/html/V11-Calendar.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Calendar.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho, UserName, UserInitials, EngineerTab, useDemo } from '@/lib/field';
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { useApi } from '@/lib/api';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Calendar.logic';

export default function CalendarScreen() {
  const { fp, id, name } = useField();
  const cal = useApi(`/fields/${id}/calendar`);
  const demo = useDemo();
  const __v = useDC(Logic, { demo, data: cal.data, loading: cal.loading, fieldId: id });
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
                  {`When to sow, crop by crop, for ${name}`}
                </span>
                <h1 className="h1">
                  {"Planting calendar"}
                </h1>
              </div>
              <div className="row rise" style={{"--d":"1","gap":"10px"} as any}>
                <span className="tl">
                  {"Climate of"}
                </span>
                <div role="group" aria-label="Climate period" className="seg">
                  {((__v?.eras) || []).map((e: any, i0: number) => (
                    <Fragment key={i0}>
                      <button type="button" className={__s(e?.cls) as any} onClick={e?.pick} aria-pressed={__s(e?.p) as any}>
                        {__s(e?.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
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
              <Link href={fp("/calendar")} aria-current="page">
                {"Calendar"}
              </Link>
              <Link href={fp("/next")}>
                {"Next season"}
              </Link>
              <Link href={fp("/alerts")}>
                {"Alerts"}
              </Link>
            </nav>
            <section className="card rise " style={{"--d":"2","gap":"18px"} as any}>
              <i className="sk " aria-hidden="true" style={{"--d":"2"} as any} />
              <div className="row sp wrap" style={{"gap":"12px"} as any}>
                <h2 className="h2">
                  {"Sowing windows, "}
                  {__s(__v?.eraLabel)}
                  {__v.live && demo ? <>{" "}<span className="pill pv-demo" style={{ verticalAlign: "middle" }}>Other crops: Demo</span></> : null}
                </h2>
                <span className="row" style={{"gap":"14px","fontSize":"12px","color":"var(--ink2)"} as any}>
                  <span className="row" style={{"gap":"6px"} as any}>
                    <i style={{"width":"18px","height":"10px","borderRadius":"3px","background":"#3E8F4E"} as any} />
                    {"Best"}
                  </span>
                  <span className="row" style={{"gap":"6px"} as any}>
                    <i style={{"width":"18px","height":"10px","borderRadius":"3px","background":"#E9C25A"} as any} />
                    {"OK"}
                  </span>
                  <span className="row" style={{"gap":"6px"} as any}>
                    <i style={{"width":"18px","height":"10px","borderRadius":"3px","background":"repeating-linear-gradient(45deg,#D9644B 0 3px,#EBA290 3px 6px)"} as any} />
                    {"High risk"}
                  </span>
                  <span className="row" style={{"gap":"6px"} as any}>
                    <i style={{"width":"10px","height":"10px","borderRadius":"5px","background":"#fff","boxShadow":"0 0 0 2px #141A16"} as any} />
                    {"Stage"}
                  </span>
                </span>
              </div>
              <div style={{"display":"grid","gridTemplateColumns":"150px repeat(24, minmax(0, 1fr))","rowGap":"14px","columnGap":"0","alignItems":"center"} as any}>
                <span />
                <div style={{"gridColumn":"span 24","display":"grid","gridTemplateColumns":"repeat(12, minmax(0, 1fr))"} as any}>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Nov"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Dec"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Jan"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Feb"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Mar"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Apr"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"May"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Jun"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Jul"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Aug"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Sep"}
                  </span>
                  <span style={{"fontSize":"12px","fontWeight":"600","color":"var(--muted)","textAlign":"center"} as any}>
                    {"Oct"}
                  </span>
                </div>
                {((__v?.crops) || []).map((c: any, i1: number) => (
                  <Fragment key={i1}>
                    <span className="row" style={{"gap":"8px","fontSize":"14px","fontWeight":"600"} as any}>
                      <span style={__css(c?.sw)} />
                      {__s(c?.name)}
                    </span>
                    <div style={{"gridColumn":"span 24","position":"relative","display":"grid","gridTemplateColumns":"repeat(24, minmax(0, 1fr))","gap":"2px","height":"34px"} as any}>
                      {((c?.cells) || []).map((h: any, i2: number) => (
                        <Fragment key={i2}>
                          <button type="button" className="growx" aria-label={__s(h?.aria) as any} onClick={h?.pick} style={__css(h?.style)} />
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
              <div className="row wrap" style={{"gap":"8px","paddingLeft":"150px"} as any}>
                <span className="tl">
                  {"Wheat stages if sown "}
                  {__s(__v?.pickLabel)}
                  {":"}
                </span>
                {((__v?.stages) || []).map((s: any, i3: number) => (
                  <Fragment key={i3}>
                    <span className="pill">
                      {__s(s)}
                    </span>
                  </Fragment>
                ))}
              </div>
            </section>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr)"} as any}>
              <section className="card rise " style={{"--d":"3"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                <div className="row" style={{"gap":"12px","alignItems":"flex-start"} as any}>
                  <svg aria-hidden="true" width="52" height="52" viewBox="0 0 60 60">
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
                  <div className="col" style={{"gap":"6px","flex":"1"} as any}>
                    <span className="tl">
                      {"If you sow wheat on"}
                    </span>
                    <h2 className="h3">
                      {__s(__v?.pickLabel)}
                    </h2>
                  </div>
                </div>
                <div className="grid" style={{"gridTemplateColumns":"1fr 1fr","gap":"6px"} as any}>
                  <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start"} as any}>
                    <span>
                      {"Heat at grain fill"}
                    </span>
                    <b style={{"fontSize":"22px"} as any}>
                      {__s(__v?.heat)}
                      {"%"}
                      <small className="unit">
                        {" chance"}
                      </small>
                    </b>
                  </div>
                  <div className="inset" style={{"flexDirection":"column","alignItems":"flex-start"} as any}>
                    <span>
                      {"Yield vs best date"}
                    </span>
                    <b style={{"fontSize":"22px"} as any}>
                      {__s(__v?.loss)}
                    </b>
                  </div>
                </div>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className={__v.pvEst}>
                    {__v.pvEstL}
                  </span>
                  <span className="pill">
                    {"Your area"}
                  </span>
                  <span className="pill">
                    {"30 years of NASA POWER"}
                  </span>
                </span>
              </section>
              <section className="card rise tint-s" style={{"--d":"4"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                <div className="row" style={{"gap":"10px"} as any}>
                  <span className="chip s">
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                    </svg>
                  </span>
                  <h2 className="h2">
                    {"Your maize harvest is late"}
                  </h2>
                </div>
                <p className="body">
                  {"Your maize is harvested around "}
                  <b>
                    {__v.lateHarvest}
                  </b>
                  {", so wheat goes in late. That costs about "}
                  <b>
                    {__v.lateCost}
                  </b>
                  {"."}
                </p>
                <Link href="/sim" className="btn soft cta press">
                  {"Try it in the simulator"}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </Link>
              </section>
              <section className="card rise " style={{"--d":"5"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"5"} as any} />
                <h2 className="h2">
                  {__v.earlierTitle}
                </h2>
                <p className="body">
                  {"In the 1990s the best time to sow wheat started about "}
                  <b>
                    {__v.earlier90}
                  </b>
                  {". By 2040 it will be about "}
                  <b>
                    {__v.earlier40}
                  </b>
                  {" than today."}
                </p>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className="pill pv-est">
                    {"Estimated"}
                  </span>
                  {__v.live ? null : <span className="pill pv-demo">
                    {"Demo"}
                  </span>}
                </span>
                <Link href={fp("/next")} className="btn line cta press">
                  {"See next season"}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </Link>
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
