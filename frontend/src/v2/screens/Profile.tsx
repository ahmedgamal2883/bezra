'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Profile.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Profile.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Profile.logic';
import EngineerLink from '@/v2/EngineerLink';
import { useProfile } from '@/v2/data/profile';

export default function ProfileScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const pr = useProfile();
  const __v = { ...pr, ...useDC(Logic, { ...props, d: pr }) };
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
            <div className="row" style={{"gap":"18px"} as any}>
              <span style={{"width":"72px","height":"72px","borderRadius":"36px","background":"var(--dark)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"24px","fontWeight":"600"} as any}>
                {__s(__w.initials)}
              </span>
              <span className="col" style={{"gap":"4px"} as any}>
                <h1 className="h1x" style={{"fontSize":"36px"} as any}>
                  {__s(__w.userName)}
                </h1>
                <span className="meta" style={{"fontSize":"15px"} as any}>
                  {__s(__v?.sub)}
                </span>
              </span>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"64px"} as any}>
              <div className="col" style={{"gap":"8px"} as any}>
                <section className="col">
                  <h2 className="sec" style={{"paddingBottom":"8px"} as any}>
                    {"YOUR FIELDS"}
                  </h2>
                  {((__v?.fields) || []).map((f: any, ix: number) => (
                  <div className="row sp" key={ix} style={{"padding":"16px 0","borderTop":"1px solid var(--line)"} as any}>
                    <span className="row" style={{"gap":"14px"} as any}>
                      <span className="rki" style={{"width":"48px","height":"48px","borderRadius":"14px","background": f.current ? "#E4EFE7" : "#ECECE8","color": f.current ? "#1F4A33" : "#6A716C"} as any}>
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" /></svg>
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontWeight":"600","fontSize":"16px"} as any}>{f.name}</b>
                        <span className="meta">{f.line}</span>
                      </span>
                    </span>
                    <span className="row" style={{"gap":"8px"} as any}>
                      {f.current ? <span className="pq sat">{"Open now"}</span> : <Link href={f.href} className="btn soft sm press">{"Open"}</Link>}
                      <button type="button" className="ibtn2 press" onClick={f.del} aria-label={f.delLabel}>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></svg>
                      </button>
                    </span>
                  </div>
                ))}
                  
                  <Link href={__r("V18-Add-Find") + ""} className="btn soft press" style={{"alignSelf":"flex-start","marginTop":"14px"} as any}>
                    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    {"Add a field"}
                  </Link>
                </section>
                <section className="col hair" style={{"paddingTop":"24px"} as any}>
                  <h2 className="sec" style={{"paddingBottom":"8px"} as any}>
                    {"YOUR ENGINEER"}
                  </h2>
                  <div className="row sp" style={{"padding":"14px 0"} as any}>
                    <span className="row" style={{"gap":"14px"} as any}>
                      <span className="av" style={{"width":"48px","height":"48px","borderRadius":"24px","background":"#1F4A33","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"600"} as any}>
                        {__v?.engineer ? __v.engineer.replace(/^Eng\.\s*/, "").split(/\s+/).map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() : "—"}
                      </span>
                      <span className="col" style={{"gap":"2px"} as any}>
                        <b style={{"fontWeight":"600","fontSize":"16px"} as any}>
                          {__v?.engineer || "No engineer yet"}
                        </b>
                        <span className="meta">
                          {__v?.engineer ? "Sees your fields, journal and your questions" : __v?.isEngineer ? "You are an engineer. Farmers add you by your mobile number." : "Add your engineer so you can send them questions from Bezra."}
                        </span>
                      </span>
                    </span>
                    {__v?.engineer ? (<Link href={__v?.askHref || "/today?to=data"} className="btn soft sm press">
                      {"Ask a question"}
                    </Link>) : null}
                  </div>
                  {!__v?.engineer && !__v?.isEngineer && !__v?.guest ? <EngineerLink /> : null}
                </section>
              </div>
              <div className="col">
                <section className="col">
                  <h2 className="sec" style={{"paddingBottom":"8px"} as any}>
                    {"SETTINGS"}
                  </h2>
                  <div className="row sp" style={{"padding":"18px 0","borderTop":"1px solid var(--line)","gap":"24px"} as any}>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                        {"Language"}
                      </b>
                    </span>
                    <div className="row chipset" style={{"gap":"6px"} as any}>
                      <button type="button" className={__s(__v?.enOn) as any} onClick={__v?.en}>
                        {"English"}
                      </button>
                      <button type="button" className={__s(__v?.arOn) as any} onClick={__v?.ar}>
                        {"العربية"}
                      </button>
                    </div>
                  </div>
                  
                  
                  <div className="row sp" style={{"padding":"18px 0","borderTop":"1px solid var(--line)","gap":"24px"} as any}>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                        {"Show the first-time tour again"}
                      </b>
                    </span>
                    <Link href={__r("V21-Tour-Welcome") + ""} onClick={() => { try { localStorage.removeItem("bezra_tour_v2"); } catch {} }} className="btn soft sm press">
                      {"Start the tour"}
                    </Link>
                  </div>
                  <div className="row sp" style={{"padding":"18px 0","borderTop":"1px solid var(--line)","gap":"24px"} as any}>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"16px","fontWeight":"600"} as any}>
                        {"Download all my data"}
                      </b>
                    </span>
                    <a href="#" onClick={__v?.exportCsv} className="btn soft sm press">
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
                      </svg>
                      {"CSV"}
                    </a>
                  </div>
                  <div className="row sp" style={{"padding":"18px 0","borderTop":"1px solid var(--line)","gap":"24px"} as any}>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"16px","fontWeight":"600"} as any}>{"Sign out"}</b>
                      <span className="meta">{__v?.guest ? "As a guest you have no password: signing out ends this visit. Create an account to keep your field." : "Your fields and journal stay saved."}</span>
                    </span>
                    <button type="button" onClick={__v?.signOut} className="btn soft sm press">{"Sign out"}</button>
                  </div>
                </section>
              </div>
            </div>
            <footer className="foot" style={{"paddingTop":"24px"} as any}>
              <span>
                {"Bezra helps you think. It doesn't decide for you."}
              </span>
              <span />
            </footer>
          </main>
          {__v?.asking ? (
            <>
              <div className="scrim" onClick={__v?.cancel} />
              <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="pd-h">
                <h3 id="pd-h" style={{"fontSize":"22px","fontWeight":"600"} as any}>
                  {"Delete " + __s(__v?.askName) + "?"}
                </h3>
                <p className="txt">
                  {"Its map, plan, alerts and journal will be removed. Your other fields are not affected."}
                </p>
                <div className="row" style={{"gap":"10px","justifyContent":"flex-end","marginTop":"6px"} as any}>
                  <button type="button" className="btn soft press" onClick={__v?.cancel}>
                    {"Keep it"}
                  </button>
                  <button type="button" className="btn press" onClick={__v?.confirm} style={{"background":"var(--risk)"} as any}>
                    {"Delete " + __s(__v?.askName)}
                  </button>
                </div>
              </div>
            </>
          ) : null}
          {__v?.hasToast ? (
            <>
              <div className="toast" role="status">
                {__s(__v?.toast)}
                <button type="button" onClick={__v?.closeToast}>
                  {"OK"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
