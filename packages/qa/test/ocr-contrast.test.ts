/* REQ-QUAL-13 (QUAL, FIN-430): OCR text contrast. Runs the real tesseract 5 binary (the job image carries it; this test
   fails with the exact install message when it is absent — it is never skipped). Fixtures are rendered here from a
   bitmap font with exact colours (no committed PNG, REQ-QUAL-60): 4.6:1 passes, 2.1:1 fails, large text at 3.1:1 passes
   (and fails as normal text), the 4.1 App Shell ink rgba(0,0,0,.9) on rgb(13,31,43) (1.12–2.14:1 measured in 4.1) fails. */
import { describe, expect, it } from '@jest/globals';
import { contrastRatio, hex, over, type Rgb } from '../src/pixel/raster';
import { lanczosUpscale, ocr, parseTsv, tesseractVersion, toPpm } from '../src/ocr/tesseract';
import { apcaLc, evaluateOcr, isLargeText, worstAcrossScenes, type TextRun } from '../src/ocr/contrast';
import { loadThresholds } from '../src/pixel/thresholds';
import { renderText } from './helpers/glyphs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const { thresholds } = loadThresholds(ROOT);
const T = thresholds.ocr;

function cell(text: string, ink: Rgb, bg: Rgb, opts: { alpha?: number; fontSizePx?: number; fontWeight?: number; contrastMore?: boolean } = {}) {
  const f = renderText(text, { ink, bg, alpha: opts.alpha ?? 1, scale: 4 });
  const run: TextRun = { rect: f.run, fontSizePx: opts.fontSizePx ?? 16, fontWeight: opts.fontWeight ?? 400, text };
  const read = ocr(f.capture, { psm: T.psm, upscale: T.upscale });
  const verdict = evaluateOcr({ capture: f.capture, twin: f.twin, words: read.words, runs: [run], dpr: 1, contrastMore: !!opts.contrastMore, thresholds: T });
  return { verdict, expected: contrastRatio(f.ink, bg), read };
}

describe('tesseract driver', () => {
  it('finds tesseract 5 and records its version', () => {
    expect(tesseractVersion()).toMatch(/^5\.\d+\.\d+$/);
  });

  it('parses level-5 TSV rows only, dropping empty text', () => {
    const tsv = ['level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext',
      '1\t1\t0\t0\t0\t0\t0\t0\t100\t50\t-1\t',
      '5\t1\t1\t1\t1\t1\t10\t12\t30\t14\t91.5\tHello',
      '5\t1\t1\t1\t1\t2\t44\t12\t20\t14\t-1\t '].join('\n');
    expect(parseTsv(tsv)).toEqual([{ text: 'Hello', conf: 91.5, box: { x: 10, y: 12, w: 30, h: 14 } }]);
  });

  it('Lanczos 2× keeps a flat field flat and doubles the size; PPM header is P6', () => {
    const f = renderText('A', { ink: [0, 0, 0], bg: [200, 100, 50], scale: 2 });
    const up = lanczosUpscale(f.twin, 2);
    expect([up.width, up.height]).toEqual([f.twin.width * 2, f.twin.height * 2]);
    expect([...up.data.subarray(0, 4)]).toEqual([200, 100, 50, 255]);
    expect(toPpm(up).subarray(0, 2).toString('ascii')).toBe('P6');
  });
});

describe('REQ-QUAL-13 ocr-contrast', () => {
  it('4.6:1 normal text passes', () => {
    const { verdict, expected } = cell('PROFILE FILES', hex('#757575'), [255, 255, 255]);
    expect(expected).toBeGreaterThanOrEqual(4.55);
    expect(expected).toBeLessThan(4.7);
    expect(verdict.subjectWords).toBeGreaterThan(0);
    expect(verdict.worst!.ratio).toBeCloseTo(expected, 1);
    expect(verdict.status).toBe('pass');
  });

  it('2.1:1 normal text fails', () => {
    const { verdict, expected } = cell('HELP PRICES', hex('#b3b3b3'), [255, 255, 255]);
    expect(expected).toBeGreaterThan(2.0);
    expect(expected).toBeLessThan(2.2);
    expect(verdict.status).toBe('fail');
    expect(verdict.detail).toMatch(/< 4\.5:1/);
  });

  it('large text at 3.1:1 passes, the same pixels as 16 px text fail', () => {
    const ink = hex('#929292');
    const large = cell('BLUE FILES', ink, [255, 255, 255], { fontSizePx: 24 });
    expect(large.expected).toBeGreaterThan(3.05);
    expect(large.expected).toBeLessThan(3.2);
    expect(large.verdict.status).toBe('pass');
    expect(large.verdict.worst!.large).toBe(true);
    const normal = cell('BLUE FILES', ink, [255, 255, 255], { fontSizePx: 16 });
    expect(normal.verdict.status).toBe('fail');
  });

  it('bold 18.66 px counts as large; 18.66 px regular does not', () => {
    expect(isLargeText(18.66, 700, T)).toBe(true);
    expect(isLargeText(18.66, 400, T)).toBe(false);
    expect(isLargeText(24, 400, T)).toBe(true);
  });

  it('contrast-more cells require 7:1 (4.6:1 fails there)', () => {
    const { verdict } = cell('PROFILE FILES', hex('#757575'), [255, 255, 255], { contrastMore: true });
    expect(verdict.status).toBe('fail');
    expect(verdict.detail).toMatch(/< 7:1/);
  });

  it('the 4.1 App Shell ink rgba(0,0,0,.9) on rgb(13,31,43) fails', () => {
    const bg: Rgb = [13, 31, 43];
    const { verdict, expected } = cell('PROFILE HELP', [0, 0, 0], bg, { alpha: 0.9 });
    expect(expected).toBeGreaterThanOrEqual(1.12);
    expect(expected).toBeLessThanOrEqual(2.14);
    expect(verdict.status).toBe('fail');
  });

  it('visible text that OCR cannot read fails ocr-no-words', () => {
    const f = renderText('INVISIBLE', { ink: [250, 250, 250], bg: [255, 255, 255], scale: 4 });
    const read = ocr(f.capture, { psm: T.psm, upscale: T.upscale });
    const v = evaluateOcr({ capture: f.capture, twin: f.twin, words: read.words, runs: [{ rect: f.run, fontSizePx: 16, fontWeight: 400, text: 'INVISIBLE' }], dpr: 1, contrastMore: false, thresholds: T });
    expect(v.status).toBe('fail');
    expect(v.detail).toMatch(/^ocr-no-words/);
  });

  it('scene text identical in the twin is not counted as the subject\'s', () => {
    const f = renderText('PRICES HERE', { ink: [0, 0, 0], bg: [255, 255, 255], scale: 4 });
    const read = ocr(f.capture, { psm: T.psm, upscale: T.upscale });
    expect(read.words.length).toBeGreaterThan(0);
    // twin == capture: the words are part of the backdrop, the subject has no text of its own
    const v = evaluateOcr({ capture: f.capture, twin: f.capture, words: read.words, runs: [], dpr: 1, contrastMore: false, thresholds: T });
    expect(v.subjectWords).toBe(0);
    expect(v.status).toBe('not-applicable');
  });

  it('APCA Lc is reported with WCAG polarity and never gates', () => {
    expect(apcaLc([0, 0, 0], [255, 255, 255])).toBeGreaterThan(100);
    expect(apcaLc([255, 255, 255], [0, 0, 0])).toBeLessThan(-100);
    const { verdict } = cell('PROFILE FILES', hex('#757575'), [255, 255, 255]);
    expect(verdict.worst!.apcaLc).toBeGreaterThan(0);
  });

  it('worst case across scenes picks the failing scene', () => {
    const pass = cell('PROFILE FILES', hex('#757575'), [255, 255, 255]).verdict;
    const fail = cell('PROFILE HELP', [0, 0, 0], [13, 31, 43], { alpha: 0.9 }).verdict;
    expect(worstAcrossScenes([{ scene: 'flat-white', verdict: pass }, { scene: 'dark-media', verdict: fail }])!.scene).toBe('dark-media');
  });

  it('composites ink alpha exactly like the browser (fixture sanity)', () => {
    expect(over([0, 0, 0], 0.9, [13, 31, 43]).map(Math.round)).toEqual([1, 3, 4]);
  });
});
