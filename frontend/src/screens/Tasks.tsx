'use client';
// Phase 3: the field calendar + checklist ("what should I do today, and did I do it?").
// Built only from V11 parts (head, seg, card, inset rows, chip tints, pill / lv badges, btn).
// Month / week / day; RTL in Arabic; the week starts on Saturday (Egypt). Each task: a check box, its title,
// its type (icon + word, never colour alone) and a status badge. Amounts never appear: the engineer sets them.
// Data: GET /fields/{id}/tasks, answers POST /fields/{id}/tasks/{task}.
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FarmerHeader, Foot } from '@/components/chrome';
import TaskRow, { CAT, CatIcon, isDone, isLate, type Cat } from '@/components/TaskRow';
import { API, toSignIn } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const addDays = (s: string, n: number) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
const weekStart = (s: string) => { const d = new Date(s + 'T00:00:00'); return addDays(s, -((d.getDay() + 1) % 7)); };  // Saturday
const DAYS_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAYS_AR = ['سبت', 'حد', 'اتنين', 'تلات', 'أربع', 'خميس', 'جمعة'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

async function send(fid: string, tid: string, body: any) {
  const r = await fetch(`${API}/fields/${fid}/tasks/${encodeURIComponent(tid)}`, { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (r.status === 401) toSignIn();
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof j.detail === 'string' ? j.detail : 'Could not save');
  return j;
}

const Chevron = ({ back }: { back?: boolean }) => (
  <svg aria-hidden="true" className="flip" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d={back ? 'm14.5 6-6 6 6 6' : 'm9.5 6 6 6-6 6'} />
  </svg>
);

export default function TasksScreen() {
  const tr = useT();
  const p = useParams();
  const id = String(p?.id || '');
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState('');
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');

  const load = useCallback((n = 0) => {
    fetch(`${API}/fields/${id}/tasks`, { credentials: 'include' })
      .then(async (r) => { if (r.status === 401) toSignIn(); if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((j) => { setData(j); setErr(''); setDay((d) => d || j.today); setMonth((m) => m || j.today.slice(0, 7)); })
      .catch(() => (n < 3 ? setTimeout(() => load(n + 1), 3000 * (n + 1))  // slow 3G / server waking up: try again
        : setErr(tr('Could not load your tasks.', 'معرفناش نجيب مهامك.'))));
  }, [id, tr]);
  useEffect(() => { if (id) load(); }, [id, load]);

  const byDay = useMemo(() => {
    const m: Record<string, any[]> = {};
    for (const t of data?.tasks || []) {
      // a task with a window shows on every day of it (up to 10) until it is done; else on its own day
      const span = t.window && !isDone(t) && t.status !== 'later'
        ? Math.min(10, Math.round((+new Date(t.window[1]) - +new Date(t.window[0])) / 864e5)) : 0;
      for (let i = 0; i <= span; i++) (m[addDays(span ? t.window[0] : t.date, i)] ||= []).push(t);
    }
    return m;
  }, [data]);

  const answer = async (t: any, body: any) => { const j = await send(id, t.id, body); setData(j.tasks); };
  const today = data?.today || '';
  const mName = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${tr(MONTHS_EN[m - 1], MONTHS_AR[m - 1])} ${y}`; };
  const dName = (s: string) => { const d = new Date(s + 'T00:00:00'); const w = (d.getDay() + 1) % 7; return `${tr(DAYS_EN[w], DAYS_AR[w])} ${d.getDate()} ${tr(MONTHS_EN[d.getMonth()], MONTHS_AR[d.getMonth()])}`; };
  const upcoming = (data?.tasks || []).filter((t: any) => t.date > today && t.date <= addDays(today, 14) && !isDone(t) && !t.auto).slice(0, 6);
  const shownDay = day || today;

  return (
    <div className="root">
      <div className="shell">
        <FarmerHeader active="tasks" />
        <main className="main" style={{ maxWidth: '880px', margin: '0 auto', width: '100%' }}>
          <div className="head">
            <div className="col rise" style={{ '--d': '0', gap: '6px' } as React.CSSProperties}>
              <Link href={`/field/${id}`} className="eyebrow press">{tr('My field', 'أرضي')}</Link>
              <h1 className="h1">{tr('My tasks', 'مهامي')}</h1>
            </div>
            <div role="group" aria-label={tr('View', 'العرض')} className="seg rise" style={{ '--d': '1' } as React.CSSProperties}>
              {(['day', 'week', 'month'] as const).map((v) => (
                <button key={v} type="button" className={'segb press' + (view === v ? ' on' : '')} aria-pressed={view === v} onClick={() => setView(v)}>
                  {tr({ day: 'Day', week: 'Week', month: 'Month' }[v], { day: 'يوم', week: 'أسبوع', month: 'شهر' }[v])}
                </button>
              ))}
            </div>
          </div>

          {err ? <section className="card"><span className="body">{err}</span><button type="button" className="btn sm press" style={{ alignSelf: 'flex-start' }} onClick={() => load()}>{tr('Try again', 'جرّب تاني')}</button></section> : null}
          {!data && !err ? <span className="sub">{tr('Loading your tasks…', 'بنجيب مهامك…')}</span> : null}

          {data ? (
            <>
              {/* morning: yesterday's unanswered task; evening: today's open ones */}
              {(data.reminders || []).map((r: any) => {
                const t = data.tasks.find((x: any) => x.id === r.task_id);
                if (!t) return null;
                return (
                  <section key={r.task_id} className="card tint-s rise" style={{ '--d': '2' } as React.CSSProperties}>
                    <span className="sub" style={{ color: '#7A4A0B' }}>{r.kind === 'yesterday' ? tr('Yesterday you had', 'امبارح كان عليك') : tr('Today you have', 'النهارده عليك')}</span>
                    <b className="h3" style={{ fontSize: '19px' }}>{t.title}</b>
                    <div className="row" style={{ gap: '8px' }}>
                      <span className="body" style={{ flex: 1 }}>{tr('Did you do it?', 'عملته؟')}</span>
                      <button type="button" className="btn sm press" onClick={() => answer(t, { answer: 'done' })}>{tr('Yes', 'أيوه')}</button>
                      <button type="button" className="btn line sm press" onClick={() => answer(t, { answer: 'not_done' })}>{tr('No', 'لأ')}</button>
                    </div>
                  </section>
                );
              })}

              {view === 'day' ? (
                <section className="card rise" style={{ '--d': '2' } as React.CSSProperties}>
                  <div className="row sp">
                    <button type="button" className="ibtn press" aria-label={tr('Previous day', 'اليوم اللي فات')} onClick={() => setDay(addDays(shownDay, -1))}><Chevron back /></button>
                    <div className="col" style={{ alignItems: 'center', gap: '2px' }}>
                      <h2 className="h2">{shownDay === today ? tr('Today', 'النهارده') : dName(shownDay)}</h2>
                      {shownDay === today ? <span className="sub">{dName(shownDay)}</span> : null}
                    </div>
                    <button type="button" className="ibtn press" aria-label={tr('Next day', 'اليوم الجاي')} onClick={() => setDay(addDays(shownDay, 1))}><Chevron /></button>
                  </div>
                  <div className="col" style={{ gap: '6px' }}>
                    {(byDay[shownDay] || []).map((t: any) => <TaskRow key={t.id} t={t} today={today} fid={id} answer={answer} dName={dName} />)}
                    {!(byDay[shownDay] || []).length ? <span className="sub" style={{ padding: '6px 2px' }}>{tr('Nothing to do on this day.', 'مفيش حاجة تتعمل في اليوم ده.')}</span> : null}
                  </div>
                  <span className="sub">{tr('Tick a task when you have done it. Tap it for more.', 'علّم على المهمة لما تعملها. دوس عليها عشان تعرف أكتر.')}</span>
                </section>
              ) : null}

              {view === 'week' ? <Week start={weekStart(shownDay)} setDay={setDay} today={today} byDay={byDay} dName={dName} tr={tr}
                pick={(d: string) => { setDay(d); setView('day'); }} /> : null}
              {view === 'month' ? <Month month={month} setMonth={setMonth} today={today} byDay={byDay} mName={mName} tr={tr}
                pick={(d: string) => { setDay(d); setView('day'); }} /> : null}

              <section className="card rise" style={{ '--d': '3' } as React.CSSProperties}>
                <h2 className="h2">{tr('Coming up', 'اللي جاي')}</h2>
                <div className="col" style={{ gap: '6px' }}>
                  {upcoming.length ? upcoming.map((t: any) => (
                    <button key={t.id} type="button" className="inset press tlist" onClick={() => { setDay(t.date); setView('day'); }}>
                      <span className={CAT[t.category as Cat].chip}><CatIcon cat={t.category} /></span>
                      <span className="col" style={{ gap: '2px', flex: 1, minWidth: 0 }}>
                        <b style={{ fontSize: '14px' }}>{t.title}</b>
                        <span className="sub" style={{ fontSize: '12.5px' }}>{tr(CAT[t.category as Cat].en, CAT[t.category as Cat].ar)}</span>
                      </span>
                      <span className="pill">{dName(t.date)}</span>
                    </button>
                  )) : <span className="sub">{tr('Nothing in the next two weeks.', 'مفيش حاجة في الأسبوعين الجايين.')}</span>}
                </div>
              </section>
            </>
          ) : null}
          <Foot />
        </main>
      </div>
    </div>
  );
}

function Marks({ ts }: { ts: any[] }) {
  return (
    <span className="cal-marks">
      {ts.slice(0, 3).map((t) => (
        <i key={t.id} title={t.title} className={isLate(t) ? 'late' : isDone(t) ? 'done' : ''} style={{ background: isLate(t) ? 'transparent' : CAT[t.category as Cat].mark }} />
      ))}
      {ts.length > 3 ? <small>+{ts.length - 3}</small> : null}
    </span>
  );
}

function Month({ month, setMonth, today, byDay, mName, tr, pick }: any) {
  const [y, m] = month.split('-').map(Number);
  const start = weekStart(`${month}-01`);
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i)).filter((d, i) => i < 35 || d.slice(0, 7) === month);
  const shift = (n: number) => { const d = new Date(y, m - 1 + n, 1); setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); };
  return (
    <section className="card rise" style={{ '--d': '2' } as React.CSSProperties} aria-label={mName(month)}>
      <div className="row sp">
        <button type="button" className="ibtn press" aria-label={tr('Previous month', 'الشهر اللي فات')} onClick={() => shift(-1)}><Chevron back /></button>
        <h2 className="h2">{mName(month)}</h2>
        <button type="button" className="ibtn press" aria-label={tr('Next month', 'الشهر الجاي')} onClick={() => shift(1)}><Chevron /></button>
      </div>
      <div className="cal-month keep-cols">
        {DAYS_EN.map((d, i) => <span key={d} className="cal-dow">{tr(d, DAYS_AR[i])}</span>)}
        {days.map((d) => {
          const ts = (byDay[d] || []).filter((t: any) => !t.auto || d === t.date);
          return (
            <button key={d} type="button" className={'cal-day press' + (d === today ? ' is-today' : '') + (d.slice(0, 7) !== month ? ' other' : '')}
              onClick={() => pick(d)} aria-label={`${d}: ${ts.length}`}>
              <span className="cal-num">{Number(d.slice(8))}</span>
              <Marks ts={ts} />
            </button>
          );
        })}
      </div>
      <Legend tr={tr} />
    </section>
  );
}

function Week({ start, setDay, today, byDay, dName, tr, pick }: any) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <section className="card rise" style={{ '--d': '2' } as React.CSSProperties}>
      <div className="row sp">
        <button type="button" className="ibtn press" aria-label={tr('Previous week', 'الأسبوع اللي فات')} onClick={() => setDay(addDays(start, -7))}><Chevron back /></button>
        <h2 className="h2">{dName(days[0])} – {dName(days[6])}</h2>
        <button type="button" className="ibtn press" aria-label={tr('Next week', 'الأسبوع الجاي')} onClick={() => setDay(addDays(start, 7))}><Chevron /></button>
      </div>
      <div className="col" style={{ gap: '6px' }}>
        {days.map((d) => {
          const ts = byDay[d] || [];
          return (
            <button key={d} type="button" className={'inset press tlist' + (d === today ? ' is-today' : '')} onClick={() => pick(d)}>
              <b style={{ minWidth: '96px', fontSize: '13px' }}>{dName(d)}</b>
              <span className="col" style={{ gap: '4px', flex: 1, minWidth: 0 }}>
                {ts.length ? ts.map((t: any) => (
                  <span key={t.id} className="row" style={{ gap: '6px', minWidth: 0 }}>
                    <span className={CAT[t.category as Cat].chip + ' mini'}><CatIcon cat={t.category} size={12} /></span>
                    <span className="ellip" style={{ color: isLate(t) ? 'var(--risk)' : 'var(--ink2)', textDecoration: isDone(t) ? 'line-through' : 'none' }}>{t.title}</span>
                  </span>
                )) : <span className="sub">{tr('Nothing', 'مفيش')}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Legend({ tr }: { tr: any }) {
  return (
    <div className="row wrap" style={{ gap: '6px 14px' }} aria-label={tr('What the marks mean', 'العلامات معناها إيه')}>
      {(Object.keys(CAT) as Cat[]).map((k) => (
        <span key={k} className="row sub" style={{ gap: '6px', fontSize: '12.5px' }}>
          <i className="cal-key" style={{ background: CAT[k].mark }} />{tr(CAT[k].en, CAT[k].ar)}
        </span>
      ))}
      <span className="row sub" style={{ gap: '6px', fontSize: '12.5px' }}><i className="cal-key late" />{tr('Late or not done', 'متأخرة / ما اتعملتش')}</span>
    </div>
  );
}
