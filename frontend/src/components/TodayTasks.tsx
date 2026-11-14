'use client';
// Phase 3: the top of My field: today's tasks (and late ones) from the calendar, one tap to the full checklist.
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const C: Record<string, string> = { irrigation: '#2F6FDE', fertilizer: '#3E7F35', spray: '#7A4FC9', inspection: '#E07A1F', milestone: '#C99A06' };

export default function TodayTasks({ id }: { id: string }) {
  const tr = useT();
  const T = useApi<any>(id ? `/fields/${id}/tasks` : null, undefined, true).data;
  if (!T) return null;
  const open = T.tasks.filter((t: any) => !t.auto && ['today', 'overdue', 'not_done'].includes(t.status));
  const nxt = T.tasks.find((t: any) => t.status === 'planned' && !t.auto);
  return (
    <section className="card rise" style={{ '--d': '1', gap: '10px' } as React.CSSProperties} aria-label={tr("Today's tasks", 'مهام النهارده')}>
      <div className="row sp" style={{ gap: '8px' }}>
        <h2 className="h2">{open.length ? tr(`Today: ${open.length} task${open.length > 1 ? 's' : ''}`, `النهارده: ${open.length} ${open.length > 1 ? 'مهام' : 'مهمة'}`) : tr('Nothing to do today', 'مفيش حاجة النهارده')}</h2>
        <Link href={`/field/${id}/tasks`} className="btn sm press">{tr('My tasks', 'مهامي')}</Link>
      </div>
      {open.slice(0, 3).map((t: any) => (
        <Link key={t.id} href={`/field/${id}/tasks`} className="inset press" style={{ borderInlineStart: `5px solid ${C[t.category]}`, outline: t.status !== 'today' ? '2px solid #C2412A' : 'none', outlineOffset: '-2px', textDecoration: 'none', color: 'inherit' }}>
          <b style={{ fontSize: '15px' }}>{t.title}</b>
          <span className={t.status === 'today' ? 'pill' : 'lv lv-high'}>{t.status === 'today' ? tr('Today', 'النهارده') : <><i />{tr('Late', 'متأخرة')}</>}</span>
        </Link>
      ))}
      {!open.length && nxt ? <span className="tl">{tr('Next:', 'الجاي:')} <span>{nxt.title}</span> · {nxt.date}</span> : null}
    </section>
  );
}
