'use client';
// Profile (V18): who you are, your fields (open / delete), your engineer, language, the tour again, your data as
// CSV, sign out. GET /auth/me and /fields; DELETE /fields/{id}; POST /auth/signout.
import { API, useApi } from '@/lib/api';
import { useLang } from '@/lib/i18n';
import { useField, useUser } from '@/lib/field';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useProfile() {
  const { user, fields, reload } = useUser();
  const { id } = useField();
  const { lang, setLang } = useLang();
  const me = useApi<any>('/auth/me').data;
  const mine = fields.filter((f) => user && f.farmer === user.name);
  const first = mine[0] || fields[0];
  const place = first ? [first.village, first.governorate].filter(Boolean).join(', ') : '';
  const role = user?.role === 'engineer' ? 'Engineer' : 'Farmer';
  return {
    sub: [role, place].filter(Boolean).join(' · '),
    fields: mine.map((f) => ({ id: f.id, name: f.name, line: `${f.area_feddan} feddan · ${String(f.crop).toLowerCase()}`, current: f.id === id, href: `/field/${f.id}/today` })),
    engineer: me?.engineer_name || null,
    lang, setLang,
    demo: !!user?.demo_account,
    act: {
      del: async (fid: string) => {
        const r = await fetch(`${API}/fields/${fid}`, { method: 'DELETE' });
        if (!r.ok) throw new Error((await r.json().catch(() => ({})))?.detail || String(r.status));
        reload();
      },
      signOut: async () => { await fetch(`${API}/auth/signout`, { method: 'POST' }).catch(() => {}); window.location.href = '/'; },
      exportCsv: async () => {
        const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const lines = ['field,date,source,kind,title,detail'];
        for (const f of mine) {
          const j = await fetch(`${API}/fields/${f.id}/journal`).then((r) => (r.ok ? r.json() : null)).catch(() => null);
          for (const e of j?.events || []) lines.push([q(f.name), e.date, e.source, e.kind, q(e.title), q(e.detail)].join(','));
        }
        const url = URL.createObjectURL(new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' }));
        const a = document.createElement('a'); a.href = url; a.download = 'bezra-my-data.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      },
    },
  };
}
