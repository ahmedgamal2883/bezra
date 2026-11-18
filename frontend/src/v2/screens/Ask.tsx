'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Ask.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Ask.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Ask.logic';
import { useAskData } from '@/v2/data/ask';
import { Mascot } from '@/components/chrome';

export default function AskScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const ask = useAskData();
  const __v = { ...useDC(Logic, props), ...ask };
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
              <Link href={__r("V18-Crop") + ""} className="ibtn press" aria-label="Alerts, 2 new">
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
          <main className="main" style={{"gap":"24px","paddingTop":"24px"} as any}>
            <div className="col" style={{"gap":"8px"} as any}>
              <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                {"Ask Bezra"}
              </h1>
            </div>
            <div className="chatwrap">
              <div className="chat">
                <div className="bzrow">
                  <Mascot size={40} />
                  <div className="msg bz">{__s(__v?.greeting)}</div>
                </div>
                {((__v?.msgs) || []).map((m: any, im: number) => m.role === 'user' ? (
                  <div className="msg me" key={im}>{m.text}</div>
                ) : m.error ? (
                  <div className="errbox" role="alert" key={im} style={{"alignSelf":"flex-start"} as any}>
                    {m.text}
                    <button type="button" className="btn sm press" onClick={__v?.retry} style={{"marginLeft":"8px"} as any}>{"Try again"}</button>
                  </div>
                ) : (
                  <div className="bzrow" key={im}>
                    <Mascot size={40} />
                    <div className="col" style={{"gap":"8px","minWidth":"0"} as any}>
                      <div className="msg bz" style={{"whiteSpace":"pre-wrap"} as any}>{m.text}</div>
                      {(m.cards || []).map((c: any, ic: number) => c.type === 'engineer' ? (
                        <div className="acts" key={ic}><Link href="/messages" className="btn sm press">{c.title || "Ask your engineer"}</Link></div>
                      ) : (
                        <div className="msg bz" key={ic} style={{"display":"flex","flexDirection":"column","gap":"6px"} as any}>
                          {c.title ? <b style={{"fontWeight":"600"} as any}>{c.title}</b> : null}
                          {(c.items || []).map((it: any, ii: number) => (
                            <span key={ii} className="row sp" style={{"gap":"12px"} as any}><span className="meta">{it.label}</span><b style={{"fontWeight": it.highlight ? 700 : 600} as any}>{it.value}</b></span>
                          ))}
                        </div>
                      ))}
                      {m.sources?.length ? <span className="meta" style={{"fontSize":"12px"} as any}>{"From: " + m.sources.join(" · ")}</span> : null}
                    </div>
                  </div>
                ))}
                {__v?.busy ? (
                  <div className="bzrow">
                    <Mascot size={40} />
                    <div className="msg bz" aria-label="Bezra is writing"><span className="typing"><i /><i /><i /></span></div>
                  </div>
                ) : null}
                {((__v?.msgs) || []).length === 0 ? (
                  <div className="sugs">
                    {((__v?.sugs) || []).map((q: string, iq: number) => (
                      <button key={iq} type="button" className="press" onClick={() => __v?.send?.(q)}>{q}</button>
                    ))}
                  </div>
                ) : null}
                <form className="composer" onSubmit={(e) => { e.preventDefault(); __v?.submit?.(); }}>
                  <label htmlFor="ask-in" className="sr" style={{"position":"absolute","left":"-9999px"} as any}>{"Ask Bezra"}</label>
                  <input id="ask-in" type="text" placeholder="Ask about your field…" value={__s(__v?.draft)} onChange={(e) => __v?.setDraft?.(e.target.value)} disabled={!!__v?.busy} />
                  <button type="submit" className="btn press" style={{"height":"48px"} as any} aria-label="Send" disabled={!!__v?.busy || !__v?.draft}>
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </button>
                </form>
                <div aria-live="polite" className="sr" style={{"position":"absolute","left":"-9999px"} as any}>{__s(__v?.lastAnswer)}</div>
              </div>
              <aside className="ctx">
                <span className="sec" style={{"paddingBottom":"8px"} as any}>
                  {"WHAT BEZRA KNOWS RIGHT NOW"}
                </span>
                {((__v?.ctx) || []).map((r: any, ir: number) => (
                  <div className="row sp" key={ir} style={{"padding":"8px 0","borderTop":"1px solid var(--line)","gap":"12px"} as any}>
                    <span className="meta">{r[0]}</span>
                    <b style={{"fontWeight":"600","textAlign":"end"} as any}>{r[1]}</b>
                  </div>
                ))}
                <span className="meta" style={{"paddingTop":"12px"} as any}>
                  {"Bezra answers from your field's data. It never guesses spray doses."}
                </span>
              </aside>
            </div>
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
