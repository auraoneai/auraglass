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

