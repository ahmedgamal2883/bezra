'use client';
// /today: the signed-in person's own field (or the last one opened). Engineers go to their workspace.
import { useEffect } from 'react';
import { useField, useUser } from '@/lib/field';

export default function Page() {
  const { user, fields, loaded } = useUser();
  const { id } = useField();
  useEffect(() => {
    if (!loaded) return;
    if (!user) { window.location.replace('/signin?next=/today'); return; }
    if (user.role === 'engineer' && !fields.some((f) => f.farmer === user.name)) { window.location.replace('/engineer'); return; }
    window.location.replace(id ? `/field/${id}/today` : '/fields/new');
  }, [loaded, user, fields, id]);
  return <div className="v2 root" aria-busy="true" />;
}
