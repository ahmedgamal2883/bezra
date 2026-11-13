/* eslint-disable */
// Verbatim logic from design/html/V11-Field.html.
import { DCLogic } from '@/lib/dc';
import { PV, LV, dm } from '@/lib/api';

const WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pill = (prov, D) => (D ? PV[prov] : PV.demo);

// Every text on the Today screen. With no backend data (D = null) these are the V11 design values + Demo pills.
export function todayTexts(D, fieldId) {
  if (!D) {
    return {
      demo: true, eyebrow: 'Saturday, 14 November. Wheat, day 30 of 160, tillering.', hello: 'Good morning, Hassan',
      num: 'Field #01', name: 'North plot', cropLine: 'Wheat, Sakha 95, sown 15 Oct',
      area: '2.4 feddan', soil: 'Heavy clay', water: 'Mesqa, tail end', turn: 'Every 10 days',
      conf: 'Medium confidence', title: "Your water turn is Thursday. Don't skip it.",
      body: 'Your wheat is at the stage that is hurt most by thirst, and the soil is drier than it should be.',
      protects: '8 to 12%', apply: '~300', method: 'FAO-56, Kc 0.7, RAW 50%', why: 'Why Thursday?', doneLabel: 'I will water on Thursday',
      heat: { cls: LV.Low, lv: 'Low', line: 'No hot days in the next week.' },
      wat: { cls: LV.Medium, lv: 'Medium', line: "The soil is drying. Don't miss Thursday." },
      rust: { cls: LV.Medium, lv: 'Medium', line: '4 of the last 7 nights were foggy. Rust likes that.' },
      soilW: '38', soilSrc: 'FAO-56 water balance, POWER ET₀', refillTxt: 'Below refill point',
      rain: '0', rainSrc: 'NASA GPM IMERG, past rain only', used: '1,150',
      lastW: '3 Nov, 11 days ago', afterLabel: "After Thursday's water", after: 'About 90% full',
      yearRange: 'Oct 2026 to Sep 2027', todayLeft: 'calc(4.5 / 52 * 100%)', yearNote: 'Late April is often hot, right when the wheat grain fills.',
      powerLag: '2 days lag', forecast: 'Today 06:00', foot: 'All numbers on this screen are demo data.',
      pvEst: PV.demo, pvSat: PV.demo, pvFarm: PV.demo, gaugeLabel: 'Root zone water gauge: 38 percent. Refill point 50 percent.',
    };
  }
  const t = new Date(D.today + 'T00:00:00');
  const hr = new Date().getHours();
  const nt = new Date(D.action.next_turn + 'T00:00:00');
  const ntDay = WD[nt.getDay()];
  const p = D.action.protects.value;
  const f = D.field;
  const sw = D.soil_water.value;
  const lag = D.sources[0].lag_days;
  const fcGen = D.sources[1].generated;
  const yr = new Date(D.year.from + 'T00:00:00').getFullYear();
  return {
    demo: false,
    eyebrow: `${WD[t.getDay()]}, ${t.getDate()} ${t.toLocaleString('en-GB', { month: 'long' })}. ${f.crop}, day ${D.day_n}` +
      (D.season_days ? ` of ${D.season_days}` : '') + `, ${D.stage.toLowerCase()}.`,
    hello: `${hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening'}, ${f.farmer.split(' ')[0]}`,
    num: `Field #${f.num}`, name: f.name,
    cropLine: [f.crop, f.variety, `sown ${dm(f.sow_date)}`].filter(Boolean).join(', '),
    area: `${f.area.value} feddan`, soil: f.soil.value, water: f.water_source.value, turn: f.turn.value,
    conf: `${D.action.confidence} confidence`, title: D.action.title, body: D.action.body,
    protects: p ? (p[0] === p[1] ? `about ${p[1]}%` : `${p[0]} to ${p[1]}%`) : 'less than 1%',
    apply: D.action.apply_m3.value != null ? `~${Math.round(D.action.apply_m3.value).toLocaleString('en-US')}` : '—',
    method: D.action.method || '', why: D.action.kind === 'water' ? `Why ${ntDay}?` : 'Why this?', doneLabel: D.action.done_label,
    heat: { cls: LV[D.risks.heat.level], lv: D.risks.heat.level, line: D.risks.heat.line },
    wat: { cls: LV[D.risks.water.level], lv: D.risks.water.level, line: D.risks.water.line },
    rust: { cls: LV[D.risks.rust.level], lv: D.risks.rust.level, line: D.risks.rust.line },
    soilW: sw != null ? String(sw) : '—', soilSrc: D.soil_water.source, refillTxt: sw != null && sw < 50 ? 'Below refill point' : 'Above refill point',
    rain: String(D.rain_since_watering.value), rainSrc: D.rain_since_watering.source, used: D.water_used.value.toLocaleString('en-US'),
    lastW: `${dm(D.last_watered.date)}, ${D.last_watered.days_ago} days ago`,
    afterLabel: D.after_turn.label, after: D.after_turn.value != null ? `About ${Math.round(D.after_turn.value / 5) * 5}% full` : '—',
    yearRange: `Oct ${yr} to Sep ${yr + 1}`, todayLeft: `calc(${D.year.today_week + 0.5} / 52 * 100%)`, yearNote: D.year.note,
    powerLag: `${lag} day${lag === 1 ? '' : 's'} lag`, forecast: fcGen ? `Updated ${fcGen.slice(11, 16)}` : 'Not available',
    foot: 'Weather from NASA POWER and Open-Meteo. Map, greenness, pests and plan are still Demo.',
    pvEst: PV.estimated, pvSat: PV.satellite, pvFarm: PV.farmer,
    gaugeLabel: `Root zone water gauge: ${sw} percent. Refill point 50 percent.`,
  };
}

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { view: 'green', done: false }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const mapRnd = (seed) => { let a = seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const buildMap = () => {
const rnd = mapRnd(913);
const groups = [{ w: .34, c: ['#8C9C5A', '#95A463', '#81944F', '#8FA05B'] }, { w: .30, c: ['#5A7A3C', '#628342', '#4E6E36', '#688947'] }, { w: .26, c: ['#B1A584', '#BCB192', '#A39878', '#B6AC8E'] }, { w: .10, c: ['#7D725D', '#887D64'] }];
const pick = () => { let r = rnd(), g = groups[0]; for (const gr of groups) { if (r < gr.w) { g = gr; break; } r -= gr.w; } return g.c[Math.floor(rnd() * g.c.length)]; };
const parcels = [], rowed = [];
const column = (x, w, skip) => { let y = -420; while (y < 1000) { let h = 50 + rnd() * 220; if (skip && y < 120 && y + h > 120) h = 120 - y; if (skip && Math.abs(y - 120) < .01) { y = 340; continue; } const p = { x: +x.toFixed(1), y: +y.toFixed(1), w: +w.toFixed(1), h: +h.toFixed(1), fill: pick() }; parcels.push(p); if (rnd() < .45) rowed.push({ x: p.x, y: p.y, w: p.w, h: p.h, op: (.06 + rnd() * .1).toFixed(2) }); y += h; } };
let x = 605; while (x > -500) { const w = 18 + rnd() * 46; x -= w; column(x, w, false); }
column(605, 160, true); x = 765; while (x < 1900) { const w = 18 + rnd() * 46; column(x, w, false); x += w; }
const houses = [], roofs = ['#BDB6A7', '#A9A293', '#D2CBBB', '#928B7E', '#C7BEAB', '#A0978A'];
for (let i = 0; i < 150; i++) houses.push({ x: (1046 + rnd() * 288).toFixed(1), y: (-74 + rnd() * 178).toFixed(1), w: (5 + rnd() * 11).toFixed(1), h: (5 + rnd() * 11).toFixed(1), fill: roofs[Math.floor(rnd() * roofs.length)] });
return { parcels, rowed, houses };
};
if (!this._map) this._map = buildMap();
const NDVI = [[.63, .55, .48], [.65, .60, .52], [.67, .64, .61], [.68, .66, .64]];
const CL = [{ fill: 'url(#hatch)', label: 'Less green', sw: 'background: repeating-linear-gradient(45deg,#F29B1E 0 3px,#F7C67E 3px 5px);' }, { fill: '#D9DE9C', label: 'Normal', sw: 'background: #D9DE9C;' }, { fill: '#3E7F35', label: 'Greener', sw: 'background: #3E7F35;' }];
const mkCells = (on, showNum) => { const out = []; const cw = 160 / 3, ch = 55; let i = 0; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const v = NDVI[r][c], k = v < .55 ? 0 : (v < .64 ? 1 : 2), x = 605 + c * cw, y = 120 + r * ch, cx = x + cw / 2, cy = y + ch / 2; out.push({ x: x.toFixed(1), y, w: cw.toFixed(1), h: ch, fill: CL[k].fill, op: on ? (k === 0 ? '.95' : '.82') : '0', cx: cx.toFixed(1), cy, tf: 'rotate(9 ' + cx.toFixed(1) + ' ' + cy + ')', label: v.toFixed(2), ink: k === 2 ? '#FFFFFF' : '#141A16', st: '--i:' + (i++) }); } return out; };

const view = S.view;
const cells = mkCells(view === 'green');
const views = [{ id: 'photo', label: 'Satellite photo' }, { id: 'green', label: 'Crop health' }].map((v) => ({ label: v.label, pressed: String(view === v.id), pick: () => set({ view: v.id }), cls: 'segb press' + (view === v.id ? ' on' : '') }));
// ---- real data from GET /fields/{id}/summary (step 2). T = texts shown; design values when there is no data.
const D = this.props.data, L = !!this.props.loading;
const T = todayTexts(D, this.props.fieldId);
const soilFrac = D && D.soil_water.value != null ? D.soil_water.value / 100 : .38;
const gauge = []; const cx = 120, cy = 100, R = 82, N = 14;
const pt = (f) => { const a = Math.PI * (1 - f); return [cx + R * Math.cos(a), cy - R * Math.sin(a)]; };
for (let i = 0; i < N; i++) { const [x0, y0] = pt(i / N + .012), [x1, y1] = pt((i + 1) / N - .012); gauge.push({ d: 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'A' + R + ' ' + R + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1), c: (i + .5) / N <= soilFrac ? '#2F6FA8' : '#E6E6E1', st: '--d:' + (12 + i * .5) }); }
const weeks = [];
if (D) {
  // Season strip from the backend: crop weeks from sowing to the projected harvest, hot weeks from 30 years of NASA POWER.
  const W = D.year.weeks, tw = D.year.today_week; let k = 0;
  const lastCrop = W.reduce((a, x, i) => (x.crop ? i : a), -1);
  const cropCol = D.field.crop === 'Wheat' ? '#C9B26A' : '#4C9A58';
  for (let w = 0; w < 52; w++) {
    const x = W[w]; let bg = x.crop ? cropCol : 'bare', h = 30 + Math.min(k, 20) * 1.6;
    if (x.crop) k++;
    if (!x.crop && w >= Math.max(lastCrop + 3, 30) && w < 50 && D.field.crop === "Wheat") { bg = '#6E9A4A'; h = 56; } // summer maize, as on Profile
    const hot = x.hot;
    let st = '--i:' + w + '; flex: 1 1 0; min-width: 0; border-radius: 3px; height: ' + (bg === 'bare' ? 16 : h) + 'px; ';
    st += bg === 'bare' ? 'background: repeating-linear-gradient(45deg,#D7D4CB 0 2px,#fff 2px 4px); box-shadow: inset 0 0 0 1px #D7D4CB;' : 'background: ' + (hot ? '#F29B1E' : bg) + ';' + (w > tw && !hot ? ' opacity: .55;' : '');
    if (w === tw) st += ' background: #141A16; height: 72px; opacity: 1;';
    weeks.push({ style: st });
  }
} else
for (let w = 0; w < 52; w++) { let bg = '#C9B26A', h = 30 + Math.min(w, 20) * 1.6; if (w >= 28 && w < 30) bg = 'bare'; else if (w >= 30 && w < 50) { bg = '#6E9A4A'; h = 56; } else if (w >= 50) bg = 'bare'; const hot = (w >= 27 && w <= 28) || (w >= 38 && w <= 44 && w % 2 === 0); let st = '--i:' + w + '; flex: 1 1 0; min-width: 0; border-radius: 3px; height: ' + (bg === 'bare' ? 16 : h) + 'px; '; st += bg === 'bare' ? 'background: repeating-linear-gradient(45deg,#D7D4CB 0 2px,#fff 2px 4px); box-shadow: inset 0 0 0 1px #D7D4CB;' : 'background: ' + (hot ? '#F29B1E' : bg) + ';' + (w > 4 && !hot ? ' opacity: .55;' : ''); if (w === 4) st += ' background: #141A16; height: 72px; opacity: 1;'; weeks.push({ style: st }); }
return { parcels: this._map.parcels, rowed: this._map.rowed, houses: this._map.houses, cells, views, gauge, weeks, dim: view === 'green', showNum: details && view === 'green',
legend: CL.map((c) => ({ label: c.label, sw: 'width: 14px; height: 10px; border-radius: 3px; ' + c.sw })),
legendNote: details ? 'NASA HLS NDVI, 30 m squares, vs your area' : 'Compared with the rest of your field',
stamp: view === 'green' ? 'Image from 10 Nov, 4 days ago' : 'Satellite pass 10 Nov',
mapLabel: 'North plot from above, 12 squares of 30 metres. The north east corner is less green than normal.',
green: details ? '0.61' : 'Normal', greenU: details ? ' NDVI' : '',
doneP: String(!!S.done), doneLabel: S.done ? 'Done, thanks' : T.doneLabel, doneCls: 'btn press' + (S.done ? ' soft' : ''), toggleDone: () => set({ done: !S.done }),
T, sk: 'sk ' + (L ? 'hold' : ''), skMap: 'sk map' + (L ? ' hold' : '') };
 })();
return Object.assign(base, extra || {});
}
}
