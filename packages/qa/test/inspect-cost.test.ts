/* REQ-QUAL-32 / REQ-QUAL-38 (QUAL, FIN-434) — the L6 `cost` gate used by the known-failures proof: visible blurred
   surfaces against certification/thresholds.json `layers` (pure, no browser). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { costGate, loadCostCeilings, parseCostCeilings, visibleBlurred } from '../src/inspect/cost';
import type { BackdropRect } from '../src/pixel/density';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const VIEWPORT = { width: 1440, height: 900 };
const rect = (x: number, y: number, w: number, h: number, pseudo: '' | '::before' = ''): BackdropRect => ({ x, y, w, h, selector: 'div.glass', pseudo, filter: 'blur(24px)' });

describe('cost ceilings (certification/thresholds.json layers)', () => {
  it('reads the PRD ceilings: ≤6 fine, ≤3 coarse', () => {
    expect(loadCostCeilings(ROOT)).toEqual({ fine: 6, coarse: 3 });
  });

  it('throws on a missing or mistyped key instead of falling back', () => {
    const raw = JSON.parse(readFileSync(join(ROOT, 'certification/thresholds.json'), 'utf8')) as Record<string, unknown>;
    expect(() => parseCostCeilings({ ...raw, layers: undefined })).toThrow(/layers missing/);
    expect(() => parseCostCeilings({ ...raw, layers: { fine: 6, coarse: '3' } })).toThrow(/layers\.coarse must be a non-negative integer/);
    expect(() => parseCostCeilings({ ...raw, layers: { fine: 6.5, coarse: 3 } })).toThrow(/layers\.fine must be a non-negative integer/);
  });
});

describe('cost gate', () => {
  const ceilings = { fine: 6, coarse: 3 };

  it('counts only boxes that intersect the viewport', () => {
    const rects = [rect(10, 10, 100, 100), rect(-200, 10, 100, 100), rect(10, 950, 100, 100), rect(1430, 890, 50, 50)];
    expect(visibleBlurred(rects, VIEWPORT)).toHaveLength(2);
  });

  it('fails the 4.1 modal shape: 12 visible blurred surfaces > 6 at pointer:fine', () => {
    const rects = Array.from({ length: 12 }, (_, i) => rect(20 + i * 10, 20, 400, 300, i % 2 ? '::before' : ''));
    const g = costGate(rects, VIEWPORT, 'fine', ceilings);
    expect(g).toMatchObject({ gate: 'cost', status: 'fail', value: 12, limit: 6 });
    expect(g.detail).toContain('12 visible blurred surface(s)');
  });

  it('passes at the ceiling and applies the coarse ceiling for pointer:coarse', () => {
    const six = Array.from({ length: 6 }, (_, i) => rect(i * 20, 0, 100, 100));
    expect(costGate(six, VIEWPORT, 'fine', ceilings)).toMatchObject({ status: 'pass', value: 6, limit: 6 });
    expect(costGate(six, VIEWPORT, 'coarse', ceilings)).toMatchObject({ status: 'fail', value: 6, limit: 3 });
  });
});
