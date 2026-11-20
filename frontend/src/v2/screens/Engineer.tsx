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
import { useEngineer } from '@/v2/data/engineer';

export default function EngineerScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const en = useEngineer();
  const __v = { ...en, ...useDC(Logic, { ...props, d: en }) };
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
              <Link href={__r("V18-Overview") + ""} className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
                {"Overview"}
              </Link>
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
                  {__s(__v?.head)}
                </span>
                <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                  {__s(__v?.title)}
                </h1>
              </div>
              <span className="row" style={{"gap":"8px"} as any}>
                <a href="#" onClick={__v?.exportCsv} className="btn soft press">
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
                  </svg>
                  {"Export"}
                </a>
                <a href="#" onClick={__v?.planVisits} aria-pressed={!!__v?.visitsOn} className="btn press">
                  {__v?.visitsOn ? "Show all fields" : "Plan my visits"}
                </a>
              </span>
            </div>
            <div className="kpis" style={{"gridTemplateColumns":"repeat(4, minmax(0, 1fr))"} as any}>
              {((__v?.kpis) || []).map((k: any, ik: number) => (
                <div className="kpi" key={ik}>
                  <span className="kl">{k.l}</span>
                  <span className="kv">{k.v}</span>
                  <span className="meta">{k.s}</span>
                </div>
              ))}
            </div>
            {((__v?.reviews) || []).length ? (
              <section className="col" style={{"gap":"6px","marginBottom":"20px"} as any}>
                <h2 className="sec">{"QUESTIONS FROM YOUR FARMERS" + (__v?.reviewsOpen ? " · " + __v.reviewsOpen + " waiting" : "")}</h2>
                {__v.reviews.map((r: any) => (
                  <Link key={r.id} href={r.href} className="row sp press" style={{"padding":"12px 0","borderTop":"1px solid var(--line)","gap":"16px"} as any}>
                    <span className="col" style={{"gap":"2px","minWidth":0} as any}><b style={{"fontWeight":"600"} as any}>{r.note}</b><span className="meta">{r.who + " · " + r.when}</span></span>
                    <span className={"pq " + (r.open ? "est" : "farm")}>{r.open ? "Answer" : "Answered"}</span>
                  </Link>
                ))}
              </section>
            ) : null}
            <div className="fchips" role="group" aria-label="Show">
              {((__v?.filters) || []).map((f: any, jf: number) => <button key={jf} type="button" className={f.cls} aria-pressed={f.pressed} onClick={f.pick}>{f.label}</button>)}
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
                    {"Plan so far"}
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {((__v?.rows) || []).map((r: any, ir: number) => (
                  <tr key={ir}>
                    <td><span className="col" style={{"gap":"2px"} as any}><b style={{"fontWeight":"600","color":"var(--ink)"} as any}>{r.farmer}</b><span className="meta">{r.line}</span></span></td>
                    <td><span className={"lvlpill " + r.cls}><i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />{r.lvl}</span></td>
                    <td>{r.why}</td>
                    <td>{r.note}{r.cases ? " · " + r.cases + (r.cases === 1 ? " photo" : " photos") : ""}</td>
                    <td><Link href={r.href} className={"btn sm press" + (r.visit ? "" : " soft")}>{r.visit ? "Needs a visit" : "Open"}</Link></td>
                  </tr>
                ))}
                {__v?.empty ? <tr><td colSpan={5} className="meta">{__s(__v?.emptyTxt)}</td></tr> : null}
              </tbody>
            </table>
            <p className="meta">
              {"Spray products and doses are your call as the engineer. Bezra never suggests them."}
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
