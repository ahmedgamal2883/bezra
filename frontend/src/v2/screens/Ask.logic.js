/* eslint-disable */
// Logic from design-handoff/design/source/V18-Ask.dc.html (verbatim at conversion; design props: {"details":{"editor":"boolean","default":false},"$preview":{"width":1440,"height":1000}}).
import { DCLogic } from '@/lib/dc';

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, { cv: 'start' }); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { 
const cv = S.cv;
const ask = (k) => set({ cv: k === 'spray' ? 'spray' : (k === 'skip' ? 'skip' : 'typing') });
return { start: cv === 'start', skip: cv === 'skip' || cv === 'moved', spray: cv === 'spray', typing: cv === 'typing', err: cv === 'error', moved: cv === 'moved', notMoved: cv !== 'moved',
 askSkip: () => set({ cv: 'skip' }), askSpray: () => set({ cv: 'spray' }), askRain: () => set({ cv: 'typing' }), move: () => set({ cv: 'moved' }), keep: () => set({ cv: 'start' }), retry: () => set({ cv: 'skip' }), sent: () => set({ cv: 'sentEng' }), sentEng: cv === 'sentEng' };
 })();
return Object.assign(base, extra || {});
}
}
