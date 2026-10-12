/* REQ-CMP-36: non-text (glyph) contrast for icon-only controls (WCAG 1.4.11, >=3:1).
   Pure measurement over two captures of the same frame: `shown` (glyph painted) and
   `hidden` (the [data-ag-part="icon"] span set to visibility:hidden, everything else
   identical). Pixels inside the icon box whose colour changes by at least `minDelta`
   are glyph pixels; the `coreFraction` with the largest change are the glyph core
   (anti-aliased edge pixels are partial coverage and would understate the colour).
   The ratio is WCAG 2.x contrast between the median core colour in `shown` and the
   median colour of the same pixels in `hidden` — i.e. glyph vs the surface directly
   under it, whatever the scene and material behind it. Unit-tested in
   tests/controls/icon-button-glyph-contrast.test.ts; driven by
   icon-button-contrast.spec.ts. */
import {
  assertSameSize, channelDelta, contrastRatio, forEachOffset, medianRgb,
  type Rect, type Rgb, type Rgba,
} from '../../../../packages/qa/src/pixel/raster';

export const GLYPH_MIN_CONTRAST = 3;

export interface GlyphContrastOptions {
  /** smallest per-channel change (8-bit levels) that counts as a glyph pixel */
  minDelta?: number;
  /** share of glyph pixels, by descending change, treated as the glyph core */
  coreFraction?: number;
}

export interface GlyphContrast {
  ratio: number;
  glyph: Rgb;
  surface: Rgb;
  /** pixels that changed when the glyph was hidden */
  glyphPixels: number;
  corePixels: number;
}

/** null when nothing in `rect` changes between the captures (the glyph did not paint). */
export function measureGlyphContrast(shown: Rgba, hidden: Rgba, rect: Rect, opts: GlyphContrastOptions = {}): GlyphContrast | null {
  assertSameSize(shown, hidden, 'measureGlyphContrast');
  const minDelta = opts.minDelta ?? 16;
  const coreFraction = opts.coreFraction ?? 0.5;
  if (!(coreFraction > 0 && coreFraction <= 1)) throw new Error(`measureGlyphContrast: coreFraction ${coreFraction} outside (0, 1]`);
  const hits: Array<{ o: number; d: number }> = [];
  forEachOffset(shown, rect, (o) => {
    const d = channelDelta(shown.data, hidden.data, o);
    if (d >= minDelta) hits.push({ o, d });
  });
  if (!hits.length) return null;
  // stable order: larger change first, then raster order
  hits.sort((a, b) => b.d - a.d || a.o - b.o);
  const core = hits.slice(0, Math.max(1, Math.round(hits.length * coreFraction)));
  const at = (img: Rgba, o: number): Rgb => [img.data[o]!, img.data[o + 1]!, img.data[o + 2]!];
  const glyph = medianRgb(core.map((h) => at(shown, h.o)));
  const surface = medianRgb(core.map((h) => at(hidden, h.o)));
  return { ratio: contrastRatio(glyph, surface), glyph, surface, glyphPixels: hits.length, corePixels: core.length };
}
