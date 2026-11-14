'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// Generated from design/html/V11-States.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./States.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho, UserName, UserInitials, EngineerTab } from '@/lib/field';
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { LangSwitch } from '@/lib/i18n';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './States.logic';

export default function StatesScreen() {
  const { fp } = useField();
  const __v = useDC(Logic);
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
              <LangSwitch />
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
              <div className="col" style={{"gap":"6px"} as any}>
                <span className="eyebrow">
                  {"States every screen supports"}
                </span>
                <h1 className="h1">
                  {"Loading, empty, fallback"}
                </h1>
              </div>
            </div>
            <h2 className="h2" style={{"padding":"0 4px"} as any}>
              {"1. Skeleton while each source loads, named by source"}
            </h2>
            <div className="grid" style={{"gridTemplateColumns":"2fr 1fr 1fr 1fr"} as any}>
              <section className="card" style={{"minHeight":"220px","gap":"10px"} as any}>
                <i className="sk hold" aria-hidden="true" />
                <span className="row" style={{"position":"relative","zIndex":"5","marginTop":"auto","gap":"8px","fontSize":"12px","fontWeight":"600","color":"var(--muted)"} as any}>
                  <span className="typing">
                    <i />
                    <i />
                    <i />
                  </span>
                  {"Loading HLS image"}
                </span>
                <span className="vh">
                  {"Map"}
                </span>
              </section>
              <section className="card" style={{"minHeight":"220px","gap":"10px"} as any}>
                <i className="sk hold" aria-hidden="true" />
                <span className="row" style={{"position":"relative","zIndex":"5","marginTop":"auto","gap":"8px","fontSize":"12px","fontWeight":"600","color":"var(--muted)"} as any}>
                  <span className="typing">
                    <i />
                    <i />
                    <i />
                  </span>
                  {"Loading NASA POWER"}
                </span>
                <span className="vh">
                  {"Water"}
                </span>
              </section>
              <section className="card" style={{"minHeight":"220px","gap":"10px"} as any}>
                <i className="sk hold" aria-hidden="true" />
                <span className="row" style={{"position":"relative","zIndex":"5","marginTop":"auto","gap":"8px","fontSize":"12px","fontWeight":"600","color":"var(--muted)"} as any}>
                  <span className="typing">
                    <i />
                    <i />
                    <i />
                  </span>
                  {"Loading SMAP"}
                </span>
                <span className="vh">
                  {"Moisture"}
                </span>
              </section>
              <section className="card" style={{"minHeight":"220px","gap":"10px"} as any}>
                <i className="sk hold" aria-hidden="true" />
                <span className="row" style={{"position":"relative","zIndex":"5","marginTop":"auto","gap":"8px","fontSize":"12px","fontWeight":"600","color":"var(--muted)"} as any}>
                  <span className="typing">
                    <i />
                    <i />
                    <i />
                  </span>
                  {"Loading forecast"}
                </span>
                <span className="vh">
                  {"Forecast"}
                </span>
              </section>
            </div>
            <h2 className="h2" style={{"padding":"8px 4px 0"} as any}>
              {"2. Empty, fallback and stale"}
            </h2>
            <div className="grid" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))"} as any}>
              <section className="card rise " style={{"--d":"1"} as any}>
                <div className="row" style={{"gap":"12px"} as any}>
                  <svg aria-hidden="true" width="64" height="64" viewBox="0 0 60 60">
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
                  <div className="col" style={{"gap":"4px"} as any}>
                    <span className="tl">
                      {"First time"}
                    </span>
                    <h3 className="h3">
                      {"Draw your field to start"}
                    </h3>
                  </div>
                </div>
                <p className="body">
                  {"Bezra needs your field's shape to pull NASA data for it. Takes about 2 minutes."}
                </p>
                <Link href="/onboarding" className="btn cta press">
                  {"Draw my field"}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </Link>
              </section>
              <section className="card rise " style={{"--d":"2"} as any}>
                <div className="row" style={{"gap":"12px"} as any}>
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
                  <div className="col" style={{"gap":"4px"} as any}>
                    <span className="tl">
                      {"Source unavailable"}
                    </span>
                    <h3 className="h3">
                      {"Soil data is down, using a first guess"}
                    </h3>
                  </div>
                </div>
                <p style={{"fontSize":"15px","lineHeight":"1.7"} as any}>
                  <T en="Soil data is not available right now. We used an estimate until it&apos;s back." ar="بيانات التربة مش متاحة دلوقتي، استخدمنا تقدير لحد ما ترجع." />
                </p>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className="pill pv-est">
                    {"Estimated"}
                  </span>
                  <span className="lv lv-med">
                    <i />
                    {"Confidence drops to Medium"}
                  </span>
                </span>
              </section>
              <section className="card rise " style={{"--d":"3"} as any}>
                <div className="row" style={{"gap":"12px"} as any}>
                  <svg aria-hidden="true" width="64" height="64" viewBox="0 0 60 60">
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
                  <div className="col" style={{"gap":"4px"} as any}>
                    <span className="tl">
                      {"Stale data"}
                    </span>
                    <h3 className="h3">
                      {"No clear image for 9 days"}
                    </h3>
                  </div>
                </div>
                <p style={{"fontSize":"15px","lineHeight":"1.7"} as any}>
                  <T en="The satellite has not sent a new image yet because of clouds." ar="القمر الصناعي لسه مابعتش صورة جديدة بسبب السحاب." />
                </p>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className="pill">
                    {"Last image 5 Nov"}
                  </span>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                </span>
              </section>
            </div>
            <h2 className="h2" style={{"padding":"8px 4px 0"} as any}>
              {"3. Demo label on simulated data"}
            </h2>
            <div className="grid" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))"} as any}>
              <section className="card rise " style={{"--d":"4","boxShadow":"inset 0 0 0 1.5px #E2BE6A","background":"#FFFCF4"} as any}>
                <span className="tl">
                  {"Neighbour alert"}
                </span>
                <h3 className="h3">
                  {"Armyworm confirmed 1.4 km away"}
                </h3>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className="pill pv-demo">
                    {"Demo"}
                  </span>
                  <span className="pill">
                    {"Mesqa mode"}
                  </span>
                </span>
              </section>
              <section className="card rise " style={{"--d":"5"} as any}>
                <span className="tl">
                  {"Motion"}
                </span>
                <p className="body">
                  {"Cards rise in with a short blur, charts draw themselves, bars grow from the ground, the field grows in the simulator. All of it stops when the phone asks for less motion."}
                </p>
              </section>
              <section className="card rise " style={{"--d":"6"} as any}>
                <span className="tl">
                  {"Voice"}
                </span>
                <div className="row" style={{"gap":"10px"} as any}>
                  <svg aria-hidden="true" width="44" height="44" viewBox="0 0 60 60">
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
                  <span className="typing">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="sub">
                    {"Bezra is typing"}
                  </span>
                </div>
              </section>
            </div>
            <footer className="foot">
              <span>
                <T en="Bezra helps you think. It doesn&apos;t decide for you." ar="الأداة دي بتساعدك تفكر، مش بتقرر بدالك." />
              </span>
              <span>
                {"All numbers on this screen are demo data."}
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
