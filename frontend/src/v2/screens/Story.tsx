'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V18-Story.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Story.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Story.logic';

export default function StoryScreen(props: Record<string, unknown> = {}) {
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
              <Link href={__r("V18-Today") + ""} aria-current="page" className="press">
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
          <main className="main" style={{"gap":"28px","paddingTop":"8px"} as any}>
            {__v?.simple ? (
              <>
                <div className="col" style={{"gap":"8px"} as any}>
                  <div className="row sp rise" style={{"--d":"0","alignItems":"flex-end","paddingTop":"24px"} as any}>
                    <div className="col" style={{"gap":"14px","maxWidth":"860px"} as any}>
                      <span className="row" style={{"gap":"12px"} as any}>
                        <svg aria-hidden="true" width="52" height="52" viewBox="0 0 60 60">
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
                            <path d="M24 36q6 7 12 0z" fill="#3A2A10" />
                            <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          </g>
                        </svg>
                        <span className="meta" style={{"fontSize":"15px"} as any}>
                          {"North plot · read from 10 seasons of NASA satellite images"}
                        </span>
                      </span>
                      <h1 className="h1x">
                        {"We found 3 things about your field. Each one comes with what to do."}
                      </h1>
                    </div>
                  </div>
                  <article className="dcard rise" style={{"--d":"2","gridTemplateColumns":"minmax(0, 680px) 360px"} as any}>
                    <div className="col" style={{"gap":"16px"} as any}>
                      <div className="row" style={{"gap":"14px"} as any}>
                        <span className="dnum">
                          {"1"}
                        </span>
                        <h2 style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.4px"} as any}>
                          {"Late sowing cost you before. This season, you were on time."}
                        </h2>
                      </div>
                      <p style={{"fontSize":"18px","lineHeight":"1.6","color":"var(--ink2)"} as any}>
                        {"In "}
                        <b>
                          {"4 of the last 10 seasons"}
                        </b>
                        {" the wheat turned green late, which means it was sown around "}
                        <b>
                          {"20 November"}
                        </b>
                        {". This season you sowed on "}
                        <b>
                          {"5 November"}
                        </b>
                        {", inside the best window."}
                      </p>
                      <div className="col" style={{"gap":"8px"} as any}>
                        <div className="dots10" aria-hidden="true">
                          <i className="" />
                          <i className="" />
                          <i className="bad" />
                          <i className="" />
                          <i className="" />
                          <i className="bad" />
                          <i className="bad" />
                          <i className="" />
                          <i className="bad" />
                          <i className="" />
                        </div>
                        <span className="meta">
                          {"Each square is a season. Orange = sown late."}
                        </span>
                      </div>
                    </div>
                    <div className="decide">
                      <span className="k">
                        {"What to do"}
                      </span>
                      <b>
                        {"Keep sowing in early November"}
                      </b>
                      <span className="meta" style={{"fontSize":"14px"} as any}>
                        {"Later sowing puts the grain in April heat more often."}
                      </span>
                      <Link href={__r("V19-Try") + ""} className="btn press" style={{"alignSelf":"flex-start","marginTop":"6px"} as any}>
                        {"See it in Try a season"}
                      </Link>
                    </div>
                  </article>
                  <article className="dcard rise" style={{"--d":"3","gridTemplateColumns":"minmax(0, 680px) 360px"} as any}>
                    <div className="col" style={{"gap":"16px"} as any}>
                      <div className="row" style={{"gap":"14px"} as any}>
                        <span className="dnum">
                          {"2"}
                        </span>
                        <h2 style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.4px"} as any}>
                          {"Heat hurts your wheat in April."}
                        </h2>
                      </div>
                      <p style={{"fontSize":"18px","lineHeight":"1.6","color":"var(--ink2)"} as any}>
                        {"In "}
                        <b>
                          {"4 of the last 10 springs"}
                        </b>
                        {" a heat wave came while the grain was filling. It is the main reason your harvest changes from year to year."}
                      </p>
                      <div className="col" style={{"gap":"8px"} as any}>
                        <div className="dots10" aria-hidden="true">
                          <i className="bad" />
                          <i className="" />
                          <i className="" />
                          <i className="bad" />
                          <i className="" />
                          <i className="" />
                          <i className="bad" />
                          <i className="" />
                          <i className="" />
                          <i className="bad" />
                        </div>
                        <span className="meta">
                          {"Each square is a season. Orange = heat while the grain filled."}
                        </span>
                      </div>
                    </div>
                    <div className="decide">
                      <span className="k">
                        {"What to do"}
                      </span>
                      <b>
                        {"Heat warnings are on"}
                      </b>
                      <span className="meta" style={{"fontSize":"14px"} as any}>
                        {"We warn you 4–7 days before, so you can water first."}
                      </span>
                      <Link href={__r("V18-Crop") + ""} className="btn press" style={{"alignSelf":"flex-start","marginTop":"6px"} as any}>
                        {"See the Crop page"}
                      </Link>
                    </div>
                  </article>
                  <article className="dcard rise" style={{"--d":"4","gridTemplateColumns":"minmax(0, 680px) 360px"} as any}>
                    <div className="col" style={{"gap":"16px"} as any}>
                      <div className="row" style={{"gap":"14px"} as any}>
                        <span className="dnum">
                          {"3"}
                        </span>
                        <h2 style={{"fontSize":"26px","fontWeight":"600","letterSpacing":"-.4px"} as any}>
                          {"One corner is always weaker."}
                        </h2>
                      </div>
                      <p style={{"fontSize":"18px","lineHeight":"1.6","color":"var(--ink2)"} as any}>
                        {"Square C1, in the north-east, was the least green part in "}
                        <b>
                          {"7 of 10 seasons"}
                        </b>
                        {". It is at the end of the canal, so water reaches it last."}
                      </p>
                      <div className="col" style={{"gap":"8px"} as any}>
                        <div className="dots10" aria-hidden="true">
                          <i className="bad" />
                          <i className="bad" />
                          <i className="bad" />
                          <i className="" />
                          <i className="bad" />
                          <i className="bad" />
                          <i className="bad" />
                          <i className="" />
                          <i className="" />
                          <i className="bad" />
                        </div>
                        <span className="meta">
                          {"Each square is a season. Orange = C1 was weak."}
                        </span>
                      </div>
                    </div>
                    <div className="decide">
                      <span className="k">
                        {"What to do"}
                      </span>
                      <b>
                        {"Water from the north-east side first"}
                      </b>
                      <span className="meta" style={{"fontSize":"14px"} as any}>
                        {"And check the canal opening near C1."}
                      </span>
                      <Link href={__r("V18-Today") + ""} className="btn press" style={{"alignSelf":"flex-start","marginTop":"6px"} as any}>
                        {"Show me on the map"}
                      </Link>
                    </div>
                  </article>
                  <div className="row hair rise" style={{"--d":"6","gap":"14px","paddingTop":"28px"} as any}>
                    <Link href={__r("V18-Today") + ""} className="btn cta press" style={{"height":"54px","fontSize":"16px","padding":"0 6px 0 22px"} as any}>
                      {"Go to my field"}
                      <span className="ar">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                    <span className="meta" style={{"fontSize":"14px"} as any}>
                      {"Want the charts and numbers? Switch to "}
                      <b style={{"color":"var(--ink)"} as any}>
                        {"Details"}
                      </b>
                      {" at the top."}
                    </span>
                  </div>
                </div>
              </>
            ) : null}
            {__v?.details ? (
              <>
                <div className="col" style={{"gap":"40px","paddingTop":"16px"} as any}>
                  <div className="row sp rise" style={{"--d":"0","padding":"8px 4px 0","alignItems":"flex-end"} as any}>
                    <div className="col" style={{"gap":"14px","maxWidth":"820px"} as any}>
                      <span className="row" style={{"gap":"10px"} as any}>
                        <svg aria-hidden="true" width="44" height="44" viewBox="0 0 60 60">
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
                            <path d="M24 36q6 7 12 0z" fill="#3A2A10" />
                            <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                            <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                          </g>
                        </svg>
                        <span className="meta">
                          {"North plot · read from 36 years of NASA data · before your first journal note"}
                        </span>
                      </span>
                      <h1 className="big" style={{"fontSize":"52px","letterSpacing":"-2px"} as any}>
                        {"Here's what we already know about your field."}
                      </h1>
                    </div>
                    <span />
                  </div>
                  <section className="col rise" style={{"--d":"1","gap":"14px"} as any} aria-labelledby="rl-h">
                    <div className="row sp" style={{"padding":"0 4px"} as any}>
                      <h2 id="rl-h" className="sec">
                        {"TEN WHEAT SEASONS ON THIS FIELD · GREENNESS FROM SPACE"}
                      </h2>
                      <span className="pq sat">
                        {"MODIS 2000→ · HLS 30 m 2015→"}
                      </span>
                    </div>
                    <svg viewBox="0 0 1180 420" width="100%" role="img" aria-label="Greenness of North plot through each of the last 10 wheat seasons. 2019/20 was the best season, 2022/23 the weakest after an April heat wave. This season is ahead of normal so far.">
                      <path d="M110.0 60.0 L110.0 59.9 L120.5 59.9 L131.0 59.9 L141.5 59.9 L152.0 59.8 L162.5 59.8 L173.0 59.7 L183.5 59.7 L194.0 59.6 L204.5 59.5 L215.0 59.4 L225.5 59.3 L236.0 59.1 L246.5 58.9 L257.0 58.7 L267.5 58.5 L278.0 58.2 L288.5 57.8 L299.0 57.5 L309.5 57.0 L320.0 56.5 L330.5 55.9 L341.0 55.3 L351.5 54.6 L362.0 53.8 L372.5 52.9 L383.0 51.9 L393.5 50.8 L404.0 49.6 L414.5 48.3 L425.0 46.9 L435.5 45.4 L446.0 43.7 L456.5 42.0 L467.0 40.2 L477.5 38.3 L488.0 36.3 L498.5 34.3 L509.0 32.2 L519.5 30.0 L530.0 27.9 L540.5 25.7 L551.0 23.5 L561.5 21.3 L572.0 19.2 L582.5 17.2 L593.0 15.2 L603.5 13.4 L614.0 11.7 L624.5 10.2 L635.0 8.8 L645.5 7.6 L656.0 6.6 L666.5 5.8 L677.0 5.3 L687.5 5.0 L698.0 4.9 L708.5 5.1 L719.0 5.4 L729.5 6.1 L740.0 6.9 L750.5 8.0 L761.0 9.2 L771.5 10.6 L782.0 12.2 L792.5 14.0 L803.0 15.9 L813.5 17.8 L824.0 19.9 L834.5 22.0 L845.0 24.2 L855.5 26.4 L866.0 28.6 L876.5 30.7 L887.0 32.9 L897.5 35.0 L908.0 37.0 L918.5 38.9 L929.0 40.8 L939.5 42.6 L950.0 44.3 L960.5 45.9 L971.0 47.3 L981.5 48.7 L992.0 50.0 L1002.5 51.1 L1013.0 52.2 L1023.5 53.2 L1034.0 54.0 L1044.5 54.8 L1055.0 55.5 L1065.5 56.1 L1076.0 56.7 L1086.5 57.2 L1097.0 57.6 L1107.5 58.0 L1118.0 58.3 L1128.5 58.6 L1139.0 58.8 L1149.5 59.0 L1160.0 59.2 L1160.0 60.0 Z" fill="#B9BDB6" fillOpacity=".10" />
                      <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M110.0 59.9 L120.5 59.9 L131.0 59.9 L141.5 59.9 L152.0 59.8 L162.5 59.8 L173.0 59.7 L183.5 59.7 L194.0 59.6 L204.5 59.5 L215.0 59.4 L225.5 59.3 L236.0 59.1 L246.5 58.9 L257.0 58.7 L267.5 58.5 L278.0 58.2 L288.5 57.8 L299.0 57.5 L309.5 57.0 L320.0 56.5 L330.5 55.9 L341.0 55.3 L351.5 54.6 L362.0 53.8 L372.5 52.9 L383.0 51.9 L393.5 50.8 L404.0 49.6 L414.5 48.3 L425.0 46.9 L435.5 45.4 L446.0 43.7 L456.5 42.0 L467.0 40.2 L477.5 38.3 L488.0 36.3 L498.5 34.3 L509.0 32.2 L519.5 30.0 L530.0 27.9 L540.5 25.7 L551.0 23.5 L561.5 21.3 L572.0 19.2 L582.5 17.2 L593.0 15.2 L603.5 13.4 L614.0 11.7 L624.5 10.2 L635.0 8.8 L645.5 7.6 L656.0 6.6 L666.5 5.8 L677.0 5.3 L687.5 5.0 L698.0 4.9 L708.5 5.1 L719.0 5.4 L729.5 6.1 L740.0 6.9 L750.5 8.0 L761.0 9.2 L771.5 10.6 L782.0 12.2 L792.5 14.0 L803.0 15.9 L813.5 17.8 L824.0 19.9 L834.5 22.0 L845.0 24.2 L855.5 26.4 L866.0 28.6 L876.5 30.7 L887.0 32.9 L897.5 35.0 L908.0 37.0 L918.5 38.9 L929.0 40.8 L939.5 42.6 L950.0 44.3 L960.5 45.9 L971.0 47.3 L981.5 48.7 L992.0 50.0 L1002.5 51.1 L1013.0 52.2 L1023.5 53.2 L1034.0 54.0 L1044.5 54.8 L1055.0 55.5 L1065.5 56.1 L1076.0 56.7 L1086.5 57.2 L1097.0 57.6 L1107.5 58.0 L1118.0 58.3 L1128.5 58.6 L1139.0 58.8 L1149.5 59.0 L1160.0 59.2" stroke="#9EA39C" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                      <text x="0" y="56" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="500" fill="#8B918C">
                        {"2016/17"}
                      </text>
                      <path d="M110.0 96.0 L110.0 96.0 L120.5 96.0 L131.0 96.0 L141.5 96.0 L152.0 96.0 L162.5 95.9 L173.0 95.9 L183.5 95.9 L194.0 95.9 L204.5 95.8 L215.0 95.8 L225.5 95.8 L236.0 95.7 L246.5 95.6 L257.0 95.5 L267.5 95.4 L278.0 95.3 L288.5 95.2 L299.0 95.0 L309.5 94.8 L320.0 94.6 L330.5 94.3 L341.0 94.0 L351.5 93.6 L362.0 93.2 L372.5 92.7 L383.0 92.2 L393.5 91.6 L404.0 90.9 L414.5 90.1 L425.0 89.2 L435.5 88.3 L446.0 87.2 L456.5 86.0 L467.0 84.8 L477.5 83.4 L488.0 81.9 L498.5 80.3 L509.0 78.6 L519.5 76.8 L530.0 75.0 L540.5 73.0 L551.0 70.9 L561.5 68.8 L572.0 66.7 L582.5 64.4 L593.0 62.2 L603.5 60.0 L614.0 57.8 L624.5 55.6 L635.0 53.5 L645.5 51.5 L656.0 49.6 L666.5 47.7 L677.0 46.1 L687.5 44.6 L698.0 43.3 L708.5 42.2 L719.0 41.3 L729.5 40.6 L740.0 40.2 L750.5 39.9 L761.0 40.0 L771.5 40.3 L782.0 40.8 L792.5 41.5 L803.0 42.5 L813.5 43.6 L824.0 45.0 L834.5 46.5 L845.0 48.2 L855.5 50.1 L866.0 52.0 L876.5 54.1 L887.0 56.2 L897.5 58.4 L908.0 60.6 L918.5 62.8 L929.0 65.1 L939.5 67.3 L950.0 69.4 L960.5 71.5 L971.0 73.5 L981.5 75.5 L992.0 77.4 L1002.5 79.1 L1013.0 80.8 L1023.5 82.3 L1034.0 83.8 L1044.5 85.1 L1055.0 86.4 L1065.5 87.5 L1076.0 88.5 L1086.5 89.5 L1097.0 90.3 L1107.5 91.1 L1118.0 91.7 L1128.5 92.3 L1139.0 92.9 L1149.5 93.3 L1160.0 93.7 L1160.0 96.0 Z" fill="#B9BDB6" fillOpacity=".10" />
                      <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M110.0 96.0 L120.5 96.0 L131.0 96.0 L141.5 96.0 L152.0 96.0 L162.5 95.9 L173.0 95.9 L183.5 95.9 L194.0 95.9 L204.5 95.8 L215.0 95.8 L225.5 95.8 L236.0 95.7 L246.5 95.6 L257.0 95.5 L267.5 95.4 L278.0 95.3 L288.5 95.2 L299.0 95.0 L309.5 94.8 L320.0 94.6 L330.5 94.3 L341.0 94.0 L351.5 93.6 L362.0 93.2 L372.5 92.7 L383.0 92.2 L393.5 91.6 L404.0 90.9 L414.5 90.1 L425.0 89.2 L435.5 88.3 L446.0 87.2 L456.5 86.0 L467.0 84.8 L477.5 83.4 L488.0 81.9 L498.5 80.3 L509.0 78.6 L519.5 76.8 L530.0 75.0 L540.5 73.0 L551.0 70.9 L561.5 68.8 L572.0 66.7 L582.5 64.4 L593.0 62.2 L603.5 60.0 L614.0 57.8 L624.5 55.6 L635.0 53.5 L645.5 51.5 L656.0 49.6 L666.5 47.7 L677.0 46.1 L687.5 44.6 L698.0 43.3 L708.5 42.2 L719.0 41.3 L729.5 40.6 L740.0 40.2 L750.5 39.9 L761.0 40.0 L771.5 40.3 L782.0 40.8 L792.5 41.5 L803.0 42.5 L813.5 43.6 L824.0 45.0 L834.5 46.5 L845.0 48.2 L855.5 50.1 L866.0 52.0 L876.5 54.1 L887.0 56.2 L897.5 58.4 L908.0 60.6 L918.5 62.8 L929.0 65.1 L939.5 67.3 L950.0 69.4 L960.5 71.5 L971.0 73.5 L981.5 75.5 L992.0 77.4 L1002.5 79.1 L1013.0 80.8 L1023.5 82.3 L1034.0 83.8 L1044.5 85.1 L1055.0 86.4 L1065.5 87.5 L1076.0 88.5 L1086.5 89.5 L1097.0 90.3 L1107.5 91.1 L1118.0 91.7 L1128.5 92.3 L1139.0 92.9 L1149.5 93.3 L1160.0 93.7" stroke="#9EA39C" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                      <text x="0" y="92" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="500" fill="#8B918C">
                        {"2017/18"}
                      </text>
                      <path d="M110.0 132.0 L110.0 132.0 L120.5 132.0 L131.0 132.0 L141.5 132.0 L152.0 131.9 L162.5 131.9 L173.0 131.9 L183.5 131.9 L194.0 131.8 L204.5 131.8 L215.0 131.8 L225.5 131.7 L236.0 131.6 L246.5 131.5 L257.0 131.4 L267.5 131.3 L278.0 131.2 L288.5 131.0 L299.0 130.8 L309.5 130.6 L320.0 130.3 L330.5 130.0 L341.0 129.6 L351.5 129.2 L362.0 128.7 L372.5 128.2 L383.0 127.5 L393.5 126.8 L404.0 126.1 L414.5 125.2 L425.0 124.2 L435.5 123.1 L446.0 122.0 L456.5 120.7 L467.0 119.3 L477.5 117.8 L488.0 116.2 L498.5 114.5 L509.0 112.7 L519.5 110.8 L530.0 108.8 L540.5 106.7 L551.0 104.5 L561.5 102.3 L572.0 100.1 L582.5 97.8 L593.0 95.6 L603.5 93.3 L614.0 91.1 L624.5 88.9 L635.0 86.9 L645.5 84.9 L656.0 83.1 L666.5 81.4 L677.0 79.8 L687.5 78.5 L698.0 77.3 L708.5 76.4 L719.0 75.7 L729.5 75.2 L740.0 75.0 L750.5 75.0 L761.0 75.3 L771.5 75.8 L782.0 76.5 L792.5 77.5 L803.0 78.6 L813.5 80.0 L824.0 81.6 L834.5 83.3 L845.0 85.1 L855.5 87.1 L866.0 89.2 L876.5 91.4 L887.0 93.6 L897.5 95.8 L908.0 98.1 L918.5 100.4 L929.0 102.6 L939.5 104.8 L950.0 106.9 L960.5 109.0 L971.0 111.0 L981.5 112.9 L992.0 114.7 L1002.5 116.4 L1013.0 118.0 L1023.5 119.5 L1034.0 120.8 L1044.5 122.1 L1055.0 123.3 L1065.5 124.3 L1076.0 125.3 L1086.5 126.2 L1097.0 126.9 L1107.5 127.6 L1118.0 128.2 L1128.5 128.8 L1139.0 129.2 L1149.5 129.7 L1160.0 130.0 L1160.0 132.0 Z" fill="#B9BDB6" fillOpacity=".10" />
                      <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M110.0 132.0 L120.5 132.0 L131.0 132.0 L141.5 132.0 L152.0 131.9 L162.5 131.9 L173.0 131.9 L183.5 131.9 L194.0 131.8 L204.5 131.8 L215.0 131.8 L225.5 131.7 L236.0 131.6 L246.5 131.5 L257.0 131.4 L267.5 131.3 L278.0 131.2 L288.5 131.0 L299.0 130.8 L309.5 130.6 L320.0 130.3 L330.5 130.0 L341.0 129.6 L351.5 129.2 L362.0 128.7 L372.5 128.2 L383.0 127.5 L393.5 126.8 L404.0 126.1 L414.5 125.2 L425.0 124.2 L435.5 123.1 L446.0 122.0 L456.5 120.7 L467.0 119.3 L477.5 117.8 L488.0 116.2 L498.5 114.5 L509.0 112.7 L519.5 110.8 L530.0 108.8 L540.5 106.7 L551.0 104.5 L561.5 102.3 L572.0 100.1 L582.5 97.8 L593.0 95.6 L603.5 93.3 L614.0 91.1 L624.5 88.9 L635.0 86.9 L645.5 84.9 L656.0 83.1 L666.5 81.4 L677.0 79.8 L687.5 78.5 L698.0 77.3 L708.5 76.4 L719.0 75.7 L729.5 75.2 L740.0 75.0 L750.5 75.0 L761.0 75.3 L771.5 75.8 L782.0 76.5 L792.5 77.5 L803.0 78.6 L813.5 80.0 L824.0 81.6 L834.5 83.3 L845.0 85.1 L855.5 87.1 L866.0 89.2 L876.5 91.4 L887.0 93.6 L897.5 95.8 L908.0 98.1 L918.5 100.4 L929.0 102.6 L939.5 104.8 L950.0 106.9 L960.5 109.0 L971.0 111.0 L981.5 112.9 L992.0 114.7 L1002.5 116.4 L1013.0 118.0 L1023.5 119.5 L1034.0 120.8 L1044.5 122.1 L1055.0 123.3 L1065.5 124.3 L1076.0 125.3 L1086.5 126.2 L1097.0 126.9 L1107.5 127.6 L1118.0 128.2 L1128.5 128.8 L1139.0 129.2 L1149.5 129.7 L1160.0 130.0" stroke="#9EA39C" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                      <text x="0" y="128" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="500" fill="#8B918C">
                        {"2018/19"}
                      </text>
                      <path d="M110.0 168.0 L110.0 168.0 L120.5 168.0 L131.0 167.9 L141.5 167.9 L152.0 167.9 L162.5 167.9 L173.0 167.9 L183.5 167.8 L194.0 167.8 L204.5 167.7 L215.0 167.7 L225.5 167.6 L236.0 167.5 L246.5 167.4 L257.0 167.2 L267.5 167.1 L278.0 166.9 L288.5 166.7 L299.0 166.4 L309.5 166.1 L320.0 165.7 L330.5 165.3 L341.0 164.8 L351.5 164.3 L362.0 163.7 L372.5 163.0 L383.0 162.2 L393.5 161.3 L404.0 160.3 L414.5 159.2 L425.0 158.0 L435.5 156.7 L446.0 155.2 L456.5 153.7 L467.0 152.0 L477.5 150.1 L488.0 148.2 L498.5 146.1 L509.0 144.0 L519.5 141.7 L530.0 139.3 L540.5 136.9 L551.0 134.4 L561.5 131.9 L572.0 129.3 L582.5 126.7 L593.0 124.1 L603.5 121.6 L614.0 119.2 L624.5 116.8 L635.0 114.5 L645.5 112.4 L656.0 110.5 L666.5 108.7 L677.0 107.2 L687.5 105.8 L698.0 104.7 L708.5 103.9 L719.0 103.4 L729.5 103.1 L740.0 103.1 L750.5 103.3 L761.0 103.9 L771.5 104.7 L782.0 105.8 L792.5 107.1 L803.0 108.6 L813.5 110.4 L824.0 112.3 L834.5 114.4 L845.0 116.7 L855.5 119.1 L866.0 121.5 L876.5 124.0 L887.0 126.6 L897.5 129.2 L908.0 131.8 L918.5 134.3 L929.0 136.8 L939.5 139.3 L950.0 141.6 L960.5 143.9 L971.0 146.1 L981.5 148.1 L992.0 150.1 L1002.5 151.9 L1013.0 153.6 L1023.5 155.2 L1034.0 156.6 L1044.5 158.0 L1055.0 159.2 L1065.5 160.3 L1076.0 161.3 L1086.5 162.2 L1097.0 162.9 L1107.5 163.7 L1118.0 164.3 L1128.5 164.8 L1139.0 165.3 L1149.5 165.7 L1160.0 166.1 L1160.0 168.0 Z" fill="#3E7F35" fillOpacity=".16" />
                      <path className="draw" pathLength="1" style={{"--d":"3"} as any} d="M110.0 168.0 L120.5 168.0 L131.0 167.9 L141.5 167.9 L152.0 167.9 L162.5 167.9 L173.0 167.9 L183.5 167.8 L194.0 167.8 L204.5 167.7 L215.0 167.7 L225.5 167.6 L236.0 167.5 L246.5 167.4 L257.0 167.2 L267.5 167.1 L278.0 166.9 L288.5 166.7 L299.0 166.4 L309.5 166.1 L320.0 165.7 L330.5 165.3 L341.0 164.8 L351.5 164.3 L362.0 163.7 L372.5 163.0 L383.0 162.2 L393.5 161.3 L404.0 160.3 L414.5 159.2 L425.0 158.0 L435.5 156.7 L446.0 155.2 L456.5 153.7 L467.0 152.0 L477.5 150.1 L488.0 148.2 L498.5 146.1 L509.0 144.0 L519.5 141.7 L530.0 139.3 L540.5 136.9 L551.0 134.4 L561.5 131.9 L572.0 129.3 L582.5 126.7 L593.0 124.1 L603.5 121.6 L614.0 119.2 L624.5 116.8 L635.0 114.5 L645.5 112.4 L656.0 110.5 L666.5 108.7 L677.0 107.2 L687.5 105.8 L698.0 104.7 L708.5 103.9 L719.0 103.4 L729.5 103.1 L740.0 103.1 L750.5 103.3 L761.0 103.9 L771.5 104.7 L782.0 105.8 L792.5 107.1 L803.0 108.6 L813.5 110.4 L824.0 112.3 L834.5 114.4 L845.0 116.7 L855.5 119.1 L866.0 121.5 L876.5 124.0 L887.0 126.6 L897.5 129.2 L908.0 131.8 L918.5 134.3 L929.0 136.8 L939.5 139.3 L950.0 141.6 L960.5 143.9 L971.0 146.1 L981.5 148.1 L992.0 150.1 L1002.5 151.9 L1013.0 153.6 L1023.5 155.2 L1034.0 156.6 L1044.5 158.0 L1055.0 159.2 L1065.5 160.3 L1076.0 161.3 L1086.5 162.2 L1097.0 162.9 L1107.5 163.7 L1118.0 164.3 L1128.5 164.8 L1139.0 165.3 L1149.5 165.7 L1160.0 166.1" stroke="#3E7F35" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
                      <text x="0" y="164" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#141A16">
                        {"2019/20"}
                      </text>
                      <path d="M110.0 204.0 L110.0 204.0 L120.5 204.0 L131.0 203.9 L141.5 203.9 L152.0 203.9 L162.5 203.9 L173.0 203.8 L183.5 203.8 L194.0 203.8 L204.5 203.7 L215.0 203.6 L225.5 203.5 L236.0 203.4 L246.5 203.3 L257.0 203.2 L267.5 203.0 L278.0 202.8 L288.5 202.6 L299.0 202.3 L309.5 202.0 L320.0 201.6 L330.5 201.2 L341.0 200.7 L351.5 200.1 L362.0 199.5 L372.5 198.8 L383.0 198.0 L393.5 197.1 L404.0 196.1 L414.5 195.0 L425.0 193.8 L435.5 192.5 L446.0 191.1 L456.5 189.6 L467.0 187.9 L477.5 186.2 L488.0 184.3 L498.5 182.4 L509.0 180.3 L519.5 178.2 L530.0 176.0 L540.5 173.7 L551.0 171.4 L561.5 169.0 L572.0 166.7 L582.5 164.4 L593.0 162.1 L603.5 159.8 L614.0 157.7 L624.5 155.6 L635.0 153.7 L645.5 151.9 L656.0 150.3 L666.5 148.9 L677.0 147.7 L687.5 146.7 L698.0 145.9 L708.5 145.4 L719.0 145.1 L729.5 145.1 L740.0 145.3 L750.5 145.8 L761.0 146.5 L771.5 147.4 L782.0 148.6 L792.5 150.0 L803.0 151.6 L813.5 153.3 L824.0 155.2 L834.5 157.3 L845.0 159.4 L855.5 161.6 L866.0 163.9 L876.5 166.2 L887.0 168.6 L897.5 170.9 L908.0 173.2 L918.5 175.5 L929.0 177.7 L939.5 179.9 L950.0 182.0 L960.5 183.9 L971.0 185.8 L981.5 187.6 L992.0 189.3 L1002.5 190.8 L1013.0 192.2 L1023.5 193.6 L1034.0 194.8 L1044.5 195.9 L1055.0 196.9 L1065.5 197.8 L1076.0 198.6 L1086.5 199.4 L1097.0 200.0 L1107.5 200.6 L1118.0 201.1 L1128.5 201.5 L1139.0 201.9 L1149.5 202.2 L1160.0 202.5 L1160.0 204.0 Z" fill="#B9BDB6" fillOpacity=".10" />
                      <path className="draw" pathLength="1" style={{"--d":"3"} as any} d="M110.0 204.0 L120.5 204.0 L131.0 203.9 L141.5 203.9 L152.0 203.9 L162.5 203.9 L173.0 203.8 L183.5 203.8 L194.0 203.8 L204.5 203.7 L215.0 203.6 L225.5 203.5 L236.0 203.4 L246.5 203.3 L257.0 203.2 L267.5 203.0 L278.0 202.8 L288.5 202.6 L299.0 202.3 L309.5 202.0 L320.0 201.6 L330.5 201.2 L341.0 200.7 L351.5 200.1 L362.0 199.5 L372.5 198.8 L383.0 198.0 L393.5 197.1 L404.0 196.1 L414.5 195.0 L425.0 193.8 L435.5 192.5 L446.0 191.1 L456.5 189.6 L467.0 187.9 L477.5 186.2 L488.0 184.3 L498.5 182.4 L509.0 180.3 L519.5 178.2 L530.0 176.0 L540.5 173.7 L551.0 171.4 L561.5 169.0 L572.0 166.7 L582.5 164.4 L593.0 162.1 L603.5 159.8 L614.0 157.7 L624.5 155.6 L635.0 153.7 L645.5 151.9 L656.0 150.3 L666.5 148.9 L677.0 147.7 L687.5 146.7 L698.0 145.9 L708.5 145.4 L719.0 145.1 L729.5 145.1 L740.0 145.3 L750.5 145.8 L761.0 146.5 L771.5 147.4 L782.0 148.6 L792.5 150.0 L803.0 151.6 L813.5 153.3 L824.0 155.2 L834.5 157.3 L845.0 159.4 L855.5 161.6 L866.0 163.9 L876.5 166.2 L887.0 168.6 L897.5 170.9 L908.0 173.2 L918.5 175.5 L929.0 177.7 L939.5 179.9 L950.0 182.0 L960.5 183.9 L971.0 185.8 L981.5 187.6 L992.0 189.3 L1002.5 190.8 L1013.0 192.2 L1023.5 193.6 L1034.0 194.8 L1044.5 195.9 L1055.0 196.9 L1065.5 197.8 L1076.0 198.6 L1086.5 199.4 L1097.0 200.0 L1107.5 200.6 L1118.0 201.1 L1128.5 201.5 L1139.0 201.9 L1149.5 202.2 L1160.0 202.5" stroke="#9EA39C" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                      <text x="0" y="200" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="500" fill="#8B918C">
                        {"2020/21"}
                      </text>
                      <path d="M110.0 240.0 L110.0 240.0 L120.5 239.9 L131.0 239.9 L141.5 239.9 L152.0 239.9 L162.5 239.8 L173.0 239.8 L183.5 239.8 L194.0 239.7 L204.5 239.6 L215.0 239.5 L225.5 239.4 L236.0 239.3 L246.5 239.2 L257.0 239.0 L267.5 238.8 L278.0 238.6 L288.5 238.3 L299.0 238.0 L309.5 237.6 L320.0 237.2 L330.5 236.7 L341.0 236.1 L351.5 235.5 L362.0 234.8 L372.5 234.0 L383.0 233.1 L393.5 232.1 L404.0 231.0 L414.5 229.8 L425.0 228.4 L435.5 227.0 L446.0 225.5 L456.5 223.8 L467.0 222.0 L477.5 220.1 L488.0 218.2 L498.5 216.1 L509.0 213.9 L519.5 211.7 L530.0 209.4 L540.5 207.0 L551.0 204.7 L561.5 202.3 L572.0 199.9 L582.5 197.6 L593.0 195.3 L603.5 193.1 L614.0 191.0 L624.5 189.0 L635.0 187.2 L645.5 185.5 L656.0 184.1 L666.5 182.8 L677.0 181.8 L687.5 181.0 L698.0 180.4 L708.5 180.1 L719.0 180.1 L729.5 180.3 L740.0 180.8 L750.5 181.5 L761.0 182.4 L771.5 183.6 L782.0 185.0 L792.5 186.6 L803.0 188.3 L813.5 190.3 L824.0 192.3 L834.5 194.5 L845.0 196.7 L855.5 199.1 L866.0 201.4 L876.5 203.8 L887.0 206.2 L897.5 208.5 L908.0 210.9 L918.5 213.1 L929.0 215.3 L939.5 217.4 L950.0 219.4 L960.5 221.4 L971.0 223.2 L981.5 224.9 L992.0 226.5 L1002.5 227.9 L1013.0 229.3 L1023.5 230.5 L1034.0 231.7 L1044.5 232.7 L1055.0 233.6 L1065.5 234.5 L1076.0 235.2 L1086.5 235.9 L1097.0 236.5 L1107.5 237.0 L1118.0 237.4 L1128.5 237.8 L1139.0 238.2 L1149.5 238.5 L1160.0 238.7 L1160.0 240.0 Z" fill="#B9BDB6" fillOpacity=".10" />
                      <path className="draw" pathLength="1" style={{"--d":"4"} as any} d="M110.0 240.0 L120.5 239.9 L131.0 239.9 L141.5 239.9 L152.0 239.9 L162.5 239.8 L173.0 239.8 L183.5 239.8 L194.0 239.7 L204.5 239.6 L215.0 239.5 L225.5 239.4 L236.0 239.3 L246.5 239.2 L257.0 239.0 L267.5 238.8 L278.0 238.6 L288.5 238.3 L299.0 238.0 L309.5 237.6 L320.0 237.2 L330.5 236.7 L341.0 236.1 L351.5 235.5 L362.0 234.8 L372.5 234.0 L383.0 233.1 L393.5 232.1 L404.0 231.0 L414.5 229.8 L425.0 228.4 L435.5 227.0 L446.0 225.5 L456.5 223.8 L467.0 222.0 L477.5 220.1 L488.0 218.2 L498.5 216.1 L509.0 213.9 L519.5 211.7 L530.0 209.4 L540.5 207.0 L551.0 204.7 L561.5 202.3 L572.0 199.9 L582.5 197.6 L593.0 195.3 L603.5 193.1 L614.0 191.0 L624.5 189.0 L635.0 187.2 L645.5 185.5 L656.0 184.1 L666.5 182.8 L677.0 181.8 L687.5 181.0 L698.0 180.4 L708.5 180.1 L719.0 180.1 L729.5 180.3 L740.0 180.8 L750.5 181.5 L761.0 182.4 L771.5 183.6 L782.0 185.0 L792.5 186.6 L803.0 188.3 L813.5 190.3 L824.0 192.3 L834.5 194.5 L845.0 196.7 L855.5 199.1 L866.0 201.4 L876.5 203.8 L887.0 206.2 L897.5 208.5 L908.0 210.9 L918.5 213.1 L929.0 215.3 L939.5 217.4 L950.0 219.4 L960.5 221.4 L971.0 223.2 L981.5 224.9 L992.0 226.5 L1002.5 227.9 L1013.0 229.3 L1023.5 230.5 L1034.0 231.7 L1044.5 232.7 L1055.0 233.6 L1065.5 234.5 L1076.0 235.2 L1086.5 235.9 L1097.0 236.5 L1107.5 237.0 L1118.0 237.4 L1128.5 237.8 L1139.0 238.2 L1149.5 238.5 L1160.0 238.7" stroke="#9EA39C" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                      <text x="0" y="236" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="500" fill="#8B918C">
                        {"2021/22"}
                      </text>
                      <path d="M110.0 276.0 L110.0 276.0 L120.5 275.9 L131.0 275.9 L141.5 275.9 L152.0 275.9 L162.5 275.9 L173.0 275.8 L183.5 275.8 L194.0 275.7 L204.5 275.7 L215.0 275.6 L225.5 275.5 L236.0 275.4 L246.5 275.3 L257.0 275.1 L267.5 274.9 L278.0 274.7 L288.5 274.5 L299.0 274.2 L309.5 273.9 L320.0 273.5 L330.5 273.1 L341.0 272.6 L351.5 272.1 L362.0 271.5 L372.5 270.8 L383.0 270.1 L393.5 269.3 L404.0 268.3 L414.5 267.4 L425.0 266.3 L435.5 265.1 L446.0 263.9 L456.5 262.5 L467.0 261.1 L477.5 259.6 L488.0 258.1 L498.5 256.4 L509.0 254.8 L519.5 253.0 L530.0 251.3 L540.5 249.5 L551.0 247.7 L561.5 245.9 L572.0 244.1 L582.5 242.4 L593.0 240.7 L603.5 239.1 L614.0 237.6 L624.5 236.2 L635.0 235.0 L645.5 233.9 L656.0 232.9 L666.5 232.1 L677.0 231.5 L687.5 231.1 L698.0 230.8 L708.5 230.8 L719.0 230.9 L729.5 231.2 L740.0 231.8 L750.5 232.5 L761.0 233.4 L771.5 234.4 L782.0 235.6 L792.5 236.9 L803.0 239.2 L813.5 241.6 L824.0 244.0 L834.5 246.3 L845.0 248.6 L855.5 250.9 L866.0 253.1 L876.5 255.2 L887.0 257.2 L897.5 259.1 L908.0 260.9 L918.5 262.6 L929.0 264.2 L939.5 265.6 L950.0 266.9 L960.5 268.1 L971.0 269.2 L981.5 270.1 L992.0 271.0 L1002.5 271.7 L1013.0 272.4 L1023.5 273.0 L1034.0 273.5 L1044.5 273.8 L1055.0 274.1 L1065.5 274.4 L1076.0 274.6 L1086.5 274.8 L1097.0 275.0 L1107.5 275.1 L1118.0 275.3 L1128.5 275.4 L1139.0 275.5 L1149.5 275.6 L1160.0 275.6 L1160.0 276.0 Z" fill="#F29B1E" fillOpacity=".16" />
                      <path className="draw" pathLength="1" style={{"--d":"4"} as any} d="M110.0 276.0 L120.5 275.9 L131.0 275.9 L141.5 275.9 L152.0 275.9 L162.5 275.9 L173.0 275.8 L183.5 275.8 L194.0 275.7 L204.5 275.7 L215.0 275.6 L225.5 275.5 L236.0 275.4 L246.5 275.3 L257.0 275.1 L267.5 274.9 L278.0 274.7 L288.5 274.5 L299.0 274.2 L309.5 273.9 L320.0 273.5 L330.5 273.1 L341.0 272.6 L351.5 272.1 L362.0 271.5 L372.5 270.8 L383.0 270.1 L393.5 269.3 L404.0 268.3 L414.5 267.4 L425.0 266.3 L435.5 265.1 L446.0 263.9 L456.5 262.5 L467.0 261.1 L477.5 259.6 L488.0 258.1 L498.5 256.4 L509.0 254.8 L519.5 253.0 L530.0 251.3 L540.5 249.5 L551.0 247.7 L561.5 245.9 L572.0 244.1 L582.5 242.4 L593.0 240.7 L603.5 239.1 L614.0 237.6 L624.5 236.2 L635.0 235.0 L645.5 233.9 L656.0 232.9 L666.5 232.1 L677.0 231.5 L687.5 231.1 L698.0 230.8 L708.5 230.8 L719.0 230.9 L729.5 231.2 L740.0 231.8 L750.5 232.5 L761.0 233.4 L771.5 234.4 L782.0 235.6 L792.5 236.9 L803.0 239.2 L813.5 241.6 L824.0 244.0 L834.5 246.3 L845.0 248.6 L855.5 250.9 L866.0 253.1 L876.5 255.2 L887.0 257.2 L897.5 259.1 L908.0 260.9 L918.5 262.6 L929.0 264.2 L939.5 265.6 L950.0 266.9 L960.5 268.1 L971.0 269.2 L981.5 270.1 L992.0 271.0 L1002.5 271.7 L1013.0 272.4 L1023.5 273.0 L1034.0 273.5 L1044.5 273.8 L1055.0 274.1 L1065.5 274.4 L1076.0 274.6 L1086.5 274.8 L1097.0 275.0 L1107.5 275.1 L1118.0 275.3 L1128.5 275.4 L1139.0 275.5 L1149.5 275.6 L1160.0 275.6" stroke="#D9762B" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
                      <text x="0" y="272" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#141A16">
                        {"2022/23"}
                      </text>
                      <path d="M110.0 312.0 L110.0 311.9 L120.5 311.9 L131.0 311.9 L141.5 311.8 L152.0 311.8 L162.5 311.8 L173.0 311.7 L183.5 311.6 L194.0 311.5 L204.5 311.4 L215.0 311.3 L225.5 311.2 L236.0 311.0 L246.5 310.8 L257.0 310.6 L267.5 310.3 L278.0 310.0 L288.5 309.6 L299.0 309.1 L309.5 308.6 L320.0 308.1 L330.5 307.4 L341.0 306.7 L351.5 305.9 L362.0 305.0 L372.5 304.0 L383.0 302.9 L393.5 301.6 L404.0 300.3 L414.5 298.8 L425.0 297.3 L435.5 295.6 L446.0 293.8 L456.5 291.8 L467.0 289.8 L477.5 287.7 L488.0 285.4 L498.5 283.1 L509.0 280.8 L519.5 278.4 L530.0 275.9 L540.5 273.5 L551.0 271.0 L561.5 268.6 L572.0 266.2 L582.5 263.9 L593.0 261.8 L603.5 259.7 L614.0 257.8 L624.5 256.0 L635.0 254.5 L645.5 253.2 L656.0 252.1 L666.5 251.2 L677.0 250.6 L687.5 250.2 L698.0 250.1 L708.5 250.3 L719.0 250.8 L729.5 251.4 L740.0 252.4 L750.5 253.6 L761.0 255.0 L771.5 256.6 L782.0 258.4 L792.5 260.3 L803.0 262.4 L813.5 264.7 L824.0 267.0 L834.5 269.4 L845.0 271.8 L855.5 274.2 L866.0 276.7 L876.5 279.1 L887.0 281.5 L897.5 283.9 L908.0 286.2 L918.5 288.4 L929.0 290.5 L939.5 292.5 L950.0 294.3 L960.5 296.1 L971.0 297.8 L981.5 299.3 L992.0 300.7 L1002.5 302.0 L1013.0 303.2 L1023.5 304.3 L1034.0 305.3 L1044.5 306.2 L1055.0 307.0 L1065.5 307.7 L1076.0 308.3 L1086.5 308.8 L1097.0 309.3 L1107.5 309.7 L1118.0 310.1 L1128.5 310.4 L1139.0 310.6 L1149.5 310.9 L1160.0 311.1 L1160.0 312.0 Z" fill="#B9BDB6" fillOpacity=".10" />
                      <path className="draw" pathLength="1" style={{"--d":"4"} as any} d="M110.0 311.9 L120.5 311.9 L131.0 311.9 L141.5 311.8 L152.0 311.8 L162.5 311.8 L173.0 311.7 L183.5 311.6 L194.0 311.5 L204.5 311.4 L215.0 311.3 L225.5 311.2 L236.0 311.0 L246.5 310.8 L257.0 310.6 L267.5 310.3 L278.0 310.0 L288.5 309.6 L299.0 309.1 L309.5 308.6 L320.0 308.1 L330.5 307.4 L341.0 306.7 L351.5 305.9 L362.0 305.0 L372.5 304.0 L383.0 302.9 L393.5 301.6 L404.0 300.3 L414.5 298.8 L425.0 297.3 L435.5 295.6 L446.0 293.8 L456.5 291.8 L467.0 289.8 L477.5 287.7 L488.0 285.4 L498.5 283.1 L509.0 280.8 L519.5 278.4 L530.0 275.9 L540.5 273.5 L551.0 271.0 L561.5 268.6 L572.0 266.2 L582.5 263.9 L593.0 261.8 L603.5 259.7 L614.0 257.8 L624.5 256.0 L635.0 254.5 L645.5 253.2 L656.0 252.1 L666.5 251.2 L677.0 250.6 L687.5 250.2 L698.0 250.1 L708.5 250.3 L719.0 250.8 L729.5 251.4 L740.0 252.4 L750.5 253.6 L761.0 255.0 L771.5 256.6 L782.0 258.4 L792.5 260.3 L803.0 262.4 L813.5 264.7 L824.0 267.0 L834.5 269.4 L845.0 271.8 L855.5 274.2 L866.0 276.7 L876.5 279.1 L887.0 281.5 L897.5 283.9 L908.0 286.2 L918.5 288.4 L929.0 290.5 L939.5 292.5 L950.0 294.3 L960.5 296.1 L971.0 297.8 L981.5 299.3 L992.0 300.7 L1002.5 302.0 L1013.0 303.2 L1023.5 304.3 L1034.0 305.3 L1044.5 306.2 L1055.0 307.0 L1065.5 307.7 L1076.0 308.3 L1086.5 308.8 L1097.0 309.3 L1107.5 309.7 L1118.0 310.1 L1128.5 310.4 L1139.0 310.6 L1149.5 310.9 L1160.0 311.1" stroke="#9EA39C" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                      <text x="0" y="308" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="500" fill="#8B918C">
                        {"2023/24"}
                      </text>
                      <path d="M110.0 348.0 L110.0 348.0 L120.5 348.0 L131.0 348.0 L141.5 348.0 L152.0 347.9 L162.5 347.9 L173.0 347.9 L183.5 347.9 L194.0 347.9 L204.5 347.8 L215.0 347.8 L225.5 347.7 L236.0 347.7 L246.5 347.6 L257.0 347.5 L267.5 347.4 L278.0 347.2 L288.5 347.1 L299.0 346.9 L309.5 346.7 L320.0 346.4 L330.5 346.1 L341.0 345.7 L351.5 345.3 L362.0 344.9 L372.5 344.3 L383.0 343.7 L393.5 343.0 L404.0 342.2 L414.5 341.4 L425.0 340.4 L435.5 339.3 L446.0 338.1 L456.5 336.8 L467.0 335.4 L477.5 333.9 L488.0 332.2 L498.5 330.4 L509.0 328.5 L519.5 326.5 L530.0 324.4 L540.5 322.2 L551.0 319.9 L561.5 317.5 L572.0 315.1 L582.5 312.6 L593.0 310.1 L603.5 307.7 L614.0 305.2 L624.5 302.7 L635.0 300.4 L645.5 298.1 L656.0 295.9 L666.5 293.9 L677.0 292.1 L687.5 290.4 L698.0 288.9 L708.5 287.7 L719.0 286.7 L729.5 285.9 L740.0 285.4 L750.5 285.2 L761.0 285.2 L771.5 285.5 L782.0 286.1 L792.5 286.9 L803.0 288.0 L813.5 289.3 L824.0 290.8 L834.5 292.6 L845.0 294.5 L855.5 296.5 L866.0 298.7 L876.5 301.0 L887.0 303.4 L897.5 305.9 L908.0 308.4 L918.5 310.8 L929.0 313.3 L939.5 315.8 L950.0 318.2 L960.5 320.6 L971.0 322.8 L981.5 325.0 L992.0 327.1 L1002.5 329.1 L1013.0 330.9 L1023.5 332.7 L1034.0 334.3 L1044.5 335.8 L1055.0 337.2 L1065.5 338.5 L1076.0 339.6 L1086.5 340.7 L1097.0 341.6 L1107.5 342.5 L1118.0 343.2 L1128.5 343.9 L1139.0 344.5 L1149.5 345.0 L1160.0 345.5 L1160.0 348.0 Z" fill="#B9BDB6" fillOpacity=".10" />
                      <path className="draw" pathLength="1" style={{"--d":"5"} as any} d="M110.0 348.0 L120.5 348.0 L131.0 348.0 L141.5 348.0 L152.0 347.9 L162.5 347.9 L173.0 347.9 L183.5 347.9 L194.0 347.9 L204.5 347.8 L215.0 347.8 L225.5 347.7 L236.0 347.7 L246.5 347.6 L257.0 347.5 L267.5 347.4 L278.0 347.2 L288.5 347.1 L299.0 346.9 L309.5 346.7 L320.0 346.4 L330.5 346.1 L341.0 345.7 L351.5 345.3 L362.0 344.9 L372.5 344.3 L383.0 343.7 L393.5 343.0 L404.0 342.2 L414.5 341.4 L425.0 340.4 L435.5 339.3 L446.0 338.1 L456.5 336.8 L467.0 335.4 L477.5 333.9 L488.0 332.2 L498.5 330.4 L509.0 328.5 L519.5 326.5 L530.0 324.4 L540.5 322.2 L551.0 319.9 L561.5 317.5 L572.0 315.1 L582.5 312.6 L593.0 310.1 L603.5 307.7 L614.0 305.2 L624.5 302.7 L635.0 300.4 L645.5 298.1 L656.0 295.9 L666.5 293.9 L677.0 292.1 L687.5 290.4 L698.0 288.9 L708.5 287.7 L719.0 286.7 L729.5 285.9 L740.0 285.4 L750.5 285.2 L761.0 285.2 L771.5 285.5 L782.0 286.1 L792.5 286.9 L803.0 288.0 L813.5 289.3 L824.0 290.8 L834.5 292.6 L845.0 294.5 L855.5 296.5 L866.0 298.7 L876.5 301.0 L887.0 303.4 L897.5 305.9 L908.0 308.4 L918.5 310.8 L929.0 313.3 L939.5 315.8 L950.0 318.2 L960.5 320.6 L971.0 322.8 L981.5 325.0 L992.0 327.1 L1002.5 329.1 L1013.0 330.9 L1023.5 332.7 L1034.0 334.3 L1044.5 335.8 L1055.0 337.2 L1065.5 338.5 L1076.0 339.6 L1086.5 340.7 L1097.0 341.6 L1107.5 342.5 L1118.0 343.2 L1128.5 343.9 L1139.0 344.5 L1149.5 345.0 L1160.0 345.5" stroke="#9EA39C" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                      <text x="0" y="344" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="500" fill="#8B918C">
                        {"2024/25"}
                      </text>
                      <path d="M110.0 384.0 L110.0 384.0 L120.5 384.0 L131.0 384.0 L141.5 384.0 L152.0 383.9 L162.5 383.9 L173.0 383.9 L183.5 383.9 L194.0 383.9 L204.5 383.8 L215.0 383.8 L225.5 383.7 L236.0 383.6 L246.5 383.6 L257.0 383.5 L267.5 383.3 L278.0 383.2 L288.5 383.0 L299.0 382.8 L309.5 382.6 L320.0 382.4 L330.5 382.1 L341.0 381.7 L351.5 381.3 L362.0 380.8 L372.5 380.3 L383.0 379.7 L383.0 384.0 Z" fill="#141A16" fillOpacity=".10" />
                      <path className="draw" pathLength="1" style={{"--d":"5"} as any} d="M110.0 384.0 L120.5 384.0 L131.0 384.0 L141.5 384.0 L152.0 383.9 L162.5 383.9 L173.0 383.9 L183.5 383.9 L194.0 383.9 L204.5 383.8 L215.0 383.8 L225.5 383.7 L236.0 383.6 L246.5 383.6 L257.0 383.5 L267.5 383.3 L278.0 383.2 L288.5 383.0 L299.0 382.8 L309.5 382.6 L320.0 382.4 L330.5 382.1 L341.0 381.7 L351.5 381.3 L362.0 380.8 L372.5 380.3 L383.0 379.7" stroke="#141A16" strokeWidth="2.6" fill="none" strokeLinejoin="round" />
                      <text x="0" y="380" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#141A16">
                        {"This season"}
                      </text>
                      <text x="110.0" y="418" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                        {"Nov"}
                      </text>
                      <text x="285.0" y="418" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                        {"Dec"}
                      </text>
                      <text x="460.0" y="418" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                        {"Jan"}
                      </text>
                      <text x="635.0" y="418" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                        {"Feb"}
                      </text>
                      <text x="810.0" y="418" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                        {"Mar"}
                      </text>
                      <text x="985.0" y="418" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                        {"Apr"}
                      </text>
                      <text x="1160.0" y="418" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fill="#8B918C">
                        {"May"}
                      </text>
                      <g fontFamily="Hanken Grotesk, sans-serif" fontSize="12" fontWeight="600">
                        <text x="790" y="116" fill="#3E7F35">
                          {"Best season"}
                        </text>
                        <text x="820" y="246" fill="#B4660B">
                          {"Heat in April, grain cut short"}
                        </text>
                        <text x="330" y="354" fill="#141A16">
                          {"Today, ahead of normal"}
                        </text>
                      </g>
                    </svg>
                  </section>
                  <section className="grid hair rise" style={{"--d":"3","gridTemplateColumns":"repeat(3, minmax(0, 1fr))","paddingTop":"32px"} as any} aria-label="Three things we found">
                    <div className="find" style={{"paddingLeft":"4px"} as any}>
                      <span className="sec">
                        {"LATE SOWING, BEFORE THIS SEASON"}
                      </span>
                      <span className="hugeNum">
                        {"4 "}
                        <span style={{"fontSize":"26px","color":"var(--muted)","letterSpacing":"0"} as any}>
                          {"of 10 seasons"}
                        </span>
                      </span>
                      <p className="txt">
                        {"Green-up dates show sowing around 20 Nov in those years, 2 weeks late. This season you sowed on 5 Nov."}
                      </p>
                      <div className="seasondots" aria-hidden="true">
                        <i className="ok" />
                        <i className="ok" />
                        <i className="weak" />
                        <i className="ok" />
                        <i className="ok" />
                        <i className="weak" />
                        <i className="weak" />
                        <i className="ok" />
                        <i className="weak" />
                        <i className="ok" />
                      </div>
                      <span className="pq sat">
                        {"From green-up dates, 10 seasons"}
                      </span>
                    </div>
                    <div className="find">
                      <span className="sec">
                        {"HEAT HIT THE GRAIN"}
                      </span>
                      <span className="hugeNum">
                        {"4 "}
                        <span style={{"fontSize":"26px","color":"var(--muted)","letterSpacing":"0"} as any}>
                          {"of 10 springs"}
                        </span>
                      </span>
                      <p className="txt">
                        {"In those years, days over 32 °C landed while the grain was filling. It is the main reason your harvest swings."}
                      </p>
                      <div className="seasondots" aria-hidden="true">
                        <i className="hit" />
                        <i className="" />
                        <i className="" />
                        <i className="hit" />
                        <i className="" />
                        <i className="" />
                        <i className="hit" />
                        <i className="" />
                        <i className="" />
                        <i className="hit" />
                      </div>
                      <span className="pq sat">
                        {"NASA POWER daily max temperature"}
                      </span>
                    </div>
                    <div className="find">
                      <span className="sec">
                        {"THE WEAK CORNER IS OLD"}
                      </span>
                      <span className="hugeNum">
                        {"7 "}
                        <span style={{"fontSize":"26px","color":"var(--muted)","letterSpacing":"0"} as any}>
                          {"of 10 seasons"}
                        </span>
                      </span>
                      <p className="txt">
                        {"The north-east corner was the least green part of the field. It is also the tail of your water. It is not new, and it is fixable."}
                      </p>
                      <div className="seasondots" aria-hidden="true">
                        <i className="weak" />
                        <i className="weak" />
                        <i className="weak" />
                        <i className="ok" />
                        <i className="weak" />
                        <i className="weak" />
                        <i className="weak" />
                        <i className="ok" />
                        <i className="ok" />
                        <i className="weak" />
                      </div>
                      <span className="pq sat">
                        {"HLS 30 m, per square"}
                      </span>
                    </div>
                  </section>
                  <section className="grid hair rise" style={{"--d":"5","gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"56px","paddingTop":"32px"} as any}>
                    <div className="col" style={{"gap":"16px"} as any}>
                      <span className="sec">
                        {"PROOF · WOULD BEZRA HAVE WARNED YOU?"}
                      </span>
                      <p className="mid">
                        {"April 2023: a heat wave from the 9th to the 12th. Using only data from before it, Bezra would have warned you on 4 April."}
                      </p>
                      <div style={{"position":"relative","height":"56px"} as any} role="img" aria-label="Timeline of April 2023. Warning on April 4, heat wave April 9 to 12.">
                        <span style={{"position":"absolute","left":"0","right":"0","top":"26px","height":"4px","borderRadius":"2px","background":"#E6E6E1"} as any} />
                        <span className="growx" style={{"position":"absolute","left":"26.6%","width":"13.3%","top":"22px","height":"12px","borderRadius":"6px","background":"var(--sun)"} as any} />
                        <span className="pop" style={{"--i":"6","position":"absolute","left":"10%","top":"16px","width":"24px","height":"24px","borderRadius":"12px","background":"var(--dark)","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","transform":"translateX(-50%)"} as any}>
                          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
                          </svg>
                        </span>
                        <span className="meta" style={{"position":"absolute","left":"10%","top":"44px","transform":"translateX(-50%)","whiteSpace":"nowrap","color":"var(--ink)","fontWeight":"600"} as any}>
                          {"Warned 4 Apr"}
                        </span>
                        <span className="meta" style={{"position":"absolute","left":"33%","top":"44px","transform":"translateX(-50%)","whiteSpace":"nowrap"} as any}>
                          {"Heat 9–12 Apr"}
                        </span>
                        <span className="meta" style={{"position":"absolute","left":"0","top":"0"} as any}>
                          {"1 Apr"}
                        </span>
                        <span className="meta" style={{"position":"absolute","right":"0","top":"0"} as any}>
                          {"30 Apr"}
                        </span>
                      </div>
                      <div className="row" style={{"gap":"28px","marginTop":"8px"} as any}>
                        <div className="col" style={{"gap":"6px","alignItems":"center"} as any}>
                          <span style={{"width":"44px","height":"44px","borderRadius":"22px","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"15px","fontWeight":"700","background":"var(--green-tint)","color":"var(--green)"} as any}>
                            {"6d"}
                          </span>
                          <span className="meta">
                            {"2017"}
                          </span>
                        </div>
                        <div className="col" style={{"gap":"6px","alignItems":"center"} as any}>
                          <span style={{"width":"44px","height":"44px","borderRadius":"22px","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"15px","fontWeight":"700","background":"#F1E3DF","color":"#8F2A17"} as any}>
                            {"✕"}
                          </span>
                          <span className="meta">
                            {"2020"}
                          </span>
                        </div>
                        <div className="col" style={{"gap":"6px","alignItems":"center"} as any}>
                          <span style={{"width":"44px","height":"44px","borderRadius":"22px","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"15px","fontWeight":"700","background":"var(--green-tint)","color":"var(--green)"} as any}>
                            {"5d"}
                          </span>
                          <span className="meta">
                            {"2023"}
                          </span>
                        </div>
                        <div className="col" style={{"gap":"6px","alignItems":"center"} as any}>
                          <span style={{"width":"44px","height":"44px","borderRadius":"22px","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"15px","fontWeight":"700","background":"var(--green-tint)","color":"var(--green)"} as any}>
                            {"7d"}
                          </span>
                          <span className="meta">
                            {"2026"}
                          </span>
                        </div>
                      </div>
                      <span className="meta">
                        {"Days of warning before each past heat wave at grain filling. 3 of 4 caught early."}
                      </span>
                      <span className="pq est">
                        {"Hindcast on NASA POWER, run when the field was saved"}
                      </span>
                    </div>
                    <div className="col" style={{"gap":"16px"} as any}>
                      <span className="sec">
                        {"YOUR SPRINGS ARE GETTING HOTTER"}
                      </span>
                      <p className="mid">
                        {"Days over 32 °C in March and April, every year since 1990."}
                      </p>
                      <div style={{"display":"flex","alignItems":"flex-end","gap":"3px","height":"110px"} as any} role="img" aria-label="Hot spring days per year from 1990 to 2025, rising.">
                        <span className="grow" style={{"--i":"0","flex":"1","height":"26px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"1","flex":"1","height":"17px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"2","flex":"1","height":"35px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"3","flex":"1","height":"26px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"4","flex":"1","height":"17px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"5","flex":"1","height":"26px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"6","flex":"1","height":"35px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"7","flex":"1","height":"26px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"8","flex":"1","height":"26px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"9","flex":"1","height":"44px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"10","flex":"1","height":"35px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"11","flex":"1","height":"26px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"12","flex":"1","height":"35px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"13","flex":"1","height":"44px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"14","flex":"1","height":"35px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"15","flex":"1","height":"53px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"16","flex":"1","height":"44px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"17","flex":"1","height":"35px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"18","flex":"1","height":"53px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"19","flex":"1","height":"44px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"20","flex":"1","height":"62px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"21","flex":"1","height":"53px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"22","flex":"1","height":"44px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"23","flex":"1","height":"62px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"24","flex":"1","height":"53px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"25","flex":"1","height":"71px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"26","flex":"1","height":"62px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"27","flex":"1","height":"53px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"28","flex":"1","height":"71px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"29","flex":"1","height":"80px","borderRadius":"3px","background":"#E3D3B4"} as any} />
                        <span className="grow" style={{"--i":"30","flex":"1","height":"62px","borderRadius":"3px","background":"#F29B1E"} as any} />
                        <span className="grow" style={{"--i":"31","flex":"1","height":"71px","borderRadius":"3px","background":"#F29B1E"} as any} />
                        <span className="grow" style={{"--i":"32","flex":"1","height":"89px","borderRadius":"3px","background":"#F29B1E"} as any} />
                        <span className="grow" style={{"--i":"33","flex":"1","height":"80px","borderRadius":"3px","background":"#F29B1E"} as any} />
                        <span className="grow" style={{"--i":"34","flex":"1","height":"71px","borderRadius":"3px","background":"#F29B1E"} as any} />
                        <span className="grow" style={{"--i":"35","flex":"1","height":"89px","borderRadius":"3px","background":"#F29B1E"} as any} />
                      </div>
                      <div className="row sp meta">
                        <span>
                          {"1990"}
                        </span>
                        <span>
                          {"2000"}
                        </span>
                        <span>
                          {"2010"}
                        </span>
                        <span>
                          {"2026"}
                        </span>
                      </div>
                      <span className="pq sat">
                        {"NASA POWER"}
                      </span>
                    </div>
                  </section>
                  <div className="row hair rise" style={{"--d":"7","gap":"12px","paddingTop":"28px"} as any}>
                    <Link href={__r("V18-Today") + ""} className="btn cta press" style={{"height":"52px","fontSize":"15px","padding":"0 6px 0 22px"} as any}>
                      {"Go to my field"}
                      <span className="ar">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                    <Link href={__r("V19-Try") + ""} className="btn soft press" style={{"height":"52px"} as any}>
                      {"Try a season"}
                    </Link>
                  </div>
                  <Link href={__r("V18-Data") + ""} className="row" style={{"gap":"6px","fontSize":"14px","fontWeight":"600"} as any}>
                    {"Open the full data sheet"}
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9.5 6 6 6-6 6" />
                    </svg>
                  </Link>
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
