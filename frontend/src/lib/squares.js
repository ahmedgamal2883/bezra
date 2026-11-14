// The field's 12 squares (3 across, 4 down) from GET /fields/{id}/ndvi, in the shape the V11 map logic uses.
// NDVI[r][c] = value, KL[r][c] = 0 Less green / 1 Normal / 2 Greener (vs the field median ±0.05, brief §4).
const K = { less: 0, normal: 1, greener: 2, outside: 3 };  // 3 = outside the field the farmer drew (not coloured)
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const shortDate = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MON[m - 1]}`; };
export const longDate = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${d} ${MONTH[m - 1]}`; };

export function squares(nd, index = 'ndvi') {
  if (!nd || !nd.available) return null;
  const cells = nd.indices[index].cells;
  // any grid size (a drawn field gets as many 30 m squares as it needs)
  const R = (nd.grid && nd.grid.rows) || 4, C = (nd.grid && nd.grid.cols) || 3;
  const at = (r, c) => cells.find((x) => x.r === r && x.c === c) || {};
  const NDVI = Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => at(r, c).value ?? null));
  const KL = Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => K[at(r, c).class] ?? 1));
  return { NDVI, KL, median: nd.indices[index].median };
}

// Map marker on the weak spot (centre of its first square), as in the design: translate(738 147) = row 0, column 2.
export function pinFor(nd) {
  if (!nd || !nd.available) return 'translate(738 147) rotate(9)';
  if (!nd.weak_spot) return null;
  const [r, c] = nd.weak_spot.squares[0];
  const R = (nd.grid && nd.grid.rows) || 4, C = (nd.grid && nd.grid.cols) || 3;
  return `translate(${(605 + (c + 0.5) * (160 / C)).toFixed(1)} ${(120 + (r + 0.5) * (220 / R)).toFixed(1)}) rotate(9)`;
}

export function sourceShort(nd) {
  return nd && nd.source && nd.source.startsWith('NASA HLS') ? 'NASA HLS v2.0, 30 m' : 'Sentinel-2 (ESA), 10 m pixels, 30 m squares';
}
