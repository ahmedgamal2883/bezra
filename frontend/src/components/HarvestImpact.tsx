'use client';
// My field: "Your harvest, with and without Bezra". Usual harvest (yours, else the area's), this season as it is
// (with Bezra), the same season without the waterings Bezra prompted and the problems fixed after its alerts,
// and what the season has cost so far and why. Every number is an estimate and says so. GET /fields/{id}/impact.
import { useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const WHY: Record<string, [string, string]> = {
  water: ['Thirst (soil water ran low)', 'العطش (مية التربة قلّت)'], heat: ['Hot days while the grain fills', 'أيام حر وقت امتلاء الحبوب'],
  rust: ['Rust weather', 'جو الصدا'],
};

export default function HarvestImpact({ id }: { id: string }) {
  const tr = useT();
  const I = useApi<any>(id ? `/fields/${id}/impact` : null).data;
  if (!I) return null;
  const ard = I.usual.value != null;
  const val = (x: any) => (ard ? `${x.ardeb}` : `${x.pct}%`);
  const unit = ard ? tr('ardeb / feddan', 'أردب للفدان') : tr('of what the field can give', 'من اللي الأرض تقدر تديه');
  const max = ard ? Math.max(I.usual.value, I.with_bezra.ardeb || 0) : 100;
  const bar = (v: number, cls: string) => <span className={'hbar ' + cls}><i style={{ width: `${Math.max(4, Math.min(100, (v / max) * 100))}%` }} /></span>;
  const same = I.with_bezra.pct === I.without_bezra.pct && !I.without_bezra.trial_range_pct;
  return (
    <section className="card rise" style={{ '--d': '3' } as React.CSSProperties} aria-label={tr('Your harvest', 'محصولك')}>
      <div className="row sp" style={{ gap: '8px', alignItems: 'flex-start' }}>
        <div className="col" style={{ gap: '2px' }}>
          <h2 className="h2">{tr('Your harvest, with and without Bezra', 'محصولك، مع بذرة ومن غيرها')}</h2>
          <span className="sub">{tr('Expected this season', 'المتوقع الموسم ده')} · {unit}</span>
        </div>
        <span className="pill pv-est">{tr('Estimated', 'تقدير')}</span>
      </div>
      <div className="col" style={{ gap: '8px' }}>
        {ard ? (
          <div className="hrow"><span>{tr('Your usual', 'المعتاد بتاعك')}</span>{bar(I.usual.value, 'u')}<b>{I.usual.value}</b></div>
        ) : null}
        <div className="hrow"><span>{tr('With Bezra', 'مع بذرة')}</span>{bar(ard ? I.with_bezra.ardeb : I.with_bezra.pct, 'w')}<b>{val(I.with_bezra)}</b></div>
        <div className="hrow"><span>{tr('Without Bezra', 'من غير بذرة')}</span>{bar(ard ? I.without_bezra.ardeb : I.without_bezra.pct, 'n')}<b>{val(I.without_bezra)}</b></div>
      </div>
      {same ? (
        <p className="sub" style={{ margin: 0 }}>{tr('The same so far: you have not acted on a Bezra alert or task yet this season. When you do (a light watering before heat, a missed turn caught up, a problem fixed), the difference shows here.',
          'لحد دلوقتي زي بعض: لسه معملتش حاجة بسبب تنبيه أو مهمة من بذرة الموسم ده. لما تعمل (رية خفيفة قبل الحر، دور فايت اتعوّض، مشكلة اتحلت)، الفرق هيبان هنا.')}</p>
      ) : null}
      {I.actions?.length ? (
        <div className="col" style={{ gap: '6px' }}>
          <span className="sub">{tr('What Bezra helped with', 'بذرة ساعدت في إيه')}</span>
          {I.actions.map((a: any, i: number) => (
            <div key={i} className="inset"><span><span>{a.what}</span> · {a.date}</span>
              <b>{a.gain_range_pct ? `+${a.gain_range_pct[0]} – ${a.gain_range_pct[1]}%` : `+${a.gain_pct}%`}</b></div>
          ))}
        </div>
      ) : null}
      {I.lost_so_far?.length || I.missed?.length ? (
        <div className="col" style={{ gap: '6px' }}>
          <span className="sub">{tr('What the season has cost so far, and why', 'الموسم خسّر لحد دلوقتي قد إيه، وليه')}</span>
          {I.lost_so_far.map((l: any) => <div key={l.why} className="inset"><span>{tr(...(WHY[l.why] || [l.label, l.label]))}</span><b>−{l.pct}%</b></div>)}
          {I.missed.map((m: any) => <div key={m.date} className="inset"><span>{tr('Missed water turn', 'دور ري فايت')} · {m.date}</span><b>−{m.cost_pct}%</b></div>)}
        </div>
      ) : <span className="sub">{tr('Nothing lost so far this season.', 'مفيش خسارة لحد دلوقتي الموسم ده.')}</span>}
      <span className="sub" style={{ fontSize: '12px' }}><span>{I.usual.source}</span>{' · '}<span>{I.source}</span></span>
    </section>
  );
}
