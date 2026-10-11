/* MAT-188/-223(T14) REQ-MAT-08: analytic spring response + equivalence against
   the compiled linear() tokens (2a-T output consumed through its frozen file). */
/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { SPRINGS } from '../../contracts/motion';
import type { SpringName } from '../../contracts/motion';
import { motionTokens } from '../tokens.generated';
import { parseLinear, springParams, springResponse } from '../adapter/springs';
import { toMotionTransition } from '../adapter/toMotionTransition';

const NAMES: SpringName[] = ['snappy', 'smooth', 'fluid'];

/** REQ-MAT-08: settle T = start of the 50 ms hold, rounded up to 10 ms. */
const DURATIONS: Record<SpringName, number> = { snappy: 300, smooth: 470, fluid: 650 };
/** Number of stops in a linear() string (comma-separated legs, paren-aware). */
const stopCount = (s: string): number =>
  s.trim().replace(/^linear\(/, '').replace(/\)$/, '').split(/,(?![^(]*\))/).length;

const EXPECTED: Record<SpringName, { stiffness: number; damping: number }> = {
  snappy: { stiffness: 986.96, damping: 62.83 },
  smooth: { stiffness: 322.27, damping: 32.31 },
  fluid: { stiffness: 194.94, damping: 22.90 },
};

describe('springParams — REQ-MAT-08 formulas', () => {
  it.each(NAMES)('%s stiffness=(2π/(r/1000))², damping=2ζ√stiffness', (name) => {
    const p = springParams(name);
    const { zeta, responseMs } = SPRINGS[name];
    expect(p.stiffness).toBeCloseTo(Math.pow((2 * Math.PI) / (responseMs / 1000), 2), 4);
    expect(p.damping).toBeCloseTo(2 * zeta * Math.sqrt(p.stiffness), 4);
    expect(p.stiffness).toBeCloseTo(EXPECTED[name].stiffness, 1);
    expect(p.damping).toBeCloseTo(EXPECTED[name].damping, 1);
  });
});

describe('springResponse — analytic step response', () => {
  it.each(NAMES)('%s: first 0, settles to 1, monotonic rise to first 1-crossing', (name) => {
    const { zeta, responseMs } = SPRINGS[name];
    expect(springResponse(zeta, responseMs, 0)).toBeCloseTo(0, 5);
    expect(springResponse(zeta, responseMs, responseMs * 3)).toBeCloseTo(1, 2);
    let prev = -Infinity;
    let overshoot = 0;
    let crossed = false;
    for (let t = 1; t <= responseMs * 3; t += 1) {
      const v = springResponse(zeta, responseMs, t);
      if (!crossed) {
        if (v >= 1) { crossed = true; }
        else { expect(v).toBeGreaterThanOrEqual(prev - 1e-9); prev = v; }
      }
      overshoot = Math.max(overshoot, v - 1);
    }
    // crit/over-damped never overshoot; fluid (ζ0.82) stays under 1.5%
    expect(overshoot).toBeLessThanOrEqual(0.015);
  });
  it('settles within ±10 ms of the generated duration envelope', () => {
    for (const name of NAMES) {
      const { zeta, responseMs } = SPRINGS[name];
      const p = springParams(name);
      // first t after which the response stays within ±0.5% for good
      let firstSettle = -1;
      for (let t = 1; t <= 4000; t += 1) {
        if (Math.abs(springResponse(zeta, responseMs, t) - 1) <= 0.005) {
          firstSettle = t;
          break;
        }
      }
      expect(firstSettle).toBeGreaterThan(0); // analytic response always settles
      // generated duration is the settle envelope — response must be inside ±10 ms late
      expect(firstSettle).toBeLessThanOrEqual(p.durationMs + 10);
    }
  });
});

describe('generator ⇄ compiled linear() equivalence (MAT-223 T14)', () => {
  it.each(NAMES)('%s differs ≤ 0.01 at every 10 ms sample', (name) => {
    const p = springParams(name);
    expect(p.linear).not.toBeNull();
    const f = parseLinear(p.linear!);
    for (let t = 0; t <= p.durationMs; t += 10) {
      const a = springResponse(p.zeta, p.responseMs, t);
      const b = f(t / p.durationMs);
      expect(Math.abs(a - b)).toBeLessThanOrEqual(0.01);
    }
  });
  it.each(NAMES)('%s linear() is within contract bounds: ≤40 stops, ≤600 B, overshoot ≤1.5%%', (name) => {
    const s = motionTokens.spring[name].linear;
    expect(s).toBe(motionTokens[`spring.${name}`]);
    expect(s.startsWith('linear(')).toBe(true);
    expect(s.length).toBeLessThanOrEqual(600);
    expect(stopCount(s)).toBeLessThanOrEqual(40);
    const f = parseLinear(s);
    expect(f(0)).toBe(0);
    expect(f(1)).toBeCloseTo(1, 5);
    let peak = 0;
    for (let t = 0; t <= 1; t += 0.001) peak = Math.max(peak, f(t));
    expect(peak - 1).toBeLessThanOrEqual(0.015);
  });
});

describe('motionTokens.spring.<name> (REQ-MAT-08)', () => {
  it.each(NAMES)('%s duration is the start of the 50 ms settle hold', (name) => {
    expect(motionTokens.spring[name].duration).toBe(DURATIONS[name]);
    expect(motionTokens[`spring.${name}-duration`]).toBe(DURATIONS[name]);
  });
  it.each(NAMES)('%s carries zeta/response from the contract and k=(2π/r)², c=2ζ√k', (name) => {
    const g = motionTokens.spring[name];
    const { zeta, responseMs } = SPRINGS[name];
    expect(Object.keys(g).sort()).toEqual(['damping', 'duration', 'linear', 'response', 'stiffness', 'zeta']);
    expect(g.zeta).toBe(zeta);
    expect(g.response).toBe(responseMs);
    expect(g.stiffness).toBeCloseTo(Math.pow((2 * Math.PI) / (responseMs / 1000), 2), 3);
    expect(g.damping).toBeCloseTo(2 * zeta * Math.sqrt(g.stiffness), 3);
  });
  it('smooth stiffness 322.3 ± 0.1 and damping 32.31 ± 0.01', () => {
    const { stiffness, damping } = motionTokens.spring.smooth;
    expect(Math.abs(stiffness - 322.3)).toBeLessThanOrEqual(0.1);
    expect(Math.abs(damping - 32.31)).toBeLessThanOrEqual(0.01);
  });
  it.each(NAMES)('toMotionTransition(spring-%s) reads the generated stiffness/damping', (name) => {
    const t = toMotionTransition(`spring-${name}`) as unknown as Record<string, unknown>;
    expect(Object.keys(t).sort()).toEqual(['damping', 'mass', 'stiffness', 'type']);
    expect(t.type).toBe('spring');
    expect(t.stiffness).toBe(motionTokens.spring[name].stiffness);
    expect(t.damping).toBe(motionTokens.spring[name].damping);
    expect(t.mass).toBe(1);
  });
});
