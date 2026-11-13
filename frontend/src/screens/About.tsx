'use client';
/* eslint-disable */
// Generated from design/html/V11-About.html by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./About.logic.js (verbatim from the design).
import { Fragment } from 'react';
import { useField, FieldWho } from '@/lib/field';
import Link from 'next/link';
import { useDC, css as __css, s as __s } from '@/lib/dc';
import Logic from './About.logic';

export default function AboutScreen() {
  const { fp } = useField();
  const __v = useDC(Logic);
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
              <Link href={fp("/alerts")} className="ibtn press" aria-label="Alerts, 2 new">
                <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
                </svg>
                <span className="dot" />
              </Link>
              <span className="who">
                <span className="av" aria-hidden="true">
                  {"HF"}
                </span>
                <span>
                  <b>
                    {"Hassan Farouk"}
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
              <div className="col rise" style={{"--d":"0","gap":"6px"} as any}>
                <span className="eyebrow">
                  {"Every number in Bezra says where it came from"}
                </span>
                <h1 className="h1">
                  {"About the data"}
                </h1>
              </div>
            </div>
            <div className="grid" style={{"gridTemplateColumns":"minmax(0, 1fr) 360px","alignItems":"start"} as any}>
              <section aria-label="Datasets" className="col" style={{"gap":"2px"} as any}>
                <div style={{"display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","padding":"0 14px 8px","fontSize":"12px","fontWeight":"600","color":"var(--muted)"} as any}>
                  <span>
                    {"Dataset"}
                  </span>
                  <span>
                    {"What it measures"}
                  </span>
                  <span>
                    {"Detail"}
                  </span>
                  <span>
                    {"Delay"}
                  </span>
                  <span>
                    {"Bezra uses it for"}
                  </span>
                  <span>
                    {"Label"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"3","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"#fff","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"NASA POWER"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Daily heat, humidity, wind, sun, rain since 1981"}
                  </span>
                  <span className="tl">
                    {"~50 km, daily"}
                  </span>
                  <span className="tl">
                    {"2 to 3 days"}
                  </span>
                  <span className="tl">
                    {"Heat, water need, journey, calendar"}
                  </span>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"3","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"transparent","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"NEX-GDDP-CMIP6"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Future climate to 2050, two scenarios"}
                  </span>
                  <span className="tl">
                    {"25 km, daily"}
                  </span>
                  <span className="tl">
                    {"Static"}
                  </span>
                  <span className="tl">
                    {"Next season and the 2040 calendar"}
                  </span>
                  <span className="pill pv-est">
                    {"Estimated"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"3","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"#fff","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"HLS v2.0"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Greenness and moisture of your field"}
                  </span>
                  <span className="tl">
                    {"30 m, 2 to 3 days"}
                  </span>
                  <span className="tl">
                    {"2 to 4 days"}
                  </span>
                  <span className="tl">
                    {"Field health, weak patches"}
                  </span>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"4","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"transparent","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"MODIS MOD13Q1"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"20 years of greenness"}
                  </span>
                  <span className="tl">
                    {"250 m, 16 days"}
                  </span>
                  <span className="tl">
                    {"~1 week"}
                  </span>
                  <span className="tl">
                    {"Your field's normal season"}
                  </span>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"4","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"#fff","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"SMAP L4"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Root zone soil moisture"}
                  </span>
                  <span className="tl">
                    {"9 km, 3 hourly"}
                  </span>
                  <span className="tl">
                    {"1 to 2 days"}
                  </span>
                  <span className="tl">
                    {"Checks the water balance"}
                  </span>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"5","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"transparent","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"GPM IMERG"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Rain that already fell, never a forecast"}
                  </span>
                  <span className="tl">
                    {"~10 km"}
                  </span>
                  <span className="tl">
                    {"1 day"}
                  </span>
                  <span className="tl">
                    {"Water balance"}
                  </span>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"5","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"#fff","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"ECOSTRESS"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Crop surface heat and water stress"}
                  </span>
                  <span className="tl">
                    {"70 m, irregular"}
                  </span>
                  <span className="tl">
                    {"Varies"}
                  </span>
                  <span className="tl">
                    {"Details mode"}
                  </span>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"5","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"transparent","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"SRTM"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Slope and low spots"}
                  </span>
                  <span className="tl">
                    {"30 m"}
                  </span>
                  <span className="tl">
                    {"Static"}
                  </span>
                  <span className="tl">
                    {"Waterlogging hints"}
                  </span>
                  <span className="pill pv-sat">
                    {"Satellite"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"6","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"#fff","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"FAO GAEZ v4"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Crop suitability now and future"}
                  </span>
                  <span className="tl">
                    {"~1 to 10 km"}
                  </span>
                  <span className="tl">
                    {"Static"}
                  </span>
                  <span className="tl">
                    {"Rotation options"}
                  </span>
                  <span className="pill pv-est">
                    {"Estimated"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"6","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"transparent","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"ISRIC SoilGrids"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Soil texture first guess"}
                  </span>
                  <span className="tl">
                    {"250 m"}
                  </span>
                  <span className="tl">
                    {"Static"}
                  </span>
                  <span className="tl">
                    {"Water holding, until you add a test"}
                  </span>
                  <span className="pill pv-est">
                    {"Estimated"}
                  </span>
                </div>
                <div className="rise" style={{"--d":"7","display":"grid","gridTemplateColumns":"1.1fr 2fr 1fr 1fr 1.6fr 110px","gap":"12px","alignItems":"center","padding":"12px 14px","borderRadius":"10px","background":"#fff","fontSize":"14px"} as any}>
                  <b style={{"fontWeight":"600"} as any}>
                    {"Open-Meteo"}
                  </b>
                  <span style={{"color":"var(--ink2)"} as any}>
                    {"Weather forecast, 7 to 16 days"}
                  </span>
                  <span className="tl">
                    {"~10 km"}
                  </span>
                  <span className="tl">
                    {"Hourly"}
                  </span>
                  <span className="tl">
                    {"Heat and rust alerts"}
                  </span>
                  <span className="pill pv-est">
                    {"Estimated"}
                  </span>
                </div>
              </section>
              <aside className="col" style={{"gap":"14px"} as any}>
                <section className="card rise " style={{"--d":"2"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"2"} as any} />
                  <h2 className="h2">
                    {"The six labels"}
                  </h2>
                  <div className="col" style={{"gap":"4px"} as any}>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="pill pv-meas">
                        {"Measured"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"A lab test or a sensor on your field"}
                      </span>
                    </div>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="pill pv-sat">
                        {"Satellite"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"Straight from a NASA or ESA product"}
                      </span>
                    </div>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="pill pv-est">
                        {"Estimated"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"Calculated by Bezra from the data"}
                      </span>
                    </div>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="pill pv-farm">
                        {"Farmer"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"You told us"}
                      </span>
                    </div>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="pill pv-agro">
                        {"Agronomist"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"Checked by your engineer"}
                      </span>
                    </div>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="pill pv-demo">
                        {"Demo"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"Placeholder for the hackathon"}
                      </span>
                    </div>
                  </div>
                </section>
                <section className="card rise " style={{"--d":"3"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"3"} as any} />
                  <h2 className="h2">
                    {"Confidence"}
                  </h2>
                  <div className="col" style={{"gap":"4px"} as any}>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="lv lv-low">
                        <i />
                        {"High"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"Field data and your logs agree"}
                      </span>
                    </div>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="lv lv-med">
                        <i />
                        {"Medium"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"Area data or a first guess"}
                      </span>
                    </div>
                    <div className="inset" style={{"justifyContent":"flex-start"} as any}>
                      <span className="lv lv-high">
                        <i />
                        {"Low"}
                      </span>
                      <span style={{"color":"var(--ink2)"} as any}>
                        {"A layer is missing"}
                      </span>
                    </div>
                  </div>
                </section>
                <section className="card rise tint-s" style={{"--d":"4"} as any}>
                  <i className="sk " aria-hidden="true" style={{"--d":"4"} as any} />
                  <h2 className="h2">
                    {"Would Bezra have warned you?"}
                  </h2>
                  <p className="sub">
                    {"Heat waves at wheat grain fill, using only data from before each one."}
                  </p>
                  <span className="row" style={{"alignItems":"baseline","gap":"8px"} as any}>
                    <b style={{"fontSize":"40px","fontWeight":"600","letterSpacing":"-1.4px"} as any}>
                      {"4 of 5"}
                    </b>
                    <span className="tl">
                      {"warned 4 to 7 days early"}
                    </span>
                  </span>
                  <span className="pill pv-demo">
                    {"Demo"}
                  </span>
                </section>
              </aside>
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
              </span>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
}
