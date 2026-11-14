/* eslint-disable */
// Verbatim logic from design/html/V11-Health.html.
import { DCLogic } from '@/lib/dc';
import { squares, pinFor, shortDate, longDate, sourceShort } from '@/lib/squares';

// Curve axes of the design's chart: Oct 1 at x=10, Apr 1 at x=300; NDVI 0.1 at y=136, 0.9 at y=26.
const cx = (day) => (10 + (day / 182) * 290).toFixed(1);
const cy = (v) => Math.max(20, Math.min(140, 136 - ((v - 0.1) / 0.8) * 110)).toFixed(1);
const path = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + cx(p.day) + ' ' + cy(p.ndvi)).join(' ');

// The five Details cards: NDVI, EVI, NDMI (field medians), ECOSTRESS surface temperature, SMAP root-zone moisture.
// Design values with a Demo pill until the layer is really there (SMAP / ECOSTRESS need the Earthdata login).
const DESIGN_LAYERS = [['0.61', 'HLS 30 m'], ['0.38', 'HLS 30 m'], ['0.22', 'HLS 30 m'], ['24', 'ECOSTRESS 70 m, 27 Oct'], ['0.31', 'SMAP 9 km']];
const demoLayer = ([value, src]) => ({ value, src, pv: 'pill pv-demo', pvL: 'Demo' });
function layerCards(D, demo) {
  const none = (i, why) => (demo ? demoLayer(DESIGN_LAYERS[i]) : { value: '–', src: why, pv: 'pill', pvL: 'Waiting' });
  const N = D && D.ndvi && D.ndvi.available ? D.ndvi : null;
  const L = (D && D.layers) || {};
  const src = N ? (N.source.startsWith('NASA HLS') ? 'HLS 30 m' : 'Sentinel-2, ' + shortDate(N.date)) : null;
  const idx = (ix, i) => (N && N.indices[ix].median != null
    ? { value: N.indices[ix].median.toFixed(2), src, pv: 'pill pv-sat', pvL: 'Satellite' } : none(i, 'No clear image yet'));
  const app = (k, i, fmt, label) => {
    const x = L[k];
    if (x && x.value != null) return { value: fmt(x.value), src: label + (x.date ? ', ' + shortDate(x.date) : ''), pv: 'pill pv-sat', pvL: 'Satellite' };
    const d = none(i, 'Not ready yet');
    if (x && x.updating) d.src = 'Updating from NASA…';
    return d;
  };
  return [idx('ndvi', 0), idx('evi', 1), idx('ndmi', 2),
    app('ecostress', 3, (v) => String(Math.round(v)), 'ECOSTRESS 70 m'), app('smap', 4, (v) => v.toFixed(2), 'SMAP 9 km')];
}

// Field health texts from GET /fields/{id}/health. null -> V11 design values.
export function healthTexts(D, demo) {
  const N = D && D.ndvi && D.ndvi.available ? D.ndvi : null;
  if (!N && !demo) {
    // A new field: say plainly that the first clear image has not arrived. No sample values.
    return { live: false, layers: layerCards(D, false), eyebrow: 'Waiting for the first clear satellite image of your field.', pill: 'No image yet', pillCls: 'pill',
      where: '', title: 'Bezra is waiting for a clear image',
      body: 'NASA HLS and ESA Sentinel-2 pass every few days. When a pass is not cloudy over your field, the greenness of every 30 m square shows here.',
      normalPath: '', thisPath: '', dot: ['-10', '-10'], compare: '', pv: 'pill', pvL: 'Waiting',
      foot: 'Greenness from NASA HLS and ESA Sentinel-2. Moisture from NASA SMAP, surface temperature from NASA ECOSTRESS.' };
  }
  if (!N) {
    return { live: false, layers: DESIGN_LAYERS.map(demoLayer), eyebrow: 'North plot. Latest clear image 10 November, HLS 30 m.', pill: 'Check this spot', pillCls: 'lv lv-med',
      where: 'NE corner, ~0.25 feddan', title: 'This corner looks weaker',
      body: "It has been 20% less green than the rest of your field in the last two satellite images. It is also the driest corner. The satellite can't tell why, so please go and look.",
      normalPath: 'M10 135C60 132 90 110 130 80S220 30 300 26', thisPath: 'M10 136C50 130 80 112 110 92S150 70 170 64', dot: ['170', '64'],
      compare: 'Slightly better than a normal year for mid November.', pv: 'pill pv-demo', pvL: 'Demo',
      foot: 'All numbers on this screen are demo data.' };
  }
  const C = D.curve, S = N.weak_spot;
  const src = N.source.startsWith('NASA HLS') ? 'HLS 30 m' : 'Sentinel-2';
  let body = '';
  if (S) {
    const nd = N.indices.ndmi.cells;
    const spotNdmi = S.squares.map(([r, c]) => (nd.find((x) => x.r === r && x.c === c) || {}).value).filter((v) => v != null);
    const minNdmi = Math.min(...nd.filter((x) => x.value != null).map((x) => x.value));
    const driest = spotNdmi.length && Math.min(...spotNdmi) <= minNdmi + 0.005;
    // terrain (30 m elevation): say so only if the weak spot is clearly the lowest part (Delta is flat; >= 0.25 m)
    const T = D.layers && D.layers.terrain;
    const lowest = T && T.lowest && T.lowest.below_mean_m >= 0.25 && S.squares.some(([r, c]) => r === T.lowest.r && c === T.lowest.c);
    body = `It has been ${S.pct_less_green}% less green than the rest of your field in the last two satellite images.` +
      (driest ? ' It is also the driest corner.' : '') + (lowest ? ' It is the lowest part of the field, so water can stay there.' : '') +
      " The satellite can't tell why, so please go and look.";
  }
  const last = C.this_season[C.this_season.length - 1];
  return {
    live: true, layers: layerCards(D, demo),
    eyebrow: `Your field. Latest clear image ${longDate(N.date)}, ${src}.`,
    pill: S ? 'Check this spot' : 'All squares look even', pillCls: S ? 'lv lv-med' : 'lv lv-low',
    where: S ? `${S.where}, ~${S.feddan} feddan` : `${N.grid.rows * N.grid.cols} squares of 30 m`,
    title: S ? (S.where.endsWith('corner') ? 'This corner looks weaker' : 'This part looks weaker') : 'No weak spot right now',
    body: S ? body : 'No square was less green than the rest of your field in the last two satellite images. Keep an eye on the corners after each water turn.',
    normalPath: C.normal.length ? path(C.normal.filter((p) => p.day <= 190)) : '',
    thisPath: C.this_season.length ? path(C.this_season) : '',
    dot: last ? [cx(last.day), cy(last.ndvi)] : ['-20', '-20'],
    compare: C.compare ? C.compare.text : 'Not enough images yet to compare with a normal year.',
    pv: 'pill pv-sat', pvL: 'Satellite',
    foot: `Greenness from ${N.source}; normal year from NASA MODIS (${C.normal_seasons.length} seasons). Moisture and heat layers are still Demo.`,
  };
}

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { ix: 'NDVI', seen: null }); }
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
// Real squares from GET /fields/{id}/ndvi when available (step 4); else the design values.
const SQ = squares(this.props.ndvi, (this.state.ix || "NDVI").toLowerCase());
const NDVI = SQ ? SQ.NDVI : [[.63, .55, .48], [.65, .60, .52], [.67, .64, .61], [.68, .66, .64]];
const KL = SQ ? SQ.KL : null;
const CL = [{ fill: 'url(#hatch)', label: 'Less green', sw: 'background: repeating-linear-gradient(45deg,#F29B1E 0 3px,#F7C67E 3px 5px);' }, { fill: '#D9DE9C', label: 'Normal', sw: 'background: #D9DE9C;' }, { fill: '#3E7F35', label: 'Greener', sw: 'background: #3E7F35;' }];
const mkCells = (on, showNum) => { const out = []; const cw = 160 / 3, ch = 55; let i = 0; for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const v = NDVI[r][c], k = KL ? KL[r][c] : (v < .55 ? 0 : (v < .64 ? 1 : 2)), x = 605 + c * cw, y = 120 + r * ch, cx = x + cw / 2, cy = y + ch / 2; out.push({ x: x.toFixed(1), y, w: cw.toFixed(1), h: ch, fill: CL[k].fill, op: on ? (k === 0 ? '.95' : '.82') : '0', cx: cx.toFixed(1), cy, tf: 'rotate(9 ' + cx.toFixed(1) + ' ' + cy + ')', label: v == null ? "–" : v.toFixed(2), ink: k === 2 ? '#FFFFFF' : '#141A16', st: '--i:' + (i++) }); } return out; };

const ix = S.ix;
const cells = mkCells(true).map((c) => (!SQ && !this.props.demo ? Object.assign({}, c, { fill: '#FFFFFF', op: '.12', label: '' }) : c));
// U6: plain words in Simple mode, index names only in Details
const PLAIN = { NDVI: 'Greenness', EVI: 'Leaf cover', NDMI: 'Moisture' };
const idx = ['NDVI', 'EVI', 'NDMI'].map((l) => ({ label: details ? l : PLAIN[l], p: String(ix === l), pick: () => set({ ix: l }), cls: 'segb press' + (ix === l ? ' on' : '') }));
const seen = ['Yellow leaves', 'Dry soil', 'Insects', 'Looks fine'].map((l) => ({ label: l, p: String(S.seen === l), pick: () => set({ seen: l }), cls: 'btn sm press ' + (S.seen === l ? '' : 'soft') }));
return { parcels: this._map.parcels, rowed: this._map.rowed, houses: this._map.houses, cells, idx, seen, dim: true, showNum: details,
legend: CL.map((c) => ({ label: c.label, sw: 'width: 14px; height: 10px; border-radius: 3px; ' + c.sw })), legendNote: details ? ix + ', 30 m squares, compared with your field median' : 'Compared with the rest of your field',
idxNote: ix + ' · ' + (SQ ? shortDate(this.props.ndvi.date) : (this.props.demo ? '10 Nov' : 'no image yet')), pin: pinFor(this.props.ndvi), mapLive: !!SQ, H: healthTexts(this.props.data, this.props.demo),
mapLabel: SQ ? 'Greenness of your field in 12 squares.' + (this.props.ndvi.weak_spot ? ' The ' + this.props.ndvi.weak_spot.where + ' is less green.' : ' No weak spot.') : (this.props.demo ? 'Greenness of North plot in 12 squares. The north east corner is less green.' : 'Your field. Waiting for the first clear satellite image.') };
 })();
return Object.assign(base, extra || {});
}
}
