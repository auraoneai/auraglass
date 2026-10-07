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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverTokenFiles, validateTokenFile, loadSchema, isAlias } from './validate.mjs';
import { colorToCss, gamutMapOklch, oklchToSrgb, clampSrgb, srgbToHex } from './color.mjs';
import { springToLinear, springDurationMs, compileSpring } from './spring.mjs';
import { buildLadders, buildFloors, buildProperties } from './ladders.mjs';
import { solveContrastMatrix, matrixJson } from './contrast-solve.mjs';
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
    if (!isPublic && type !== 'motion-spring') continue;                       // private tokens feed generators only

    const axis = ext['ag.axis'];
    if (type === 'mode-table' && axis) {
      const def = axisDefs[axis];
      for (const [axisValue, cell] of Object.entries(v)) {
        if (def && !def.values.includes(axisValue))
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
const bezier = (v) => `cubic-bezier(${v.join(', ')})`;

export function renderValue(rec) {
  const v = rec.value;
  switch (rec.renderType ?? rec.type) {
    case 'color': {
      if (v && typeof v === 'object' && 'light' in v && 'dark' in v)
        return `light-dark(${colorToCss(v.light)}, ${colorToCss(v.dark)})`;
      return colorToCss(v);
    }
    case 'dimension': {
      if (v && typeof v === 'object' && 'min' in v && 'max' in v) {
        const { min, max } = v;
        return `clamp(${dim(min)}, calc(${dim(min)} + (${max.value - min.value}) * ((100vw - 360px) / 920)), ${dim(max)})`;
      }
      return dim(v);
    }
    case 'duration': return `${v.value}${v.unit}`;
    case 'cubicBezier': return bezier(v);
    case 'motion-spring': return compileSpring(v, rec.name).linear;
    case 'shadow': {
      const s = v;
      return `${dim(s.offsetX)} ${dim(s.offsetY)} ${dim(s.blur)} ${s.spread ? dim(s.spread) : '0px'} ${colorToCss(s.color)}`;
    }
    case 'number': case 'fontWeight': return String(v);
    case 'fontFamily': return String(v);
    case 'string': return typeof v === 'string' ? v : JSON.stringify(v);
    default: return typeof v === 'string' ? v : JSON.stringify(v);
  }
}

// ---------- emit ----------

async function prettierFormat(code, parser) {
  try {
    const prettier = await import('prettier');
    return await prettier.format(code, { parser });
  } catch {
    return code; // prettier unavailable: output is already deterministic
  }
}

const HEADER_CSS = '/* @generated by scripts/tokens/build.mjs. Source: tokens/**/*.tokens.json. Do not edit. */';

/** Emit dist/tokens.css (MAT-026). */
export async function emitTokensCss(cells, axisDefs, records, resolved) {
  const base = [];                       // decls for :root
  const axisBlocks = new Map();          // `${axis}=${axisValue}` -> decls
  const darkFallback = [];               // decls for scheme=dark fallback block
  const lightFallback = [];              // decls for the light branch inside @supports fallback :root
  const springVars = [];                 // --ag-spring-* vars (linear() fallback block)

  const pushAxis = (axis, axisValue, cssVar, decl) => {
    const key = `${axis}=${axisValue}`;
    if (!axisBlocks.has(key)) axisBlocks.set(key, []);
    axisBlocks.get(key).push(`    ${cssVar}: ${decl};`);
  };

  for (const cell of cells) {
    if (!cell.cssVar) continue;
    const css = renderValue(cell);
    const extra = [];
    if (cell.renderType === 'motion-spring') {
      extra.push(`${cell.cssVar}-duration: ${compileSpring(cell.value, cell.name).durationMs}ms;`);
      springVars.push(cell.cssVar);
    }
    if (cell.axis === 'scheme' && cell.renderType === 'color') {
      // scheme-pair color: base is light-dark(); dark cell only used in the fallback block
      if (cell.axisValue === 'dark') { darkFallback.push(`      ${cell.cssVar}: ${colorToCss(cell.value)};`); continue; }
      base.push(`    ${cell.cssVar}: ${css};`);
      lightFallback.push(`      ${cell.cssVar}: ${colorToCss(cell.value.light)};`);
      continue;
    }
    if (!cell.axis) { base.push(`    ${cell.cssVar}: ${css};`, ...extra.map((e) => `    ${e}`)); continue; }
    const def = axisDefs[cell.axis];
    if (cell.axisValue === def?.default) { base.push(`    ${cell.cssVar}: ${css};`, ...extra.map((e) => `    ${e}`)); }
    else pushAxis(cell.axis, cell.axisValue, cell.cssVar, css);
  }

  // shadcn bridge: the 8 non-ag public vars are aliases to ag tokens (contract PUBLIC_CSS_VARS.shadcn)
  base.push(
    '    --background: var(--ag-color-canvas);',
    '    --foreground: var(--ag-color-on-surface);',
    '    --primary: var(--ag-color-accent);',
    '    --primary-foreground: var(--ag-color-on-accent);',
    '    --muted: var(--ag-color-on-surface-muted);',
    '    --border: var(--ag-color-border);',
    '    --ring: var(--ag-color-focus-inner);',
    '    --radius: var(--ag-radius-md);',
  );

  // preset emission: [data-ag-theme=<id>] blocks may only override --ag-* vars (guard)
  const presetDecls = new Map();
  for (const rec of records.values()) {
    if (!rec.name.startsWith('preset.') || rec.type !== 'theme-preset') continue;
    const id = rec.name.split('.')[1];
    const v = resolved.get(rec.name);
    const decls = [
      `    --ag-color-canvas: light-dark(${colorToCss(v.canvas.light)}, ${colorToCss(v.canvas.dark)});`,
      `    --ag-color-accent: ${colorToCss(v.accent)};`,
    ];
    if (decls.some((d) => /--_ag-/.test(d))) die(`${rec.name}: preset/theme output contains --_ag-*`);
    presetDecls.set(id, decls);
  }

  const section = (title, body) => `\n  /* ${title} */\n${body}`;
  const parts = [HEADER_CSS, '', LAYER_ORDER, '', '@layer ag.tokens {', '  :root {', '    color-scheme: light dark;', ...base, '  }'];

  // axis blocks: attribute selectors + media mirrors on :root:not([data-ag-<axis>])
  for (const axis of AXIS_ORDER) {
    const def = axisDefs[axis];
    if (!def) continue;
    for (const axisValue of def.values) {
      if (axisValue === def.default) continue;
      const decls = [...(axisBlocks.get(`${axis}=${axisValue}`) ?? [])];
      if (axis === 'scheme') decls.unshift(`    color-scheme: ${axisValue};`);
      if (!decls.length) continue;
      const selectors = def.selectors?.[axisValue] ?? [];
      for (const sel of selectors) {
        if (sel.startsWith('@media')) {
          const media = sel;
          parts.push('', `  ${media} {`, `    :root:not([data-ag-${axis}]) {`, ...decls.map((d) => `  ${d}`), '    }', '  }');
        } else {
          parts.push('', `  ${sel} {`, ...decls, '  }');
        }
      }
    }
  }

  for (const [id, decls] of presetDecls)
    parts.push('', `  [data-ag-theme="${id}"] {`, ...decls, '  }');

  parts.push('}', '');

  // scheme fallback: no light-dark() support
  parts.push(
    '@supports not (color: light-dark(#000, #fff)) {',
    '  :root {', ...lightFallback, '  }',
    '  [data-ag-scheme="dark"] {', '    color-scheme: dark;', ...darkFallback.map((d) => d.slice(2)), '  }',
    '  @media (prefers-color-scheme: dark) {',
    '    :root:not([data-ag-scheme]) {', '      color-scheme: dark;', ...darkFallback, '    }',
    '  }',
    '}', '',
  );

  // oklch fallback: hex only here (MAT-026)
  const hexDecls = [];
  for (const cell of cells) {
    if (!cell.cssVar || cell.axis) continue;
    if (cell.renderType === 'color' && cell.value && typeof cell.value === 'object' && 'light' in cell.value) {
      const c = cell.value.light;
      if (c?.colorSpace === 'oklch') hexDecls.push(`    ${cell.cssVar}: ${srgbToHex(clampSrgb(oklchToSrgb(gamutMapOklch({ l: c.components[0], c: c.components[1], h: c.components[2] }))))};`);
    } else if (cell.renderType === 'color' && cell.value?.colorSpace === 'oklch') {
      const c = cell.value;
      hexDecls.push(`    ${cell.cssVar}: ${srgbToHex(clampSrgb(oklchToSrgb(gamutMapOklch({ l: c.components[0], c: c.components[1], h: c.components[2] }))))};`);
    }
  }
  parts.push('@supports not (color: oklch(0 0 0)) {', '  :root {', ...hexDecls, '  }', '}', '');

  // linear() fallback (MAT-042): springs degrade to the emphasized-decelerate curve
  if (springVars.length) {
    parts.push(
      '@supports not (transition-timing-function: linear(0, 1)) {',
      '  :root {',
      ...springVars.map((v) => `    ${v}: var(--ag-ease-emphasized-decelerate);`),
      '  }',
      '}',
      '',
    );
  }
  return prettierFormat(parts.join('\n'), 'css');
}

const LAYER_ORDER = '@layer ag.compat, ag.reset, ag.tokens, ag.material, ag.components, ag.a11y;';

/** Emit src/tokens/generated/tokens.ts + src/tokens/index.ts (MAT-028). */
export async function emitTokensTs(cells) {
  const vars = [...new Set(cells.filter((c) => c.cssVar).flatMap((c) =>
    c.renderType === 'motion-spring' ? [c.cssVar, `${c.cssVar}-duration`] : [c.cssVar]))].sort();
  const entries = vars.map((v) => `  ${JSON.stringify(v)}: 'var(${v})',`);
  const gen = [
    '/* @generated by scripts/tokens/build.mjs. Do not edit by hand. */',
    'export const tokens = {', ...entries, '} as const;',
    'export type TokenName = keyof typeof tokens;',
    'export type TokenPath = TokenName;',
    '',
    '/** The var(--ag-*) reference string for a public token. */',
    'export function token(path: TokenPath): string {',
    '  return tokens[path];',
    '}',
    '',
  ].join('\n');
  const index = [
    '/* @generated by scripts/tokens/build.mjs. Do not edit by hand. */',
    "export { tokens, token } from './generated/tokens.js';",
    "export type { TokenName, TokenPath } from './generated/tokens.js';",
    '',
  ].join('\n');
  return { tokensTs: await prettierFormat(gen, 'typescript'), indexTs: index };
}

/** Emit src/motion/tokens.generated.ts (MAT-028, MOT §4.3 shape). */
export async function emitMotionTs(records, resolved) {
  const lines = ['/* @generated by scripts/tokens/build.mjs. Do not edit by hand. */', 'export const motionTokens = {'];
  for (const [name, rec] of [...records.entries()].sort()) {
    if (!name.startsWith('sys.motion.')) continue;
    const v = resolved.get(name);
    const key = name.replace(/^sys\.motion\./, '');
    if (rec.type === 'duration') lines.push(`  ${JSON.stringify(key)}: ${v.value},`);
    else if (rec.type === 'cubicBezier') lines.push(`  ${JSON.stringify(key)}: 'cubic-bezier(${v.join(', ')})',`);
    else if (rec.type === 'motion-spring') {
      lines.push(`  ${JSON.stringify(key)}: '${compileSpring(v, name).linear}',`);
      lines.push(`  ${JSON.stringify(`${key}-duration`)}: ${compileSpring(v, name).durationMs},`);
    }
  }
  lines.push('} as const;', '');
  return prettierFormat(lines.join('\n'), 'typescript');
}

/** Emit dist/tokens/manifest.json (MAT-029, contract TokenManifest shape). */
export function emitManifest(records, cells) {
  const MODES_KEYS = new Set(['light', 'dark', 'more', 'tinted', 'solid', 'compact', 'spacious']);
  const byToken = new Map();
  for (const c of cells) if (c.cssVar) {
    if (!byToken.has(c.name)) byToken.set(c.name, []);
    byToken.get(c.name).push(c);
  }
  const tokens = [];
  for (const [name, rec] of [...records.entries()].sort()) {
    const cs = byToken.get(name);
    if (!cs || !rec.ext?.['ag.public']) continue;
    const tier = rec.ext['ag.tier'];
    if (tier === 'ref') continue;
    const base = cs.find((c) => !c.axis || c.axisValue === 'light' || c.axisValue === 'regular' || c.axisValue === 'tinted' || c.axisValue === 'aura' || c.axisValue === 'standard') ?? cs[0];
    const modes = {};
    for (const c of cs) {
      if (!c.axisValue || !MODES_KEYS.has(c.axisValue)) continue;
      modes[c.axisValue] = renderValue({ ...c, renderType: c.renderType });
    }
    const typeMap = { 'mode-table': rec.ext?.['ag.valueType'] ?? 'number' };
    tokens.push({
      name,
      cssVar: base.cssVar,
      type: typeMap[rec.type] ?? rec.type,
      tier,
      modes,
      // resolved default: light scheme, standard contrast, tinted, regular density, aura preset
      value: base.axis === 'scheme' && base.value?.light !== undefined ? colorToCss(base.value.light) : renderValue(base),
    });
  }
  return JSON.stringify({ version: 1, generatedFrom: 'tokens/**/*.tokens.json', tokens }, null, 1) + '\n';
}

// ---------- driver ----------

function die(msg) {
  console.error(`tokens: ${msg}`);
  process.exit(1);
}

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
  write('dist/tokens.css', await emitTokensCss(cells, axisDefs, records, resolved));
  write('dist/tokens/manifest.json', emitManifest(records, cells));
  const { tokensTs, indexTs } = await emitTokensTs(cells);
  write('src/tokens/generated/tokens.ts', tokensTs);
  write('src/tokens/generated/tokens.d.ts', tokensTs.replace("export function token", "export declare function token").replace('{\n  return tokens[path];\n}', ';'));
  write('src/tokens/index.ts', indexTs);
  write('src/motion/tokens.generated.ts', await emitMotionTs(records, resolved));

  // contrast matrix first: floors consume its solved tint floors (MAT-046/047/048)
  const specPath = join(tokenDir, 'contrast', 'contrast-matrix.tokens.json');
  const matrix = solveContrastMatrix(records, resolved);
  matrix.inputSha256 = createHash('sha256').update(readFileSync(specPath, 'utf8')).digest('hex');
  write('dist/contrast-matrix.json', matrixJson(matrix));

  // material ladders + floors + @property registrations (MAT-026/027, transforms MAT-038+)
  write('src/material/css/generated/ladders.css', await prettierFormat(buildLadders(records, resolved), 'css'));
  write('src/material/css/generated/floors.css', await prettierFormat(buildFloors(records, resolved, matrix), 'css'));
  write('src/material/css/generated/properties.css', await prettierFormat(buildProperties(), 'css'));

  // compat aliases (MAT-073): map file is owned by another lane; emit only if present
  const compatMap = join(tokenDir, 'compat-alias-map.json');
  if (existsSync(compatMap)) {
    const map = JSON.parse(readFileSync(compatMap, 'utf8'));
    const lines = [HEADER_CSS, '', LAYER_ORDER, '', '@layer ag.compat {', '  :root {'];
    for (const [oldName, newName] of Object.entries(map).sort())
      if (newName) lines.push(`    ${oldName}: var(${newName});`);
    lines.push('  }', '}', '');
    write('dist/compat/tokens.css', await prettierFormat(lines.join('\n'), 'css'));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const flag = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const fixtures = flag('--fixtures');
  const out = flag('--out');
  await runBuild({
    tokenDir: fixtures ? join(ROOT, fixtures) : join(ROOT, 'tokens'),
    outRoot: out ? join(ROOT, out) : ROOT,
  });
}
