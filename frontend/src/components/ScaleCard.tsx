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
      {S.canal && S.canal.peak_now ? (() => {
        const C = S.canal;
        const mx = Math.max(...C.month_now, ...C.month_best, 1);
        const M = ar ? ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'] : ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
        return (
          <div className="col" style={{ gap: '6px' }}>
            <b style={{ fontSize: '14px' }}>{tr('Canal water, month by month (all these fields)', 'مية الترعة شهر بشهر (كل الأراضي دي)')}</b>
            <div className="row" style={{ gap: '4px', alignItems: 'flex-end', height: '90px' }} role="img"
              aria-label={tr(`Peak month ${C.peak_month}: ${n0(C.peak_now)} m³ now, ${n0(C.peak_best)} m³ with the best rotations`, `أزحم شهر ${C.peak_month}: ${n0(C.peak_now)} م³ دلوقتي، ${n0(C.peak_best)} م³ مع الدورات الأنسب`)}>
              {C.month_now.map((v: number, i: number) => (
                <span key={i} className="col" style={{ flex: 1, alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'flex-end' }}>
                  <span className="row" style={{ gap: '1px', alignItems: 'flex-end', height: '76px', width: '100%' }}>
                    <span style={{ flex: 1, height: `${(v / mx) * 100}%`, background: 'rgba(255,255,255,.35)', borderRadius: '2px' }} />
                    <span style={{ flex: 1, height: `${(C.month_best[i] / mx) * 100}%`, background: '#6FA8DC', borderRadius: '2px' }} />
                  </span>
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>{M[i]}</span>
                </span>
              ))}
            </div>
            <span style={{ fontSize: '12px', opacity: 0.85 }}>
              <i style={{ display: 'inline-block', width: '10px', height: '10px', background: 'rgba(255,255,255,.35)', borderRadius: '2px' }} /> {tr('now', 'دلوقتي')}{'  '}
              <i style={{ display: 'inline-block', width: '10px', height: '10px', background: '#6FA8DC', borderRadius: '2px' }} /> {tr('best rotations', 'الدورات الأنسب')}
              {' · '}{tr(`Busiest month: ${n0(C.peak_now)} → ${n0(C.peak_best)} m³ (${C.peak_cut_pct > 0 ? '−' : '+'}${Math.abs(C.peak_cut_pct)}%). `, `أزحم شهر: ${n0(C.peak_now)} ← ${n0(C.peak_best)} م³ (${C.peak_cut_pct > 0 ? '−' : '+'}${Math.abs(C.peak_cut_pct)}%). `)}
              {P(C.note)}{' '}
              {C.peak_cut_pct < 2 ? tr('Here the summer crop stays maize, so the busiest month barely moves: the saving comes in spring and early summer.', 'هنا المحصول الصيفي فاضل ذرة، فأزحم شهر مش بيتغير تقريباً: التوفير بييجي في الربيع وأول الصيف.') : null}
            </span>
          </div>
        );
      })() : null}
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
