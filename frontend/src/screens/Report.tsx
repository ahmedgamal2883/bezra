'use client';
// Season report (Profile → "Season report, PDF"). Not in the V11 artboards; built from V11 parts
// (head, cards, insets, provenance pills, level badges). "Save as PDF" uses the browser's print dialog.
// Content mirrors the Today and Season plan screens. Timing only: never fertilizer or pesticide amounts.
import Link from 'next/link';
import { FarmerHeader, Foot, BrandMark } from '@/components/chrome';

const PLAN = [
  { st: 'Done', when: 'Chosen in September', what: 'Variety: Sakha 95', why: 'Heat tolerant and rust resistant for the Delta.', prot: '5 to 9%', src: 'Agronomist' },
  { st: 'Done', when: 'Sown 15 Oct', what: 'Sow by 15 October', why: 'Early sowing moves grain fill before the April heat.', prot: '10 to 15%', src: 'Estimated' },
  { st: 'Done', when: '3 Nov', what: 'First water after sowing', why: 'Even germination across the field.', prot: '2 to 4%', src: 'Farmer' },
  { st: 'Now', when: 'Thursday 19 Nov', what: 'Water turn, do not skip', why: 'Tillering is the stage most hurt by thirst.', prot: '8 to 12%', src: 'Estimated' },
  { st: 'Now', when: '14 Nov to 10 Dec', what: 'Keep the field free of weeds', why: 'Critical weed free period. Weed before fertilizing.', prot: '4 to 8%', src: 'Estimated' },
  { st: 'Coming', when: 'Around 5 Dec', what: 'Split nitrogen, second dose', why: 'Timing only. Your engineer sets the amount.', prot: '3 to 6%', src: 'Agronomist' },
  { st: 'Coming', when: '10 Jan to 28 Feb', what: 'Scout for yellow rust', why: 'Cool, foggy weeks favour rust. Check leaves weekly.', prot: '5 to 15%', src: 'Estimated' },
  { st: 'Coming', when: 'If heat is forecast in April', what: 'Water before the heat', why: 'A light turn 2 days before a heat wave cools the crop.', prot: '6 to 10%', src: 'Estimated' },
  { st: 'Coming', when: '10 to 25 April', what: 'Harvest window', why: 'Harvest before the khamaseen winds.', prot: '1 to 3%', src: 'Estimated' },
];
const PV: Record<string, string> = { Agronomist: 'pill pv-agro', Estimated: 'pill pv-est', Farmer: 'pill pv-farm', Satellite: 'pill pv-sat' };
const ST: Record<string, string> = { Done: 'lv lv-low', Now: 'lv lv-med', Coming: 'pill' };

const RISKS = [
  { name: 'Heat', lv: 'Low', line: 'No hot days in the next week.' },
  { name: 'Water', lv: 'Medium', line: "The soil is drying. Don't miss Thursday." },
  { name: 'Rust', lv: 'Medium', line: '4 of the last 7 nights were foggy. Rust likes that.' },
  { name: 'Pests', lv: 'Low', line: 'No pests reported near you.' },
];
const LV: Record<string, string> = { Low: 'lv lv-low', Medium: 'lv lv-med', High: 'lv lv-high' };

export default function ReportScreen() {
  return (
    <div className="root">
      <style>{`@media print{.no-print{display:none!important}.root{padding:0;background:#fff}.shell{box-shadow:none;border-radius:0;padding:0}.card{box-shadow:none;border:1px solid var(--line);break-inside:avoid}.rise{animation:none!important}}`}</style>
      <div className="shell">
        <div className="no-print"><FarmerHeader active="profile" /></div>
        <main className="main">
          <div className="head">
            <div className="col rise" style={{ '--d': '0', gap: '6px' } as React.CSSProperties}>
              <span className="eyebrow">{'Hassan Farouk, North plot, Shibin El Kom, Menoufia'}</span>
              <h1 className="h1">{'Season report, wheat 2026 to 2027'}</h1>
            </div>
            <div className="row no-print rise" style={{ '--d': '1', gap: '8px' } as React.CSSProperties}>
              <Link href="/profile" className="btn line press">{'Back to profile'}</Link>
              <button type="button" className="btn press" onClick={() => window.print()}>
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
                </svg>
                {'Save as PDF'}
              </button>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', alignItems: 'start' }}>
            <section className="card rise" style={{ '--d': '2' } as React.CSSProperties}>
              <div className="row" style={{ gap: '10px' }}>
                <BrandMark />
                <h2 className="h2">{'Field'}</h2>
              </div>
              <div className="col" style={{ gap: '4px' }}>
                <div className="inset"><span>{'Crop'}</span><span className="row" style={{ gap: '6px' }}><b>{'Wheat, Sakha 95'}</b><span className="pill pv-farm">{'You'}</span></span></div>
                <div className="inset"><span>{'Sown'}</span><span className="row" style={{ gap: '6px' }}><b>{'15 Oct'}</b><span className="pill pv-farm">{'You'}</span></span></div>
                <div className="inset"><span>{'Area'}</span><span className="row" style={{ gap: '6px' }}><b>{'2.4 feddan'}</b><span className="pill pv-farm">{'You'}</span></span></div>
                <div className="inset"><span>{'Soil'}</span><span className="row" style={{ gap: '6px' }}><b>{'Heavy clay'}</b><span className="pill pv-est">{'Est.'}</span></span></div>
                <div className="inset"><span>{'Water'}</span><span className="row" style={{ gap: '6px' }}><b>{'Mesqa, tail end'}</b><span className="pill pv-farm">{'You'}</span></span></div>
                <div className="inset"><span>{'Stage today'}</span><span className="row" style={{ gap: '6px' }}><b>{'Tillering, day 30'}</b><span className="pill pv-est">{'Est.'}</span></span></div>
                <div className="inset"><span>{'Water used'}</span><span className="row" style={{ gap: '6px' }}><b>{'1,150 m³'}</b><span className="pill pv-farm">{'Farmer'}</span></span></div>
              </div>
              <h2 className="h2" style={{ marginTop: '6px' }}>{'Risks this week'}</h2>
              <div className="col" style={{ gap: '4px' }}>
                {RISKS.map((r) => (
                  <div key={r.name} className="inset" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '4px' }}>
                    <span className="row sp" style={{ width: '100%' }}>
                      <b style={{ color: 'var(--ink)' }}>{r.name}</b>
                      <span className={LV[r.lv]}><i />{r.lv}</span>
                    </span>
                    <span style={{ color: 'var(--ink2)' }}>{r.line}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card rise" style={{ '--d': '3' } as React.CSSProperties}>
              <div className="row sp">
                <h2 className="h2">{'Season plan, 3 of 9 done'}</h2>
                <span className="lv lv-med"><i />{'Engineer review pending'}</span>
              </div>
              <p className="body">{'If you follow this plan, you protect about '}<b>{'14 to 22%'}</b>{' of your harvest from late heat, rust and thirst.'}</p>
              <div className="col" style={{ gap: '6px' }}>
                {PLAN.map((t, i) => (
                  <div key={i} className="grid" style={{ gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, .8fr) auto', gap: '12px', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', background: 'var(--inset)' }}>
                    <span className="col" style={{ gap: '4px' }}>
                      <span className="row" style={{ gap: '8px' }}>
                        <span className={ST[t.st]}>{t.st !== 'Coming' ? <i /> : null}{t.st}</span>
                        <span className="tl">{t.when}</span>
                      </span>
                      <b style={{ fontSize: '15px', fontWeight: 600 }}>{t.what}</b>
                      <span className="tl" style={{ fontSize: '13px' }}>{t.why}</span>
                    </span>
                    <span className="col">
                      <span className="tl">{'Protects'}</span>
                      <b style={{ fontSize: '17px', fontWeight: 600 }}>{t.prot}<small className="unit">{' of harvest'}</small></b>
                    </span>
                    <span className={PV[t.src]}>{t.src}</span>
                  </div>
                ))}
              </div>
              <p className="tl">{'Fertilizer and pesticide amounts are not in this report. Your engineer decides them.'}</p>
            </section>
          </div>
          <Foot />
        </main>
      </div>
    </div>
  );
}
