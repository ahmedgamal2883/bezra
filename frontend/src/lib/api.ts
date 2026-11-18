'use client';
// Talks to the Python backend. If the backend can't answer, screens keep the design's value
// and show the Demo pill (brief Rule #2).
import { useEffect, useState } from 'react';

// Same-origin: next.config.ts forwards /api/... to the Python backend (keeps the sign-in cookie on this site).
export const API = '/api';

// Not signed in (session expired): go to Sign in and come back here after.
export function toSignIn() {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/sign-in')) return;
  window.location.href = '/sign-in?next=' + encodeURIComponent(window.location.pathname + window.location.search);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Loadable<T = any> = { data: T | null; loading: boolean; error: string | null };

const memo = new Map<string, any>();

// After the farmer saves anything (a watering, a check-in, a task, an edit), forget what this visit cached for that
// field, so every screen asks the server again and shows the new state (not the numbers from before the save).
const SAVES = /\/(log|checkin|approve|cases|soiltest)(\?|$)|\/(tasks|irrigation|field-alerts)\/[^/?]+(\?|$)|\/fields\/[^/?]+(\?|$)|\/fields(\?|$)/;
export function forgetField(fieldId?: string) {
  for (const k of [...memo.keys()]) if (!fieldId || k.includes(`/fields/${fieldId}`) || k.startsWith('/engineer') || k === '/fields') memo.delete(k);
}
if (typeof window !== 'undefined' && !(window as any).__bezraSaves) {
  (window as any).__bezraSaves = true;
  const orig = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const res = await orig(input, init);
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    if (method !== 'GET' && res.ok) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const path = url.replace(/^https?:\/\/[^/]+/, '');
      if (path.startsWith('/api/') && SAVES.test(path.split('?')[0] + '')) {
        const m = path.match(/\/fields\/([^/?]+)/);
        forgetField(m ? m[1] : undefined);
      }
    }
    return res;
  };
}

// Demo farmer (Hassan) only: when a request fails, screens may fall back to the design's sample values.
// Everyone else keeps the loading state (skeleton) and the request keeps retrying: no sample values, ever.
let demoAccount = false;
export function setDemoAccount(on: boolean) {
  demoAccount = on;
}

/** Fetch quietly into the same memory the screens read, so the next page opens without waiting. */
const warming = new Set<string>();
export function prefetch(path: string) {
  if (memo.has(path) || warming.has(path)) return;
  warming.add(path);
  fetch(API + path).then((r) => (r.ok ? r.json() : null)).then((d) => { if (d != null && !memo.has(path)) memo.set(path, d); })
    .catch(() => {}).finally(() => warming.delete(path));
}

export function useApi<T = any>(path: string | null, body?: unknown, fresh = false): Loadable<T> {
  const key = path ? path + (body ? JSON.stringify(body) : '') : '';
  if (fresh) memo.delete(key); // e.g. plan approval status: always ask again
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
          if (r.status === 401) { toSignIn(); throw new Error('401'); }
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
          else if (!demoAccount && !String(e.message).startsWith('4')) {
            setState({ data: null, loading: true, error: String(e.message || e) });
            timer = setTimeout(() => attempt(0), 15000);
          } else setState({ data: null, loading: false, error: String(e.message || e) });
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
