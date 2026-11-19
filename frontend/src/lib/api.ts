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
const SAVES = /\/(log|checkin|approve|cases|soiltest|priority|next-winter)(\?|$)|\/(tasks|irrigation|field-alerts)\/[^/?]+(\?|$)|\/fields\/[^/?]+(\?|$)|\/fields(\?|$)/;
export function forgetField(fieldId?: string) {
  for (const k of [...memo.keys()]) if (!fieldId || k.includes(`/fields/${fieldId}`) || k.startsWith('/engineer') || k === '/fields') memo.delete(k);
}
// ---- ready copy of the sample field (public/demo, made by backend/scripts/make_static_demo.py) ----
// While the server restarts or wakes, the sample field is shown from that copy (same real data, made before the
// deploy); the live server takes over as soon as it answers (components/ReadyCopy). Only the sample field: a
// farmer's own account always reads the live server.
const OFFLINE_KEY = 'bezra.readyCopy';
export function readyCopyOn(): boolean {
  try { return typeof window !== 'undefined' && (sessionStorage.getItem(OFFLINE_KEY) === '1' || window.location.pathname.startsWith('/field/demo')); } catch { return false; }
}
export function setReadyCopy(on: boolean) {
  try { if (on) sessionStorage.setItem(OFFLINE_KEY, '1'); else sessionStorage.removeItem(OFFLINE_KEY); } catch { /* private mode */ }
}
function staticFile(apiPath: string): string {
  const [p, q = ''] = apiPath.replace(/^\/api/, '').split('?');
  const keep = q.split('&').filter((x) => x && !/^(v|p)=/.test(x)).join('&');  // ?v= / ?p= only force a reload
  const name = (p + (keep ? '?' + decodeURIComponent(keep) : '')).replace(/^\//, '').replace(/\//g, '__').replace('?', '@');
  return '/demo/' + name + (/\.(jpg|png)$/.test(p) ? '' : '.json');
}
let rawFetch: typeof fetch = (...a) => fetch(...a);
/** fetch that always goes to the live server (used to see whether it answers again). */
export const liveFetch: typeof fetch = (...a) => rawFetch(...a);

if (typeof window !== 'undefined' && !(window as any).__bezraSaves) {
  (window as any).__bezraSaves = true;
  const orig = window.fetch.bind(window);
  rawFetch = orig;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url0 = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const path0 = url0.replace(/^https?:\/\/[^/]+/, '');
    const method0 = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    if (readyCopyOn() && path0.startsWith('/api/') && !path0.startsWith('/api/health')) {
      if (method0 === 'GET') {
        const r = await orig(staticFile(path0));
        return r.ok ? r : new Response('{"detail":"not in the ready copy"}', { status: 503, headers: { 'content-type': 'application/json' } });
      }
      if (path0.startsWith('/api/fields/')) window.dispatchEvent(new CustomEvent('bezra:ready-copy-write'));  // the farmer's own change, not e.g. the tour state
      return new Response('{"detail":"The server is starting: try again in a minute."}', { status: 503, headers: { 'content-type': 'application/json' } });
    }
    // the homepage's numbers (public, the same for everyone): if the server does not answer, the ready copy's
    if (method0 === 'GET' && /^\/api\/(sample|hindcast)(\?|$)/.test(path0)) {
      try {
        const live = await Promise.race([orig(input, init), new Promise<Response>((_, no) => setTimeout(() => no(new Error('slow')), 6000))]);
        if (live.ok) return live;
      } catch { /* server restarting or waking */ }
      const r = await orig(staticFile(path0));
      if (r.ok) return r;
    }
    const res = await orig(input, init);
    const method = method0;
    if (method !== 'GET' && res.ok) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const path = url.replace(/^https?:\/\/[^/]+/, '');
      if (path.startsWith('/api/') && SAVES.test(path.split('?')[0] + '')) {
        const m = path.match(/\/fields\/([^/?]+)/);
        forgetField(m ? m[1] : undefined);
        // a change the plan is built on: tell the screen (a small "Plan updated" note, components/PlanToast)
        if (m) window.dispatchEvent(new CustomEvent('bezra:plan-updated'));
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

/** How many parts of the screen are still waiting for data (components/PendingSeed shows a seed while > 0). */
const pending = new Set<object>();
const pendingSubs = new Set<(n: number) => void>();
/** Count any other wait (e.g. the season runs of Try a season) in the corner loader. */
export async function trackPending<T>(p: Promise<T>): Promise<T> {
  const tok = {};
  pendingSet(tok, true);
  try { return await p; } finally { pendingSet(tok, false); }
}
export function onPending(f: (n: number) => void) { pendingSubs.add(f); f(pending.size); return () => { pendingSubs.delete(f); }; }
const pendingSet = (tok: object, on: boolean) => {
  const had = pending.has(tok);
  if (on) pending.add(tok); else pending.delete(tok);
  if (had !== on) pendingSubs.forEach((f) => f(pending.size));
};

// The same request asked by several parts of a screen at once goes to the server once; all of them get that answer
// (the free server has one processor: copies of a request only queue behind each other).
const inflight = new Map<string, Promise<any>>();
function shared<T>(key: string, run: () => Promise<T>): Promise<T> {
  const hit = inflight.get(key);
  if (hit) return hit as Promise<T>;
  const p = run().finally(() => { inflight.delete(key); });
  inflight.set(key, p);
  return p;
}

/** Fetch quietly into the same memory the screens read, so the next page opens without waiting. */
const warming = new Set<string>();
export function prefetch(path: string): Promise<void> {
  if (memo.has(path) || warming.has(path)) return Promise.resolve();
  warming.add(path);
  return shared(path, () => fetch(API + path).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })).then((d) => { if (d != null && !memo.has(path)) memo.set(path, d); })
    .catch(() => {}).finally(() => { warming.delete(path); });
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
    const tok = {};
    pendingSet(tok, true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Retry a failed request up to 3 times (backend starting up, weak connection).
    const attempt = (n: number) =>
      shared(key, () => fetch(API + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined)
        .then(async (r) => {
          if (r.status === 401) { toSignIn(); throw new Error('401'); }
          if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
          return r.json();
        }))
        .then((data) => {
          memo.set(key, data);
          pendingSet(tok, false);
          if (alive) setState({ data, loading: false, error: null });
        })
        .catch((e) => {
          if (!alive) return;
          if (n < 3) timer = setTimeout(() => attempt(n + 1), 3000 * (n + 1));
          else if (!demoAccount && !String(e.message).startsWith('4')) {
            setState({ data: null, loading: true, error: String(e.message || e) });
            timer = setTimeout(() => attempt(0), 15000);
          } else { pendingSet(tok, false); setState({ data: null, loading: false, error: String(e.message || e) }); }
        });
    attempt(0);
    return () => {
      alive = false;
      pendingSet(tok, false);
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
