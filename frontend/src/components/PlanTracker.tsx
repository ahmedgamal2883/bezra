'use client';
// U4 plan tracker: the V11 Season plan timeline (same dots, cards and pills), filled from GET /fields/{id}/plan.
// Each task shows planned date vs done date and a status: Done / On time / Late / Skipped.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PV } from '@/lib/api';

/** Progress card numbers: done (incl. done late), now (due within 7 days or missed), coming. */
export function progressOf(plan: any) {
  const ts = plan?.tasks || [];
  if (!ts.length) return { done: 0, now: 0, coming: 0, total: 0, share: 0 };
  const soon = new Date(new Date(plan.today).getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const done = ts.filter((t: any) => t.done_date || t.status === 'Done').length;
  const now = ts.filter((t: any) => !(t.done_date || t.status === 'Done') && t.planned_date <= soon).length;
  return { done, now, coming: ts.length - done - now, total: ts.length, share: Math.round((done / ts.length) * 1000) / 1000 };
}

const dm = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
const short = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

export default function PlanTracker({ plan, details }: { plan: any; details: boolean }) {
  if (!plan) return <ol style={{ margin: 0, padding: 0 }}><li className="card" style={{ listStyle: 'none' }}><span className="tl">{'Building your plan…'}</span></li></ol>;
  const today = plan.today;
  const soon = new Date(new Date(today).getTime() + 7 * 86400000).toISOString().slice(0, 10);
  return (
    <ol style={{ position: 'relative', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <span aria-hidden="true" className="grow" style={{ position: 'absolute', left: '12px', top: '20px', bottom: '40px', width: '2px', background: '#DADBD5', transformOrigin: '50% 0', '--i': '0' } as any} />
      {plan.tasks.map((t: any, i: number) => {
        const done = t.status === 'Done' || (t.status === 'Late' && t.done_date);
        const missed = t.status === 'Skipped' || (t.status === 'Late' && !t.done_date);
        const now = !done && !missed && t.planned_date <= soon;
        const when = t.window ? `${short(t.window[0])} to ${short(t.window[1])}` : dm(t.planned_date);
        const doneLine = t.done_date ? (t.done_date === t.planned_date ? `Done ${short(t.done_date)}` : `Planned ${short(t.planned_date)}, done ${short(t.done_date)}`) :
          missed ? `Planned ${short(t.planned_date)}, not logged` : when;
        const pill = PV[t.provenance] || PV.estimated;
        const ben = t.benefit?.range ? `${Math.round(t.benefit.range[0])} to ${Math.round(t.benefit.range[1])}%` : null;
        return (
          <li key={t.id} className="rise" style={{ '--d': String(Math.min(3 + i, 14)), display: 'grid', gridTemplateColumns: '26px minmax(0, 1fr)', gap: '16px', listStyle: 'none' } as any}>
            <span style={{ position: 'relative', zIndex: 1, paddingTop: '18px' }}>
              {done ? (
                <span style={{ width: '26px', height: '26px', borderRadius: '13px', background: t.status === 'Late' ? 'var(--sun)' : 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                </span>
              ) : now || missed ? (
                <span style={{ position: 'relative', display: 'block', width: '26px', height: '26px', borderRadius: '13px', background: missed ? '#E5572F' : 'var(--sun)', boxShadow: missed ? '0 0 0 5px rgba(229,87,47,.18)' : '0 0 0 5px rgba(242,155,30,.22)' }} />
              ) : (
                <span style={{ display: 'block', width: '26px', height: '26px', boxSizing: 'border-box', borderRadius: '13px', background: '#fff', border: '2px solid #CFCFC9' }} />
              )}
            </span>
            <article className="card lift" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px', opacity: done && t.status === 'Done' ? 0.72 : 1,
              boxShadow: now ? '0 0 0 1.5px var(--sun), 0 10px 24px -16px rgba(242,155,30,.6)' : undefined }}>
              <div className="col" style={{ flex: '2 1 260px', gap: '4px' }}>
                <span className="row wrap" style={{ gap: '8px' }}>
                  {t.status === 'Done' ? <span className="lv lv-low"><i />{'Done'}</span>
                    : t.status === 'Late' ? <span className="lv lv-med"><i />{'Late'}</span>
                    : t.status === 'Skipped' ? <span className="lv lv-high"><i />{'Skipped'}</span>
                    : now ? <span className="lv lv-low"><i />{'On time'}</span>
                    : <span className="pill">{'Coming'}</span>}
                  <span className="tl">{done || missed ? doneLine : when}</span>
                  {t.note ? <span className="pill">{t.note}</span> : null}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-.3px' }}>{t.title}</h3>
                <p className="sub">{t.why}{t.amount?.label ? ` ${t.type === 'fertilizer' ? 'Amount:' : 'To apply'} ${t.amount.label}.` : ''}</p>
              </div>
              {t.benefit ? (
                <div className="col" style={{ flex: '1 1 140px', gap: '2px' }}>
                  <span className="tl">{ben ? 'Protects' : 'What it gets you'}</span>
                  {ben ? <b style={{ fontSize: '20px', fontWeight: 600 }}>{ben}<small className="unit">{' of harvest'}</small></b>
                    : <span style={{ fontSize: '14px', fontWeight: 600 }}>{t.benefit.text}</span>}
                </div>
              ) : null}
              <div className="col" style={{ flex: '1 1 170px', gap: '6px' }}>
                <span className={pill.cls} style={{ alignSelf: 'flex-start' }}>{pill.label}</span>
                {details && t.source ? <span className="tl">{'Source: ' + t.source}</span> : null}
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
