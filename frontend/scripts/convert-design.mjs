// Converts the V11 design files (design/html/*.html) into React screens, 1:1.
//   - template markup  -> src/screens/<Name>.tsx  (sc-for -> .map, sc-if -> conditional, {{x}} -> {v.x})
//   - logic script     -> src/screens/<Name>.logic.js (copied verbatim)
//   - shared stylesheet-> src/app/globals.css
//   - one route page per artboard (see src/lib/routes.ts)
// Run once with:  node scripts/convert-design.mjs
// After step 1 the generated files are normal source code and get edited by hand
// (to wire real data), so do NOT re-run this script after that without care.
import { parse } from 'parse5';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const FRONT = path.resolve(here, '..');
const DESIGN = path.resolve(FRONT, '../design/html');
const SCREENS = path.join(FRONT, 'src/screens');
const APP = path.join(FRONT, 'src/app');

const routesSrc = fs.readFileSync(path.join(FRONT, 'src/lib/routes.ts'), 'utf8');
const FIELD_ID = routesSrc.match(/DEMO_FIELD_ID = '([^']+)'/)[1];
const fr = (t = '') => `/field/${FIELD_ID}${t}`;
const ROUTES = {
  'V11-Landing.html': '/', 'V11-Onboarding.html': '/onboarding', 'V11-Field.html': fr(),
  'V11-Plan.html': fr('/plan'), 'V11-Health.html': fr('/health'), 'V11-Calendar.html': fr('/calendar'),
  'V11-Next.html': fr('/next'), 'V11-Alerts.html': fr('/alerts'), 'V11-Diagnose.html': fr('/diagnose'),
  'V11-Sim.html': '/sim', 'V11-Ask.html': '/ask', 'V11-Profile.html': '/profile',
  'V11-Engineer.html': '/engineer', 'V11-About.html': '/about', 'V11-States.html': '/states',
};
// Next.js app-router folder for each route.
const ROUTE_DIR = {
  '/': '', '/onboarding': 'onboarding', '/sim': 'sim', '/ask': 'ask', '/profile': 'profile',
  '/engineer': 'engineer', '/about': 'about', '/states': 'states',
  [fr()]: 'field/[id]', [fr('/plan')]: 'field/[id]/plan', [fr('/health')]: 'field/[id]/health',
  [fr('/calendar')]: 'field/[id]/calendar', [fr('/next')]: 'field/[id]/next',
  [fr('/alerts')]: 'field/[id]/alerts', [fr('/diagnose')]: 'field/[id]/diagnose',
};

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const HTML_ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  autocomplete: 'autoComplete', autofocus: 'autoFocus', spellcheck: 'spellCheck', colspan: 'colSpan',
  rowspan: 'rowSpan', contenteditable: 'contentEditable', inputmode: 'inputMode', enterkeyhint: 'enterKeyHint',
  'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'xmlns:xlink': 'xmlnsXlink',
};
const BOOL = new Set(['disabled', 'hidden', 'required', 'multiple', 'readonly', 'autofocus']);
const SVG_NS = 'http://www.w3.org/2000/svg';

const findAll = (n, pred, out = []) => { if (pred(n)) out.push(n); (n.childNodes || []).forEach((c) => findAll(c, pred, out)); if (n.content) findAll(n.content, pred, out); return out; };
const textOf = (n) => (n.childNodes || []).map((c) => (c.nodeName === '#text' ? c.value : textOf(c))).join('');

function expr(p, scope) {
  const segs = p.trim().split('.');
  const head = scope.has(segs[0]) ? segs[0] : '__v?.' + segs[0];
  return [head, ...segs.slice(1)].join('?.');
}
const TOK = /\{\{([^}]+)\}\}/g;
function splitTpl(str, scope) {
  const parts = []; let last = 0, m;
  TOK.lastIndex = 0;
  while ((m = TOK.exec(str))) { if (m.index > last) parts.push({ t: str.slice(last, m.index) }); parts.push({ e: expr(m[1], scope) }); last = m.index + m[0].length; }
  if (last < str.length) parts.push({ t: str.slice(last) });
  return parts;
}
const tplLiteral = (parts) => '`' + parts.map((p) => (p.t != null ? p.t.replace(/[`\\]/g, '\\$&').replace(/\$\{/g, '\\${') : '${__s(' + p.e + ')}')).join('') + '`';

function staticStyle(str) {
  const obj = {}; let depth = 0, buf = ''; const parts = [];
  for (const ch of str) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ';' && depth === 0) { parts.push(buf); buf = ''; } else buf += ch; }
  parts.push(buf);
  for (const p of parts) { const i = p.indexOf(':'); if (i < 0) continue; const k = p.slice(0, i).trim(); if (!k) continue; obj[k.startsWith('--') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = p.slice(i + 1).trim(); }
  return JSON.stringify(obj);
}

function attrName(name, isSvg) {
  if (/^on/i.test(name)) return 'on' + name[2].toUpperCase() + name.slice(3);
  if (HTML_ATTR[name]) return HTML_ATTR[name];
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  if (isSvg && name.includes('-')) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}

function convAttrs(node, scope, isSvg) {
  const out = []; let linkTo = null;
  for (const a of node.attrs) {
    if (a.name.startsWith('hint-')) continue;
    const name = attrName(a.name, isSvg);
    const val = a.value;
    const hasTok = /\{\{/.test(val);
    if (node.nodeName === 'a' && a.name === 'href' && ROUTES[val]) { linkTo = ROUTES[val]; out.push(`href=${JSON.stringify(ROUTES[val])}`); continue; }
    if (a.name === 'style') {
      if (!hasTok) out.push(`style={${staticStyle(val)} as any}`);
      else { const parts = splitTpl(val, scope); out.push(`style={__css(${parts.length === 1 && parts[0].e ? parts[0].e : tplLiteral(parts)})}`); }
      continue;
    }
    if (!hasTok) {
      if (BOOL.has(a.name) && val === '') out.push(`${name}`);
      else out.push(`${name}=${JSON.stringify(val)}`);
      continue;
    }
    const parts = splitTpl(val, scope);
    if (parts.length === 1 && parts[0].e) out.push(`${name}={${/^on/i.test(a.name) ? parts[0].e : '__s(' + parts[0].e + ') as any'}}`);
    else out.push(`${name}={${tplLiteral(parts)}}`);
  }
  return { attrs: out, linkTo };
}

function textJSX(str, scope) {
  if (!/\{\{/.test(str)) return [JSON.stringify(str)].map((j) => `{${j}}`);
  return splitTpl(str, scope).map((p) => (p.t != null ? `{${JSON.stringify(p.t)}}` : `{__s(${p.e})}`));
}

let loopN = 0;
function conv(node, scope, ind) {
  const pad = '  '.repeat(ind);
  if (node.nodeName === '#text') {
    const t = node.value;
    if (!t.trim()) return t.length ? [pad + '{" "}'] : [];
    return textJSX(t, scope).map((x) => pad + x);
  }
  if (node.nodeName === '#comment') return [];
  const tag = node.tagName;
  const kids = (n, sc, i) => (n.childNodes || []).flatMap((c) => conv(c, sc, i));
  if (tag === 'sc-for') {
    const list = node.attrs.find((a) => a.name === 'list').value.match(/\{\{(.+)\}\}/)[1];
    const as = node.attrs.find((a) => a.name === 'as').value;
    const idx = 'i' + loopN++;
    const sc = new Set(scope); sc.add(as);
    return [pad + `{((${expr(list, scope)}) || []).map((${as}: any, ${idx}: number) => (`, pad + `  <Fragment key={${idx}}>`, ...kids(node, sc, ind + 2), pad + '  </Fragment>', pad + '))}'];
  }
  if (tag === 'sc-if') {
    const val = node.attrs.find((a) => a.name === 'value').value.match(/\{\{(.+)\}\}/)[1];
    return [pad + `{${expr(val, scope)} ? (`, pad + '  <>', ...kids(node, scope, ind + 2), pad + '  </>', pad + ') : null}'];
  }
  if (tag === 'script' || tag === 'style') throw new Error('unexpected <' + tag + '> in template');
  const isSvg = node.namespaceURI === SVG_NS;
  const { attrs, linkTo } = convAttrs(node, scope, isSvg);
  const T = linkTo ? 'Link' : tag;
  const open = `<${T}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  const children = (node.childNodes || []).filter((c) => c.nodeName !== '#comment');
  if (VOID.has(tag) || children.length === 0) return [pad + open + ' />'];
  return [pad + open + '>', ...kids(node, scope, ind + 1), pad + `</${T}>`];
}

let globalCss = null;
const made = [];
for (const file of fs.readdirSync(DESIGN).filter((f) => /^V11-.*\.html$/.test(f)).sort()) {
  const name = file.replace(/^V11-|\.html$/g, '');
  const html = fs.readFileSync(path.join(DESIGN, file), 'utf8');
  const doc = parse(html);
  const title = textOf(findAll(doc, (n) => n.nodeName === 'title')[0]).trim();
  const xdc = findAll(doc, (n) => n.nodeName === 'x-dc')[0];
  const helmet = xdc.childNodes.find((c) => c.nodeName === 'helmet');
  const css = textOf(findAll(helmet, (n) => n.nodeName === 'style')[0]);
  if (globalCss == null) globalCss = css; else if (css !== globalCss) console.warn('! CSS differs in', file);
  const logicScript = findAll(doc, (n) => n.nodeName === 'script' && n.attrs.some((a) => a.name === 'data-dc-script'))[0];
  const logic = textOf(logicScript).trim();
  if (!/class Component extends DCLogic/.test(logic)) throw new Error('no Component class in ' + file);

  const tplNodes = xdc.childNodes.filter((c) => c !== helmet);
  while (tplNodes.length && tplNodes[0].nodeName === '#text' && !tplNodes[0].value.trim()) tplNodes.shift();
  while (tplNodes.length && tplNodes.at(-1).nodeName === '#text' && !tplNodes.at(-1).value.trim()) tplNodes.pop();
  loopN = 0;
  const body = tplNodes.flatMap((n) => conv(n, new Set(), 3));
  const usesLink = body.some((l) => /<Link /.test(l));

  const tsx = `'use client';
/* eslint-disable */
// Generated from design/html/${file} by scripts/convert-design.mjs (layout and copy 1:1).
// Logic lives in ./${name}.logic.js (verbatim from the design).
import { Fragment } from 'react';
${usesLink ? "import Link from 'next/link';\n" : ''}import { useDC, css as __css, s as __s } from '@/lib/dc';
import Logic from './${name}.logic';

export default function ${name}Screen() {
  const __v = useDC(Logic);
  return (
    <>
${body.join('\n')}
    </>
  );
}
`;
  const js = `/* eslint-disable */
// Verbatim logic from design/html/${file}.
import { DCLogic } from '@/lib/dc';

${logic.replace('class Component extends DCLogic', 'export default class Component extends DCLogic')}
`;
  fs.mkdirSync(SCREENS, { recursive: true });
  fs.writeFileSync(path.join(SCREENS, name + '.tsx'), tsx);
  fs.writeFileSync(path.join(SCREENS, name + '.logic.js'), js);

  const dir = path.join(APP, ROUTE_DIR[ROUTES[file]]);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), `import type { Metadata } from 'next';
import ${name}Screen from '@/screens/${name}';

export const metadata: Metadata = { title: ${JSON.stringify(title)} };

export default function Page() {
  return <${name}Screen />;
}
`);
  made.push(`${file} -> ${ROUTES[file]}`);
}

// Shared stylesheet, plus the design runtime's own rules (.static stops entrance animations after interaction).
const runtimeCss = `.static .rise,.static .fade,.static .pop,.static .grow,.static .growx,.static .tabs a[aria-current=page]::after{animation:none!important}
.static .draw{animation:none!important;stroke-dashoffset:0}
.static .sk:not(.hold){display:none}
`;
fs.writeFileSync(path.join(APP, 'globals.css'), '/* Shared V11 stylesheet, copied verbatim from design/html (identical in all 15 screens). */\n' + globalCss.trim() + '\n' + runtimeCss);
console.log(made.join('\n'));
