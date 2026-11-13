'use client';
/* eslint-disable */
// Generated from design/html/V11-Landing.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Landing.logic.js (verbatim from the design).
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Logic from './Landing.logic';

export default function LandingScreen() {
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
            <div className="tools">
              <div role="group" aria-label="Language" className="seg">
                <button type="button" className="segb on">
                  {"English"}
                </button>
                <button type="button" className="segb ar-t">
                  {"العربية"}
                </button>
              </div>
              <Link href="/field/north-plot" className="btn soft press">
                {"Sign in"}
              </Link>
            </div>
          </header>
          <main className="main" style={{"gap":"22px"} as any}>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, .9fr) minmax(0, 1.1fr)","alignItems":"stretch","gap":"18px"} as any}>
              <div className="col" style={{"gap":"22px","justifyContent":"center","padding":"10px 20px 10px 8px"} as any}>
                <span className="row rise" style={{"--d":"0","gap":"8px","fontSize":"14px","color":"var(--muted)"} as any}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                  </svg>
                  {"For farmers in Egypt. Built on NASA satellite data."}
                </span>
                <h1 className="rise" style={{"--d":"1","fontSize":"68px","lineHeight":"1","fontWeight":"600","letterSpacing":"-2.6px"} as any}>
                  {"Try your season before you plant it."}
                </h1>
                <p className="ar-t rise" lang="ar" dir="rtl" style={{"--d":"2","alignSelf":"flex-start","fontSize":"26px","fontWeight":"600","color":"var(--ink2)"} as any}>
                  {"جرّب موسمك قبل ما تزرعه"}
                </p>
                <p className="rise" style={{"--d":"3","fontSize":"18px","lineHeight":"1.55","color":"var(--ink2)","maxWidth":"520px"} as any}>
                  {"Bezra shows your real field from space. Then you test sowing dates, water and varieties, and watch the result grow month by month, before you spend a pound."}
                </p>
                <div className="row rise" style={{"--d":"4","gap":"10px"} as any}>
                  <Link href="/onboarding" className="btn cta press" style={{"height":"54px","borderRadius":"27px","fontSize":"16px","padding":"0 7px 0 22px","gap":"14px"} as any}>
                    {"Add my field"}
                    <span className="ar">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </Link>
                  <Link href="/engineer" className="btn line press" style={{"height":"54px","borderRadius":"27px","fontSize":"16px"} as any}>
                    {"I'm an agricultural engineer"}
                  </Link>
                </div>
              </div>
              <section className="hero rise" style={{"--d":"2","height":"620px","background":"#CFC9B6"} as any} aria-label="A field in the simulator">
                {" "}
                <svg role="img" aria-label={__s(__v?.sceneLabel) as any} viewBox="0 0 1000 640" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{"position":"absolute","inset":"0"} as any}>
                  {" "}
                  <defs>
                    <radialGradient id="haze" cx=".5" cy=".55" r=".6">
                      <stop offset="0" stopColor="#F29B1E" stopOpacity=".38" />
                      <stop offset="1" stopColor="#F29B1E" stopOpacity="0" />
                    </radialGradient>
                    {" "}
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#F4F4F1" stopOpacity=".9" />
                      <stop offset=".35" stopColor="#F4F4F1" stopOpacity="0" />
                    </linearGradient>
                    {" "}
                    <filter id="gr" x="0" y="0" width="100%" height="100%">
                      <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" />
                      <feColorMatrix type="saturate" values="0" />
                      <feComponentTransfer>
                        <feFuncA type="table" tableValues="0 .45" />
                      </feComponentTransfer>
                    </filter>
                  </defs>
                  {" "}
                  <rect width="1000" height="640" fill="#CFC9B6" />
                  {" "}
                  <g stroke="#D9D2BC" strokeWidth=".8">
                    {((__v?.sc?.ground) || []).map((g: any, i0: number) => (
                      <Fragment key={i0}>
                        <polygon points={__s(g?.pts) as any} fill={__s(g?.fill) as any} />
                      </Fragment>
                    ))}
                  </g>
                  {" "}
                  <polygon points={__s(__v?.sc?.road) as any} fill="#DDD6C2" />
                  <polygon points={__s(__v?.sc?.canal) as any} fill="#3B6E8F" />
                  {" "}
                  <rect width="1000" height="640" filter="url(#gr)" opacity=".16" style={{"mixBlendMode":"multiply"} as any} />
                  {" "}
                  <polygon points={__s(__v?.sc?.edgeR) as any} fill="#5B4632" />
                  <polygon points={__s(__v?.sc?.edgeF) as any} fill="#4A3828" />
                  <polygon points={__s(__v?.sc?.soil) as any} fill="#8A6E4E" />
                  {" "}
                  {__v?.wetOn ? (
                    <>
                      <polygon points={__s(__v?.sc?.wet) as any} fill="#5FA6D6" opacity=".55" className="fade" />
                    </>
                  ) : null}
                  {" "}
                  <g className="fade" style={{"--d":"2"} as any}>
                    {((__v?.sc?.prisms) || []).map((p: any, i1: number) => (
                      <Fragment key={i1}>
                        <polygon points={__s(p?.r) as any} fill={__s(p?.cr) as any} />
                        <polygon points={__s(p?.f) as any} fill={__s(p?.cf) as any} />
                        <polygon points={__s(p?.top) as any} fill={__s(p?.c) as any} stroke="rgba(255,255,255,.18)" strokeWidth=".6" />
                        <path d={__s(p?.rows) as any} stroke="#1A2414" strokeOpacity=".22" strokeWidth="1" />
                      </Fragment>
                    ))}
                  </g>
                  {" "}
                  {__v?.rustOn ? (
                    <>
                      {((__v?.rustDots) || []).map((r: any, i2: number) => (
                        <Fragment key={i2}>
                          <circle cx={__s(r?.rx) as any} cy={__s(r?.ry) as any} r="5" fill="#D9762B" stroke="#fff" strokeWidth="1.5" className="pop" />
                        </Fragment>
                      ))}
                    </>
                  ) : null}
                  {" "}
                  {__v?.hazeOn ? (
                    <>
                      <rect width="1000" height="640" fill="url(#haze)" className="fade" />
                    </>
                  ) : null}
                  {" "}
                  <rect width="1000" height="640" fill="url(#sky)" />
                  {" "}
                </svg>
                {" "}
                <span className="float pop" style={{"--i":"6","position":"absolute","left":"22px","top":"22px","height":"40px","padding":"0 14px","borderRadius":"20px","display":"flex","alignItems":"center","gap":"8px","fontSize":"14px","fontWeight":"600"} as any}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                  </svg>
                  {"Sown 25 Oct, now 3 months later"}
                </span>
                <div className="float pop" style={{"--i":"9","position":"absolute","right":"22px","top":"22px","padding":"14px 16px","display":"flex","gap":"12px","alignItems":"center"} as any}>
                  <svg aria-hidden="true" width="46" height="46" viewBox="0 0 60 60">
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
                  <span className="col">
                    <span className="tl">
                      {"Expected harvest"}
                    </span>
                    <b style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.8px"} as any}>
                      {"97%"}
                    </b>
                  </span>
                </div>
                <div className="float pop" style={{"--i":"12","position":"absolute","right":"22px","bottom":"22px","padding":"12px 16px","display":"flex","gap":"18px"} as any}>
                  <span className="col">
                    <span className="tl">
                      {"Water per feddan"}
                    </span>
                    <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                      {"3,150 m³"}
                    </b>
                  </span>
                  <span className="col">
                    <span className="tl">
                      {"Hot days at grain fill"}
                    </span>
                    <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                      {"0"}
                    </b>
                  </span>
                </div>
                <span className="pill pv-demo" style={{"position":"absolute","left":"22px","bottom":"22px"} as any}>
                  {"Demo field"}
                </span>
              </section>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))"} as any}>
              <section className="card rise " style={{"--d":"5","gap":"10px","padding":"22px"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"5"} as any} />
                <span className="chip g" style={{"width":"40px","height":"40px","borderRadius":"12px"} as any}>
                  <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3 3 7.5l9 4.5 9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
                  </svg>
                </span>
                <h3 style={{"fontSize":"19px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                  {"See your field from space"}
                </h3>
                <p className="sub">
                  {"NASA satellites show how green, how dry and how hot your field is, square by square."}
                </p>
              </section>
              <section className="card rise " style={{"--d":"6","gap":"10px","padding":"22px"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"6"} as any} />
                <span className="chip w" style={{"width":"40px","height":"40px","borderRadius":"12px"} as any}>
                  <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" />
                  </svg>
                </span>
                <h3 style={{"fontSize":"19px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                  {"Know what to do this week"}
                </h3>
                <p className="sub">
                  {"One clear action a day: when to water, when to check for rust, when the heat comes."}
                </p>
              </section>
              <section className="card rise " style={{"--d":"7","gap":"10px","padding":"22px"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"7"} as any} />
                <span className="chip s" style={{"width":"40px","height":"40px","borderRadius":"12px"} as any}>
                  <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v2M18 4v4M6 20v-2M3 7l3-3 3 3M15 7l3-3 3 3" />
                  </svg>
                </span>
                <h3 style={{"fontSize":"19px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                  {"Test before you decide"}
                </h3>
                <p className="sub">
                  {"Change the sowing date, the water or the variety and watch your field grow to harvest."}
                </p>
              </section>
            </div>
            <footer className="foot">
              <span>
                <span lang="ar" dir="rtl" className="ar-t">
                  {"الأداة دي بتساعدك تفكر، مش بتقرر بدالك."}
                </span>
                {" Bezra helps you think. It doesn't decide for you."}
              </span>
              <span>
                {"All numbers on this screen are demo data."}
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
