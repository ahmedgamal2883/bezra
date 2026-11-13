/* eslint-disable */
// Logic from design/html/V11-Onboarding.html (crop chips, accuracy), extended to the 4 steps of the
// step bar: 1 Your field, 2 Basics (the designed screen), 3 More accurate, 4 Expert.
// Steps 3 and 4 ask exactly the Level 2 / Level 3 items shown on the Profile screen.
import { DCLogic } from '@/lib/dc';

const seg = (cur, id, set, key) => ({ cls: 'segb press' + (cur === id ? ' on' : ''), p: String(cur === id), pick: () => set({ [key]: id }) });
const chip = (on) => 'height: 48px; padding: 0 10px; border: 0; border-radius: 12px; font-size: 14px; font-weight: 600; ' + (on ? 'background: #17251C; color: #fff;' : 'background: #F4F4F1; color: #141A16;');

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { crop: 'Wheat', tenure: 'tenant', variety: 'Sakha 95', mesqa: 'tail', step: props.initialStep || 1 }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => {
const C = ['Wheat', 'Maize', 'Rice', 'Berseem', 'Cotton', 'Sugar beet', 'Other'];
const crops = C.map((l) => ({ label: l, p: String(S.crop === l), pick: () => set({ crop: l }), style: chip(S.crop === l) }));
const V = ['Sakha 95', 'Giza 171', 'Misr 3', 'Other'];
const varieties = V.map((l) => ({ label: l, p: String(S.variety === l), pick: () => set({ variety: l }), style: chip(S.variety === l) }));
// Accuracy grows as levels are filled (Profile shows 58% once Level 2 is in).
const acc = S.step >= 3 ? 58 : (S.crop ? 42 : 30);
const accAr = acc >= 75 ? 'دقة عالية' : (acc > 40 ? 'دقة متوسطة' : 'دقة قليلة');
const steps = [['Your field', 1], ['Basics', 2], ['More accurate', 3], ['Expert', 4]].map(([label, n]) => ({
  label, n, done: n < S.step, cur: n === S.step, todo: n > S.step,
  textColor: n <= S.step ? 'var(--ink)' : 'var(--muted)',
  dot: 'width: 26px; height: 26px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 12px; ' + (n < S.step ? 'background: var(--green); color: #fff;' : n === S.step ? 'background: var(--dark); color: #fff;' : 'background: #fff;'),
}));
return { crop: S.crop, variety: S.variety, mesqaPick: S.mesqa, tenurePick: S.tenure, crops, varieties, acc, accAr, steps, step: S.step,
  tenure: { owner: seg(S.tenure, 'owner', set, 'tenure'), tenant: seg(S.tenure, 'tenant', set, 'tenure') },
  mesqa: ['head', 'middle', 'tail'].reduce((o, m) => (o[m] = seg(S.mesqa, m, set, 'mesqa'), o), {}),
  goStep: (n) => () => { set({ step: n }); window.scrollTo(0, 0); },
  accBar: 'display: block; height: 100%; width: ' + acc + '%; border-radius: 4px; background: #F29B1E; transition: width .6s cubic-bezier(.16,1,.3,1);' };
 })();
return Object.assign(base, extra || {});
}
}
