// Redesign helper: replace the first <tag ...> element found after a marker with the content of a file.
//   node scripts/v2-splice.cjs <file.tsx> '<marker text>' <tag> <replacement-file>
const fs = require('fs');
const [file, marker, tag, repFile] = process.argv.slice(2);
let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf(marker);
if (a < 0) throw new Error('marker not found: ' + marker);
const i = s.indexOf('<' + tag, a + marker.length);
const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g'); re.lastIndex = i; let depth = 0, m, e = -1;
while ((m = re.exec(s))) {
  if (m[0].startsWith('</')) { depth--; if (depth === 0) { e = m.index + m[0].length; break; } }
  else if (!s.slice(m.index, s.indexOf('>', m.index) + 1).endsWith('/>')) depth++;
}
if (e < 0) throw new Error('no end');
s = s.slice(0, i) + fs.readFileSync(repFile, 'utf8').trim() + s.slice(e);
fs.writeFileSync(file, s);
console.log('spliced', e - i, 'chars');
