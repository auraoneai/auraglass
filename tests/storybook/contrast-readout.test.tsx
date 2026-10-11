/* REQ-QUAL-54 (REQ-FIN-106, FIN-451): ContrastReadout — maths within ±0.05 of a reference WCAG 2.x implementation,
   the composite/worst-case pipeline, the cover mapping, and the live region (role=status, "estimate", ≤100 ms debounce,
   announces only on settle). The browser readback itself (canvasMeasure) runs in Storybook; jsdom has no canvas, so the
   component is exercised here through its `measure` seam with a deterministic sampler. */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import {
  ContrastReadout, SETTLE_MS, compositeOver, contrastRatio, relativeLuminance, sourceRect, thresholds, worstCaseContrast,
} from '../../.storybook/lab/ContrastReadout';
import type { ContrastEstimate, Rgb } from '../../.storybook/lab/ContrastReadout';

/* Reference: WCAG 2.2 §1.4.3 "relative luminance" and "contrast ratio" definitions, written independently from the
   formulas in the Recommendation (hex input, 0.03928 threshold as printed in WCAG 2.0, which differs from 0.04045 only
   for 8-bit values that never occur: no 8-bit channel falls between the two thresholds). */
function refLuminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const lin = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}
function refRatio(a: string, b: string): number {
  const [hi, lo] = [refLuminance(a), refLuminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
const rgb = (hex: string): Rgb => { const n = Number.parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const hexOf = ([r, g, b]: Rgb) => `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

describe('WCAG maths', () => {
  const PAIRS: Array<[string, string]> = [['#000000', '#ffffff'], ['#777777', '#ffffff'], ['#767676', '#ffffff'], ['#0b57d0', '#ffffff'],
    ['#ff0000', '#00ff00'], ['#1f2937', '#f9fafb'], ['#595959', '#e5e5e5'], ['#123456', '#abcdef'], ['#808080', '#808080']];

  it.each(PAIRS)('ratio %s on %s is within ±0.05 of the reference', (a, b) => {
    expect(Math.abs(contrastRatio(rgb(a), rgb(b)) - refRatio(a, b))).toBeLessThanOrEqual(0.05);
  });

  it('matches published values: 21:1, #767676 ≥ 4.5 on white, #777777 < 4.5 on white, 1:1', () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
    expect(contrastRatio(rgb('#767676'), [255, 255, 255])).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(rgb('#777777'), [255, 255, 255])).toBeLessThan(4.5);
    expect(contrastRatio([128, 128, 128], [128, 128, 128])).toBe(1);
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 10);
  });

  it('composites source-over in sRGB', () => {
    expect(compositeOver([255, 255, 255, 0.5], [0, 0, 0])).toEqual([127.5, 127.5, 127.5]);
    expect(compositeOver([10, 20, 30, 1], [200, 200, 200])).toEqual([10, 20, 30]);
    expect(compositeOver([10, 20, 30, 0], [200, 100, 50])).toEqual([200, 100, 50]);
  });

  it('worst case over a sample is the minimum per-pixel ratio of ink over the composited fill (±0.05 of reference)', () => {
    // Scene: one white, one mid-grey, one black pixel; fill: 60% white; ink: near-black.
    const pixels = new Uint8ClampedArray([255, 255, 255, 255, 128, 128, 128, 255, 0, 0, 0, 255]);
    const fill = [255, 255, 255, 0.6] as const;
    const ink = [17, 24, 39, 1] as const;
    const expected = Math.min(...[[255, 255, 255], [128, 128, 128], [0, 0, 0]].map((p) =>
      refRatio(hexOf([17, 24, 39]), hexOf(compositeOver(fill, p as unknown as Rgb)))));
    const got = worstCaseContrast(pixels, fill, ink);
    expect(got).not.toBeNull();
    expect(Math.abs(got! - expected)).toBeLessThanOrEqual(0.05);
    expect(worstCaseContrast(new Uint8ClampedArray([]), fill, ink)).toBeNull();
  });

  it('thresholds: 4.5/3 standard, 7/4.5 under contrast more', () => {
    expect(thresholds('standard')).toEqual({ onSurface: 4.5, muted: 3 });
    expect(thresholds('more')).toEqual({ onSurface: 7, muted: 4.5 });
  });

  it('maps a subject rect to the image region painted under it (cover, fill, contain, no overlap)', () => {
    const box = { x: 0, y: 0, width: 1000, height: 500 };
    // 2000×2000 image covering 1000×500: scale 0.5, drawn 1000×1000 centred → offset y = -250.
    expect(sourceRect({ x: 100, y: 100, width: 200, height: 100 }, box, { width: 2000, height: 2000 }, 'cover'))
      .toEqual({ x: 200, y: 700, width: 400, height: 200 });
    expect(sourceRect({ x: 0, y: 0, width: 500, height: 250 }, box, { width: 2000, height: 1000 }, 'fill'))
      .toEqual({ x: 0, y: 0, width: 1000, height: 500 });
    // contain: scale 0.25, drawn 500×500 centred at x 250.
    expect(sourceRect({ x: 250, y: 0, width: 250, height: 250 }, box, { width: 2000, height: 2000 }, 'contain'))
      .toEqual({ x: 0, y: 0, width: 1000, height: 1000 });
    expect(sourceRect({ x: 2000, y: 0, width: 10, height: 10 }, box, { width: 100, height: 100 }, 'fill')).toBeNull();
  });
});

describe('<ContrastReadout>', () => {
  function Harness({ watch, measure, contrast = 'standard' }: { watch: unknown; measure: (el: HTMLElement) => Promise<ContrastEstimate>; contrast?: 'standard' | 'more' }) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    return <><div ref={ref}>subject</div><ContrastReadout subject={ref} contrast={contrast} watch={watch} measure={measure} label="Regular" /></>;
  }

  it('is a status live region labelled "estimate" that measures only after the change settles (≤100 ms)', async () => {
    jest.useFakeTimers();
    try {
      expect(SETTLE_MS).toBeLessThanOrEqual(100);
      const measure = jest.fn(async () => ({ onSurface: 8.2, muted: 3.4, samples: 64 }));
      const { rerender } = render(<Harness watch={1} measure={measure} />);
      const status = screen.getByRole('status');
      expect(status).toHaveTextContent(/estimate/i);
      expect(status).toHaveAttribute('aria-busy', 'true');
      await act(async () => { jest.advanceTimersByTime(SETTLE_MS - 1); });
      expect(measure).not.toHaveBeenCalled();
      // A change inside the window restarts the debounce: still one measurement, for the settled value.
      rerender(<Harness watch={2} measure={measure} />);
      await act(async () => { jest.advanceTimersByTime(SETTLE_MS - 1); });
      expect(measure).not.toHaveBeenCalled();
      await act(async () => { jest.advanceTimersByTime(1); });
      expect(measure).toHaveBeenCalledTimes(1);
      expect(status).toHaveAttribute('aria-busy', 'false');
      expect(status).toHaveTextContent('Regular estimate: on-surface 8.20:1 (meets 4.5:1), muted 3.40:1 (meets 3:1)');
    } finally {
      jest.useRealTimers();
    }
  });

  it('reports "below" against the contrast-more thresholds and surfaces readback failures', async () => {
    jest.useFakeTimers();
    try {
      const { rerender } = render(<Harness watch={1} contrast="more" measure={async () => ({ onSurface: 6.1, muted: 4.6, samples: 4 })} />);
      await act(async () => { jest.advanceTimersByTime(SETTLE_MS); });
      expect(screen.getByRole('status')).toHaveTextContent('on-surface 6.10:1 (below 7:1), muted 4.60:1 (meets 4.5:1)');
      rerender(<Harness watch={2} contrast="more" measure={async () => { throw new Error('the subject does not overlap the scene'); }} />);
      await act(async () => { jest.advanceTimersByTime(SETTLE_MS); });
      expect(screen.getByRole('status')).toHaveTextContent('Regular estimate unavailable: the subject does not overlap the scene');
    } finally {
      jest.useRealTimers();
    }
  });

  it('imports no runtime contrast code from the library', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync(require.resolve('../../.storybook/lab/ContrastReadout.tsx'), 'utf8');
    expect(src.match(/^import .*$/gm)).toEqual(["import * as React from 'react';"]);
  });
});
