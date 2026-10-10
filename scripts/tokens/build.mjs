#!/usr/bin/env node
/* MAT-007 token compiler entry: validate -> load -> resolve aliases -> expand modes ->
   emit formats -> prettier. Replaces the C0 placeholder writer; keeps the CLI contract
   (npm run tokens:build) and all TOKEN_OUTPUTS paths.

   Failure contract (exit 1 naming the offending token path):
     - schema violation            (validate.mjs)
     - unresolved alias            resolveAliases()
     - alias cycle                 resolveAliases()
     - material.* alias to non-sys guardMaterialAliases()
     - preset defining material.*  guardPresets()
     - preset/theme output containing --_ag-*  emitTokensCss()
   Flags: --fixtures <dir> (token root override), --out <dir> (output root override,
   used by tests/tokens/determinism.test.ts to build into temp dirs). */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverTokenFiles, validateTokenFile, loadSchema, isAlias } from './validate.mjs';
import { colorToCss, gamutMapOklch, oklchToSrgb, clampSrgb, srgbToHex } from './color.mjs';
import { springToLinear, springDurationMs, compileSpring } from './transforms/motion-spring.mjs';
import { buildLadders, buildFloors } from './transforms/glass-material.mjs';
import { solveContrastMatrix, matrixJson } from './transforms/contrast-solve.mjs';
import { createHash } from 'node:crypto';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const AXIS_ORDER = ['scheme', 'contrast', 'transparency', 'density', 'preset'];

// ---------- load ----------

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

// ---------- alias resolution ----------

const REF_RE = /\{([^{}]+)\}/g;

/** Deep-resolve {a.b.c} aliases in a token value. Throws (with path) on unresolved/cycle. */
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

// ---------- mode expansion ----------

/** Read tokens/modes/axes.tokens.json defs: axis -> {default, values, selectors}. */
function readAxisDefs(records, resolved) {
  const defs = {};
  for (const rec of records.values()) {
    const axis = rec.ext?.['ag.axisDef'];
    if (typeof axis === 'string' && rec.name.startsWith('mode.')) defs[axis] = resolved.get(rec.name);
  }
  return defs;
}

/**
 * Expand each public token into cells: [{ cssVar, value(rendered css string), axis, axisValue }].
 * Non-mode tokens produce one base cell. Scheme-pair colors emit light-dark() at base plus a
 * 'dark' cell for the fallback block. mode-table leaves expand per axis value.
 */
export function expandModes(records, resolved, axisDefs) {
  const cells = [];
  for (const [name, rec] of [...records.entries()].sort()) {
    const ext = rec.ext ?? {};
    const cssVar = ext['ag.cssVar'];
    const isPublic = ext['ag.public'] === true && typeof cssVar === 'string';
    const type = rec.type;
    const v = resolved.get(name);

    if (type === 'mode-table' && ext['ag.axisDef']) continue;                 // axis defs emit nothing
    if (typeof ext['ag.axisDef'] === 'string') continue;                       // solver spec tokens
    if (ext['ag.legacy'] === true) continue;                                   // frozen 4.x primitives emit nothing
    // private tokens with a cssVar still emit (--_ag-* recipe/state vars);
    // private tokens without one feed generators only
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

// ---------- value rendering ----------

const dim = (v) => `${v.value}${v.unit}`;
// ---------- emit ----------

// ---------- emitters (contract module paths) ----------
import { emitTokensCss, HEADER_CSS, LAYER_ORDER } from './formats/css-layered.mjs';
import { emitTokensTs, emitPresetsTs, emitMotionTs, emitMaterialSpecTs } from './formats/ts-constants.mjs';
import { emitManifest, emitManifestTs } from './formats/manifest.mjs';
import { emitTailwind } from './formats/tailwind-bridge.mjs';
import { emitRegistry } from './formats/registry-cssvars.mjs';
import { buildProperties } from './formats/property-registry.mjs';
import { prettierFormat, die, renderValue } from './formats/_shared.mjs';

// ---------- driver ----------

export async function runBuild({ tokenDir = join(ROOT, 'tokens'), outRoot = ROOT, quiet = false } = {}) {
  const schema = loadSchema(join(tokenDir, '$schema.json'));
  const files = discoverTokenFiles(tokenDir);
  const errors = [];
  for (const f of files) {
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

  const write = (rel, content) => {
    const p = join(outRoot, rel);
    mkdirSync(dirname(p), { recursive: true });
    const prev = existsSync(p) ? readFileSync(p, 'utf8') : null;
    if (prev !== content) writeFileSync(p, content);
    if (!quiet) console.log(`${prev === content ? 'ok' : 'wrote'} ${relative(ROOT, p)}`);
  };

  // contract outputs (src/contracts/tokens.ts TOKEN_OUTPUTS)
  let tokensCss = await emitTokensCss(cells, axisDefs, records, resolved);
  write('dist/tokens.css', tokensCss);
  const { tokensTs } = await emitTokensTs(cells);
  write('src/tokens/generated/tokens.ts', tokensTs);
  write('src/tokens/generated/tokens.d.ts', tokensTs.replace("export function token", "export declare function token").replace('{\n  return tokens[path];\n}', ';'));
  // aura-glass/tokens map exposes exactly {tokens, token, materialSpec, manifest} (MAT-078)
  write('src/tokens/generated/material-spec.ts', await emitMaterialSpecTs(records, resolved));
  write('src/tokens/generated/presets.ts', await emitPresetsTs(records, resolved));
  // manifest.ts emitted after dist/tokens/manifest.json at the end of runBuild

  write('src/tokens/index.ts', [
    '/* @generated by scripts/tokens/build.mjs. Do not edit by hand. */',
    "export { tokens, token } from './generated/tokens.js';",
    "export type { TokenName, TokenPath } from './generated/tokens.js';",
    "export { materialSpec } from './generated/material-spec.js';",
    "export { manifest } from './generated/manifest.js';",
    '',
  ].join('\n'));
  write('src/motion/tokens.generated.ts', await emitMotionTs(records, resolved));

  // contrast matrix first: floors consume its solved tint floors (MAT-046/047/048)
  const specPath = join(tokenDir, 'contrast', 'contrast-matrix.tokens.json');
  const matrix = solveContrastMatrix(records, resolved);
  matrix.inputSha256 = createHash('sha256').update(readFileSync(specPath, 'utf8')).digest('hex');
  write('dist/contrast-matrix.json', matrixJson(matrix));
  // MAT-047: committed solver output at the canonical generated path — nested
  // [preset][scheme][contrast][transparency][variant][thickness][backdrop] ->
  // {floorAlpha, minRatio, pair, apcaLc}, keys sorted; never hand-edited.
  write('tokens/generated/opacity-floors.json', matrixJson({
    version: 1,
    generatedFrom: matrix.generatedFrom,
    inputSha256: matrix.inputSha256,
    cells: matrix.cells,
  }));
  // MAT-091: tokens/contrast/busy-reference.json is a hand-curated DS-owned artefact,
  // committed once — the build never rewrites it (keeps the generated surface diffable).

  // material ladders + floors + @property registrations (MAT-026/027, transforms MAT-038+)
  const laddersCss = await prettierFormat(buildLadders(records, resolved), 'css');
  const floorsCss = await prettierFormat(buildFloors(records, resolved, matrix), 'css');
  const propertiesCss = await prettierFormat(buildProperties(), 'css');
  write('src/material/css/generated/ladders.css', laddersCss);
  write('src/material/css/generated/floors.css', floorsCss);
  write('src/material/css/generated/properties.css', propertiesCss);

  // tailwind bridge + registry + css/ tokens copy (MAT-068/072; @import "./tokens.css" resolves in dist/css)
  const tailwindCss = await emitTailwind(cells, records, resolved);
  // MAT-003: every --_ag-* private referenced under src/** must be registered in
  // generated css. Emit a privates registry block inside @layer ag.tokens —
  // `initial` keeps the var guaranteed-invalid so var(--_ag-x, fb) fallbacks
  // behave exactly as when the name was undeclared.
  const PRIVATE_RE = /--_ag-[a-z0-9-]+/g;
  const emittedPrivates = new Set(cells.map((c) => c.cssVar));
  const usedPrivates = new Set();
  const scanDir = (dir) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) { if (!p.includes('/generated/')) scanDir(p); }
      else if (/\.(css|ts|tsx|mts|mjs)$/.test(p) && !p.includes('/generated/'))
        for (const m of readFileSync(p, 'utf8').matchAll(PRIVATE_RE)) usedPrivates.add(m[0]);
    }
  };
  scanDir(join(ROOT ?? process.cwd(), 'src'));
  const missingPrivates = [...usedPrivates].filter((n) => !emittedPrivates.has(n)).sort();
  if (missingPrivates.length) {
    const lines = ['', '  /* MAT-003 component privates registry — names declared with `initial` so',
       '     var(--_ag-x, <fallback>) resolution is unchanged; component css/JS still owns values. */'];
    for (const n of missingPrivates) lines.push(`    ${n}: initial;`);
    // append inside the final @layer ag.tokens :root block
    tokensCss = tokensCss.replace(/(  }\n}\n?)$/, `${lines.join('\n')}\n$1`);
  }
  write('dist/css/tokens.css', tokensCss);
  write('dist/css/tailwind.css', tailwindCss);
  write('dist/tailwind.css', tailwindCss); // ./tailwind.css subpath in package exports
  write('dist/tokens/registry-cssvars.json', emitRegistry(cells));

  // compat layer: frozen 4.x primitives + generated alias map (MAT-073..076).
  // emitCompat is the sole writer of dist/compat/tokens.css.
  if (existsSync(join(tokenDir, 'legacy', '4x-rendered.tokens.json'))) {
    const { emitCompat } = await import('./formats/compat-aliases.mjs');
    // [data-theme=dark], .dark compat block: every --ag-color-* dark value.
    const darkOverrides = {};
    for (const c of cells)
      if (c.axis === 'scheme' && c.axisValue === 'dark' && typeof c.cssVar === 'string' && c.cssVar.startsWith('--ag-color-'))
        darkOverrides[c.cssVar] = renderValue(c);
    const { count } = emitCompat(write, tokenDir, darkOverrides);
    if (!quiet) console.log(`compat: ${count} reader names mapped`);
  }

  // manifest LAST: consumers counts cover every emitted css + hand-written src
  const readerCorpus = [tokensCss, laddersCss, floorsCss, propertiesCss, tailwindCss];
  const walkSrc = (d) => {
    if (!existsSync(d)) return;
    for (const name of readdirSync(d).sort()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      const p = join(d, name);
      if (statSync(p).isDirectory()) walkSrc(p);
      else if (/\.(ts|tsx|css)$/.test(name) && !p.includes('/generated/') && !p.includes('__tests__'))
        readerCorpus.push(readFileSync(p, 'utf8'));
    }
  };
  walkSrc('src');
  const manifestJson = emitManifest(records, cells, readerCorpus);
  write('dist/tokens/manifest.json', manifestJson);
  write('src/tokens/generated/manifest.ts', emitManifestTs(manifestJson));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const fixtures = flag('--fixtures');
  const out = flag('--out');
  // top-level await breaks jest's CJS transform — wrap in an async main.
  void (async () => {
    await runBuild({
      tokenDir: fixtures ? resolve(ROOT, fixtures) : join(ROOT, 'tokens'),
      outRoot: out ? resolve(ROOT, out) : ROOT,
    });
  })();
}
