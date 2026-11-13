/* eslint-disable */
// Logic from design/html/V11-Next.html (the design had no state). Step 2 adds the real values from
// GET /fields/{id}/next; with no data, N holds the V11 design values and the pills say Demo.
import { DCLogic } from '@/lib/dc';

const DESIGN = {
  live: false,
  bars: [['1990s', '2'], ['2000s', '3'], ['2010s', '5'], ['2020s', '7'], ['2040', '11']].map(([l, v]) => ({ l, v })),
  barH: ['28px', '42px', '70px', '98px', '154px'],
  headline: 'Sow between 1 and 15 November',
  w90: '10 to 25 Nov', wToday: '1 to 15 Nov', w40: '20 Oct to 5 Nov',
  pos90: ['33%', '25%'], posToday: ['18%', '25%'], pos40: ['2%', '25%'],
  twins: [['Asyut, Egypt', '91% same weather', ' Sow wheat 1 to 15 November and use heat tolerant varieties.'],
    ['Gezira, Sudan', '84% same weather', ' Short season wheat and watering at night.'],
    ['Hisar, India', '78% same weather', ' Early sowing and two light waterings at the end.']],
  srcSat: 'pill pv-demo', srcSatL: 'Demo', src40L: '2040: CMIP6',
  foot: 'All numbers on this screen are demo data.',
};

function fromData(D) {
  const vals = D.hot_days.bars.map((b) => b.value);
  const max = Math.max(...vals, 1);
  const short = (s) => s.replace(/ (\w{3})\w*$/, ' $1');
  const win = (w) => {
    const [a, b] = [w.from, w.to].map(short);
    return a.split(' ')[1] === b.split(' ')[1] ? `${a.split(' ')[0]} to ${b}` : `${a} to ${b}`;
  };
  // window bar on a 1 Oct -> 1 Dec axis (the Oct / Nov / Dec labels)
  const pos = (w) => [`${Math.max(0, Math.min(100, (w.from_doy / 61) * 100)).toFixed(0)}%`,
    `${Math.max(4, Math.min(100, ((w.to_doy - w.from_doy + 5) / 61) * 100)).toFixed(0)}%`];
  const t = D.windows.Today;
  const long = (s) => s.replace(/ Oct$/, ' October').replace(/ Nov$/, ' November').replace(/ Dec$/, ' December');
  const sameMonth = t.from.split(' ')[1] === t.to.split(' ')[1];
  return {
    live: true,
    bars: D.hot_days.bars.map((b) => ({ l: b.label, v: String(Math.round(b.value)) })),
    barH: vals.map((v) => `${Math.max(8, Math.round((v / max) * 154))}px`),
    headline: `Sow between ${sameMonth ? t.from.split(' ')[0] : long(t.from)} and ${long(t.to)}`,
    w90: win(D.windows['1990s']), wToday: win(t), w40: win(D.windows['2040']),
    pos90: pos(D.windows['1990s']), posToday: pos(t), pos40: pos(D.windows['2040']),
    twins: D.twins.map((x) => [x.name, `${x.similarity}% same weather`, ' ' + x.practice]),
    srcSat: 'pill pv-sat', srcSatL: 'NASA POWER', src40L: '2040: trend',
    foot: 'Hot days and sowing windows from NASA POWER 1990-2026. Twin practices and the three plans are Demo.',
  };
}

export default class Component extends DCLogic {
constructor(props) { super(props); this.state = Object.assign({ mode: null }, {}); }
renderVals() {
const S = this.state, set = (o) => this.setState(o);
const details = (S.mode ?? (this.props.details ? 'details' : 'simple')) === 'details';
const base = { details, simple: !details, segS: 'segb press' + (details ? '' : ' on'), segD: 'segb press' + (details ? ' on' : ''), isS: String(!details), isD: String(details), pickS: () => set({ mode: 'simple' }), pickD: () => set({ mode: 'details' }) };
const extra = (() => { const D = this.props.data; return { N: D ? fromData(D) : DESIGN, sk: 'sk ' + (this.props.loading ? 'hold' : '') }; })();
return Object.assign(base, extra || {});
}
}
