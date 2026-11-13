/* eslint-disable */
// Verbatim logic from design/html/V11-Landing.html.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, {}); }
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

const sc = scene({ month: 3, water: .35, heat: 0, rust: false, wet: false });
return { sc, wetOn: false, rustOn: false, rustDots: [], hazeOn: false, sceneLabel: 'A wheat field in 3D, three months after sowing, healthy and green.' };
 })();
return Object.assign(base, extra || {});
}
}
