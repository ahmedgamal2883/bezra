'use client';
// The season checklist under Today (Nov 2026, asked by the designer): every task of the season, not only today's,
// grouped by when it is due. Ticking asks WHEN it was done (today, yesterday or a date); that day goes into the
// journal and the water balance (POST /fields/{id}/tasks/{task} with done_on). Undo removes it again.
import { useMemo, useState } from 'react';
import { API, useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { dayMonth, shortDate } from '@/v2/data/today';
import ImpactLine, { impactOf } from '@/v2/ImpactLine';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CAT: Record<string, [string, string]> = {
  irrigation: ['Water', '#2F6FA8'], fertilizer: ['Fertilizer', '#3E7F35'], spray: ['Pests and weeds', '#7A4FA8'],
  inspection: ['Check', '#C2742A'], milestone: ['Stage', '#A08A1E'],
};
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (s: string, n: number) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return iso(d); };

export default function SeasonChecklist() {
  const { id } = useField();
  const [ver, setVer] = useState(0);
  const tk = useApi<any>(id ? `/fields/${id}/tasks${ver ? `?v=${ver}` : ''}` : null).data;
  const [open, setOpen] = useState<string | null>(null);
  const [pick, setPick] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const today = tk?.today as string | undefined;

  const groups = useMemo(() => {
    if (!tk || !today) return [];
    const T = (tk.tasks || []).filter((t: any) => t.category !== 'milestone' || /harvest|sow/i.test(t.id));
    const done = (t: any) => t.answer?.answer === 'done' || t.status === 'done';
    const end = (t: any) => t.window?.[1] || t.date;
    const wk = addDays(today, 6), nx = addDays(today, 13);
    const g: [string, any[]][] = [
      ['Late: not done yet', T.filter((t: any) => !done(t) && t.answer?.answer !== 'not_done' && end(t) < today)],
      ['This week', T.filter((t: any) => !done(t) && end(t) >= today && t.date <= wk)],
      ['Next week', T.filter((t: any) => !done(t) && t.date > wk && t.date <= nx)],
      ['Later this season', T.filter((t: any) => !done(t) && t.date > nx)],
      ['Done', T.filter(done).slice(-10).reverse()],
    ];
    return g.filter(([, xs]) => xs.length);
  }, [tk, today]);

  if (!tk || !today) return null;
  const send = async (t: any, body: any) => {
    setBusy(true); setErr('');
    try {
      const r = await fetch(`${API}/fields/${id}/tasks/${encodeURIComponent(t.id)}${body ? '' : '/undo'}`, { method: 'POST',
        headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
      if (!r.ok) { const j = await r.json().catch(() => ({})); setErr(typeof j.detail === 'string' ? j.detail : 'Could not save. Try again.'); return; }
      setOpen(null); setPick(''); setVer((v) => v + 1);
    } catch { setErr('No connection. Try again.'); } finally { setBusy(false); }
  };
  const doneOn = (t: any, d: string) => send(t, { answer: 'done', done_on: d });

  return (
    <section className="col" aria-labelledby="sc-h" style={{ gap: '14px' }}>
      <div className="row sp" style={{ alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        <h2 id="sc-h" className="sec">THE WHOLE SEASON, STEP BY STEP</h2>
        <span className="meta">Tick what you did and say when. Bezra fixes its plan from that day.</span>
      </div>
      {groups.map(([h, xs]) => (
        <div key={h} className="col" style={{ gap: '0' }}>
          <span className="meta" style={{ fontWeight: 600, padding: '6px 0' }}>{h}</span>
          {xs.map((t: any) => {
            const [cl, col] = CAT[t.category] || ['Task', '#6B6F69'];
            const isDone = t.answer?.answer === 'done' || t.status === 'done';
            const when = isDone ? (t.answer?.done_on || t.answer?.log_date || t.done_date) : null;
            const amount = /^About /.test(t.amount || '') ? String(t.amount).split('. ')[0] + '.' : (t.amount && !/engineer/i.test(t.amount) ? t.amount : '');
            return (
              <div key={t.id} className="col" style={{ borderTop: '1px solid var(--line)', padding: '12px 0', gap: '8px' }}>
                <div className="row" style={{ gap: '12px', alignItems: 'flex-start' }}>
                  <button type="button" className={'tbox press' + (isDone ? ' on' : '')} aria-pressed={isDone} aria-label={isDone ? `Undo: ${t.title}` : `Done: ${t.title}`}
                    onClick={() => (isDone ? send(t, null) : setOpen(open === t.id ? null : t.id))}
                    style={{ width: '28px', height: '28px', borderRadius: '9px', flex: '0 0 auto', marginTop: '2px' }}>
                    {isDone ? <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg> : null}
                  </button>
                  <span className="col" style={{ gap: '3px', flex: 1, minWidth: 0 }}>
                    <b style={{ fontWeight: 600, fontSize: '16px', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--muted)' : 'inherit' }}>{t.title}</b>
                    <span className="meta">{[t.window ? `${dayMonth(t.window[0])} – ${dayMonth(t.window[1])}` : shortDate(t.date), amount].filter(Boolean).join(' · ')}</span>
                    {!isDone && impactOf(t) ? <ImpactLine {...(impactOf(t) as any)} /> : null}
                    {isDone && when ? <span className="meta" style={{ color: 'var(--green)' }}>{`Done ${shortDate(when)}`}</span> : null}
                  </span>
                  <span className="pq" style={{ color: col, flex: '0 0 auto' }}>{cl}</span>
                </div>
                {open === t.id && !isDone ? (
                  <div className="row" style={{ gap: '8px', flexWrap: 'wrap', paddingInlineStart: '40px' }}>
                    <span className="meta" style={{ width: '100%' }}>When did you do it?</span>
                    <button type="button" className="btn sm press" disabled={busy} onClick={() => doneOn(t, today)}>Today</button>
                    <button type="button" className="btn soft sm press" disabled={busy} onClick={() => doneOn(t, addDays(today, -1))}>Yesterday</button>
                    <input type="date" className="inp" value={pick} max={today} min={addDays(today, -120)} onChange={(e) => setPick(e.target.value)}
                      aria-label="The day you did it" style={{ height: '40px', fontSize: '15px', width: '170px' }} />
                    <button type="button" className="btn soft sm press" disabled={busy || !pick} onClick={() => doneOn(t, pick)}>Save this day</button>
                    {t.date <= today ? <button type="button" className="tskip" disabled={busy} onClick={() => send(t, { answer: 'not_done' })}>I did not do it</button> : null}
                    {err ? <span className="meta" role="alert" style={{ width: '100%', color: '#B4412A' }}>{err}</span> : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
}
