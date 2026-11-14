'use client';
// Season report (Profile → "Season report, PDF"). Not in the V11 artboards; built from V11 parts
// (head, cards, insets, provenance pills, level badges). "Save as PDF" uses the browser's print dialog.
// Everything comes from the signed-in farmer's field: GET /fields/{id}/summary and /plan.
// Timing only: never fertilizer or pesticide amounts.
import Link from 'next/link';
import { FarmerHeader, Foot, BrandMark } from '@/components/chrome';
import { useApi, PV as PVC } from '@/lib/api';
import { useField, useUser } from '@/lib/field';
import { useState } from 'react';
import PastSeason from '@/components/PastSeason';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LV: Record<string, string> = { Low: 'lv lv-low', Medium: 'lv lv-med', High: 'lv lv-high' };
const ST: Record<string, string> = { Done: 'lv lv-low', Late: 'lv lv-med', Skipped: 'lv lv-high', 'On time': 'pill' };
const dm = (iso?: string | null) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '');

export default function ReportScreen() {
  const { id } = useField();
  const { user } = useUser();
  const S = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  const P = useApi<any>(id ? `/fields/${id}/plan` : null, undefined, true).data;
  const ok = useApi<any>(id ? `/plans/${id}` : null, undefined, true).data;
  const past = useApi<any>(id ? `/fields/${id}/seasons` : null).data?.seasons || [];
  const [which, setWhich] = useState<string>('now');  // 'now' = this season, else a past season id
  const f = S?.field;
  const row = (k: string, v: any, pill: string, cls: string) => (
    <div className="inset"><span>{k}</span><span className="row" style={{ gap: '6px' }}><b>{v ?? '…'}</b><span className={cls}>{pill}</span></span></div>
  );
  const year = f ? new Date(f.sow_date).getFullYear() : '';
  return (
    <div className="root">
      <style>{`@media print{.no-print{display:none!important}.root{padding:0;background:#fff}.shell{box-shadow:none;border-radius:0;padding:0}.card{box-shadow:none;border:1px solid #E4E4DF}.rise{animation:none!important;opacity:1!important}}`}</style>
      <div className="shell">
        <div className="no-print"><FarmerHeader active="profile" /></div>
        <main className="main">
          <div className="head">
            <div className="col rise" style={{ '--d': '0', gap: '6px' } as React.CSSProperties}>
              <span className="eyebrow">{f ? [f.farmer || user?.name, f.name, f.village, f.governorate].filter(Boolean).join(', ') : '…'}</span>
              <h1 className="h1">{f ? `Season report, ${f.crop.toLowerCase()} ${year} to ${Number(year) + 1}` : 'Season report'}</h1>
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

          {past.length ? (
            <div role="group" aria-label="Season" className="seg no-print" style={{ alignSelf: 'flex-start' }}>
              <button type="button" className={'segb press' + (which === 'now' ? ' on' : '')} onClick={() => setWhich('now')}>{'This season'}</button>
              {past.map((p: any) => (
                <button key={p.season} type="button" className={'segb press' + (which === p.season ? ' on' : '')} onClick={() => setWhich(p.season)}>{p.season}</button>
              ))}
            </div>
          ) : null}
          {which !== 'now' && past.find((p: any) => p.season === which) ? <PastSeason s={past.find((p: any) => p.season === which)} /> : null}
          <div className="grid r-stack" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', alignItems: 'start', display: which === 'now' ? undefined : 'none' }}>
            <section className="card rise" style={{ '--d': '2' } as React.CSSProperties}>
              <div className="row" style={{ gap: '10px' }}>
                <BrandMark />
                <h2 className="h2">{'Field'}</h2>
              </div>
              <div className="col" style={{ gap: '4px' }}>
                {row('Crop', f ? [f.crop, f.variety].filter(Boolean).join(', ') : null, 'You', 'pill pv-farm')}
                {row('Sown', f ? dm(f.sow_date) : null, 'You', 'pill pv-farm')}
                {row('Area', f ? `${f.area.value} feddan` : null, 'You', 'pill pv-farm')}
                {row('Soil', f?.soil?.value, 'Est.', 'pill pv-est')}
                {row('Water', f?.water_source?.value, 'You', 'pill pv-farm')}
                {row('Stage today', S ? `${S.stage}, day ${Math.max(0, S.day_n)}` : null, 'Est.', 'pill pv-est')}
                {row('Water used', S ? `${(S.water_used?.value ?? 0).toLocaleString('en-US')} m³` : null, 'Farmer', 'pill pv-farm')}
              </div>
              <h2 className="h2" style={{ marginTop: '6px' }}>{'Risks this week'}</h2>
              <div className="col" style={{ gap: '4px' }}>
                {S ? Object.entries(S.risks).filter(([k]) => k !== 'pests').map(([k, r]: [string, any]) => (
                  <div key={k} className="inset" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '4px' }}>
                    <span className="row sp" style={{ width: '100%' }}>
                      <b style={{ color: 'var(--ink)' }}>{k[0].toUpperCase() + k.slice(1)}</b>
                      <span className={LV[r.level]}><i />{r.level}</span>
                    </span>
                    <span style={{ color: 'var(--ink2)' }}>{r.line}</span>
                  </div>
                )) : <span className="tl">{'Loading…'}</span>}
              </div>
            </section>

            <section className="card rise" style={{ '--d': '3' } as React.CSSProperties}>
              <div className="row sp wrap">
                <h2 className="h2">{P ? `Season plan, ${P.tracker.text.replace('On plan: ', '').replace(' tasks', '')} on plan` : 'Season plan'}</h2>
                <span className={ok?.status === 'approved' ? 'lv lv-low' : 'lv lv-med'}><i />{ok?.status === 'approved' ? `Approved by Eng. ${ok.by}` : 'Engineer review pending'}</span>
              </div>
              {P ? <p className="body">{P.status.text}</p> : null}
              <div className="col" style={{ gap: '6px' }}>
                {(P?.tasks || []).map((t: any) => (
                  <div key={t.id} className="grid r-stack" style={{ gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, .8fr) auto', gap: '12px', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', background: 'var(--inset)' }}>
                    <span className="col" style={{ gap: '4px' }}>
                      <span className="row" style={{ gap: '8px' }}>
                        <span className={ST[t.status] || 'pill'}>{t.status !== 'On time' ? <i /> : null}{t.status}</span>
                        <span className="tl">{t.window ? `${dm(t.window[0])} to ${dm(t.window[1])}` : dm(t.planned_date)}{t.done_date ? `, done ${dm(t.done_date)}` : ''}</span>
                      </span>
                      <b style={{ fontSize: '15px', fontWeight: 600 }}>{t.title}</b>
                      <span className="tl" style={{ fontSize: '13px' }}>{t.why}</span>
                    </span>
                    <span className="col">
                      {t.benefit?.range ? <><span className="tl">{'Protects'}</span><b style={{ fontSize: '17px', fontWeight: 600 }}>{`${Math.round(t.benefit.range[0])} to ${Math.round(t.benefit.range[1])}%`}<small className="unit">{' of harvest'}</small></b></>
                        : <span className="tl">{t.benefit?.text || ''}</span>}
                    </span>
                    <span className={(PVC[t.provenance] || PVC.estimated).cls}>{(PVC[t.provenance] || PVC.estimated).label}</span>
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
