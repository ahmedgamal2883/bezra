// Redesign helper: wrap every element that starts with <marker> in a JSX condition.
//   node scripts/v2-wrap.cjs <file.tsx> '<exact opening tag>' 'e?.o'
const fs = require('fs');
const [file, marker, cond] = process.argv.slice(2);
let s = fs.readFileSync(file, 'utf8');
const tag = marker.match(/^<([\w.]+)/)[1];
function end(start) {
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g'); re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(s))) {
    if (m[0].startsWith('</')) { depth--; if (depth === 0) return m.index + m[0].length; }
    else if (!s.slice(m.index, s.indexOf('>', m.index) + 1).endsWith('/>')) depth++;
  }
  throw new Error('no end');
}
let n = 0, from = 0, i;
while ((i = s.indexOf(marker, from)) >= 0) {
  const e = end(i);
  const w = `{${cond} ? (` + s.slice(i, e) + ') : null}';
  s = s.slice(0, i) + w + s.slice(e); from = i + w.length; n++;
}
fs.writeFileSync(file, s);
console.log('wrapped', n);
