// tests/e2e/surf/clear-over-media/contrast.ts — REQ-SURF-188 (REQ-FIN-90).
// Pure WCAG 2.x maths for the SURF clear-over-media L6 spec. The browser side
// only collects text runs (resolved sRGB colour + alpha) and the set of
// backdrop pixels behind each run with all text painted transparent; every
// ratio is computed here so the maths is unit-tested in jsdom
// (tests/media/clear-over-media-contrast.test.ts).
//
// Thresholds and the matrix come from MAT's measurement contract
// (tests/a11y/pixel-contrast.contract.json, MAT-315): "sample every visible
// text run, take the worst sample per row". SURF reads it and never copies or
// loosens the numbers.
import contract from '../../../a11y/pixel-contrast.contract.json';

export type Rgb = readonly [number, number, number];
export type Rgba = readonly [number, number, number, number];

export const THRESHOLDS = contract.thresholds;
export const MATRIX = contract.matrix;

/** WCAG 2.x relative luminance of an 8-bit sRGB colour. */
export function relativeLuminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG 2.x contrast ratio, always >= 1. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Source-over composite of a (possibly translucent) text colour onto an opaque backdrop pixel. */
export function composite(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  const a = Math.min(1, Math.max(0, alpha));
  return [0, 1, 2].map((i) => Math.round(fg[i]! * a + bg[i]! * (1 - a))) as unknown as Rgb;
}

/** Large text per WCAG / the MAT contract: >=24px, or >=18.66px at weight >=700. */
export function isLargeText(fontSizePx: number, fontWeight: number): boolean {
  return fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
}

/** Required ratio for a run: `more` (7:1) under contrast-more, else 3:1 large / 4.5:1 body. */
export function requiredRatio(fontSizePx: number, fontWeight: number, mode: 'default' | 'more' = 'default'): number {
  if (mode === 'more') return THRESHOLDS.more;
  return isLargeText(fontSizePx, fontWeight) ? THRESHOLDS.large.ratio : THRESHOLDS.body;
}

/** 24-bit packed RGB, as returned by the in-page sampler. */
export const unpack = (v: number): Rgb => [(v >> 16) & 255, (v >> 8) & 255, v & 255];
export const toHex = ([r, g, b]: Rgb): string =>
  `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;

export interface TextRunSample {
  text: string;
  /** resolved sRGB text colour, alpha 0..1 (already multiplied by ancestor opacity) */
  color: Rgba;
  fontSizePx: number;
  fontWeight: number;
  /** packed 24-bit backdrop pixels behind the run's glyph boxes, text hidden */
  backdrop: readonly number[];
}

export interface RunVerdict {
  text: string;
  color: string;
  alpha: number;
  /** worst backdrop pixel (hex) */
  bg: string;
  /** median ratio over the sampled backdrop pixels */
  ratio: number;
  /** worst ratio over the sampled backdrop pixels; this is what is graded */
  worstRatio: number;
  need: number;
  fail: boolean;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Grades one text run against every backdrop pixel behind it. A run with no
 * backdrop samples is a measurement error, not a pass: it throws so the cell
 * fails loudly instead of being silently dropped.
 */
export function gradeRun(run: TextRunSample, mode: 'default' | 'more' = 'default'): RunVerdict {
  if (run.backdrop.length === 0) throw new Error(`no backdrop samples for text run "${run.text}"`);
  const fg: Rgb = [run.color[0], run.color[1], run.color[2]];
  const ratios = run.backdrop.map((packed) => {
    const bg = unpack(packed);
    return { bg, r: contrastRatio(composite(fg, run.color[3], bg), bg) };
  });
  ratios.sort((a, b) => a.r - b.r);
  const worst = ratios[0]!;
  const median = ratios[Math.floor(ratios.length / 2)]!;
  const need = requiredRatio(run.fontSizePx, run.fontWeight, mode);
  return {
    text: run.text,
    color: toHex(fg),
    alpha: round2(run.color[3]),
    bg: toHex(worst.bg),
    ratio: round2(median.r),
    worstRatio: round2(worst.r),
    need,
    // Graded on the unrounded worst ratio; rounding is for the report only.
    fail: worst.r < need,
  };
}
