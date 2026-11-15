'use client';
// Field Shift N1: "If the village switches". Farmer: this field's best rotation x 100 feddan (a projection, said so).
// Engineer: the real fields of their farmers, each on its own best rotation, added up. Every number is Estimated.
import { useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Pair = [string, string];
const n0 = (x: number) => Math.round(x).toLocaleString('en-US');

export default function ScaleCard({ path }: { path: string }) {
  const tr = useT();
  const ar = tr('en', 'ar') === 'ar';
  const P = (p: Pair) => (ar ? p[1] : p[0]);
  const { data: S, loading } = useApi<any>(path);
  if (!S && loading) {
    return <section className="card"><span className="sub">{tr('Adding up the fields…', 'بنجمع الأراضي…')}</span></section>;
  }
  if (!S) return null;
  const water = S.water_saved_m3_year || 0;
  return (
    <section className="card rise dk" style={{ gap: '12px', color: '#fff' }} aria-label={P(S.label)}>
      <div className="row sp wrap" style={{ gap: '6px' }}>
        <b style={{ fontSize: '15px' }}>{P(S.label)}</b>
        <span className="pill pv-est">{tr('Estimated', 'تقدير')}</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))', gap: '10px' }}>
        <div className="col" style={{ gap: '2px' }}>
          <b style={{ fontSize: '28px', letterSpacing: '-1px' }}>{water > 0 ? n0(water) : '0'} m³</b>
          <span style={{ opacity: 0.8, fontSize: '13px' }}>{tr('Nile water saved a year', 'مية نيل بتتوفر في السنة')}{water > 0 ? ` · ${S.olympic_pools_year} ${tr('Olympic pools', 'حمام سباحة أوليمبي')}` : ''}</span>
        </div>
        <div className="col" style={{ gap: '2px' }}>
          <b style={{ fontSize: '28px', letterSpacing: '-1px' }}>{S.co2_t > 0 ? '+' : ''}{S.co2_t} t CO₂</b>
          <span style={{ opacity: 0.8, fontSize: '13px' }}>{tr('kept in the soil by year 10', 'محبوس في التربة في السنة العاشرة')} ({S.carbon_t_c} t C)</span>
        </div>
        <div className="col" style={{ gap: '2px' }}>
          <b style={{ fontSize: '28px', letterSpacing: '-1px' }}>{(S.soil_gain_pct_area_weighted ?? S.soil_gain_pct) > 0 ? '+' : ''}{S.soil_gain_pct_area_weighted ?? S.soil_gain_pct}%</b>
          <span style={{ opacity: 0.8, fontSize: '13px' }}>{tr('soil health by year 10', 'صحة التربة في السنة العاشرة')}</span>
        </div>
      </div>
      {S.rows ? (
        <details>
          <summary style={{ cursor: 'pointer', opacity: 0.85, fontSize: '13px' }}>{tr(`${S.fields} fields, ${S.area_feddan} feddan: field by field`, `${S.fields} أرض، ${S.area_feddan} فدان: أرض أرض`)}</summary>
          <span className="col" style={{ gap: '4px', marginTop: '6px', fontSize: '13px', opacity: 0.9 }}>
            {S.rows.map((r: any) => (
              <span key={r.field}>
                <b>{r.farmer || r.name}</b> ({r.area_feddan} {tr('fed', 'فدان')}): {r.keep ? tr('keep what they grow', 'يكمّل اللي بيزرعه') : P(r.best)}
                {' · '}{r.water_saved_m3_year > 0 ? `${n0(r.water_saved_m3_year)} m³` : tr('no water change', 'المية زي ما هي')}
                {' · '}{tr('soil', 'التربة')} {r.soil_gain_pct > 0 ? '+' : ''}{r.soil_gain_pct}%
              </span>
            ))}
          </span>
        </details>
      ) : null}
      <span style={{ opacity: 0.75, fontSize: '12px' }}>
        {S.note ? P(S.note) + ' ' : ''}
        {tr('Most water is saved where rice or cotton is grown now; where wheat and maize are grown, the gain is soil health.',
          'أغلب المية بتتوفر في الأراضي اللي فيها رز أو قطن دلوقتي؛ وفي أراضي القمح والذرة، المكسب صحة التربة.')}
      </span>
    </section>
  );
}
