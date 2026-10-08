#!/usr/bin/env node
/* scripts/mat/compat-alias-map.mjs — REQ-MAT-21 / H03 / D-18.
   Generates tokens/compat-alias-map.json: every --glass-* name with >= 1
   reader in the 4.x snapshot (legacy/**) or the frozen consumer fixture
   (tests/fixtures/consumer-4x/cases/mat/**) mapped to an --ag-* successor or
   its frozen legacy value from tokens/legacy/4x-rendered.tokens.json.

   Successor rule (mechanical, no invented semantics): a --glass-* name maps
   to an --ag-* name only when the 5.0 contract defines a variable of the same
   measurement family AND the rendered 4.x value equals the contract value —
   e.g. --glass-space-4 = 1rem = --ag-space-4. Otherwise the name freezes at
   its rendered value so dist/compat/tokens.css keeps 4.x CSS working
   byte-for-byte. The PRD-documented --glass-motion-default -> --ag-duration-small
   is applied when the source name exists.

   Also emits dist/compat/tokens.css (@layer ag.compat) so the bridge job and
   codemod cssVars field consume the same map. */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const GLASS_RE = /--glass-[a-zA-Z0-9-]+/g;
const SCAN_DIRS = ['legacy/src', 'tests/fixtures/consumer-4x/cases/mat'];
const SCAN_EXT = new Set(['.ts', '.tsx', '.css', '.scss', '.js', '.jsx', '.mdx']);

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (SCAN_EXT.has(extname(e.name))) yield p;
  }
}

const readers = new Map(); // var -> file count
for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    const text = readFileSync(file, 'utf8');
    const seen = new Set(text.match(GLASS_RE) ?? []);
    for (const v of seen) readers.set(v, (readers.get(v) ?? 0) + 1);
  }
}

const rendered = JSON.parse(readFileSync('tokens/legacy/4x-rendered.tokens.json', 'utf8'));
const primitives = rendered['legacy']['4x-rendered'].primitive;

/* Declarations harvested from every 4.x stylesheet (tokens.css primitives
   already covered; themes/*.css, component sheets etc. fill the rest).
   values.light = first non-theme or light-theme declaration; values.dark =
   dark-theme override when it differs. Values may reference other
   --glass-* names — they still resolve through this same map. */
/* custom-property values cannot contain ';' and may span lines
   (e.g. hsl(\n 217 91% 60%\n)) — capture up to ';' or a closing '}'. */
const DECL_RE = /(--glass-[a-zA-Z0-9-]+)\s*:\s*([^;}]+?)\s*(?:;|(?=\s*}))/g;
const decls = new Map(); // name -> { light?: string, dark?: string }
for (const file of walk('legacy/src')) {
  if (extname(file) !== '.css') continue;
  const dark = /dark/.test(file);
  const light = !dark;
  for (const m of readFileSync(file, 'utf8').matchAll(DECL_RE)) {
    const rec = decls.get(m[1]) ?? {};
    if (light && rec.light === undefined) rec.light = m[2].trim();
    if (dark && rec.dark === undefined) rec.dark = m[2].trim();
    decls.set(m[1], rec);
  }
}

function frozenValue(name) {
  const prim = primitives[name]?.$value;
  const d = decls.get(name) ?? {};
  if (prim !== undefined && d.dark !== undefined && d.dark !== (d.light ?? prim)) {
    return { light: d.light ?? prim, dark: d.dark };
  }
  const single = prim ?? d.light;
  if (single !== undefined && d.dark !== undefined && d.dark !== single) return { light: single, dark: d.dark };
  return single !== undefined ? single : (d.dark !== undefined ? { light: d.dark } : null);
}

/* 5.0 contract values for the mechanical successor check. */
const AG_SPACE_PX = { '0': 0, '1': 4, '2': 8, '3': 12, '4': 16, '5': 20, '6': 24, '8': 32, '10': 40, '12': 48, '16': 64 };
const AG_RADIUS_PX = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, full: 9999 };
const toPx = (v) => {
  if (/^-?\d+(\.\d+)?px$/.test(v)) return parseFloat(v);
  if (/^-?\d+(\.\d+)?rem$/.test(v)) return parseFloat(v) * 16;
  if (v === '0') return 0;
  return null;
};
const DOCUMENTED = { '--glass-motion-default': '--ag-duration-small' };

function successor(name, legacyValue) {
  if (DOCUMENTED[name]) return DOCUMENTED[name];
  const space = /^--glass-space-(\d+)$/.exec(name);
  if (space && space[1] in AG_SPACE_PX) {
    const px = toPx(legacyValue ?? '');
    if (px !== null && px === AG_SPACE_PX[space[1]]) return `--ag-space-${space[1]}`;
  }
  const radius = /^--glass-radius-(xs|sm|md|lg|xl|full)$/.exec(name);
  if (radius) {
    const px = toPx(legacyValue ?? '');
    if (px !== null && px === AG_RADIUS_PX[radius[1]]) return `--ag-radius-${radius[1]}`;
  }
  return null;
}

const entries = {};
let mapped = 0, frozen = 0, uncovered = 0;
for (const name of [...readers.keys()].sort()) {
  const prim = primitives[name]?.$value;
  const succ = successor(name, typeof prim === 'string' ? prim : undefined);
  const fv = frozenValue(name);
  if (succ) { entries[name] = { successor: succ, readers: readers.get(name) }; mapped += 1; }
  else if (fv !== null) { entries[name] = { frozenValue: fv, readers: readers.get(name) }; frozen += 1; }
  else { entries[name] = { frozenValue: null, readers: readers.get(name), note: 'no rendered 4.x value found — review' }; uncovered += 1; }
}

const map = {
  $schema: 'auraglass/compat-alias-map/v1',
  description: 'H03 (D-18): every --glass-* name with a 4.x reader -> --ag-* successor or frozen value. Generated by scripts/mat/compat-alias-map.mjs; do not hand-edit.',
  generatedFrom: { readers: SCAN_DIRS, values: 'tokens/legacy/4x-rendered.tokens.json' },
  counts: { total: readers.size, mapped, frozen, uncovered },
  entries,
};
mkdirSync('tokens', { recursive: true });
writeFileSync('tokens/compat-alias-map.json', JSON.stringify(map, null, 1) + '\n');

const lightLines = [], darkLines = [];
for (const [name, e] of Object.entries(entries)) {
  if (e.successor) { lightLines.push(`${name}: var(${e.successor});`); continue; }
  const fv = e.frozenValue;
  if (fv === null) { lightLines.push(`/* ${name}: no rendered value — review */`); continue; }
  if (typeof fv === 'object') {
    lightLines.push(`${name}: ${fv.light};`);
    if (fv.dark !== undefined && fv.dark !== fv.light) darkLines.push(`${name}: ${fv.dark};`);
  } else {
    lightLines.push(`${name}: ${fv};`);
  }
}
const css = [
  '/* generated by scripts/mat/compat-alias-map.mjs — do not edit */',
  '@layer ag.compat {',
  ':where(:root) {',
  ...lightLines,
  '}',
  ...(darkLines.length ? [':where(:root[data-ag-scheme="dark"]) {', ...darkLines, '}'] : []),
  '}',
  '',
].join('\n');
mkdirSync('dist/compat', { recursive: true });
writeFileSync('dist/compat/tokens.css', css);
console.log(`compat-alias-map: ${readers.size} names (${mapped} successors, ${frozen} frozen, ${uncovered} uncovered); css ${css.length} B`);
