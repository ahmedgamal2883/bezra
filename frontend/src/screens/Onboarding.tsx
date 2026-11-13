'use client';
/* eslint-disable */
// Generated from design/html/V11-Onboarding.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Onboarding.logic.js (verbatim from the design).
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Logic from './Onboarding.logic';

export default function OnboardingScreen() {
  const __v = useDC(Logic);
  return (
    <>
      <div className="root">
        <div className="shell">
          <header className="top">
            <span className="brand">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </span>
            <div className="row rise" style={{"--d":"0","gap":"12px","flex":"2","justifyContent":"center"} as any}>
              <span className="row" style={{"gap":"8px","fontSize":"14px","fontWeight":"600","color":"var(--ink)"} as any}>
                <span style={{"width":"26px","height":"26px","borderRadius":"13px","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"12px","background":"var(--green)","color":"#fff"} as any}>
                  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
                {"Your field"}
              </span>
              <span style={{"width":"40px","height":"2px","background":"#D7D8D2","borderRadius":"1px"} as any} />
              <span className="row" style={{"gap":"8px","fontSize":"14px","fontWeight":"600","color":"var(--ink)"} as any}>
                <span style={{"width":"26px","height":"26px","borderRadius":"13px","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"12px","background":"var(--dark)","color":"#fff"} as any}>
                  {"2"}
                </span>
                {"Basics"}
              </span>
              <span style={{"width":"40px","height":"2px","background":"#D7D8D2","borderRadius":"1px"} as any} />
              <span className="row" style={{"gap":"8px","fontSize":"14px","fontWeight":"600","color":"var(--muted)"} as any}>
                <span style={{"width":"26px","height":"26px","borderRadius":"13px","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"12px","background":"#fff"} as any}>
                  {"3"}
                </span>
                {"More accurate"}
              </span>
              <span style={{"width":"40px","height":"2px","background":"#D7D8D2","borderRadius":"1px"} as any} />
              <span className="row" style={{"gap":"8px","fontSize":"14px","fontWeight":"600","color":"var(--muted)"} as any}>
                <span style={{"width":"26px","height":"26px","borderRadius":"13px","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"12px","background":"#fff"} as any}>
                  {"4"}
                </span>
                {"Expert"}
              </span>
            </div>
            <div className="tools">
              <Link href="/field/north-plot" className="btn soft sm press">
                {"Skip for now"}
              </Link>
            </div>
          </header>
          <main className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 560px","alignItems":"stretch","minHeight":"760px"} as any}>
            <section className="hero rise" style={{"--d":"1","background":"#D9D6C8"} as any}>
              <i className="sk map" aria-hidden="true" style={{"--d":"1"} as any} />
              <svg viewBox="0 0 800 760" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{"position":"absolute","inset":"0"} as any} aria-label="Satellite map with your field drawn as a polygon" role="img">
                <rect x="0" y="0" width="180" height="300" fill="#8C9C5A" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="180" y="0" width="140" height="260" fill="#5A7A3C" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="320" y="0" width="240" height="200" fill="#B1A584" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="560" y="0" width="240" height="320" fill="#8FA05B" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="0" y="300" width="220" height="460" fill="#628342" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="220" y="260" width="120" height="500" fill="#B6AC8E" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="340" y="200" width="240" height="300" fill="#8C9C5A" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="580" y="320" width="220" height="440" fill="#4E6E36" stroke="#D8D1BA" strokeWidth="1" />
                <rect x="340" y="500" width="240" height="260" fill="#95A463" stroke="#D8D1BA" strokeWidth="1" />
                <path d="M0 640C200 610 420 700 800 650" stroke="#3B6E8F" strokeWidth="12" fill="none" />
                <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M360 220L560 210 572 480 352 492Z" fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
                <path d="M360 220L560 210 572 480 352 492Z" fill="#F29B1E" fillOpacity=".22" className="fade" style={{"--d":"5"} as any} />
                <circle className="pop" style={{"--i":"0"} as any} cx="360" cy="220" r="8" fill="#fff" stroke="#141A16" strokeWidth="2.5" />
                <circle className="pop" style={{"--i":"3"} as any} cx="560" cy="210" r="8" fill="#fff" stroke="#141A16" strokeWidth="2.5" />
                <circle className="pop" style={{"--i":"6"} as any} cx="572" cy="480" r="8" fill="#fff" stroke="#141A16" strokeWidth="2.5" />
                <circle className="pop" style={{"--i":"9"} as any} cx="352" cy="492" r="8" fill="#fff" stroke="#141A16" strokeWidth="2.5" />
              </svg>
              <div className="float" style={{"position":"absolute","left":"18px","top":"18px","right":"18px","height":"52px","padding":"0 8px 0 16px","display":"flex","alignItems":"center","gap":"10px"} as any}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />
                </svg>
                <span className="ar-t" style={{"flex":"1","fontSize":"15px","color":"var(--muted)"} as any}>
                  {"شبين الكوم، المنوفية"}
                </span>
                <button type="button" className="btn sm press">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
                  </svg>
                  {"Draw"}
                </button>
                <button type="button" className="btn soft sm press">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                  </svg>
                  {"Drop pin"}
                </button>
              </div>
              <div className="float rise" style={{"--d":"6","position":"absolute","left":"18px","bottom":"18px","padding":"14px 18px","display":"flex","gap":"22px"} as any}>
                <span className="col">
                  <span className="tl">
                    {"Area"}
                  </span>
                  <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                    {"2.4"}
                    <small className="unit">
                      {" feddan"}
                    </small>
                  </b>
                </span>
                <span className="col">
                  <span className="tl">
                    {"Same as"}
                  </span>
                  <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                    {"1.0"}
                    <small className="unit">
                      {" ha"}
                    </small>
                  </b>
                </span>
              </div>
            </section>
            <section className="col rise" style={{"--d":"2","gap":"18px","padding":"26px","borderRadius":"var(--r-hero)","background":"#fff"} as any}>
              <div className="row" style={{"gap":"12px","alignItems":"flex-start"} as any}>
                <svg aria-hidden="true" width="60" height="60" viewBox="0 0 60 60">
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
                <div className="col" style={{"gap":"6px","padding":"12px 16px","borderRadius":"6px 18px 18px 18px","background":"var(--inset)"} as any}>
                  <span className="ar-t" lang="ar" dir="rtl" style={{"fontSize":"18px","fontWeight":"600"} as any}>
                    {"قولي زرعت إيه؟"}
                  </span>
                  <span className="tl">
                    {"Level 1 of 3, about 2 minutes"}
                  </span>
                </div>
              </div>
              <div className="col" style={{"gap":"8px"} as any}>
                <span className="h2">
                  {"Crop this season"}
                </span>
                <div className="grid" style={{"gridTemplateColumns":"repeat(4, 1fr)","gap":"6px"} as any}>
                  {((__v?.crops) || []).map((c: any, i0: number) => (
                    <Fragment key={i0}>
                      <button type="button" className="press" onClick={c?.pick} aria-pressed={__s(c?.p) as any} style={__css(c?.style)}>
                        {__s(c?.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div className="grid" style={{"gridTemplateColumns":"1fr 1fr","gap":"10px"} as any}>
                <label className="col" style={{"gap":"6px"} as any}>
                  <span className="h2" style={{"fontSize":"14px"} as any}>
                    {"Sowing date"}
                  </span>
                  <span className="inset" style={{"height":"46px","fontSize":"15px"} as any}>
                    <b>
                      {"15 October"}
                    </b>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                    </svg>
                  </span>
                </label>
                <label className="col" style={{"gap":"6px"} as any}>
                  <span className="h2" style={{"fontSize":"14px"} as any}>
                    {"Last crop"}
                  </span>
                  <span className="inset" style={{"height":"46px","fontSize":"15px"} as any}>
                    <b>
                      {"Maize"}
                    </b>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" />
                    </svg>
                  </span>
                </label>
                <label className="col" style={{"gap":"6px"} as any}>
                  <span className="h2" style={{"fontSize":"14px"} as any}>
                    {"Water source"}
                  </span>
                  <span className="inset" style={{"height":"46px","fontSize":"15px"} as any}>
                    <b>
                      {"Canal, mesqa"}
                    </b>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                    </svg>
                  </span>
                </label>
                <label className="col" style={{"gap":"6px"} as any}>
                  <span className="h2" style={{"fontSize":"14px"} as any}>
                    {"Next turn"}
                  </span>
                  <span className="inset" style={{"height":"46px","fontSize":"15px"} as any}>
                    <b>
                      {"Thursday 19 Nov"}
                    </b>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                    </svg>
                  </span>
                </label>
              </div>
              <div className="col" style={{"gap":"8px"} as any}>
                <span className="h2" style={{"fontSize":"14px"} as any}>
                  {"You are"}
                </span>
                <div className="seg" style={{"alignSelf":"flex-start"} as any}>
                  <button type="button" className="segb">
                    {"Owner"}
                  </button>
                  <button type="button" className="segb on">
                    {"Tenant"}
                  </button>
                </div>
              </div>
              <div className="col" style={{"gap":"8px","padding":"14px","borderRadius":"12px","background":"var(--sun-tint)"} as any}>
                <div className="row sp">
                  <span className="ar-t" lang="ar" dir="rtl" style={{"fontSize":"15px","fontWeight":"600"} as any}>
                    {__s(__v?.accAr)}
                  </span>
                  <b>
                    {__s(__v?.acc)}
                    {"%"}
                  </b>
                </div>
                <span style={{"height":"8px","borderRadius":"4px","background":"rgba(255,255,255,.7)","overflow":"hidden"} as any}>
                  <span style={__css(__v?.accBar)} />
                </span>
                <span className="tl">
                  {"Accuracy grows with every answer"}
                </span>
              </div>
              <div className="row" style={{"gap":"8px","marginTop":"auto"} as any}>
                <button type="button" className="btn soft press">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m14.5 6-6 6 6 6" />
                  </svg>
                  {"Back"}
                </button>
                <Link href="/field/north-plot" className="btn cta press" style={{"flex":"1"} as any}>
                  {"Save and see my field"}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </Link>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
