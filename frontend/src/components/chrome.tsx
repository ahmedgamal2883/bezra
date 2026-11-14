'use client';
import { T, useT } from '@/lib/i18n';
// Shared page chrome copied 1:1 from the V11 screens (header, footer, mascot), for the screens
// that were added later (sign in, messages, report). Uses the same classes as the design.
import Link from 'next/link';
import DataLive from '@/components/DataLive';
import { LangSwitch } from '@/lib/i18n';
import { useField, FieldWho, UserName, UserInitials, EngineerTab } from '@/lib/field';
import type { ReactNode } from 'react';
import { useMode } from '@/lib/dc';
import AboutLink from './AboutLink';

export const BrandMark = () => (
  <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
    <rect width="34" height="34" rx="11" fill="#17251C" />
    <ellipse cx="17" cy="17" rx="13" ry="4.8" fill="none" stroke="#F29B1E" strokeWidth="1.8" transform="rotate(-24 17 17)" />
    <path d="M17 8c3.4 3.2 4.8 6.4 4.8 9.2a4.8 4.8 0 0 1-9.6 0c0-2.8 1.4-6 4.8-9.2z" fill="#FFFFFF" />
  </svg>
);

// The seed mascot. mood: happy (default), worried, neutral — the faces used across V11.
export function Mascot({ size = 60, mood = 'happy', sway = true }: { size?: number; mood?: 'happy' | 'worried' | 'neutral'; sway?: boolean }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 60 60">
      <g className={sway ? 'sway' : ''}>
        <path d="M30 13C25 4 16 4 12 7c4 6 11 8 18 6z" fill="#5E9A45" />
        <path d="M30 13c4-9 13-11 18-8-3 7-11 10-18 8z" fill="#3E7F35" />
        <path d="M30 13v6" stroke="#3E7F35" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M30 18c11 0 18 10 18 21 0 9-8 16-18 16s-18-7-18-16c0-11 7-21 18-21z" fill="#E9BE62" />
        <path d="M19 30c2-6 6-9 11-10" stroke="#F6DDA0" strokeWidth="3" fill="none" strokeLinecap="round" />
        <g className="blink" style={{ transformOrigin: '30px 31px' }}>
          <circle cx="24.5" cy="31" r="2.6" fill="#3A2A10" />
          <circle cx="35.5" cy="31" r="2.6" fill="#3A2A10" />
        </g>
        {mood === 'happy' ? <path d="M25 37q5 5 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        {mood === 'neutral' ? <path d="M26 38h8" stroke="#3A2A10" strokeWidth="2.2" strokeLinecap="round" /> : null}
        {mood === 'worried' ? (
          <>
            <path d="M22 27l4-1.5M38 27l-4-1.5" stroke="#3A2A10" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M25 39q5-4 10 0" stroke="#3A2A10" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </>
        ) : null}
        <circle cx="20" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
        <circle cx="40" cy="37" r="2.4" fill="#E58E52" opacity=".45" />
      </g>
    </svg>
  );
}

const ICON = {
  field: <path d="M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zM9 4v13.5M15 6.5V20" />,
  sim: <path d="M6 4v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v2M18 4v4M6 20v-2M3 7l3-3 3 3M15 7l3-3 3 3" />,
  ask: <path d="M5 18.5V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8.5zM9 9h6M9 12h3" />,
  profile: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0" />,
};
const NavIcon = ({ d }: { d: ReactNode }) => (
  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

type Tab = 'field' | 'sim' | 'ask' | 'profile' | null;

// The logged-in farmer header, as on every V11 farmer screen.
export function FarmerHeader({ active = null }: { active?: Tab }) {
  const { fp } = useField();
  const { details, setDetails } = useMode();
  const item = (id: Exclude<Tab, null>, href: string, label: string) => (
    <Link href={href} className="press" aria-current={active === id ? 'page' : undefined}>
      <NavIcon d={ICON[id]} />
      {label}
    </Link>
  );
  return (
    <header className="top">
      <Link href={fp("")} className="brand" aria-label="Bezra, my field">
        <BrandMark />
        {'bezra'}
      </Link>
      <nav aria-label="Main" className="nav">
        {item('field', fp(), 'My field')}
        {item('sim', '/sim', 'Simulator')}
        {item('ask', '/ask', 'Ask Bezra')}
        {item('profile', '/profile', 'Profile')}
        <EngineerTab />
      </nav>
      <div className="tools">
        <LangSwitch />
<DataLive />
        <div role="group" aria-label="Detail level" className="seg">
          <button type="button" className={'segb press' + (details ? '' : ' on')} onClick={() => setDetails(false)} aria-pressed={!details}>{'Simple'}</button>
          <button type="button" className={'segb press' + (details ? ' on' : '')} onClick={() => setDetails(true)} aria-pressed={details}>{'Details'}</button>
        </div>
        <Link href={fp("/alerts")} className="ibtn press" aria-label="Alerts, 2 new">
          <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />
          </svg>
          <span className="dot" />
        </Link>
        <span className="who">
          <span className="av" aria-hidden="true"><UserInitials /></span>
          <span>
            <b><UserName /></b>
            <small><FieldWho /></small>
          </span>
        </span>
      </div>
    </header>
  );
}

export function Foot({ note = 'Numbers from NASA and ESA satellite and weather data, and from your field.' }: { note?: string }) {
  return (
    <footer className="foot">
      <span>
        <T en="Bezra helps you think. It doesn&apos;t decide for you." ar="الأداة دي بتساعدك تفكر، مش بتقرر بدالك." />
      </span>
      <span>
        {note}
        <AboutLink />
      </span>
    </footer>
  );
}

export const ArrowUpRight = () => (
  <span className="ar">
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  </span>
);
