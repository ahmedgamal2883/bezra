'use client';
// The small grey line under a task or a warning: what doing it protects, harvest on one side and soil on the other.
// A simple per-task rule, kept apart from the season model and the big results (they are not meant to add up).
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Impact = { h: number; s: number };

/** A task from /tasks -> its impact line (harvest %, soil %). */
export function impactOf(t: any, sm?: any): Impact | null {
  const hi = Array.isArray(t?.benefit?.range) ? Number(t.benefit.range[1]) : null;
  const id = String(t?.id || ''), cat = t?.category;
  if (cat === 'irrigation') {
    // the next turn: the same (larger) number Today shows ("protects about 11-16%"), so the two never disagree
    const pr = sm?.action?.protects?.value;
    if (Array.isArray(pr) && sm?.action?.next_turn === t.date) return { h: Number(pr[1]), s: 0.3 };
    const canSkip = /you can skip/i.test(t.title || '');  // not "do not skip"
    return { h: hi ?? (canSkip ? 0.5 : 2), s: canSkip ? 0.2 : 0.3 };
  }
  if (cat === 'fertilizer') return /-n[12]$/.test(id) ? { h: 6, s: 0.5 } : /-n0$/.test(id) ? { h: 2, s: 0.4 } : { h: 3, s: 0.6 };
  if (cat === 'spray') return { h: hi ?? 5, s: 0.3 };
  if (cat === 'inspection') return { h: 4, s: 0.1 };
  if (/^sow/.test(id)) return { h: 3, s: 0.2 };
  return null;
}

export default function ImpactLine({ h, s }: Impact) {
  const f = (x: number) => (x >= 1 ? Math.round(x) : Math.round(x * 10) / 10);
  return (
    <span className="row sp meta" style={{ fontSize: '12.5px', color: 'var(--muted)', gap: '12px', paddingTop: '2px', width: '100%' }}>
      <span>{`Harvest +${f(h)}%`}</span>
      <span>{`Soil protection +${f(s)}%`}</span>
    </span>
  );
}
