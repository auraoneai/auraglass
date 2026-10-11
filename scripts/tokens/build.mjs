#!/usr/bin/env node
/* Token build — release/4.x, `--platform bridge-4x` (REQ-MAT-41, REQ-FIN-57, contract row group H).

   This is the 5.0 compiler run on the 4.x line. It reads the same token tree as `next`
   (tokens/{ref,sys,material,modes,presets,contrast,comp,legacy}/*.tokens.json validated
   against tokens/$schema.json) through the same modules — validate.mjs, color.mjs,
   transforms/{glass-material,contrast-solve,motion-spring}.mjs and
   formats/{_shared,css-layered,property-registry}.mjs are byte-copies of `next`. The
   load -> validate -> guard -> resolve -> expand pipeline below is copied verbatim from
   next scripts/tokens/build.mjs. There is no hand-authored value table on this line:
   every --ag-* value is compiled from the token tree.

   Outputs (all inside the MAT row-H paths; the job mat:build:bridge replays this and runs
   `git diff --exit-code src/material src/styles/v5.css src/styles/preview-v5.css`):
     src/material/css/ladders.css     — compiled ladder cells (same emitter as next)
     src/material/css/floors.css      — compiled opacity floors (contrast-solver output)
     src/material/css/properties.css  — @property registrations (same emitter as next)
     src/styles/v5.css                — the complete 5.0 token sheet (next dist/tokens.css)
     src/styles/preview-v5.css        — opt-in preview: tokens + material.css + ladders +
                                        floors, every selector scoped under
                                        [data-ag-preview="v5"]
     src/material/css/preview-v5.css  — same preview sheet (the path the frozen consumer
                                        fixture links); build.mjs is its only writer
     src/material/compat/tokens.css   — --glass-* read aliases from tokens/compat-alias-map.json
                                        plus the labelled D-28 dark-text fix from
                                        tokens/legacy/d28-dark-text.tokens.json
   plus dist/tokens/4x/ (manifest + compat resolution report; not committed).

   src/material/css/material.css is the 5.0 recipe copied from next; the preview is a
   selector-scoped rewrite of it, never a second recipe.

   Flags: --platform bridge-4x (required), --out <dir> (write outputs under <dir>; used by
   tests to build into a temp dir). */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { discoverTokenFiles, validateTokenFile, loadSchema, isAlias } from './validate.mjs';
import { colorToCss } from './color.mjs';
import { buildLadders, buildFloors } from './transforms/glass-material.mjs';
import { solveContrastMatrix } from './transforms/contrast-solve.mjs';
import { emitTokensCss } from './formats/css-layered.mjs';
import { buildProperties } from './formats/property-registry.mjs';
import { prettierFormat, die, layerFirst, LAYER_ORDER } from './formats/_shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(import.meta.url);

/* contract-v1.1 LAYER_ORDER_STATEMENT (AURAGLASS_5_CONTRACTS.md, src/contracts/tokens.ts on
   next). src/contracts/tokens.ts does not exist on release/4.x, so the frozen statement is
   pinned here and the emitters are checked against it (fail closed on drift). */
const CONTRACT_LAYER_ORDER_STATEMENT = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';

export const PREVIEW_SCOPE = '[data-ag-preview="v5"]';
export const BRIDGE_OUTPUTS = [
  'src/material/css/ladders.css',
  'src/material/css/floors.css',
  'src/material/css/properties.css',
  'src/styles/v5.css',
  'src/styles/preview-v5.css',
  'src/material/css/preview-v5.css',
  'src/material/compat/tokens.css',
];

// ---------- load (verbatim from next scripts/tokens/build.mjs) ----------

/** Flatten a token-file tree into records: { name, type, ext, value, file, group }. */
function flattenTree(tree, file) {
  const out = new Map();
  const walk = (node, keys, type, ext) => {
    const t = node.$type ?? type;
    const e = { ...(ext ?? {}), ...(node.$extensions ?? {}) };
    if ('$value' in node) {
      const name = keys.join('.');
      out.set(name, { name, type: t, ext: Object.keys(e).length ? e : undefined, value: node.$value, file, group: keys.slice(1, -1).join('.') });
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      walk(v, [...keys, k], t, e);
    }
  };
  for (const [k, v] of Object.entries(tree)) if (!k.startsWith('$')) walk(v, [k], undefined, undefined);
  return out;
}

export function loadTokens(tokenDir) {
  const records = new Map();
  for (const file of discoverTokenFiles(tokenDir)) {
    const tree = JSON.parse(readFileSync(file, 'utf8'));
    for (const [name, rec] of flattenTree(tree, file)) {
      if (records.has(name)) die(`duplicate token path ${name} (${rec.file} vs ${file})`);
      records.set(name, rec);
    }
  }
  return records;
}

// ---------- alias resolution (verbatim from next) ----------

const REF_RE = /\{([^{}]+)\}/g;

export function resolveAliases(records) {
  const resolved = new Map();
  const stack = [];
  const resolveRef = (name) => {
    if (resolved.has(name)) return resolved.get(name);
    const rec = records.get(name);
    if (!rec) die(`unresolved alias {${name}} referenced from ${stack.at(-1) ?? 'unknown'}`);
    if (stack.includes(name)) die(`alias cycle: ${[...stack, name].join(' -> ')}`);
    stack.push(name);
    const v = resolveValue(rec.value);
    stack.pop();
    resolved.set(name, v);
    return v;
  };
  const resolveValue = (v) => {
    if (typeof v === 'string') {
      if (isAlias(v)) return resolveRef(v.slice(1, -1));
      if (v.includes('{')) return v.replace(REF_RE, (_, p) => stringifyResolved(resolveRef(p)));
      return v;
    }
    if (Array.isArray(v)) return v.map(resolveValue);
    if (v && typeof v === 'object') {
      const o = {};
      for (const [k, x] of Object.entries(v)) o[k] = resolveValue(x);
      return o;
    }
    return v;
  };
  for (const name of [...records.keys()].sort()) resolveRef(name);
  return resolved;
}

const stringifyResolved = (v) => (v && typeof v === 'object' ? JSON.stringify(v) : String(v));

/** material.* tokens may only alias sys.* or other material.* tokens (MAT-007 guard). */
function guardMaterialAliases(records) {
  for (const rec of records.values()) {
    if (rec.ext?.['ag.tier'] !== 'material') continue;
    const scan = (v) => {
      if (typeof v === 'string') for (const m of v.matchAll(REF_RE)) {
        const target = records.get(m[1]);
        const tt = target?.ext?.['ag.tier'];
        if (target && tt !== 'sys' && tt !== 'material')
          die(`${rec.name}: material.* alias {${m[1]}} targets tier '${tt ?? 'none'}' (must alias sys.* or material.* only)`);
      } else if (v && typeof v === 'object') for (const x of Object.values(v)) scan(x);
    };
    scan(rec.value);
  }
}

/** presets must not define material.* keys or private vars (MAT-007 guards). */
function guardPresets(records, resolved) {
  for (const rec of records.values()) {
    if (!rec.name.startsWith('preset.')) continue;
    const v = resolved.get(rec.name);
    if (JSON.stringify(v).includes('material.') || /"material"\s*:/.test(JSON.stringify(v)))
      die(`${rec.name}: preset defines material.* keys`);
    if (JSON.stringify(rec.value).includes('--_ag-'))
      die(`${rec.name}: preset value contains private --_ag-* var`);
  }
}

// ---------- mode expansion (verbatim from next) ----------

function readAxisDefs(records, resolved) {
  const defs = {};
  for (const rec of records.values()) {
    const axis = rec.ext?.['ag.axisDef'];
    if (typeof axis === 'string' && rec.name.startsWith('mode.')) defs[axis] = resolved.get(rec.name);
  }
  return defs;
}

export function expandModes(records, resolved, axisDefs) {
  const cells = [];
  for (const [name, rec] of [...records.entries()].sort()) {
    const ext = rec.ext ?? {};
    const cssVar = ext['ag.cssVar'];
    const type = rec.type;
    const v = resolved.get(name);

    if (type === 'mode-table' && ext['ag.axisDef']) continue;
    if (typeof ext['ag.axisDef'] === 'string') continue;
    if (ext['ag.legacy'] === true) continue;
    if (typeof cssVar !== 'string' && type !== 'motion-spring') continue;

    if (type === 'mode-table') {
      for (const [key, cell] of Object.entries(v)) {
        if (key === 'default') {
          cells.push({ name, cssVar, type, value: cell, axis: null, axisValue: null, ext, renderType: ext['ag.valueType'] ?? 'number' });
          continue;
        }
        let axis = ext['ag.axis'];
        let axisValue = key;
        if (key.includes('.')) [axis, axisValue] = key.split('.');
        if (!axis) die(`${name}: mode-table cell '${key}' has no axis (use '<axis>.<value>' keys or set ag.axis)`);
        const def = axisDefs[axis];
        if (!def) die(`${name}: mode-table cell '${key}' names unknown axis '${axis}'`);
        if (!def.values.includes(axisValue))
          die(`${name}: mode-table cell '${axisValue}' not an axis value of '${axis}' (${def.values.join('/')})`);
        cells.push({ name, cssVar, type, value: cell, axis, axisValue, ext, renderType: ext['ag.valueType'] ?? 'number' });
      }
      continue;
    }
    if (type === 'color' && v && typeof v === 'object' && 'light' in v && 'dark' in v) {
      cells.push({ name, cssVar, type, value: v, axis: 'scheme', axisValue: 'light', ext, renderType: 'color' });
      cells.push({ name, cssVar, type, value: v.dark, axis: 'scheme', axisValue: 'dark', ext, renderType: 'color', fallbackOnly: true });
      continue;
    }
    cells.push({ name, cssVar, type, value: v, axis: null, axisValue: null, ext, renderType: type });
  }
  return cells;
}

// ---------- bridge-4x: preview scoping ----------

/* Attributes the 5.0 engine reads on an ancestor (usually <html>) to select a mode. Under
   the preview they may sit above the preview root, on it, or inside it. */
const MODE_ATTR_RE = /^\[data-ag-(scheme|contrast|transparency|density|theme|tier|shadcn-source)(?:[~|^$*]?=[^\]]*)?\]$/;

function splitTopLevel(s, sep) {
  const out = [];
  let depth = 0, quote = null, cur = '';
  for (const ch of s) {
    if (quote) { if (ch === quote) quote = null; cur += ch; continue; }
    if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (depth === 0 && sep.test(ch)) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

/** Scope one complex selector under PREVIEW_SCOPE. Returns one or more selectors. */
export function scopeSelector(sel, scope = PREVIEW_SCOPE) {
  const s = sel.trim().replace(/\s+/g, ' ');
  if (/(^|[\s>+~(,])(html|body)(?=$|[\s>+~:.[)])/.test(s) || s.startsWith('*'))
    die(`preview scope: selector "${s}" targets the document; it cannot be scoped`);
  if (s.includes(':root')) return [s.replaceAll(':root', scope)];
  // first compound (up to the first top-level combinator)
  const parts = splitTopLevel(s, /[ ]/);
  const first = parts[0];
  const rest = parts.slice(1).join(' ');
  const compounds = first.match(/\[[^\]]*\]/g) ?? [];
  const isModeCompound = compounds.length > 0 && compounds.join('') === first && compounds.every((c) => MODE_ATTR_RE.test(c));
  if (!isModeCompound) return [`${scope} ${s}`];
  const tail = rest ? ` ${rest}` : '';
  // mode attribute above the preview root, on it, or inside it
  return [`${first} ${scope}${tail}`, `${scope}${first}${tail}`, `${scope} ${first}${tail}`];
}

/** Rewrite every style rule of a CSS file under PREVIEW_SCOPE. @property and @keyframes
 *  cannot be scoped and are rejected; the layer statement is dropped (re-added once). */
export function scopeCss(css, file) {
  const postcss = require('postcss');
  const root = postcss.parse(css, { from: file });
  root.walkAtRules((at) => {
    if (at.name === 'property' || at.name === 'keyframes')
      die(`${file}: @${at.name} cannot be scoped under the preview`);
    if (at.name === 'layer' && !at.nodes) at.remove();
    if (at.name === 'import') die(`${file}: @import is not allowed in a bridge input`);
  });
  root.walkRules((rule) => {
    const sels = splitTopLevel(rule.selector, /,/).flatMap((x) => scopeSelector(x));
    rule.selector = sels.join(',\n');
  });
  return root.toString();
}

/* The 5.0 recipe (material.css) reads --_ag-blur/--_ag-saturation/--_ag-fill/... on the
   host; the compiled ladder cells publish --_ag-mat-* and --ag-surface-fill on the same
   host. This generated block binds the ladder cell to the recipe scalars inside the
   preview so the ::before filter and the fill equal the ladders.css cell, and clears the
   host-level ladder literal (blur sits on ::before only). No values are authored here:
   every right-hand side is a ladder var. */
function ladderBinding() {
  return [
    '@layer ag.material {',
    `  ${PREVIEW_SCOPE} .ag-surface[data-ag-variant][data-ag-thickness] {`,
    '    --_ag-blur: var(--_ag-mat-blur);',
    '    --_ag-saturation: var(--_ag-mat-saturation);',
    '    --_ag-grain-opacity: var(--_ag-mat-grain);',
    '    --_ag-rim-width: var(--_ag-mat-rim);',
    '    --_ag-shadow: var(--_ag-mat-shadow);',
    '    --_ag-fill: var(--ag-surface-fill);',
    '    -webkit-backdrop-filter: none;',
    '    backdrop-filter: none;',
    '  }',
    '}',
    '',
  ].join('\n');
}

// ---------- bridge-4x: compat alias sheet ----------

const normalise = (v) => String(v).replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();

/** D-28 (TOKENS-THEME-05): tokens/legacy d28-dark records -> { --glass-*: dark css }. */
function d28DarkFix(records, resolved) {
  const out = {};
  for (const rec of records.values()) {
    if (!rec.name.startsWith('legacy.d28-dark.')) continue;
    const name = rec.ext?.['ag.legacyVar'];
    const v = resolved.get(rec.name);
    if (!name || !v || typeof v !== 'object' || !('dark' in v))
      die(`${rec.name}: D-28 record must name ag.legacyVar and alias a {light, dark} sys colour`);
    out[name] = colorToCss(v.dark);
  }
  return out;
}

/** Classify alias-map entries that have neither a successor nor a frozen 4.x value. The
 *  4.x token sheets never declared them, so a compat declaration would change what their
 *  readers render; they stay undeclared and readers keep their own var() fallback. The
 *  report names where (if anywhere) 4.x source sets each one. */
function resolveUncovered(entries, root) {
  const names = Object.entries(entries).filter(([, e]) => !e.successor && e.frozenValue === null).map(([n]) => n);
  const declaredIn = new Map(names.map((n) => [n, []]));
  const skip = new Set(['src/material', 'src/styles/v5.css', 'src/styles/preview-v5.css']);
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir).sort()) {
      const p = join(dir, f);
      const rel = relative(root, p);
      if (skip.has(rel) || f === 'node_modules' || f.startsWith('.')) continue;
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (!/\.(css|ts|tsx)$/.test(f)) continue;
      const src = readFileSync(p, 'utf8');
      for (const n of names) {
        if (!src.includes(n)) continue;
        // a CSS declaration `--x:` or a JS key/setProperty argument `'--x':` / `'--x',`
        const decl = new RegExp(`(?<![\\w-])${n}(?![\\w-])\\s*:`);
        const key = new RegExp(`['"\`]${n}['"\`]\\s*[:,\\]]`);
        if (decl.test(src) || key.test(src)) declaredIn.get(n).push(rel);
      }
    }
  };
  walk(join(root, 'src'));
  return names.map((n) => ({
    name: n,
    readers: entries[n].readers,
    resolution: declaredIn.get(n).length ? 'component-scoped' : 'undeclared-in-4x',
    declaredIn: declaredIn.get(n),
    compat: 'not declared (readers keep their var() fallback / component-set value)',
  }));
}

function compatCss(map, d28) {
  const light = [], dark = [];
  for (const [name, e] of Object.entries(map.entries)) {
    if (e.successor) { light.push(`    ${name}: var(${e.successor});`); continue; }
    const fv = e.frozenValue;
    if (fv === null) continue; // resolved in dist/tokens/4x/compat-resolution.json
    if (typeof fv === 'object') {
      light.push(`    ${name}: ${normalise(fv.light)};`);
      if (d28[name] === undefined && fv.dark !== undefined && normalise(fv.dark) !== normalise(fv.light))
        dark.push(`    ${name}: ${normalise(fv.dark)};`);
    } else light.push(`    ${name}: ${normalise(fv)};`);
  }
  for (const name of Object.keys(d28)) {
    const e = map.entries[name];
    if (!e || e.successor) die(`D-28: ${name} is not a frozen alias-map entry`);
  }
  const d28Lines = Object.entries(d28).sort().map(([n, v]) => `    ${n}: ${v};`);
  const uncovered = Object.values(map.entries).filter((e) => !e.successor && e.frozenValue === null).length;
  return [
    LAYER_ORDER,
    '/* @generated by scripts/tokens/build.mjs --platform bridge-4x from tokens/compat-alias-map.json',
    `   (${Object.keys(map.entries).length} --glass-* reader names). ${uncovered} names with no rendered 4.x value are`,
    '   deliberately not declared; see dist/tokens/4x/compat-resolution.json. Do not edit. */',
    '@layer ag.compat {',
    '  :where(:root) {',
    ...light,
    '  }',
    '  :where(:root[data-ag-scheme="dark"], [data-theme="dark"], .dark) {',
    ...dark,
    '    /* D-28 visual fix (TOKENS-THEME-05): dark-scheme theme text from',
    '       tokens/legacy/d28-dark-text.tokens.json (5.0 sys on-surface pair, dark value). */',
    ...d28Lines,
    '  }',
    '}',
    '',
  ].join('\n');
}

// ---------- driver ----------

export async function runBridge4x({ tokenDir = join(ROOT, 'tokens'), outRoot = ROOT, srcRoot = ROOT, quiet = false } = {}) {
  if (LAYER_ORDER !== CONTRACT_LAYER_ORDER_STATEMENT)
    die(`layer order drift: emitters use "${LAYER_ORDER}" but the contract declares "${CONTRACT_LAYER_ORDER_STATEMENT}"`);

  const schema = loadSchema(join(tokenDir, '$schema.json'));
  const errors = [];
  for (const f of discoverTokenFiles(tokenDir)) {
    let tree;
    try { tree = JSON.parse(readFileSync(f, 'utf8')); }
    catch (e) { die(`${f}: invalid JSON: ${e.message}`); }
    for (const e of validateTokenFile(tree, schema, f)) errors.push(`${f} at ${e.path}: ${e.message}`);
  }
  if (errors.length) die(`schema violations:\n  ${errors.join('\n  ')}`);

  const records = loadTokens(tokenDir);
  guardMaterialAliases(records);
  const resolved = resolveAliases(records);
  guardPresets(records, resolved);
  const axisDefs = readAxisDefs(records, resolved);
  const cells = expandModes(records, resolved, axisDefs);

  const written = [];
  const write = (rel, content) => {
    const p = join(outRoot, rel);
    mkdirSync(dirname(p), { recursive: true });
    const prev = existsSync(p) ? readFileSync(p, 'utf8') : null;
    if (prev !== content) writeFileSync(p, content);
    written.push(rel);
    if (!quiet) console.log(`${prev === content ? 'ok' : 'wrote'} ${rel}`);
  };

  // 5.0 token sheet (next dist/tokens.css)
  const tokensCss = layerFirst(await emitTokensCss(cells, axisDefs, records, resolved));
  write('src/styles/v5.css', tokensCss);

  // compiled material cells (next src/material/css/generated/*)
  const matrix = solveContrastMatrix(records, resolved);
  const laddersCss = layerFirst(await prettierFormat(buildLadders(records, resolved), 'css'));
  const floorsCss = layerFirst(await prettierFormat(buildFloors(records, resolved, matrix), 'css'));
  const propertiesCss = layerFirst(await prettierFormat(buildProperties(), 'css'));
  write('src/material/css/ladders.css', laddersCss);
  write('src/material/css/floors.css', floorsCss);
  write('src/material/css/properties.css', propertiesCss);

  // preview: tokens + recipe + ladders + floors, scoped; one sheet, two committed paths
  const recipePath = join(srcRoot, 'src/material/css/material.css');
  if (!existsSync(recipePath)) die('src/material/css/material.css (the 5.0 recipe) is missing');
  const recipe = readFileSync(recipePath, 'utf8');
  if (/!important/.test(recipe.replace(/\/\*[\s\S]*?\*\//g, ''))) die('src/material/css/material.css contains !important');
  const previewBody = [
    scopeCss(tokensCss, 'src/styles/v5.css'),
    scopeCss(recipe, 'src/material/css/material.css'),
    scopeCss(laddersCss, 'src/material/css/ladders.css'),
    scopeCss(floorsCss, 'src/material/css/floors.css'),
    ladderBinding(),
  ].join('\n');
  const previewCss = layerFirst(await prettierFormat([
    '/* @generated by scripts/tokens/build.mjs --platform bridge-4x. Opt-in 4.3 preview: the 5.0 token',
    `   sheet, material.css recipe and compiled ladders/floors, every rule scoped under ${PREVIEW_SCOPE}.`,
    '   Outside that subtree nothing matches. Do not edit. */',
    previewBody,
  ].join('\n'), 'css'));
  write('src/styles/preview-v5.css', previewCss);
  write('src/material/css/preview-v5.css', previewCss);

  // compat alias sheet + D-28
  const map = JSON.parse(readFileSync(join(tokenDir, 'compat-alias-map.json'), 'utf8'));
  const d28 = d28DarkFix(records, resolved);
  write('src/material/compat/tokens.css', await prettierFormat(compatCss(map, d28), 'css'));

  // dist mirror + reports (not committed)
  const distDir = 'dist/tokens/4x';
  write(`${distDir}/tokens.css`, tokensCss);
  write(`${distDir}/preview-v5.css`, previewCss);
  const resolution = resolveUncovered(map.entries, srcRoot);
  write(`${distDir}/compat-resolution.json`, JSON.stringify({ source: 'tokens/compat-alias-map.json', uncovered: resolution.length, entries: resolution }, null, 1) + '\n');
  write(`${distDir}/manifest.json`, JSON.stringify({
    platform: 'bridge-4x',
    source: 'tokens/**/*.tokens.json (same tree as next) + tokens/compat-alias-map.json',
    outputs: BRIDGE_OUTPUTS,
    agVars: new Set(cells.map((c) => c.cssVar).filter((v) => typeof v === 'string' && v.startsWith('--ag-'))).size,
    aliases: Object.keys(map.entries).length,
    d28: d28,
  }, null, 1) + '\n');

  if (!quiet) console.log(`bridge-4x: ${written.length} files; ${Object.keys(map.entries).length} aliases; D-28 ${Object.keys(d28).length} names`);
  return { written, d28, resolution };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const platform = flag('--platform');
  if (platform !== 'bridge-4x') {
    console.error(`build.mjs: only --platform bridge-4x is supported on this line (got "${platform}")`);
    process.exit(1);
  }
  const out = flag('--out');
  runBridge4x({ outRoot: out ? resolve(ROOT, out) : ROOT }).catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
