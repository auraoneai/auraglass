/* Contrast solver (MAT-046/047/048; A11Y's matrix contract REQ-A11Y-15..17).
   2160 cells: 4 presets x 2 schemes x 2 contrast x 3 transparency x 5 variant forms x
   3 thicknesses x 3 declared backdrops (light=#ffffff, dark=#000000, media=busy-min).
   Alpha search: integer loop i/200 over 0..1 from the authored floor upward.
   Pairs per REQ-A11Y-16 (target under contrast=more becomes 7:1 for text):
     on-surface >= 4.5 | muted >= 4.5 (3 if large-only) | border >= 3 | focus >= 3 |
     disabled >= 3 | text >= 7 (contrast=more only).
   'clear' over light/media adds a scrim.clear 0.35 underlay. Blur contributes nothing.
   An unsolvable cell throws naming the cell, the pair and the best ratio found. */
import { createHash } from 'node:crypto';
import { colorToSrgb, composite, contrastRatio, hexToSrgb, relativeLuminance } from './color.mjs';

// Backdrop samples come from contrast.matrix.samples (MAT-024): 'white'/'black' and the
// nine busy mid-luminance hexes. Kept here as the single authoritative list too, with a
// consistency check against the token table in solveContrastMatrix.
const BUSY = ['#777777', '#ff3b30', '#34c759', '#0a84ff', '#ffcc00', '#af52de', '#ff9500', '#5ac8fa', '#8e8e93'];
const BACKDROPS = {
  light: ['#ffffff'],
  dark: ['#000000'],
  media: BUSY,
};
const SCRIM_BLACK = [0, 0, 0];

const rec_ = (records, resolved, name) => {
  const r = records.get(name);
  if (!r) throw new Error(`contrast-solve: missing token ${name}`);
  return resolved.get(name);
};

/** Simplified APCA Lc (absolute) for pair comparison only. */
function apcaLc(fg, bg) {
  const y = (rgb) => relativeLuminance(rgb);
  const soft = (v) => (v < 0.022 ? v + Math.pow(0.022 - v, 1.414) : Math.pow(v, 0.56));
  const t = Math.pow(y(fg), 0.57), b = soft(y(bg));
  return Math.abs(b - t) * 114;
}

/** The material's pairs at a cell: [pairName, foreground rgb, background rgb, minimum ratio].
 *  The disabled pair reads text on the disabled surface (fill faded 45% toward the backdrop). */
function cellPairs(ctx, targets, backdrop) {
  const { surface, canvas, colors, contrast } = ctx;
  const t = contrast === 'more' ? targets.more : targets.text;
  const mutedMin = 4.5; // '3 if large-only' — muted here is body-scale, so 4.5 applies
  // disabled surface = the cell surface faded to disabled-alpha (0.45) toward the canvas;
  // on-surface text must still read at 3:1 on it (the pairs live on the same surface family)
  const disabledSurface = composite(surface, 0.45, canvas);
  return [
    ['on-surface', colors.onSurface, surface, t],
    ['muted', colors.onSurfaceMuted, surface, mutedMin],
    ['border', colors.border, surface, 3],
    ['focus', colors.focusInner, surface, 3],
    ['disabled', colors.onSurface, disabledSurface, 3],
  ];
}

export function solveContrastMatrix(records, resolved, { throwOnUnmet = true } = {}) {
  const axes = {
    presets: rec_(records, resolved, 'contrast.matrix.axes.presets'),
    schemes: rec_(records, resolved, 'contrast.matrix.axes.schemes'),
    contrast: rec_(records, resolved, 'contrast.matrix.axes.contrast'),
    transparency: rec_(records, resolved, 'contrast.matrix.axes.transparency'),
    variants: rec_(records, resolved, 'contrast.matrix.axes.variants'),
    thickness: rec_(records, resolved, 'contrast.matrix.axes.thickness'),
    backdrop: rec_(records, resolved, 'contrast.matrix.axes.backdropClass'),
  };
  const targets = {
    text: rec_(records, resolved, 'contrast.matrix.targets.text'),
    chrome: rec_(records, resolved, 'contrast.matrix.targets.chrome'),
    more: rec_(records, resolved, 'contrast.matrix.targets.more'),
    alphaStep: rec_(records, resolved, 'contrast.matrix.targets.alphaStep'),
  };
  const floors = Object.fromEntries(axes.thickness.map((t) => [t, rec_(records, resolved, `contrast.matrix.floors.${t}`)]));
  const spec = rec_(records, resolved, 'material.material');
  // fill alpha per [variant][thickness]; raised/sunken are content adjustments (spec.content)
  const tintAt = (variant, th) =>
    (spec.variants[variant] ?? spec.content[variant])[th].alpha;
  const scrimClear = spec.scrim.clear;
  const declared = rec_(records, resolved, 'contrast.matrix.samples');
  const declaredHex = declared.filter((s) => s.startsWith('#'));
  if (declaredHex.length !== BUSY.length || declaredHex.some((h, i) => h.toLowerCase() !== BUSY[i]))
    throw new Error(`contrast-solve: contrast.matrix.samples busy hexes must be exactly ${BUSY.join(' ')}`);
  const colors = (scheme) => ({
    onSurface: colorToSrgb(rec_(records, resolved, 'sys.color.on-surface')[scheme]).rgb,
    onSurfaceMuted: colorToSrgb(rec_(records, resolved, 'sys.color.on-surface-muted')[scheme]).rgb,
    border: colorToSrgb(rec_(records, resolved, 'sys.color.border')[scheme]).rgb,
    focusInner: colorToSrgb(rec_(records, resolved, 'sys.color.focus-inner')[scheme]).rgb,
  });

  const cells = {};       // nested keyed output (MAT-047)
  const tintFloors = {};  // [transparency][thickness][backdrop] -> max floor (MAT-048)
  const tintFloorsMore = {};

  const bumpFloor = (table, tr, th, bd, v) => {
    table[tr] = table[tr] ?? {};
    table[tr][th] = table[tr][th] ?? {};
    table[tr][th][bd] = Math.max(table[tr][th][bd] ?? 0, v);
  };

  for (const preset of axes.presets) {
    const presetV = rec_(records, resolved, `preset.${preset}`);
    for (const scheme of axes.schemes) {
      const canvas = colorToSrgb(presetV.canvas[scheme]).rgb;
      const cs = colors(scheme);
      for (const contrast of axes.contrast) {
        for (const tr of axes.transparency) {
          for (const variant of axes.variants) {
            for (const th of axes.thickness) {
              const tint = tintAt(variant, th);
              const floor = floors[th];
              for (const bd of axes.backdrop) {
                const samples = BACKDROPS[bd].map(hexToSrgb);
                // 'clear' over light/media adds a scrim.clear 0.35 underlay
                const scrimmed = (variant === 'clear' && (bd === 'light' || bd === 'media'))
                  ? samples.map((s) => composite(SCRIM_BLACK, scrimClear, s))
                  : samples;

                let floorAlpha = null, best = { margin: -Infinity, ratio: 0, pair: null, alpha: 1 };
                for (let i = Math.round(floor * 200); i <= 200; i++) {
                  const alpha = i / 200;
                  let met = true;
                  let worst = { margin: Infinity, ratio: Infinity, pair: null };
                  for (const s of scrimmed) {
                    const surface = tr === 'solid' ? canvas : composite(canvas, Math.min(1, tint + alpha - floor), s);
                    for (const [pair, fg, bg, min] of cellPairs({ surface, canvas, colors: cs, contrast }, targets, s)) {
                      const r = contrastRatio(fg, bg);
                      if (r < min) met = false;
                      if (r - min < worst.margin) worst = { margin: r - min, ratio: r, pair };
                    }
                  }
                  if (worst.margin > best.margin) best = { ...worst, alpha };
                  if (met) { floorAlpha = alpha; break; }
                }
                const cellKey = [preset, scheme, contrast, tr, variant, th, bd].join('/');
                if (floorAlpha === null) {
                  if (throwOnUnmet)
                    throw new Error(`contrast-solve: unsolvable cell ${cellKey} (pair '${best.pair}', best ratio ${best.ratio.toFixed(3)} at alpha ${best.alpha})`);
                  floorAlpha = 1;
                }
                // worst-case stats at the solved alpha
                let minRatio = Infinity, worstPair = null;
                for (const s of scrimmed) {
                  const surface = tr === 'solid' ? canvas : composite(canvas, Math.min(1, tint + floorAlpha - floor), s);
                  for (const [pair, fg, bg] of cellPairs({ surface, canvas, colors: cs, contrast }, targets, s)) {
                    const r = contrastRatio(fg, bg);
                    if (r < minRatio) { minRatio = r; worstPair = pair; }
                  }
                }
                const surfaceSample = composite(canvas, Math.min(1, tint + floorAlpha - floor), scrimmed[0]);
                cells[preset] = cells[preset] ?? {};
                cells[preset][scheme] = cells[preset][scheme] ?? {};
                cells[preset][scheme][contrast] = cells[preset][scheme][contrast] ?? {};
                cells[preset][scheme][contrast][tr] = cells[preset][scheme][contrast][tr] ?? {};
                cells[preset][scheme][contrast][tr][variant] = cells[preset][scheme][contrast][tr][variant] ?? {};
                cells[preset][scheme][contrast][tr][variant][th] = cells[preset][scheme][contrast][tr][variant][th] ?? {};
                cells[preset][scheme][contrast][tr][variant][th][bd] = {
                  floorAlpha,
                  minRatio: Math.round(minRatio * 1000) / 1000,
                  pair: worstPair,
                  apcaLc: Math.round(apcaLc(cs.onSurface, surfaceSample) * 10) / 10,
                };
                if (contrast === 'more') bumpFloor(tintFloorsMore, 'more', th, bd, floorAlpha);
                else bumpFloor(tintFloors, tr, th, bd, floorAlpha);
              }
            }
          }
        }
      }
    }
  }

  return {
    version: 1,
    generatedFrom: 'tokens/contrast/contrast-matrix.tokens.json',
    inputSha256: null,                 // filled by build.mjs (sha256 of the spec file)
    cellCount: 2160,
    tintFloors,
    tintFloorsMore: tintFloorsMore.more ?? {},
    cells,
  };
}

/** Serialize with deterministic key order (all keys sorted). */
export function matrixJson(matrix) {
  const sortKeys = (o) => (o && typeof o === 'object' && !Array.isArray(o)
    ? Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sortKeys(v)]))
    : o);
  return JSON.stringify(sortKeys(matrix), null, 1) + '\n';
}

export { createHash };
