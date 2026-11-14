'use client';
// Simulator: the season week by week. Line = soil water % in the root zone (50% = time to water), bars = waterings,
// orange dots = hot days (>= 32 C). From POST /sim weekly series (NASA POWER weather + FAO-56).
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MON_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

export default function SeasonChart({ weekly }: { weekly: any[] }) {
  const tr = useT();
  const W = 640, H = 170, L = 34, R = 10, T = 12, B = 26;
  const n = weekly.length;
  const x = (i: number) => L + (i / Math.max(1, n - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - v / 100) * (H - T - B);
  const line = weekly.map((w, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(w.soil).toFixed(1)}`).join(' ');
  const area = `${line} L${x(n - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;
  const months = weekly.map((w, i) => ({ i, m: Number(w.date.slice(5, 7)) - 1, d: Number(w.date.slice(8, 10)) })).filter((p) => p.d <= 7);
  return (
    <figure className="col" style={{ gap: '6px', margin: 0 }}>
      <figcaption className="row wrap sp" style={{ gap: '6px 14px' }}>
        <b style={{ fontSize: '14px' }}>{tr('Soil water through the season', 'مية التربة طول الموسم')}</b>
        <span className="row sub" style={{ gap: '12px', fontSize: '12px' }}>
          <span className="row" style={{ gap: '5px' }}><i className="cal-key" style={{ background: 'var(--water)' }} />{tr('Soil water %', 'مية التربة %')}</span>
          <span className="row" style={{ gap: '5px' }}><i className="cal-key" style={{ background: 'var(--sun)' }} />{tr('Hot day', 'يوم حر')}</span>
          <span className="row" style={{ gap: '5px' }}><i className="cal-key" style={{ background: '#9BC0DE', borderRadius: '1px' }} />{tr('Watering', 'رية')}</span>
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={tr('Soil water through the season', 'مية التربة طول الموسم')} style={{ display: 'block' }}>
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={v === 50 ? '#E3B505' : '#E8E8E3'} strokeDasharray={v === 50 ? '4 4' : undefined} />
            <text x={L - 6} y={y(v) + 4} fontSize="10" textAnchor="end" fill="#6A716C">{v}%</text>
          </g>
        ))}
        <text x={W - R} y={y(50) - 4} fontSize="10" textAnchor="end" fill="#7A5A12">{tr('time to water', 'وقت الري')}</text>
        {weekly.map((w, i) => (w.watered ? <rect key={'w' + i} x={x(i) - 2} y={y(100)} width="4" height={y(0) - y(100)} fill="#9BC0DE" opacity=".45" /> : null))}
        <path d={area} fill="var(--water)" opacity=".1" />
        <path d={line} fill="none" stroke="var(--water)" strokeWidth="2.2" strokeLinejoin="round" />
        {weekly.map((w, i) => (w.hot ? <circle key={'h' + i} cx={x(i)} cy={y(100) + 6} r="4" fill="var(--sun)" /> : null))}
        {months.map((p) => <text key={'m' + p.i} x={x(p.i)} y={H - 8} fontSize="10" textAnchor="middle" fill="#6A716C">{tr(MON[p.m], MON_AR[p.m])}</text>)}
      </svg>
    </figure>
  );
}
