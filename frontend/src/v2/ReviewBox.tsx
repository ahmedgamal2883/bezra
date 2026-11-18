'use client';
// "Check this with my engineer" (Nov 2026, not in the design): the farmer sends a question with the field's numbers;
// it appears in the engineer's workspace, and the engineer's answer comes back here. An engineer opening the same
// field answers from here too. No engineer yet: the farmer adds one by mobile number (EngineerLink).
import { useState } from 'react';
import EngineerLink from '@/v2/EngineerLink';

/* eslint-disable @typescript-eslint/no-explicit-any */
const TOPICS: [string, string][] = [['field', 'The whole field'], ['fertilizer', 'Fertilizer'], ['water', 'Water'], ['problem', 'A problem I see']];

export default function ReviewBox({ v }: { v: any }) {
  const [note, setNote] = useState('');
  const [topic, setTopic] = useState('field');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [reply, setReply] = useState<Record<string, string>>({});
  if (v?.guest) return <p className="meta">Create an account to send your field to an engineer.</p>;
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try { await v.ask(note, topic); setNote(''); setMsg('Sent. Your engineer sees it in their Bezra workspace.'); }
    catch (x: any) { setMsg(x.message); } finally { setBusy(false); }
  };
  return (
    <div className="col" style={{ gap: '16px' }}>
      {v?.isEngineer ? null : !v?.engineer ? (
        <div className="col" style={{ gap: '8px' }}>
          <p className="txt">Add your engineer, then send them this sheet with your question.</p>
          <EngineerLink compact />
        </div>
      ) : (
        <form onSubmit={send} className="col" style={{ gap: '10px' }}>
          <span className="meta">{`To ${v.engineer}. Bezra sends the numbers on this page with your question.`}</span>
          <div className="row chipset" style={{ gap: '8px', flexWrap: 'wrap' }}>
            {TOPICS.map(([k, t]) => <button type="button" key={k} className={'opt press' + (topic === k ? ' on' : '')} onClick={() => setTopic(k)} style={{ height: '40px' }}>{t}</button>)}
          </div>
          <textarea className="inp" value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={600}
            placeholder="Your question, for example: Is this the right amount of urea for my field?" style={{ minHeight: '90px', padding: '12px 16px', fontSize: '16px', resize: 'vertical' }} />
          <span className="row" style={{ gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="submit" className="btn press" disabled={busy || !note.trim()}>{busy ? 'Sending…' : 'Send to my engineer'}</button>
            {msg ? <span className="meta" role="status">{msg}</span> : null}
          </span>
        </form>
      )}
      {(v?.reviews || []).length ? (
        <div className="col" style={{ gap: '0' }}>
          {v.reviews.map((r: any) => (
            <div key={r.id} className="col" style={{ gap: '6px', padding: '14px 0', borderTop: '1px solid var(--line)' }}>
              <span className="row sp" style={{ gap: '12px' }}>
                <b style={{ fontWeight: 600 }}>{r.note || 'Please check my field'}</b>
                <span className={'pq ' + (r.status === 'answered' ? 'farm' : 'est')}>{r.status === 'answered' ? 'Answered' : 'Waiting for the engineer'}</span>
              </span>
              <span className="meta">{`${r.when} · ${r.from}`}</span>
              {r.reply ? <p className="txt" style={{ background: 'var(--card, #fff)', padding: '10px 14px', borderRadius: '12px' }}>{`${r.by || 'Engineer'}: ${r.reply}`}</p> : null}
              {v?.isEngineer && r.status !== 'answered' ? (
                <span className="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
                  <input className="inp" value={reply[r.id] || ''} onChange={(e) => setReply({ ...reply, [r.id]: e.target.value })} placeholder="Your answer"
                    style={{ height: '44px', fontSize: '16px', flex: '1 1 220px' }} />
                  <button type="button" className="btn sm press" disabled={!(reply[r.id] || '').trim()} onClick={() => v.answer(r.id, reply[r.id])}>Answer</button>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
