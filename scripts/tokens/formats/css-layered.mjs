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
  parts.push('}', '');
  return prettierFormat(parts.join('\n'), 'css');
}

