'use client';
// My field: "Show details". Every raw number Bezra read for this field, as plain tables: NASA POWER daily weather,
// the Open-Meteo forecast, every 30 m square of the newest satellite pass, the MODIS normal, SMAP, ECOSTRESS,
// elevation and soil. Proof that the cards above run on real data. GET /fields/{id}/raw (loaded only when opened).
import { useState } from 'react';
import { useApi } from '@/lib/api';
import { useT } from '@/lib/i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const f = (v: any, unit = '') => (v == null ? '—' : `${v}${unit}`);

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="raw-scroll">
      <table className="raw">
        <thead><tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Block({ title, src, children }: { title: string; src?: string; children: React.ReactNode }) {
  return (
    <div className="col" style={{ gap: '6px' }}>
      <div className="row sp wrap" style={{ gap: '6px' }}>
        <b style={{ fontSize: '14px' }}>{title}</b>
        {src ? <span className="sub" style={{ fontSize: '12px' }}>{src}</span> : null}
      </div>
      {children}
    </div>
  );
}

export default function RawData({ id }: { id: string }) {
  const tr = useT();
  const [open, setOpen] = useState(false);
  const R = useApi<any>(open && id ? `/fields/${id}/raw` : null).data;
  return (
    <section className="card rise" style={{ '--d': '4' } as React.CSSProperties} aria-label={tr('Show details', 'اعرض التفاصيل')}>
      <div className="row sp wrap" style={{ gap: '8px' }}>
        <div className="col" style={{ gap: '2px' }}>
          <h2 className="h2">{tr('The raw data behind these cards', 'الداتا الخام اللي ورا الكروت دي')}</h2>
          <span className="sub">{tr('Every number Bezra read for this field: NASA, ESA and the forecast, as they came.', 'كل رقم بذرة قرته للأرض دي: ناسا، الوكالة الأوروبية، والتوقعات، زي ما وصلت.')}</span>
        </div>
        <button type="button" className="btn soft sm press" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? tr('Hide details', 'اخفي التفاصيل') : tr('Show details', 'اعرض التفاصيل')}
        </button>
      </div>
      {open && !R ? <span className="sub">{tr('Reading the numbers…', 'بنقرا الأرقام…')}</span> : null}
      {open && R ? (
        <div className="col" style={{ gap: '18px' }}>
          {R.weather?.rows ? (
            <Block title={tr('Weather on your field, day by day', 'الجو على أرضك، يوم بيوم')}
              src={`NASA POWER ${tr('to', 'لحد')} ${R.weather.power_last} · Open-Meteo ${tr('after', 'بعد كده')} · ${R.weather.days_stored} ${tr('days stored since', 'يوم متخزنين من')} ${R.weather.years?.[0]}`}>
              <Table head={[tr('Date', 'التاريخ'), tr('Max °C', 'العظمى °م'), tr('Min °C', 'الصغرى °م'), tr('Mean °C', 'المتوسط °م'), tr('Humidity %', 'الرطوبة %'),
                tr('Dew point °C', 'نقطة الندى °م'), tr('Rain mm', 'المطر مم'), tr('ET₀ mm', 'البخر-نتح مم'), tr('Wind m/s', 'الرياح م/ث'), tr('Sun MJ/m²', 'الشمس MJ/م²'), tr('Source', 'المصدر')]}
                rows={[...R.weather.rows].reverse().map((r: any) => [r.date, f(r.tmax), f(r.tmin), f(r.tmean), f(r.rh), f(r.dew), f(r.rain), f(r.et0), f(r.wind), f(r.sun), r.src])} />
            </Block>
          ) : null}
          {R.forecast?.rows?.length ? (
            <Block title={tr('Forecast, next 7 days', 'التوقعات، الـ 7 أيام الجايين')} src={`Open-Meteo · ${tr('issued', 'صادرة')} ${R.forecast.issued || '—'}`}>
              <Table head={[tr('Date', 'التاريخ'), tr('Max °C', 'العظمى °م'), tr('Min °C', 'الصغرى °م'), tr('Humidity %', 'الرطوبة %'), tr('Rain mm', 'المطر مم'), tr('ET₀ mm', 'البخر-نتح مم')]}
                rows={R.forecast.rows.map((r: any) => [r.date, f(r.tmax), f(r.tmin), f(r.rh), f(r.rain), f(r.et0)])} />
            </Block>
          ) : null}
          {R.satellite?.squares ? (
            <Block title={tr('Newest satellite pass, every 30 m square', 'آخر صورة قمر صناعي، كل مربع 30 م')}
              src={`${R.satellite.source} · ${R.satellite.date} · ${R.satellite.pixel_m} m · ${tr('clear', 'واضحة')} ${f(R.satellite.clear_pct, '%')} · ${R.satellite.images_this_season} ${tr('images this season', 'صورة الموسم ده')}`}>
              <Table head={[tr('Square (row-col)', 'المربع (صف-عمود)'), 'NDVI', 'NDMI', 'EVI']}
                rows={[[tr('Field median', 'وسيط الأرض'), f(R.satellite.median?.ndvi), f(R.satellite.median?.ndmi), f(R.satellite.median?.evi)],
                  ...R.satellite.squares.map((s: any) => [s.square, f(s.ndvi), f(s.ndmi), f(s.evi)])]} />
              <span className="sub" style={{ fontSize: '12px' }}>{tr('— = square masked (not farmland or outside the field).', '— = مربع متشال (مش أرض زراعية أو برا الأرض).')}</span>
            </Block>
          ) : null}
          {R.curve?.this_season ? (
            <Block title={tr('Greenness this season vs a normal year', 'الخضرة الموسم ده مقارنة بسنة عادية')}
              src={`${R.curve.source} · ${tr('normal', 'العادي')}: ${R.curve.normal_source} (${(R.curve.normal_seasons || []).join(', ')})`}>
              <Table head={[tr('Date', 'التاريخ'), tr('Day of season', 'يوم في الموسم'), tr('NDVI this season', 'NDVI الموسم ده'), tr('NDVI normal (MODIS)', 'NDVI العادي (MODIS)')]}
                rows={R.curve.this_season.map((p: any) => {
                  const n = (R.curve.normal || []).reduce((a: any, b: any) => (!a || Math.abs(b.day - p.day) < Math.abs(a.day - p.day) ? b : a), null);
                  return [p.date, p.day, f(p.ndvi), f(n?.ndvi)];
                })} />
            </Block>
          ) : null}
          <Block title={tr('Soil, water and land', 'التربة والمية والأرض')}>
            <Table head={[tr('Reading', 'القراءة'), tr('Value', 'القيمة'), tr('Date', 'التاريخ'), tr('Source', 'المصدر')]}
              rows={[
                [tr('Root-zone soil moisture', 'رطوبة التربة عند الجذور'), f(R.smap?.value, ' m³/m³'), f(R.smap?.date), `NASA SMAP L4 ${R.smap?.product || ''} · 9 km`],
                [tr('Crop surface temperature', 'حرارة سطح الزرع'), f(R.ecostress?.value, ' °C'), f(R.ecostress?.date), `NASA ECOSTRESS ${R.ecostress?.product || ''} · 70 m`],
                [tr('Elevation', 'الارتفاع'), f(R.terrain?.elevation_m, ' m'), tr('static', 'ثابت'), f(R.terrain?.source)],
                [tr('Height range inside the field', 'فرق الارتفاع جوه الأرض'), f(R.terrain?.range_m, ' m'), tr('static', 'ثابت'), f(R.terrain?.source)],
                [tr('Field vs land around it', 'الأرض مقارنة باللي حواليها'), f(R.terrain?.field_vs_around_m, ' m'), tr('static', 'ثابت'), f(R.terrain?.source)],
                [tr('Topsoil texture', 'نوع التربة السطحية'), R.soil?.label ? `${R.soil.label} · ${tr('clay', 'طين')} ${R.soil.clay}% · ${tr('sand', 'رمل')} ${R.soil.sand}% · ${tr('silt', 'سلت')} ${R.soil.silt}%` : '—', tr('static', 'ثابت'), f(R.soil?.source)],
                [tr('Warmth gathered since sowing', 'الحرارة المتجمعة من الزراعة'), `${f(R.season?.gdd)} °C·${tr('days', 'يوم')}`, `${R.season?.sown} → ${R.today}`, 'NASA POWER / Open-Meteo'],
              ]} />
          </Block>
          <span className="sub" style={{ fontSize: '12px' }}>{tr('These are the inputs the season model runs on, not results. Location', 'دي المدخلات اللي موديل الموسم شغال عليها، مش نتايج. المكان')}: {R.lat}, {R.lon}</span>
        </div>
      ) : null}
    </section>
  );
}
