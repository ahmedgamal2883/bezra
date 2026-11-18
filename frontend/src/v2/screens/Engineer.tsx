'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Engineer.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Engineer.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Engineer.logic';

export default function EngineerScreen(props: Record<string, unknown> = {}) {
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
              <Link href={__r("V18-Crop") + ""} className="press">
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
              <Link href="/notifications" className="ibtn press" aria-label="Notifications">
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
          <main className="main" style={{"gap":"28px","paddingTop":"24px"} as any}>
            <div className="row sp" style={{"alignItems":"flex-end"} as any}>
              <div className="col" style={{"gap":"8px"} as any}>
                <span className="meta">
                  {"Engineer workspace · Eng. Mona Adel · Thu 3 Dec"}
                </span>
                <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                  {"3 farmers need you today."}
                </h1>
              </div>
              <span className="row" style={{"gap":"8px"} as any}>
                <a href="#" className="btn soft press">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
                  </svg>
                  {"Export"}
                </a>
                <a href="#" className="btn press">
                  {"Plan my visits"}
                </a>
              </span>
            </div>
            <div className="kpis" style={{"gridTemplateColumns":"repeat(4, minmax(0, 1fr))"} as any}>
              <div className="kpi">
                <span className="kl">
                  {"Farmers"}
                </span>
                <span className="kv">
                  {"214"}
                </span>
                <span className="meta">
                  {"Shibin El Kom district"}
                </span>
              </div>
              <div className="kpi">
                <span className="kl">
                  {"Need a visit"}
                </span>
                <span className="kv">
                  {"3"}
                </span>
                <span className="meta">
                  {"Ranked by risk and harvest at stake"}
                </span>
              </div>
              <div className="kpi">
                <span className="kl">
                  {"Rust over the line"}
                </span>
                <span className="kv">
                  {"11 fields"}
                </span>
                <span className="meta">
                  {"Up from 4 last week"}
                </span>
              </div>
              <div className="kpi">
                <span className="kl">
                  {"Journal notes this week"}
                </span>
                <span className="kv">
                  {"386"}
                </span>
                <span className="meta">
                  {"71% of farmers logged something"}
                </span>
              </div>
            </div>
            <div className="fchips">
              <button type="button" className="opt on">
                {"All"}
              </button>
              <button type="button" className="opt">
                {"High risk"}
              </button>
              <button type="button" className="opt">
                {"Rust"}
              </button>
              <button type="button" className="opt">
                {"Water"}
              </button>
              <button type="button" className="opt">
                {"No notes in a week"}
              </button>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>
                    {"Farmer"}
                  </th>
                  <th>
                    {"Risk"}
                  </th>
                  <th>
                    {"Why"}
                  </th>
                  <th>
                    {"Last journal note"}
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {__s(__w.userName)}
                      </b>
                      <span className="meta">
                        {"North plot · wheat d28"}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="lvlpill med">
                      <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                      {"Medium"}
                    </span>
                  </td>
                  <td>
                    {"Rust medium · C1 yellow"}
                  </td>
                  <td>
                    {"Yellow leaves, C1 · 30 Nov"}
                  </td>
                  <td>
                    <span className="pq sat">
                      {"Reply sent"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"Samir Abdelaziz"}
                      </b>
                      <span className="meta">
                        {"Wheat d34"}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="lvlpill high">
                      <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                      {"High"}
                    </span>
                  </td>
                  <td>
                    {"Rust 0.63 · over the line"}
                  </td>
                  <td>
                    {"Orange spots, B3 · today"}
                  </td>
                  <td>
                    <a href="#" className="btn sm press">
                      {"Needs a visit"}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"Fatma Ibrahim"}
                      </b>
                      <span className="meta">
                        {"Wheat d22"}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="lvlpill high">
                      <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                      {"High"}
                    </span>
                  </td>
                  <td>
                    {"Waterlogging, 5 squares"}
                  </td>
                  <td>
                    {"Water standing · yesterday"}
                  </td>
                  <td>
                    <a href="#" className="btn sm press">
                      {"Needs a call"}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"Mahmoud Saleh"}
                      </b>
                      <span className="meta">
                        {"Clover d40"}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="lvlpill low">
                      <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                      {"Low"}
                    </span>
                  </td>
                  <td>
                    {"All normal"}
                  </td>
                  <td>
                    {"Watered · 1 Dec"}
                  </td>
                  <td />
                </tr>
                <tr>
                  <td>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"Ahmed Kamal"}
                      </b>
                      <span className="meta">
                        {"Wheat d30"}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="lvlpill med">
                      <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                      {"Medium"}
                    </span>
                  </td>
                  <td>
                    {"Aphids rising"}
                  </td>
                  <td>
                    {"Aphids, many · 2 Dec"}
                  </td>
                  <td>
                    <a href="#" className="btn sm press">
                      {"Needs a call"}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"Nadia Hassan"}
                      </b>
                      <span className="meta">
                        {"Faba d26"}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="lvlpill low">
                      <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                      {"Low"}
                    </span>
                  </td>
                  <td>
                    {"All normal"}
                  </td>
                  <td>
                    {"Photo · 28 Nov"}
                  </td>
                  <td />
                </tr>
                <tr>
                  <td>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"Youssef Ali"}
                      </b>
                      <span className="meta">
                        {"Wheat d29"}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="lvlpill med">
                      <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                      {"Medium"}
                    </span>
                  </td>
                  <td>
                    {"Late water, 2 squares"}
                  </td>
                  <td>
                    {"No notes in 9 days"}
                  </td>
                  <td>
                    <a href="#" className="btn sm press">
                      {"Check in"}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"Hoda Mostafa"}
                      </b>
                      <span className="meta">
                        {"Wheat d27"}
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="lvlpill low">
                      <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                      {"Low"}
                    </span>
                  </td>
                  <td>
                    {"All normal"}
                  </td>
                  <td>
                    {"Urea 55 kg · 25 Nov"}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
            <p className="meta">
              {"Engineers set spray products and doses. Farmers see them as tasks on their to-do."}
            </p>
            <footer className="foot" style={{"paddingTop":"24px"} as any}>
              <span>
                {"Bezra helps you think. It doesn't decide for you."}
              </span>
              <span />
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
