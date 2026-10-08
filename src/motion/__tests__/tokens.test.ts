/* MAT-190 REQ-MOT-06: contract motion token names → tokens table mapping.
   Generated-table assertions live in tokens-generated.test.ts (MAT-189). */
/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import type { MotionTokenName } from '../../contracts/motion';
import { tokens } from '../../tokens/index';

const DURS = ['instant', 'micro', 'small', 'medium', 'large'] as const;
const NAMES = ['snappy', 'smooth', 'fluid'] as const;

describe('MotionTokenName + tokens table (MAT-190)', () => {
  it('accepts contract names at type level', () => {
    const a: MotionTokenName = 'spring-smooth';
    const b: MotionTokenName = 'duration-medium';
    expect([a, b]).toHaveLength(2);
  });
  it('tokens table has --ag-* entries for every contract duration + spring', () => {
    const tt = tokens as Record<string, string>;
    for (const d of DURS) {
      expect(tt[`--ag-duration-${d}`]).toBe(`var(--ag-duration-${d})`);
      expect(tt[`--ag-duration-${d}-exit`]).toBeDefined();
    }
    expect(tt['--ag-duration-ambient']).toBeDefined();
    for (const s of NAMES) {
      expect(tt[`--ag-spring-${s}`]).toBeDefined();
      expect(tt[`--ag-spring-${s}-duration`]).toBeDefined();
    }
  });
});
