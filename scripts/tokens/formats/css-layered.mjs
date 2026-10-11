// MAT-026/MAT-070: dist/css/tokens.css emitter — layered :root + axis blocks,
// scheme-paired light-dark(), shadcn bridge, @supports fallbacks.
import { colorToCss, gamutMapOklch, oklchToSrgb, clampSrgb, srgbToHex } from '../color.mjs';
import { compileSpring } from '../transforms/motion-spring.mjs';
import { die, dim, renderValue, prettierFormat, HEADER_CSS, LAYER_ORDER, SHADCN_MAP, AXIS_ORDER } from './_shared.mjs';
export { HEADER_CSS, LAYER_ORDER };

/** Selector of the ConcentricFrame part (REQ-MAT-26): disambiguates the frame's
    data-ag-radius from a surface's fallbackRadius data-ag-radius. */
export const CONCENTRIC_FRAME_PART = 'concentric-frame';

/**
 * REQ-MAT-26 (FIN D.3-17): structural attribute -> var mapping rules, generated
 * from the emitted space/radius scales so every SpaceToken / RadiusToken has a
 * rule and no value is hand-copied.
 *  - SurfaceGroup  [data-ag-group][data-ag-spacing=N]   -> --_ag-group-spacing: var(--ag-space-N)
 *  - ConcentricFrame [data-ag-part=concentric-frame][data-ag-radius=r] -> --ag-radius-outer: var(--ag-radius-r)
 *  - ConcentricFrame [data-ag-part=concentric-frame][data-ag-inset=N]  -> --ag-inset: var(--ag-space-N)
 *  - surface fallbackRadius [data-ag-radius=r] outside the frame part  -> --_ag-fallback-radius: var(--ag-radius-r);
 *    a concentric surface with no fallbackRadius gets the md default (REQ-MAT-26 "default md").
 * The group gap and the out-of-frame concentric radius are applied by
 * material.css reading these vars (REQ-FIN-02 clause transfer).
 * @param {Array<{cssVar?: string}>} cells
 * @returns {string[]} rule lines (two-space indent, inside @layer ag.tokens)
 */
export function structuralMappingRules(cells) {
  const keys = (re) => [...new Set(cells.map((c) => c.cssVar && re.exec(c.cssVar)?.[1]).filter(Boolean))];
  const space = keys(/^--ag-space-(\d+)$/).sort((a, b) => Number(a) - Number(b));
  const radius = keys(/^--ag-radius-(xs|sm|md|lg|xl|full)$/);
  if (!space.length) die('structural mapping: no --ag-space-* tokens emitted');
  if (!radius.length) die('structural mapping: no --ag-radius-* tokens emitted');
  if (!radius.includes('md')) die('structural mapping: fallback default --ag-radius-md is not emitted');
  const frame = `[data-ag-part="${CONCENTRIC_FRAME_PART}"]`;
  const rule = (sel, decl) => ['', `  ${sel} {`, `    ${decl};`, '  }'];
  return [
    '',
    '  /* REQ-MAT-26 structural mapping (generated; scripts/tokens/formats/css-layered.mjs) */',
    ...space.flatMap((n) => rule(`[data-ag-group][data-ag-spacing="${n}"]`, `--_ag-group-spacing: var(--ag-space-${n})`)),
    ...radius.flatMap((r) => rule(`${frame}[data-ag-radius="${r}"]`, `--ag-radius-outer: var(--ag-radius-${r})`)),
    ...space.flatMap((n) => rule(`${frame}[data-ag-inset="${n}"]`, `--ag-inset: var(--ag-space-${n})`)),
    ...radius.flatMap((r) => rule(`[data-ag-radius="${r}"]:not(${frame})`, `--_ag-fallback-radius: var(--ag-radius-${r})`)),
    ...rule('[data-ag-shape="concentric"]:not([data-ag-radius])', '--_ag-fallback-radius: var(--ag-radius-md)'),
  ];
}

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

  // shadcn bridge (MAT-070, deviation D-B): bidirectional. Default direction
  // ag -> shadcn lives under :where(:root:not([data-ag-shadcn-source]));
  // on a shadcn-authored root the direction flips (shadcn -> ag with defaults).
  const agDefault = new Map(); // --ag-* -> default decl text (from base block)
  for (const d of base) {
    const m = d.trim().match(/^(--ag-[a-z0-9-]+):\s*(.+);$/i);
    if (m) agDefault.set(m[1], m[2]);
  }
  const shadcnSource = [];   // :root[data-ag-shadcn-source] decls (shadcn -> ag)
  const shadcnDown = [];     // :where(:root:not(...)) decls (ag -> shadcn)
  for (const [sh, ag] of Object.entries(SHADCN_MAP)) {
    const def = agDefault.get(ag);
    if (!def) die(`shadcn bridge: ${ag} has no emitted default (token missing)`);
    shadcnSource.push(`    ${ag}: var(${sh}, ${def});`);
    shadcnDown.push(`    ${sh}: var(${ag});`);
  }
  // resolved var-graph cycle check in both directions (MAT-070)
  const assertAcyclic = (edges, mode) => {
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
  };
  assertAcyclic(new Map(Object.entries(SHADCN_MAP).map(([sh, ag]) => [ag, [sh]])), 'shadcn-source');
  assertAcyclic(new Map(Object.entries(SHADCN_MAP).map(([sh, ag]) => [sh, [ag]])), 'default');

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
  parts.push(
    '',
    '  :root[data-ag-shadcn-source] {', ...shadcnSource, '  }',
    '',
    '  :where(:root:not([data-ag-shadcn-source])) {', ...shadcnDown, '  }',
  );

  // structural attribute -> var mapping (REQ-MAT-26)
  parts.push(...structuralMappingRules(cells));

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

