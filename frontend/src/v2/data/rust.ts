'use client';
// Crop > Rust (V18): the rust weather behind the alert. GET /fields/{id}/rust (night by night, same rule as the alert)
// + /alerts (level, steps) + /summary (crop stage) + the field profile (variety).
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { shortDate } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useRustData() {
  const { id } = useField();
  const ru = useApi<any>(id ? `/fields/${id}/rust` : null).data;
  const al = useApi<any>(id ? `/fields/${id}/alerts` : null).data;
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  const a = al?.alerts?.find((x: any) => x.kind === 'rust');
  const lvl = a?.level_label || '';
  const n7 = ru ? ru.rust_days_last7 : null;
  const out: any = {
    lvl, lvlD: ru && lvl ? `${lvl} · ${n7} of 7 days` : '',
    title: !a ? '' : a.level === 'low' ? 'Little rust weather this week.' : 'Rust could start this week.',
    why: a ? a.why + (a.level === 'low' ? ' Nothing to spray. Just keep an eye on the leaves.' : ' Nothing is wrong yet, so there is nothing to spray. Just look.') : '',
    step1: a ? (a.level === 'low' ? 'From January, walk the field once a week' : 'This week, walk the field') : '',
    n7: n7 == null ? '' : String(n7), src: ru?.source || '',
    stage: sm ? `${sm.stage}, day ${sm.day_n}` : '',
    variety: sm ? `${sm.field.variety}${ru?.variety_trait ? ', ' + ru.variety_trait + ' to rust' : ''}` : '',
  };
  if (ru) {
    const all = [...ru.past, ...ru.ahead];
    const slot = 930 / all.length;
    out.days = all.map((d: any, i: number) => {
      const h = Math.max(4, d.rh * 1.84);
      return { x: 40 + i * slot + (slot - 40) / 2, cx: 40 + i * slot + slot / 2, y: 200 - h, h, rh: d.rh + '%', lab: shortDate(d.date).slice(4).replace(/ \w+$/, ''),
        fill: d.rust_day ? '#D9762B' : d.forecast ? '#D8DEE4' : '#B7C9D8' };
    });
    out.fcX = 40 + ru.past.length * slot;
    out.y85 = 200 - 85 * 1.84;
    out.daysLabel = `Daily humidity, last ${ru.past.length} days and ${ru.ahead.length} forecast days. ${n7} rust weather days this week.`;
    out.past7 = ru.past.map((d: any) => ({ rh: d.rh + '%', h7: Math.max(4, d.rh * 0.794), wet: d.rust_day, dd: shortDate(d.date).split(' ')[1] }));
    const wet = ru.past.filter((d: any) => d.rh >= 85).length;
    out.humNote = `Dashed line: 85%. ${wet} ${wet === 1 ? 'day' : 'days'} above it.`;
    const lo = Math.round(Math.min(...ru.past.map((d: any) => d.tmin))), hi = Math.round(Math.max(...ru.past.map((d: any) => d.tmin)));
    out.nightT = `${lo}–${hi} °C`;
    const withRust = ru.winters.filter((w: any) => w.rust_days > 0);
    out.pastN = `${withRust.length} of the last ${ru.winters.length} winters had rust weather`;
    out.pastSub = withRust.length ? `Most rust weather here comes in December and January.` : 'Daily weather here rarely reached rust conditions in winter.';
    out.years = (withRust.length ? withRust : ru.winters.slice(-3)).map((w: any) => ({ winter: w.winter, txt: `${w.rust_days} ${w.rust_days === 1 ? 'day' : 'days'} of rust weather, Dec–Feb` }));
    out.yearsNote = 'From daily weather (NASA POWER). Foggy mornings inside a mild day can be missed: trust what you see on the leaves.';
  }
  return out;
}
