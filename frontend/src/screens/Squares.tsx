'use client';
// Rework F: "Are the squares real?" Proof page behind the map legend. Shows the satellite image the squares
// come from (date, satellite, pixel size, how much of the field was clear), every square's greenness
// value laid out like the map, the exact place, and links to open the same day in ESA's / NASA's own viewers.
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FarmerHeader, Foot } from '@/components/chrome';
import { useApi } from '@/lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */
const COLOR: Record<string, string> = { less: '#F29B1E', normal: '#D9DE9C', greener: '#3E7F35', outside: '#FFFFFF' };

export default function SquaresScreen() {
  const p = useParams();
  const id = String(p?.id || '');
  const S = useApi<any>(id ? `/fields/${id}/squares` : null).data;
  const grid = S?.available ? Array.from({ length: S.rows }, (_, r) => S.cells.filter((c: any) => c.r === r).sort((a: any, b: any) => a.c - b.c)) : [];
  return (
    <div className="root">
      <div className="shell">
        <FarmerHeader active="field" />
        <main className="main" style={{ maxWidth: '920px', margin: '0 auto', width: '100%' }}>
          <div className="col" style={{ gap: '10px' }}>
            <Link href={`/field/${id}`} className="btn line sm press" style={{ alignSelf: 'flex-start' }}>
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.5 6-6 6 6 6" /></svg>
              {'Back to my field'}
            </Link>
            <h1 className="h1">{'Are the squares real?'}</h1>
            <p className="body" style={{ fontSize: '18px', maxWidth: '62ch' }}>
              {'Yes. Each square is a 30 × 30 m piece of your field. Its colour comes from the real pixels of a satellite image taken over your field, not from a drawing.'}
            </p>
          </div>

          {!S ? <span className="sub">{'Loading…'}</span> : !S.available ? (
            <section className="card"><b>{'No clear image of your field yet'}</b><p className="sub">{S.reason || 'The satellites pass every few days. When a pass is not cloudy, the squares appear.'}</p></section>
          ) : (
            <div className="col" style={{ gap: '14px' }}>
              <section className="card">
                <h2 className="h2">{'The image'}</h2>
                <div className="grid sofar-grid keep-cols">
                  {[['Date', `${new Date(S.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, `${S.days_ago} days ago`],
                    ['Satellite', S.satellite], ['Pixel size', `${S.pixel_m} m`, `squares of ${S.square_m} m`],
                    ['Field clear of cloud', `${S.field_clear_pct}%`], ['Images this season', String(S.images_this_season)],
                    ['Field median greenness', String(S.median), 'NDVI, 0 = bare soil, 0.8 = dense green']].map(([k, v, sub]) => (
                    <div key={k} className="inset" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2px', padding: '10px 12px' }}>
                      <span className="tl">{k}</span><b style={{ fontSize: '17px', color: 'var(--ink)' }}>{v}</b>{sub ? <span className="tl">{sub}</span> : null}
                    </div>
                  ))}
                </div>
              </section>

              <section className="card">
                <h2 className="h2">{'Every square, as on your map'}</h2>
                <p className="sub">{'North is up. The number is the greenness (NDVI) of that square on this image. The colour compares it with the middle value of your whole field.'}</p>
                <div className="grid keep-cols" style={{ gridTemplateColumns: `repeat(${S.cols}, minmax(0, 72px))`, gap: '4px', justifyContent: 'center' }}>
                  {grid.flat().map((c: any) => (
                    <div key={`${c.r}-${c.c}`} style={{ aspectRatio: '1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px',
                      background: c.class ? COLOR[c.class] : '#ECECE8', color: c.class === 'greener' ? '#fff' : '#141A16', border: c.class === 'outside' ? '1.5px dashed #CFCFC9' : 0, boxSizing: 'border-box' }}>{c.ndvi == null ? '–' : c.ndvi.toFixed(2)}</div>
                  ))}
                </div>
                <span className="row wrap" style={{ gap: '10px', justifyContent: 'center' }}>
                  {[['less', 'Less green (0.05 below the middle)'], ['normal', 'Normal'], ['greener', 'Greener (0.05 above)'], ...(S.cells.some((c: any) => c.class === 'outside') ? [['outside', 'Outside the field you drew (not counted)']] : [])].map(([k, l]) => (
                    <span key={k} className="row tl" style={{ gap: '6px' }}><i style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLOR[k], display: 'inline-block' }} />{l}</span>
                  ))}
                </span>
              </section>

              <section className="card">
                <h2 className="h2">{'Check it yourself'}</h2>
                <p className="sub">{`Your squares cover longitude ${S.bounds_lonlat[0]} to ${S.bounds_lonlat[2]} and latitude ${S.bounds_lonlat[1]} to ${S.bounds_lonlat[3]}. Open the same day in the space agencies' own viewers:`}</p>
                <div className="row wrap" style={{ gap: '8px' }}>
                  {S.links.map((l: any) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="btn soft press">{l.label}</a>)}
                </div>
                <span className="tl">{`Source: ${S.source}.`}</span>
              </section>
            </div>
          )}
          <Foot note="Greenness from NASA HLS and ESA Sentinel-2, read square by square by Bezra." />
        </main>
      </div>
    </div>
  );
}
