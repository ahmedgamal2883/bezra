'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Add-Find.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./AddFind.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './AddFind.logic';

export default function AddFindScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const __v = { ...useDC(Logic, props), mapEl: props.mapEl as any };
  return (
    <>
      <div className="v2 root">
        <div className="shell">
          <header className="top">
            <Link href={__r("V20-Landing") + ""} className="brand">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <div className="row" style={{"gap":"12px"} as any}>
              <div className="steps" aria-hidden="true">
                {((__v?.bars) || []).map((b: any, i0: number) => (
                  <Fragment key={i0}>
                    <i className={__s(b?.cls) as any} />
                  </Fragment>
                ))}
              </div>
              <span className="meta">
                {__s(__v?.stepTxt)}
              </span>
            </div>
            <Link href={__r("V20-Landing") + ""} className="btn soft sm press">
              {"Cancel"}
            </Link>
          </header>
          <main className="main" style={{"gap":"24px","paddingTop":"24px"} as any}>
            {__v?.find ? (
              <>
                <div className="grid" style={{"gridTemplateColumns":"440px minmax(0, 1fr)","gap":"40px","alignItems":"stretch","minHeight":"720px"} as any}>
                  <div className="col" style={{"gap":"20px","justifyContent":"center"} as any}>
                    <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                      {"Where is your field?"}
                    </h1>
                    <p className="txt" style={{"fontSize":"17px"} as any}>
                      {"Search for the nearest village, or use your phone's location if you are standing in the field."}
                    </p>
                    <label className="col" style={{"gap":"8px"} as any}>
                      <span className="meta">
                        {"Village or area"}
                      </span>
                      <span className="row" style={{"gap":"10px","height":"54px","padding":"0 16px","borderRadius":"16px","background":"#fff"} as any}>
                        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />
                        </svg>
                        <input type="text" placeholder="Village or town, governorate" value={__s(__v?.q)} onChange={__v?.setQ} onKeyDown={(e) => { if (e.key === "Enter") __v?.search?.(e); }} aria-label="Search for your village" style={{"border":"0","outline":"none","font":"inherit","fontSize":"16px","flex":"1","background":"transparent"} as any} />
                      </span>
                    </label>
                    <button type="button" className="btn soft press" onClick={__v?.useLoc} style={{"height":"52px","alignSelf":"flex-start"} as any}>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                      </svg>
                      {"Use my location"}
                    </button>
                    <button type="button" className="btn soft press" onClick={__v?.search} disabled={!!__v?.busy || !__v?.q} style={{"height":"52px","alignSelf":"flex-start"} as any}>{"Search"}</button>
                    {__v?.hasSearchErr ? <div className="warnbox" role="alert"><span>{__s(__v?.searchErr)}</span></div> : null}
                    {__v?.denied ? (
                      <>
                        <div className="warnbox" role="alert">
                          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                          </svg>
                          <span>
                            {"Your phone did not share its location. You can allow it in your browser settings, or search for your village instead."}
                          </span>
                        </div>
                      </>
                    ) : null}
                    <button type="button" className="btn press" onClick={__v?.toDraw} style={{"height":"54px","fontSize":"15px","alignSelf":"flex-start","marginTop":"8px"} as any}>
                      {"This is the area, next"}
                    </button>
                  </div>
                  <div className="col" style={{"gap":"8px"} as any}>
                    <div className="hero" style={{"background":"#D9D6C8","borderRadius":"24px","flex":"1"} as any}>
                      {" "}
                      {__v?.mapEl}
                      {" "}
                    </div>
                    <span className="meta delta-note" style={{"fontSize":"12px","color":"#8A8F88"} as any}>
                      {"Bezra works best in the Nile Delta, Egypt. That is where most of its field data comes from."}
                    </span>
                  </div>
                </div>
              </>
            ) : null}
            {__v?.draw ? (
              <>
                <div className="grid" style={{"gridTemplateColumns":"400px minmax(0, 1fr)","gap":"40px","alignItems":"stretch","minHeight":"720px"} as any}>
                  <div className="col" style={{"gap":"18px","justifyContent":"center"} as any}>
                    <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                      {"Tap the 4 corners of your field."}
                    </h1>
                    <p className="txt" style={{"fontSize":"17px"} as any}>
                      {"Zoom in until you see your field's edges. You can move a corner after."}
                    </p>
                    <span className="row" style={{"gap":"10px","fontWeight":"600"} as any}>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                      </svg>
                      {__s(__v?.ptsTxt)}
                    </span>
                    <div className="row" style={{"gap":"8px"} as any}>
                      <button type="button" className="btn soft sm press" onClick={__v?.addPt}>
                        {"Add a corner"}
                      </button>
                      <button type="button" className="btn soft sm press" onClick={__v?.undoPt}>
                        {"Undo corner"}
                      </button>
                      <button type="button" className="btn soft sm press" onClick={__v?.clear}>
                        {"Start over"}
                      </button>
                    </div>
                    {__v?.drawErr ? (
                      <>
                        <div className="errbox" role="alert">
                          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 4 2.5 20h19zM12 10v4M12 17h.01" />
                          </svg>
                          <span>
                            {"Your field needs at least 3 corners. Tap each corner on the map."}
                          </span>
                        </div>
                      </>
                    ) : null}
                    <div className="row" style={{"gap":"10px","marginTop":"8px"} as any}>
                      <button type="button" className="btn soft press" onClick={__v?.back}>
                        {"Back"}
                      </button>
                      <button type="button" className="btn press" onClick={__v?.toCrop} style={{"height":"52px","minWidth":"150px"} as any}>
                        {"Next"}
                      </button>
                    </div>
                  </div>
                  <div className="col" style={{"gap":"8px"} as any}>
                    <div className="hero" style={{"background":"#8C9A62","borderRadius":"24px","flex":"1"} as any}>
                      {__v?.mapEl}
                    </div>
                    <span className="meta delta-note" style={{"fontSize":"12px","color":"#8A8F88"} as any}>
                      {"Bezra works best in the Nile Delta, Egypt. That is where most of its field data comes from."}
                    </span>
                  </div>
                </div>
              </>
            ) : null}
            {__v?.crop ? (
              <>
                <div className="wizard col" style={{"gap":"26px","paddingTop":"40px"} as any}>
                  <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                    {"What is growing there now?"}
                  </h1>
                  <div className="row chipset" style={{"gap":"8px","flexWrap":"wrap"} as any}>
                    <button type="button" className={__s(__v?.cropW) as any} onClick={__v?.pickW} style={{"height":"48px"} as any}>
                      {"Wheat"}
                    </button>
                    <button type="button" className={__s(__v?.cropC) as any} onClick={__v?.pickC} style={{"height":"48px"} as any}>
                      {"Clover"}
                    </button>
                    <button type="button" className={__s(__v?.cropF) as any} onClick={__v?.pickF} style={{"height":"48px"} as any}>
                      {"Faba beans"}
                    </button>
                    <button type="button" className={__s(__v?.cropO) as any} onClick={__v?.pickO} style={{"height":"48px"} as any}>
                      {"Something else"}
                    </button>
                  </div>
                  <div className="col hair" style={{"gap":"12px","paddingTop":"22px"} as any}>
                    <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                      {"Did you sow it already?"}
                    </b>
                    <div className="row chipset" style={{"gap":"8px"} as any}>
                      <button type="button" className={__s(__v?.sw1) as any} onClick={__v?.setSown} style={{"height":"46px"} as any}>
                        {"Yes"}
                      </button>
                      <button type="button" className={__s(__v?.sw2) as any} onClick={__v?.setNot} style={{"height":"46px"} as any}>
                        {"Not yet"}
                      </button>
                    </div>
                    {__v?.sown ? (
                      <>
                        <label className="col" style={{"gap":"8px","maxWidth":"320px"} as any}>
                          <span className="meta">
                            {"When?"}
                          </span>
                          <span className="row" style={{"gap":"10px","height":"52px","padding":"0 16px","borderRadius":"16px","background":"#fff"} as any}>
                            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
                            </svg>
                            <span style={{"fontSize":"16px"} as any}>
                              {"Thursday 5 November 2026"}
                            </span>
                          </span>
                        </label>
                      </>
                    ) : null}
                    {__v?.notSown ? (
                      <>
                        <span className="meta">
                          {"Good. Bezra will suggest the best week to sow."}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <p className="meta">
                    {"Everything else, like soil and water, Bezra reads from NASA satellites. You can add more later in your journal."}
                  </p>
                  <div className="row" style={{"gap":"10px"} as any}>
                    <button type="button" className="btn soft press" onClick={__v?.back}>
                      {"Back"}
                    </button>
                    <Link href={__r("V18-Reading") + ""} className="btn cta press" style={{"height":"54px","fontSize":"15px","padding":"0 6px 0 22px"} as any}>
                      {"Save and read my field"}
                      <span className="ar">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </>
  );
}
