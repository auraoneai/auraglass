/* Test-only raster text for the OCR fixtures (REQ-QUAL-13): a 5×7 bitmap font rendered at an integer scale with the
   exact ink colour and alpha over an exact background, plus its text-hidden twin (background only). Fixtures are
   generated in the test, never committed as PNG (REQ-QUAL-60), so the contrast of every fixture is known exactly. */
import { createRaster, over, type Rect, type Rgb, type Rgba } from '../../src/pixel/raster';

const FONT: Record<string, readonly string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '10001', '11001', '10101', '10011', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

export interface TextFixture {
  capture: Rgba;
  twin: Rgba;
  /** CSS-px box of the rendered text run (dpr 1) */
  run: Rect;
  ink: Rgb;
}

/** Renders `text` (A–Z and space) at `scale` px per font cell, `ink` at `alpha` over `bg`, on a `pad`-px margin. */
export function renderText(text: string, opts: { ink: Rgb; alpha?: number; bg: Rgb; scale: number; pad?: number }): TextFixture {
  const pad = opts.pad ?? opts.scale * 6;
  const alpha = opts.alpha ?? 1;
  const glyphs = [...text.toUpperCase()].map((ch) => {
    const g = FONT[ch];
    if (!g) throw new Error(`renderText: no glyph for '${ch}'`);
    return g;
  });
  const advance = 6 * opts.scale; // 5 cells + 1 cell spacing
  const width = pad * 2 + glyphs.length * advance - opts.scale;
  const height = pad * 2 + 7 * opts.scale;
  const capture = createRaster(width, height, opts.bg);
  const twin = createRaster(width, height, opts.bg);
  const ink = over(opts.ink, alpha, opts.bg).map((v) => Math.round(v)) as unknown as Rgb;
  glyphs.forEach((g, gi) => {
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (g[row]![col] !== '1') continue;
        for (let dy = 0; dy < opts.scale; dy++) {
          for (let dx = 0; dx < opts.scale; dx++) {
            const x = pad + gi * advance + col * opts.scale + dx; const y = pad + row * opts.scale + dy;
            const o = (y * width + x) * 4;
            capture.data[o] = ink[0]; capture.data[o + 1] = ink[1]; capture.data[o + 2] = ink[2];
          }
        }
      }
    }
  });
  return { capture, twin, run: { x: pad, y: pad, w: glyphs.length * advance - opts.scale, h: 7 * opts.scale }, ink };
}
