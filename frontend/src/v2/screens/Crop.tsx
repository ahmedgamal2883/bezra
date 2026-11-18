'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Crop.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Crop.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Crop.logic';

export default function CropScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const __v = useDC(Logic, props);
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
              <Link href={__r("V18-Crop") + ""} className="ibtn press" aria-label="Alerts, 2 new">
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
                        {"North plot · wheat, day 28 · Thursday 3 December"}
                      </span>
                      <h1 className="h1x">
                        {"Your wheat is safe this week. One thing to watch: rust."}
                      </h1>
                    </div>
                  </div>
                  <section className="col rise" style={{"--d":"1"} as any} aria-label="Risks this week">
                    <article className="rk">
                      <span className="rki" style={{"background":"#F6E8D6","color":"#9A4F08"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8M10 12h.01M14 9h.01M13 14h.01" />
                        </svg>
                      </span>
                      <div className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Rust"}
                        </b>
                        <span style={{"fontSize":"16px","color":"var(--ink2)"} as any}>
                          {"Three damp nights this week. Rust spreads in cool, wet weather."}
                        </span>
                      </div>
                      <span className="lvlpill med">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Medium"}
                      </span>
                      <Link href={__r("V18-Crop-Rust") + ""} className="go press">
                        {"Look at the lower leaves on Wed 9 Dec"}
                        <span className="ar">
                          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </span>
                      </Link>
                    </article>
                    <article className="rk">
                      <span className="rki" style={{"background":"#E8F1F9","color":"#2F6FA8"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                        </svg>
                      </span>
                      <div className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Water"}
                        </b>
                        <span style={{"fontSize":"16px","color":"var(--ink2)"} as any}>
                          {"The soil has reached the point where it needs water."}
                        </span>
                      </div>
                      <span className="lvlpill high">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Water today"}
                      </span>
                      <Link href={__r("V18-Today") + ""} className="go press">
                        {"It is on your to-do for today"}
                        <span className="ar">
                          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </span>
                      </Link>
                    </article>
                    <article className="rk">
                      <span className="rki" style={{"background":"#FFF4E3","color":"#9A5608"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                        </svg>
                      </span>
                      <div className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Aphids"}
                        </b>
                        <span style={{"fontSize":"16px","color":"var(--ink2)"} as any}>
                          {"You saw fewer on 29 Nov. They are rarely serious at this stage."}
                        </span>
                      </div>
                      <span className="lvlpill low">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Low"}
                      </span>
                      <Link href={__r("V18-Today") + ""} className="go press">
                        {"Check B2 and C2 today"}
                        <span className="ar">
                          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </span>
                      </Link>
                    </article>
                    <article className="rk">
                      <span className="rki" style={{"background":"#FBE6E1","color":"#C2412A"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7" />
                        </svg>
                      </span>
                      <div className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Heat"}
                        </b>
                        <span style={{"fontSize":"16px","color":"var(--ink2)"} as any}>
                          {"No heat this month. April is the risky month for your wheat."}
                        </span>
                      </div>
                      <span className="lvlpill low">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Low now"}
                      </span>
                      <Link href={__r("V18-Crop-Rust") + "#heat"} className="go press">
                        {"We will warn you 4–7 days before"}
                        <span className="ar">
                          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </span>
                      </Link>
                    </article>
                    <article className="rk">
                      <span className="rki" style={{"background":"#ECECE8","color":"#6A716C"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9c2 0 2-2 4.5-2S10 9 12 9s2.5-2 4.5-2S19 9 21 9M3 15c2 0 2-2 4.5-2S10 15 12 15s2.5-2 4.5-2 2.5 2 4.5 2" />
                        </svg>
                      </span>
                      <div className="col" style={{"gap":"4px"} as any}>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"Frost"}
                        </b>
                        <span style={{"fontSize":"16px","color":"var(--ink2)"} as any}>
                          {"No frost night here in the last 10 winters."}
                        </span>
                      </div>
                      <span className="lvlpill none">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Not a risk"}
                      </span>
                      <span />
                    </article>
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
                        {"WHAT HURT YOUR HARVEST BEFORE · LAST 10 SEASONS"}
                      </h2>
                      <div className="hist">
                        <span>
                          {"Late water in C1"}
                        </span>
                        <span className="hbar">
                          <i className="growx" style={{"width":"70%","background":"#E0A43A"} as any} />
                        </span>
                        <b style={{"fontWeight":"600"} as any}>
                          {"7 of 10"}
                        </b>
                      </div>
                      <div className="hist">
                        <span>
                          {"Heat while the grain fills"}
                        </span>
                        <span className="hbar">
                          <i className="growx" style={{"width":"40%","background":"#C2412A"} as any} />
                        </span>
                        <b style={{"fontWeight":"600"} as any}>
                          {"4 of 10"}
                        </b>
                      </div>
                      <div className="hist">
                        <span>
                          {"Rust"}
                        </span>
                        <span className="hbar">
                          <i className="growx" style={{"width":"30%","background":"#D9762B"} as any} />
                        </span>
                        <b style={{"fontWeight":"600"} as any}>
                          {"3 of 10"}
                        </b>
                      </div>
                      <div className="hist">
                        <span>
                          {"Water standing on A4"}
                        </span>
                        <span className="hbar">
                          <i className="growx" style={{"width":"20%","background":"#2F6FA8"} as any} />
                        </span>
                        <b style={{"fontWeight":"600"} as any}>
                          {"2 of 10"}
                        </b>
                      </div>
                    </div>
                    <div className="col" style={{"gap":"12px","justifyContent":"center"} as any}>
                      <b style={{"fontSize":"22px","fontWeight":"600","lineHeight":"1.35"} as any}>
                        {"Most losses on this field came from late water in one corner, not from pests."}
                      </b>
                      <p className="txt">
                        {"That is why C1 is on your to-do today. Fixing the water to that corner protects more than any spray."}
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
                        {"North plot · wheat, day 28 · Thu 3 Dec"}
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
                    <article className="rk" style={{"gridTemplateColumns":"56px 220px minmax(0, 1fr) 130px 40px"} as any}>
                      <span className="rki" style={{"background":"#F6E8D6","color":"#9A4F08"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 19c0-8 5-14 15-14 0 9-6 14-13 14M5 19c3-4 6-6.5 9-8M10 12h.01M14 9h.01M13 14h.01" />
                        </svg>
                      </span>
                      <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                        {"Rust (leaf and stripe)"}
                      </b>
                      <span className="col" style={{"gap":"6px"} as any}>
                        <span style={{"fontSize":"14px","color":"var(--ink2)","lineHeight":"1.5"} as any}>
                          {"Risk index 0.44, decision line 0.6. 4 of the last 7 nights over 85% humidity at 10–20 °C. 9 h leaf wetness last night."}
                        </span>
                        <span className="pq sat">
                          {"POWER hourly · model"}
                        </span>
                      </span>
                      <span className="lvlpill med">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Medium"}
                      </span>
                      <Link href={__r("V18-Crop-Rust") + ""} className="ibtn2" aria-label="Open Rust (leaf and stripe)">
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9.5 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </article>
                    <article className="rk" style={{"gridTemplateColumns":"56px 220px minmax(0, 1fr) 130px 40px"} as any}>
                      <span className="rki" style={{"background":"#E8F1F9","color":"#2F6FA8"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                        </svg>
                      </span>
                      <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                        {"Water"}
                      </b>
                      <span className="col" style={{"gap":"6px"} as any}>
                        <span style={{"fontSize":"14px","color":"var(--ink2)","lineHeight":"1.5"} as any}>
                          {"Root-zone soil water 0.24 m³/m³, refill 0.25, full 0.34. Crop uses 1.9 mm/day. Rain next 7 days: 0 mm."}
                        </span>
                        <span className="pq sat">
                          {"SMAP L4 · GPM"}
                        </span>
                      </span>
                      <span className="lvlpill high">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Today"}
                      </span>
                      <Link href={__r("V18-Today") + ""} className="ibtn2" aria-label="Open Water">
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9.5 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </article>
                    <article className="rk" style={{"gridTemplateColumns":"56px 220px minmax(0, 1fr) 130px 40px"} as any}>
                      <span className="rki" style={{"background":"#FFF4E3","color":"#9A5608"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                        </svg>
                      </span>
                      <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                        {"Aphids"}
                      </b>
                      <span className="col" style={{"gap":"6px"} as any}>
                        <span style={{"fontSize":"14px","color":"var(--ink2)","lineHeight":"1.5"} as any}>
                          {"Your notes: B2, C2 on 26 Nov, fewer on 29 Nov. Warm days 18–24 °C keep them going, cold nights slow them."}
                        </span>
                        <span className="pq sat">
                          {"Journal · POWER"}
                        </span>
                      </span>
                      <span className="lvlpill low">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Low"}
                      </span>
                      <Link href={__r("V18-Journal") + ""} className="ibtn2" aria-label="Open Aphids">
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9.5 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </article>
                    <article className="rk" style={{"gridTemplateColumns":"56px 220px minmax(0, 1fr) 130px 40px"} as any}>
                      <span className="rki" style={{"background":"#FBE6E1","color":"#C2412A"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0zM12 9v7" />
                        </svg>
                      </span>
                      <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                        {"Heat at grain filling"}
                      </b>
                      <span className="col" style={{"gap":"6px"} as any}>
                        <span style={{"fontSize":"14px","color":"var(--ink2)","lineHeight":"1.5"} as any}>
                          {"Max next 7 days 27 °C. Risk line 32 °C. Hit 4 of 10 springs (2017, 2020, 2023, 2026)."}
                        </span>
                        <span className="pq sat">
                          {"POWER forecast + 1990→"}
                        </span>
                      </span>
                      <span className="lvlpill low">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"Low now"}
                      </span>
                      <Link href={__r("V18-Crop-Rust") + "#heat"} className="ibtn2" aria-label="Open Heat at grain filling">
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m9.5 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </article>
                    <article className="rk" style={{"gridTemplateColumns":"56px 220px minmax(0, 1fr) 130px 40px"} as any}>
                      <span className="rki" style={{"background":"#ECECE8","color":"#6A716C"} as any}>
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 9c2 0 2-2 4.5-2S10 9 12 9s2.5-2 4.5-2S19 9 21 9M3 15c2 0 2-2 4.5-2S10 15 12 15s2.5-2 4.5-2 2.5 2 4.5 2" />
                        </svg>
                      </span>
                      <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                        {"Frost"}
                      </b>
                      <span className="col" style={{"gap":"6px"} as any}>
                        <span style={{"fontSize":"14px","color":"var(--ink2)","lineHeight":"1.5"} as any}>
                          {"Coldest night in 10 winters: 3.1 °C."}
                        </span>
                        <span className="pq sat">
                          {"POWER 2015→"}
                        </span>
                      </span>
                      <span className="lvlpill none">
                        <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                        {"None"}
                      </span>
                      <span />
                    </article>
                  </section>
                  <section className="grid hair rise" style={{"--d":"2","gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"48px","paddingTop":"28px"} as any}>
                    <div className="chart">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Rust risk, last 7 days and next 7"}
                      </b>
                      <svg viewBox="0 0 620 220" width="100%" role="img" aria-label="Rust risk over 14 days, rising towards the warning line but staying under it.">
                        <line x1="40" x2="610" y1="190.0" y2="190.0" stroke="#E8E8E3" />
                        <text x="0" y="194.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"0.0"}
                        </text>
                        <line x1="40" x2="610" y1="103.0" y2="103.0" stroke="#E8E8E3" />
                        <text x="0" y="107.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"0.5"}
                        </text>
                        <line x1="40" x2="610" y1="16.0" y2="16.0" stroke="#E8E8E3" />
                        <text x="0" y="20.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"1.0"}
                        </text>
                        <rect x="346.9" y="16" width="263.1" height="174" fill="#ECECE6" fillOpacity=".6" />
                        <line x1="40" x2="610" y1="85.6" y2="85.6" stroke="#C2412A" strokeDasharray="5 5" />
                        <text x="610" y="79.6" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#C2412A">
                          {"Spray decision line 0.6"}
                        </text>
                        <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M40.0 151.7 L83.8 146.5 L127.7 137.8 L171.5 141.3 L215.4 132.6 L259.2 118.7 L303.1 110.0 L346.9 113.4" stroke="#D9762B" strokeWidth="2.6" fill="none" />
                        <path d="M346.9 113.4 L390.8 104.7 L434.6 99.5 L478.5 94.3 L522.3 103.0 L566.2 108.2 L610.0 115.2" stroke="#D9762B" strokeWidth="2.2" strokeDasharray="4 5" fill="none" />
                        <circle cx="346.9" cy="113.4" r="5" fill="#D9762B" />
                        <text x="354.9" y="28" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#141A16">
                          {"Today 0.44"}
                        </text>
                        <text x="354.9" y="44" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"Forecast"}
                        </text>
                        <text x="40.0" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"26 Nov"}
                        </text>
                        <text x="83.8" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"27"}
                        </text>
                        <text x="127.7" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"28"}
                        </text>
                        <text x="171.5" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"29"}
                        </text>
                        <text x="215.4" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"30"}
                        </text>
                        <text x="259.2" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"1 Dec"}
                        </text>
                        <text x="303.1" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"2"}
                        </text>
                        <text x="346.9" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"3"}
                        </text>
                        <text x="390.8" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"4"}
                        </text>
                        <text x="434.6" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"5"}
                        </text>
                        <text x="478.5" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"6"}
                        </text>
                        <text x="522.3" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"7"}
                        </text>
                        <text x="566.2" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"8"}
                        </text>
                        <text x="610.0" y="212" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"9"}
                        </text>
                      </svg>
                      <span className="pq est">
                        {"Rust model on NASA POWER hourly humidity and temperature"}
                      </span>
                    </div>
                    <div className="chart">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Highest temperature, next 7 days"}
                      </b>
                      <svg style={{"maxWidth":"520px"} as any} viewBox="0 0 420 150" width="100%" role="img" aria-label="Highest temperature for the next 7 days, all under 32 degrees.">
                        <rect className="grow" style={{"--i":"0"} as any} x="10" y="46.4" width="40" height="81.6" rx="6" fill="#F2CF8A" />
                        <text x="30" y="40.4" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"24°"}
                        </text>
                        <text x="30" y="146" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"Thu"}
                        </text>
                        <rect className="grow" style={{"--i":"1"} as any} x="68" y="43.0" width="40" height="85.0" rx="6" fill="#F2CF8A" />
                        <text x="88" y="37.0" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"25°"}
                        </text>
                        <text x="88" y="146" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"Fri"}
                        </text>
                        <rect className="grow" style={{"--i":"2"} as any} x="126" y="49.8" width="40" height="78.2" rx="6" fill="#F2CF8A" />
                        <text x="146" y="43.8" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"23°"}
                        </text>
                        <text x="146" y="146" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"Sat"}
                        </text>
                        <rect className="grow" style={{"--i":"3"} as any} x="184" y="39.6" width="40" height="88.4" rx="6" fill="#F2CF8A" />
                        <text x="204" y="33.6" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"26°"}
                        </text>
                        <text x="204" y="146" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"Sun"}
                        </text>
                        <rect className="grow" style={{"--i":"4"} as any} x="242" y="36.2" width="40" height="91.8" rx="6" fill="#F2CF8A" />
                        <text x="262" y="30.2" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"27°"}
                        </text>
                        <text x="262" y="146" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"Mon"}
                        </text>
                        <rect className="grow" style={{"--i":"5"} as any} x="300" y="43.0" width="40" height="85.0" rx="6" fill="#F2CF8A" />
                        <text x="320" y="37.0" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"25°"}
                        </text>
                        <text x="320" y="146" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"Tue"}
                        </text>
                        <rect className="grow" style={{"--i":"6"} as any} x="358" y="46.4" width="40" height="81.6" rx="6" fill="#F2CF8A" />
                        <text x="378" y="40.4" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"24°"}
                        </text>
                        <text x="378" y="146" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"Wed"}
                        </text>
                        <line x1="0" x2="420" y1="19.2" y2="19.2" stroke="#C2412A" strokeDasharray="5 5" />
                        <text x="418" y="14.2" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#C2412A">
                          {"32° risk line"}
                        </text>
                      </svg>
                      <span className="pq sat">
                        {"NASA POWER forecast"}
                      </span>
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
    </>
  );
}
