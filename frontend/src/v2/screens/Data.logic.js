/* eslint-disable */
// Logic from design-handoff/design/source/V18-Data.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":1000}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, {}); }
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

const cells = mkCells(true);
return { parcels: this._map.parcels, rowed: this._map.rowed, houses: this._map.houses, cells, dim: true, showNum: false, legend: [], mapLabel: 'North plot on the satellite map.' };
 })();
return Object.assign(base, extra || {});
}
}
