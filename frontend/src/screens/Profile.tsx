'use client';
import { TourReplayRow } from '@/components/Tour';
import { T, useT } from '@/lib/i18n';
/* eslint-disable */
// Generated from design/html/V11-Profile.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Profile.logic.js (verbatim from the design).
import { Fragment, useState } from 'react';
import { useField, FieldWho, UserName, UserInitials, EngineerTab, signOut, EngName, useUser, useDemo } from '@/lib/field';
import { useApi } from '@/lib/api';
import { useLang, LangSwitch } from '@/lib/i18n';
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import DeleteDataDialog from '@/components/DeleteDataDialog';
import Logic from './Profile.logic';

export default function ProfileScreen() {
  const { fp, id } = useField();
  const { user, fields } = useUser();
  const demo = useDemo();
  const { lang } = useLang();
  const tr = useT();
  // Everything below comes from the signed-in account and its field (GET /fields/{id}).
  const F = useApi<any>(id ? `/fields/${id}` : null, undefined, true).data;
  const plan = useApi<any>(id ? `/plans/${id}` : null, undefined, true).data;
  const A = F?.accuracy || { pct: 0, level: 'low', missing: [] };
  const mine = fields.filter((f) => !user || user.role !== 'farmer' || f.farmer === user.name);
  const v = (x: any) => (x == null || x === '' ? 'Not yet' : String(x));
  const cap = (x?: string) => (x ? x[0].toUpperCase() + x.slice(1) : x);
  const dm = (iso?: string) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Not yet');
  const __v = useDC(Logic);
  const [delOpen, setDelOpen] = useState(false);
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
              <Link href={fp("")} className="press">
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
              <Link href="/profile" aria-current="page" className="press">
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
              <div className="row rise" style={{"--d":"0","gap":"16px"} as any}>
                <span className="av" style={{"width":"72px","height":"72px","borderRadius":"36px","fontSize":"24px"} as any}>
                  <UserInitials />
                </span>
                <div className="col" style={{"gap":"4px"} as any}>
                  <span className="eyebrow">
                    {[user?.role === "engineer" ? "Engineer" : "Farmer", F?.village, F?.governorate].filter(Boolean).join(", ")}
                  </span>
                  <h1 className="h1">
                    <UserName />
                  </h1>
                </div>
              </div>
              <div className="row rise" style={{"--d":"1","gap":"8px"} as any}>
                <Link href="/report" className="btn line press">
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
                  </svg>
                  {"Season report, PDF"}
                </Link>
                <button type="button" className="btn line press" onClick={signOut}>
                  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
                  </svg>
                  {"Sign out"}
                </button>
              </div>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 380px","alignItems":"start"} as any}>
              <div className="col" style={{"gap":"14px"} as any}>
                <section data-tour="accuracy" className="card rise " style={{"--d":"2"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"2"} as any} />
                  <div className="row" style={{"gap":"20px"} as any}>
                    <svg viewBox="0 0 160 96" width="190" role="img" aria-label={`Accuracy ${A.pct} percent, ${A.level}`}>
                      <path d="M14 86A66 66 0 0 1 146 86" stroke="#EDEDE9" strokeWidth="14" fill="none" strokeLinecap="round" />
                      <path className="draw" pathLength="1" style={{"--d":"2","strokeDasharray":`${A.pct / 100} 1`,"strokeDashoffset":String(A.pct / 100)} as any} d="M14 86A66 66 0 0 1 146 86" stroke="#F29B1E" strokeWidth="14" fill="none" strokeLinecap="round" />
                      <text x="80" y="80" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="30" fontWeight="600" fill="#141A16">
                        {F ? `${A.pct}%` : "…"}
                      </text>
                    </svg>
                    <div className="col" style={{"gap":"6px","flex":"1"} as any}>
                      <span style={{"fontSize":"15px","color":"var(--muted)","alignSelf":"flex-start"} as any}>
                        {A.level === 'high' ? tr('High accuracy', 'دقة عالية') : A.level === 'medium' ? tr('Medium accuracy', 'دقة متوسطة') : tr('Low accuracy', 'دقة قليلة')}
                      </span>
                      <h2 className="h3">
                        {`Your advice is ${A.level} accuracy`}
                      </h2>
                      <p className="sub">
                        {!F ? "Add your field to get advice made for it." : A.missing.length ? `Add ${A.missing.slice(0, 2).join(" and ").toLowerCase()} to make it higher. Every answer makes the advice fit your field better.` : "Bezra knows your field well. Keep logging your waterings."}
                      </p>
                    </div>
                    <div className="row" style={{"gap":"8px","alignSelf":"center"} as any}>
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
                    </div>
                  </div>
                  {F ? (
                    <div className="row wrap" style={{ gap: '8px' }}>
                      <Link href={`/onboarding?edit=${id}&step=1`} className="btn press">{'Edit field'}</Link>
                      <span className="tl" style={{ alignSelf: 'center' }}>{'Change the shape, crop, dates or any answer, any time.'}</span>
                    </div>
                  ) : null}
                </section>
                <div className="grid" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))","alignItems":"start"} as any}>
                  <section className="card rise " style={{"--d":"3"} as any}>
                    <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                    <div className="row sp">
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span style={{"width":"32px","height":"32px","borderRadius":"10px","background":"var(--green)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700"} as any}>
                          {"1"}
                        </span>
                        <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                          {"Level 1, Basics"}
                        </b>
                      </span>
                      <span className="lv lv-low">
                        <i />
                        {F && F.crop && F.sow_date && F.prev_crop && F.tenure && F.water_source && F.turn_days ? "Complete" : "To do"}
                      </span>
                    </div>
                    <div className="col" style={{"gap":"4px"} as any}>
                      <div className="inset">
                        <span>
                          {"Crop"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(F?.crop_label)}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Sown"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {dm(F?.sow_date)}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Last crop"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(cap(F?.prev_crop))}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Tenure"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(cap(F?.tenure))}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Water"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(F?.water_source)}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Turn"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {F?.turn_days ? `Every ${F.turn_days} days` : "Not yet"}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </section>
                  <section className="card rise " style={{"--d":"4"} as any}>
                    <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                    <div className="row sp">
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span style={{"width":"32px","height":"32px","borderRadius":"10px","background":"var(--inset)","color":"var(--ink)","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700"} as any}>
                          {"2"}
                        </span>
                        <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                          {"Level 2, More accurate"}
                        </b>
                      </span>
                      <span className="pill">
                        {"Optional"}
                      </span>
                    </div>
                    <div className="col" style={{"gap":"4px"} as any}>
                      <div className="inset">
                        <span>
                          {"Variety"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(F?.variety_label)}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Last 3 yields"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {F?.yields ? `${F.yields} ardeb` : "Not yet"}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Past problems"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(F?.problems)}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Mesqa position"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(cap(F?.mesqa_position))}
                          </b>
                          <span className="pill pv-farm">
                            {"You"}
                          </span>
                        </span>
                      </div>
                    </div>
                    <Link href={`/onboarding?edit=${id}&step=3`} className="btn soft cta press">
                      {"Complete level 2"}
                      <span className="ar">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                  </section>
                  <section className="card rise " style={{"--d":"5"} as any}>
                    <i className="sk " aria-hidden="true" style={{"--d":"5"} as any} />
                    <div className="row sp">
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span style={{"width":"32px","height":"32px","borderRadius":"10px","background":"var(--inset)","color":"var(--ink)","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700"} as any}>
                          {"3"}
                        </span>
                        <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                          {"Level 3, Expert"}
                        </b>
                      </span>
                      <span className="pill">
                        {"Optional"}
                      </span>
                    </div>
                    <div className="col" style={{"gap":"4px"} as any}>
                      <div className="inset">
                        <span>
                          {"Lab soil test"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(F?.soil_ec)}
                          </b>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Water EC"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {v(F?.water_ec)}
                          </b>
                        </span>
                      </div>
                      <div className="inset">
                        <span>
                          {"Sensors"}
                        </span>
                        <span className="row" style={{"gap":"6px"} as any}>
                          <b>
                            {F?.sensors || "None"}
                          </b>
                        </span>
                      </div>
                    </div>
                    <Link href={`/onboarding?edit=${id}&step=4`} className="btn soft cta press">
                      {"Complete level 3"}
                      <span className="ar">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                  </section>
                </div>
                <section className="card rise " style={{"--d":"6"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"6"} as any} />
                  <div className="row sp">
                    <h2 className="h2">
                      {"Fields"}
                    </h2>
                    <Link href="/onboarding" className="btn soft sm press">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      {"Add a field"}
                    </Link>
                  </div>
                  <div className="grid" style={{"gridTemplateColumns":"1fr 1fr","gap":"8px"} as any}>
                    {mine.map((f) => (
                    <Link key={f.id} href={`/field/${f.id}`} className="inset lift" style={{"minHeight":"64px"} as any}>
                      <span className="col">
                        <b style={{"fontSize":"15px","fontWeight":"600","color":"var(--ink)"} as any}>{f.name}</b>
                        <span className="tl">{`${f.area_feddan} feddan, ${f.crop.toLowerCase()}`}</span>
                      </span>
                      <span className="row" style={{"gap":"6px"} as any}>
                        <span className="tl">{"Accuracy"}</span>
                        <b>{(f as any).accuracy != null ? `${(f as any).accuracy}%` : "…"}</b>
                      </span>
                    </Link>
                    ))}
                  </div>
                </section>
              </div>
              <aside className="col" style={{"gap":"14px"} as any}>
                <section className="card rise " style={{"--d":"3"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                  <h2 className="h2">
                    {"Alerts and language"}
                  </h2>
                  <div className="col" style={{"gap":"4px"} as any}>
                    <div className="inset">
                      <span>
                        {"Language"}
                      </span>
                      <b>
                        <LangSwitch big />
                      </b>
                    </div>
                    <div className="inset">
                      <span>
                        {"Alerts by"}
                      </span>
                      <b>
                        {demo ? "WhatsApp voice note" : "In the app"}
                      </b>
                    </div>
                    <div className="inset">
                      <span>
                        {demo ? "Phone" : "Email"}
                      </span>
                      <b>
                        {demo ? "+20 1•• ••• 4471" : user?.email}
                      </b>
                    </div>
                  </div>
                  <label className="inset" style={{"cursor":"pointer"} as any}>
                    <span>
                      {"Easy mode: bigger icons, voice plays by itself"}
                    </span>
                    <button type="button" role="switch" aria-checked={__s(__v?.easy) as any} onClick={__v?.toggleEasy} style={__css(__v?.sw)}>
                      <span style={__css(__v?.knob)} />
                    </button>
                  </label>
                  <TourReplayRow />
                </section>
                <section className="card rise " style={{"--d":"4"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                  <h2 className="h2">
                    {"Your engineer"}
                  </h2>
                  <div className="row" style={{"gap":"12px"} as any}>
                    <span className="av" style={{"background":"#DDEFE3","color":"#1E5B36"} as any}>
                      {(user?.engineer_name || "E").split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                    </span>
                    <span className="col">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        <EngName full />
                      </b>
                      <span className="tl">
                        {plan?.status === "approved" ? `Approved your plan on ${new Date(plan.approved_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.` : "Plan review pending."}
                      </span>
                    </span>
                  </div>
                  <Link href="/messages" className="btn soft cta press">
                    <>{"Message "}<EngName /></>
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
                    {"Your data"}
                  </h2>
                  <p className="sub">
                    {"Bezra keeps your field shape, answers and logs to make advice fit. It never sells them."}
                  </p>
                  <button type="button" className="btn line sm press" onClick={() => setDelOpen(true)} style={{"alignSelf":"flex-start","color":"var(--risk)"} as any}>
                    {"Delete my data"}
                  </button>
                </section>
              </aside>
            </div>
            <footer className="foot">
              <span>
                <T en="Bezra helps you think. It doesn&apos;t decide for you." ar="الأداة دي بتساعدك تفكر، مش بتقرر بدالك." />
              </span>
              <span>
                {"From your account and your field."}
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      <DeleteDataDialog open={delOpen} onClose={() => setDelOpen(false)} />
      </div>
    </>
  );
}
