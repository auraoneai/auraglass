// MAT-026/MAT-070: dist/css/tokens.css emitter — layered :root + axis blocks,
// scheme-paired light-dark(), shadcn bridge, @supports fallbacks.
import { colorToCss, gamutMapOklch, oklchToSrgb, clampSrgb, srgbToHex } from '../color.mjs';
import { compileSpring } from '../transforms/motion-spring.mjs';
import { die, dim, renderValue, prettierFormat, HEADER_CSS, LAYER_ORDER, SHADCN_MAP, AXIS_ORDER } from './_shared.mjs';
export { HEADER_CSS, LAYER_ORDER };

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
      if (axisValue === def.default) {
        // MAT-06: a nested [data-ag-density="regular"] inside a compact/spacious
        // subtree must reset the factor and the scaled spaces back to regular.
        if (axis === 'density')
          parts.push('', `  [data-ag-density="${axisValue}"] {`, `    --_ag-density: ${densityFactor.get(axisValue)};`, ...densityDecls(axisValue), '  }');
        continue;
      }
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

