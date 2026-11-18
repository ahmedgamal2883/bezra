'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Crop-Rust.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./CropRust.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './CropRust.logic';

export default function CropRustScreen(props: Record<string, unknown> = {}) {
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
              <Link href={__r("V18-Crop") + ""} aria-current="page" className="press">
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
          <main className="main" style={{"gap":"28px","paddingTop":"8px"} as any}>
            {__v?.simple ? (
              <>
                <div className="col" style={{"gap":"32px"} as any}>
                  <Link href={__r("V18-Crop") + ""} className="row meta" style={{"gap":"6px","paddingTop":"20px","fontSize":"14px"} as any}>
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m14.5 6-6 6 6 6" />
                    </svg>
                    {"Crop"}
                  </Link>
                  <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 380px","gap":"56px","alignItems":"start"} as any}>
                    <div className="col" style={{"gap":"24px"} as any}>
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="lvlpill med">
                          <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                          {"Medium risk"}
                        </span>
                        <span className="meta">
                          {"This week · whole field"}
                        </span>
                      </span>
                      <h1 className="h1x">
                        {"Rust could start this week."}
                      </h1>
                      <p style={{"fontSize":"19px","lineHeight":"1.6","color":"var(--ink2)","maxWidth":"680px"} as any}>
                        {"Four of the last seven nights were cool and damp. That is the weather rust likes. Nothing is wrong yet, so there is nothing to spray. Just look."}
                      </p>
                      <section className="col hair" style={{"paddingTop":"8px"} as any} aria-labelledby="rd-h">
                        <h2 id="rd-h" className="sec" style={{"padding":"16px 0 6px"} as any}>
                          {"WHAT TO DO"}
                        </h2>
                        <div className="steps3">
                          <div className="s3">
                            <span className="n">
                              {"1"}
                            </span>
                            <span className="col" style={{"gap":"4px"} as any}>
                              <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {"On Wed 9 Dec, walk the field"}
                              </b>
                              <span className="txt">
                                {"Early morning is best, when leaves are still damp."}
                              </span>
                            </span>
                          </div>
                          <div className="s3">
                            <span className="n">
                              {"2"}
                            </span>
                            <span className="col" style={{"gap":"4px"} as any}>
                              <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {"Look at the lower leaves"}
                              </b>
                              <span className="txt">
                                {"Rust looks like small orange or brown powder spots. It rubs off on your finger."}
                              </span>
                            </span>
                          </div>
                          <div className="s3">
                            <span className="n">
                              {"3"}
                            </span>
                            <span className="col" style={{"gap":"4px"} as any}>
                              <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                                {"If you see it, add it to your journal with a photo"}
                              </b>
                              <span className="txt">
                                {"Your engineer sees it the same day and decides if you need to spray."}
                              </span>
                            </span>
                          </div>
                        </div>
                      </section>
                      <div className="row" style={{"gap":"10px"} as any}>
                        {__v?.notAdded ? (
                          <>
                            <button type="button" className="btn press" onClick={__v?.add} style={{"height":"52px","fontSize":"15px"} as any}>
                              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                              </svg>
                              {"Add to my to-do for Wed 9 Dec"}
                            </button>
                          </>
                        ) : null}
                        {__v?.added ? (
                          <>
                            <span className="doneline">
                              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m5 12.5 4.5 4.5L19 7.5" />
                              </svg>
                              {"On your to-do for Wed 9 Dec"}
                              <button type="button" onClick={__v?.undoAdd} style={{"border":"0","background":"transparent","font":"inherit","color":"var(--green)","textDecoration":"underline","cursor":"pointer","padding":"0 10px"} as any}>
                                {"Undo"}
                              </button>
                            </span>
                          </>
                        ) : null}
                        <Link href={__r("V18-Log-Leaf") + ""} className="btn soft press" style={{"height":"52px","fontSize":"15px"} as any}>
                          {"I already see orange spots"}
                        </Link>
                      </div>
                      <p className="meta" style={{"fontSize":"14px"} as any}>
                        {"Bezra does not suggest spray doses. If you need to spray, your engineer tells you what and how much."}
                      </p>
                    </div>
                    <aside className="col" style={{"gap":"14px","padding":"24px","borderRadius":"24px","background":"#fff"} as any}>
                      <span className="sec">
                        {"WHAT RUST LOOKS LIKE"}
                      </span>
                      <div style={{"background":"#EEF1E6","borderRadius":"18px","display":"flex","justifyContent":"center","padding":"18px"} as any}>
                        <svg viewBox="0 0 64 48" width="220" height="165" aria-hidden="true">
                          <path d="M8 40C8 18 30 6 58 8C56 30 36 44 8 40Z" fill="#6E9A48" />
                          <path d="M10 39C24 30 38 20 54 10" stroke="#00000022" strokeWidth="1.5" fill="none" />
                          <circle cx="20" cy="32" r="2.6" fill="#E07A1F" />
                          <circle cx="28" cy="26" r="2.6" fill="#E07A1F" />
                          <circle cx="36" cy="22" r="2.6" fill="#E07A1F" />
                          <circle cx="26" cy="34" r="2.6" fill="#E07A1F" />
                          <circle cx="42" cy="18" r="2.6" fill="#E07A1F" />
                          <circle cx="33" cy="30" r="2.6" fill="#E07A1F" />
                          <circle cx="46" cy="24" r="2.6" fill="#E07A1F" />
                        </svg>
                      </div>
                      <p className="txt">
                        {"Small orange spots, in lines or scattered, mostly on older leaves."}
                      </p>
                      <div className="col hair" style={{"gap":"6px","paddingTop":"12px"} as any}>
                        <span className="meta">
                          {"On this field before"}
                        </span>
                        <b style={{"fontSize":"18px","fontWeight":"600"} as any}>
                          {"3 of the last 10 seasons"}
                        </b>
                        <span className="meta">
                          {"Each time after damp weeks in December or January."}
                        </span>
                      </div>
                    </aside>
                  </div>
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"28px"} as any}>
                  <Link href={__r("V18-Crop") + ""} className="row meta" style={{"gap":"6px","paddingTop":"20px","fontSize":"14px"} as any}>
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m14.5 6-6 6 6 6" />
                    </svg>
                    {"Crop"}
                  </Link>
                  <div className="row sp" style={{"alignItems":"flex-end"} as any}>
                    <div className="col" style={{"gap":"10px"} as any}>
                      <span className="row" style={{"gap":"10px"} as any}>
                        <span className="lvlpill med">
                          <i style={{"width":"8px","height":"8px","borderRadius":"4px","background":"currentColor"} as any} />
                          {"Medium · 0.44"}
                        </span>
                        <span className="meta">
                          {"Leaf and stripe rust · whole field"}
                        </span>
                      </span>
                      <h1 className="h1x" style={{"fontSize":"40px"} as any}>
                        {"Rust risk is rising, still under the decision line."}
                      </h1>
                    </div>
                    {__v?.notAdded ? (
                      <>
                        <button type="button" className="btn press" onClick={__v?.add}>
                          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                          {"Add scouting on Wed 9 Dec"}
                        </button>
                      </>
                    ) : null}
                    {__v?.added ? (
                      <>
                        <span className="doneline">
                          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 12.5 4.5 4.5L19 7.5" />
                          </svg>
                          {"Added for Wed 9 Dec"}
                        </span>
                      </>
                    ) : null}
                  </div>
                  <div className="chart">
                    <svg viewBox="0 0 980 230" width="100%" role="img" aria-label="Rust risk over 14 days, rising towards the warning line but staying under it.">
                      <line x1="40" x2="970" y1="200.0" y2="200.0" stroke="#E8E8E3" />
                      <text x="0" y="204.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"0.0"}
                      </text>
                      <line x1="40" x2="970" y1="108.0" y2="108.0" stroke="#E8E8E3" />
                      <text x="0" y="112.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"0.5"}
                      </text>
                      <line x1="40" x2="970" y1="16.0" y2="16.0" stroke="#E8E8E3" />
                      <text x="0" y="20.0" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"1.0"}
                      </text>
                      <rect x="540.8" y="16" width="429.2" height="184" fill="#ECECE6" fillOpacity=".6" />
                      <line x1="40" x2="970" y1="89.6" y2="89.6" stroke="#C2412A" strokeDasharray="5 5" />
                      <text x="970" y="83.6" textAnchor="end" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#C2412A">
                        {"Spray decision line 0.6"}
                      </text>
                      <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M40.0 159.5 L111.5 154.0 L183.1 144.8 L254.6 148.5 L326.2 139.3 L397.7 124.6 L469.2 115.4 L540.8 119.0" stroke="#D9762B" strokeWidth="2.6" fill="none" />
                      <path d="M540.8 119.0 L612.3 109.8 L683.8 104.3 L755.4 98.8 L826.9 108.0 L898.5 113.5 L970.0 120.9" stroke="#D9762B" strokeWidth="2.2" strokeDasharray="4 5" fill="none" />
                      <circle cx="540.8" cy="119.0" r="5" fill="#D9762B" />
                      <text x="548.8" y="28" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="#141A16">
                        {"Today 0.44"}
                      </text>
                      <text x="548.8" y="44" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"Forecast"}
                      </text>
                      <text x="40.0" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"26 Nov"}
                      </text>
                      <text x="111.5" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"27"}
                      </text>
                      <text x="183.1" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"28"}
                      </text>
                      <text x="254.6" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"29"}
                      </text>
                      <text x="326.2" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"30"}
                      </text>
                      <text x="397.7" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"1 Dec"}
                      </text>
                      <text x="469.2" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"2"}
                      </text>
                      <text x="540.8" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"3"}
                      </text>
                      <text x="612.3" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"4"}
                      </text>
                      <text x="683.8" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"5"}
                      </text>
                      <text x="755.4" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"6"}
                      </text>
                      <text x="826.9" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"7"}
                      </text>
                      <text x="898.5" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"8"}
                      </text>
                      <text x="970.0" y="222" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                        {"9"}
                      </text>
                    </svg>
                    <div className="leg">
                      <span>
                        <i style={{"background":"#D9762B"} as any} />
                        {"Risk index (0–1)"}
                      </span>
                      <span>
                        <i style={{"background":"#C2412A"} as any} />
                        {"Engineer decision line"}
                      </span>
                    </div>
                    <span className="pq est">
                      {"Infection model on NASA POWER hourly RH and temperature, calibrated on 2015–2025 rust years"}
                    </span>
                  </div>
                  <div className="grid hair" style={{"gridTemplateColumns":"repeat(3, minmax(0, 1fr))","gap":"40px","paddingTop":"28px"} as any}>
                    <div className="chart">
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Night humidity, last 7 nights"}
                      </b>
                      <svg style={{"maxWidth":"380px"} as any} viewBox="0 0 420 150" width="100%" role="img" aria-label="Night humidity for the last 7 nights. 4 nights were over 85 percent.">
                        <rect className="grow" style={{"--i":"0"} as any} x="10" y="62.8" width="40" height="57.2" rx="6" fill="#B7C9D8" />
                        <text x="30" y="56.8" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"72%"}
                        </text>
                        <text x="30" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"27"}
                        </text>
                        <rect className="grow" style={{"--i":"1"} as any} x="68" y="47.2" width="40" height="72.8" rx="6" fill="#B7C9D8" />
                        <text x="88" y="41.2" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"78%"}
                        </text>
                        <text x="88" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"28"}
                        </text>
                        <rect className="grow" style={{"--i":"2"} as any} x="126" y="21.2" width="40" height="98.8" rx="6" fill="#2F6FA8" />
                        <text x="146" y="15.2" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"88%"}
                        </text>
                        <text x="146" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"29"}
                        </text>
                        <rect className="grow" style={{"--i":"3"} as any} x="184" y="13.4" width="40" height="106.6" rx="6" fill="#2F6FA8" />
                        <text x="204" y="7.4" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"91%"}
                        </text>
                        <text x="204" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"30"}
                        </text>
                        <rect className="grow" style={{"--i":"4"} as any} x="242" y="26.4" width="40" height="93.6" rx="6" fill="#2F6FA8" />
                        <text x="262" y="20.4" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"86%"}
                        </text>
                        <text x="262" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"1"}
                        </text>
                        <rect className="grow" style={{"--i":"5"} as any} x="300" y="44.6" width="40" height="75.4" rx="6" fill="#B7C9D8" />
                        <text x="320" y="38.6" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"79%"}
                        </text>
                        <text x="320" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"2"}
                        </text>
                        <rect className="grow" style={{"--i":"6"} as any} x="358" y="18.6" width="40" height="101.4" rx="6" fill="#2F6FA8" />
                        <text x="378" y="12.6" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fontWeight="600" fill="#141A16">
                          {"89%"}
                        </text>
                        <text x="378" y="142" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                          {"3"}
                        </text>
                        <line x1="0" x2="420" y1="29.0" y2="29.0" stroke="#141A16" strokeDasharray="3 4" strokeOpacity=".5" />
                      </svg>
                      <span className="meta">
                        {"Dashed line: 85%. 4 nights above it."}
                      </span>
                    </div>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Inputs today"}
                      </b>
                      <table className="tbl">
                        <tbody>
                          <tr>
                            <td>
                              {"Night temp"}
                            </td>
                            <td>
                              {"11–17 °C"}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Leaf wetness"}
                            </td>
                            <td>
                              {"9 h last night"}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Damp nights (7)"}
                            </td>
                            <td>
                              {"4"}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Crop stage"}
                            </td>
                            <td>
                              {"Tillering, day 28"}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Variety"}
                            </td>
                            <td>
                              {"Giza 171 (your journal)"}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {"Spores nearby"}
                            </td>
                            <td>
                              {"No data"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col" style={{"gap":"12px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Rust years on this field"}
                      </b>
                      <div className="row sp" style={{"padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                        <span>
                          {"2018/19"}
                        </span>
                        <span className="meta">
                          {"Jan, after 6 damp nights"}
                        </span>
                      </div>
                      <div className="row sp" style={{"padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                        <span>
                          {"2021/22"}
                        </span>
                        <span className="meta">
                          {"Dec, 5 damp nights"}
                        </span>
                      </div>
                      <div className="row sp" style={{"padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                        <span>
                          {"2024/25"}
                        </span>
                        <span className="meta">
                          {"Jan, 7 damp nights"}
                        </span>
                      </div>
                      <span className="meta">
                        {"Matched from greenness drops + weather. Engineer confirmed 2024/25."}
                      </span>
                    </div>
                  </div>
                  <p className="meta">
                    {"Spray choice and dose: engineer only. Bezra shows the risk and the evidence."}
                  </p>
                </div>
              </>
            ) : null}
            <footer className="foot" style={{"paddingTop":"24px"} as any}>
              <span>
                {"Bezra helps you think. It doesn't decide for you."}
              </span>
              <span />
            </footer>
          </main>
          <Link href={__r("V18-Ask") + ""} className="fab press" aria-label="Ask Bezra" title="Ask Bezra">
            <svg aria-hidden="true" width="50" height="50" viewBox="0 0 60 60">
              <g className="">
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
          </Link>
        </div>
      </div>
    </>
  );
}
