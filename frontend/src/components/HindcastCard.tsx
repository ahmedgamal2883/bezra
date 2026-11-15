'use client';
// About page: "Would Bezra have warned you?" computed by the backend (GET /hindcast) on the Menoufia demo field:
// heat waves during wheat grain fill in NASA POWER history, and whether the forecast issued 1..7 days before
// already showed >= 32 C (Open-Meteo Previous Runs archive). If the result is not available, the design's
// numbers are shown with the Demo label: a number is never shown unlabelled unless it was computed.
import { useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function HindcastCard() {
  const tr = useT();
  const { data: H, error } = useApi<any>('/hindcast');
  const real = !!H && H.waves > 0;
  return (
    <section className="card rise tint-s" style={{ '--d': '4' } as React.CSSProperties}>
      <h2 className="h2">{tr('Would Bezra have warned you?', 'كانت بذرة هتنبّهك؟')}</h2>
      <p className="sub">{tr('Heat waves at wheat grain fill, using only forecasts issued before each one.', 'موجات الحر وقت امتلاء حبوب القمح، باستخدام التوقعات اللي اتعملت قبل كل موجة بس.')}</p>
      <span className="row" style={{ alignItems: 'baseline', gap: '8px' }}>
        <b style={{ fontSize: '40px', fontWeight: 600, letterSpacing: '-1.4px' }}>
          {real ? tr(`${H.warned} of ${H.waves}`, `${H.warned} من ${H.waves}`) : (!H && !error ? '…' : tr('4 of 5', '4 من 5'))}
        </b>
        <span className="tl">
          {real ? (H.lead_range ? tr(`warned ${H.lead_range[0]} to ${H.lead_range[1]} days early`, `نبّهت قبلها بـ ${H.lead_range[0]} لـ ${H.lead_range[1]} أيام`) : tr('no early warning', 'من غير تنبيه بدري'))
            : (!H && !error ? '' : tr('warned 4 to 7 days early', 'نبّهت قبلها بـ 4 لـ 7 أيام'))}
        </span>
      </span>
      {real && H.day_scores?.['3'] ? (() => {
        const s = H.day_scores['3'];
        return (
          <span className="sub">
            {tr(`Day by day, warning 3 days ahead: ${s.hits} hot days caught, ${s.misses} missed, ${s.false_alarms} false alarms in ${s.days} grain-fill days (${Math.round((s.precision || 0) * 100)}% of warnings came true).`,
              `يوم بيوم، التنبيه قبلها بـ 3 أيام: ${s.hits} يوم حر اتمسك، ${s.misses} فاتوا، ${s.false_alarms} تنبيه غلط في ${s.days} يوم امتلاء حبوب (${Math.round((s.precision || 0) * 100)}% من التنبيهات طلعت صح).`)}
          </span>
        );
      })() : null}
      {real ? (
        <>
          <span className="pill pv-sat" style={{ alignSelf: 'flex-start' }}>{tr('Computed from real data', 'محسوبة من بيانات حقيقية')}</span>
          <details className="sub">
            <summary style={{ cursor: 'pointer' }}>{tr('Seasons and dates used', 'المواسم والتواريخ')}</summary>
            <span className="col" style={{ gap: '4px', marginTop: '6px' }}>
              <span>{tr(`Menoufia demo field, wheat sown ${H.sow_month_day} each year. ${H.rule}.`, `أرض الديمو في المنوفية، قمح متزرع يوم ${H.sow_month_day} كل سنة. التنبيه = توقع حرارة 32 °م أو أكتر وقت امتلاء الحبوب.`)}</span>
              {H.seasons.map((s: any) => (
                <span key={s.harvest_year}>
                  <b>{s.harvest_year}</b>{' · '}{s.grain_fill ? tr(`grain fill ${s.grain_fill[0]} to ${s.grain_fill[1]}`, `امتلاء الحبوب ${s.grain_fill[0]} لـ ${s.grain_fill[1]}`) : s.skipped}
                  {(s.heat_waves || []).map((x: any) => (
                    <span key={x.start} style={{ display: 'block', paddingInlineStart: '12px' }}>
                      {x.start} · {x.days} {tr('day(s)', 'يوم')} · {x.peak_c} °C · {!x.judged ? tr('no forecast archived (not counted)', 'مفيش توقع محفوظ (مش محسوبة)')
                        : x.warned_days_early ? tr(`warned ${x.warned_days_early} days early`, `اتنبّه قبلها بـ ${x.warned_days_early} أيام`) : tr('missed', 'ما اتنبّهش')}
                    </span>
                  ))}
                  {s.heat_waves && !s.heat_waves.length ? <span style={{ display: 'block', paddingInlineStart: '12px' }}>{tr('no heat wave', 'مفيش موجة حر')}</span> : null}
                </span>
              ))}
              <span>{H.source}</span>
            </span>
          </details>
        </>
      ) : (!H && !error ? null : <span className="pill pv-demo" style={{ alignSelf: 'flex-start' }}>{tr('Demo', 'تجريبي')}</span>)}
    </section>
  );
}
