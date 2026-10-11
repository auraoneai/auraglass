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
      if (axisValue === def.default) continue;
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

