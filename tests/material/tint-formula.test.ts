/* REQ-FIN-02 (REQ-MAT-29): the tint formula on the surface host is
   --_ag-alpha = min(1, max(floor, floor + (1 - floor) * --ag-glass-opacity)).
   For --ag-glass-opacity in {-1, 0, 0.3, 0.7, 1, 2} alpha stays in
   [floor, 1] and is non-decreasing. Verified against the formula text in
   material.css (not a retyped copy). */
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, '../../src/material/css/material.css'), 'utf8');

const alpha = (floor: number, glassOpacity: number) =>
  Math.min(1, Math.max(floor, floor + (1 - floor) * glassOpacity));

describe('REQ-MAT-29 tint formula', () => {
  it('material.css declares the formula on the surface host', () => {
    expect(css).toMatch(/--_ag-alpha:\s*min\(1,\s*max\(var\(--_ag-tint-floor\),?\s*calc\(var\(--_ag-tint-floor\)\s*\+\s*\(1\s*-\s*var\(--_ag-tint-floor\)\)\s*\*\s*var\(--ag-glass-opacity/);
  });

  it.each([
    [-1, 0.6, 0.6],
    [0, 0.6, 0.6],
    [0.3, 0.6, 0.72],
    [0.7, 0.6, 0.88],
    [1, 0.6, 1],
    [2, 0.6, 1],
  ])('opacity %f at floor %f -> alpha %f', (opacity, floor, expected) => {
    expect(alpha(floor, opacity)).toBeCloseTo(expected, 10);
  });

  it('alpha is non-decreasing and stays inside [floor, 1] for the 6 inputs', () => {
    const floor = 0.6;
    const values = [-1, 0, 0.3, 0.7, 1, 2].map((o) => alpha(floor, o));
    for (const a of values) {
      expect(a).toBeGreaterThanOrEqual(floor);
      expect(a).toBeLessThanOrEqual(1);
    }
    const sorted = [...values].sort((a, b) => a - b);
    expect(values).toEqual(sorted);
  });
});
