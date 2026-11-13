'use client';
// Which field the farmer is looking at. Field pages (/field/[id]/...) set it; every screen builds
// its links with fp() so tabs and buttons stay on the same field.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { DEMO_FIELD_ID } from './routes';

export const FIELD_NAMES: Record<string, string> = { 'north-plot': 'North plot', 'south-plot': 'South plot' };

const Ctx = createContext<{ id: string; setId: (id: string) => void }>({ id: DEMO_FIELD_ID, setId: () => {} });

export function FieldProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(DEMO_FIELD_ID);
  return <Ctx.Provider value={{ id, setId }}>{children}</Ctx.Provider>;
}

export function SetField({ id }: { id: string }) {
  const { setId } = useContext(Ctx);
  useEffect(() => setId(id), [id, setId]);
  return null;
}

export function useField() {
  const ctx = useContext(Ctx);
  const params = useParams();
  const id = (typeof params?.id === 'string' && FIELD_NAMES[params.id] ? params.id : null) || ctx.id;
  const fp = (tab = '') => `/field/${id}${tab}`;
  return { id, name: FIELD_NAMES[id] || id, fp };
}

// "North plot, Menoufia" under the farmer's name in the header.
export function FieldWho() {
  const { name } = useField();
  return <>{`${name}, Menoufia`}</>;
}
