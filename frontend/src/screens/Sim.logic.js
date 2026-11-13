/* eslint-disable */
// Verbatim logic from design/html/V11-Sim.html.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { sow: 0, va: 0, wa: 0, yr: 0, m: 3, pin: null }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const scene = (o) => {
const s = o.scale || 4.2, ox = o.ox || 500, oy = o.oy || 170, C = .866, Sn = .5;
const P = (x, y, z) => (ox + (x - y) * C * s).toFixed(1) + ',' + (oy + (x + y) * Sn * s - z * s).toFixed(1);
const poly = (pts) => pts.join(' ');
let a = 4242; const rnd = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pal = ['#8C9C5A', '#95A463', '#5A7A3C', '#628342', '#B1A584', '#BCB192', '#A39878', '#7D725D', '#688947', '#4E6E36'];
const ground = [];
let x = -90;
while (x < 150) { const w = 7 + rnd() * 14; let y = -80; while (y < 170) { const h = 14 + rnd() * 40; const inField = x + w > -1 && x < 61 && y + h > -1 && y < 81; const inCanal = y < 100 && y + h > 92; if (!inField) { const y0 = inCanal && y < 92 ? y : y, y1 = Math.min(y + h, inCanal ? 92 : y + h); if (y1 > y0 && !(y0 >= 92 && y0 < 100)) ground.push({ pts: poly([P(x, y0, 0), P(x + w, y0, 0), P(x + w, y1, 0), P(x, y1, 0)]), fill: pal[Math.floor(rnd() * pal.length)] }); } y += h; } x += w; }
const canal = poly([P(-90, 92, 0), P(150, 92, 0), P(150, 100, 0), P(-90, 100, 0)]);
const road = poly([P(-6, -80, .05), P(-2, -80, .05), P(-2, 92, .05), P(-6, 92, .05)]);
const STG = [[.5, '#9DB36A'], [2.2, '#6FA04A'], [3.6, '#5E9842'], [6, '#4E8A3A'], [8.5, '#3F7D33'], [9, '#93A644'], [8.6, '#D8BE6A']];
const mix = (c1, c2, t) => { const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); const A = p(c1), B = p(c2); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const m = o.month, st = STG[m];
const cells = [];
for (let i = 0; i < 6; i++) for (let j = 0; j < 8; j++) cells.push({ i, j });
cells.sort((p, q) => (p.i + p.j) - (q.i + q.j));
const prisms = [];
cells.forEach(({ i, j }) => {
const dry = (i >= 4 && j <= 2) ? .55 : ((i + j * 7) % 5) * .04;
let stress = m >= 2 ? Math.min(1, dry * o.water + (m >= 5 ? o.heat : 0) + (m >= 3 && o.rust && (i * 3 + j) % 7 === 0 ? .35 : 0)) : 0;
const jit = ((i * 7 + j * 13) % 9) / 9;
const z = Math.max(.35, st[0] * (1 - stress * .32) * (.9 + jit * .16));
const top = mix(mix(st[1], '#2E6B2A', jit * .18), m >= 6 ? '#B89A4A' : '#CDBB6E', Math.min(.75, stress * .7));
const x0 = i * 10, x1 = x0 + 10, y0 = j * 10, y1 = y0 + 10;
const rows = [2.5, 5, 7.5].map((d) => P(x0 + d, y0 + .6, z) + ' ' + P(x0 + d, y1 - .6, z)).join(' M');
prisms.push({ top: poly([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)]), r: poly([P(x1, y0, 0), P(x1, y1, 0), P(x1, y1, z), P(x1, y0, z)]), f: poly([P(x0, y1, 0), P(x1, y1, 0), P(x1, y1, z), P(x0, y1, z)]),
c: top, cr: mix(top, '#1A2414', .28), cf: mix(top, '#1A2414', .42), rows: 'M' + rows, rust: o.rust && m >= 3 && m <= 4 && (i * 3 + j) % 7 === 0, rx: P(x0 + 5, y0 + 5, z).split(',')[0], ry: P(x0 + 5, y0 + 5, z).split(',')[1] });
});
const soil = poly([P(0, 0, 0), P(60, 0, 0), P(60, 80, 0), P(0, 80, 0)]);
const edgeR = poly([P(60, 0, 0), P(60, 80, 0), P(60, 80, -1.2), P(60, 0, -1.2)]), edgeF = poly([P(0, 80, 0), P(60, 80, 0), P(60, 80, -1.2), P(0, 80, -1.2)]);
const wet = o.wet ? poly([P(.5, .5, .1), P(59.5, .5, .1), P(59.5, 79.5, .1), P(.5, 79.5, .1)]) : '';
const tag = P(60, 0, 12).split(',');
return { ground, canal, road, prisms, soil, edgeR, edgeF, wet, tagX: tag[0], tagY: tag[1] };
};

const SOW = ['25 Oct', '15 Nov', '1 Dec'], VAR = ['Sakha 95', 'Giza 171'], WAT = ['Every turn', 'Skip 1 in Jan', 'Skip 2'], YR = ['Normal year', 'Hot spring'];
const sw = S.sow, va = S.va, wa = S.wa, yr = S.yr, m = S.m;
const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const start = sw === 0 ? -1 : (sw === 1 ? 0 : 0);
const mLabel = (k) => { const base = sw === 0 ? ['25 Oct', '25 Nov', '25 Dec', '25 Jan', '25 Feb', '25 Mar', '25 Apr'] : (sw === 1 ? ['15 Nov', '15 Dec', '15 Jan', '15 Feb', '15 Mar', '15 Apr', '15 May'] : ['1 Dec', '1 Jan', '1 Feb', '1 Mar', '1 Apr', '1 May', '1 Jun']); return base[k]; };
const STAGE = ['Sown', 'Tillering', 'Tillering', 'Stem growth', 'Heading', 'Grain filling', 'Ready to harvest'];
const hot = yr === 1, late = sw === 2, mid = sw === 1;
const heat = hot ? (late ? .45 : (mid ? .3 : .15)) : (late ? .2 : (mid ? .08 : 0));
const water = [.35, .75, 1.25][wa];
const sc = scene({ month: m, water, heat: m >= 5 ? heat : 0, rust: va === 1, wet: m <= 2 && (m !== 2 || wa === 0) });
const loss = 3 + [0, 4, 10][wa] + [0, 5, 12][sw] + (hot ? (late ? 12 : (mid ? 7 : 3)) : 0) + (va === 1 ? 6 : 0);
const yieldPct = 100 - loss;
const wUse = [3150, 2800, 2450][wa] + (hot ? 150 : 0);
const events = [];
events.push({ k: 0, t: 'Sown ' + mLabel(0) + '. First water 10 days later.' });
events.push({ k: 1, t: 'Water turns every 10 days. Tillering needs all of them.' });
events.push({ k: 2, t: wa === 0 ? 'January turns kept. Roots stay wet.' : (wa === 1 ? 'You skipped one January turn. The dry corner yellows a little.' : 'Two turns skipped. The tail end of the field is thirsty.') });
events.push({ k: 3, t: va === 1 ? 'Foggy weeks. Rust shows up on Giza 171 in a few spots.' : 'Stems grow fast. Sakha 95 handles the foggy weeks well.' });
events.push({ k: 4, t: va === 1 ? 'Heads appear. The rust spots spread a little.' : 'Heads appear across the field.' });
events.push({ k: 5, t: hot ? (late ? '5 hot days while the grain fills. This is where most loss happens.' : '3 hot days while the grain fills.') : (late ? '2 hot days while the grain fills.' : 'Grain fills before the heat arrives.') });
events.push({ k: 6, t: 'Harvest: about ' + yieldPct + '% of what this field can give.' });
const ev = events[m].t;
const steps = STAGE.map((l, k) => ({ label: mLabel(k), sub: l, p: String(k === m), pick: () => set({ m: k }),
style: 'flex: 1; min-width: 0; padding: 8px 4px; border: 0; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 3px; font-family: inherit; cursor: pointer; transition: background-color .2s; ' + (k === m ? 'background: #17251C; color: #fff;' : 'background: transparent; color: ' + (k < m ? '#141A16' : '#8B918C') + ';'),
dot: 'width: 8px; height: 8px; border-radius: 4px; background: ' + ((k === 5 && heat > .1) ? '#F29B1E' : ((k >= 3 && k <= 4 && va === 1) || (k === 2 && wa > 0) ? '#C2412A' : (k === m ? '#fff' : '#C9CCC5'))) + ';' }));
const opt = (arr, cur, key) => arr.map((l, k) => ({ label: l, p: String(cur === k), pick: () => set({ [key]: k }), cls: 'segb press' + (cur === k ? ' on' : '') }));
const pin = S.pin;
const height = Math.round([4, 15, 25, 55, 85, 90, 85][m] * (1 - (m >= 2 ? Math.min(.3, (heat + water * .1)) : 0)));
const soilW = [92, 70, 55 - wa * 12, 60 - wa * 8, 58, 50 - (hot ? 10 : 0), 30][m];
const label = SOW[sw] + ', ' + VAR[va] + ', ' + WAT[wa].toLowerCase();
return { sc, wetOn: !!sc.wet, rustOn: va === 1 && m >= 3 && m <= 4, rustDots: sc.prisms.filter((p) => p.rust), hazeOn: m === 5 && heat > .1,
sceneLabel: 'North plot in 3D at ' + STAGE[m] + '. Ground from a satellite image, crop simulated.',
sow: opt(SOW, sw, 'sow'), va: opt(VAR, va, 'va'), wa: opt(WAT, wa, 'wa'), yr: opt(YR, yr, 'yr'),
steps, stage: STAGE[m], when: mLabel(m), ev, height, soilW: Math.max(18, soilW), yieldPct, wUse: wUse.toLocaleString('en-US'), hotDays: hot ? (late ? 5 : (mid ? 3 : 1)) : (late ? 2 : 0),
next1: () => set({ m: Math.min(6, m + 1) }), next3: () => set({ m: Math.min(6, m + 3) }), back: () => set({ m: Math.max(0, m - 1) }), atEnd: m === 6, notEnd: m < 6,
hazeChip: m === 5 && heat > .1, hasPin: !!pin, pinLabel: pin ? pin.label : '', pinY: pin ? pin.y : 0, pinW: pin ? pin.w : '', diff: pin ? (yieldPct - pin.y) : 0,
diffTxt: pin ? (yieldPct === pin.y ? 'Same harvest' : (yieldPct > pin.y ? (yieldPct - pin.y) + '% more harvest than the pinned plan' : (pin.y - yieldPct) + '% less harvest than the pinned plan')) : '',
pinIt: () => set({ pin: { label, y: yieldPct, w: wUse.toLocaleString('en-US') } }), nowLabel: label, mood: yieldPct >= 90 ? 'happy' : 'concern', good: yieldPct >= 90, bad: yieldPct < 90 };
 })();
return Object.assign(base, extra || {});
}
}
