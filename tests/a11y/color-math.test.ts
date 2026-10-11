/* MAT-314: the browser helpers' ciede2000 is verified against the Sharma, Wu
 *  & Dalal (2005) Table 1 reference pairs to ±0.0001 (the paper's own
 *  tolerance); machado simulation sanity checks for protan/deutan/tritan. */
import { describe, expect, it } from '@jest/globals';
import { deltaE2000 } from '../e2e/mat/helpers/ciede2000';
import { simulateCvd, feColorMatrix } from '../e2e/mat/helpers/machado';

// Sharma 2005 Table 1 (first-colour columns x, second y, expected ΔE00)
const PAIRS: Array<[number[], number[], number]> = [
  [[50, 2.6772, -79.7751], [50, 0, -82.7485], 2.0425],
  [[50, 3.1571, -77.2803], [50, 0, -82.7485], 2.8615],
  [[50, -1.3802, -84.2814], [50, 0, -82.7485], 1.0],
  [[50, 2.49, -0.001], [50, -2.49, 0.0009], 7.1792],
  [[50, -0.001, 2.49], [50, 0.0009, -2.49], 4.8045],
  [[50, 2.5, 0], [50, 0, -2.5], 4.3065],
  [[50, 2.5, 0], [73, 25, -18], 27.1492],
  [[50, 2.5, 0], [61, -5, 29], 22.8977],
  [[50, 2.5, 0], [50, 3.1736, 0.5854], 1.0],
  [[50, 2.5, 0], [58, 24, 15], 19.4535],
  [[60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387], 1.2644],
  [[22.7233, 20.0904, -46.6940], [23.0331, 14.9730, -42.5619], 2.0373],
  [[36.4612, 47.8580, 18.3852], [36.2715, 50.5065, 21.2231], 1.4146],
  [[6.7747, -0.2908, -2.4247], [5.8714, -0.0985, -2.2286], 0.6377],
  [[2.0776, 0.0795, -1.1350], [0.9033, -0.0636, -0.5514], 0.9082],
];

describe('ciede2000 vs Sharma 2005 reference pairs', () => {
  for (const [x, y, want] of PAIRS) {
    it(`Lab(${x}) vs Lab(${y}) = ${want}`, () => {
      const got = deltaE2000({ L: x[0]!, a: x[1]!, b: x[2]! }, { L: y[0]!, a: y[1]!, b: y[2]! });
      expect(Math.abs(got - want)).toBeLessThanOrEqual(0.0001);
    });
  }
});

describe('machado severity-1.0 simulation', () => {
  it('achromatic input stays achromatic for all three types', () => {
    for (const t of ['protan', 'deutan', 'tritan'] as const) {
      const [r, g, b] = simulateCvd(t, 0.5, 0.5, 0.5);
      expect(Math.abs(r - g)).toBeLessThan(0.01);
      expect(Math.abs(g - b)).toBeLessThan(0.01);
    }
  });
  it('protan shifts reds toward the green axis', () => {
    const [r1] = simulateCvd('protan', 1, 0, 0);
    const [r2] = simulateCvd('protan', 0, 1, 0);
    // classic protan failure: long-wavelength red loses discrimination
    expect(Math.abs(r1 - r2)).toBeLessThan(0.9);
  });
  it('returns values in [0,1] and feColorMatrix has 20 numbers', () => {
    for (const t of ['protan', 'deutan', 'tritan'] as const) {
      for (const v of simulateCvd(t, 0.2, 0.6, 0.9)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
      expect(feColorMatrix(t).trim().split(/\s+/).length).toBe(20);
    }
  });
});
