'use client';
// Journal page data: the farmer's entries + delete / undo / CSV export (no server endpoint needed for the CSV).
import { useCallback, useState } from 'react';
import { useApi } from '@/lib/api';
import { useField } from '@/lib/field';
import { deleteEntry, farmerEntries, restoreEntry, type Entry } from './journal';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useJournalData() {
  const { id, field } = useField();
  const [ver, setVer] = useState(0);
  const jn = useApi<any>(id ? `/fields/${id}/journal${ver ? `?v=${ver}` : ''}` : null);
  const reload = useCallback(() => setVer((v) => v + 1), []);
  const entries = farmerEntries(jn.data);
  const act = {
    del: async (entryId: string) => { const r = await deleteEntry(id, entryId); return r; },
    restore: async (x: any) => { await restoreEntry(id, x); reload(); },
    exportCsv: (rows: Entry[]) => {
      const q = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const lines = [['date', 'what', 'squares', 'note', 'source'].join(','), ...rows.map((e) => [e.date, q(e.t), q(e.w.join(' ')), q(e.o), q(e.src)].join(','))];
      const url = URL.createObjectURL(new Blob([lines.join('\n') + '\n'], { type: 'text/csv;charset=utf-8' }));
      const a = document.createElement('a');
      a.href = url; a.download = `bezra-journal-${(field?.name || id).replace(/\W+/g, '-').toLowerCase()}.csv`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    },
  };
  return { entries, act };
}
