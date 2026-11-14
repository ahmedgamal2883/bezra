'use client';
// Phase 3: "Is it real? See the proof" behind a weak-spot alert. The same squares in the image before the alert
// and the newest one, with the dates, the greenness value of every square, the spot outlined, and links to open
// both days in ESA's own viewer. Data: GET /fields/{id}/field-alerts/{alert}/proof.
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FarmerHeader, Foot } from '@/components/chrome';
import { useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const shade = (v: number | null) => (v == null ? 'var(--inset)' : v >= 0.7 ? '#2F6B3E' : v >= 0.55 ? '#5E9150' : v >= 0.4 ? '#A9BF6E' : v >= 0.25 ? '#D9DE9C' : '#E9E1C8');

function Grid({ img, rows, cols, spot, tr }: any) {
  const on = new Set((spot || []).map(([r, c]: number[]) => `${r},${c}`));
  return (
    <div className="col" style={{ gap: '8px', alignItems: 'center' }}>
      <div className="proof-grid" dir="ltr" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 64px))` }}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const r = Math.floor(i / cols), c = i % cols;
          const x = img.cells.find((q: any) => q.r === r && q.c === c) || {};
          return (
            <span key={i} className={'proof-sq' + (on.has(`${r},${c}`) ? ' on' : '') + (x.masked ? ' masked' : '')}
              style={{ background: x.masked ? undefined : shade(x.ndvi), color: (x.ndvi ?? 0) >= 0.55 ? '#fff' : 'var(--ink)' }}>
              {x.masked ? '' : x.ndvi == null ? '–' : x.ndvi.toFixed(2)}
            </span>
          );
        })}
      </div>
      <a href={img.link} target="_blank" rel="noopener noreferrer" className="sub" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
        {tr('Open this day in ESA Copernicus Browser', 'افتح اليوم ده في برنامج وكالة الفضاء الأوروبية')}
      </a>
    </div>
  );
}

export default function AlertProof() {
  const tr = useT();
  const p = useParams();
  const id = String(p?.id || ''), aid = String(p?.aid || '');
  const P = useApi<any>(id && aid ? `/fields/${id}/field-alerts/${encodeURIComponent(aid)}/proof` : null).data;
  return (
    <div className="root">
      <div className="shell">
        <FarmerHeader active="field" />
        <main className="main" style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
          <div className="head">
            <div className="col" style={{ gap: '6px' }}>
              <Link href={`/field/${id}/alerts`} className="eyebrow press">{tr('Alerts', 'التنبيهات')}</Link>
              <h1 className="h1">{tr('Is it real?', 'حقيقية؟')}</h1>
            </div>
          </div>
          <p className="body" style={{ fontSize: '16px', maxWidth: '62ch' }}>
            {tr('These are the real greenness values (NDVI) of your 30 m squares in two satellite images. The outlined squares are the weak spot. Grey hatched squares are not farmland and are not counted.',
              'دي قيم الخضرة الحقيقية (NDVI) لمربعات أرضك (30 متر) في صورتين من القمر الصناعي. المربعات اللي عليها إطار هي الحتة الضعيفة. المربعات الرمادي المشطّبة مش أرض زراعية ومش محسوبة.')}
          </p>
          {!P ? <span className="sub">{tr('Loading…', 'بنحمّل…')}</span> : !P.available ? (
            <section className="card"><span className="body">{tr('No clear image yet.', 'لسه مفيش صورة واضحة.')}</span></section>
          ) : (
            <div className="grid proof-pair">
              {[['Before', 'قبل', P.before], ['Now', 'دلوقتي', P.after]].map(([en, ar, img]: any) => img ? (
                <section key={en} className="card" style={{ alignItems: 'center' }}>
                  <span className="col" style={{ alignItems: 'center', gap: '2px' }}>
                    <h2 className="h2">{tr(en, ar)}</h2>
                    <span className="sub">{img.date} · <span>{img.source}</span></span>
                  </span>
                  <Grid img={img} rows={P.rows} cols={P.cols} spot={P.squares} tr={tr} />
                </section>
              ) : null)}
            </div>
          )}
          <Foot />
        </main>
      </div>
    </div>
  );
}
