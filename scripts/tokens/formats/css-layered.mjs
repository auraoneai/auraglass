// MAT-026/MAT-070: dist/css/tokens.css emitter — layered :root + axis blocks,
// scheme-paired light-dark(), shadcn bridge, @supports fallbacks.
import { colorToCss, gamutMapOklch, oklchToSrgb, clampSrgb, srgbToHex } from '../color.mjs';
import { compileSpring } from '../transforms/motion-spring.mjs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { die, dim, renderValue, prettierFormat, HEADER_CSS, LAYER_ORDER, SHADCN_MAP, AXIS_ORDER } from './_shared.mjs';
export { HEADER_CSS, LAYER_ORDER };

/** REQ-MAT-20 / OD-16 C-2: the shadcn-authoritative direction keys on this attribute. */
export const SHADCN_SOURCE_ATTR = 'data-ag-shadcn-source';
const MATERIAL_CONTRACT = fileURLToPath(new URL('../../../src/contracts/material.ts', import.meta.url));

/** True when the attribute registry (contract S-01 AG_ATTRIBUTES) registers
 *  data-ag-shadcn-source. Until contract C-2 (OD-16) adds it, the
 *  `:root[data-ag-shadcn-source]` block is not emitted (REQ-MAT-20 fallback):
 *  dist/ must not key on an unregistered data-ag-* attribute. Reads the real
 *  registry object (esbuild-bundled to CJS, evaluated in-process; works under
 *  jest's CJS runtime where dynamic import() does not). */
export function shadcnSourceRegistered(contractPath = MATERIAL_CONTRACT) {
  const req = createRequire(import.meta.url);
  const { buildSync } = req('esbuild');
  const out = buildSync({
    entryPoints: [contractPath], bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'silent',
  });
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', out.outputFiles[0].text)(mod, mod.exports, req);
  const registry = mod.exports.AG_ATTRIBUTES;
  if (!registry || typeof registry !== 'object') die(`shadcn bridge: AG_ATTRIBUTES not found in ${contractPath}`);
  return Object.hasOwn(registry, SHADCN_SOURCE_ATTR);
}

/** Throws/dies on a var() cycle in the emitted declaration graph of one mode.
 *  `decls` is the ordered list of `--name: value` pairs that apply in that mode
 *  (later entries override earlier ones, as in the cascade). */
export function assertShadcnAcyclic(decls, mode) {
  const values = new Map();
  for (const [name, value] of decls) values.set(name, value);
  const edges = new Map();
  for (const [name, value] of values)
    edges.set(name, [...value.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)].map((m) => m[1]));
  const seen = new Set();
  const stack = new Set();
  const visit = (n, path) => {
    if (stack.has(n)) die(`shadcn bridge: var cycle in ${mode} mode: ${[...path, n].join(' -> ')}`);
    if (seen.has(n)) return;
    stack.add(n);
    for (const m of edges.get(n) ?? []) visit(m, [...path, n]);
    stack.delete(n);
    seen.add(n);
  };
  for (const n of edges.keys()) visit(n, []);
}

/** Emit dist/tokens.css (MAT-026).
 *  opts.shadcnMap    shadcn <-> ag pairs (default SHADCN_MAP; injectable for the cycle fixture)
 *  opts.shadcnSource emit the `:root[data-ag-shadcn-source]` block (default: the
 *                    attribute is registered in AG_ATTRIBUTES, see shadcnSourceRegistered) */
export async function emitTokensCss(cells, axisDefs, records, resolved, opts = {}) {
  const shadcnMap = opts.shadcnMap ?? SHADCN_MAP;
  const emitShadcnSource = opts.shadcnSource ?? shadcnSourceRegistered();
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

  // MAT-06 (REQ-MAT-06): density-scaled space reads the public --ag-density, and
  // every [data-ag-density=…] block redeclares --ag-density plus each scaled
  // --ag-space-* so a nested density wrapper (not only <html>) rescales spacing.
  // Custom properties inherit their computed value, so a :root-only calc() would
  // stay at the :root density inside a nested block.
  const densityScaled = [];              // [cssVar, calc(<px> * var(--ag-density))]
  const readouts = new Map();            // private axis var -> public readout var (e.g. --_ag-density -> --ag-density)
  for (const cell of cells) {
    if (!cell.cssVar || cell.axis) continue;
    const m = typeof cell.value === 'string' ? cell.value.match(/^var\((--_ag-[a-z0-9-]+)\)$/) : null;
    if (m && cell.cssVar.startsWith('--ag-')) readouts.set(m[1], cell.cssVar);
  }
  const densityVar = readouts.get('--_ag-density');
  if (!densityVar) die('density: no public readout token for --_ag-density (sys.density.readout)');

  for (const cell of cells) {
    if (!cell.cssVar) continue;
    let css = renderValue(cell);
    if (cell.renderType === 'dimension' && cell.ext?.['ag.calc'] === 'density') {
      if (cell.axis) die(`${cell.name}: density-scaled dimension cannot also be an axis cell`);
      css = `calc(${dim(cell.value)} * var(${densityVar}))`;
      densityScaled.push([cell.cssVar, css]);
    }
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

  // MAT-06: density factor cells per axis value, re-emitted as the public readout
  // and followed by the scaled spaces in that block.
  const densityDef = axisDefs.density;
  if (!densityDef) die('density: axis definition missing (tokens/modes/density.tokens.json)');
  const densityFactor = new Map();       // axisValue -> rendered factor
  for (const cell of cells) {
    if (cell.cssVar !== '--_ag-density') continue;
    densityFactor.set(cell.axis === 'density' ? cell.axisValue : densityDef.default, renderValue(cell));
  }
  for (const value of densityDef.values)
    if (!densityFactor.has(value)) die(`density: --_ag-density has no cell for '${value}'`);
  const densityDecls = (value) => [
    `    ${densityVar}: ${densityFactor.get(value)};`,
    ...densityScaled.map(([v, css]) => `    ${v}: ${css};`),
  ];
  for (const value of densityDef.values) {
    if (value === densityDef.default) continue;
    if (!axisBlocks.has(`density=${value}`)) axisBlocks.set(`density=${value}`, []);
    axisBlocks.get(`density=${value}`).push(...densityDecls(value));
  }

  // shadcn bridge (MAT-070, deviation D-B): bidirectional. Default direction
  // ag -> shadcn lives under :where(:root:not([data-ag-shadcn-source]));
  // on a shadcn-authored root the direction flips (shadcn -> ag with defaults).
  // The flipped block ships only when AG_ATTRIBUTES registers the attribute
  // (REQ-MAT-20: contract C-2 / OD-16; fallback = not emitted).
  const agDefault = new Map(); // --ag-* -> default decl text (from base block)
  const baseDecls = [];        // [name, value] of every base :root custom property
  for (const d of base) {
    const m = d.trim().match(/^(--[A-Za-z0-9_-]+):\s*(.+);$/);
    if (!m) continue;
    baseDecls.push([m[1], m[2]]);
    if (m[1].startsWith('--ag-')) agDefault.set(m[1], m[2]);
  }
  const shadcnSource = [];   // :root[data-ag-shadcn-source] decls (shadcn -> ag)
  const shadcnDown = [];     // :where(:root:not(...)) decls (ag -> shadcn)
  const sourcePairs = [];
  const downPairs = [];
  for (const [sh, ag] of Object.entries(shadcnMap)) {
    const def = agDefault.get(ag);
    if (!def) die(`shadcn bridge: ${ag} has no emitted default (token missing)`);
    sourcePairs.push([ag, `var(${sh}, ${def})`]);
    downPairs.push([sh, `var(${ag})`]);
  }
  for (const [n, v] of sourcePairs) shadcnSource.push(`    ${n}: ${v};`);
  for (const [n, v] of downPairs) shadcnDown.push(`    ${n}: ${v};`);
  // resolved var-graph cycle check in both directions (MAT-070), over the base
  // :root declarations plus each direction's block. Source mode is checked even
  // while its block is gated off, so enabling C-2 cannot introduce a cycle.
  assertShadcnAcyclic([...baseDecls, ...downPairs], 'default');
  assertShadcnAcyclic([...baseDecls, ...sourcePairs], 'shadcn-source');

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

  const parts = [HEADER_CSS, '', LAYER_ORDER, '', '@layer ag.tokens {', '  :root {', '    color-scheme: light dark;', '    --_ag-target: var(--ag-target-min);', ...base, '  }'];

  // --_ag-target = max(min, coarse) under coarse pointers (MAT-015)
  parts.push(
    '',
    '  @media (pointer: coarse) {',
    '    :root {',
    '      --_ag-target: var(--ag-target-coarse);',
    '    }',
    '  }',
  );

  // axis blocks: attribute selectors + media mirrors on :root:not([data-ag-<axis>])
  // MAT-12 (REQ-MAT-12/54): a non-default axis value that declares selectors
  // emits the FULL value set of every token moded on that axis. A token with
  // no cell for the value re-declares its default, so the block is the
  // complete set for that value (e.g. transparency=tinted keeps the glass
  // interaction values) and a [data-ag-transparency="tinted"] subtree inside
  // a solid ancestor resets to tinted values instead of inheriting solid ones.
  const axisCells = new Map(); // axis -> Map(cssVar -> Set(axisValue))
  for (const cell of cells) {
    if (!cell.cssVar || !cell.axis || cell.axis === 'scheme') continue;
    if (!axisCells.has(cell.axis)) axisCells.set(cell.axis, new Map());
    const byVar = axisCells.get(cell.axis);
    if (!byVar.has(cell.cssVar)) byVar.set(cell.cssVar, new Set());
    byVar.get(cell.cssVar).add(cell.axisValue);
  }
  const baseDecl = new Map(); // cssVar -> base (default) declaration line
  for (const d of base) {
    const m = d.match(/^\s*(--_?ag-[a-z0-9-]+):/i);
    if (m && !baseDecl.has(m[1])) baseDecl.set(m[1], d);
  }
  const blockSelectors = new Map(); // cssVar -> selectors of attribute blocks that re-declare it
  const noteDecls = (decls, sel) => {
    for (const d of decls) {
      const m = d.match(/^\s*(--_?ag-[a-z0-9-]+):/i);
      if (!m) continue;
      if (!blockSelectors.has(m[1])) blockSelectors.set(m[1], []);
      blockSelectors.get(m[1]).push(sel);
    }
  };
  for (const axis of AXIS_ORDER) {
    const def = axisDefs[axis];
    if (!def) continue;
    for (const axisValue of def.values) {
      if (axisValue === def.default) {
        // MAT-06: a nested [data-ag-density="regular"] inside a compact/spacious
        // subtree must reset the factor and the scaled spaces back to regular.
        if (axis === 'density')
          parts.push('', `  [data-ag-density="${axisValue}"] {`, `    --_ag-density: ${densityFactor.get(axisValue)};`, ...densityDecls(axisValue), '  }');
        continue;
      }
      const decls = [...(axisBlocks.get(`${axis}=${axisValue}`) ?? [])];
      if (axis !== 'scheme' && (def.selectors?.[axisValue] ?? []).length) {
        for (const [cssVar, values] of axisCells.get(axis) ?? []) {
          if (values.has(axisValue)) continue;
          const d = baseDecl.get(cssVar);
          if (!d) die(`mode ${axis}=${axisValue}: ${cssVar} has no default declaration to re-declare`);
          decls.push(d);
        }
      }
      if (axis === 'scheme') decls.unshift(`    color-scheme: ${axisValue};`);
      if (!decls.length) continue;
      for (const sel of def.selectors?.[axisValue] ?? [])
        noteDecls(decls, sel.startsWith('@media') ? `:root:not([data-ag-${axis}])` : sel);
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

  for (const [id, decls] of presetDecls) {
    parts.push('', `  [data-ag-theme="${id}"] {`, ...decls, '  }');
    noteDecls(decls, `[data-ag-theme="${id}"]`);
  }

  // shadcn bridge emission (inside @layer ag.tokens)
  if (emitShadcnSource) parts.push('', `  :root[${SHADCN_SOURCE_ATTR}] {`, ...shadcnSource, '  }');
  parts.push('', `  :where(:root:not([${SHADCN_SOURCE_ATTR}])) {`, ...shadcnDown, '  }');

  // fallback @supports blocks stay inside ag.tokens (MAT-036: only @property unlayered)
  parts.push(
    '@supports not (color: light-dark(#000, #fff)) {',
    '  :root {', ...lightFallback, '  }',
    '  [data-ag-scheme="dark"] {', '    color-scheme: dark;', ...darkFallback.map((d) => d.slice(2)), '  }',
    '  @media (prefers-color-scheme: dark) {',
    '    :root:not([data-ag-scheme]) {', '      color-scheme: dark;', ...darkFallback, '    }',
    '  }',
    '}', '',
  );

  // oklch fallback (MAT-026, MAT-05): hex / rgb() only here. Every block above that
  // carries an oklch() value is mirrored with the same selectors and in the same order,
  // so cascade order inside the fallback matches the main layer. Browsers without
  // oklch() also lack light-dark(), so scheme pairs are split per scheme here.
  const fb = (sel, decls) => (decls.length ? ['', `  ${sel} {`, ...decls.map((d) => `  ${d}`), '  }'] : []);
  const fbMedia = (media, sel, decls) =>
    decls.length ? ['', `  ${media} {`, `    ${sel} {`, ...decls.map((d) => `    ${d}`), '    }', '  }'] : [];
  const DARK = '[data-ag-scheme="dark"]';
  const DARK_MEDIA = '@media (prefers-color-scheme: dark)';
  const schemeDark = srgbDecls(base.filter(hasLightDark), 'dark');
  const supports = ['@supports not (color: oklch(0 0 0)) {', ...fb(':root', srgbDecls(base, 'light'))];
  for (const axis of AXIS_ORDER) {
    const def = axisDefs[axis];
    if (!def) continue;
    for (const axisValue of def.values) {
      if (axisValue === def.default) continue;
      const own = srgbDecls(axisBlocks.get(`${axis}=${axisValue}`) ?? [], axis === 'scheme' ? axisValue : 'light');
      const decls = axis === 'scheme' && axisValue === 'dark' ? [...schemeDark, ...own] : own;
      for (const sel of def.selectors?.[axisValue] ?? []) {
        if (sel.startsWith('@media')) supports.push(...fbMedia(sel, `:root:not([data-ag-${axis}])`, decls));
        else supports.push(...fb(sel, decls));
      }
    }
  }
  for (const [id, decls] of presetDecls) {
    const t = `[data-ag-theme="${id}"]`;
    const dark = srgbDecls(decls.filter(hasLightDark), 'dark');
    supports.push(
      ...fb(t, srgbDecls(decls, 'light')),
      ...fb(`${DARK} ${t}, ${DARK}${t}`, dark),
      ...fbMedia(DARK_MEDIA, `:root:not([data-ag-scheme]) ${t}, :root:not([data-ag-scheme])${t}`, dark),
    );
  }
  const shSel = ':root[data-ag-shadcn-source]';
  const shDark = srgbDecls(shadcnSource.filter(hasLightDark), 'dark');
  supports.push(
    ...fb(shSel, srgbDecls(shadcnSource, 'light')),
    ...fb(`${shSel}${DARK}`, shDark),
    ...fbMedia(DARK_MEDIA, `${shSel}:not([data-ag-scheme])`, shDark),
    '}', '',
  );
  parts.push(...supports);

  // linear() fallback (MAT-042, REQ-MAT-08): the critically damped snappy spring
  // degrades to the standard curve; the underdamped smooth/fluid springs degrade
  // to emphasized-decelerate. An unmapped spring name fails the build.
  const SPRING_FALLBACK = {
    '--ag-spring-snappy': '--ag-ease-standard',
    '--ag-spring-smooth': '--ag-ease-emphasized-decelerate',
    '--ag-spring-fluid': '--ag-ease-emphasized-decelerate',
  };
  if (springVars.length) {
    const fallbackDecls = springVars.map((v) => {
      const ease = SPRING_FALLBACK[v];
      if (!ease) throw new Error(`css-layered: no linear() fallback ease mapped for ${v}`);
      return `    ${v}: var(${ease});`;
    });
    parts.push(
      '@supports not (transition-timing-function: linear(0, 1)) {',
      '  :root {',
      ...fallbackDecls,
      '  }',
      '}',
      '',
    );
  }
  // MAT-12 forced-colours token block (REQ-MAT-12/54, PRD §4.5: forced colours
  // is absolute, so there is no attribute form). Every token carrying
  // $extensions["ag.forcedColor"] resolves to its CSS system colour. The
  // block is the last rule of ag.tokens and its selector list repeats every
  // attribute, media-mirror, preset, bridge and fallback selector that
  // re-declares one of these vars, so no nested [data-ag-*] / [data-ag-theme]
  // subtree re-introduces an authored colour (equal specificity, later wins).
  const forced = new Map(); // cssVar -> system colour
  for (const cell of cells) {
    const sys = cell.ext?.['ag.forcedColor'];
    if (!cell.cssVar || typeof sys !== 'string') continue;
    const prev = forced.get(cell.cssVar);
    if (prev && prev !== sys) die(`${cell.name}: conflicting ag.forcedColor ${prev} / ${sys}`);
    forced.set(cell.cssVar, sys);
  }
  // the shadcn-source bridge and the light-dark() fallback blocks above also
  // re-declare --ag-color-*
  noteDecls(shadcnSource, ':root[data-ag-shadcn-source]');
  noteDecls(darkFallback, '[data-ag-scheme="dark"]');
  noteDecls(darkFallback, ':root:not([data-ag-scheme])');
  if (forced.size) {
    const sels = new Set([':root']);
    for (const v of [...forced.keys()].sort())
      for (const s of blockSelectors.get(v) ?? []) sels.add(s);
    parts.push(
      '',
      '  @media (forced-colors: active) {',
      `    ${[...sels].join(',\n    ')} {`,
      ...[...forced.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([v, sys]) => `      ${v}: ${sys};`),
      '    }',
      '  }',
    );
  }

  parts.push('}', '');
  return prettierFormat(parts.join('\n'), 'css');
}

// ---------- sRGB fallback serialisation (MAT-05) ----------

const hasLightDark = (decl) => decl.includes('light-dark(');

/** Index of the paren closing the one opened at `open`. */
function closeParen(s, open) {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')' && --depth === 0) return i;
  }
  die(`sRGB fallback: unbalanced parentheses in ${s}`);
}

/** Replace every light-dark(a, b) with the branch for `scheme`. */
function pickScheme(s, scheme) {
  let out = s;
  for (let at = out.indexOf('light-dark('); at !== -1; at = out.indexOf('light-dark(')) {
    const open = at + 'light-dark'.length;
    const end = closeParen(out, open);
    const inner = out.slice(open + 1, end);
    let depth = 0, comma = -1;
    for (let i = 0; i < inner.length && comma === -1; i++) {
      if (inner[i] === '(') depth++;
      else if (inner[i] === ')') depth--;
      else if (inner[i] === ',' && depth === 0) comma = i;
    }
    if (comma === -1) die(`sRGB fallback: light-dark() without two branches in ${s}`);
    const branch = (scheme === 'dark' ? inner.slice(comma + 1) : inner.slice(0, comma)).trim();
    out = out.slice(0, at) + branch + out.slice(end + 1);
  }
  return out;
}

const OKLCH_RE = /oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*(?:\/\s*([0-9.]+)\s*)?\)/g;

/** oklch() -> gamut-mapped sRGB: #rrggbb when opaque, rgb(r g b / a) when alpha < 1. */
export function oklchCssToSrgb(s) {
  const out = s.replace(OKLCH_RE, (_, l, c, h, a) => {
    const hex = srgbToHex(clampSrgb(oklchToSrgb(gamutMapOklch({ l: +l, c: +c, h: +h }))));
    const alpha = a === undefined ? 1 : +a;
    if (alpha >= 1) return hex;
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return `rgb(${r} ${g} ${b} / ${alpha})`;
  });
  if (out.includes('oklch(')) die(`sRGB fallback: oklch() form not convertible to sRGB: ${s.trim()}`);
  return out;
}

/** Declarations carrying oklch() (directly or via light-dark()), re-serialised in sRGB for `scheme`. */
function srgbDecls(decls, scheme) {
  return decls.filter((d) => d.includes('oklch(')).map((d) => oklchCssToSrgb(pickScheme(d, scheme)));
}

