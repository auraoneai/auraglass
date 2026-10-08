/* @jest-environment node */
/* MAT-155/136 — deltaE2000 helper self-check: identical colors -> 0, known
   pair -> the published CIEDE2000 reference value, symmetry. */
import { describe, expect, it } from '@jest/globals';
import { deltaE2000 } from './helpers/delta-e';

describe('deltaE2000', () => {
  it('identical colors -> 0', () => {
    expect(deltaE2000([50, 2.6772, -79.7751], [50, 2.6772, -79.7751])).toBeCloseTo(0, 6);
  });

  it('matches the Sharma reference pair (2.0425)', () => {
    expect(deltaE2000([50, 2.6772, -79.7751], [50, 0, -82.7485])).toBeCloseTo(2.0425, 3);
  });

  it('is symmetric', () => {
    const a: [number, number, number] = [63, 12, -60];
    const b: [number, number, number] = [40, 60, 20];
    expect(deltaE2000(a, b)).toBeCloseTo(deltaE2000(b, a), 9);
  });
});
