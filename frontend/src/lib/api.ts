'use client';
// Talks to the Python backend. If the backend can't answer, screens keep the design's value
// and show the Demo pill (brief Rule #2).
import { useEffect, useState } from 'react';

export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Loadable<T = any> = { data: T | null; loading: boolean; error: string | null };

const memo = new Map<string, any>();

export function useApi<T = any>(path: string | null, body?: unknown): Loadable<T> {
  const key = path ? path + (body ? JSON.stringify(body) : '') : '';
  const [state, setState] = useState<Loadable<T>>(() => ({ data: memo.get(key) ?? null, loading: !!path && !memo.has(key), error: null }));
  useEffect(() => {
    if (!path) return;
    let alive = true;
    if (memo.has(key)) {
      setState({ data: memo.get(key), loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Retry a failed request up to 3 times (backend starting up, weak connection).
    const attempt = (n: number) =>
      fetch(API + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined)
        .then(async (r) => {
          if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
          return r.json();
        })
        .then((data) => {
          memo.set(key, data);
          if (alive) setState({ data, loading: false, error: null });
        })
        .catch((e) => {
          if (!alive) return;
          if (n < 3) timer = setTimeout(() => attempt(n + 1), 3000 * (n + 1));
          else setState({ data: null, loading: false, error: String(e.message || e) });
        });
    attempt(0);
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return state;
}

// Provenance pill classes and labels, as in the V11 design (About: "The six labels").
export const PV: Record<string, { cls: string; label: string }> = {
  satellite: { cls: 'pill pv-sat', label: 'Satellite' },
  estimated: { cls: 'pill pv-est', label: 'Estimated' },
  farmer: { cls: 'pill pv-farm', label: 'Farmer' },
  agronomist: { cls: 'pill pv-agro', label: 'Agronomist' },
  measured: { cls: 'pill pv-meas', label: 'Measured' },
  demo: { cls: 'pill pv-demo', label: 'Demo' },
};

export const LV: Record<string, string> = { Low: 'lv lv-low', Medium: 'lv lv-med', High: 'lv lv-high' };

export function dm(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })}`;
}
