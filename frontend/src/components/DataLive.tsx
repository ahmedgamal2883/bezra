'use client';
// "Is the data real and fresh?" A small pill in every screen's header (V11 pill + level dot).
// Green: the core NASA sources answered in the last check. Orange: some sources are down (screens use
// the last saved data). Tap: About the data -> Live API status.
import Link from 'next/link';
import { useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CORE = ['NASA POWER daily', 'Open-Meteo forecast', 'NASA HLS v2.0', 'Sentinel-2 L2A (ESA)'];

export default function DataLive() {
  const tr = useT();
  const s = useApi<any>('/status/apis').data;
  if (!s) return null;
  const core = s.apis.filter((a: any) => CORE.includes(a.name));
  const ok = core.every((a: any) => a.status === 'working');
  const t = new Date(s.checked_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const title = `${s.working} of ${s.using} data sources working, checked ${t}. Tap for details.`;
  return (
    <Link href="/about#live-api" className={'press ' + (ok ? 'lv lv-low' : 'lv lv-med')} title={title} aria-label={title}
      style={{ height: '34px', padding: '0 12px', whiteSpace: 'nowrap', textDecoration: 'none' }}>
      <i />{ok ? tr('Live NASA data', 'بيانات ناسا مباشرة') : tr('Some data delayed', 'بعض البيانات متأخرة')}
    </Link>
  );
}
