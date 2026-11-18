'use client';
// Ask Bezra (V18): the real conversation (POST /chat through useAskChat: Gemini, with the field's data as tools;
// it never gives spray doses) + "what Bezra knows right now" from the same summary, tasks and journal as Today.
import { useState } from 'react';
import { useApi } from '@/lib/api';
import { useField, useUser } from '@/lib/field';
import { useAskChat } from '@/components/AskLive';
import { farmerEntries } from './journal';
import { shortDate } from './today';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useAskData() {
  const { id } = useField();
  const { user } = useUser();
  const st = useApi<any>('/chat/status').data;
  const sm = useApi<any>(id ? `/fields/${id}/summary` : null).data;
  const tk = useApi<any>(id ? `/fields/${id}/tasks` : null).data;
  const jn = useApi<any>(id ? `/fields/${id}/journal` : null).data;
  const ready = !!st?.ready;
  const { msgs, busy, send } = useAskChat(id, ready);
  const [draft, setDraft] = useState('');

  const today = sm?.today;
  const due = tk && today ? tk.tasks.filter((t: any) => !t.answer && t.status !== 'done' && t.date <= today && t.category !== 'milestone') : [];
  const first = (user?.name || '').split(' ')[0];
  const h = new Date().getHours();
  const hello = `Good ${h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'}${first ? ', ' + first : ''}.`;
  const greeting = sm ? `${hello} ${due.length ? 'Today: ' + due.slice(0, 3).map((t: any) => t.title.toLowerCase()).join(', ') + '.' : 'Nothing is due on your field today.'} Ask me anything about your field.` : `${hello} Ask me anything about your field.`;
  const last = (farmerEntries(jn) || [])[0];
  const ctx = sm ? [
    ['Field', `${sm.field.name} · ${sm.field.area.value} feddan`],
    ['Crop', `${sm.field.crop}, ${sm.field.variety}, day ${sm.day_n}`],
    ['Soil water', sm.soil_water ? `${sm.soil_water.value}% · refill ${sm.soil_water.refill}%` : '—'],
    ['Next water turn', sm.action?.next_turn ? shortDate(sm.action.next_turn) : '—'],
    ['Rust risk', sm.risks?.rust?.level || '—'],
    ['Last journal note', last ? `${last.t}${last.w.length ? ', ' + last.w.join(', ') : ''} · ${last.d}` : 'None yet'],
    ['To do today', due.length ? `${due.length} ${due.length === 1 ? 'task' : 'tasks'}` : 'Nothing due'],
  ] : null;
  const lastA = [...msgs].reverse().find((m) => m.role === 'assistant');
  return {
    greeting, msgs, busy, draft, setDraft, ctx, lastAnswer: lastA?.text || '',
    send: (q: string) => { setDraft(''); send(q); },
    submit: () => { const q = draft.trim(); if (q) { setDraft(''); send(q); } },
    retry: () => { const q = [...msgs].reverse().find((m) => m.role === 'user')?.text; if (q) send(q); },
    sugs: ['Can I skip my next water turn?', 'How much fungicide should I spray?', 'Will it rain this week?'],
  };
}
