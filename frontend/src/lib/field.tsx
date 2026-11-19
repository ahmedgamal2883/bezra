'use client';
// Who is signed in, which fields they may see, and which field they are looking at.
// Field pages (/field/[id]/...) set the current field; every screen builds its links with fp().
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { API, setDemoAccount } from './api';
import SeedLoader from '@/components/SeedLoader';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldCard = { id: string; num?: string; name: string; crop: string; area_feddan: number; farmer: string; village?: string; governorate?: string; lat: number; lon: number };
export type User = { id: number; email: string; name: string; role: 'farmer' | 'engineer' | 'admin'; engineer_name?: string | null; demo?: boolean; demo_account?: boolean; guest?: boolean };

type Ctx = { user: User | null; fields: FieldCard[]; loaded: boolean; id: string; setId: (id: string) => void; reload: () => void };
const C = createContext<Ctx>({ user: null, fields: [], loaded: false, id: '', setId: () => {}, reload: () => {} });

// Kept for older imports: names of known fields by id (filled once fields load).
export const FIELD_NAMES: Record<string, string> = {};

// Kept in memory for the whole visit, so a re-mount (language switch) shows the page at once.
const kept: { user: User | null; fields: FieldCard[]; loaded: boolean } = { user: null, fields: [], loaded: false };

export function FieldProvider({ children }: { children: ReactNode }) {
  const [user, setUserS] = useState<User | null>(kept.user);
  const [fields, setFieldsS] = useState<FieldCard[]>(kept.fields);
  const [loaded, setLoadedS] = useState(kept.loaded);
  const setUser = (u: User | null) => { kept.user = u; setUserS(u); };
  const setFields = (f: FieldCard[]) => { kept.fields = f; setFieldsS(f); };
  const setLoaded = (v: boolean) => { kept.loaded = v; setLoadedS(v); };
  const [id, setId] = useState('');
  const path = usePathname();
  const load = useCallback(async () => {
    try {
      // both at once (the field list answers 401 when nobody is signed in; then it is simply not used)
      // only on private pages (signed in for sure): on public ones a signed-out visitor would get a 401 for nothing
      const both = typeof window !== 'undefined' && !PUBLIC.test(window.location.pathname);
      const [me, flr] = await Promise.all([fetch(API + '/auth/me'), both ? fetch(API + '/fields') : Promise.resolve(null)]);
      if (!me.ok) { setUser(null); setFields([]); return; }
      const u: User = await me.json();
      setDemoAccount(!!u.demo);
      document.documentElement.dataset.demo = u.demo ? '1' : '0';
      setUser(u);
      const fl: FieldCard[] = flr && flr.ok ? await flr.json() : await (await fetch(API + '/fields')).json();
      fl.forEach((f) => { FIELD_NAMES[f.id] = f.name; });
      setFields(fl);
    } catch {
      /* backend down: screens show their Demo values */
    } finally {
      setLoaded(true);
    }
  }, []);
  // reload after signing in / out (the page changes)
  useEffect(() => { load(); }, [load, path === '/sign-in']); // eslint-disable-line react-hooks/exhaustive-deps
  // A farmer without a field yet goes to Onboarding from any field screen.
  const needsField = loaded && user?.role === 'farmer' && fields.length === 0 && /^\/(field\/|sim|ask|plan|report)/.test(path || '');
  useEffect(() => { if (needsField) window.location.replace('/fields/new'); }, [needsField]);
  // Public pages (home, sign-in, sign-up, ...) show at once: they hold no one's data, and who is signed in fills in later.
  // Every other page waits until we know who is signed in: no other person's name or field ever flashes on screen.
  const isPublic = PUBLIC.test(path || '');
  const ready = isPublic || (loaded && !needsField);
  return <C.Provider value={{ user, fields, loaded, id, setId, reload: load }}>{ready ? children : <Waiting onRetry={load} />}</C.Provider>;
}

const PUBLIC = /^\/($|(signin|signup|sign-in|sign-up|about|waking|states)(\/|$))/;

/** While a private page waits for "who is signed in": a turning seed, then a retry button if it takes long. */
function Waiting({ onRetry }: { onRetry: () => void }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setSlow(true), 12000); return () => clearTimeout(t); }, []);
  return (
    <div className="v2 root" aria-busy="true" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ display: 'grid', justifyItems: 'center', gap: '14px', textAlign: 'center', padding: '0 16px' }}>
        <SeedLoader size={56} label="" />
        {slow ? (
          <>
            <span className="meta" style={{ fontSize: '14px' }}>{'This is taking longer than usual.'}</span>
            <button type="button" className="btn soft press" onClick={() => { setSlow(false); onRetry(); }}>{'Try again'}</button>
          </>
        ) : <span className="meta" style={{ fontSize: '14px' }}>bezra</span>}
      </div>
    </div>
  );
}

export function SetField({ id }: { id: string }) {
  const { setId } = useContext(C);
  useEffect(() => {
    setId(id);
  }, [id, setId]);
  return null;
}

export function useUser() {
  const { user, fields, loaded, reload } = useContext(C);
  return { user, fields, loaded, reload };
}

export function useField() {
  const ctx = useContext(C);
  const params = useParams();
  // the field in the address, else the last one opened, else the user's own first field
  const own = ctx.fields.find((f) => ctx.user && f.farmer === ctx.user.name) || ctx.fields[0];
  const id = (typeof params?.id === 'string' ? params.id : '') || ctx.id || own?.id || '';
  const field = ctx.fields.find((f) => f.id === id);
  const fp = (tab = '') => `/field/${id}${tab}`;
  return { id, name: field?.name || FIELD_NAMES[id] || id, field, fp };
}

// "North plot, Menoufia" under the person's name in the header.
export function FieldWho() {
  const { user } = useUser();
  const { field } = useField();
  if (user?.role === 'engineer') return <>{field ? `Engineer · ${field.farmer}` : 'Engineer'}</>;
  return <>{field ? `${field.name}, ${field.governorate || ''}`.replace(/, $/, '') : 'Your fields'}</>;
}

/** The farmer's engineer (from their account); the design's "Eng. Mona Adel" only when signed out. */
export function EngName({ full = false }: { full?: boolean }) {
  const { user } = useUser();
  const n = user?.role === 'farmer' ? user.engineer_name : user?.name;
  if (!n) return <>{user ? (full ? 'No engineer yet' : 'your engineer') : (full ? 'Eng. Mona Adel' : 'Eng. Mona')}</>;
  return <>{'Eng. ' + (full ? n : n.split(' ')[0])}</>;
}

/** Demo content (the design's sample values) is only for the demo farmer Hassan and his two fields. */
export function useDemo() {
  const { user } = useUser();
  const { id } = useField();
  return !!user?.demo || id === 'north-plot' || id === 'south-plot';
}

export function UserName() {
  const { user } = useUser();
  return <>{user?.name || ''}</>;
}

export function UserInitials() {
  const { user } = useUser();
  const n = user?.name || '';
  return <>{n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</>;
}

export async function signOut() {
  await fetch(API + '/auth/signout', { method: 'POST' });
  // a shared phone: forget the results saved for offline use (public/sw.js)
  try { for (const k of await caches.keys()) if (k.startsWith('bezra-')) await caches.delete(k); } catch { /* no cache storage */ }
  window.location.href = '/';
}

// The fifth menu item, only for engineer accounts (Design Decisions §3). Same markup as the V11 Engineer header.
export function EngineerTab() {
  const { user } = useUser();
  const path = usePathname();
  if (!user || user.role === 'farmer') return null;
  const on = path === '/engineer';
  return (
    <a href="/engineer" className="press" aria-current={on ? 'page' : undefined}>
      <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" />
      </svg>
      {'Engineer'}
    </a>
  );
}
