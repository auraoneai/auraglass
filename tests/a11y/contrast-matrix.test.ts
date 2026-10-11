/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-091..094: a11y contrast matrix — recompute every cell of
// dist/contrast-matrix.json over white, black and the 9 busy samples at the
// emitted floor alpha; assert equality with the solver within 0.01 and the
// REQ-A11Y-16 thresholds (text 4.5 / 7 more, muted 4.5, chrome 3). Cases:
// 'clear cells' (0.35 scrim present) and 'disabled pair' (>= 3).
// MAT-091 also freezes the busy-reference test consumer; MAT-094 proves the
// focus-band pair keeps >= 3 against every sRGB backdrop (16^3 = 4096).
// Fails with 'PRD-03 output missing' when inputs are absent; never skips.
// Color math comes only from src/theme/color.ts (MAT-092).
//
// MAT-11 / REQ-FIN-51 (D.3-08): the 'floors.css' block below parses the
// generated src/material/css/generated/floors.css, asserts every
// [transparency][thickness][backdrop] row and the contrast=more row equals
// max(cell.floorAlpha) over presets x schemes x variants, then recomputes each
// pair independently from the PRD composite model (REQ-MAT-10 composites +
// REQ-MAT-29 alpha formula) at the alpha the CSS actually renders — not from
// the solver's search model — and asserts the per-pair thresholds. A -0.05
// edit of any floor row must make the checker fail (mutation case).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import {
  compositeOver, hexToRgb, oklchToSrgb, parseColor, wcagContrast,
} from '../../src/theme/color';

// Repo root from this file (tests/a11y/ -> ../..). Not imported from
// scripts/tokens/validate.mjs so the suite also loads under `npm test`
// (--experimental-vm-modules treats .mjs as native ESM).
const ROOT = join(__dirname, '..', '..');
const P = (...segs: string[]) => join(ROOT, ...segs);
const load = (path: string) => {
  if (!existsSync(path)) throw new Error(`PRD-03 output missing: ${path}`);
  return JSON.parse(readFileSync(path, 'utf8'));
};
const BUSY_REF = load(P('tokens/contrast/busy-reference.json'));
const BUSY: string[] = BUSY_REF.busy;
const MATRIX = load(P('dist/contrast-matrix.json'));
const CM_TOKENS = load(P('tokens/contrast/contrast-matrix.tokens.json'));
const MAT_TOKENS = load(P('tokens/material/material.tokens.json'));
const TOKENS_CSS = readFileSync(P('dist/css/tokens.css'), 'utf8');

const FLOORS: Record<string, number> = Object.fromEntries(
  Object.entries(CM_TOKENS.contrast.matrix.floors).map(([k, v]: [string, any]) => [k, v.$value]),
);
const SCRIM_CLEAR: number = MAT_TOKENS.material.material.$value.scrim.clear;
const SPEC = MAT_TOKENS.material.material.$value;
const tintKey = (variant: string) => (SPEC.variants[variant] ? 'variants' : 'content');

// -- resolved color values parsed out of emitted tokens.css -------------------
type Scheme = 'light' | 'dark';
const parseLightDark = (value: string): { light: string; dark: string } => {
  const m = /^light-dark\((.+),\s*(.+)\)$/.exec(value.replace(/\s+/g, ' ').trim());
  if (!m) return { light: value, dark: value };
  const [l, d] = splitTopLevel(m[1] + ',' + m[2]);
  return { light: l!, dark: d! };
};
const splitTopLevel = (s: string): string[] => {
  const parts: string[] = [];
  let depth = 0; let cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  return parts.map((x) => x.trim());
};

const decls = (selectorFilter: (sel: string) => boolean): Map<string, string> => {
  const out = new Map<string, string>();
  postcss.parse(TOKENS_CSS).walkRules((rule) => {
    if (!selectorFilter(rule.selector)) return;
    rule.walkDecls((d) => {
      if (!d.prop.startsWith('--ag-')) return;
      const prev = out.get(d.prop);
      if (prev === undefined || (d.value.includes('light-dark(') && !prev.includes('light-dark(')))
        out.set(d.prop, d.value);
    });
  });
  return out;
};

// Resolved token values live in @layer ag.tokens :root. (The shadcn interop
// blocks re-map --ag-* names to var(--…) indirections — do not read those.)
const globalDecls = decls((s) => s === ':root' || s === ':where(:root)');
const presetDecls = new Map<string, Map<string, string>>();
postcss.parse(TOKENS_CSS).walkRules((rule) => {
  const m = /^\[data-ag-theme="([^"]+)"\](?::where\(html&\))?$/.exec(rule.selector.trim());
  if (!m) return;
  const bag = presetDecls.get(m[1]!) ?? new Map<string, string>();
  rule.walkDecls((d) => {
    const prev = bag.get(d.prop);
    if (prev === undefined || (d.value.includes('light-dark(') && !prev.includes('light-dark(')))
      bag.set(d.prop, d.value);
  });
  presetDecls.set(m[1]!, bag);
});

const SRGB_CACHE = new Map<string, { r: number; g: number; b: number; alpha?: number }>();
const toSrgb = (cssColor: string) => {
  if (!SRGB_CACHE.has(cssColor)) {
    const { inGamut: _ignored, ...s } = oklchToSrgb(parseColor(cssColor));
    SRGB_CACHE.set(cssColor, s);
  }
  return SRGB_CACHE.get(cssColor)!;
};
const hex = (h: string) => {
  const { r, g, b } = hexToRgb(h);
  return { r: r / 255, g: g / 255, b: b / 255, alpha: 1 };
};
const sysColor = (name: string, scheme: Scheme) => {
  const v = globalDecls.get(name);
  if (!v) throw new Error(`PRD-03 output missing: ${name} not emitted in tokens.css`);
  const ld = parseLightDark(v);
  return toSrgb(scheme === 'light' ? ld.light : ld.dark);
};
const canvasOf = (preset: string, scheme: Scheme) => {
  const v = presetDecls.get(preset)?.get('--ag-color-canvas') ?? globalDecls.get('--ag-color-canvas');
  if (!v) throw new Error(`PRD-03 output missing: canvas for ${preset}`);
  const ld = parseLightDark(v);
  return toSrgb(scheme === 'light' ? ld.light : ld.dark);
};

const SCRIM_BLACK = { r: 0, g: 0, b: 0, alpha: SCRIM_CLEAR };
const composite = (fg: any, alpha: number | undefined, bg: any) =>
  compositeOver({ ...fg, alpha: alpha ?? fg.alpha ?? 1 }, { ...bg, alpha: bg.alpha ?? 1 });

/** Recompute a cell's minRatio exactly as the solver does (color.mjs). */
const recomputeCell = (preset: string, scheme: Scheme, tr: string, variant: string, th: string, bd: string, floorAlpha: number) => {
  const samples = bd === 'light' ? ['#ffffff'] : bd === 'dark' ? ['#000000'] : BUSY;
  const tint = SPEC[tintKey(variant)][variant][th].alpha;
  const floor = FLOORS[th]!;
  const canvas = canvasOf(preset, scheme);
  const onSurface = sysColor('--ag-color-on-surface', scheme);
  const muted = sysColor('--ag-color-on-surface-muted', scheme);
  const border = sysColor('--ag-color-border', scheme);
  const focusInner = sysColor('--ag-color-focus-inner', scheme);
  const mins: number[] = [];
  for (const s of samples) {
    let sample = hex(s) as import('../../src/theme/color').Srgb;
    if (variant === 'clear' && (bd === 'light' || bd === 'media')) sample = composite(SCRIM_BLACK, undefined, sample);
    const surface = tr === 'solid' ? canvas : composite(canvas, Math.min(1, tint + floorAlpha - floor), sample);
    const disabledSurface = composite(surface, 0.45, canvas);
    mins.push(Math.min(
      wcagContrast(onSurface, surface),
      wcagContrast(muted, surface),
      wcagContrast(border, surface),
      wcagContrast(focusInner, surface),
      wcagContrast(onSurface, disabledSurface),
    ));
  }
  return Math.min(...mins);
};

/** Recompute one pair's ratio at the emitted floor alpha (case proofs). */
const pairRatio = (preset: string, scheme: Scheme, tr: string, variant: string, th: string, bd: string, floorAlpha: number, pair: 'disabled' | 'muted' | 'border' | 'focus' | 'on-surface') => {
  const tint = SPEC[tintKey(variant)][variant][th].alpha;
  const floor = FLOORS[th]!;
  const canvas = canvasOf(preset, scheme);
  let worst = Infinity;
  for (const s of (bd === 'light' ? ['#ffffff'] : bd === 'dark' ? ['#000000'] : BUSY)) {
    let sample = hex(s) as import('../../src/theme/color').Srgb;
    if (variant === 'clear' && (bd === 'light' || bd === 'media')) sample = composite(SCRIM_BLACK, undefined, sample);
    const surface = tr === 'solid' ? canvas : composite(canvas, Math.min(1, tint + floorAlpha - floor), sample);
    const bg = pair === 'disabled' ? composite(surface, 0.45, canvas) : surface;
    const fg = sysColor(pair === 'disabled' || pair === 'on-surface' ? '--ag-color-on-surface' : pair === 'muted' ? '--ag-color-on-surface-muted' : pair === 'border' ? '--ag-color-border' : '--ag-color-focus-inner', scheme);
    worst = Math.min(worst, wcagContrast(fg, bg));
  }
  return worst;
};

const cells: Array<[string, string, string, string, string, string, string, any]> = [];
for (const [preset, schemes] of Object.entries<any>(MATRIX.cells))
  for (const [scheme, contrasts] of Object.entries<any>(schemes))
    for (const [contrast, trs] of Object.entries<any>(contrasts))
      for (const [tr, variants] of Object.entries<any>(trs))
        for (const [variant, ths] of Object.entries<any>(variants))
          for (const [th, bds] of Object.entries<any>(ths))
            for (const [bd, cell] of Object.entries<any>(bds))
              cells.push([preset, scheme, contrast, tr, variant, th, bd, cell]);

// -- MAT-11: generated/floors.css parse + independent PRD-model recompute ------
const FLOORS_CSS_PATH = P('src/material/css/generated/floors.css');
if (!existsSync(FLOORS_CSS_PATH)) throw new Error(`PRD-03 output missing: ${FLOORS_CSS_PATH}`);
const FLOORS_CSS = readFileSync(FLOORS_CSS_PATH, 'utf8');
const COLOR_TOKENS = load(P('tokens/sys/color.tokens.json'));

// Axes are the REQ-MAT-10 axes, written out here (not read from the solver).
const TRANSPARENCIES = ['glass', 'tinted', 'solid'] as const;
const THICKNESSES = ['thin', 'regular', 'thick'] as const;
const BACKDROPS = ['light', 'dark', 'media'] as const;
/** Row key: `<transparency>/<thickness>/<backdrop>` or `more/<thickness>/<backdrop>`. */
const rowKey = (head: string, th: string, bd: string) => `${head}/${th}/${bd}`;
const EXPECTED_ROWS = [
  ...TRANSPARENCIES.flatMap((tr) => THICKNESSES.flatMap((th) => BACKDROPS.map((bd) => rowKey(tr, th, bd)))),
  ...THICKNESSES.flatMap((th) => BACKDROPS.map((bd) => rowKey('more', th, bd))),
];

/**
 * Parse every `--_ag-tint-floor` row of floors.css (top level of
 * `@layer ag.material`, outside @media/@supports). Each selector in a rule
 * must name the same row; a row may be declared only once.
 */
const parseFloorRows = (css: string): Map<string, number> => {
  const rows = new Map<string, number>();
  const attr = (sel: string, name: string) => new RegExp(`\\[data-ag-${name}="([^"]+)"\\]`).exec(sel)?.[1];
  postcss.parse(css).walkDecls('--_ag-tint-floor', (d) => {
    const rule = d.parent as postcss.Rule;
    const layer = rule.parent as postcss.AtRule;
    if (rule.type !== 'rule' || layer?.type !== 'atrule' || layer.name !== 'layer' || layer.params !== 'ag.material')
      throw new Error(`floors.css: --_ag-tint-floor outside top-level @layer ag.material: ${rule.selector ?? '?'}`);
    const keys = new Set(rule.selectors.map((sel) => {
      const th = attr(sel, 'thickness'); const bd = attr(sel, 'backdrop');
      const tr = attr(sel, 'transparency'); const more = attr(sel, 'contrast');
      if (!th || !bd || (tr ? more !== undefined : more !== 'more'))
        throw new Error(`floors.css: unrecognised floor selector '${sel}'`);
      return rowKey(tr ?? 'more', th, bd);
    }));
    if (keys.size !== 1) throw new Error(`floors.css: rule mixes rows ${[...keys].join(', ')}`);
    const key = [...keys][0]!;
    if (rows.has(key)) throw new Error(`floors.css: row ${key} declared twice`);
    const v = Number(d.value);
    if (!Number.isFinite(v)) throw new Error(`floors.css: row ${key} has non-numeric floor '${d.value}'`);
    rows.set(key, v);
  });
  return rows;
};

/** Expected row = max(cell.floorAlpha) over presets x schemes x variants (REQ-MAT-10);
 *  the contrast=more row additionally spans every transparency (it overrides them). */
const expectedRows = (): Map<string, number> => {
  const out = new Map<string, number>();
  for (const [, , contrast, tr, , th, bd, cell] of cells) {
    const key = contrast === 'more' ? rowKey('more', th, bd) : rowKey(tr, th, bd);
    out.set(key, Math.max(out.get(key) ?? 0, cell.floorAlpha));
  }
  return out;
};

// PRD composite model. Scrim for clear over bright/media is REQ-MAT-07
// `scrim.clearOverBright`; busy samples are tokens/contrast/busy-reference.json.
const SCRIM_OVER_BRIGHT: number = SPEC.scrim.clearOverBright;
/** REQ-MAT-29: --_ag-alpha = min(1, max(F, F + (1 - F) * glassOpacity)); default --ag-glass-opacity is 0. */
const renderedAlpha = (floor: number, glassOpacity = 0) =>
  Math.min(1, Math.max(floor, floor + (1 - floor) * glassOpacity));
const MUTED_LARGE_ONLY = COLOR_TOKENS.sys.color['on-surface-muted'].$extensions?.['ag.usage'] === 'large-only';
/** REQ-MAT-10 per-pair minimums; under contrast=more every text pair is 7:1. */
const pairMinimums = (contrast: string) => ({
  'on-surface': contrast === 'more' ? 7 : 4.5,
  muted: contrast === 'more' ? 7 : MUTED_LARGE_ONLY ? 3 : 4.5,
  border: 3,
  focus: 3,
});
const PAIR_TOKENS = {
  'on-surface': '--ag-color-on-surface',
  muted: '--ag-color-on-surface-muted',
  border: '--ag-color-border',
  focus: '--ag-color-focus-inner',
} as const;
type Pair = keyof typeof PAIR_TOKENS;

/**
 * Surface composites for one cell at the alpha floors.css makes the CSS render:
 * the canvas fill at renderedAlpha(row) over each backdrop composite (#ffffff,
 * #000000, or every busy sample for media), with the 0.35 black scrim under
 * clear over light/media. transparency=solid is the opaque canvas.
 */
const prdSurfaces = (preset: string, scheme: Scheme, tr: string, variant: string, bd: string, floor: number) => {
  const canvas = canvasOf(preset, scheme);
  if (tr === 'solid') return [canvas];
  const samples = bd === 'light' ? ['#ffffff'] : bd === 'dark' ? ['#000000'] : BUSY;
  const alpha = renderedAlpha(floor);
  return samples.map((s) => {
    let backdrop = hex(s) as import('../../src/theme/color').Srgb;
    if (variant === 'clear' && (bd === 'light' || bd === 'media'))
      backdrop = composite({ r: 0, g: 0, b: 0 }, SCRIM_OVER_BRIGHT, backdrop);
    return composite(canvas, alpha, backdrop);
  });
};

/** Every failure of floors.css text against the matrix and the PRD-model thresholds. */
const checkFloors = (css: string): { failures: string[]; worst: Record<Pair, number> } => {
  const failures: string[] = [];
  const rows = parseFloorRows(css);
  const missing = EXPECTED_ROWS.filter((k) => !rows.has(k));
  const extra = [...rows.keys()].filter((k) => !EXPECTED_ROWS.includes(k));
  if (missing.length) failures.push(`rows missing: ${missing.join(', ')}`);
  if (extra.length) failures.push(`unexpected rows: ${extra.join(', ')}`);
  // (1) row equality with max(cell floorAlpha); the emitter writes 3 decimals
  for (const [key, want] of expectedRows()) {
    const got = rows.get(key);
    if (got !== undefined && Math.abs(got - Math.round(want * 1000) / 1000) > 1e-9)
      failures.push(`row ${key}: floors.css ${got} != max(cell.floorAlpha) ${want}`);
  }
  // (2) per-pair recompute at the rendered alpha, every cell
  const worst = { 'on-surface': Infinity, muted: Infinity, border: Infinity, focus: Infinity } as Record<Pair, number>;
  for (const [preset, scheme, contrast, tr, variant, th, bd] of cells) {
    const key = contrast === 'more' ? rowKey('more', th, bd) : rowKey(tr, th, bd);
    const floor = rows.get(key);
    if (floor === undefined) continue; // reported as a missing row above
    const surfaces = prdSurfaces(preset, scheme as Scheme, tr, variant, bd, floor);
    const mins = pairMinimums(contrast);
    for (const pair of Object.keys(PAIR_TOKENS) as Pair[]) {
      const fg = sysColor(PAIR_TOKENS[pair], scheme as Scheme);
      const ratio = Math.min(...surfaces.map((s) => wcagContrast(fg, s)));
      worst[pair] = Math.min(worst[pair], ratio);
      if (ratio < mins[pair])
        failures.push(`${preset}/${scheme}/${contrast}/${tr}/${variant}/${th}/${bd} (row ${key}=${floor}): ${pair} ${ratio.toFixed(3)} < ${mins[pair]}`);
    }
  }
  return { failures, worst };
};

/** floors.css with one row's value lowered by `delta` (text edit, as a hand edit would be). */
const mutateRow = (css: string, key: string, delta: number): string => {
  const root = postcss.parse(css);
  let hit = 0;
  root.walkDecls('--_ag-tint-floor', (d) => {
    const rule = d.parent as postcss.Rule;
    if (rule.parent?.type !== 'atrule') return;
    const sel = rule.selectors[0]!;
    const th = /data-ag-thickness="([^"]+)"/.exec(sel)?.[1];
    const bd = /data-ag-backdrop="([^"]+)"/.exec(sel)?.[1];
    const head = /data-ag-transparency="([^"]+)"/.exec(sel)?.[1] ?? 'more';
    if (rowKey(head, th!, bd!) !== key) return;
    d.value = String(Math.round((Number(d.value) + delta) * 1000) / 1000);
    hit++;
  });
  if (hit !== 1) throw new Error(`mutateRow: row ${key} matched ${hit} declarations`);
  return root.toString();
};

describe('a11y/contrast-matrix (MAT-091..094)', () => {
  test('busy-reference.json is the 9-sample ordered sRGB list + composites (MAT-091)', () => {
    expect(BUSY_REF).toEqual({
      version: 1,
      busy: ['#777777', '#ff3b30', '#34c759', '#0a84ff', '#ffcc00', '#af52de', '#ff9500', '#5ac8fa', '#8e8e93'],
      composites: ['#ffffff', '#000000', 'busy'],
    });
  });

  test('recomputed minRatio equals solver output within 0.01 (MAT-093)', () => {
    expect(cells.length).toBe(MATRIX.cellCount);
    let maxDev = 0; let worst = '';
    const failures: string[] = [];
    for (const [preset, scheme, contrast, tr, variant, th, bd, cell] of cells) {
      const got = recomputeCell(preset, scheme as Scheme, tr, variant, th, bd, cell.floorAlpha);
      const dev = Math.abs(got - cell.minRatio);
      if (dev > maxDev) { maxDev = dev; worst = `${preset}/${scheme}/${contrast}/${tr}/${variant}/${th}/${bd}`; }
      if (dev > 0.01) failures.push(`${preset}/${scheme}/${contrast}/${tr}/${variant}/${th}/${bd} cell=${cell.minRatio} got=${got.toFixed(4)}`);
    }
    console.log(`cells=${cells.length} max |recomputed-solver|=${maxDev.toFixed(4)} @ ${worst}`);
    expect(failures).toEqual([]);
  });

  test('clear cells rely on the 0.35 scrim over light/media (MAT-093 case)', () => {
    // At the same emitted floorAlpha, the min ratio with NO scrim must differ
    // from the emitted (scrummed) min on at least some cells — proving the
    // scrim layer is really applied (it is what keeps light-scheme clear cells
    // at/above their targets; on dark it lowers the minimum slightly).
    let belowScrim = 0; let wouldFail = 0;
    const clear = cells.filter(([, , , , variant, , bd]) => variant === 'clear' && (bd === 'light' || bd === 'media'));
    for (const [preset, scheme, , tr, , th, bd, cell] of clear) {
      const tint = SPEC[tintKey('clear')].clear[th].alpha;
      const floor = FLOORS[th]!;
      const canvas = canvasOf(preset, scheme as Scheme);
      const onSurface = sysColor('--ag-color-on-surface', scheme as Scheme);
      const muted = sysColor('--ag-color-on-surface-muted', scheme as Scheme);
      const border = sysColor('--ag-color-border', scheme as Scheme);
      const focusInner = sysColor('--ag-color-focus-inner', scheme as Scheme);
      let unscrummed = Infinity;
      for (const s of (bd === 'light' ? ['#ffffff'] : BUSY)) {
        const surface = tr === 'solid' ? canvas : composite(canvas, Math.min(1, tint + cell.floorAlpha - floor), hex(s));
        unscrummed = Math.min(unscrummed,
          wcagContrast(onSurface, surface), wcagContrast(muted, surface),
          wcagContrast(border, surface), wcagContrast(focusInner, surface),
          wcagContrast(onSurface, composite(surface, 0.45, canvas)));
      }
      if (unscrummed < cell.minRatio - 0.01) belowScrim++;
      if (unscrummed < 3) wouldFail++;
      expect(unscrummed).not.toBe(cell.minRatio);
    }
    console.log(`clear cells inspected: ${clear.length}; below emitted min without scrim: ${belowScrim}; below 3:1 without scrim: ${wouldFail}`);
    expect(clear.length).toBeGreaterThan(0);
    expect(belowScrim).toBeGreaterThan(0);
  });

  test('disabled pair >= 3 in every cell (MAT-093 case)', () => {
    let checked = 0; let minSeen = Infinity;
    for (const [preset, scheme, , tr, variant, th, bd, cell] of cells) {
      const r = pairRatio(preset, scheme as Scheme, tr, variant, th, bd, cell.floorAlpha, 'disabled');
      minSeen = Math.min(minSeen, r);
      expect(r).toBeGreaterThanOrEqual(3);
      checked++;
    }
    console.log(`disabled pairs checked: ${checked}; min ratio ${minSeen.toFixed(3)}`);
  });

  test('focus bands: inner vs outer >= 3 per scheme; >= 3 against all 4096 sRGB backdrops (MAT-094)', () => {
    for (const scheme of ['light', 'dark'] as const) {
      const inner = sysColor('--ag-color-focus-inner', scheme);
      const outer = sysColor('--ag-color-focus-outer', scheme);
      const direct = wcagContrast(inner, outer);
      expect(direct).toBeGreaterThanOrEqual(3);
      let worst = Infinity;
      for (let i = 0; i < 16; i++)
        for (let j = 0; j < 16; j++)
          for (let k = 0; k < 16; k++) {
            const bg = { r: i / 15, g: j / 15, b: k / 15, alpha: 1 };
            worst = Math.min(worst, Math.max(wcagContrast(inner, bg), wcagContrast(outer, bg)));
          }
      console.log(`${scheme}: inner↔outer ${direct.toFixed(2)}; worst backdrop max ${worst.toFixed(3)}`);
      expect(worst).toBeGreaterThanOrEqual(3);
    }
  });

  describe('generated/floors.css (MAT-11, REQ-FIN-51)', () => {
    test('declares exactly the 27 transparency rows + 9 contrast=more rows', () => {
      expect([...parseFloorRows(FLOORS_CSS).keys()].sort()).toEqual([...EXPECTED_ROWS].sort());
    });

    test('each row equals max(cell.floorAlpha) over presets x schemes x variants', () => {
      const rows = parseFloorRows(FLOORS_CSS);
      const mismatches = [...expectedRows()]
        .filter(([key, want]) => Math.abs(rows.get(key)! - Math.round(want * 1000) / 1000) > 1e-9)
        .map(([key, want]) => `${key}: floors.css ${rows.get(key)} != max(cell.floorAlpha) ${want}`);
      expect(mismatches).toEqual([]);
    });

    test('PRD-model recompute at the rendered floor: on-surface >= 4.5 (7 more), muted >= 4.5 (7 more), border/focus >= 3', () => {
      const { failures, worst } = checkFloors(FLOORS_CSS);
      const pairFailures = failures.filter((f) => !f.startsWith('row ') && !f.startsWith('rows ') && !f.startsWith('unexpected '));
      console.log(`PRD-model worst ratios: ${Object.entries(worst).map(([p, r]) => `${p}=${r.toFixed(3)}`).join(' ')}; pair failures ${pairFailures.length}`);
      expect(pairFailures).toEqual([]);
    });

    test('mutation: a -0.05 edit of any one floor row makes the check fail, naming that row', () => {
      const lowered: string[] = [];
      for (const key of EXPECTED_ROWS) {
        const { failures } = checkFloors(mutateRow(FLOORS_CSS, key, -0.05));
        expect(failures.some((f) => f.includes(`row ${key}`))).toBe(true);
        if (failures.some((f) => f.includes(`(row ${key}=`))) lowered.push(key);
      }
      console.log(`mutated rows: ${EXPECTED_ROWS.length}; rows whose -0.05 edit also breaks a PRD-model pair threshold: ${lowered.length} (${lowered.join(', ')})`);
    });
  });
});
