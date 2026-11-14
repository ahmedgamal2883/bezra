'use client';
// Season report for a PAST season (GET /fields/{id}/seasons): what happened, from sowing to harvest, each line
// with its label (Farmer = what the farmer did or said; Satellite / Weather / Estimated = real data and the engine).
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const PILL: Record<string, string> = { Farmer: 'pill pv-farm', Satellite: 'pill pv-sat', Estimated: 'pill pv-est', Weather: 'pill pv-meas' };
const LBL: Record<string, [string, string]> = { Farmer: ['Farmer', 'الفلاح'], Satellite: ['Satellite', 'قمر صناعي'], Estimated: ['Estimated', 'تقدير'], Weather: ['Weather', 'طقس'] };

export default function PastSeason({ s }: { s: any }) {
  const tr = useT();
  const row = (k: string, v: any, label: string) => (
    <div className="inset"><span>{k}</span><span className="row" style={{ gap: '6px' }}><b>{v ?? '–'}</b><span className={PILL[label]}>{tr(...LBL[label])}</span></span></div>
  );
  return (
    <div className="grid r-stack" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)', alignItems: 'start' }}>
      <section className="card">
        <h2 className="h2">{tr(`Season ${s.season}`, `موسم ${s.season}`)}</h2>
        <div className="col" style={{ gap: '4px' }}>
          {row(tr('Sown', 'الزراعة'), s.sow, 'Farmer')}
          {row(tr('Harvested', 'الحصاد'), s.harvest, 'Farmer')}
          {row(tr('Season length', 'طول الموسم'), tr(`${s.days} days`, `${s.days} يوم`), 'Estimated')}
          {row(tr('Harvest you reported', 'المحصول اللي قلته'), tr(`${s.harvest_reported_ardeb} ardeb / feddan`, `${s.harvest_reported_ardeb} أردب للفدان`), 'Farmer')}
          {row(tr("Bezra's estimate", 'تقدير بذرة'), s.harvest_estimated_ardeb ? tr(`${s.harvest_estimated_ardeb} ardeb / feddan`, `${s.harvest_estimated_ardeb} أردب للفدان`) : null, 'Estimated')}
          {row(tr('Water turns given', 'أدوار الري'), s.turns_watered, 'Farmer')}
          {row(tr('Water used', 'المية'), `${s.water_m3_per_feddan.toLocaleString('en-US')} m³ / feddan`, 'Estimated')}
          {row(tr('Hot days at grain fill', 'أيام حر وقت امتلاء الحبوب'), s.hot_days_grain_fill, 'Weather')}
          {row(tr('Clear satellite passes', 'صور قمر صناعي واضحة'), s.passes, 'Satellite')}
        </div>
        {s.heat_prep_gain_pct > 0 ? (
          <div className="inset" style={{ background: 'var(--green-tint)' }}>
            <span style={{ color: 'var(--green)' }}>{tr("Bezra's heat warning: the light watering protected", 'تنبيه الحر من بذرة: الرية الخفيفة حافظت على')}</span>
            <b style={{ color: 'var(--green)' }}>+{s.heat_prep_gain_pct}%</b>
          </div>
        ) : null}
        {s.missed_turn_cost_pct > 0 ? (
          <div className="inset"><span>{tr('The missed January turn cost', 'دور يناير الفايت خسّر')}</span><b>−{s.missed_turn_cost_pct}%</b></div>
        ) : null}
        <span className="sub" style={{ fontSize: '12px' }}>{tr('Usual harvest: ', 'المحصول المعتاد: ')}<span>{s.usual_source}</span></span>
      </section>
      <section className="card">
        <h2 className="h2">{tr('What happened, day by day', 'اللي حصل يوم بيوم')}</h2>
        <div className="col" style={{ gap: '6px' }}>
          {s.events.map((e: any, i: number) => (
            <div key={i} className="inset" style={{ alignItems: 'flex-start' }}>
              <span className="col" style={{ gap: '2px', color: 'var(--ink)' }}>
                <b style={{ fontSize: '14px' }}>{e.title}</b>
                {e.detail ? <span className="sub" style={{ fontSize: '12.5px' }}>{e.detail}</span> : null}
              </span>
              <span className="col" style={{ gap: '4px', alignItems: 'flex-end' }}>
                <span className="sub" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{e.date}</span>
                <span className={PILL[e.label]}>{tr(...(LBL[e.label] || [e.label, e.label]))}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
