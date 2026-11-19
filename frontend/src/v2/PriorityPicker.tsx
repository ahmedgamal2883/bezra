'use client';
// "What matters most to you?" — the same choice on Today and Soil. Saved on the field (POST /fields/{id}/priority):
// it orders the rotation cards, the day's tasks and the field alerts. Pick, then Confirm.
import { useEffect, useState } from 'react';
import { API, useApi } from '@/lib/api';

export const PRIORITY_CHOICES: [string, string][] = [['soil', 'Stronger soil'], ['water', 'Less water'], ['money', 'More harvest'], ['fodder', 'Fodder']];

export function usePriority(id: string | null | undefined, ver = 0) {
  const fd = useApi<any>(id ? `/fields/${id}?p=${ver}` : null).data; // eslint-disable-line @typescript-eslint/no-explicit-any
  return (fd?.priority as string) || 'soil';
}

export default function PriorityPicker({ id, onSaved }: { id: string | null | undefined; onSaved?: (p: string) => void }) {
  const [ver, setVer] = useState(0);
  const saved = usePriority(id, ver);
  const [pick, setPick] = useState(saved);
  const [busy, setBusy] = useState(false);
  useEffect(() => setPick(saved), [saved]);
  const confirm = async () => {
    if (!id) return;
    setBusy(true);
    try {
      const r = await fetch(`${API}/fields/${id}/priority`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ priority: pick }) });
      if (r.ok) { setVer((v) => v + 1); onSaved?.(pick); }
    } finally { setBusy(false); }
  };
  return (
    <div className="col" style={{ gap: '8px', margin: '12px 0' }}>
      <span className="meta" style={{ fontWeight: 600 }}>{'What matters most to you?'}</span>
      <div className="row" role="radiogroup" style={{ gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {PRIORITY_CHOICES.map(([k, t]) => (
          <button key={k} type="button" role="radio" aria-checked={pick === k} className={'btn press' + (pick === k ? '' : ' soft')}
            style={{ height: '40px', borderRadius: '20px', padding: '0 16px', fontSize: '14px' }} onClick={() => setPick(k)}>{t}</button>
        ))}
        {pick !== saved ? (
          <button type="button" className="btn sun press" disabled={busy} style={{ height: '40px', borderRadius: '20px', padding: '0 18px', fontSize: '14px' }} onClick={confirm}>
            {busy ? 'Saving…' : 'Confirm'}
          </button>
        ) : null}
      </div>
      <span className="meta" style={{ fontSize: '13px' }}>{'Bezra orders your tasks, warnings and rotations by this. Urgent warnings always come first.'}</span>
    </div>
  );
}

export const PRIORITY_LABEL: Record<string, string> = Object.fromEntries(PRIORITY_CHOICES);

// One line under each task or risk: how it serves the farmer's priority, or why it is still needed.
// "Less water" never means skipping water the crop needs: the water plan (FAO-56) already gives only what the soil
// is missing, so the line says that instead of dropping turns.
const FOR: Record<string, Record<string, string>> = {
  irrigation: {
    water: 'Less water: Bezra gives only what the soil is missing, never less than the wheat needs.',
    money: 'More harvest: a thirsty crop loses grain.',
    soil: 'Stronger soil: watering by need, not by habit, keeps the soil from waterlogging and salt.',
  },
  fertilizer: {
    soil: 'Stronger soil: the right amount feeds the crop without tiring the soil.',
    fodder: 'Fodder: a well-fed field gives more straw for your animals.',
    money: 'More harvest: the crop needs it to fill the grain.',
  },
  inspection: { money: 'More harvest: a problem found early costs less grain.' },
  spray: { money: 'More harvest: weeds take water and food from the wheat.', water: 'Less water: weeds drink water meant for the wheat.' },
  milestone: { money: 'More harvest: the right timing gives the full crop.' },
  straw: { soil: 'Stronger soil: straw left in the soil feeds it.', fodder: 'Fodder: what you do not plough in can feed your animals; never burn it.' },
  heat: { money: 'More harvest: heat at heading costs grain.', water: 'Less water: one turn before the heat saves the crop from losing more later.' },
  rust: { money: 'More harvest: rust caught early is cheaper to stop.' },
  water: { water: 'Less water: Bezra waters by need, never less than the wheat needs.', money: 'More harvest: a thirsty crop loses grain.' },
};
const ALSO: Record<string, string> = {
  irrigation: 'Still needed: without it the crop goes thirsty.', fertilizer: 'Still needed: the crop cannot grow without it.',
  inspection: 'Still needed: a problem found early is easier to fix.', spray: 'Still needed: weeds take what the wheat needs.',
  milestone: 'Still needed: the season plan follows it.', straw: 'Still needed: burning straw tires the soil.', heat: 'Still needed: heat can cost grain.',
  rust: 'Still needed: rust spreads fast in this weather.', water: 'Still needed: a thirsty crop loses grain.',
};
export function priorityLine(kind: string, prio: string): string {
  return FOR[kind]?.[prio] || ALSO[kind] || '';
}

// Same table as backend services/priority.py: which priorities a task serves, best first.
const SERVES: Record<string, string[]> = {
  irrigation: ['water'], water: ['water'], fertilizer: ['soil', 'fodder'], inspection: ['money'], spray: ['money'],
  rust: ['money'], heat: ['money', 'water'], milestone: ['fodder', 'money'], straw: ['soil', 'fodder'],
};
export function priorityRank(kind: string, prio: string): number {
  const s = SERVES[kind] || [];
  const i = s.indexOf(prio);
  return i < 0 ? 2 : i;
}
