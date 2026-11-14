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
// ---- real wheat windows from GET /fields/{id}/calendar (step 2). Other crops: design values (Demo).
const D = this.props.data, E = D ? D.eras[era] : null;
const crops = RAW.filter((_, ci) => ci === 0 || this.props.demo).map(([name, col, pat], ci) => {
let p = row(pat); if (ci === 0 && E) p = E.cells.map((c) => c.k); else if (ci === 0 && shift) { p = shift > 0 ? ['y'].concat(p.slice(0, 23)) : p.slice(1).concat(['y']); }
return { name, sw: 'width: 10px; height: 10px; border-radius: 3px; background: ' + col + ';', cells: p.map((k, i) => {
const sel = ci === 0 && S.pick === i;
return { aria: name + ', sow ' + half(i) + ', ' + ({ g: 'best', y: 'acceptable', r: 'high risk', n: 'not a season' })[k], pick: ci === 0 && k !== 'n' ? () => set({ pick: i }) : null,
style: '--i:' + (i + ci * 3) + '; height: 100%; padding: 0; border: 0; border-radius: ' + (i === 0 ? '8px 2px 2px 8px' : (i === 23 ? '2px 8px 8px 2px' : '2px')) + '; ' + C[k] + (sel ? ' box-shadow: inset 0 0 0 3px #141A16;' : '') + (ci === 0 && k !== 'n' ? ' cursor: pointer;' : ' cursor: default;') }; }) };
});
const p = S.pick, wheat = crops[0].cells, best = 3 - shift;
const off = Math.abs(p - best);
let heat = Math.min(80, 12 + off * 9), loss = off === 0 ? 'Best date' : '-' + (off * 3 + (off > 2 ? 4 : 0)) + '%';
const stg = ['Tillering', 'Jointing', 'Heading', 'Grain fill', 'Harvest'];
const add = [3, 6, 9, 10, 12];
let stages = stg.map((s, i) => s + ' ' + half(Math.min(23, p + add[i] * 2 - 2)));
if (E && E.cells[p] && E.cells[p].k !== 'n') {
  const c = E.cells[p];
  heat = c.heat_chance; loss = p === E.best_cell ? 'Best date' : (c.loss > 0 ? '-' + c.loss + '%' : 'Best date'); stages = c.stages;
}
const L = D && D.late_prev_crop, ER = D && D.earlier;
const days = (n) => (n === 0 ? 'less than 5 days' : Math.abs(n) + ' day' + (Math.abs(n) === 1 ? '' : 's')); // the backend sweeps every 5 days
return { eras, crops, eraLabel: era === 'Today' ? 'today\'s climate' : (era === '2040' ? (D ? '2040 climate, Estimated (trend from NASA POWER)' : '2040 climate (Demo)') : 'the 1990s climate'), pickLabel: half(p), heat, loss, stages,
  live: !!D, pvEst: D ? 'pill pv-est' : 'pill pv-demo', pvEstL: D ? 'Estimated' : 'Demo',
  lateHarvest: L ? L.harvest.replace(/^(\d+) (\w+)$/, (_, d, m) => d + ' ' + ({ Dec: 'December', Nov: 'November', Jan: 'January', Oct: 'October' }[m] || m)) : '10 December',
  lateCost: L ? L.cost_pct + '% of the harvest' : '6% of the harvest',
  earlier90: ER ? days(ER.days_1990s) + (ER.days_1990s >= 0 ? ' later' : ' earlier') : '12 days later',
  earlier40: ER ? days(ER.days_2040) + (ER.days_2040 >= 0 ? ' earlier' : ' later') : '9 days earlier',
  earlierTitle: !ER || ER.days_1990s > 0 ? 'The best time is earlier now' : (ER.days_1990s === 0 ? 'The best time has barely moved' : 'The best time is moving later'),
  foot: D ? (this.props.demo ? 'Wheat: yield model on NASA POWER, every season 1990-2025. Other crops are Demo.' : 'Wheat: yield model on NASA POWER, every season 1990-2025. Other crops are coming soon.') : 'All numbers on this screen are demo data.' };
 })();
return Object.assign(base, extra || {});
}
}
