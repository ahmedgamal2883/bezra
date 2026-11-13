'use client';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// Generated from design/html/V11-Plan.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Plan.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho, UserName, UserInitials, EngineerTab, EngName, useDemo } from '@/lib/field';
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { useApi } from '@/lib/api';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Plan.logic';
import PlanTracker, { progressOf } from '@/components/PlanTracker';
import { usePlan } from '@/components/PlanToday';

export default function PlanScreen() {
  const { fp, id, field } = useField();
  const demo = useDemo();
  const __v = useDC(Logic);
  // Engineer review status (step 6): GET /plans/{id}, set by the engineer's "Approve plan".
  const pl = useApi(`/plans/${id}`, undefined, true).data;
  const { plan } = usePlan(id); // U4: real plan + tracker
  const prog = progressOf(plan);
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
                  {field ? `${field.name}, ${field.crop.toLowerCase()}, this season` : "…"}
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
            <nav aria-label="Field sections" className="tabs rise" style={{"--d":"0"} as any}>
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
                      <span className="row wrap" style={{"gap":"10px","alignItems":"center"} as any}>
                        <span style={{"fontSize":"13px","color":"rgba(255,255,255,.7)"} as any}>
                          {"This season on " + (plan?.field_name || "your field")}
                        </span>
                        {plan ? <span className={plan.tracker.on_plan === plan.tracker.due ? "lv lv-low" : "lv lv-med"}><i />{plan.tracker.text}</span> : null}
                      </span>
                      {demo ? (<><h2 style={{"fontSize":"26px","lineHeight":"1.2","fontWeight":"600","letterSpacing":"-.6px"} as any}>
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
                      <span className="pill pv-demo" style={{"alignSelf":"flex-start"} as any}>{"Demo"}</span></>) : (<h2 style={{"fontSize":"26px","lineHeight":"1.2","fontWeight":"600","letterSpacing":"-.6px"} as any}>{plan ? plan.status.text : "…"}</h2>)}
                    </div>
                  </div>
                </section>
                <PlanTracker plan={plan} details={!!__v?.details} />
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
                      <circle className="draw" pathLength="1" cx="60" cy="60" r="50" stroke="#1F4A33" strokeWidth="12" fill="none" strokeLinecap="round" transform="rotate(-90 60 60)" style={{"strokeDasharray":`${prog.share} 1`,"strokeDashoffset":String(prog.share),"--d":"3"} as any} />
                      <text x="60" y="66" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="26" fontWeight="600" fill="#141A16">
                        {prog.total ? `${prog.done}/${prog.total}` : "…"}
                      </text>
                    </svg>
                    <div className="col" style={{"gap":"6px","flex":"1"} as any}>
                      <div className="inset">
                        <span>
                          {"Done"}
                        </span>
                        <b>
                          {prog.done}
                        </b>
                      </div>
                      <div className="inset">
                        <span>
                          {"Now"}
                        </span>
                        <b>
                          {prog.now}
                        </b>
                      </div>
                      <div className="inset">
                        <span>
                          {"Coming"}
                        </span>
                        <b>
                          {prog.coming}
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
                        <EngName full />
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
                    <>{"Ask "}<EngName /></>
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
