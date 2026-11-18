/* eslint-disable */
// Logic from design-handoff/design/source/V18-Today.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":1440}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { sel: 2, layer: 'green', date: 0, done: false, ck: 'ask', toast: '', lg: { open: false, st: 'what', ty: null, opt: -1, amt: 0, dk: false, wh: [], all: false, when: 'today', ph: 0, err: '', conf: false, saved: false }, td: { water: false, c1: false, aphid: false }, ta: { water: '', c1: '', aphid: '' } }); }
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

const V = {
 green: [[.33, .29, .24], [.34, .31, .27], [.35, .33, .30], [.36, .35, .33]],
 water: [[.25, .24, .21], [.26, .24, .22], [.27, .25, .24], [.28, .27, .25]],
 heat: [[23, 24, 26], [23, 23, 25], [22, 23, 24], [22, 22, 23]],
 height: [[14.6, 14.6, 14.6], [14.5, 14.5, 14.6], [14.4, 14.4, 14.5], [14.2, 14.3, 14.4]] };
const WEAK = [[2, 3, 7], [1, 2, 5], [1, 1, 3], [0, 1, 2]];
const DATES = ['1 Dec', '26 Nov', '21 Nov', '16 Nov'];
const SCALE = { green: [1, .9, .8, .68], water: [0, .01, .02, .03], heat: [0, 1, 1, 2], height: [0, 0, 0, 0] };
const LAY = {
 green: { name: 'Greenness', unit: 'NDVI', src: 'HLS 30 m', f: (v) => v.toFixed(2), cls: (v) => v < .27 ? 0 : v < .31 ? 1 : v < .34 ? 2 : 3, pal: ['#E0A43A', '#C9C77A', '#7FA65A', '#3E7F35'], ink: ['#141A16', '#141A16', '#FFFFFF', '#FFFFFF'], leg: ['under 0.27', '0.27–0.30', '0.31–0.33', '0.34 and up'] },
 water: { name: 'Soil water', unit: 'm³/m³', src: 'SMAP 9 km, scaled with HLS + soil', f: (v) => v.toFixed(2), cls: (v) => v < .22 ? 0 : v < .25 ? 1 : v < .27 ? 2 : 3, pal: ['#C9A46A', '#B7C9D8', '#6E9CC4', '#2F6FA8'], ink: ['#141A16', '#141A16', '#FFFFFF', '#FFFFFF'], leg: ['under 0.22', '0.22–0.24', '0.25–0.26', '0.27 and up'] },
 heat: { name: 'Leaf heat', unit: '°C', src: 'ECOSTRESS 70 m', f: (v) => Math.round(v) + '°', cls: (v) => v >= 26 ? 0 : v >= 25 ? 1 : v >= 23 ? 2 : 3, pal: ['#C2412A', '#F29B1E', '#F2CF8A', '#F4EBD6'], ink: ['#FFFFFF', '#141A16', '#141A16', '#141A16'], leg: ['26° and up', '25°', '23–24°', 'under 23°'] },
 height: { name: 'Height', unit: 'm', src: 'SRTM 30 m', f: (v) => v.toFixed(1), cls: (v) => v < 14.3 ? 0 : v < 14.45 ? 1 : v < 14.55 ? 2 : 3, pal: ['#6F7A52', '#97A070', '#C4C59A', '#E4DDBE'], ink: ['#FFFFFF', '#141A16', '#141A16', '#141A16'], leg: ['under 14.3', '14.3–14.4', '14.5', '14.6 and up'] } };
const lay = S.layer, L = LAY[lay], di = S.date;
const val = (r, c) => { const b = V[lay][r][c]; return lay === 'green' ? b * SCALE.green[di] : b + SCALE[lay][di]; };
const SIMPLE = { pal: ['#E8962C', '#D9DE9C', '#3E7F35'], cls: (v) => v < .27 ? 0 : v < .31 ? 1 : 2 };
const cw = 160 / 3, ch = 55, cells = [];
let tot = 0;
for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) tot += val(r, c);
const avg = tot / 12;
for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
 const i = r * 3 + c, v = val(r, c), sel = S.sel === i;
 const x = 605 + c * cw, y = 120 + r * ch, cx = x + cw / 2, cy = y + ch / 2;
 const k = details ? L.cls(v) : SIMPLE.cls(V.green[r][c]);
 const fill = details ? L.pal[k] : SIMPLE.pal[k];
 const name = 'ABC'[c] + (r + 1);
 const pick = () => set({ sel: i });
 cells.push({ x: x.toFixed(1), y, w: cw.toFixed(1), h: ch, cx: cx.toFixed(1), cy, tf: 'rotate(9 ' + cx.toFixed(1) + ' ' + cy + ')', fill,
  op: S.sel === null || sel ? '.95' : '.62', ink: details ? L.ink[k] : '#141A16', tOp: details ? '1' : '0', label: details ? L.f(v) : '',
  aria: details ? 'Square ' + name + ', ' + L.name + ' ' + L.f(v) : ['Needs a look', 'Normal', 'Good'][k] + ', square ' + (i + 1),
  pressed: String(sel), tap: pick, key: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } } });
}
const sr = Math.floor((S.sel ?? 2) / 3), sc = (S.sel ?? 2) % 3, sv = val(sr, sc), sk = SIMPLE.cls(V.green[sr][sc]);
const mx = 605 + sc * cw + cw / 2, my = 120 + sr * ch + 12;
const diff = Math.round((sv - avg) / avg * 100);
const hist = Array.from({ length: 10 }, (_, j) => ({ cls: j < WEAK[sr][sc] ? 'bad' : '' })).sort((a, b) => ((a.cls ? 1 : 0) - (b.cls ? 1 : 0)) * ((sr * 3 + sc) % 2 ? 1 : -1));
const simpleCard = [
 { t: 'This square is weaker than the rest.', d: 'It was the weakest part in ' + WEAK[sr][sc] + ' of the last 10 seasons. Water probably reaches it late, at the end of the canal.', act: true },
 { t: 'This square is normal.', d: 'Close to the rest of your field. Nothing to do here.', act: false },
 { t: 'This square is doing well.', d: 'One of the greenest parts of your field. Keep going.', act: false }][sk];
const layers = Object.keys(LAY).map((id) => ({ label: LAY[id].name, cls: lay === id ? 'on' : '', pressed: String(lay === id), pick: () => set({ layer: id }) }));
const dates = DATES.map((d, j) => ({ label: d, cls: di === j ? 'on' : '', pressed: String(di === j), pick: () => set({ date: j }) }));
const legend = L.leg.map((t, j) => ({ t, sw: 'background: ' + L.pal[j] + ';' })).reverse();
const MAPV = { parcels: this._map.parcels, rowed: this._map.rowed, houses: this._map.houses, cells, mapLabel: details ? 'North plot, 12 squares of 30 m, coloured by ' + L.name : 'Your field from space, 12 squares of 30 m',
 dim: false, mark: 'translate(' + mx.toFixed(1) + ' ' + my + ') rotate(9)',
 sTitle: simpleCard.t, sDesc: simpleCard.d, sAct: simpleCard.act, sHist: hist,
 dName: 'Square ' + 'ABC'[sc] + (sr + 1) + ' · 30 × 30 m', dVal: L.f(sv), dUnit: L.unit, dAvg: L.f(avg), dDiff: (diff > 0 ? '+' : '') + diff + '% vs field', dWeak: WEAK[sr][sc] + ' of 10', dHist: hist, dSrc: L.src + ' · ' + DATES[di], dLayer: L.name,
 layers, dates, legend, done: S.done, notDone: !S.done, doIt: () => set({ done: true }), undo: () => set({ done: false })};

const T = {
 water: { label: 'Watered', sub: 'Extra or normal watering', ic: 'drop', q: 'How much water?', opts: [['Light', 'Only the top got wet'], ['Normal', 'A usual watering'], ['Heavy', 'Water stood on the field']] },
 feed: { label: 'Fed the crop', sub: 'Fertiliser or manure', ic: 'sprout', q: 'What did you put on?', opts: [['Urea', '46% nitrogen'], ['Ammonium nitrate', '33% nitrogen'], ['Superphosphate', 'Phosphorus'], ['Potassium sulphate', 'Potassium'], ['Manure', 'Farm manure'], ['Other', 'Something else']], amount: true },
 spray: { label: 'Sprayed', sub: 'Against disease, bugs or weeds', ic: 'shield', q: 'What kind of spray?', opts: [['For disease', 'Fungicide'], ['For bugs', 'Insecticide'], ['For weeds', 'Weed killer'], ['Not sure', '']], amount: true, sprayAmt: true },
 pest: { label: 'Saw a pest', sub: 'Bugs, worms, anything that eats', ic: 'bug', q: 'Which one looks closest?', opts: [['Aphids', 'Tiny green bugs', 'bug-aphid'], ['Caterpillar', 'Worm on leaves', 'bug-worm'], ['Mites', 'Tiny red dots', 'bug-mite'], ['Grasshopper', '', 'bug-hopper'], ['Not sure', '', 'bug-unsure']] },
 leaf: { label: 'Leaves look wrong', sub: 'Odd colour, spots or marks', ic: 'leaf', q: 'Which one looks closest?', opts: [['Yellow leaves', '', 'leaf-yellow'], ['Orange spots', '', 'leaf-orange'], ['Brown patches', '', 'leaf-brown'], ['Dry tips', '', 'leaf-tips'], ['White powder', '', 'leaf-white'], ['Not sure', '', 'leaf-unsure']] },
 photo: { label: 'Took a photo', sub: 'Show us what you see', ic: 'cam', q: '', opts: [] },
 other: { label: 'Something else', sub: 'Anything worth noting', ic: 'edit', q: 'What happened?', opts: [] } };
const SUG = [[45, 60], [65, 85], [100, 150], [25, 50], null, null];
const LG = S.lg, ty = LG.ty ? T[LG.ty] : null;
const flow = LG.ty === 'photo' ? ['what', 'where', 'photo'] : ['what', 'detail', 'where', 'photo'];
const si = Math.max(0, flow.indexOf(LG.st));
const up = (o) => set({ lg: Object.assign({}, LG, o) });
const go = (st) => up({ st, err: '' });
const next = () => {
 if (LG.st === 'what') { if (!LG.ty) return up({ err: 'Pick what happened.' }); return go(flow[1]); }
 if (LG.st === 'detail') {
  if (LG.ty !== 'other' && LG.opt < 0) return up({ err: 'Pick one. If you are not sure, choose Not sure.' });
  if (ty.amount && !LG.dk && LG.amt <= 0) return up({ err: 'Add how much you used, or tap I don\'t know.' });
  return go('where'); }
 if (LG.st === 'where') { if (!LG.all && LG.wh.length === 0) return up({ err: 'Tap the squares where it happened, or choose Whole field.' }); return go('photo'); }
 if (LG.st === 'photo') { if (LG.ty === 'photo' && LG.ph !== 1) return up({ err: 'Add a photo to save this note.' }); return set({ lg: Object.assign({}, LG, { st: 'done', err: '', saved: true }), td: LG.ty === 'water' ? Object.assign({}, S.td, { water: true }) : S.td }); } };
const back = () => go(flow[Math.max(0, si - 1)]);
const dirty = !!LG.ty;
const close = () => (dirty && LG.st !== 'done' ? up({ conf: true }) : set({ lg: Object.assign({}, LG, { open: false }) }));
const sug = LG.ty === 'feed' && LG.opt >= 0 ? SUG[LG.opt] : null;
const tooMuch = !!(sug && LG.amt > sug[1] * 2);
const unit = LG.ty === 'spray' ? 'ml per feddan' : 'kg per feddan';
const types = Object.keys(T).map((k) => ({ label: T[k].label, sub: T[k].sub, cls: 'tbtn press' + (LG.ty === k ? ' on' : ''), pressed: String(LG.ty === k), is_water: k === 'water', is_feed: k === 'feed', is_spray: k === 'spray', is_pest: k === 'pest', is_leaf: k === 'leaf', is_photo: k === 'photo', is_other: k === 'other', pick: () => up({ ty: k, opt: -1, amt: k === 'feed' ? 50 : (k === 'spray' ? 0 : 0), dk: false, err: '' }), k }));
const opts = ty ? ty.opts.map((o, j) => ({ label: o[0], sub: o[1], pic: o[2] || '', hasPic: !!o[2], p_leaf_yellow: o[2] === 'leaf-yellow', p_leaf_orange: o[2] === 'leaf-orange', p_leaf_brown: o[2] === 'leaf-brown', p_leaf_tips: o[2] === 'leaf-tips', p_leaf_white: o[2] === 'leaf-white', p_leaf_unsure: o[2] === 'leaf-unsure', p_bug_aphid: o[2] === 'bug-aphid', p_bug_worm: o[2] === 'bug-worm', p_bug_mite: o[2] === 'bug-mite', p_bug_hopper: o[2] === 'bug-hopper', p_bug_unsure: o[2] === 'bug-unsure', cls: 'obtn press' + (LG.opt === j ? ' on' : ''), pressed: String(LG.opt === j), pick: () => up({ opt: j, err: '', amt: LG.ty === 'feed' && SUG[j] ? Math.round((SUG[j][0] + SUG[j][1]) / 2 / 5) * 5 : LG.amt }) })) : [];
const SQ = ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3', 'A4', 'B4', 'C4'];
const mini = SQ.map((n, i) => { const on = LG.all || LG.wh.includes(i); return { label: n, pressed: String(on), st: on ? 'background: #141A16; color: #fff;' : 'background: rgba(255,255,255,.55); color: #141A16;',
 pick: () => up({ all: false, err: '', wh: LG.wh.includes(i) ? LG.wh.filter((x) => x !== i) : LG.wh.concat([i]) }) }; });
const whens = [['today', 'Today'], ['yesterday', 'Yesterday'], ['date', 'Pick a date']].map(([id, l]) => ({ label: l, cls: 'opt' + (LG.when === id ? ' on' : ''), pressed: String(LG.when === id), pick: () => up({ when: id }) }));
const where = LG.all ? 'whole field' : (LG.wh.length ? LG.wh.map((i) => SQ[i]).join(', ') : '');
const optName = ty && LG.opt >= 0 ? ty.opts[LG.opt][0] : '';
const R = (() => {
 const t = LG.ty, o = optName;
 if (t === 'water') return o === 'Heavy' ? ['Got it. The soil is wet again, about 0.33. Today\'s watering is ticked on your to-do.', 'Next watering', 'Today', 'About Sun 13 Dec'] : ['Got it. Today\'s watering is ticked on your to-do.', 'Next watering', 'Today', 'About Sun 13 Dec'];
 if (t === 'feed') return ['Saved: ' + (LG.dk ? 'amount unknown' : LG.amt + ' kg ' + o.toLowerCase()) + ' on the ' + (where || 'field') + '.' + (sug && !LG.dk ? (tooMuch ? ' That is more than double the usual amount. Your engineer will see this note.' : ' That is inside the usual range.') : ''), 'Next feeding', 'Mon 7 Dec', 'Mon 7 Dec, as planned'];
 if (t === 'spray') return ['Saved. We will pause rust alerts for 10 days while the spray works.', 'Rust alerts', 'On', 'Paused until 13 Dec'];
 if (t === 'pest') return o === 'Aphids' ? ['Aphids are common now and rarely serious at this stage. We will remind you to check the same squares in 3 days.', 'Reminder', '—', 'Check ' + (where || 'field') + ' on Sun 6 Dec'] : ['Thanks. Your engineer will see this. A close photo helps them tell what it is.', '', '', ''];
 if (t === 'leaf') return o === 'Orange spots' ? ['Orange spots in this cool, damp week often mean rust. Your engineer has been told. Check other squares tomorrow.', 'Rust risk', 'Medium', 'High'] : (o === 'Yellow leaves' ? ['Yellow leaves in one corner usually mean the water reaches it late. This matches what we see from space in C1.', '', '', ''] : ['Saved. Your engineer will see this note.', '', '', '']);
 return ['Saved to your journal.', '', '', '']; })();
const JR = [{ k: 'leaf', d: '30 Nov', t: 'Yellow leaves', w: 'C1', o: 'Matches what we see from space' }, { k: 'pest', d: '29 Nov', t: 'Aphids, fewer', w: 'B2, C2', o: 'No spray needed' }, { k: 'pest', d: '26 Nov', t: 'Aphids', w: 'B2, C2', o: 'Reminder set' }];
const jIcons = { water: 'water', leaf: 'leaf', feed: 'feed', pest: 'pest', spray: 'spray', photo: 'photo', other: 'other' };

const TD = S.td, TA = S.ta;
const TASKS = [
 { id: 'water', t: 'Water the whole field', s: 'About 300 m³ per feddan. The soil has reached the point where it needs water.', ds: 'Soil water 0.24 m³/m³, refill line 0.25. No rain in the next 7 days.', g: 'Protects about 8–12% of your harvest', tag: 'From space', tc: 'pq sat' },
 { id: 'c1', t: 'Look at the leaves in square C1', s: 'You saw yellow leaves there on 30 Nov. Check if it has spread.', ds: 'NDVI 0.24, 24% under the field. Weak in 7 of 10 seasons.', g: '', tag: 'From your journal', tc: 'pq farm', ask: ['Looks better', 'Same as before', 'Got worse'] },
 { id: 'aphid', t: 'Check B2 and C2 for aphids', s: 'Reminder from your note on 26 Nov.', ds: 'Aphid risk: Low. You saw fewer on 29 Nov.', g: '', tag: 'From your journal', tc: 'pq farm', ask: ['None', 'A few', 'Many'] } ];
const flip = (id) => set({ td: Object.assign({}, TD, { [id]: !TD[id] }), ta: TD[id] ? Object.assign({}, TA, { [id]: '' }) : TA });
const todo = TASKS.map((k) => ({ t: k.t, s: k.s, ds: k.ds, g: k.g, hasG: !!k.g, tag: k.tag, tc: k.tc, cls: 'tdrow' + (TD[k.id] ? ' done' : ''), box: 'tbox press' + (TD[k.id] ? ' on' : ''), checked: String(!!TD[k.id]),
 toggle: () => flip(k.id), label: (TD[k.id] ? 'Mark not done: ' : 'Mark done: ') + k.t,
 askOpen: !!(TD[k.id] && k.ask && !TA[k.id]), answered: TD[k.id] && TA[k.id] ? 'Saved to your journal: ' + TA[k.id].toLowerCase() + '.' : '', hasAnswer: !!(TD[k.id] && TA[k.id]),
 asks: (k.ask || []).map((a) => ({ label: a, pick: () => set({ ta: Object.assign({}, TA, { [k.id]: a }) }) })), askQ: k.id === 'c1' ? 'How did C1 look?' : 'What did you find?' }));
const nDone = TASKS.filter((k) => TD[k.id]).length;
const tdNotes = [];
if (TD.water && !(LG.saved && LG.ty === 'water')) tdNotes.push({ k: 'water', d: 'Today', t: 'Watered, whole field', w: 'Whole field', o: 'Next watering about Sun 13 Dec' });
if (TA.c1) tdNotes.push({ k: 'leaf', d: 'Today', t: 'C1 leaves: ' + TA.c1.toLowerCase(), w: 'C1', o: TA.c1 === 'Got worse' ? 'Your engineer has been told' : 'We keep watching C1 from space' });
if (TA.aphid) tdNotes.push({ k: 'pest', d: 'Today', t: 'Aphids: ' + TA.aphid.toLowerCase(), w: 'B2, C2', o: TA.aphid === 'Many' ? 'Your engineer will call you' : 'No spray needed' });
const recent = tdNotes.concat(LG.saved && LG.ty ? [{ k: LG.ty, d: 'Just now', t: ty.label + (optName ? ', ' + optName.toLowerCase() : ''), w: where || 'Field', o: R[1] ? R[1] + ': ' + R[3] : 'Saved' }] : []).concat(JR).slice(0, 3)
 .map((r) => Object.assign({}, r, { cls: 'jic ' + jIcons[r.k], isWater: r.k === 'water', isLeaf: r.k === 'leaf', isFeed: r.k === 'feed', isPest: r.k === 'pest', isSpray: r.k === 'spray', isPhoto: r.k === 'photo' || r.k === 'other' }));
const CK = S.ck;
return Object.assign(MAPV, { lg: LG.open, lgConf: !!LG.conf, stWhat: LG.st === 'what', stDetail: LG.st === 'detail', stWhere: LG.st === 'where', stPhoto: LG.st === 'photo', stDone: LG.st === 'done', notDoneStep: LG.st !== 'done',
 stepTxt: 'Step ' + (si + 1) + ' of ' + flow.length, stepBars: flow.map((_, j) => ({ cls: j <= si ? 'on' : '' })), hasBack: si > 0 && LG.st !== 'done', back, next, nextLabel: LG.st === 'photo' ? 'Save note' : 'Next',
 close, keep: () => up({ conf: false }), discard: () => set({ lg: { open: false, st: 'what', ty: null, opt: -1, amt: 0, dk: false, wh: [], all: false, when: 'today', ph: 0, err: '', conf: false, saved: false } }),
 openLog: () => set({ lg: { open: true, st: 'what', ty: null, opt: -1, amt: 0, dk: false, wh: [], all: false, when: 'today', ph: 0, err: '', conf: false, saved: false } }),
 openLeaf: () => set({ ck: 'yes', lg: { open: true, st: 'detail', ty: 'other', opt: -1, amt: 0, dk: false, wh: [9], all: false, when: 'today', ph: 0, err: '', conf: false, saved: false } }),
 ckAsk: CK === 'ask', ckNo: CK === 'no', ckUnsure: CK === 'unsure', ckYes: CK === 'yes', ckSayNo: () => set({ ck: 'no' }), ckSayUnsure: () => set({ ck: 'unsure' }),
 err: LG.err, hasErr: !!LG.err, types, opts, hasOpts: opts.length > 0, isOther: LG.ty === 'other', q: ty ? ty.q : '', tyLabel: ty ? ty.label : '',
 hasAmount: !!(ty && ty.amount), amt: LG.dk ? '—' : LG.amt, unit, minus: () => up({ amt: Math.max(0, LG.amt - 5), dk: false }), plus: () => up({ amt: LG.amt + 5, dk: false }), dkCls: 'opt' + (LG.dk ? ' on' : ''), dkTap: () => up({ dk: !LG.dk, err: '' }),
 hasSug: !!sug && !LG.dk, sugTxt: sug ? sug[0] + '–' + sug[1] + ' kg ' + optName.toLowerCase() + ' per feddan' : '', tooMuch: tooMuch && !LG.dk, isSpray: LG.ty === 'spray',
 mini, allCls: 'opt' + (LG.all ? ' on' : ''), allTap: () => up({ all: !LG.all, wh: [], err: '' }), whens,
 phNone: LG.ph === 0, phOk: LG.ph === 1, phErr: LG.ph === 2, addPh: () => up({ ph: 1, err: '' }), badPh: () => up({ ph: 2 }), rmPh: () => up({ ph: 0 }), photoOptional: LG.ty !== 'photo',
 rMsg: R[0], rHasChange: !!R[1], rWhat: R[1], rFrom: R[2], rTo: R[3], undoSave: () => set({ lg: Object.assign({}, LG, { open: false, saved: false }), toast: 'Note removed from your journal.' }),
 doneTap: () => set({ lg: Object.assign({}, LG, { open: false }), toast: 'Saved to your journal.' }), again: () => set({ lg: { open: true, st: 'what', ty: null, opt: -1, amt: 0, dk: false, wh: [], all: false, when: 'today', ph: 0, err: '', conf: false, saved: true } }),
 recent, todo, nDone: nDone + ' of 3 done', progW: 'width: ' + Math.round(nDone / 3 * 100) + '%;', allDone: nDone === 3, notAllDone: nDone < 3, waterDone: !!TD.water, waterTodo: !TD.water, toast: S.toast, hasToast: !!S.toast, closeToast: () => set({ toast: '' }) });
 })();
return Object.assign(base, extra || {});
}
}
