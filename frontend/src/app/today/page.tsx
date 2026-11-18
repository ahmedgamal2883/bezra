'use client';
// /today: the signed-in person's own field (or the last one opened). Engineers go to their workspace.
// ?to=season/try opens that page of the field instead (used by old links such as /sim).
import { useEffect } from 'react';
import { useField, useUser } from '@/lib/field';

export default function Page() {
  const { user, fields, loaded } = useUser();
  const { id } = useField();
  useEffect(() => {
    if (!loaded) return;
    if (!user) { window.location.replace('/signin?next=/today'); return; }
    if (user.role === 'engineer' && !fields.some((f) => f.farmer === user.name)) { window.location.replace('/engineer'); return; }
    const to = new URLSearchParams(window.location.search).get('to') || 'today';
    const page = /^[a-z-]+(\/[a-z-]+)?$/.test(to) ? to : 'today';
    window.location.replace(id ? `/field/${id}/${page}` : '/fields/new');
  }, [loaded, user, fields, id]);
  return <div className="v2 root" aria-busy="true" />;
}
