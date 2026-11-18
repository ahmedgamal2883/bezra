// Redesign helper: replace EVERY element that starts with <marker> (a <tag ...> opening) with a replacement text.
//   node scripts/v2-replace.cjs <file.tsx> '<marker>' <tag> '<replacement>'      (replacement may be '')
const fs = require('fs');
const [file, marker, tag, rep] = process.argv.slice(2);
let s = fs.readFileSync(file, 'utf8');
function end(start) {
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g'); re.lastIndex = start; let d = 0, m;
  while ((m = re.exec(s))) {
    if (m[0].startsWith('</')) { d--; if (d === 0) return m.index + m[0].length; }
    else if (!s.slice(m.index, s.indexOf('>', m.index) + 1).endsWith('/>')) d++;
  }
  throw new Error('no end');
}
let n = 0, from = 0, i;
while ((i = s.indexOf(marker, from)) >= 0) { const e = end(i); s = s.slice(0, i) + rep + s.slice(e); from = i + rep.length; n++; }
fs.writeFileSync(file, s);
console.log('replaced', n);
