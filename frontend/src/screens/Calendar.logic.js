/* eslint-disable */
// Verbatim logic from design/html/V11-Calendar.html.
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { era: 'Today', pick: 3 }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const era = S.era, shift = era === '1990s' ? 1 : (era === '2040' ? -1 : 0);
const eras = ['1990s', 'Today', '2040'].map((l) => ({ label: l, p: String(era === l), pick: () => set({ era: l }), cls: 'segb press' + (era === l ? ' on' : '') }));
const MON = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const half = (i) => (i % 2 ? '16 ' : '1 ') + MON[Math.floor(i / 2)];
const C = { g: 'background: #3E8F4E;', y: 'background: #E9C25A;', r: 'background: repeating-linear-gradient(45deg,#D9644B 0 3px,#EBA290 3px 6px);', n: 'background: #F1F1EE;' };
const row = (s) => s.split('');
const RAW = [
['Wheat', '#C9B26A', 'yyggyyrrnnnnnnnnnnnnnnyy'],
['Berseem', '#4C9A58', 'ggyyrnnnnnnnnnnnnnnnnygg'],
['Sugar beet', '#B0566B', 'ggyyrrnnnnnnnnnnnnnnnnyg'],
['Maize', '#6E9A4A', 'nnnnnnnnnnrryggyyrrnnnnn'],
['Cotton', '#D9D3C2', 'nnnnnnnnryggyrrnnnnnnnnn']];
const crops = RAW.map(([name, col, pat], ci) => {
let p = row(pat); if (ci === 0 && shift) { p = shift > 0 ? ['y'].concat(p.slice(0, 23)) : p.slice(1).concat(['y']); }
return { name, sw: 'width: 10px; height: 10px; border-radius: 3px; background: ' + col + ';', cells: p.map((k, i) => {
const sel = ci === 0 && S.pick === i;
return { aria: name + ', sow ' + half(i) + ', ' + ({ g: 'best', y: 'acceptable', r: 'high risk', n: 'not a season' })[k], pick: ci === 0 && k !== 'n' ? () => set({ pick: i }) : null,
style: '--i:' + (i + ci * 3) + '; height: 100%; padding: 0; border: 0; border-radius: ' + (i === 0 ? '8px 2px 2px 8px' : (i === 23 ? '2px 8px 8px 2px' : '2px')) + '; ' + C[k] + (sel ? ' box-shadow: inset 0 0 0 3px #141A16;' : '') + (ci === 0 && k !== 'n' ? ' cursor: pointer;' : ' cursor: default;') }; }) };
});
const p = S.pick, wheat = crops[0].cells, best = 3 - shift;
const off = Math.abs(p - best);
const heat = Math.min(80, 12 + off * 9), loss = off === 0 ? 'Best date' : '-' + (off * 3 + (off > 2 ? 4 : 0)) + '%';
const stg = ['Tillering', 'Jointing', 'Heading', 'Grain fill', 'Harvest'];
const add = [3, 6, 9, 10, 12];
const stages = stg.map((s, i) => s + ' ' + half(Math.min(23, p + add[i] * 2 - 2)));
return { eras, crops, eraLabel: era === 'Today' ? 'today\'s climate' : (era === '2040' ? '2040 climate (SSP2-4.5)' : 'the 1990s climate'), pickLabel: half(p), heat, loss, stages };
 })();
return Object.assign(base, extra || {});
}
}
