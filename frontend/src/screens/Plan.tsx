'use client';
/* eslint-disable */
// Generated from design/html/V11-Plan.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Plan.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho, UserName, UserInitials, EngineerTab } from '@/lib/field';
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Plan.logic';

export default function PlanScreen() {
  const { fp, id } = useField();
  const __v = useDC(Logic);
  // Engineer review status (step 6): GET /plans/{id}, set by the engineer's "Approve plan".
  const pl = useApi(`/plans/${id}`, undefined, true).data;
  const planOk = pl?.status === 'approved';
  const planDate = pl?.approved_at ? new Date(pl.approved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';
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
                  {"North plot, wheat, October 2026 to April 2027"}
                </span>
                <h1 className="h1">
                  {"Season plan"}
                </h1>
              </div>
              <div className="row rise" style={{"--d":"1","gap":"8px"} as any}>
                <button type="button" className="btn line press">
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                  </svg>
                  {"Add to phone calendar"}
                </button>
                <Link href="/sim" className="btn cta press">
                  {"Try it in the simulator"}
                  <span className="ar">
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
            <nav aria-label="North plot sections" className="tabs rise" style={{"--d":"0"} as any}>
              <Link href={fp("")}>
                {"Today"}
              </Link>
              <Link href={fp("/plan")} aria-current="page">
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
              <Link href={fp("/alerts")}>
                {"Alerts"}
              </Link>
            </nav>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 360px","alignItems":"start"} as any}>
              <div className="col" style={{"gap":"14px"} as any}>
                <section className="card rise dk" style={{"--d":"2","padding":"24px"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"2"} as any} />
                  <div className="row" style={{"gap":"14px","alignItems":"flex-start"} as any}>
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
                    <div className="col" style={{"gap":"8px","flex":"1"} as any}>
                      <span style={{"fontSize":"13px","color":"rgba(255,255,255,.7)"} as any}>
                        {"This season on North plot"}
                      </span>
                      <h2 style={{"fontSize":"26px","lineHeight":"1.2","fontWeight":"600","letterSpacing":"-.6px"} as any}>
                        {"3 risks this season: late heat "}
                        <span style={{"color":"var(--sun)"} as any}>
                          {"high"}
                        </span>
                        {", rust "}
                        <span style={{"color":"var(--sun)"} as any}>
                          {"medium"}
                        </span>
                        {", thirst at tillering "}
                        <span style={{"color":"var(--sun)"} as any}>
                          {"medium"}
                        </span>
                        {"."}
                      </h2>
                      <p style={{"fontSize":"15px","color":"rgba(255,255,255,.82)"} as any}>
                        {"If you follow this plan, you protect about "}
                        <b style={{"color":"#fff"} as any}>
                          {"14 to 22%"}
                        </b>
                        {" of your harvest from these risks."}
                      </p>
                    </div>
                  </div>
                </section>
                <ol style={{"position":"relative","margin":"0","padding":"0","display":"flex","flexDirection":"column","gap":"10px"} as any}>
                  <span aria-hidden="true" className="grow" style={{"position":"absolute","left":"12px","top":"20px","bottom":"40px","width":"2px","background":"#DADBD5","transformOrigin":"50% 0","--i":"0"} as any} />
                  <li className="rise" style={{"--d":"3","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"width":"26px","height":"26px","borderRadius":"13px","background":"var(--green)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center"} as any}>
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px","opacity":".72"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="lv lv-low">
                            <i />
                            {"Done"}
                          </span>
                          <span className="tl">
                            {"Chosen in September"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"Variety: Sakha 95"}
                        </h3>
                        <p className="sub">
                          {"Heat tolerant and rust resistant for the Delta."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"5 to 9%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-agro">
                          {"Agronomist"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: ARC list, Demo, to verify"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  <li className="rise" style={{"--d":"4","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"width":"26px","height":"26px","borderRadius":"13px","background":"var(--green)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center"} as any}>
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px","opacity":".72"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="lv lv-low">
                            <i />
                            {"Done"}
                          </span>
                          <span className="tl">
                            {"Sown 15 Oct"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"Sow by 15 October"}
                        </h3>
                        <p className="sub">
                          {"Early sowing moves grain fill before the April heat."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"10 to 15%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-est">
                          {"Estimated"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: Qalyubia sowing date trial"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  <li className="rise" style={{"--d":"5","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"width":"26px","height":"26px","borderRadius":"13px","background":"var(--green)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center"} as any}>
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px","opacity":".72"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"5"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="lv lv-low">
                            <i />
                            {"Done"}
                          </span>
                          <span className="tl">
                            {"3 Nov"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"First water after sowing"}
                        </h3>
                        <p className="sub">
                          {"Even germination across the field."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"2 to 4%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-farm">
                          {"Farmer"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: FAO-56"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  <li className="rise" style={{"--d":"6","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"position":"relative","width":"26px","height":"26px","borderRadius":"13px","background":"var(--sun)","boxShadow":"0 0 0 5px rgba(242,155,30,.22)"} as any} />
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px","boxShadow":"0 0 0 1.5px var(--sun), 0 10px 24px -16px rgba(242,155,30,.6)"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"6"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="lv lv-med">
                            <i />
                            {"Now"}
                          </span>
                          <span className="tl">
                            {"Thursday 19 Nov"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"Water turn, do not skip"}
                        </h3>
                        <p className="sub">
                          {"Tillering is the stage most hurt by thirst."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"8 to 12%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-est">
                          {"Estimated"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: North Delta irrigation study"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  <li className="rise" style={{"--d":"7","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"position":"relative","width":"26px","height":"26px","borderRadius":"13px","background":"var(--sun)","boxShadow":"0 0 0 5px rgba(242,155,30,.22)"} as any} />
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px","boxShadow":"0 0 0 1.5px var(--sun), 0 10px 24px -16px rgba(242,155,30,.6)"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"7"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="lv lv-med">
                            <i />
                            {"Now"}
                          </span>
                          <span className="tl">
                            {"14 Nov to 10 Dec"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"Keep the field free of weeds"}
                        </h3>
                        <p className="sub">
                          {"Critical weed free period. Weed before fertilizing."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"4 to 8%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-est">
                          {"Estimated"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: Crop GDD table"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  <li className="rise" style={{"--d":"8","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"width":"26px","height":"26px","boxSizing":"border-box","borderRadius":"13px","background":"#fff","border":"2px solid #CFCFC9"} as any} />
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"8"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="pill">
                            {"Coming"}
                          </span>
                          <span className="tl">
                            {"Around 5 Dec"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"Split nitrogen, second dose"}
                        </h3>
                        <p className="sub">
                          {"Timing only. Your engineer sets the amount."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"3 to 6%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-agro">
                          {"Agronomist"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: Engineer decides the dose"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  <li className="rise" style={{"--d":"9","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"width":"26px","height":"26px","boxSizing":"border-box","borderRadius":"13px","background":"#fff","border":"2px solid #CFCFC9"} as any} />
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"9"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="pill">
                            {"Coming"}
                          </span>
                          <span className="tl">
                            {"10 Jan to 28 Feb"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"Scout for yellow rust"}
                        </h3>
                        <p className="sub">
                          {"Cool, foggy weeks favour rust. Check leaves weekly."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"5 to 15%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-est">
                          {"Estimated"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: Rust weather index"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  <li className="rise" style={{"--d":"10","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"width":"26px","height":"26px","boxSizing":"border-box","borderRadius":"13px","background":"#fff","border":"2px solid #CFCFC9"} as any} />
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"10"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="pill">
                            {"Coming"}
                          </span>
                          <span className="tl">
                            {"If heat is forecast in April"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"Water before the heat"}
                        </h3>
                        <p className="sub">
                          {"A light turn 2 days before a heat wave cools the crop."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"6 to 10%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-est">
                          {"Estimated"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: Heat stress trial"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  <li className="rise" style={{"--d":"11","display":"grid","gridTemplateColumns":"26px minmax(0, 1fr)","gap":"16px","listStyle":"none"} as any}>
                    <span style={{"position":"relative","zIndex":"1","paddingTop":"18px"} as any}>
                      <span style={{"width":"26px","height":"26px","boxSizing":"border-box","borderRadius":"13px","background":"#fff","border":"2px solid #CFCFC9"} as any} />
                    </span>
                    <article className="card lift" style={{"flexDirection":"row","flexWrap":"wrap","alignItems":"center","gap":"12px 20px"} as any}>
                      <i className="sk " aria-hidden="true" style={{"--d":"11"} as any} />
                      <div className="col" style={{"flex":"2 1 260px","gap":"4px"} as any}>
                        <span className="row" style={{"gap":"8px"} as any}>
                          <span className="pill">
                            {"Coming"}
                          </span>
                          <span className="tl">
                            {"10 to 25 April"}
                          </span>
                        </span>
                        <h3 style={{"fontSize":"18px","fontWeight":"600","letterSpacing":"-.3px"} as any}>
                          {"Harvest window"}
                        </h3>
                        <p className="sub">
                          {"Harvest before the khamaseen winds."}
                        </p>
                      </div>
                      <div className="col" style={{"flex":"1 1 140px","gap":"2px"} as any}>
                        <span className="tl">
                          {"Protects"}
                        </span>
                        <b style={{"fontSize":"20px","fontWeight":"600"} as any}>
                          {"1 to 3%"}
                          <small className="unit">
                            {" of harvest"}
                          </small>
                        </b>
                      </div>
                      <div className="col" style={{"flex":"1 1 170px","gap":"6px"} as any}>
                        <span className="pill pv-est">
                          {"Estimated"}
                        </span>
                        {__v?.details ? (
                          <>
                            <span className="tl">
                              {"Source: Crop calendar"}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </article>
                  </li>
                </ol>
              </div>
              <aside className="col" style={{"gap":"14px","position":"sticky","top":"14px"} as any}>
                <section className="card rise " style={{"--d":"3"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                  <h2 className="h2">
                    {"Progress"}
                  </h2>
                  <div className="row" style={{"gap":"16px"} as any}>
                    <svg viewBox="0 0 120 120" width="112" height="112" role="img" aria-label="3 of 9 actions done">
                      <circle cx="60" cy="60" r="50" stroke="#EDEDE9" strokeWidth="12" fill="none" />
                      <circle className="draw" pathLength="1" cx="60" cy="60" r="50" stroke="#1F4A33" strokeWidth="12" fill="none" strokeLinecap="round" transform="rotate(-90 60 60)" style={{"strokeDasharray":".333 1","strokeDashoffset":".333","--d":"3"} as any} />
                      <text x="60" y="66" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="26" fontWeight="600" fill="#141A16">
                        {"3/9"}
                      </text>
                    </svg>
                    <div className="col" style={{"gap":"6px","flex":"1"} as any}>
                      <div className="inset">
                        <span>
                          {"Done"}
                        </span>
                        <b>
                          {"3"}
                        </b>
                      </div>
                      <div className="inset">
                        <span>
                          {"Now"}
                        </span>
                        <b>
                          {"2"}
                        </b>
                      </div>
                      <div className="inset">
                        <span>
                          {"Coming"}
                        </span>
                        <b>
                          {"4"}
                        </b>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="card rise " style={{"--d":"4"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                  <div className="row sp">
                    <h2 className="h2">
                      {"Engineer review"}
                    </h2>
                    <span className={planOk ? "lv lv-low" : "lv lv-med"}>
                      <i />
                      {planOk ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div style={{"position":"relative","padding":"16px","borderRadius":"10px","border":"1.5px dashed #C9CCC5","display":"flex","alignItems":"center","gap":"12px"} as any}>
                    <span className="av" style={{"background":"#DDEFE3","color":"#1E5B36"} as any}>
                      {"MA"}
                    </span>
                    <span className="col">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Eng. Mona Adel"}
                      </b>
                      <span className="tl">
                        {planOk ? `Approved your plan on ${planDate}` : "Will review doses and approve the plan"}
                      </span>
                    </span>
                  </div>
                  {__v?.details ? (
                    <>
                      <p className="sub">
                        {"When approved, a stamp with her name and date appears here and on the season report."}
                      </p>
                    </>
                  ) : null}
                  <Link href="/messages" className="btn soft cta press">
                    {"Ask Eng. Mona"}
                    <span className="ar">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </span>
                  </Link>
                </section>
                <section className="card rise tint-s" style={{"--d":"5"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"5"} as any} />
                  <div className="row" style={{"gap":"10px"} as any}>
                    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 60 60">
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
                    <p className="body" style={{"flex":"1"} as any}>
                      {"You won't see fertilizer or pesticide amounts here. "}
                      <b>
                        {"Your engineer decides them."}
                      </b>
                      {" Bezra only tells you when."}
                    </p>
                  </div>
                </section>
              </aside>
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
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
