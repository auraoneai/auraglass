/* Contrast solver (MAT-046/047/048; A11Y's matrix contract REQ-A11Y-15..17).
   2160 cells: 4 presets x 2 schemes x 2 contrast x 3 transparency x 5 variant forms x
   3 thicknesses x 3 declared backdrops {light, dark, media}. Every cell is evaluated
   over all three composites #ffffff, #000000 and busy-min (the worst of the nine busy
   samples) — REQ-MAT-10; the declared backdrop selects the clear scrim underlay.
   Alpha search: integer loop i/200 over 0..1 from the authored floor upward.
   Pairs per REQ-A11Y-16 / REQ-MAT-10:
     on-surface >= 4.5 | muted >= 4.5 (3 only when sys.color.on-surface-muted carries
     ag.usage "large-only") | border >= 3 | focus >= 3 | disabled >= 3; under
     contrast=more every text pair (on-surface, muted) >= 7.
   Transparency models (REQ-FIN-03): glass = canvas tint composited at the cell alpha;
   tinted = the same glass composite, searched from the glass cell's solved alpha
   (tinted >= glass); solid = opaque — canvas at fallbackFill.alpha must meet every
   pair, and the solid floor is 1.
   'clear' over light/media adds a scrim.clear 0.35 underlay. Blur contributes nothing.
   An unsolvable cell throws naming the cell, the pair and the best ratio found. */
import { createHash } from 'node:crypto';
import { colorToSrgb, composite, contrastRatio, hexToSrgb, relativeLuminance } from '../color.mjs';

// Backdrop samples come from contrast.matrix.samples (MAT-024): 'white'/'black' and the
// nine busy mid-luminance hexes. Kept here as the single authoritative list too, with a
// consistency check against the token table in solveContrastMatrix.
const BUSY = ['#777777', '#ff3b30', '#34c759', '#0a84ff', '#ffcc00', '#af52de', '#ff9500', '#5ac8fa', '#8e8e93'];
// Every declared backdrop is evaluated over the same three composites (REQ-MAT-10):
// white, black and every busy sample (busy-min = the worst of them).
const COMPOSITES = ['#ffffff', '#000000', ...BUSY];
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
function cellPairs(ctx, targets) {
  const { surface, canvas, colors, contrast, mutedLargeOnly } = ctx;
  const more = contrast === 'more';
  const t = more ? targets.more : targets.text;
  // every text pair is 7:1 under contrast=more; otherwise muted is 4.5:1, or 3:1
  // only when the muted token is declared ag.usage "large-only"
  const mutedMin = more ? targets.more : (mutedLargeOnly ? 3 : 4.5);
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
  const fallbackAlpha = spec.fallbackFill?.alpha;
  if (typeof fallbackAlpha !== 'number' || fallbackAlpha <= 0 || fallbackAlpha > 1)
    throw new Error('contrast-solve: material.material.fallbackFill.alpha must be a number in (0, 1]');
  const mutedLargeOnly = records.get('sys.color.on-surface-muted')?.ext?.['ag.usage'] === 'large-only';
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
  const glassCellFloor = {}; // [preset/scheme/contrast/variant/th/bd] -> solved glass alpha
                             // (tinted = the glass composite, floored at the glass cell's alpha:
                             //  REQ-FIN-03 models tinted >= glass)

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
                const samples = COMPOSITES.map(hexToSrgb);
                // 'clear' over light/media adds a scrim.clear 0.35 underlay
                const scrimmed = (variant === 'clear' && (bd === 'light' || bd === 'media'))
                  ? samples.map((s) => composite(SCRIM_BLACK, scrimClear, s))
                  : samples;

                // glass/tinted: the canvas tint composited at the cell alpha; solid: opaque
                // canvas at fallbackFill.alpha whatever the searched alpha (its floor is 1)
                const surfaceAt = (s, alpha) => (tr === 'solid'
                  ? composite(canvas, fallbackAlpha, s)
                  : composite(canvas, Math.min(1, tint + alpha - floor), s));
                let floorAlpha = null, best = { margin: -Infinity, ratio: 0, pair: null, alpha: 1 };
                const cellBase = [preset, scheme, contrast, variant, th, bd].join('/');
                const startAlpha = tr === 'tinted' ? Math.max(floor, glassCellFloor[cellBase] ?? 0)
                  : tr === 'solid' ? 1 : floor;
                for (let i = Math.round(startAlpha * 200); i <= 200; i++) {
                  const alpha = i / 200;
                  let met = true;
                  let worst = { margin: Infinity, ratio: Infinity, pair: null };
                  for (const s of scrimmed) {
                    const surface = surfaceAt(s, alpha);
                    for (const [pair, fg, bg, min] of cellPairs({ surface, canvas, colors: cs, contrast, mutedLargeOnly }, targets)) {
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
                  const surface = surfaceAt(s, floorAlpha);
                  for (const [pair, fg, bg] of cellPairs({ surface, canvas, colors: cs, contrast, mutedLargeOnly }, targets)) {
                    const r = contrastRatio(fg, bg);
                    if (r < minRatio) { minRatio = r; worstPair = pair; }
                  }
                }
                const surfaceSample = surfaceAt(scrimmed[0], floorAlpha);
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
                if (tr === 'glass') glassCellFloor[cellBase] = floorAlpha;
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
