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
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import {
  compositeOver, hexToRgb, oklchToSrgb, parseColor, wcagContrast,
} from '../../src/theme/color';

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
});
