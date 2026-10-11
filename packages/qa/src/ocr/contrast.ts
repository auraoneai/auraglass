/* REQ-QUAL-13 OCR text contrast — measurement (QUAL, FIN-430).
   For each OCR word with confidence ≥ `ocr.minConfidence`: glyph pixels are the pixels of the word box that differ from
   the text-hidden twin by ≥ `ocr.glyphMinDelta` levels; the glyph colour is their median in the capture and the
   background is the median colour of the same box in the twin. WCAG 2.x ratio ≥ 4.5 (≥ 3 for large text: DOM
   font-size ≥ 24 px, or ≥ 18.66 px with weight ≥ 700), ≥ 7 in contrast-more cells; worst case across scenes per
   subject-state. A word whose box has no glyph pixels is scene text seen through the subject (identical in the twin) and
   is not the subject's. A subject with ≥ 1 visible text node and 0 subject words fails `ocr-no-words`. APCA Lc is
   reported, never gated. Not exemptable (REQ-QUAL-68). */
import { channelDelta, contrastRatio, forEachOffset, medianRgb, medianRgbIn, type Rect, type Rgb, type Rgba, assertSameSize } from '../pixel/raster';
import type { OcrWord } from './tesseract';

export interface TextRun {
  /** CSS px, viewport-relative (Range.getClientRects of a visible text node) */
  rect: Rect;
  fontSizePx: number;
  fontWeight: number;
  text: string;
}

export interface OcrThresholds { minConfidence: number; normal: number; large: number; contrastMore: number; largePx: number; largeBoldPx: number; largeBoldWeight: number; glyphMinDelta: number }

export interface WordMeasure {
  text: string;
  conf: number;
  box: Rect;
  glyphPx: number;
  glyph: Rgb;
  background: Rgb;
  ratio: number;
  apcaLc: number;
  large: boolean;
  required: number;
  pass: boolean;
}

export interface OcrVerdict {
  gate: 'ocr-contrast';
  status: 'pass' | 'fail' | 'not-applicable';
  visibleTextRuns: number;
  ocrWords: number;
  subjectWords: number;
  worst: WordMeasure | null;
  words: WordMeasure[];
  detail: string;
}

/** APCA-W3 0.0.98G-4g lightness contrast Lc (reported only). Positive: dark text on light; negative: light on dark. */
export function apcaLc(text: Rgb, bg: Rgb): number {
  const y = (c: Rgb): number => {
    const Y = 0.2126729 * (c[0] / 255) ** 2.4 + 0.7151522 * (c[1] / 255) ** 2.4 + 0.072175 * (c[2] / 255) ** 2.4;
    return Y < 0.022 ? Y + (0.022 - Y) ** 1.414 : Y;
  };
  const yt = y(text); const yb = y(bg);
  if (Math.abs(yb - yt) < 0.0005) return 0;
  if (yb > yt) { const s = (yb ** 0.56 - yt ** 0.57) * 1.14; return s < 0.1 ? 0 : (s - 0.027) * 100; }
  const s = (yb ** 0.65 - yt ** 0.62) * 1.14;
  return s > -0.1 ? 0 : (s + 0.027) * 100;
}

export function isLargeText(fontSizePx: number, fontWeight: number, t: Pick<OcrThresholds, 'largePx' | 'largeBoldPx' | 'largeBoldWeight'>): boolean {
  return fontSizePx >= t.largePx || (fontSizePx >= t.largeBoldPx && fontWeight >= t.largeBoldWeight);
}

function overlap(a: Rect, b: Rect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? w * h : 0;
}

/** The DOM run (device px at `dpr`) covering most of a word box, or null. */
export function matchRun(box: Rect, runs: readonly TextRun[], dpr: number): TextRun | null {
  let best: TextRun | null = null; let bestArea = 0;
  for (const r of runs) {
    const a = overlap(box, { x: r.rect.x * dpr, y: r.rect.y * dpr, w: r.rect.w * dpr, h: r.rect.h * dpr });
    if (a > bestArea) { bestArea = a; best = r; }
  }
  return best;
}

export function measureWord(capture: Rgba, twin: Rgba, w: OcrWord, run: TextRun | null, contrastMore: boolean, t: OcrThresholds): WordMeasure | null {
  const glyphs: Rgb[] = [];
  forEachOffset(capture, w.box, (o) => {
    if (channelDelta(capture.data, twin.data, o) >= t.glyphMinDelta) glyphs.push([capture.data[o]!, capture.data[o + 1]!, capture.data[o + 2]!]);
  });
  if (glyphs.length === 0) return null; // scene text through the subject: identical in the twin
  const glyph = medianRgb(glyphs);
  const background = medianRgbIn(twin, w.box);
  const ratio = contrastRatio(glyph, background);
  const large = run ? isLargeText(run.fontSizePx, run.fontWeight, t) : false;
  const required = contrastMore ? t.contrastMore : large ? t.large : t.normal;
  return { text: w.text, conf: w.conf, box: w.box, glyphPx: glyphs.length, glyph, background, ratio, apcaLc: apcaLc(glyph, background), large, required, pass: ratio >= required };
}

/** One cell: OCR words of the capture + the twin + the subject's visible DOM text runs. */
export function evaluateOcr(input: {
  capture: Rgba; twin: Rgba; words: readonly OcrWord[]; runs: readonly TextRun[]; dpr: number; contrastMore: boolean; thresholds: OcrThresholds;
}): OcrVerdict {
  const { capture, twin, words, runs, dpr, contrastMore, thresholds: t } = input;
  assertSameSize(capture, twin, 'ocr-contrast');
  const confident = words.filter((w) => w.conf >= t.minConfidence);
  const measured = confident.map((w) => measureWord(capture, twin, w, matchRun(w.box, runs, dpr), contrastMore, t)).filter((m): m is WordMeasure => m !== null);
  // worst = smallest margin over its own requirement
  const worst = measured.reduce<WordMeasure | null>((m, x) => (m === null || x.ratio / x.required < m.ratio / m.required ? x : m), null);
  const base = { gate: 'ocr-contrast' as const, visibleTextRuns: runs.length, ocrWords: words.length, subjectWords: measured.length, worst, words: measured };
  if (runs.length === 0 && measured.length === 0) return { ...base, status: 'not-applicable', detail: 'subject has no visible text' };
  if (runs.length > 0 && measured.length === 0) {
    return { ...base, status: 'fail', detail: `ocr-no-words: ${runs.length} visible text run(s) but OCR read 0 subject words (conf ≥${t.minConfidence}) — text is unreadable in pixels` };
  }
  const failing = measured.filter((m) => !m.pass);
  if (failing.length) {
    return { ...base, status: 'fail',
      detail: failing.slice(0, 8).map((m) => `'${m.text}' ${m.ratio.toFixed(2)}:1 < ${m.required}:1 (glyph rgb(${m.glyph.join(',')}) on rgb(${m.background.join(',')})${m.large ? ', large' : ''}, APCA Lc ${m.apcaLc.toFixed(1)})`).join('; ')
        + (failing.length > 8 ? `; … ${failing.length - 8} more` : '') };
  }
  return { ...base, status: 'pass', detail: `${measured.length} word(s); worst '${worst!.text}' ${worst!.ratio.toFixed(2)}:1 (≥${worst!.required}:1)` };
}

/** Worst case across scenes for one subject-state: the verdict with the smallest margin; any fail wins. */
export function worstAcrossScenes(verdicts: ReadonlyArray<{ scene: string; verdict: OcrVerdict }>): { scene: string; verdict: OcrVerdict } | null {
  const rank = (v: OcrVerdict): number => (v.status === 'fail' ? -1 : v.worst ? v.worst.ratio / v.worst.required : Number.POSITIVE_INFINITY);
  return verdicts.reduce<{ scene: string; verdict: OcrVerdict } | null>((m, x) => (m === null || rank(x.verdict) < rank(m.verdict) ? x : m), null);
}
