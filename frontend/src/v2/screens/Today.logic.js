/* eslint-disable */
// Today (design-handoff/design/source/V18-Today.dc.html), wired to the API.
// Layout, states and copy rules are the design's; every value comes from props.d (src/v2/data/today.ts).
// Nothing from the design's story (Thursday 3 December, 2.4 feddan, C1, A4...) is shown: while a part is loading
// it is empty and the screen shows its skeleton.
import { DCLogic } from '@/lib/dc';

// Fertiliser range per feddan per dose, wheat (MALR: about 75 kg N per feddan in 2-3 doses before the water turns;
// P and K at land preparation). Shown with "Check the amount with your engineer". Never a spray dose.
const FEED = [['Urea', '46% nitrogen', [55, 80]], ['Ammonium nitrate', '33% nitrogen', [75, 110]], ['Superphosphate', 'Phosphorus', [100, 150]],
  ['Potassium sulphate', 'Potassium', [25, 50]], ['Manure', 'Farm manure', null], ['Other', 'Something else', null]];
const EMPTY_LOG = { open: false, st: 'what', ty: null, opt: -1, amt: 0, dk: false, wh: [], all: false, when: 'today', ph: 0, err: '', conf: false, saved: false, busy: false, note: '' };

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { sel: null, layer: 'green', date: 0, done: false, ck: 'ask', ckMsg: '', toast: '', lg: Object.assign({}, EMPTY_LOG), td: {}, ta: {} }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const D = this.props.d || {};
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const toast = (t) => set({ toast: t });
const extra = (() => {
// ---------------- map ----------------
const Q = D.squares;
const inside = Q ? Q.cells.filter((c) => c.cls !== 'outside' && c.ndvi != null) : [];
const LAY = {
 green: { name: 'Greenness', unit: 'NDVI', key: 'ndvi', src: Q ? Q.source : '', f: (v) => v.toFixed(2) },
 growth: { name: 'Growth', unit: 'EVI', key: 'evi', src: Q ? Q.source : '', f: (v) => v.toFixed(2) },
 water: { name: 'Leaf water', unit: 'NDMI', key: 'ndmi', src: Q ? Q.source : '', f: (v) => v.toFixed(2) } };
const PAL = { green: ['#E0A43A', '#C9C77A', '#7FA65A', '#3E7F35'], growth: ['#E0A43A', '#C9C77A', '#7FA65A', '#3E7F35'], water: ['#C9A46A', '#B7C9D8', '#6E9CC4', '#2F6FA8'] };
const INK = ['#141A16', '#141A16', '#FFFFFF', '#FFFFFF'];
const LEG = ['well under the field', 'a little under', 'like the rest', 'above the field'];
const lay = LAY[S.layer] ? S.layer : 'green', L = LAY[lay];
const med = Q ? (Q.medians[L.key] || Q.median) : 0;
const dcls = (v) => { if (v == null || !med) return 1; const p = (v - med) / Math.abs(med); return p < -0.08 ? 0 : p < -0.03 ? 1 : p < 0.03 ? 2 : 3; };
const SIMPLE = { pal: ['#E8962C', '#D9DE9C', '#3E7F35'], k: (c) => (c.cls === 'less' ? 0 : c.cls === 'more' ? 2 : 1) };
const cols = Q ? Q.cols : 3, rows = Q ? Q.rows : 4, cw = 160 / cols, ch = 220 / rows;
const weakest = inside.length ? inside.reduce((a, b) => (b.ndvi < a.ndvi ? b : a)) : null;
const selCell = Q ? (Q.cells.find((c) => c.r * cols + c.c === S.sel && c.cls !== 'outside') || weakest) : null;
const cells = Q ? Q.cells.map((c) => {
 const i = c.r * cols + c.c, out = c.cls === 'outside' || c.ndvi == null, sel = selCell && selCell === c;
 const x = 605 + c.c * cw, y = 120 + c.r * ch, cx = x + cw / 2, cy = y + ch / 2;
 const v = c[L.key], k = details ? dcls(v) : SIMPLE.k(c);
 const pick = () => { if (!out) set({ sel: i }); };
 return { x: x.toFixed(1), y: y.toFixed(1), w: out ? '0' : cw.toFixed(1), h: out ? '0' : ch.toFixed(1), cx: cx.toFixed(1), cy: cy.toFixed(1), tf: '',
  fill: out ? 'transparent' : (details ? PAL[lay][k] : SIMPLE.pal[k]), op: out ? '0' : (sel ? '.95' : '.62'),
  ink: details ? INK[k] : '#141A16', tOp: details && !out ? '1' : '0', label: details && v != null ? L.f(v) : '',
  aria: out ? 'Square ' + c.name + ', outside your field' : (details ? 'Square ' + c.name + ', ' + L.name + ' ' + (v != null ? L.f(v) : 'no reading') : ['Needs a look', 'Normal', 'Good'][SIMPLE.k(c)] + ', square ' + c.name),
  pressed: String(!!sel), tap: pick, key: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } } };
}) : [];
const sk = selCell ? SIMPLE.k(selCell) : 1;
const sv = selCell ? selCell[L.key] : null;
const diff = selCell && sv != null && med ? Math.round((sv - med) / Math.abs(med) * 100) : 0;
const gDiff = selCell && Q ? Math.round((selCell.ndvi - Q.median) / Q.median * 100) : 0;
const imgDay = Q ? D.dayMonth(Q.date) : '';
const simpleCard = !selCell ? { t: '', d: '', act: false } : [
 { t: 'This square is less green than the rest.', d: 'Square ' + selCell.name + ' is ' + Math.abs(gDiff) + '% under the rest of your field in the image of ' + imgDay + '. Walk to it and look at the leaves.', act: true },
 { t: 'This square is normal.', d: 'Close to the rest of your field. Nothing to do here.', act: false },
 { t: 'This square is doing well.', d: 'One of the greenest parts of your field. Keep going.', act: false }][sk];
const mx = selCell ? 605 + selCell.c * cw + cw / 2 : 0, my = selCell ? 120 + selCell.r * ch + Math.min(12, ch / 3) : 0;
const layers = Object.keys(LAY).map((id) => ({ label: LAY[id].name, cls: lay === id ? 'on' : '', pressed: String(lay === id), pick: () => set({ layer: id }) }));
const dates = Q ? [{ label: imgDay, cls: 'on', pressed: 'true', pick: () => {} }] : [];
const legend = LEG.map((t, j) => ({ t, sw: 'background: ' + PAL[lay][j] + ';' })).reverse();
const fieldName = D.head ? D.head.name : '';
const MAPV = { photo: D.photo, outline: D.outline, mapReady: !!Q, cells,
 mapLabel: details ? fieldName + ', ' + inside.length + ' squares of 30 m, coloured by ' + L.name : 'Your field from space, ' + inside.length + ' squares of 30 m',
 dim: false, mark: selCell ? 'translate(' + mx.toFixed(1) + ' ' + my.toFixed(1) + ')' : 'translate(-99 -99)', hasSel: !!selCell,
 sTitle: simpleCard.t, sDesc: simpleCard.d, sAct: simpleCard.act, sHist: [],
 dName: selCell ? 'Square ' + selCell.name + ' · 30 × 30 m' : '', dVal: sv != null ? L.f(sv) : '—', dUnit: L.unit, dAvg: med ? L.f(med) : '—',
 dDiff: (diff > 0 ? '+' : '') + diff + '% vs field', dWeak: D.images ? D.images + ' clear images of this field this season' : '', dHist: [], dSrc: (L.src || '') + (imgDay ? ' · ' + imgDay : ''), dLayer: L.name,
 layers, dates, legend, done: S.done, notDone: !S.done, doIt: () => set({ done: true }), undo: () => set({ done: false }) };

// ---------------- journal drawer ----------------
const T = {
 water: { label: 'Watered', sub: 'Extra or normal watering', ic: 'drop', q: 'How much water?', opts: [['Light', 'Only the top got wet'], ['Normal', 'A usual watering'], ['Heavy', 'Water stood on the field']] },
 feed: { label: 'Fed the crop', sub: 'Fertiliser or manure', ic: 'sprout', q: 'What did you put on?', opts: FEED.map((o) => [o[0], o[1]]), amount: true },
 spray: { label: 'Sprayed', sub: 'Against disease, bugs or weeds', ic: 'shield', q: 'What kind of spray?', opts: [['For disease', 'Fungicide'], ['For bugs', 'Insecticide'], ['For weeds', 'Weed killer'], ['Not sure', '']], amount: true, sprayAmt: true },
 pest: { label: 'Saw a pest', sub: 'Bugs, worms, anything that eats', ic: 'bug', q: 'Which one looks closest?', opts: [['Aphids', 'Tiny green bugs', 'bug-aphid'], ['Caterpillar', 'Worm on leaves', 'bug-worm'], ['Mites', 'Tiny red dots', 'bug-mite'], ['Grasshopper', '', 'bug-hopper'], ['Not sure', '', 'bug-unsure']] },
 leaf: { label: 'Leaves look wrong', sub: 'Odd colour, spots or marks', ic: 'leaf', q: 'Which one looks closest?', opts: [['Yellow leaves', '', 'leaf-yellow'], ['Orange spots', '', 'leaf-orange'], ['Brown patches', '', 'leaf-brown'], ['Dry tips', '', 'leaf-tips'], ['White powder', '', 'leaf-white'], ['Not sure', '', 'leaf-unsure']] },
 other: { label: 'Something else', sub: 'Anything worth noting', ic: 'edit', q: 'What happened?', opts: [] } };
const LG = S.lg, ty = LG.ty ? T[LG.ty] : null;
const flow = ['what', 'detail', 'where'];
const si = Math.max(0, flow.indexOf(LG.st));
const up = (o) => set({ lg: Object.assign({}, LG, o) });
const go = (st) => up({ st, err: '' });
const SQN = inside.map((c) => c.name);
const optName = ty && LG.opt >= 0 ? ty.opts[LG.opt][0] : '';
const where = LG.all ? 'whole field' : (LG.wh.length ? LG.wh.join(', ') : '');
const sug = LG.ty === 'feed' && LG.opt >= 0 ? FEED[LG.opt][2] : null;
const tooMuch = !!(sug && LG.amt > sug[1] * 2);
const when = () => { const t = D.today; if (!t) return t; if (LG.when === 'yesterday') { const d = new Date(t + 'T12:00:00'); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); } return t; };
const save = async () => {
 const t = LG.ty, tags = LG.all ? ['whole field'] : LG.wh.slice();
 const body = t === 'water' ? { kind: 'water', date: when(), note: optName ? optName + ' watering' : null, tags }
  : t === 'feed' ? { kind: 'fertilizer', date: when(), amount: LG.dk ? null : LG.amt, unit: LG.dk ? null : 'kg per feddan', note: optName, tags }
  : t === 'spray' ? { kind: 'spray', date: when(), note: optName, tags }
  : t === 'pest' ? { kind: 'observe', date: when(), note: 'Pest: ' + optName, tags: tags.concat(['pest']) }
  : t === 'leaf' ? { kind: 'observe', date: when(), note: 'Leaves: ' + optName, tags: tags.concat(['leaf']) }
  : { kind: 'note', date: when(), note: LG.note || 'Note', tags };
 up({ busy: true, err: '' });
 const prevTurn = D.nextTurn || null; try { await D.act.saveLog(body); set({ lg: Object.assign({}, S.lg, { st: 'done', err: '', saved: true, busy: false, last: { kind: body.kind, date: body.date }, prevTurn }) }); }
 catch (e) { set({ lg: Object.assign({}, S.lg, { busy: false, err: 'Could not save. ' + (e && e.message && !/^\d+$/.test(e.message) ? e.message : 'Check your connection and try again.') }) }); }
};
const next = () => {
 if (LG.busy) return;
 if (LG.st === 'what') { if (!LG.ty) return up({ err: 'Pick what happened.' }); return go('detail'); }
 if (LG.st === 'detail') {
  if (LG.ty !== 'other' && LG.opt < 0) return up({ err: 'Pick one. If you are not sure, choose Not sure.' });
  if (LG.ty === 'other' && !LG.note.trim()) return up({ err: 'Write a few words about what happened.' });
  if (ty.amount && !ty.sprayAmt && !LG.dk && LG.amt <= 0) return up({ err: 'Add how much you used, or tap I don\'t know.' });
  return go('where'); }
 if (LG.st === 'where') { if (!LG.all && LG.wh.length === 0) return up({ err: 'Tap the squares where it happened, or choose Whole field.' }); return save(); } };
const back = () => go(flow[Math.max(0, si - 1)]);
const dirty = !!LG.ty;
const close = () => (dirty && LG.st !== 'done' ? up({ conf: true }) : set({ lg: Object.assign({}, LG, { open: false }) }));
const unit = 'kg per feddan';
const types = Object.keys(T).map((k) => ({ label: T[k].label, sub: T[k].sub, cls: 'tbtn press' + (LG.ty === k ? ' on' : ''), pressed: String(LG.ty === k), is_water: k === 'water', is_feed: k === 'feed', is_spray: k === 'spray', is_pest: k === 'pest', is_leaf: k === 'leaf', is_photo: false, is_other: k === 'other', pick: () => up({ ty: k, opt: -1, amt: 0, dk: false, err: '' }), k }));
const opts = ty ? ty.opts.map((o, j) => ({ label: o[0], sub: o[1], pic: o[2] || '', hasPic: !!o[2], p_leaf_yellow: o[2] === 'leaf-yellow', p_leaf_orange: o[2] === 'leaf-orange', p_leaf_brown: o[2] === 'leaf-brown', p_leaf_tips: o[2] === 'leaf-tips', p_leaf_white: o[2] === 'leaf-white', p_leaf_unsure: o[2] === 'leaf-unsure', p_bug_aphid: o[2] === 'bug-aphid', p_bug_worm: o[2] === 'bug-worm', p_bug_mite: o[2] === 'bug-mite', p_bug_hopper: o[2] === 'bug-hopper', p_bug_unsure: o[2] === 'bug-unsure', cls: 'obtn press' + (LG.opt === j ? ' on' : ''), pressed: String(LG.opt === j), pick: () => up({ opt: j, err: '', amt: LG.ty === 'feed' && FEED[j][2] ? Math.round((FEED[j][2][0] + FEED[j][2][1]) / 2 / 5) * 5 : LG.amt }) })) : [];
const mini = SQN.map((n) => { const on = LG.all || LG.wh.includes(n); return { label: n, pressed: String(on), st: on ? 'background: #141A16; color: #fff;' : 'background: rgba(255,255,255,.55); color: #141A16;',
 pick: () => up({ all: false, err: '', wh: LG.wh.includes(n) ? LG.wh.filter((x) => x !== n) : LG.wh.concat([n]) }) }; });
const whens = [['today', 'Today'], ['yesterday', 'Yesterday']].map(([id, l]) => ({ label: l, cls: 'opt' + (LG.when === id ? ' on' : ''), pressed: String(LG.when === id), pick: () => up({ when: id }) }));
const R = (() => {
 const t = LG.ty, o = optName;
 if (t === 'water') { const a = LG.prevTurn, b = D.nextTurn; return ['Got it. Your watering is in the journal and the water plan now starts from it.', a && b && a !== b ? 'Next watering' : '', a && b && a !== b ? a : '', a && b && a !== b ? 'About ' + b : '']; }
 if (t === 'feed') return ['Saved: ' + (LG.dk ? 'amount not known' : LG.amt + ' kg ' + o.toLowerCase() + ' per feddan') + (where ? ' on the ' + where : '') + '.' + (sug && !LG.dk ? (tooMuch ? ' That is more than double the usual amount. Check it with your engineer.' : (LG.amt > sug[1] ? ' A little above the usual range.' : ' That is inside the usual range.')) : ''), '', '', ''];
 if (t === 'spray') return ['Saved. Your engineer can see what you sprayed and when.', '', '', ''];
 if (t === 'pest') return [o === 'Aphids' ? 'Aphids are common now and rarely serious at this stage. Look at the same squares again in a few days.' : 'Saved. A close photo helps your engineer tell what it is.', '', '', ''];
 if (t === 'leaf') return [o === 'Orange spots' ? 'Orange spots in a cool, damp week can mean rust. Check other squares tomorrow, and tell your engineer.' : (o === 'Yellow leaves' ? 'Yellow leaves in one part of the field often mean water reaches it late. We keep watching it from space.' : 'Saved. Your engineer will see this note.'), '', '', ''];
 return ['Saved to your journal.', '', '', '']; })();

// ---------------- to-do ----------------
const TD = S.td, TA = S.ta;
const TASKS = D.todo || [];
const isDone = (k) => (k.id in TD ? TD[k.id] : k.done);
const flip = async (k) => {
 const now = !isDone(k);
 set({ td: Object.assign({}, TD, { [k.id]: now }) });
 if (!now) {
  try { await D.act.undoTask(k.id); set({ toast: 'Unticked. It is back on your to-do.' }); }
  catch (e) { set({ td: Object.assign({}, S.td, { [k.id]: true }), toast: 'Could not untick. Check your connection and try again.' }); }
  return;
 }
 try { await D.act.answerTask(k.id, 'done'); }
 catch (e) { set({ td: Object.assign({}, S.td, { [k.id]: false }), toast: 'Could not save. Check your connection and try again.' }); }
};
const todo = TASKS.map((k) => ({ t: k.t, s: k.s, ds: k.ds, g: k.g, hasG: !!k.g, pl: k.pl || '', wind: k.wind || '', tag: k.tag, tc: k.tc, cls: 'tdrow' + (isDone(k) ? ' done' : ''), box: 'tbox press' + (isDone(k) ? ' on' : ''), checked: String(!!isDone(k)),
 toggle: () => flip(k), label: (isDone(k) ? 'Done: ' : 'Mark done: ') + k.t,
 askOpen: !!(isDone(k) && k.ask && !TA[k.id]), answered: isDone(k) && TA[k.id] ? 'Saved to your journal: ' + TA[k.id].toLowerCase() + '.' : '', hasAnswer: !!(isDone(k) && TA[k.id]),
 asks: (k.ask || []).map((a) => ({ label: a, pick: () => set({ ta: Object.assign({}, TA, { [k.id]: a }) }) })), askQ: 'What did you find?' }));
const nDone = TASKS.filter(isDone).length, nAll = TASKS.length;
const waterTask = TASKS.find((k) => k.category === 'irrigation');
const waterDoneNow = !!(waterTask && isDone(waterTask));

// ---------------- journal snippet ----------------
const jIcons = { water: 'water', leaf: 'leaf', feed: 'feed', pest: 'pest', spray: 'spray', photo: 'photo', other: 'other' };
const recent = (D.recent || []).slice(0, 3).map((r) => Object.assign({}, r, { cls: 'jic ' + (jIcons[r.k] || 'other'), isWater: r.k === 'water', isLeaf: r.k === 'leaf', isFeed: r.k === 'feed', isPest: r.k === 'pest', isSpray: r.k === 'spray', isPhoto: r.k === 'photo' || r.k === 'other' }));

// ---------------- question of the week ----------------
const QW = D.question;
const CK = QW ? S.ck : 'none';
const ckYesTap = async () => {
 if (!QW) return;
 if (QW.kind === 'water') { try { await D.act.answerWater(QW.id, true, QW.on); set({ ck: 'yes', ckMsg: 'Thanks. The watering is in your journal and the water plan starts from it.' }); } catch (e) { toast('Could not save. Try again.'); } return; }
 set({ ck: 'yes', ckMsg: 'Thanks. Tell us what you saw, and where.', lg: Object.assign({}, EMPTY_LOG, { open: true, st: 'detail', ty: 'leaf' }) });
};
const ckNoTap = async () => {
 if (!QW) return;
 try { if (QW.kind === 'water') await D.act.answerWater(QW.id, false, QW.on); else await D.act.checkin(['good']); }
 catch (e) { return toast('Could not save. Try again.'); }
 set({ ck: 'no', ckMsg: QW.kind === 'water' ? 'Thanks. We will not count it as a watering.' : 'Good to hear. We will ask again next week.' });
};
const ckUnsureTap = () => set({ ck: 'unsure', ckMsg: QW && QW.kind === 'water' ? 'No problem. If you remember later, add it in your journal.' : 'No problem. Next time you pass the field, take a look.' });

const wk = (D.week || []).map((w) => ({ label: w.label, value: w.k === 'water' && waterDoneNow ? 'Done today' : w.value, sw: 'background: ' + (w.k === 'water' && waterDoneNow ? '#2E7D45' : w.tone) + ';', col: 'color: ' + (w.k === 'water' && waterDoneNow ? '#2E7D45' : w.tone) + ';' }));
const wkD = (D.weekD || []).map((w) => ({ label: w.label, value: w.k === 'water' && waterDoneNow ? 'Done today' : w.value, line: w.line || '', pl: w.pl || '', sw: 'background: ' + w.tone + ';', col: 'color: ' + w.tone + ';' }));
const kpis = D.kpis || [];
const coming = (D.coming || []);

return Object.assign(MAPV, { lg: LG.open, lgConf: !!LG.conf, stWhat: LG.st === 'what', stDetail: LG.st === 'detail', stWhere: LG.st === 'where', stPhoto: false, stDone: LG.st === 'done', notDoneStep: LG.st !== 'done',
 stepTxt: 'Step ' + (si + 1) + ' of ' + flow.length, stepBars: flow.map((_, j) => ({ cls: j <= si ? 'on' : '' })), hasBack: si > 0 && LG.st !== 'done', back, next, nextLabel: LG.st === 'where' ? (LG.busy ? 'Saving…' : 'Save note') : 'Next',
 close, keep: () => up({ conf: false }), discard: () => set({ lg: Object.assign({}, EMPTY_LOG) }),
 openLog: () => set({ lg: Object.assign({}, EMPTY_LOG, { open: true }) }),
 openLeaf: ckYesTap, ckAsk: CK === 'ask', ckNo: CK === 'no', ckUnsure: CK === 'unsure', ckYes: CK === 'yes', ckSayNo: ckNoTap, ckSayUnsure: ckUnsureTap, ckMsg: S.ckMsg,
 ckLabel: QW ? QW.label : '', ckQ: QW ? QW.q : '', ckYesBtn: QW ? QW.yes : '', ckNoBtn: QW ? QW.no : '',
 err: LG.err, hasErr: !!LG.err, types, opts, hasOpts: opts.length > 0, isOther: LG.ty === 'other', q: ty ? ty.q : '', tyLabel: ty ? ty.label : '',
 note: LG.note, setNote: (e) => up({ note: e.target.value, err: '' }),
 hasAmount: !!(ty && ty.amount && !ty.sprayAmt), amt: LG.dk ? '—' : LG.amt, unit, minus: () => up({ amt: Math.max(0, LG.amt - 5), dk: false }), plus: () => up({ amt: LG.amt + 5, dk: false }), dkCls: 'opt' + (LG.dk ? ' on' : ''), dkTap: () => up({ dk: !LG.dk, err: '' }),
 hasSug: !!sug && !LG.dk, sugTxt: sug ? sug[0] + '–' + sug[1] + ' kg ' + optName.toLowerCase() + ' per feddan' : '', tooMuch: tooMuch && !LG.dk, isSpray: LG.ty === 'spray',
 mini, allCls: 'opt' + (LG.all ? ' on' : ''), allTap: () => up({ all: !LG.all, wh: [], err: '' }), whens,
 phNone: true, phOk: false, phErr: false, addPh: () => {}, badPh: () => {}, rmPh: () => {}, photoOptional: true,
 rMsg: R[0], rHasChange: !!R[1], rWhat: R[1], rFrom: R[2], rTo: R[3], undoSave: async () => { const L0 = LG.last; set({ lg: Object.assign({}, LG, { open: false }) }); if (!L0) return; try { await D.act.undoLastLog(L0.kind, L0.date); toast('Note removed from your journal.'); } catch (e) { toast('Could not remove the note. Delete it from your journal.'); } },
 doneTap: () => set({ lg: Object.assign({}, LG, { open: false }), toast: 'Saved to your journal.' }), again: () => set({ lg: Object.assign({}, EMPTY_LOG, { open: true, saved: true }) }),
 recent, hasRecent: recent.length > 0, noRecent: !!D.recent && recent.length === 0,
 todo, todoLoading: !D.todo, weekLoading: !D.week, hasTodo: nAll > 0, noTodo: !!D.todo && nAll === 0, nDone: nDone + ' of ' + nAll + ' done', progW: 'width: ' + (nAll ? Math.round(nDone / nAll * 100) : 0) + '%;', allDone: nAll > 0 && nDone === nAll, notAllDone: nDone < nAll,
 allDoneTxt: 'All done for today.' + (coming[0] ? ' Next: ' + coming[0].t.toLowerCase() + ' on ' + coming[0].d + '.' : ''),
 waterDone: waterDoneNow, waterTodo: !waterDoneNow,
 coming, comingTxt: 'Coming up · ' + coming.length + (coming.length === 1 ? ' task' : ' tasks'), hasComing: coming.length > 0,
 wk, wkD, kpis, hasWeek: wk.length > 0,
 headName: D.head ? D.head.name : '', headSub: D.head ? D.head.sub : '', fresh: D.fresh || '', dateLong: D.dateLong || '', todoTitle: D.todoTitle || '', sortedBy: D.sortedBy || '',
 headT: D.headline ? D.headline.t : '', headS: D.headline ? D.headline.s : '', headReady: !!(D.head && D.headline), headLoading: !(D.head && D.headline),
 toast: S.toast, hasToast: !!S.toast, closeToast: () => set({ toast: '' }) });
 })();
return Object.assign(base, extra || {});
}
}
