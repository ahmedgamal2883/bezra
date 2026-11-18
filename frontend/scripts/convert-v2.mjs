// Redesign (V18-V24): converts design-handoff/design/source/<Name>.dc.html into a React screen, 1:1, like
// convert-design.mjs did for V11.
//   template -> src/v2/screens/<Comp>.tsx   (sc-for -> .map, sc-if -> conditional, {{x}} -> {v.x})
//   logic    -> src/v2/screens/<Comp>.logic.js (verbatim)
// The page root gets class "v2 root" (styles from src/app/v2.css). Links to other design pages go through
// useV2Href() (src/v2/routes.ts), so they open the real route of the current field.
//
//   node scripts/convert-v2.mjs V18-Today [V18-Journal ...]
// Converting a screen again OVERWRITES it: only do that before it has been wired to real data
// (pass --force to overwrite anyway).
import { parse } from 'parse5';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const FRONT = path.resolve(here, '..');
const SRC = path.resolve(FRONT, '../design-handoff/design/source');
const OUT = path.join(FRONT, 'src/v2/screens');

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const HTML_ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly', maxlength: 'maxLength',
  autocomplete: 'autoComplete', autofocus: 'autoFocus', spellcheck: 'spellCheck', colspan: 'colSpan',
  rowspan: 'rowSpan', contenteditable: 'contentEditable', inputmode: 'inputMode', enterkeyhint: 'enterKeyHint',
  'xlink:href': 'xlinkHref', 'xml:space': 'xmlSpace', 'xmlns:xlink': 'xmlnsXlink', srcset: 'srcSet',
};
const BOOL = new Set(['disabled', 'hidden', 'required', 'multiple', 'readonly', 'autofocus', 'checked']);
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

const EVENTS = { keydown: 'KeyDown', keyup: 'KeyUp', keypress: 'KeyPress', mouseenter: 'MouseEnter', mouseleave: 'MouseLeave',
  mousedown: 'MouseDown', mouseup: 'MouseUp', mousemove: 'MouseMove', pointerdown: 'PointerDown', pointerup: 'PointerUp',
  pointermove: 'PointerMove', pointerenter: 'PointerEnter', pointerleave: 'PointerLeave', dblclick: 'DoubleClick',
  touchstart: 'TouchStart', touchend: 'TouchEnd', animationend: 'AnimationEnd', transitionend: 'TransitionEnd' };
const NUMERIC = new Set(['tabIndex', 'rows', 'cols', 'maxLength', 'colSpan', 'rowSpan', 'size', 'span']);
function attrName(name, isSvg) {
  if (/^on/i.test(name)) { const e = name.slice(2).toLowerCase(); return 'on' + (EVENTS[e] || e[0].toUpperCase() + e.slice(1)); }
  if (HTML_ATTR[name]) return HTML_ATTR[name];
  if (name.startsWith('aria-') || name.startsWith('data-')) return name;
  if (isSvg && name.includes('-')) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return name;
}

const designLink = (v) => { const m = v.match(/^(V\d\d-[\w-]+)\.dc\.html(#[\w-]+)?$/); return m ? { name: m[1], hash: m[2] || '' } : null; };

function convAttrs(node, scope, isSvg, isRoot) {
  const out = []; let linkTo = null;
  for (const a of node.attrs) {
    if (a.name.startsWith('hint-')) continue;
    const name = attrName(a.name, isSvg);
    let val = a.value;
    const hasTok = /\{\{/.test(val);
    if (isRoot && a.name === 'class') val = 'v2 ' + val;
    if (node.nodeName === 'a' && a.name === 'href' && !hasTok && designLink(val)) {
      const d = designLink(val);
      linkTo = true;
      out.push(`href={__r(${JSON.stringify(d.name)}) + ${JSON.stringify(d.hash)}}`);
      continue;
    }
    if (a.name === 'style') {
      if (!hasTok) out.push(`style={${staticStyle(val)} as any}`);
      else { const parts = splitTpl(val, scope); out.push(`style={__css(${parts.length === 1 && parts[0].e ? parts[0].e : tplLiteral(parts)})}`); }
      continue;
    }
    if (!hasTok) {
      if (BOOL.has(a.name) && val === '') out.push(`${name}`);
      else if (NUMERIC.has(name) && /^-?\d+$/.test(val)) out.push(`${name}={${val}}`);
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
  if (!/\{\{/.test(str)) return [`{${JSON.stringify(str)}}`];
  return splitTpl(str, scope).map((p) => (p.t != null ? `{${JSON.stringify(p.t)}}` : `{__s(${p.e})}`));
}

let loopN = 0;
let rootDone = false;
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
  const isRoot = !rootDone && node.attrs.some((a) => a.name === 'class' && /(^|\s)root(\s|$)/.test(a.value));
  if (isRoot) rootDone = true;
  const { attrs, linkTo } = convAttrs(node, scope, isSvg, isRoot);
  const T = linkTo ? 'Link' : tag;
  const open = `<${T}${attrs.length ? ' ' + attrs.join(' ') : ''}`;
  const children = (node.childNodes || []).filter((c) => c.nodeName !== '#comment');
  if (VOID.has(tag) || children.length === 0) return [pad + open + ' />'];
  return [pad + open + '>', ...kids(node, scope, ind + 1), pad + `</${T}>`];
}

const compName = (n) => n.replace(/^V\d\d-/, '').replace(/-/g, '');
const names = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const force = process.argv.includes('--force');
fs.mkdirSync(OUT, { recursive: true });
for (const n of names) {
  const file = n.endsWith('.dc.html') ? n : n + '.dc.html';
  const comp = compName(file.replace('.dc.html', ''));
  const tsxPath = path.join(OUT, comp + '.tsx');
  if (fs.existsSync(tsxPath) && !force) { console.log('skip (exists, use --force):', comp); continue; }
  const doc = parse(fs.readFileSync(path.join(SRC, file), 'utf8'));
  const xdc = findAll(doc, (x) => x.nodeName === 'x-dc')[0];
  const helmet = xdc.childNodes.find((c) => c.nodeName === 'helmet');
  const logicScript = findAll(doc, (x) => x.nodeName === 'script' && x.attrs.some((a) => a.name === 'data-dc-script'))[0];
  const logic = textOf(logicScript).trim();
  const props = logicScript.attrs.find((a) => a.name === 'data-props')?.value || '{}';
  if (!/class Component extends DCLogic/.test(logic)) throw new Error('no Component class in ' + file);
  const tplNodes = xdc.childNodes.filter((c) => c !== helmet && c !== logicScript);
  while (tplNodes.length && tplNodes[0].nodeName === '#text' && !tplNodes[0].value.trim()) tplNodes.shift();
  while (tplNodes.length && tplNodes.at(-1).nodeName === '#text' && !tplNodes.at(-1).value.trim()) tplNodes.pop();
  loopN = 0; rootDone = false;
  const body = tplNodes.flatMap((x) => conv(x, new Set(), 3));
  // top bar: the signed-in person and field (src/v2/data/who.ts), never the design's Hassan / North plot
  const WHO = { '{"HF"}': '{__s(__w.initials)}', '{"Hassan Farouk"}': '{__s(__w.userName)}', '{"North plot ▾"}': '{__s(__w.fieldLabel)}' };
  for (let i = 0; i < body.length; i++) { const t = body[i].trim(); if (WHO[t]) body[i] = body[i].replace(t, WHO[t]); }
  const usesLink = body.some((l) => /<Link /.test(l));
  fs.writeFileSync(tsxPath, `'use client';
/* eslint-disable */
// Generated from design-handoff/design/source/${file} by scripts/convert-v2.mjs (layout and copy 1:1),
// then wired to the API by hand. Logic: ./${comp}.logic.js
import { Fragment } from 'react';
${usesLink ? "import Link from 'next/link';\n" : ''}import { useDC, css as __css, s as __s } from '@/lib/dc';
import { useV2Href } from '@/v2/routes';
import { useWho } from '@/v2/data/who';
import Logic from './${comp}.logic';

export default function ${comp}Screen(props: Record<string, unknown> = {}) {
  const __r = useV2Href();
  const __w = useWho();
  const __v = useDC(Logic, props);
  return (
    <>
${body.join('\n')}
    </>
  );
}
`);
  fs.writeFileSync(path.join(OUT, comp + '.logic.js'), `/* eslint-disable */
// Logic from design-handoff/design/source/${file} (verbatim at conversion; design props: ${props}).
import { DCLogic } from '@/lib/dc';

${logic.replace('class Component extends DCLogic', 'export default class Component extends DCLogic')}
`);
  console.log('made', comp, '<-', file);
}
