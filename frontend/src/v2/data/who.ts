'use client';
// The signed-in person and the field in the top bar of every redesigned page.
import { useField, useUser } from '@/lib/field';

export function useWho() {
  const { user } = useUser();
  const { field, name } = useField();
  const userName = user?.name || '';
  const initials = userName.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return { userName: user?.guest ? 'Guest' : userName, initials: user?.guest ? 'G' : initials, fieldLabel: (field?.name || name || '') + ' ▾', fieldName: field?.name || name || '', guest: !!user?.guest };
}
