'use client';
// Who is signed in, which fields they may see, and which field they are looking at.
// Field pages (/field/[id]/...) set the current field; every screen builds its links with fp().
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { API } from './api';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldCard = { id: string; num?: string; name: string; crop: string; area_feddan: number; farmer: string; village?: string; governorate?: string; lat: number; lon: number };
export type User = { id: number; email: string; name: string; role: 'farmer' | 'engineer' | 'admin'; engineer_name?: string | null };

type Ctx = { user: User | null; fields: FieldCard[]; loaded: boolean; id: string; setId: (id: string) => void; reload: () => void };
const C = createContext<Ctx>({ user: null, fields: [], loaded: false, id: '', setId: () => {}, reload: () => {} });

// Kept for older imports: names of known fields by id (filled once fields load).
export const FIELD_NAMES: Record<string, string> = {};

export function FieldProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [fields, setFields] = useState<FieldCard[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [id, setId] = useState('');
  const path = usePathname();
  const load = useCallback(async () => {
    try {
      const me = await fetch(API + '/auth/me');
      if (!me.ok) { setUser(null); setFields([]); return; }
      setUser(await me.json());
      const fl: FieldCard[] = await (await fetch(API + '/fields')).json();
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
  return <C.Provider value={{ user, fields, loaded, id, setId, reload: load }}>{children}</C.Provider>;
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
  const id = (typeof params?.id === 'string' ? params.id : '') || ctx.id || own?.id || 'north-plot';
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
  if (!n) return <>{full ? 'Eng. Mona Adel' : (user ? 'your engineer' : 'Eng. Mona')}</>;
  return <>{'Eng. ' + (full ? n : n.split(' ')[0])}</>;
}

export function UserName() {
  const { user } = useUser();
  return <>{user?.name || 'Hassan Farouk'}</>;
}

export function UserInitials() {
  const { user } = useUser();
  const n = user?.name || 'Hassan Farouk';
  return <>{n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}</>;
}

export async function signOut() {
  await fetch(API + '/auth/signout', { method: 'POST' });
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
