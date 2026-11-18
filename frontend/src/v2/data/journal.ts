'use client';
// The farmer's journal (Journal page, Today's last notes): GET /fields/{id}/journal, farmer entries only.
// Delete = DELETE /fields/{id}/log/{entry_id}; Undo posts the removed entry back.
import { API } from '@/lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const d0 = (iso: string) => new Date(iso + 'T12:00:00');
export const dShort = (iso: string) => { const d = d0(iso); return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`; };

export type Entry = { id: string | null; k: string; date: string; d: string; t: string; w: string[]; o: string; src: string; kind: string };

const SQUARE = /^([A-Z]\d{1,2}|whole field)$/i;
const KIND: Record<string, string> = { water: 'water', fertilizer: 'feed', spray: 'spray', observe: 'leaf', check: 'leaf', note: 'other', other: 'other', weeding: 'other', harvest: 'other' };

/** One backend journal event -> what the screens show. A note saved with squares is "<tags>. <note>". */
export function toEntry(e: any): Entry {
  let t = e.title, o = e.detail || '', w: string[] = [], k = KIND[e.kind] || 'other';
  const m = /^([^.]*)\. (.*)$/.exec(o);
  const head = (m ? m[1] : o).split(',').map((x: string) => x.trim()).filter(Boolean);
  if (head.length && head.every((x: string) => SQUARE.test(x) || x === 'leaf' || x === 'pest')) {
    if (head.includes('pest')) k = 'pest';
    w = head.filter((x: string) => SQUARE.test(x)).map((x: string) => (x.toLowerCase() === 'whole field' ? 'Whole field' : x));
    o = m ? m[2] : '';
  }
  if (e.kind === 'observe' && o) { t = o.replace(/^(Leaves|Pest): /, ''); o = ''; }
  if (e.kind === 'water' && /^about \d+/.test(o)) { t = 'Watered, ' + o; o = ''; }
  if (/^From the checklist: /.test(o)) { t = o.replace('From the checklist: ', ''); o = 'Ticked on your to-do'; }
  return { id: e.id || null, k, kind: e.kind, date: e.date, d: dShort(e.date), t, w, o, src: 'You' };
}

export function farmerEntries(journal: any): Entry[] | null {
  if (!journal?.events) return null;
  return journal.events.filter((e: any) => e.source === 'farmer').map(toEntry);
}

export async function deleteEntry(fieldId: string, entryId: string): Promise<any> {
  const r = await fetch(`${API}/fields/${fieldId}/log/${encodeURIComponent(entryId)}`, { method: 'DELETE' });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

/** Undo a delete: post the removed entry back (same day, kind, note, squares, amount). */
export async function restoreEntry(fieldId: string, x: any): Promise<void> {
  const body = x.kind === 'water' ? { kind: 'water', date: x.date, amount: x.m3 ?? null, unit: x.m3 ? 'm3' : null }
    : { kind: x.kind, date: x.date, amount: x.amount ?? null, unit: x.unit ?? null, note: x.note ?? null, tags: x.tags ?? null };
  const r = await fetch(`${API}/fields/${fieldId}/log`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(String(r.status));
}
