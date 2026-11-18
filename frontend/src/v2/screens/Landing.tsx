'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/V20-Landing.dc.html by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./Landing.logic.js
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './Landing.logic';

export default function LandingScreen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const __v = useDC(Logic, props);
  return (
    <>
      <div className="v2 root">
        <div className="shell">
          <div className="lp2 col" style={{"gap":"112px","paddingBottom":"48px"} as any}>
            <section className="lh">
              <header className="top lp">
                <Link href={__r("V20-Landing") + ""} className="brand" style={{"flex":"0 0 auto"} as any}>
                  <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                    <rect width="34" height="34" rx="11" fill="#17251C" />
                    <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                    <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
                  </svg>
                  {"bezra"}
                </Link>
                <nav aria-label="Site" className="row" style={{"gap":"32px","flex":"1","justifyContent":"center"} as any}>
                  <a href="#ways" className="lk">
                    {"Why Bezra"}
                  </a>
                  <a href="#how" className="lk">
                    {"How it works"}
                  </a>
                  <a href="#proof" className="lk">
                    {"Proof"}
                  </a>
                  <Link href={__r("V18-Engineer") + ""} className="lk">
                    {"For engineers"}
                  </Link>
                </nav>
                <div className="row" style={{"gap":"10px"} as any}>
                  <Link href={__r("V22-AR-Landing") + ""} className="lk" style={{"fontSize":"14px","fontWeight":"600"} as any} lang="ar">
                    {"عربي"}
                  </Link>
                  <Link href={__r("V19-SignIn") + ""} className="btn soft press">
                    {"Sign in"}
                  </Link>
                  <Link href={__r("V19-SignUp") + ""} className="btn press">
                    {"Add your field"}
                  </Link>
                </div>
              </header>
              <div className="hero2">
                <div className="col" style={{"gap":"26px"} as any}>
                  <span className="row rise" style={{"--d":"0","gap":"10px"} as any}>
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
                        <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                        <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                        <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
                      </g>
                    </svg>
                    <span className="meta" style={{"fontSize":"15px"} as any}>
                      {"Bezra · built on 36 years of NASA Earth data"}
                    </span>
                  </span>
                  <h1 className="display rise" style={{"--d":"1","fontSize":"84px"} as any}>
                    {"See your field the way space sees it."}
                  </h1>
                  <p className="rise" style={{"--d":"2","fontSize":"20px","lineHeight":"1.55","color":"var(--ink2)","maxWidth":"540px"} as any}>
                    {"Bezra turns NASA satellite data into one short to-do a day, and shows what each decision is worth before you make it."}
                  </p>
                  <div className="row rise" style={{"--d":"3","gap":"12px"} as any}>
                    <Link href={__r("V19-SignUp") + ""} className="btn cta press" style={{"height":"58px","borderRadius":"29px","fontSize":"16px","padding":"0 8px 0 26px","gap":"16px"} as any}>
                      {"Add your field, it's free"}
                      <span className="ar">
                        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </Link>
                    <Link href={__r("V21-Tour-Welcome-Guest") + ""} className="btn soft press" style={{"height":"58px","borderRadius":"29px","fontSize":"16px"} as any}>
                      {"See a sample field"}
                    </Link>
                  </div>
                  <span className="meta rise" style={{"--d":"4"} as any}>
                    {"Drag across the field to see what Bezra sees."}
                  </span>
                </div>
                <div className="lens rise" style={{"--d":"2"} as any} role="group" aria-label="Drag to compare your field as you see it and as Bezra sees it">
                  <svg viewBox="0 0 700 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <rect width="700" height="560" fill="#4A6638" />
                    <g transform="rotate(-8 350 280)">
                      <rect x="-80" y="-120" width="90" height="820" fill="#5E7D45" />
                      <rect x="10" y="-120" width="60" height="820" fill="#6E8A4E" />
                      <rect x="70" y="-120" width="80" height="820" fill="#557540" />
                      <rect x="150" y="-120" width="14" height="820" fill="#C9C0A4" />
                      <rect x="164" y="-120" width="70" height="820" fill="#4F6E3B" />
                      <rect x="460" y="-120" width="70" height="820" fill="#6E8A4E" />
                      <rect x="530" y="-120" width="90" height="820" fill="#5E7D45" />
                      <rect x="620" y="-120" width="80" height="820" fill="#557540" />
                      <rect x="700" y="-120" width="90" height="820" fill="#6E8A4E" />
                      <rect x="250" y="90" width="70" height="92" fill="#6E9445" />
                      <rect x="320" y="90" width="70" height="92" fill="#749A4A" />
                      <rect x="390" y="90" width="70" height="92" fill="#7E9C4C" />
                      <rect x="250" y="182" width="70" height="92" fill="#6A9043" />
                      <rect x="320" y="182" width="70" height="92" fill="#719647" />
                      <rect x="390" y="182" width="70" height="92" fill="#779849" />
                      <rect x="250" y="274" width="70" height="92" fill="#679041" />
                      <rect x="320" y="274" width="70" height="92" fill="#6C9344" />
                      <rect x="390" y="274" width="70" height="92" fill="#729748" />
                      <rect x="250" y="366" width="70" height="92" fill="#668F40" />
                      <rect x="320" y="366" width="70" height="92" fill="#68913F" />
                      <rect x="390" y="366" width="70" height="92" fill="#6C9344" />
                      <line x1="250" y1="90" x2="250" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="257" y1="90" x2="257" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="264" y1="90" x2="264" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="271" y1="90" x2="271" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="278" y1="90" x2="278" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="285" y1="90" x2="285" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="292" y1="90" x2="292" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="299" y1="90" x2="299" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="306" y1="90" x2="306" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="313" y1="90" x2="313" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="320" y1="90" x2="320" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="327" y1="90" x2="327" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="334" y1="90" x2="334" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="341" y1="90" x2="341" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="348" y1="90" x2="348" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="355" y1="90" x2="355" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="362" y1="90" x2="362" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="369" y1="90" x2="369" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="376" y1="90" x2="376" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="383" y1="90" x2="383" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="390" y1="90" x2="390" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="397" y1="90" x2="397" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="404" y1="90" x2="404" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="411" y1="90" x2="411" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="418" y1="90" x2="418" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="425" y1="90" x2="425" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="432" y1="90" x2="432" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="439" y1="90" x2="439" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="446" y1="90" x2="446" y2="458" stroke="#000" strokeOpacity=".06" />
                      <line x1="453" y1="90" x2="453" y2="458" stroke="#000" strokeOpacity=".06" />
                      <rect x="250" y="90" width="210" height="368" fill="none" stroke="#fff" strokeWidth="0" strokeOpacity=".95" />
                    </g>
                    <path d="M-20 520C160 492 360 540 720 500" stroke="#4F7E9C" strokeWidth="14" fill="none" />
                  </svg>
                  <div className="data" style={__css(__v?.clip)}>
                    <svg viewBox="0 0 700 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="700" height="560" fill="#2E4430" />
                      <g transform="rotate(-8 350 280)">
                        <rect x="-80" y="-120" width="90" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="10" y="-120" width="60" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="70" y="-120" width="80" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="150" y="-120" width="14" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="164" y="-120" width="70" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="460" y="-120" width="70" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="530" y="-120" width="90" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="620" y="-120" width="80" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="700" y="-120" width="90" height="820" fill="#34503A" fillOpacity=".9" />
                        <rect x="250" y="90" width="70" height="92" fill="#7FA65A" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="285" y="141" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#141A16" transform="rotate(8 285 136)">
                          {"0.33"}
                        </text>
                        <rect x="320" y="90" width="70" height="92" fill="#C9C77A" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="355" y="141" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#141A16" transform="rotate(8 355 136)">
                          {"0.29"}
                        </text>
                        <rect x="390" y="90" width="70" height="92" fill="#E8962C" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="425" y="141" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#141A16" transform="rotate(8 425 136)">
                          {"0.24"}
                        </text>
                        <rect x="250" y="182" width="70" height="92" fill="#5E9842" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="285" y="233" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#fff" transform="rotate(8 285 228)">
                          {"0.34"}
                        </text>
                        <rect x="320" y="182" width="70" height="92" fill="#7FA65A" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="355" y="233" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#141A16" transform="rotate(8 355 228)">
                          {"0.31"}
                        </text>
                        <rect x="390" y="182" width="70" height="92" fill="#C9C77A" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="425" y="233" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#141A16" transform="rotate(8 425 228)">
                          {"0.27"}
                        </text>
                        <rect x="250" y="274" width="70" height="92" fill="#3E7F35" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="285" y="325" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#fff" transform="rotate(8 285 320)">
                          {"0.35"}
                        </text>
                        <rect x="320" y="274" width="70" height="92" fill="#5E9842" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="355" y="325" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#fff" transform="rotate(8 355 320)">
                          {"0.33"}
                        </text>
                        <rect x="390" y="274" width="70" height="92" fill="#7FA65A" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="425" y="325" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#141A16" transform="rotate(8 425 320)">
                          {"0.30"}
                        </text>
                        <rect x="250" y="366" width="70" height="92" fill="#3E7F35" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="285" y="417" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#fff" transform="rotate(8 285 412)">
                          {"0.36"}
                        </text>
                        <rect x="320" y="366" width="70" height="92" fill="#3E7F35" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="355" y="417" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#fff" transform="rotate(8 355 412)">
                          {"0.35"}
                        </text>
                        <rect x="390" y="366" width="70" height="92" fill="#5E9842" stroke="#fff" strokeOpacity=".7" strokeWidth="1.5" />
                        <text x="425" y="417" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="15" fontWeight="700" fill="#fff" transform="rotate(8 425 412)">
                          {"0.33"}
                        </text>
                        <rect x="250" y="90" width="210" height="368" fill="none" stroke="#fff" strokeWidth="3" strokeOpacity=".95" />
                        <circle cx="440" cy="108" r="9" fill="#fff" />
                        <circle cx="440" cy="108" r="4" fill="#141A16" />
                      </g>
                      <path d="M-20 520C160 492 360 540 720 500" stroke="#2F6FA8" strokeWidth="14" fill="none" />
                    </svg>
                  </div>
                  <span className="ltag" style={{"left":"18px","background":"rgba(255,255,255,.9)"} as any}>
                    {"What you see"}
                  </span>
                  <span className="ltag" style={{"right":"18px","background":"var(--dark)","color":"#fff"} as any}>
                    {"What Bezra sees"}
                  </span>
                  <span className="bar" style={__css(__v?.barL)} />
                  <span className="knob" style={__css(__v?.knobL)}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4" />
                    </svg>
                  </span>
                  <div className="fchip" style={{"right":"24px","bottom":"96px"} as any}>
                    <span className="meta" style={{"fontSize":"12px"} as any}>
                      {"Square C1"}
                    </span>
                    <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                      {"Weakest in 7 of 10 seasons"}
                    </b>
                    <span className="meta" style={{"fontSize":"12px"} as any}>
                      {"NASA HLS · 30 m"}
                    </span>
                  </div>
                  <div className="fchip" style={{"left":"24px","bottom":"24px"} as any}>
                    <span className="meta" style={{"fontSize":"12px"} as any}>
                      {"To do today"}
                    </span>
                    <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                      {"Water, C1 first"}
                    </b>
                    <span style={{"fontSize":"12px","color":"var(--green)","fontWeight":"600"} as any}>
                      {"Protects about 8–12% of the harvest"}
                    </span>
                  </div>
                  <input type="range" min="0" max="100" value={__s(__v?.pos) as any} onInput={__v?.move} aria-label="Move the lens" />
                </div>
              </div>
              <div className="tick4 rise" style={{"--d":"5"} as any}>
                <div>
                  <b>
                    {"+18%"}
                  </b>
                  <span>
                    {"more wheat on our sample field this season"}
                  </span>
                </div>
                <div>
                  <b>
                    {"3 of 4"}
                  </b>
                  <span>
                    {"past heat waves warned 5–7 days early"}
                  </span>
                </div>
                <div>
                  <b>
                    {"−45 kg"}
                  </b>
                  <span>
                    {"urea per feddan, for the same harvest"}
                  </span>
                </div>
                <div>
                  <b>
                    {"10 seasons"}
                  </b>
                  <span>
                    {"of satellite history read for every field"}
                  </span>
                </div>
              </div>
            </section>
            <section id="ways" className="col" style={{"gap":"32px"} as any}>
              <div className="col" style={{"gap":"12px","maxWidth":"760px"} as any}>
                <span className="kicker">
                  {"Why Bezra"}
                </span>
                <h2 className="h2x">
                  {"The same field, two ways."}
                </h2>
                <p className="txt" style={{"fontSize":"18px"} as any}>
                  {"We replay a season on a real Menoufia field with the same weather. The only thing that changes is how decisions are made."}
                </p>
              </div>
              <div className="twoways">
                <div className="way u">
                  <span className="meta" style={{"fontWeight":"600"} as any}>
                    {"THE USUAL WAY"}
                  </span>
                  <b style={{"fontSize":"56px","fontWeight":"600","letterSpacing":"-2px"} as any}>
                    {"15.6 "}
                    <span style={{"fontSize":"18px","color":"var(--muted)","letterSpacing":"0"} as any}>
                      {"ardab / feddan"}
                    </span>
                  </b>
                  <ul>
                    <li>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                      <span>
                        {"Sow when the neighbours sow"}
                      </span>
                    </li>
                    <li>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                      <span>
                        {"Water on the usual day"}
                      </span>
                    </li>
                    <li>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                      <span>
                        {"Add fertiliser by habit"}
                      </span>
                    </li>
                    <li>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                      <span>
                        {"Find rust when it is already bad"}
                      </span>
                    </li>
                    <li>
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                      <span>
                        {"Plant wheat every winter"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="way b">
                  <span className="meta" style={{"fontWeight":"600","color":"var(--sun)"} as any}>
                    {"WITH BEZRA"}
                  </span>
                  <b style={{"fontSize":"56px","fontWeight":"600","letterSpacing":"-2px"} as any}>
                    {"18.4 "}
                    <span style={{"fontSize":"18px","color":"rgba(255,255,255,.6)","letterSpacing":"0"} as any}>
                      {"ardab / feddan"}
                    </span>
                  </b>
                  <ul>
                    <li>
                      <span style={{"color":"#8FD18F"} as any}>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span>
                        {"Sow in the best window for your field"}
                      </span>
                    </li>
                    <li>
                      <span style={{"color":"#8FD18F"} as any}>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span>
                        {"Water when the soil needs it, the weak corner first"}
                      </span>
                    </li>
                    <li>
                      <span style={{"color":"#8FD18F"} as any}>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span>
                        {"The right amount for your field"}
                      </span>
                    </li>
                    <li>
                      <span style={{"color":"#8FD18F"} as any}>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span>
                        {"Get a warning before heat or rust"}
                      </span>
                    </li>
                    <li>
                      <span style={{"color":"#8FD18F"} as any}>
                        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m5 12.5 4.5 4.5L19 7.5" />
                        </svg>
                      </span>
                      <span>
                        {"Rotate so the soil stays strong"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"56px"} as any}>
                <div className="col" style={{"gap":"12px"} as any}>
                  <span className="sec">
                    {"WHERE THE EXTRA WHEAT COMES FROM"}
                  </span>
                  <div className="col" style={{"gap":"2px"} as any}>
                    <div className="wf">
                      <span className="meta">
                        {"Your usual way"}
                      </span>
                      <span className="wfbar">
                        <i style={{"left":"0","width":"32.3%","background":"#C9CBC4"} as any} />
                      </span>
                      <b style={{"fontWeight":"600"} as any}>
                        {"15.6"}
                      </b>
                    </div>
                    <div className="wf">
                      <span>
                        {"Sow on 5 Nov, not 20 Nov"}
                      </span>
                      <span className="wfbar">
                        <i className="growx" style={{"left":"32.3%","width":"13.8%","background":"#6FAE52"} as any} />
                      </span>
                      <b style={{"fontWeight":"600","color":"var(--green)"} as any}>
                        {"+0.9"}
                      </b>
                    </div>
                    <div className="wf">
                      <span>
                        {"Water today, C1 first"}
                      </span>
                      <span className="wfbar">
                        <i className="growx" style={{"left":"46.2%","width":"9.2%","background":"#6FAE52"} as any} />
                      </span>
                      <b style={{"fontWeight":"600","color":"var(--green)"} as any}>
                        {"+0.6"}
                      </b>
                    </div>
                    <div className="wf">
                      <span>
                        {"Water before the April heat"}
                      </span>
                      <span className="wfbar">
                        <i className="growx" style={{"left":"55.4%","width":"15.4%","background":"#6FAE52"} as any} />
                      </span>
                      <b style={{"fontWeight":"600","color":"var(--green)"} as any}>
                        {"+1.0"}
                      </b>
                    </div>
                    <div className="wf">
                      <span>
                        {"Catch rust early"}
                      </span>
                      <span className="wfbar">
                        <i className="growx" style={{"left":"70.8%","width":"3.1%","background":"#6FAE52"} as any} />
                      </span>
                      <b style={{"fontWeight":"600","color":"var(--green)"} as any}>
                        {"+0.2"}
                      </b>
                    </div>
                    <div className="wf">
                      <span>
                        {"Right amount of urea"}
                      </span>
                      <span className="wfbar">
                        <i className="growx" style={{"left":"73.8%","width":"1.5%","background":"#6FAE52"} as any} />
                      </span>
                      <b style={{"fontWeight":"600","color":"var(--green)"} as any}>
                        {"+0.1"}
                      </b>
                    </div>
                    <div className="wf" style={{"borderTop":"1px solid var(--line)","marginTop":"4px","paddingTop":"14px"} as any}>
                      <b style={{"fontWeight":"600"} as any}>
                        {"With Bezra"}
                      </b>
                      <span className="wfbar">
                        <i style={{"left":"0","width":"75.4%","background":"var(--dark)"} as any} />
                      </span>
                      <b style={{"fontWeight":"600"} as any}>
                        {"18.4"}
                      </b>
                    </div>
                    <span className="meta" style={{"paddingTop":"8px"} as any}>
                      {"Ardab of wheat per feddan. Each line is one thing Bezra told you to do."}
                    </span>
                  </div>
                </div>
                <div className="col" style={{"gap":"12px"} as any}>
                  <span className="sec">
                    {"AND THE SOIL, 5 SEASONS LATER"}
                  </span>
                  <svg viewBox="0 0 620 230" width="100%" role="img" aria-label="Soil strength for the next 5 seasons. Same as always falls to 47. With Bezra rotation it stays about 65.">
                    <line x1="40" x2="480" y1="44.9" y2="44.9" stroke="#E8E8E3" />
                    <text x="0" y="48.9" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"Strong"}
                    </text>
                    <line x1="40" x2="480" y1="84.6" y2="84.6" stroke="#E8E8E3" />
                    <text x="0" y="88.6" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"OK"}
                    </text>
                    <line x1="40" x2="480" y1="144.3" y2="144.3" stroke="#E8E8E3" />
                    <text x="0" y="148.3" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"Tired"}
                    </text>
                    <path className="draw" pathLength="1" style={{"--d":"1"} as any} d="M40.0 94.6 L128.0 109.5 L216.0 124.4 L304.0 139.3 L392.0 149.3 L480.0 159.2" stroke="#C9A06A" strokeWidth="2.6" fill="none" strokeDasharray="6 5" />
                    <path className="draw" pathLength="1" style={{"--d":"2"} as any} d="M40.0 94.6 L128.0 64.7 L216.0 74.7 L304.0 84.6 L392.0 59.8 L480.0 69.7" stroke="#3E7F35" strokeWidth="3" fill="none" />
                    <text x="488.0" y="73.7" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#3E7F35">
                      {"65 With Bezra"}
                    </text>
                    <text x="488.0" y="163.2" fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#B4660B">
                      {"47 Same as always"}
                    </text>
                    <text x="40.0" y="220" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"now"}
                    </text>
                    <text x="128.0" y="220" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"27/28"}
                    </text>
                    <text x="216.0" y="220" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"28/29"}
                    </text>
                    <text x="304.0" y="220" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"29/30"}
                    </text>
                    <text x="392.0" y="220" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"30/31"}
                    </text>
                    <text x="480.0" y="220" textAnchor="middle" fontFamily="Hanken Grotesk, sans-serif" fontSize="11" fill="#8B918C">
                      {"31/32"}
                    </text>
                  </svg>
                </div>
              </div>
            </section>
            <section id="how" className="col" style={{"gap":"72px"} as any}>
              <div className="col" style={{"gap":"12px"} as any}>
                <span className="kicker">
                  {"How it works"}
                </span>
                <h2 className="h2x">
                  {"From a pin on a map to a plan, in a minute."}
                </h2>
              </div>
              <div className="feat">
                <div className="col" style={{"gap":"14px"} as any}>
                  <span className="stepn">
                    {"01"}
                  </span>
                  <h3 className="h2x" style={{"fontSize":"38px"} as any}>
                    {"Draw your field once"}
                  </h3>
                  <p className="txt" style={{"fontSize":"18px"} as any}>
                    {"Tap its 4 corners on a satellite map. Bezra splits it into 30 m squares and reads 36 years of NASA data for each one."}
                  </p>
                </div>
                <div className="fvis">
                  <div className="mcard" style={{"position":"relative","width":"420px","height":"320px"} as any}>
                    <svg viewBox="0 0 360 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <rect width="360" height="300" fill="#4C6B3A" />
                      <g transform="rotate(-9 180 150)">
                        <rect x="-40" y="-60" width="60" height="420" fill="#5E7D45" />
                        <rect x="20" y="-60" width="40" height="420" fill="#6E8A4E" />
                        <rect x="60" y="-60" width="52" height="420" fill="#557540" />
                        <rect x="230" y="-60" width="46" height="420" fill="#6E8A4E" />
                        <rect x="276" y="-60" width="60" height="420" fill="#5E7D45" />
                        <rect x="336" y="-60" width="60" height="420" fill="#557540" />
                        <rect x="112" y="-60" width="8" height="420" fill="#C9C0A4" />
                        <rect x="124.0" y="50.0" width="34" height="42" fill="#7FA65A" stroke="#fff" strokeOpacity=".6" />
                        <rect x="158.0" y="50.0" width="34" height="42" fill="#C9C77A" stroke="#fff" strokeOpacity=".6" />
                        <rect x="192.0" y="50.0" width="34" height="42" fill="#E8962C" stroke="#fff" strokeOpacity=".6" />
                        <rect x="124.0" y="92.0" width="34" height="42" fill="#5E9842" stroke="#fff" strokeOpacity=".6" />
                        <rect x="158.0" y="92.0" width="34" height="42" fill="#7FA65A" stroke="#fff" strokeOpacity=".6" />
                        <rect x="192.0" y="92.0" width="34" height="42" fill="#C9C77A" stroke="#fff" strokeOpacity=".6" />
                        <rect x="124.0" y="134.0" width="34" height="42" fill="#3E7F35" stroke="#fff" strokeOpacity=".6" />
                        <rect x="158.0" y="134.0" width="34" height="42" fill="#5E9842" stroke="#fff" strokeOpacity=".6" />
                        <rect x="192.0" y="134.0" width="34" height="42" fill="#7FA65A" stroke="#fff" strokeOpacity=".6" />
                        <rect x="124.0" y="176.0" width="34" height="42" fill="#3E7F35" stroke="#fff" strokeOpacity=".6" />
                        <rect x="158.0" y="176.0" width="34" height="42" fill="#3E7F35" stroke="#fff" strokeOpacity=".6" />
                        <rect x="192.0" y="176.0" width="34" height="42" fill="#5E9842" stroke="#fff" strokeOpacity=".6" />
                        <rect x="124" y="50" width="102" height="168" fill="none" stroke="#fff" strokeWidth="2.5" />
                        <circle cx="209" cy="66" r="6" fill="#fff" />
                        <circle cx="209" cy="66" r="3" fill="#141A16" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="feat r">
                <div className="fvis">
                  <div className="mcard" style={{"position":"relative","width":"380px"} as any}>
                    <div style={{"padding":"22px 24px","display":"flex","flexDirection":"column","gap":"12px"} as any}>
                      <span className="meta" style={{"fontSize":"12px"} as any}>
                        {"Thursday 3 December"}
                      </span>
                      <b style={{"fontSize":"24px","fontWeight":"600","letterSpacing":"-.6px"} as any}>
                        {"Your field is doing well."}
                      </b>
                      <span className="sec" style={{"fontSize":"11px","paddingTop":"6px"} as any}>
                        {"TO DO TODAY"}
                      </span>
                      <div className="row" style={{"gap":"12px","alignItems":"flex-start","padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                        <span className="tbox on" style={{"width":"24px","height":"24px","borderRadius":"8px","flex":"0 0 auto"} as any}>
                          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 12.5 4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                        <span className="col" style={{"gap":"2px"} as any}>
                          <b style={{"fontSize":"14px","fontWeight":"600","textDecoration":"line-through","color":"var(--muted)"} as any}>
                            {"Water the whole field"}
                          </b>
                          <span style={{"fontSize":"12px","color":"var(--green)"} as any}>
                            {"Protects about 8–12% of your harvest"}
                          </span>
                        </span>
                      </div>
                      <div className="row" style={{"gap":"12px","alignItems":"flex-start","padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                        <span className="tbox" style={{"width":"24px","height":"24px","borderRadius":"8px","flex":"0 0 auto"} as any}>
                          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 12.5 4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                        <span className="col" style={{"gap":"2px"} as any}>
                          <b style={{"fontSize":"14px","fontWeight":"600"} as any}>
                            {"Look at the leaves in square C1"}
                          </b>
                          <span style={{"fontSize":"12px","color":"var(--muted)"} as any}>
                            {"From your journal"}
                          </span>
                        </span>
                      </div>
                      <div className="row" style={{"gap":"12px","alignItems":"flex-start","padding":"8px 0","borderTop":"1px solid var(--line)"} as any}>
                        <span className="tbox" style={{"width":"24px","height":"24px","borderRadius":"8px","flex":"0 0 auto"} as any}>
                          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m5 12.5 4.5 4.5L19 7.5" />
                          </svg>
                        </span>
                        <span className="col" style={{"gap":"2px"} as any}>
                          <b style={{"fontSize":"14px","fontWeight":"600"} as any}>
                            {"Check B2 and C2 for aphids"}
                          </b>
                          <span style={{"fontSize":"12px","color":"var(--muted)"} as any}>
                            {"From your journal"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col" style={{"gap":"14px"} as any}>
                  <span className="stepn">
                    {"02"}
                  </span>
                  <h3 className="h2x" style={{"fontSize":"38px"} as any}>
                    {"One short to-do every day"}
                  </h3>
                  <p className="txt" style={{"fontSize":"18px"} as any}>
                    {"Water today. Look at C1. Each task says what it protects. Tick it, and it goes into your journal."}
                  </p>
                </div>
              </div>
              <div className="feat">
                <div className="col" style={{"gap":"14px"} as any}>
                  <span className="stepn">
                    {"03"}
                  </span>
                  <h3 className="h2x" style={{"fontSize":"38px"} as any}>
                    {"Try it before you do it"}
                  </h3>
                  <p className="txt" style={{"fontSize":"18px"} as any}>
                    {"How much urea? Water every 12 days or 16? Clover or wheat next winter? See the harvest and the soil for each answer."}
                  </p>
                </div>
                <div className="fvis">
                  <div className="mcard" style={{"position":"relative","width":"440px","padding":"22px"} as any}>
                    <span className="sec" style={{"fontSize":"11px"} as any}>
                      {"HOW MUCH UREA ON MON 7 DEC?"}
                    </span>
                    <div className="row sp" style={{"padding":"12px 0","borderTop":"1px solid var(--line)","marginTop":"8px"} as any}>
                      <b style={{"fontWeight":"600"} as any}>
                        {"45 kg"}
                      </b>
                      <span className="meta">
                        {"2.2 bags"}
                      </span>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"16.5–18"}
                      </b>
                    </div>
                    <div className="row sp" style={{"padding":"12px 0","borderTop":"1px solid var(--line)","marginTop":"8px"} as any}>
                      <b style={{"fontWeight":"600"} as any}>
                        {"60 kg"}
                      </b>
                      <span className="meta">
                        {"2.9 bags · Bezra's pick"}
                      </span>
                      <b style={{"fontWeight":"600","color":"var(--green)"} as any}>
                        {"17.5–19.5"}
                      </b>
                    </div>
                    <div className="row sp" style={{"padding":"12px 0","borderTop":"1px solid var(--line)","marginTop":"8px"} as any}>
                      <b style={{"fontWeight":"600"} as any}>
                        {"90 kg"}
                      </b>
                      <span className="meta">
                        {"4.3 bags"}
                      </span>
                      <b style={{"fontWeight":"600","color":"var(--ink)"} as any}>
                        {"17.5–19.8"}
                      </b>
                    </div>
                    <span className="meta">
                      {"Ardab per feddan, 30 weather years"}
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <section id="proof" className="grid hair" style={{"gridTemplateColumns":"minmax(0, 1fr) minmax(0, 1fr)","gap":"64px","paddingTop":"72px","alignItems":"center"} as any}>
              <div className="col" style={{"gap":"18px"} as any}>
                <span className="kicker">
                  {"Proof, not promises"}
                </span>
                <h2 className="h2x">
                  {"10 past seasons, replayed."}
                </h2>
                <p className="txt" style={{"fontSize":"18px"} as any}>
                  {"We gave Bezra only the data from before each decision. On the sample field it would have made about "}
                  <b style={{"color":"var(--ink)"} as any}>
                    {"44 more ardab"}
                  </b>
                  {" in 8 wheat seasons and warned 3 of 4 heat waves. It missed one, and we show that too."}
                </p>
                <Link href={__r("V19-Try") + ""} className="row" style={{"gap":"6px","fontWeight":"600"} as any}>
                  {"Replay it yourself"}
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9.5 6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
              <div className="col" style={{"gap":"12px"} as any}>
                <div className="row" style={{"gap":"8px","alignItems":"flex-end"} as any}>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"121px","borderRadius":"4px","background":"#C9CBC4"} as any} />
                      <i className="grow" style={{"--i":"0","width":"14px","height":"138px","borderRadius":"4px","background":"#3E7F35"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"16/17"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"4px","borderRadius":"4px","background":"#CFE3C6"} as any} />
                      <i className="grow" style={{"--i":"1","width":"14px","height":"4px","borderRadius":"4px","background":"#CFE3C6"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"17/18"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"131px","borderRadius":"4px","background":"#C9CBC4"} as any} />
                      <i className="grow" style={{"--i":"2","width":"14px","height":"145px","borderRadius":"4px","background":"#3E7F35"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"18/19"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"124px","borderRadius":"4px","background":"#C9CBC4"} as any} />
                      <i className="grow" style={{"--i":"3","width":"14px","height":"131px","borderRadius":"4px","background":"#3E7F35"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"19/20"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"4px","borderRadius":"4px","background":"#CFE3C6"} as any} />
                      <i className="grow" style={{"--i":"4","width":"14px","height":"4px","borderRadius":"4px","background":"#CFE3C6"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"20/21"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"128px","borderRadius":"4px","background":"#C9CBC4"} as any} />
                      <i className="grow" style={{"--i":"5","width":"14px","height":"143px","borderRadius":"4px","background":"#3E7F35"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"21/22"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"104px","borderRadius":"4px","background":"#C9CBC4"} as any} />
                      <i className="grow" style={{"--i":"6","width":"14px","height":"134px","borderRadius":"4px","background":"#3E7F35"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"22/23"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"123px","borderRadius":"4px","background":"#C9CBC4"} as any} />
                      <i className="grow" style={{"--i":"7","width":"14px","height":"136px","borderRadius":"4px","background":"#3E7F35"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"23/24"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"113px","borderRadius":"4px","background":"#C9CBC4"} as any} />
                      <i className="grow" style={{"--i":"8","width":"14px","height":"135px","borderRadius":"4px","background":"#3E7F35"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"24/25"}
                    </span>
                  </div>
                  <div className="col" style={{"gap":"6px","alignItems":"center","flex":"1"} as any}>
                    <div className="row" style={{"gap":"3px","alignItems":"flex-end","height":"160px"} as any}>
                      <i style={{"width":"14px","height":"104px","borderRadius":"4px","background":"#C9CBC4"} as any} />
                      <i className="grow" style={{"--i":"9","width":"14px","height":"132px","borderRadius":"4px","background":"#3E7F35"} as any} />
                    </div>
                    <span className="meta" style={{"fontSize":"11px"} as any}>
                      {"25/26"}
                    </span>
                  </div>
                </div>
                <span className="leg">
                  <span>
                    <i style={{"background":"#C9CBC4","height":"10px"} as any} />
                    {"What the farmer got"}
                  </span>
                  <span>
                    <i style={{"background":"#3E7F35","height":"10px"} as any} />
                    {"With Bezra"}
                  </span>
                  <span>
                    <i style={{"background":"#CFE3C6","height":"10px"} as any} />
                    {"Clover year"}
                  </span>
                </span>
              </div>
            </section>
            <section className="col" style={{"gap":"24px"} as any}>
              <span className="kicker">
                {"Open NASA Earth data, for every field"}
              </span>
              <div className="grid" style={{"gridTemplateColumns":"repeat(7, minmax(0, 1fr))","gap":"24px"} as any}>
                <div className="dataset">
                  {"POWER"}
                  <small>
                    {"Weather · 1990→"}
                  </small>
                </div>
                <div className="dataset">
                  {"MODIS"}
                  <small>
                    {"Greenness · 2000→"}
                  </small>
                </div>
                <div className="dataset">
                  {"HLS"}
                  <small>
                    {"30 m squares · 2015→"}
                  </small>
                </div>
                <div className="dataset">
                  {"SMAP"}
                  <small>
                    {"Soil water · 2015→"}
                  </small>
                </div>
                <div className="dataset">
                  {"GPM IMERG"}
                  <small>
                    {"Rain · 2000→"}
                  </small>
                </div>
                <div className="dataset">
                  {"ECOSTRESS"}
                  <small>
                    {"Leaf heat"}
                  </small>
                </div>
                <div className="dataset">
                  {"SRTM"}
                  <small>
                    {"Land height"}
                  </small>
                </div>
              </div>
            </section>
            <section className="col" style={{"gap":"24px","alignItems":"center","textAlign":"center","padding":"88px 24px","borderRadius":"36px","background":"#E9EADF"} as any}>
              <svg aria-hidden="true" width="96" height="96" viewBox="0 0 60 60">
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
              <h2 className="h2x" style={{"maxWidth":"760px"} as any}>
                {"Your field has 36 years of memory. Let's use it."}
              </h2>
              <div className="row" style={{"gap":"12px"} as any}>
                <Link href={__r("V19-SignUp") + ""} className="btn sun press" style={{"height":"58px","borderRadius":"29px","fontSize":"16px","padding":"0 26px"} as any}>
                  {"Add your field, it's free"}
                </Link>
                <Link href={__r("V21-Tour-Welcome-Guest") + ""} className="btn soft press" style={{"height":"58px","borderRadius":"29px","fontSize":"16px"} as any}>
                  {"See a sample field"}
                </Link>
              </div>
              <span className="meta" style={{"fontSize":"14px"} as any}>
                {"No sensors. Works on a cheap phone. English and Arabic."}
              </span>
            </section>
            <footer className="row sp hair meta" style={{"paddingTop":"28px"} as any}>
              <span className="row" style={{"gap":"10px"} as any}>
                <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                  <rect width="34" height="34" rx="11" fill="#17251C" />
                  <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                  <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
                </svg>
                <span>
                  {"Bezra · Astro Weirdos · NASA Space Apps 2026"}
                </span>
              </span>
              <span>
                {"Bezra helps you think. It doesn't decide for you."}
              </span>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
