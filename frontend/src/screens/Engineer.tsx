'use client';
/* eslint-disable */
// Generated from design/html/V11-Engineer.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./Engineer.logic.js (verbatim from the design).
import { Fragment } from 'react';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import AboutLink from '@/components/AboutLink';
import Logic from './Engineer.logic';

export default function EngineerScreen() {
  const __v = useDC(Logic);
  return (
    <>
      <div className="root">
        <div className="shell">
          <header className="top">
            <Link href="/field/north-plot" className="brand" aria-label="Bezra, my field">
              <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
                <rect width="34" height="34" rx="11" fill="#17251C" />
                <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
                <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
              </svg>
              {"bezra"}
            </Link>
            <nav aria-label="Main" className="nav">
              <Link href="/field/north-plot" className="press">
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
              <Link href="/engineer" aria-current="page" className="press">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" />
                </svg>
                {"Engineer"}
              </Link>
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
              <Link href="/field/north-plot/alerts" className="ibtn press" aria-label="Alerts, 2 new">
                <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
                </svg>
                <span className="dot" />
              </Link>
              <span className="who">
                <span className="av" aria-hidden="true">
                  {"MA"}
                </span>
                <span>
                  <b>
                    {"Eng. Mona Adel"}
                  </b>
                  <small>
                    {"212 farmers, 4 villages"}
                  </small>
                </span>
              </span>
            </div>
          </header>
          <main className="main">
            <div className="head">
              <div className="col rise" style={{"--d":"0","gap":"6px"} as any}>
                <span className="eyebrow">
                  {"Saturday, 14 November. Shibin El Kom district."}
                </span>
                <h1 className="h1">
                  {"Where to go first"}
                </h1>
              </div>
              <div className="row rise wrap" style={{"--d":"1","gap":"6px"} as any}>
                <button type="button" className="btn sm press ">
                  {"All risks"}
                </button>
                <button type="button" className="btn sm press line">
                  {"Rust"}
                </button>
                <button type="button" className="btn sm press line">
                  {"Water"}
                </button>
                <button type="button" className="btn sm press line">
                  {"Pests"}
                </button>
                <button type="button" className="btn sm press line">
                  {"Pending approval"}
                </button>
              </div>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"repeat(4, minmax(0, 1fr))"} as any}>
              <section className="card rise " style={{"--d":"1","gap":"8px"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"1"} as any} />
                <span className="tl">
                  {"Fields at high risk"}
                </span>
                <span className="num">
                  {"14"}
                  <small>
                    {" of 212"}
                  </small>
                </span>
                <span className="sub" style={{"fontSize":"13px"} as any}>
                  {"9 rust, 5 water"}
                </span>
              </section>
              <section className="card rise " style={{"--d":"2","gap":"8px"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"2"} as any} />
                <span className="tl">
                  {"Plans to approve"}
                </span>
                <span className="num">
                  {"23"}
                  <small />
                </span>
                <span className="sub" style={{"fontSize":"13px"} as any}>
                  {"Oldest 4 days"}
                </span>
              </section>
              <section className="card rise " style={{"--d":"3","gap":"8px"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                <span className="tl">
                  {"Photo cases"}
                </span>
                <span className="num">
                  {"6"}
                  <small>
                    {" new"}
                  </small>
                </span>
                <span className="sub" style={{"fontSize":"13px"} as any}>
                  {"2 armyworm, 1 rust"}
                </span>
              </section>
              <section className="card rise " style={{"--d":"4","gap":"8px"} as any}>
                <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                <span className="tl">
                  {"Hot spring days"}
                </span>
                <span className="num">
                  {"+40%"}
                  <small>
                    {" more"}
                  </small>
                </span>
                <span className="sub" style={{"fontSize":"13px"} as any}>
                  {"Than in the 1990s, Demo"}
                </span>
              </section>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 460px","alignItems":"stretch"} as any}>
              <section aria-label="Risk map" className="hero rise" style={{"--d":"3","minHeight":"600px","background":"#E3E0D4"} as any}>
                <i className="sk map" aria-hidden="true" style={{"--d":"3"} as any} />
                <svg viewBox="0 0 960 560" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{"position":"absolute","inset":"0"} as any} role="img" aria-label="Fields in the district coloured by risk. Most are green, a cluster near Batanoun is orange and red.">
                  <rect width="960" height="560" fill="#E3E0D4" />
                  <path d="M-20 300C200 280 380 340 560 300S820 240 980 270" stroke="#9CC1DA" strokeWidth="12" fill="none" />
                  <path d="M300 -20C320 160 280 340 330 580" stroke="#D7D1BE" strokeWidth="8" fill="none" />
                  <rect className="pop" style={{"--i":"0"} as any} x="371" y="117" width="55" height="71" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-10 371 117)" />
                  <rect className="pop" style={{"--i":"1"} as any} x="880" y="314" width="36" height="53" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(4 880 314)" />
                  <rect className="pop" style={{"--i":"2"} as any} x="259" y="59" width="35" height="57" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-10 259 59)" />
                  <rect className="pop" style={{"--i":"3"} as any} x="286" y="86" width="65" height="57" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(6 286 86)" />
                  <rect className="pop" style={{"--i":"4"} as any} x="166" y="154" width="70" height="70" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(6 166 154)" />
                  <rect className="pop" style={{"--i":"5"} as any} x="639" y="243" width="33" height="44" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(5 639 243)" />
                  <rect className="pop" style={{"--i":"6"} as any} x="176" y="188" width="56" height="39" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-9 176 188)" />
                  <rect className="pop" style={{"--i":"7"} as any} x="624" y="197" width="65" height="73" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-9 624 197)" />
                  <rect className="pop" style={{"--i":"8"} as any} x="635" y="332" width="70" height="42" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-9 635 332)" />
                  <rect className="pop" style={{"--i":"9"} as any} x="600" y="404" width="34" height="66" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(7 600 404)" />
                  <rect className="pop" style={{"--i":"10"} as any} x="250" y="294" width="64" height="57" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(2 250 294)" />
                  <rect className="pop" style={{"--i":"11"} as any} x="639" y="272" width="53" height="49" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-7 639 272)" />
                  <rect className="pop" style={{"--i":"12"} as any} x="755" y="439" width="45" height="35" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(4 755 439)" />
                  <rect className="pop" style={{"--i":"13"} as any} x="546" y="488" width="51" height="76" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-3 546 488)" />
                  <rect className="pop" style={{"--i":"14"} as any} x="663" y="77" width="37" height="62" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-7 663 77)" />
                  <rect className="pop" style={{"--i":"15"} as any} x="815" y="215" width="39" height="61" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-11 815 215)" />
                  <rect className="pop" style={{"--i":"16"} as any} x="724" y="79" width="65" height="66" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-2 724 79)" />
                  <rect className="pop" style={{"--i":"17"} as any} x="751" y="219" width="68" height="61" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-10 751 219)" />
                  <rect className="pop" style={{"--i":"18"} as any} x="900" y="87" width="47" height="60" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-11 900 87)" />
                  <rect className="pop" style={{"--i":"19"} as any} x="788" y="399" width="49" height="71" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-3 788 399)" />
                  <rect className="pop" style={{"--i":"20"} as any} x="773" y="237" width="52" height="31" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-1 773 237)" />
                  <rect className="pop" style={{"--i":"21"} as any} x="212" y="352" width="37" height="61" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-6 212 352)" />
                  <rect className="pop" style={{"--i":"22"} as any} x="826" y="187" width="38" height="77" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(0 826 187)" />
                  <rect className="pop" style={{"--i":"23"} as any} x="440" y="486" width="61" height="35" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(2 440 486)" />
                  <rect className="pop" style={{"--i":"24"} as any} x="451" y="321" width="47" height="38" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(5 451 321)" />
                  <rect className="pop" style={{"--i":"25"} as any} x="325" y="401" width="56" height="52" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-5 325 401)" />
                  <rect className="pop" style={{"--i":"26"} as any} x="194" y="82" width="41" height="39" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(9 194 82)" />
                  <rect className="pop" style={{"--i":"27"} as any} x="278" y="46" width="61" height="67" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-4 278 46)" />
                  <rect className="pop" style={{"--i":"28"} as any} x="328" y="42" width="39" height="56" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-1 328 42)" />
                  <rect className="pop" style={{"--i":"29"} as any} x="664" y="329" width="50" height="38" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(7 664 329)" />
                  <rect className="pop" style={{"--i":"0"} as any} x="710" y="386" width="33" height="59" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(0 710 386)" />
                  <rect className="pop" style={{"--i":"1"} as any} x="447" y="244" width="55" height="36" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(8 447 244)" />
                  <rect className="pop" style={{"--i":"2"} as any} x="450" y="71" width="42" height="34" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(2 450 71)" />
                  <rect className="pop" style={{"--i":"3"} as any} x="206" y="96" width="51" height="68" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-9 206 96)" />
                  <rect className="pop" style={{"--i":"4"} as any} x="40" y="330" width="39" height="64" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-1 40 330)" />
                  <rect className="pop" style={{"--i":"5"} as any} x="668" y="53" width="34" height="43" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-8 668 53)" />
                  <rect className="pop" style={{"--i":"6"} as any} x="689" y="169" width="52" height="68" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(3 689 169)" />
                  <rect className="pop" style={{"--i":"7"} as any} x="165" y="99" width="61" height="59" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(3 165 99)" />
                  <rect className="pop" style={{"--i":"8"} as any} x="359" y="83" width="39" height="36" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(11 359 83)" />
                  <rect className="pop" style={{"--i":"9"} as any} x="311" y="285" width="40" height="63" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-6 311 285)" />
                  <rect className="pop" style={{"--i":"10"} as any} x="580" y="225" width="39" height="74" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-12 580 225)" />
                  <rect className="pop" style={{"--i":"11"} as any} x="816" y="310" width="49" height="71" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(10 816 310)" />
                  <rect className="pop" style={{"--i":"12"} as any} x="307" y="305" width="53" height="40" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(12 307 305)" />
                  <rect className="pop" style={{"--i":"13"} as any} x="268" y="312" width="64" height="79" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-2 268 312)" />
                  <rect className="pop" style={{"--i":"14"} as any} x="691" y="154" width="69" height="80" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-5 691 154)" />
                  <rect className="pop" style={{"--i":"15"} as any} x="877" y="245" width="44" height="42" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(3 877 245)" />
                  <rect className="pop" style={{"--i":"16"} as any} x="404" y="414" width="31" height="31" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(3 404 414)" />
                  <rect className="pop" style={{"--i":"17"} as any} x="305" y="139" width="68" height="52" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(11 305 139)" />
                  <rect className="pop" style={{"--i":"18"} as any} x="397" y="226" width="35" height="44" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-5 397 226)" />
                  <rect className="pop" style={{"--i":"19"} as any} x="521" y="140" width="51" height="43" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(7 521 140)" />
                  <rect className="pop" style={{"--i":"20"} as any} x="664" y="470" width="30" height="60" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(8 664 470)" />
                  <rect className="pop" style={{"--i":"21"} as any} x="126" y="467" width="37" height="54" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(3 126 467)" />
                  <rect className="pop" style={{"--i":"22"} as any} x="222" y="262" width="70" height="51" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(11 222 262)" />
                  <rect className="pop" style={{"--i":"23"} as any} x="445" y="277" width="55" height="77" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(11 445 277)" />
                  <rect className="pop" style={{"--i":"24"} as any} x="202" y="127" width="38" height="31" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(6 202 127)" />
                  <rect className="pop" style={{"--i":"25"} as any} x="516" y="452" width="39" height="69" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(9 516 452)" />
                  <rect className="pop" style={{"--i":"26"} as any} x="398" y="119" width="65" height="65" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-12 398 119)" />
                  <rect className="pop" style={{"--i":"27"} as any} x="54" y="449" width="36" height="63" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(1 54 449)" />
                  <rect className="pop" style={{"--i":"28"} as any} x="239" y="462" width="43" height="31" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-6 239 462)" />
                  <rect className="pop" style={{"--i":"29"} as any} x="339" y="296" width="45" height="78" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-4 339 296)" />
                  <rect className="pop" style={{"--i":"0"} as any} x="597" y="254" width="38" height="33" rx="3" fill="#F29B1E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(2 597 254)" />
                  <rect className="pop" style={{"--i":"1"} as any} x="718" y="338" width="63" height="56" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-8 718 338)" />
                  <rect className="pop" style={{"--i":"2"} as any} x="584" y="117" width="63" height="62" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(2 584 117)" />
                  <rect className="pop" style={{"--i":"3"} as any} x="835" y="133" width="68" height="30" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-7 835 133)" />
                  <rect className="pop" style={{"--i":"4"} as any} x="184" y="282" width="69" height="76" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(5 184 282)" />
                  <rect className="pop" style={{"--i":"5"} as any} x="103" y="206" width="63" height="63" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(3 103 206)" />
                  <rect className="pop" style={{"--i":"6"} as any} x="843" y="437" width="36" height="65" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-5 843 437)" />
                  <rect className="pop" style={{"--i":"7"} as any} x="235" y="181" width="32" height="79" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(4 235 181)" />
                  <rect className="pop" style={{"--i":"8"} as any} x="503" y="327" width="31" height="78" rx="3" fill="#3E8F4E" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(2 503 327)" />
                  <rect className="pop" style={{"--i":"9"} as any} x="373" y="353" width="62" height="68" rx="3" fill="#C2412A" fillOpacity=".72" stroke="#fff" strokeWidth="1.5" transform="rotate(-6 373 353)" />
                  <g fontFamily="Hanken Grotesk, sans-serif" fontSize="13" fontWeight="700" fill="#141A16">
                    <text x="120" y="90">
                      {"Shibin El Kom"}
                    </text>
                    <text x="620" y="420">
                      {"Batanoun"}
                    </text>
                    <text x="640" y="110">
                      {"Meet Khalaf"}
                    </text>
                  </g>
                </svg>
                <div className="float" style={{"position":"absolute","left":"18px","bottom":"18px","padding":"10px 14px","display":"flex","gap":"14px","fontSize":"13px","fontWeight":"500"} as any}>
                  <span className="lv lv-high">
                    <i />
                    {"High"}
                  </span>
                  <span className="lv lv-med">
                    <i />
                    {"Medium"}
                  </span>
                  <span className="lv lv-low">
                    <i />
                    {"Low"}
                  </span>
                </div>
              </section>
              <div className="col" style={{"gap":"10px"} as any}>
                <div className="row sp rise" style={{"--d":"2"} as any}>
                  <h2 className="h2">
                    {"Visit queue"}
                  </h2>
                  <span className="tl">
                    {"Ranked by risk and reach"}
                  </span>
                </div>
                <ol style={{"margin":"0","padding":"0","display":"flex","flexDirection":"column","gap":"8px"} as any}>
                  <li className="rise lift" style={{"--d":"3","listStyle":"none","display":"grid","gridTemplateColumns":"28px 1fr auto","gap":"12px","alignItems":"center","padding":"12px","borderRadius":"12px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                    <b style={{"fontSize":"15px","color":"var(--muted)"} as any}>
                      {"1"}
                    </b>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Hassan Farouk"}
                      </b>
                      <span className="tl">
                        {"Shibin El Kom, Wheat, Giza 171"}
                      </span>
                      <span className="sub" style={{"fontSize":"13px"} as any}>
                        {"Rust weather, weak variety, not checked yet"}
                      </span>
                    </span>
                    <span className="col" style={{"alignItems":"flex-end","gap":"4px"} as any}>
                      <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                        {"86"}
                      </b>
                      <span className="lv lv-high">
                        <i />
                        {"Visit first"}
                      </span>
                    </span>
                  </li>
                  <li className="rise lift" style={{"--d":"4","listStyle":"none","display":"grid","gridTemplateColumns":"28px 1fr auto","gap":"12px","alignItems":"center","padding":"12px","borderRadius":"12px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                    <b style={{"fontSize":"15px","color":"var(--muted)"} as any}>
                      {"2"}
                    </b>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Samia Ibrahim"}
                      </b>
                      <span className="tl">
                        {"Batanoun, Wheat, Sakha 95"}
                      </span>
                      <span className="sub" style={{"fontSize":"13px"} as any}>
                        {"Tail of mesqa, turn skipped last week"}
                      </span>
                    </span>
                    <span className="col" style={{"alignItems":"flex-end","gap":"4px"} as any}>
                      <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                        {"71"}
                      </b>
                      <span className="lv lv-high">
                        <i />
                        {"Visit first"}
                      </span>
                    </span>
                  </li>
                  <li className="rise lift" style={{"--d":"5","listStyle":"none","display":"grid","gridTemplateColumns":"28px 1fr auto","gap":"12px","alignItems":"center","padding":"12px","borderRadius":"12px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                    <b style={{"fontSize":"15px","color":"var(--muted)"} as any}>
                      {"3"}
                    </b>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Ahmed Salah"}
                      </b>
                      <span className="tl">
                        {"Shibin El Kom, Berseem"}
                      </span>
                      <span className="sub" style={{"fontSize":"13px"} as any}>
                        {"Weak patch 2 images in a row"}
                      </span>
                    </span>
                    <span className="col" style={{"alignItems":"flex-end","gap":"4px"} as any}>
                      <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                        {"58"}
                      </b>
                      <span className="lv lv-med">
                        <i />
                        {"This week"}
                      </span>
                    </span>
                  </li>
                  <li className="rise lift" style={{"--d":"6","listStyle":"none","display":"grid","gridTemplateColumns":"28px 1fr auto","gap":"12px","alignItems":"center","padding":"12px","borderRadius":"12px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                    <b style={{"fontSize":"15px","color":"var(--muted)"} as any}>
                      {"4"}
                    </b>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Fathy Nour"}
                      </b>
                      <span className="tl">
                        {"Meet Khalaf, Wheat, Misr 3"}
                      </span>
                      <span className="sub" style={{"fontSize":"13px"} as any}>
                        {"Plan waiting for your approval"}
                      </span>
                    </span>
                    <span className="col" style={{"alignItems":"flex-end","gap":"4px"} as any}>
                      <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                        {"44"}
                      </b>
                      <span className="lv lv-med">
                        <i />
                        {"This week"}
                      </span>
                    </span>
                  </li>
                  <li className="rise lift" style={{"--d":"7","listStyle":"none","display":"grid","gridTemplateColumns":"28px 1fr auto","gap":"12px","alignItems":"center","padding":"12px","borderRadius":"12px","background":"#fff","boxShadow":"0 1px 2px rgba(20,26,22,.05)"} as any}>
                    <b style={{"fontSize":"15px","color":"var(--muted)"} as any}>
                      {"5"}
                    </b>
                    <span className="col" style={{"gap":"2px"} as any}>
                      <b style={{"fontSize":"15px","fontWeight":"600"} as any}>
                        {"Om Karim"}
                      </b>
                      <span className="tl">
                        {"Batanoun, Sugar beet"}
                      </span>
                      <span className="sub" style={{"fontSize":"13px"} as any}>
                        {"All on track"}
                      </span>
                    </span>
                    <span className="col" style={{"alignItems":"flex-end","gap":"4px"} as any}>
                      <b style={{"fontSize":"22px","fontWeight":"600"} as any}>
                        {"22"}
                      </b>
                      <span className="lv lv-low">
                        <i />
                        {"OK"}
                      </span>
                    </span>
                  </li>
                </ol>
                <section className="card rise " style={{"--d":"9"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"9"} as any} />
                  <div className="row sp">
                    <span className="col">
                      <span className="tl">
                        {"Hassan Farouk, North plot"}
                      </span>
                      <b style={{"fontSize":"17px","fontWeight":"600"} as any}>
                        {"Season plan, 9 actions"}
                      </b>
                    </span>
                    <span className="lv lv-med">
                      <i />
                      {"Pending"}
                    </span>
                  </div>
                  <label className="vh" htmlFor="note">
                    {"Note to farmer"}
                  </label>
                  <textarea id="note" placeholder="Nitrogen second dose: write the amount here" style={{"minHeight":"64px","padding":"10px 12px","border":"0","borderRadius":"10px","background":"var(--inset)","fontFamily":"inherit","fontSize":"14px","resize":"none"} as any} />
                  <button type="button" className={__s(__v?.apCls) as any} onClick={__v?.approve} aria-pressed={__s(__v?.apP) as any}>
                    {__s(__v?.apL)}
                  </button>
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
                {"All numbers on this screen are demo data."}
                <AboutLink />
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
