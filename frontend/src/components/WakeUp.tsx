'use client';
// Cold start: the backend runs on Render's free plan, which sleeps after ~15 minutes without visits and takes
// about a minute to wake. As soon as any page opens, ping /health so the backend starts waking while the
// visitor reads. If it has not answered in 2.5 s, show a small honest banner with a seconds counter instead of
// leaving screens silently loading; when it answers, say "ready" for a moment and go away.
// An external pinger (UptimeRobot / cron-job.org on /health every 10 min) keeps it awake most of the time;
// this is the fallback for when it was asleep anyway.
import { useEffect, useState } from 'react';
import { API } from '@/lib/api';
import { useT } from '@/lib/i18n';

type Phase = 'idle' | 'waking' | 'ready' | 'slow';
type S = { phase: Phase; t0: number };

// The ping loop lives outside React: once per tab, not restarted by client-side navigation or a re-mount.
let s: S = { phase: 'idle', t0: 0 };
let started = false;
const subs = new Set<(v: S) => void>();
const set = (phase: Phase) => { s = { ...s, phase }; subs.forEach((f) => f(s)); };

function start() {
  if (started) return;
  started = true;
  s = { phase: 'idle', t0: Date.now() };
  let done = false;
  setTimeout(() => { if (!done) set('waking'); }, 2500);
  const ping = () =>
    fetch(API + '/health', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        done = true;
        if (s.phase === 'waking') { set('ready'); setTimeout(() => set('idle'), 2200); } else set('idle');
      })
      .catch(() => {
        // Render answers 502/504 (or the proxy gives up) while it boots: try again for about 2 minutes.
        if (Date.now() - s.t0 < 120000) setTimeout(ping, 4000);
        else { done = true; set('slow'); setTimeout(() => set('idle'), 8000); }
      });
  ping();
}

export default function WakeUp() {
  const tr = useT();
  const [st, setSt] = useState<S>(s);
  const [now, setNow] = useState(0);

  useEffect(() => {
    subs.add(setSt);
    start();
    setSt(s);
    return () => { subs.delete(setSt); };
  }, []);

  useEffect(() => {
    if (st.phase !== 'waking') return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [st.phase]);

  if (st.phase === 'idle') return null;
  const secs = Math.max(0, Math.round((now - st.t0) / 1000));
  const text =
    st.phase === 'waking'
      ? tr(`Waking up the live data… ${secs}s (up to a minute after a quiet spell)`, `بنصحّي الداتا الحية… ${secs} ث (ممكن تاخد دقيقة بعد فترة هدوء)`)
      : st.phase === 'ready'
        ? tr('Live data ready', 'الداتا الحية جاهزة')
        : tr('Live data is slow to answer. Screens will fill in when it does.', 'الداتا الحية بطيئة في الرد. الشاشات هتتملا أول ما ترد.');
  return (
    <div className={'wake ' + st.phase} role="status" aria-live="polite">
      <i aria-hidden="true" />{text}
    </div>
  );
}
