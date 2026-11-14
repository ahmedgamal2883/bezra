'use client';
// Rework B: the page behind every card on My field -> Today (weather, warning or next action).
// Answers the farmer's three questions in order: what is it, what do I get (harvest / water / effort),
// and what do I do (how to do it, how to check it). Data: GET /fields/{id}/today (same as the board).
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FarmerHeader, Foot } from '@/components/chrome';
import { useToday } from '@/components/TodayBoard';
import { logAction } from '@/components/PlanToday';
import { PV } from '@/lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LVC: Record<string, string> = { Low: 'lv lv-low', Medium: 'lv lv-med', High: 'lv lv-high' };
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const LOG: Record<string, [string, string]> = { water: ['water', 'I watered'], heat: ['water', 'I watered'], fertilizer: ['fertilizer', 'I put it'],
  weeding: ['weeding', 'I weeded'], rust: ['check', 'I checked the leaves'] };

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card rise" style={{ '--d': '3' } as React.CSSProperties}>
      <h2 className="h2">{title}</h2>
      {children}
    </section>
  );
}

export default function InsightScreen() {
  const p = useParams();
  const id = String(p?.id || '');
  const key = decodeURIComponent(String(p?.key || ''));
  const { data: D, reload } = useToday(id);
  const [saved, setSaved] = useState('');
  const all = D ? [...D.weather.map((x: any) => ({ ...x, group: 'weather' })), ...D.warnings.map((x: any) => ({ ...x, group: 'warning' })),
    ...D.plan.map((x: any) => ({ ...x, group: 'plan' }))] : [];
  const it = all.find((x: any) => x.id === key);
  const det = it?.detail || {};
  const log = it && LOG[it.kind];
  const pv = it?.provenance ? PV[it.provenance] : PV.estimated;

  return (
    <div className="root">
      <div className="shell">
        <FarmerHeader active="field" />
        <main className="main" style={{ maxWidth: '920px', margin: '0 auto', width: '100%' }}>
          <div className="col rise" style={{ '--d': '0', gap: '10px' } as React.CSSProperties}>
            <Link href={`/field/${id}`} className="btn line sm press" style={{ alignSelf: 'flex-start' }}>
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.5 6-6 6 6 6" /></svg>
              {'Back to my field'}
            </Link>
            {!D ? <span className="sub">{'Loading…'}</span> : !it ? (
              <section className="card"><h1 className="h2">{'This card is no longer on your field'}</h1>
                <p className="sub">{'It may be done or the weather changed. Go back to see what is new today.'}</p></section>
            ) : (
              <>
                <div className="row wrap" style={{ gap: '8px', alignItems: 'center' }}>
                  {it.level ? <span className={LVC[it.level]}><i />{it.level}</span> : null}
                  {it.when ? <span className="pill">{it.when}</span> : null}
                  {it.status === 'Late' ? <span className="lv lv-high"><i />{'Late'}</span> : null}
                </div>
                <h1 className="h1" style={{ textWrap: 'balance' } as React.CSSProperties}>
                  {it.group === 'weather' ? `${it.label}: ${it.value}${it.unit === '%' ? '%' : ' ' + it.unit}` : (det.title || it.title)}
                </h1>
                <p className="body" style={{ fontSize: '18px', maxWidth: '62ch' }}>{det.what || it.line || it.reason}</p>
              </>
            )}
          </div>

          {it ? (
            <div className="col" style={{ gap: '14px' }}>
              {det.get && Object.keys(det.get).length ? (
                <Block title="What you get">
                  <div className="grid insight-get">
                    {det.get.harvest ? <div className="inset get"><span>{'Harvest'}</span><b>{det.get.harvest}</b></div> : null}
                    {det.get.water ? <div className="inset get"><span>{'Water'}</span><b>{det.get.water}</b></div> : null}
                    {det.get.benefit && !det.get.water ? <div className="inset get"><span>{'Why it matters'}</span><b>{det.get.benefit}</b></div> : null}
                    {det.get.effort ? <div className="inset get"><span>{'Effort'}</span><b>{det.get.effort}</b></div> : null}
                  </div>
                  {it.amount ? <p className="sub">{`Amount: ${it.amount}.`}</p> : null}
                </Block>
              ) : null}
              {it.benefit ? <Block title="What you get"><p className="body">{it.benefit}</p></Block> : null}

              {it.why && it.group === 'plan' && it.why !== det.what ? <Block title="Why"><p className="body">{it.why}</p></Block> : null}
              {det.why ? <Block title="Why"><p className="body">{det.why}</p></Block> : null}
              {it.group === 'warning' ? <Block title="Why"><p className="body">{it.reason}</p></Block> : null}

              {det.how_to_do ? <Block title="How to do it"><p className="body">{det.how_to_do}</p></Block> : null}
              {(det.how_to_check || it.how_to_check) ? (
                <Block title="How to check it yourself">
                  <p className="body">{det.how_to_check || it.how_to_check}</p>
                  {it.photo || it.kind === 'rust' ? <Link href={`/field/${id}/diagnose`} className="btn press" style={{ alignSelf: 'flex-start' }}>{'Take a photo'}</Link> : null}
                </Block>
              ) : null}

              {det.days ? (
                <Block title="Next 7 days">
                  <div className="grid insight-days">
                    {det.days.map((d: any) => (
                      <div key={d.date} className="inset" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                        <span className="tl">{new Date(d.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</span>
                        <b style={{ fontSize: '18px', color: d.tmax >= 32 ? '#B4441F' : 'var(--ink)' }}>{d.tmax}°</b>
                        <span className="tl">{`${d.tmin}° at night`}</span>
                      </div>
                    ))}
                  </div>
                </Block>
              ) : null}

              {log && it.group === 'plan' ? (
                <section className="card rise" style={{ '--d': '4', flexDirection: 'row', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } as React.CSSProperties}>
                  <span className="sub" style={{ flex: '1 1 220px' }}>{saved || 'Done it? One tap keeps your plan and water balance true.'}</span>
                  {!saved ? <button type="button" className="btn press" onClick={async () => { await logAction(id, log[0], iso(new Date())); setSaved('Saved. Thanks.'); reload(); }}>{log[1]}</button> : null}
                </section>
              ) : null}

              <span className="row wrap" style={{ gap: '6px', alignItems: 'center' }}>
                <span className={pv.cls}>{pv.label}</span>
                <span className="tl">{`Source: ${it.source}${it.as_of ? `, ${it.as_of}` : ''}`}</span>
              </span>
            </div>
          ) : null}
          <Foot />
        </main>
      </div>
    </div>
  );
}
