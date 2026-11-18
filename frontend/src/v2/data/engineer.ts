'use client';
// Engineer workspace (V18): GET /engineer/fields (the Bezra risk score of every field the engineer follows, on NASA
// POWER, Open-Meteo and satellite greenness). Filters, the visit list and the CSV work on that list in the browser.
import { useApi } from '@/lib/api';
import { useUser } from '@/lib/field';
import { shortDate } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useEngineer() {
  const { user } = useUser();
  const ws = useApi<any>('/engineer/fields').data;
  const rv = useApi<any[]>('/engineer/reviews').data;
  const rows = (ws?.fields || []).filter((r: any) => !r.error);
  const today = new Date().toISOString().slice(0, 10);
  const lvl = (r: any) => (r.status === 'Visit first' ? ['High', 'high'] : r.status === 'This week' ? ['Medium', 'med'] : ['Low', 'low']);
  const list = rows.map((r: any) => {
    const [l, c] = lvl(r);
    return { id: r.field_id, farmer: r.farmer, line: `${r.field} · ${r.place}`, lvl: l, cls: c, why: r.reason, driver: r.driver || '', score: r.score,
      note: r.tracker?.text || '', cases: (r.cases || []).length, plan: r.plan?.status, href: `/field/${r.field_id}/today`, visit: r.status === 'Visit first',
      csv: [r.farmer, r.field, r.village || '', r.governorate || '', r.area_feddan, r.status, r.score, r.reason] };
  }).sort((a: any, b: any) => b.score - a.score);
  const farmers = new Set(rows.map((r: any) => r.farmer)).size;
  const k = ws?.kpi;
  return {
    ready: !!ws,
    head: `Engineer workspace · ${user?.name || ''} · ${shortDate(today)}`,
    title: !ws ? '' : (k.high ? `${k.high} ${k.high === 1 ? 'farmer needs' : 'farmers need'} you today.` : 'No farmer needs a visit today.'),
    kpis: k ? [
      { l: 'Farmers', v: String(farmers), s: (k.places || []).join(', ') || '—' },
      { l: 'Need a visit', v: String(k.high), s: 'Ranked by risk and harvest at stake' },
      { l: 'Plans waiting for you', v: String(k.plans_pending), s: 'Season plans to approve' },
      { l: 'Photos from farmers', v: String(k.cases_total), s: `${k.cases_new} new` },
    ] : [],
    list,
    // questions farmers sent with "Check this with my engineer" (newest first; open ones on top)
    reviews: (rv || []).slice().sort((a: any, b: any) => (a.status === 'open' ? 0 : 1) - (b.status === 'open' ? 0 : 1)).slice(0, 8)
      .map((r: any) => ({ id: r.id, who: `${r.from} · ${r.field_name}`, note: r.note || 'Please check my field', open: r.status === 'open',
        when: shortDate(r.created.slice(0, 10)), href: `/field/${r.field_id}/data#ask`, topic: r.topic })),
    reviewsOpen: (rv || []).filter((r: any) => r.status === 'open').length,
    exportCsv: (shown: any[]) => {
      const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const lines = ['farmer,field,village,governorate,area_feddan,status,score,why', ...shown.map((r: any) => r.csv.map(q).join(','))];
      const url = URL.createObjectURL(new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = `bezra-fields-${today}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    },
  };
}
