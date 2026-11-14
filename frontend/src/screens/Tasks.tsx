'use client';
// Phase 3: the field calendar + checklist ("what should I do today, and did I do it?").
// Month / week / day. RTL in Arabic, the week starts on Saturday (Egypt). Every task type has a colour AND an
// icon AND a label (never colour alone). Day view = big tap targets: Done / Later / Not done, + note or photo.
// Data: GET /fields/{id}/tasks, answers POST /fields/{id}/tasks/{task}. Amounts never appear: the engineer sets them.
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { FarmerHeader, Foot } from '@/components/chrome';
import { API, toSignIn } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Cat = 'irrigation' | 'fertilizer' | 'spray' | 'inspection' | 'milestone';
const COL: Record<Cat, { c: string; soft: string; en: string; ar: string; icon: ReactNode }> = {
  irrigation: { c: '#2F6FDE', soft: '#E3EDFC', en: 'Water', ar: 'ري', icon: <path d="M12 3.5s6 6.4 6 10.7A6 6 0 0 1 6 14.2C6 9.9 12 3.5 12 3.5z" /> },
  fertilizer: { c: '#3E7F35', soft: '#E3F1DF', en: 'Fertilizer', ar: 'تسميد', icon: <path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6" /> },
  spray: { c: '#7A4FC9', soft: '#EEE8FA', en: 'Spray / pest control', ar: 'رش / مكافحة', icon: <path d="M9 3h6M10 3v4M8 7h8l1 4H7zM7 11v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8M18 5l2-1M18 8h3" /> },
  inspection: { c: '#E07A1F', soft: '#FCEBDB', en: 'Field check', ar: 'كشف / معاينة', icon: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4" /> },
  milestone: { c: '#C99A06', soft: '#FBF1CF', en: 'Season dates', ar: 'مواعيد الموسم', icon: <path d="M5 21V4M5 4h11l-2 4 2 4H5" /> },
};
const RED = '#C2412A';
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const addDays = (s: string, n: number) => { const d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
const weekStart = (s: string) => { const d = new Date(s + 'T00:00:00'); return addDays(s, -((d.getDay() + 1) % 7)); };  // Saturday
const DAYS_EN = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAYS_AR = ['سبت', 'حد', 'اتنين', 'تلات', 'أربع', 'خميس', 'جمعة'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const late = (t: any) => t.status === 'overdue' || t.status === 'not_done';
const isDone = (t: any) => t.status === 'done' || t.status === 'verified';

const Ico = ({ cat, size = 16, color }: { cat: Cat; size?: number; color?: string }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || COL[cat].c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{COL[cat].icon}</svg>
);

async function send(fid: string, tid: string, body: any) {
  const r = await fetch(`${API}/fields/${fid}/tasks/${encodeURIComponent(tid)}`, { method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (r.status === 401) toSignIn();
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(typeof j.detail === 'string' ? j.detail : 'Could not save');
  return j;
}

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
      // a task with a window shows on every day of it (up to 10), else on its day
      const days = t.window && !isDone(t) && t.status !== 'later' ? Math.min(10, Math.round((+new Date(t.window[1]) - +new Date(t.window[0])) / 864e5)) : 0;
      for (let i = 0; i <= days; i++) (m[addDays(t.window && days ? t.window[0] : t.date, i)] ||= []).push(t);
    }
    return m;
  }, [data]);

  const answer = async (t: any, body: any) => {
    const j = await send(id, t.id, body);
    setData(j.tasks);
  };

  const today = data?.today || '';
  const mName = (ym: string) => { const [y, m] = ym.split('-').map(Number); return `${tr(MONTHS_EN[m - 1], MONTHS_AR[m - 1])} ${y}`; };
  const dName = (s: string) => { const d = new Date(s + 'T00:00:00'); return `${tr(DAYS_EN[(d.getDay() + 1) % 7], DAYS_AR[(d.getDay() + 1) % 7])} ${d.getDate()} ${tr(MONTHS_EN[d.getMonth()], MONTHS_AR[d.getMonth()])}`; };
  const upcoming = (data?.tasks || []).filter((t: any) => t.date > today && t.date <= addDays(today, 14) && !isDone(t)).slice(0, 8);

  return (
    <div className="root">
      <div className="shell">
        <FarmerHeader active="tasks" />
        <main className="main" style={{ maxWidth: '980px', margin: '0 auto', width: '100%' }}>
          <div className="row sp wrap" style={{ gap: '10px', alignItems: 'flex-end' }}>
            <div className="col" style={{ gap: '4px' }}>
              <Link href={`/field/${id}`} className="tl press" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{tr('Back to my field', 'ارجع لأرضي')}</Link>
              <h1 className="h1">{tr('My tasks', 'مهامي')}</h1>
            </div>
            <div role="group" aria-label={tr('View', 'العرض')} className="seg">
              {(['day', 'week', 'month'] as const).map((v) => (
                <button key={v} type="button" className={'segb press' + (view === v ? ' on' : '')} aria-pressed={view === v} onClick={() => setView(v)}>
                  {tr({ day: 'Day', week: 'Week', month: 'Month' }[v], { day: 'يوم', week: 'أسبوع', month: 'شهر' }[v])}
                </button>
              ))}
            </div>
          </div>

          {err ? <section className="card"><span>{err}</span><button type="button" className="btn press" onClick={() => load()}>{tr('Try again', 'جرّب تاني')}</button></section> : null}
          {!data && !err ? <span className="sub">{tr('Loading your tasks…', 'بنجيب مهامك…')}</span> : null}

          {data ? (
            <>
              {/* nudges: yesterday's unanswered task, this evening's open ones */}
              {(data.reminders || []).map((r: any) => {
                const t = data.tasks.find((x: any) => x.id === r.task_id);
                if (!t) return null;
                return (
                  <section key={r.task_id} className="card task-nudge" style={{ borderInlineStart: `5px solid ${COL[t.category as Cat].c}` }}>
                    <span className="row" style={{ gap: '8px', alignItems: 'center' }}><Ico cat={t.category} size={20} /><b style={{ fontSize: '17px' }}>
                      {r.kind === 'yesterday' ? tr('Yesterday you had:', 'امبارح كان عليك:') : tr('Today:', 'النهارده:')}{' '}<span>{t.title}</span>{' '}{tr('Did you do it?', 'عملته؟')}
                    </b></span>
                    <div className="row" style={{ gap: '8px' }}>
                      <button type="button" className="btn press task-btn" onClick={() => answer(t, { answer: 'done' })}>{tr('Yes', 'أيوه')}</button>
                      <button type="button" className="btn line press task-btn" onClick={() => answer(t, { answer: 'not_done' })}>{tr('No', 'لأ')}</button>
                    </div>
                  </section>
                );
              })}

              {view === 'month' ? (
                <Month month={month} setMonth={setMonth} today={today} byDay={byDay} mName={mName} tr={tr}
                  pick={(d: string) => { setDay(d); setView('day'); }} />
              ) : null}
              {view === 'week' ? (
                <Week start={weekStart(day || today)} setDay={setDay} today={today} byDay={byDay} dName={dName} tr={tr}
                  pick={(d: string) => { setDay(d); setView('day'); }} />
              ) : null}
              {view === 'day' ? <Day day={day || today} setDay={setDay} today={today} tasks={byDay[day || today] || []} dName={dName} tr={tr} answer={answer} fid={id} /> : null}

              <section className="card">
                <h2 className="h2">{tr('Coming up', 'اللي جاي')}</h2>
                {upcoming.length ? upcoming.map((t: any) => (
                  <button key={t.id + t.date} type="button" className="inset press task-row" onClick={() => { setDay(t.date); setView('day'); }}>
                    <Ico cat={t.category} size={18} />
                    <span className="col" style={{ gap: '2px', flex: 1, minWidth: 0, textAlign: 'start' }}>
                      <b style={{ fontSize: '15px' }}>{t.title}</b>
                      <span className="tl">{dName(t.date)} · {tr(COL[t.category as Cat].en, COL[t.category as Cat].ar)}</span>
                    </span>
                  </button>
                )) : <span className="sub">{tr('Nothing in the next two weeks.', 'مفيش حاجة في الأسبوعين الجايين.')}</span>}
              </section>

              <Legend tr={tr} />
            </>
          ) : null}
          <Foot />
        </main>
      </div>
    </div>
  );
}

function Legend({ tr }: { tr: any }) {
  return (
    <div className="row wrap" style={{ gap: '8px 16px', fontSize: '13px', color: 'var(--ink2)' }} aria-label={tr('Colours', 'الألوان')}>
      {(Object.keys(COL) as Cat[]).map((k) => (
        <span key={k} className="row" style={{ gap: '6px', alignItems: 'center' }}>
          <i style={{ width: '14px', height: '6px', borderRadius: '3px', background: COL[k].c, display: 'inline-block' }} /><Ico cat={k} size={14} />{tr(COL[k].en, COL[k].ar)}
        </span>
      ))}
      <span className="row" style={{ gap: '6px', alignItems: 'center' }}>
        <i style={{ width: '14px', height: '8px', borderRadius: '3px', border: `2px solid ${RED}`, display: 'inline-block' }} />{tr('Late or not done', 'متأخر / ما اتعملش')}
      </span>
    </div>
  );
}

function Bar({ t }: { t: any }) {
  const k = COL[t.category as Cat];
  return (
    <span className="task-bar" title={t.title} style={{ background: isDone(t) ? k.soft : k.c, outline: late(t) ? `2px solid ${RED}` : 'none', outlineOffset: '-2px' }}>
      <Ico cat={t.category} size={10} color={isDone(t) ? k.c : '#fff'} />
    </span>
  );
}

function Month({ month, setMonth, today, byDay, mName, tr, pick }: any) {
  const [y, m] = month.split('-').map(Number);
  const first = `${month}-01`;
  const start = weekStart(first);
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i)).filter((d, i) => i < 35 || d.slice(0, 7) === month);
  const shift = (n: number) => { const d = new Date(y, m - 1 + n, 1); setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`); };
  return (
    <section className="card" aria-label={mName(month)}>
      <div className="row sp">
        <button type="button" className="ibtn press" aria-label={tr('Previous month', 'الشهر اللي فات')} onClick={() => shift(-1)}><span className="flip">‹</span></button>
        <h2 className="h2">{mName(month)}</h2>
        <button type="button" className="ibtn press" aria-label={tr('Next month', 'الشهر الجاي')} onClick={() => shift(1)}><span className="flip">›</span></button>
      </div>
      <div className="cal-month keep-cols">
        {DAYS_EN.map((d, i) => <span key={d} className="cal-dow">{tr(d, DAYS_AR[i])}</span>)}
        {days.map((d) => {
          const ts = byDay[d] || [];
          return (
            <button key={d} type="button" className={'cal-day press' + (d === today ? ' is-today' : '') + (d.slice(0, 7) !== month ? ' other' : '')}
              onClick={() => pick(d)} aria-label={`${d}: ${ts.length} ${tr('tasks', 'مهام')}`}>
              <span className="cal-num">{Number(d.slice(8))}</span>
              <span className="cal-bars">{ts.slice(0, 4).map((t: any) => <Bar key={t.id} t={t} />)}{ts.length > 4 ? <small>+{ts.length - 4}</small> : null}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Week({ start, setDay, today, byDay, dName, tr, pick }: any) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  return (
    <section className="card">
      <div className="row sp">
        <button type="button" className="ibtn press" aria-label={tr('Previous week', 'الأسبوع اللي فات')} onClick={() => setDay(addDays(start, -7))}><span className="flip">‹</span></button>
        <h2 className="h2">{dName(days[0])} – {dName(days[6])}</h2>
        <button type="button" className="ibtn press" aria-label={tr('Next week', 'الأسبوع الجاي')} onClick={() => setDay(addDays(start, 7))}><span className="flip">›</span></button>
      </div>
      {days.map((d) => (
        <button key={d} type="button" className={'inset press task-row' + (d === today ? ' is-today' : '')} onClick={() => pick(d)}>
          <b style={{ minWidth: '92px', textAlign: 'start' }}>{dName(d)}</b>
          <span className="row wrap" style={{ gap: '6px', flex: 1 }}>
            {(byDay[d] || []).map((t: any) => (
              <span key={t.id} className="task-chip" style={{ background: COL[t.category as Cat].soft, color: COL[t.category as Cat].c, outline: late(t) ? `2px solid ${RED}` : 'none' }}>
                <Ico cat={t.category} size={13} />{t.title}
              </span>
            ))}
            {!(byDay[d] || []).length ? <span className="tl">{tr('Nothing', 'مفيش')}</span> : null}
          </span>
        </button>
      ))}
    </section>
  );
}

function Day({ day, setDay, today, tasks, dName, tr, answer, fid }: any) {
  return (
    <section className="col" style={{ gap: '10px' }}>
      <div className="row sp">
        <button type="button" className="ibtn press" aria-label={tr('Previous day', 'اليوم اللي فات')} onClick={() => setDay(addDays(day, -1))}><span className="flip">‹</span></button>
        <h2 className="h2">{day === today ? tr('Today', 'النهارده') + ' · ' : ''}{dName(day)}</h2>
        <button type="button" className="ibtn press" aria-label={tr('Next day', 'اليوم الجاي')} onClick={() => setDay(addDays(day, 1))}><span className="flip">›</span></button>
      </div>
      {!tasks.length ? <section className="card"><span className="body">{tr('Nothing to do on this day.', 'مفيش حاجة تتعمل في اليوم ده.')}</span></section> : null}
      {tasks.map((t: any) => <TaskCard key={t.id} t={t} tr={tr} answer={answer} fid={fid} today={today} dName={dName} />)}
    </section>
  );
}

function TaskCard({ t, tr, answer, fid, today, dName }: any) {
  const k = COL[t.category as Cat];
  const [note, setNote] = useState('');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const go = async (body: any) => {
    setBusy(body.answer); setMsg('');
    try { await answer(t, { ...body, note: note || null }); } catch (e: any) { setMsg(e.message); } finally { setBusy(''); }
  };
  const canAnswer = !t.auto && t.date <= today && !isDone(t);
  const STATUS: Record<string, [string, string]> = {
    done: ['Done', 'اتعملت'], verified: ['Done, seen from the satellite', 'اتعملت، واتأكدت من القمر الصناعي'], today: ['Today', 'النهارده'],
    planned: ['Planned', 'جاية'], past: ['Before Bezra', 'قبل بذرة'], later: ['Moved to later', 'اتأجلت'], not_done: ['Not done', 'ما اتعملتش'], overdue: ['Late', 'متأخرة'],
  };
  return (
    <section className="card task-card" style={{ borderInlineStart: `6px solid ${k.c}`, outline: late(t) ? `2px solid ${RED}` : 'none' }}>
      <div className="row sp" style={{ gap: '8px', alignItems: 'flex-start' }}>
        <span className="row" style={{ gap: '8px', alignItems: 'center' }}>
          <span className="task-ico" style={{ background: k.soft }}><Ico cat={t.category} size={20} /></span>
          <span className="col" style={{ gap: '2px' }}>
            <small style={{ color: k.c, fontWeight: 700 }}>{tr(k.en, k.ar)}</small>
            <b style={{ fontSize: '17px', lineHeight: 1.35 }}>{t.title}</b>
          </span>
        </span>
        <span className={late(t) ? 'lv lv-high' : isDone(t) ? 'lv lv-low' : 'pill'}>{isDone(t) || late(t) ? <i /> : null}{tr(...(STATUS[t.status] || [t.status, t.status]))}</span>
      </div>
      <p className="body" style={{ margin: 0 }}>{t.why}</p>
      {t.note ? <p className="tl" style={{ margin: 0 }}>{t.note}</p> : null}
      {t.amount ? <span className="tl">{t.amount}</span> : null}
      {t.window ? <span className="tl">{tr('Any day from', 'أي يوم من')} {dName(t.window[0])} {tr('to', 'لـ')} {dName(t.window[1])}</span> : null}
      {t.category === 'inspection' ? (
        <Link href={`/field/${fid}/health`} className="tl press" style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>{tr('See the spot on the map, with the images', 'شوف الحتة على الخريطة، بالصور')}</Link>
      ) : null}
      {canAnswer ? (
        <>
          <div className="task-actions">
            <button type="button" className="btn press task-btn" disabled={!!busy} onClick={() => go({ answer: 'done' })}>✅ {tr('I did it', 'عملتها')}</button>
            <button type="button" className="btn soft press task-btn" disabled={!!busy} onClick={() => go({ answer: 'later' })}>⏰ {tr('Later', 'أجّلها')}</button>
            <button type="button" className="btn line press task-btn" disabled={!!busy} onClick={() => go({ answer: 'not_done' })}>❌ {tr("I didn't", 'معملتهاش')}</button>
          </div>
          <div className="row wrap" style={{ gap: '8px' }}>
            <button type="button" className="tl press" style={{ background: 'none', border: 0, textDecoration: 'underline', cursor: 'pointer', padding: '6px 0' }} onClick={() => setOpen(!open)}>{tr('Add a note', 'اكتب ملحوظة')}</button>
            <Link href={`/field/${fid}/diagnose`} className="tl press" style={{ textDecoration: 'underline', padding: '6px 0' }}>{tr('Add a photo', 'صوّر')}</Link>
          </div>
          {open ? <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={tr('What did you see?', 'شفت إيه؟')} style={{ width: '100%', boxSizing: 'border-box' }} /> : null}
        </>
      ) : null}
      {t.answer?.note ? <span className="tl">{tr('Your note: ', 'ملحوظتك: ')}{t.answer.note}</span> : null}
      {msg ? <span style={{ color: RED }}>{msg}</span> : null}
    </section>
  );
}
