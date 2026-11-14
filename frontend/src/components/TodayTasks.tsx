'use client';
// Phase 3: the top of My field: today's tasks (and late ones) as V11 rows with a check box; tick here or
// open My tasks for the calendar. Data: GET /fields/{id}/tasks.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TaskRow from '@/components/TaskRow';
import { API, toSignIn } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function TodayTasks({ id }: { id: string }) {
  const tr = useT();
  const [T, setT] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    let alive = true;
    const get = (n = 0) => fetch(`${API}/fields/${id}/tasks`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status))).then((j) => alive && setT(j))
      .catch(() => alive && n < 3 && setTimeout(() => get(n + 1), 3000 * (n + 1)));
    get();
    return () => { alive = false; };
  }, [id]);
  if (!T) return null;
  const open = T.tasks.filter((t: any) => !t.auto && ['today', 'overdue', 'not_done'].includes(t.status));
  const nxt = T.tasks.find((t: any) => t.status === 'planned' && !t.auto);
  const answer = async (t: any, body: any) => {
    const r = await fetch(`${API}/fields/${id}/tasks/${encodeURIComponent(t.id)}`, { method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.status === 401) toSignIn();
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(typeof j.detail === 'string' ? j.detail : 'Could not save');
    setT(j.tasks);
  };
  return (
    <section className="card rise" style={{ '--d': '1' } as React.CSSProperties} aria-label={tr('Today', 'النهارده')}>
      <div className="row sp" style={{ gap: '8px' }}>
        <div className="col" style={{ gap: '2px' }}>
          <h2 className="h2">{tr('To do today', 'تعمل إيه النهارده')}</h2>
          <span className="sub">{open.length ? tr(`${open.length} task${open.length > 1 ? 's' : ''}`, `${open.length} ${open.length > 1 ? 'مهام' : 'مهمة'}`) : tr('Nothing today', 'مفيش حاجة النهارده')}</span>
        </div>
        <Link href={`/field/${id}/tasks`} className="btn line sm press">{tr('Calendar', 'التقويم')}</Link>
      </div>
      {open.length ? (
        <div className="col" style={{ gap: '6px' }}>
          {open.slice(0, 4).map((t: any) => <TaskRow key={t.id} t={t} today={T.today} fid={id} answer={answer} compact />)}
        </div>
      ) : null}
      {!open.length && nxt ? <div className="inset"><span>{tr('Next', 'الجاي')}</span><b>{nxt.title}</b></div> : null}
    </section>
  );
}
