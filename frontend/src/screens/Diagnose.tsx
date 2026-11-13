'use client';
/* eslint-disable */
// Generated from design/html/V11-Diagnose.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Diagnose.logic.js (verbatim from the design).
import { Fragment, useEffect, useState } from 'react';
import { useApi, API } from '@/lib/api';
import { FIELD_NAMES, UserName, UserInitials, EngineerTab, EngName } from '@/lib/field';
import { useField, FieldWho } from '@/lib/field';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Diagnose.logic';

// Safe steps when Bezra could not diagnose the photo (no doses, the engineer decides).
const GENERAL = [
  { title: 'Look closely', text: 'Check 20 plants in 5 spots: top and bottom of the leaves, stems and roots.' },
  { title: 'Mildest option first', text: 'Ask Eng. Mona about a hand, water or soil fix before anything else.' },
  { title: 'Check the threshold', text: 'Your engineer tells you how many plants must be hit before you act.' },
  { title: 'Only from the official list', text: 'If a product is needed, your engineer picks it and sets the dose.' },
];

export default function DiagnoseScreen() {
  const { fp, id } = useField();
  const __v = useDC(Logic);
  // The farmer's own case (?case=ID from "Take a photo"); without it the design's example stays (step 6).
  const [cid, setCid] = useState<string | null>(null);
  useEffect(() => { setCid(new URLSearchParams(window.location.search).get('case')); }, []);
  const C: any = useApi(cid ? `/cases/${cid}?field_id=${id}` : null, undefined, true).data;
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const cdate = C ? fmt(C.created) : '';
  const due = C ? fmt(C.follow_up.due) : '';
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
                  {C ? `Your case: ${FIELD_NAMES[C.field_id] || C.field_id}, ${cdate}.` : "Example case: South plot maize, July. Demo."}
                </span>
                <h1 className="h1">
                  {"Check a problem"}
                </h1>
              </div>
              <div className="row rise" style={{"--d":"1","gap":"4px","padding":"4px","borderRadius":"999px","background":"#E9E9E5"} as any}>
                <button type="button" onClick={__v?.st0?.pick} aria-pressed={__s(__v?.st0?.p) as any} className="press" style={__css(__v?.st0?.style)}>
                  <span style={__css(__v?.st0?.dot)}>
                    {"1"}
                  </span>
                  {"Predicted"}
                </button>
                <button type="button" onClick={__v?.st1?.pick} aria-pressed={__s(__v?.st1?.p) as any} className="press" style={__css(__v?.st1?.style)}>
                  <span style={__css(__v?.st1?.dot)}>
                    {"2"}
                  </span>
                  {"Confirm"}
                </button>
                <button type="button" onClick={__v?.st2?.pick} aria-pressed={__s(__v?.st2?.p) as any} className="press" style={__css(__v?.st2?.style)}>
                  <span style={__css(__v?.st2?.dot)}>
                    {"3"}
                  </span>
                  {"Treat"}
                </button>
                <button type="button" onClick={__v?.st3?.pick} aria-pressed={__s(__v?.st3?.p) as any} className="press" style={__css(__v?.st3?.style)}>
                  <span style={__css(__v?.st3?.dot)}>
                    {"4"}
                  </span>
                  {"Follow up"}
                </button>
              </div>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","alignItems":"start"} as any}>
              <section className="card rise " style={{"--d":"2"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"2"} as any} />
                <div className="row sp">
                  <h2 className="h2">
                    {"Your photos"}
                  </h2>
                  <span className="tl">
                    {C ? `${C.photos} photo${C.photos > 1 ? "s" : ""}, ${C.where.toLowerCase()}${C.seen ? ", you saw: " + C.seen.toLowerCase() : ""}` : "Maize whorl, from above, as Bezra asked"}
                  </span>
                </div>
                <div className="grid" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))","gap":"8px"} as any}>
                  {C ? Array.from({ length: C.photos }).map((_, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={`${API}/cases/${C.id}/photo/${i}`} alt={`Your photo ${i + 1}`} style={{ display: "block", width: "100%", aspectRatio: "260 / 180", objectFit: "cover", borderRadius: "10px" }} />
                  )) : (<>
                  <svg viewBox="0 0 260 180" width="100%" style={{"display":"block","borderRadius":"10px"} as any} aria-hidden="true">
                    <rect width="260" height="180" fill="#C9D6A8" />
                    <path d="M-10 160C60 120 120 60 270 20L270 60C140 90 80 140 20 190Z" fill="#7FA650" />
                    <path d="M-10 160C60 120 120 60 270 20" stroke="#9BC06A" strokeWidth="3" fill="none" />
                    <ellipse cx="60" cy="40" rx="6" ry="4" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="113" cy="81" rx="7" ry="5" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="166" cy="122" rx="8" ry="6" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="79" cy="73" rx="9" ry="4" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="132" cy="114" rx="6" ry="5" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="185" cy="65" rx="7" ry="6" fill="#3A5A2A" opacity=".55" />
                    <path d="M30 120C90 110 160 80 230 40" stroke="#5D8238" strokeWidth="2" fill="none" opacity=".5" />
                  </svg>
                  <svg viewBox="0 0 260 180" width="100%" style={{"display":"block","borderRadius":"10px"} as any} aria-hidden="true">
                    <rect width="260" height="180" fill="#B8C995" />
                    <path d="M-10 160C60 120 120 60 270 20L270 60C140 90 80 140 20 190Z" fill="#7FA650" />
                    <path d="M-10 160C60 120 120 60 270 20" stroke="#9BC06A" strokeWidth="3" fill="none" />
                    <ellipse cx="97" cy="69" rx="6" ry="4" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="150" cy="110" rx="7" ry="5" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="63" cy="61" rx="8" ry="6" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="116" cy="102" rx="9" ry="4" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="169" cy="53" rx="6" ry="5" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="82" cy="94" rx="7" ry="6" fill="#3A5A2A" opacity=".55" />
                    <path d="M30 120C90 110 160 80 230 40" stroke="#5D8238" strokeWidth="2" fill="none" opacity=".5" />
                  </svg>
                  <svg viewBox="0 0 260 180" width="100%" style={{"display":"block","borderRadius":"10px"} as any} aria-hidden="true">
                    <rect width="260" height="180" fill="#D2DCB5" />
                    <path d="M-10 160C60 120 120 60 270 20L270 60C140 90 80 140 20 190Z" fill="#7FA650" />
                    <path d="M-10 160C60 120 120 60 270 20" stroke="#9BC06A" strokeWidth="3" fill="none" />
                    <ellipse cx="134" cy="98" rx="6" ry="4" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="187" cy="49" rx="7" ry="5" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="100" cy="90" rx="8" ry="6" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="153" cy="41" rx="9" ry="4" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="66" cy="82" rx="6" ry="5" fill="#3A5A2A" opacity=".55" />
                    <ellipse cx="119" cy="123" rx="7" ry="6" fill="#3A5A2A" opacity=".55" />
                    <path d="M30 120C90 110 160 80 230 40" stroke="#5D8238" strokeWidth="2" fill="none" opacity=".5" />
                  </svg>
                </>)}
                </div>
                <div className="inset" style={{"justifyContent":"flex-start","gap":"10px"} as any}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                  </svg>
                  <span>
                    {C?.photo_tip || "Tip: photograph the whorl of a plant from the weak patch, in daylight."}
                  </span>
                </div>
                <h2 className="h2" style={{"marginTop":"6px"} as any}>
                  {"What it might be"}
                </h2>
                {C ? (C.candidates.length ? C.candidates.map((x: any, i: number) => (
                <div key={i} className="col" style={{"gap":"6px"} as any}>
                  <div className="row sp">
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>{x.name}</b>
                    <span style={{"fontSize":"14px","fontWeight":"600"} as any}>{x.pct + "%"}</span>
                  </div>
                  <span style={{"height":"8px","borderRadius":"4px","background":"var(--inset)"} as any}>
                    <span className="growx" style={{"--i":String(i),"display":"block","height":"100%","width":x.pct + "%","borderRadius":"4px","background":["var(--risk)","#9EA39C","#C9CCC5"][i] || "#C9CCC5"} as any} />
                  </span>
                </div>
                )) : (
                <p className="body"><>{"Bezra could not check this photo itself. It went to "}<EngName />{", who will look and reply."}</></p>
                )) : (<>
                <div className="col" style={{"gap":"6px"} as any}>
                  <div className="row sp">
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {"Fall armyworm"}
                    </b>
                    <span style={{"fontSize":"14px","fontWeight":"600"} as any}>
                      {"82%"}
                    </span>
                  </div>
                  <span style={{"height":"8px","borderRadius":"4px","background":"var(--inset)"} as any}>
                    <span className="growx" style={{"--i":"0","display":"block","height":"100%","width":"82%","borderRadius":"4px","background":"var(--risk)"} as any} />
                  </span>
                </div>
                <div className="col" style={{"gap":"6px"} as any}>
                  <div className="row sp">
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {"Stem borer"}
                    </b>
                    <span style={{"fontSize":"14px","fontWeight":"600"} as any}>
                      {"11%"}
                    </span>
                  </div>
                  <span style={{"height":"8px","borderRadius":"4px","background":"var(--inset)"} as any}>
                    <span className="growx" style={{"--i":"1","display":"block","height":"100%","width":"11%","borderRadius":"4px","background":"#9EA39C"} as any} />
                  </span>
                </div>
                <div className="col" style={{"gap":"6px"} as any}>
                  <div className="row sp">
                    <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                      {"Nitrogen shortage"}
                    </b>
                    <span style={{"fontSize":"14px","fontWeight":"600"} as any}>
                      {"4%"}
                    </span>
                  </div>
                  <span style={{"height":"8px","borderRadius":"4px","background":"var(--inset)"} as any}>
                    <span className="growx" style={{"--i":"2","display":"block","height":"100%","width":"4%","borderRadius":"4px","background":"#C9CCC5"} as any} />
                  </span>
                </div>
                </>)}
                <div className="row" style={{"gap":"6px"} as any}>
                  <span className="pill pv-est">
                    {"Estimated"}
                  </span>
                  <span className="pill">
                    {C ? (C.candidates.length ? "Claude vision, top 3" : "Not checked by Bezra") : "Image model, top 3"}
                  </span>
                  <span className={C ? "lv lv-med" : "lv lv-low"}>
                    <i />
                    <>{C ? "Waiting for " : "Confirmed by "}<EngName /></>
                  </span>
                </div>
              </section>
              <div className="col" style={{"gap":"14px"} as any}>
                <section className="card rise " style={{"--d":"3"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                  <div className="row sp">
                    <span className="row" style={{"gap":"10px"} as any}>
                      <span className="chip r">
                        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 6a3 3 0 0 1 6 0M8 9h8v5a4 4 0 0 1-8 0zM12 9v9M4 11h4M16 11h4M5 17l3-1.5M19 17l-3-1.5M6 6l2 2M18 6l-2 2" />
                        </svg>
                      </span>
                      <h2 className="h3">
                        {C ? (C.status === "predicted" ? C.candidates[0].name : "Waiting for your engineer") : "Fall armyworm"}
                      </h2>
                    </span>
                    <span className="row" style={{"gap":"6px"} as any}>
                      <span className="pill">
                        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 4h6l-1 7h4v4H6v-4h4zM5 19h14" />
                        </svg>
                        {C ? <>{" Sent to "}<EngName />{`, ${cdate}`}</> : " Eng. Mona Adel, 14 Jul"}
                      </span>
                    </span>
                  </div>
                  <p className="body">
                    {"Start with step 1. Only go to the next step if the problem is still there."}
                  </p>
                  <ol style={{"margin":"0","padding":"0","listStyle":"none","display":"flex","flexDirection":"column","gap":"8px"} as any}>
                    <li className="rise" style={{"--d":"4","display":"grid","gridTemplateColumns":"30px 1fr","gap":"12px","padding":"12px","borderRadius":"10px","background":"var(--green-tint)"} as any}>
                      <span style={{"width":"30px","height":"30px","borderRadius":"15px","background":"var(--green)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700","fontSize":"13px"} as any}>
                        {"1"}
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                          {C ? (C.ladder?.[0]?.title || GENERAL[0].title) : "Hand pick and crush"}
                        </b>
                        <span className="sub">
                          {C ? (C.ladder?.[0]?.text || GENERAL[0].text) : "If few plants show fresh damage. Remove egg masses."}
                        </span>
                      </span>
                    </li>
                    <li className="rise" style={{"--d":"5","display":"grid","gridTemplateColumns":"30px 1fr","gap":"12px","padding":"12px","borderRadius":"10px","background":"var(--inset)"} as any}>
                      <span style={{"width":"30px","height":"30px","borderRadius":"15px","background":"var(--dark)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700","fontSize":"13px"} as any}>
                        {"2"}
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                          {C ? (C.ladder?.[1]?.title || GENERAL[1].title) : "Biological option"}
                        </b>
                        <span className="sub">
                          {C ? (C.ladder?.[1]?.text || GENERAL[1].text) : "Bt based product where available. Ask your cooperative."}
                        </span>
                      </span>
                    </li>
                    <li className="rise" style={{"--d":"6","display":"grid","gridTemplateColumns":"30px 1fr","gap":"12px","padding":"12px","borderRadius":"10px","background":"var(--sun-tint)"} as any}>
                      <span style={{"width":"30px","height":"30px","borderRadius":"15px","background":"var(--sun)","color":"var(--ink)","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700","fontSize":"13px"} as any}>
                        {"3"}
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                          {C ? (C.ladder?.[2]?.title || GENERAL[2].title) : "Check the threshold"}
                        </b>
                        <span className="sub">
                          {C ? (C.ladder?.[2]?.text || GENERAL[2].text) : "Act if more than 20% of plants are infested. Count 20 plants in 5 spots."}
                        </span>
                      </span>
                    </li>
                    <li className="rise" style={{"--d":"7","display":"grid","gridTemplateColumns":"30px 1fr","gap":"12px","padding":"12px","borderRadius":"10px","background":"var(--risk-tint)"} as any}>
                      <span style={{"width":"30px","height":"30px","borderRadius":"15px","background":"var(--risk)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700","fontSize":"13px"} as any}>
                        {"4"}
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                          {C ? (C.ladder?.[3]?.title || GENERAL[3].title) : "Pesticide, from the official list"}
                        </b>
                        <span className="sub">
                          {C ? (C.ladder?.[3]?.text || GENERAL[3].text) : "Active ingredient from the Ministry list. Your engineer sets the dose. Keep the pre harvest interval."}
                        </span>
                      </span>
                    </li>
                  </ol>
                  <div className="row" style={{"gap":"8px"} as any}>
                    <svg aria-hidden="true" width="36" height="36" viewBox="0 0 60 60">
                      <g className="">
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
                    <span className="sub" style={{"flex":"1"} as any}>
                      {"Bezra never gives amounts. "}
                      <b style={{"color":"var(--ink)"} as any}>
                        {"Your engineer decides."}
                      </b>
                    </span>
                  </div>
                </section>
                <section className="card rise " style={{"--d":"8"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"8"} as any} />
                  <div className="row sp">
                    <h2 className="h2">
                      {"Follow up in 7 days"}
                    </h2>
                    <span className="tl">
                      {C ? due : "21 Jul"}
                    </span>
                  </div>
                  <div className="grid" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))","gap":"6px"} as any}>
                    {((__v?.fb) || []).map((f: any, i0: number) => (
                      <Fragment key={i0}>
                        <button type="button" className={__s(f?.cls) as any} onClick={f?.pick} aria-pressed={__s(f?.p) as any}>
                          {__s(f?.label)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div className="inset">
                    <span>
                      {"Patch greenness since treatment"}
                    </span>
                    <b style={{"color":"var(--green)"} as any}>
                      {C ? (C.follow_up.change != null ? (C.follow_up.change >= 0 ? "Greener by " : "Less green by ") + Math.round(Math.abs(C.follow_up.change) * 100) + " points" : "After " + due) : "Greener by 6 points"}
                    </b>
                  </div>
                  <div className="inset" style={{"background":"var(--sun-tint)"} as any}>
                    <span style={{"color":"#8A4E06"} as any}>
                      {"Neighbours within 2 km get a scouting alert"}
                    </span>
                    <span className="pill pv-demo">
                      {"Demo"}
                    </span>
                  </div>
                </section>
              </div>
            </div>
            <footer className="foot">
              <span>
                <span lang="ar" dir="rtl" className="ar-t">
                  {"الأداة دي بتساعدك تفكر، مش بتقرر بدالك."}
                </span>
                {" Bezra helps you think. It doesn't decide for you."}
              </span>
              <span>
                {C ? "Your photos stay with Bezra and your engineer. Follow-up greenness from the satellite." : "All numbers on this screen are demo data."}
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
