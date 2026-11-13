'use client';
/* eslint-disable */
// Generated from design/html/V11-Next.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Next.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho } from '@/lib/field';
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Next.logic';

export default function NextScreen() {
  const { fp, id } = useField();
  const nx = useApi(`/fields/${id}/next`);
  const __v = useDC(Logic, { data: nx.data, loading: nx.loading, fieldId: id });
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
            </nav>
            <div className="tools">
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
                  {"HF"}
                </span>
                <span>
                  <b>
                    {"Hassan Farouk"}
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
                  {"What to grow and when, for the season after this one"}
                </span>
                <h1 className="h1">
                  {"Next season"}
                </h1>
              </div>
              <Link href="/sim" className="btn cta press rise" style={{"--d":"1"} as any}>
                {"Try it in the simulator"}
                <span className="ar">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </Link>
            </div>
            <nav aria-label="North plot sections" className="tabs rise" style={{"--d":"0"} as any}>
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
              <Link href={fp("/next")} aria-current="page">
                {"Next season"}
              </Link>
              <Link href={fp("/alerts")}>
                {"Alerts"}
              </Link>
            </nav>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1.3fr) minmax(0, 1fr)","alignItems":"stretch"} as any}>
              <section className="card rise " style={{"--d":"2","padding":"24px","gap":"16px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"2"} as any} />
                <div className="row sp">
                  <span className="tl">
                    {"Hot days (over 32 °C) in March and April at your field"}
                  </span>
                  <span className="row" style={{"gap":"4px"} as any}>
                    <span className={__v.N.srcSat}>
                      {__v.N.srcSatL}
                    </span>
                    <span className="pill pv-est">
                      {__v.N.src40L}
                    </span>
                  </span>
                </div>
                <h2 style={{"fontSize":"32px","lineHeight":"1.1","fontWeight":"600","letterSpacing":"-1px"} as any}>
                  {"Your springs are getting hotter"}
                </h2>
                <div className="row" style={{"alignItems":"flex-end","gap":"16px","height":"200px","paddingTop":"10px"} as any}>
                  <div className="col" style={{"flex":"1","alignItems":"center","gap":"6px"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.N.bars[0].v}
                    </b>
                    <span className="grow" style={{"--i":"0","width":"100%","maxWidth":"64px","height":__v.N.barH[0],"borderRadius":"8px","background":"#E3D3B4"} as any} />
                    <span className="tl">
                      {__v.N.bars[0].l}
                    </span>
                  </div>
                  <div className="col" style={{"flex":"1","alignItems":"center","gap":"6px"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.N.bars[1].v}
                    </b>
                    <span className="grow" style={{"--i":"4","width":"100%","maxWidth":"64px","height":__v.N.barH[1],"borderRadius":"8px","background":"#E3D3B4"} as any} />
                    <span className="tl">
                      {__v.N.bars[1].l}
                    </span>
                  </div>
                  <div className="col" style={{"flex":"1","alignItems":"center","gap":"6px"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.N.bars[2].v}
                    </b>
                    <span className="grow" style={{"--i":"8","width":"100%","maxWidth":"64px","height":__v.N.barH[2],"borderRadius":"8px","background":"#E3D3B4"} as any} />
                    <span className="tl">
                      {__v.N.bars[2].l}
                    </span>
                  </div>
                  <div className="col" style={{"flex":"1","alignItems":"center","gap":"6px"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.N.bars[3].v}
                    </b>
                    <span className="grow" style={{"--i":"12","width":"100%","maxWidth":"64px","height":__v.N.barH[3],"borderRadius":"8px","background":"#F29B1E"} as any} />
                    <span className="tl">
                      {__v.N.bars[3].l}
                    </span>
                  </div>
                  <div className="col" style={{"flex":"1","alignItems":"center","gap":"6px"} as any}>
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {__v.N.bars[4].v}
                    </b>
                    <span className="grow" style={{"--i":"16","width":"100%","maxWidth":"64px","height":__v.N.barH[4],"borderRadius":"8px","background":"repeating-linear-gradient(180deg,#F29B1E 0 6px,#FBD9A6 6px 10px)"} as any} />
                    <span className="tl">
                      {__v.N.bars[4].l}
                    </span>
                  </div>
                </div>
                <p className="body" style={{"fontSize":"16px"} as any}>
                  {"Wheat fills its grain in those weeks, and heat makes the grain smaller. Sowing earlier moves grain filling before the worst heat."}
                </p>
              </section>
              <section className="card rise " style={{"--d":"3","padding":"24px","gap":"16px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"3"} as any} />
                <div className="row" style={{"gap":"12px"} as any}>
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
                      <path d="M26 38h8" stroke="#3A2A10" strokeWidth="2.2" strokeLinecap="round" />
                      <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                    </g>
                  </svg>
                  <div className="col" style={{"gap":"2px"} as any}>
                    <span className="tl">
                      {"So for wheat next season"}
                    </span>
                    <h2 className="h3">
                      {__v.N.headline}
                    </h2>
                  </div>
                </div>
                <div className="col" style={{"gap":"8px"} as any}>
                  <div className="col" style={{"gap":"4px"} as any}>
                    <div className="row sp tl">
                      <span>
                        {"Best time in the 1990s"}
                      </span>
                      <b style={{"color":"var(--ink)"} as any}>
                        {__v.N.w90}
                      </b>
                    </div>
                    <div style={{"position":"relative","height":"12px","borderRadius":"6px","background":"var(--inset)"} as any}>
                      <span className="growx" style={{"--i":"0","position":"absolute","top":"0","bottom":"0","left":__v.N.pos90[0],"width":__v.N.pos90[1],"borderRadius":"6px","background":"#C9CCC5"} as any} />
                    </div>
                  </div>
                  <div className="col" style={{"gap":"4px"} as any}>
                    <div className="row sp tl">
                      <span>
                        {"Best time today"}
                      </span>
                      <b style={{"color":"var(--ink)"} as any}>
                        {__v.N.wToday}
                      </b>
                    </div>
                    <div style={{"position":"relative","height":"12px","borderRadius":"6px","background":"var(--inset)"} as any}>
                      <span className="growx" style={{"--i":"1","position":"absolute","top":"0","bottom":"0","left":__v.N.posToday[0],"width":__v.N.posToday[1],"borderRadius":"6px","background":"#3E8F4E"} as any} />
                    </div>
                  </div>
                  <div className="col" style={{"gap":"4px"} as any}>
                    <div className="row sp tl">
                      <span>
                        {"Best time around 2040"}
                      </span>
                      <b style={{"color":"var(--ink)"} as any}>
                        {__v.N.w40}
                      </b>
                    </div>
                    <div style={{"position":"relative","height":"12px","borderRadius":"6px","background":"var(--inset)"} as any}>
                      <span className="growx" style={{"--i":"2","position":"absolute","top":"0","bottom":"0","left":__v.N.pos40[0],"width":__v.N.pos40[1],"borderRadius":"6px","background":"#E9C25A"} as any} />
                    </div>
                  </div>
                  <div className="row tl sp" style={{"paddingTop":"2px"} as any}>
                    <span>
                      {"Oct"}
                    </span>
                    <span>
                      {"Nov"}
                    </span>
                    <span>
                      {"Dec"}
                    </span>
                  </div>
                </div>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className="pill pv-est">
                    {"Estimated"}
                  </span>
                  {__v.N.live ? null : <span className="pill pv-demo">
                    {"Demo"}
                  </span>}
                </span>
              </section>
            </div>
            <div className="row sp rise" style={{"--d":"5","padding":"6px 4px 0"} as any}>
              <h2 style={{"fontSize":"24px","fontWeight":"600","letterSpacing":"-.6px"} as any}>
                {"Farms that already have your future weather"}
              </h2>
              <span className="tl">
                {"Learn from what works there"}
              </span>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))"} as any}>
              <section className="card rise lift" style={{"--d":"6","gap":"10px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"6"} as any} />
                <div className="row sp">
                  <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                    {__v.N.twins[0]?.[0]}
                  </b>
                  <span className="pill">
                    {__v.N.twins[0]?.[1]}
                  </span>
                </div>
                <p className="body">
                  <b style={{"color":"var(--ink)"} as any}>
                    {"What they do:"}
                  </b>
                  {__v.N.twins[0]?.[2]}
                </p>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className="pill pv-demo">
                    {"Demo, to verify"}
                  </span>
                </span>
              </section>
              <section className="card rise lift" style={{"--d":"7","gap":"10px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"7"} as any} />
                <div className="row sp">
                  <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                    {__v.N.twins[1]?.[0]}
                  </b>
                  <span className="pill">
                    {__v.N.twins[1]?.[1]}
                  </span>
                </div>
                <p className="body">
                  <b style={{"color":"var(--ink)"} as any}>
                    {"What they do:"}
                  </b>
                  {__v.N.twins[1]?.[2]}
                </p>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className="pill pv-demo">
                    {"Demo, to verify"}
                  </span>
                </span>
              </section>
              <section className="card rise lift" style={{"--d":"8","gap":"10px"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"8"} as any} />
                <div className="row sp">
                  <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                    {__v.N.twins[2]?.[0]}
                  </b>
                  <span className="pill">
                    {__v.N.twins[2]?.[1]}
                  </span>
                </div>
                <p className="body">
                  <b style={{"color":"var(--ink)"} as any}>
                    {"What they do:"}
                  </b>
                  {__v.N.twins[2]?.[2]}
                </p>
                <span className="row" style={{"gap":"4px"} as any}>
                  <span className="pill pv-demo">
                    {"Demo, to verify"}
                  </span>
                </span>
              </section>
            </div>
            <div className="row sp rise" style={{"--d":"9","padding":"6px 4px 0"} as any}>
              <h2 style={{"fontSize":"24px","fontWeight":"600","letterSpacing":"-.6px"} as any}>
                {"Three ways to plan the next 3 years"}
              </h2>
              <span className="pill pv-est">
                {"Estimated"}
              </span>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))"} as any}>
              <section className="card rise " style={{"--d":"10"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"10"} as any} />
                <div className="row sp">
                  <span className="row" style={{"gap":"10px"} as any}>
                    <span style={{"width":"34px","height":"34px","borderRadius":"10px","background":"var(--inset)","color":"var(--ink)","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700"} as any}>
                      {"A"}
                    </span>
                    <span className="col">
                      <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                        {"Keep what you grow"}
                      </b>
                      <span className="tl">
                        {"Wheat, then maize"}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="inset">
                  <span>
                    {"Water need"}
                  </span>
                  <b>
                    {"High"}
                  </b>
                </div>
                <p className="sub">
                  {"Works well today. Harvest drops as springs get hotter."}
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
              <section className="card rise " style={{"--d":"11","boxShadow":"0 0 0 2px var(--dark)"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"11"} as any} />
                <div className="row sp">
                  <span className="row" style={{"gap":"10px"} as any}>
                    <span style={{"width":"34px","height":"34px","borderRadius":"10px","background":"var(--dark)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700"} as any}>
                      {"B"}
                    </span>
                    <span className="col">
                      <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                        {"Earlier wheat, lighter summer"}
                      </b>
                      <span className="tl">
                        {"Early wheat, then sorghum"}
                      </span>
                    </span>
                  </span>
                  <span className="lv lv-low">
                    <i />
                    {"Our pick"}
                  </span>
                </div>
                <div className="inset">
                  <span>
                    {"Water need"}
                  </span>
                  <b>
                    {"Medium"}
                  </b>
                </div>
                <p className="sub">
                  {"About 18% less water. Holds up best in hotter years."}
                </p>
                <Link href="/sim" className="btn  cta press">
                  {"Try it in the simulator"}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </Link>
              </section>
              <section className="card rise " style={{"--d":"12"} as any}>
                <i className={__v.sk} aria-hidden="true" style={{"--d":"12"} as any} />
                <div className="row sp">
                  <span className="row" style={{"gap":"10px"} as any}>
                    <span style={{"width":"34px","height":"34px","borderRadius":"10px","background":"var(--inset)","color":"var(--ink)","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700"} as any}>
                      {"C"}
                    </span>
                    <span className="col">
                      <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                        {"Feed the soil"}
                      </b>
                      <span className="tl">
                        {"Berseem, then wheat, then maize"}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="inset">
                  <span>
                    {"Water need"}
                  </span>
                  <b>
                    {"Medium"}
                  </b>
                </div>
                <p className="sub">
                  {"Berseem adds nitrogen for the wheat after it."}
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
            </div>
            <footer className="foot">
              <span>
                <span lang="ar" dir="rtl" className="ar-t">
                  {"الأداة دي بتساعدك تفكر، مش بتقرر بدالك."}
                </span>
                {" Bezra helps you think. It doesn't decide for you."}
              </span>
              <span>
                {__v.N.foot}
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
