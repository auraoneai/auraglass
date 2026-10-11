// REQ-SURF-188 (REQ-FIN-90): unit tests for the WCAG maths behind the remote
// L6 clear-over-media spec (tests/e2e/surf/clear-over-media/text-contrast.spec.ts).
import { describe, expect, it } from '@jest/globals';
import {
  MATRIX,
  THRESHOLDS,
  composite,
  contrastRatio,
  gradeRun,
  isLargeText,
  relativeLuminance,
  requiredRatio,
} from '../e2e/surf/clear-over-media/contrast';
import { SCENES } from '../../src/contracts/testing';

const pack = (r: number, g: number, b: number) => (r << 16) | (g << 8) | b;

describe('clear-over-media contrast maths', () => {
  it('matches the WCAG reference points', () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 10);
    expect(relativeLuminance([0, 0, 0])).toBe(0);
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 10);
    expect(contrastRatio([255, 255, 255], [255, 255, 255])).toBe(1);
    // #767676 on white is the canonical 4.54:1 grey.
    expect(contrastRatio([0x76, 0x76, 0x76], [255, 255, 255])).toBeCloseTo(4.54, 2);
  });

  it('composites translucent text onto the backdrop', () => {
    expect(composite([255, 255, 255], 0.5, [0, 0, 0])).toEqual([128, 128, 128]);
    expect(composite([10, 20, 30], 1, [200, 200, 200])).toEqual([10, 20, 30]);
    expect(composite([10, 20, 30], 0, [200, 200, 200])).toEqual([200, 200, 200]);
  });

  it('uses the MAT contract thresholds and large-text rule', () => {
    expect(THRESHOLDS.body).toBe(4.5);
    expect(THRESHOLDS.large.ratio).toBe(3);
    expect(isLargeText(24, 400)).toBe(true);
    expect(isLargeText(18.66, 700)).toBe(true);
    expect(isLargeText(18.66, 600)).toBe(false);
    expect(isLargeText(18, 700)).toBe(false);
    expect(requiredRatio(14, 400)).toBe(4.5);
    expect(requiredRatio(24, 400)).toBe(3);
    expect(requiredRatio(24, 400, 'more')).toBe(7);
  });

  it('covers the acceptance matrix: 8 scenes × 2 schemes × 3 rungs × 2 widths × 3 engines', () => {
    expect([...MATRIX.scenes].sort()).toEqual([...SCENES].sort());
    expect(MATRIX.schemes).toEqual(['light', 'dark']);
    expect(MATRIX.transparency).toEqual(['glass', 'tinted', 'solid']);
    expect(MATRIX.viewports).toEqual([1440, 390]);
    expect([...MATRIX.engines].sort()).toEqual(['chromium', 'firefox', 'webkit']);
  });

  it('grades on the worst backdrop pixel, not the average', () => {
    // White body text: passes over black, fails over one light-grey pixel in the run's box.
    const verdict = gradeRun({
      text: 'Now playing',
      color: [255, 255, 255, 1],
      fontSizePx: 14,
      fontWeight: 400,
      backdrop: [pack(0, 0, 0), pack(0, 0, 0), pack(0, 0, 0), pack(200, 200, 200)],
    });
    expect(verdict.fail).toBe(true);
    expect(verdict.bg).toBe('#c8c8c8');
    expect(verdict.worstRatio).toBeLessThan(4.5);
    expect(verdict.ratio).toBe(21);
    expect(verdict.need).toBe(4.5);
  });

  it('passes large text at 3:1 that would fail as body text', () => {
    // #949494 on white ≈ 3.03:1.
    const run = { text: 'Hero', color: [0x94, 0x94, 0x94, 1] as const, fontWeight: 400, backdrop: [pack(255, 255, 255)] };
    expect(gradeRun({ ...run, fontSizePx: 32 }).fail).toBe(false);
    expect(gradeRun({ ...run, fontSizePx: 14 }).fail).toBe(true);
  });

  it('accounts for alpha: half-transparent black on white drops below 4.5:1', () => {
    const verdict = gradeRun({ text: 'muted', color: [0, 0, 0, 0.5], fontSizePx: 14, fontWeight: 400, backdrop: [pack(255, 255, 255)] });
    expect(verdict.alpha).toBe(0.5);
    expect(verdict.worstRatio).toBeLessThan(4.5);
    expect(verdict.fail).toBe(true);
  });

  it('fails a run just under the threshold (#777777 on white ≈ 4.48:1)', () => {
    const verdict = gradeRun({ text: 'edge', color: [0x77, 0x77, 0x77, 1], fontSizePx: 14, fontWeight: 400, backdrop: [pack(255, 255, 255)] });
    expect(contrastRatio([0x77, 0x77, 0x77], [255, 255, 255])).toBeLessThan(4.5);
    expect(verdict.fail).toBe(true);
  });

  it('throws on a run with no backdrop samples instead of passing it', () => {
    expect(() => gradeRun({ text: 'ghost', color: [0, 0, 0, 1], fontSizePx: 14, fontWeight: 400, backdrop: [] }))
      .toThrow('no backdrop samples');
  });
});
