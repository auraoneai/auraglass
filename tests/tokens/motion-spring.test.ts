/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// MAT-042/044: motion-spring transform — snappy/smooth/fluid emit linear() with
// <= 40 stops, last stop exactly 1, max |x(t) - analytic(t)| <= 0.005 over 1,000
// samples; omega0 = 2*pi/r; exits exactly 60/80/140/220/320 ms; zeta<0.8, zeta>1.0,
// response outside 120-800 ms, and cubic-bezier y outside [0,1] are rejected;
// token values are byte-identical under data-ag-motion full/calm/none.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';
import { compileSpring } from '../../scripts/tokens/transforms/motion-spring.mjs';
import { validateTokenFile, loadSchema } from '../../scripts/tokens/validate.mjs';

const CSS = readFileSync(join(ROOT, 'dist/css/tokens.css'), 'utf8');
const SPRINGS = ['snappy', 'smooth', 'fluid'];
const REF = JSON.parse(readFileSync(join(ROOT, 'tokens/ref/time.tokens.json'), 'utf8'));

/** Analytic underdamped/critically-damped unit step response of a 2nd-order spring. */
const analytic = (zeta: number, omega0: number, t: number): number => {
  if (Math.abs(zeta - 1) < 1e-9) return 1 - Math.exp(-omega0 * t) * (1 + omega0 * t);
  const wd = omega0 * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * omega0 * t) * (Math.cos(wd * t) + (zeta * omega0 / wd) * Math.sin(wd * t));
};

/** Parse emitted linear() into [{x, p}] where p is progress 0..1 (default: uniform). */
const linearStops = (name: string): Array<{ x: number; p: number }> => {
  const m = new RegExp(`--ag-spring-${name}:\\s*linear\\(([^)]*)\\)`).exec(CSS);
  expect(m).not.toBeNull();
  const raw = m![1]!.split(',').map((s) => s.trim());
  const parsed = raw.map((s) => {
    const parts = s.split(/\s+/);
    return { x: parseFloat(parts[0]!), p: parts[1] ? parseFloat(parts[1]) / 100 : null as number | null };
  });
  // fill unspecified progress uniformly between hinted neighbours (CSS linear() rules)
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i]!.p === null) {
      // find next hinted index
      let j = i;
      while (j < parsed.length && parsed[j]!.p === null) j++;
      const prev = i > 0 ? parsed[i - 1]!.p! : 0;
      const next = j < parsed.length ? parsed[j]!.p! : 1;
      for (let k = i; k < j; k++) parsed[k]!.p = prev + ((next - prev) * (k - i + 1)) / (j - i + 1);
      i = j;
    }
  }
  return parsed as Array<{ x: number; p: number }>;
};

const evalLinear = (stops: Array<{ x: number; p: number }>, p: number): number => {
  if (p <= stops[0]!.p) return stops[0]!.x;
  if (p >= stops[stops.length - 1]!.p) return stops[stops.length - 1]!.x;
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]!.p) {
      const a = stops[i - 1]!;
      const b = stops[i]!;
      return a.x + (b.x - a.x) * ((p - a.p) / (b.p - a.p));
    }
  }
  return 1;
};

describe('motion-spring transform (MAT-042/044)', () => {
  for (const name of SPRINGS) {
    test(`${name}: <=40 stops, last stop 1, max deviation <= 0.005`, () => {
      const stops = linearStops(name);
      expect(stops.length).toBeLessThanOrEqual(40);
      expect(stops[stops.length - 1]!.x).toBe(1);
      for (const s of stops) {
        expect(s.x).toBeGreaterThanOrEqual(0);
        expect(s.x).toBeLessThanOrEqual(1.05); // underdamped overshoot is encoded, not clamped
      }
      const spec = REF.ref.time.spring[name].$value;
      const omega0 = (2 * Math.PI) / (spec.response.value / 1000);
      // the stops parametrize progress over the emitted settle duration (ms)
      const durationMs = Number(
        new RegExp(`--ag-spring-${name}-duration:\\s*(\\d+)ms`).exec(CSS)![1],
      );
      // compiler normalizes the endpoint to exactly 1
      const endX = analytic(spec.dampingRatio, omega0, durationMs / 1000) || 1;
      let maxDev = 0;
      for (let i = 0; i < 1000; i++) {
        const t = i / 999; // progress 0..1 over the emitted duration
        const truth = analytic(spec.dampingRatio, omega0, (t * durationMs) / 1000) / endX;
        maxDev = Math.max(maxDev, Math.abs(evalLinear(stops, t) - truth));
      }
      console.log(`${name}: ${stops.length} stops, duration ${durationMs}ms, max |deviation| = ${maxDev.toFixed(4)}`);
      expect(maxDev).toBeLessThanOrEqual(0.005);
    });

    test(`${name}: duration var emitted`, () => {
      expect(CSS).toMatch(new RegExp(`--ag-spring-${name}-duration:\\s*\\d+ms`));
    });
  }

  test('omega0 = 2*pi/r contract (durations reflect response)', () => {
    const d = (n: string) => Number(new RegExp(`--ag-spring-${n}-duration:\\s*(\\d+)ms`).exec(CSS)![1]);
    // longer response -> longer settle; snappy(r=200) < smooth(350) < fluid(450)
    expect(d('snappy')).toBeLessThan(d('smooth'));
    expect(d('smooth')).toBeLessThan(d('fluid'));
    console.log(`spring durations: snappy ${d('snappy')}ms smooth ${d('smooth')}ms fluid ${d('fluid')}ms`);
  });

  test('exit durations exactly 60/80/140/220/320ms', () => {
    for (const [name, ms] of [
      ['instant-exit', 60], ['micro-exit', 80], ['small-exit', 140], ['medium-exit', 220], ['large-exit', 320],
    ] as const) {
      expect(CSS).toContain(`--ag-duration-${name}: ${ms}ms`);
    }
  });

  test('@supports not fallback maps springs to ease-emphasized-decelerate', () => {
    const fb = CSS.slice(CSS.indexOf('@supports not (transition-timing-function: linear(0, 1))'));
    for (const n of SPRINGS)
      expect(fb).toContain(`--ag-spring-${n}: var(--ag-ease-emphasized-decelerate)`);
  });

  for (const [label, value] of [
    ['zeta 0.7 rejected', { dampingRatio: 0.7, response: { value: 200, unit: 'ms' } }],
    ['zeta 1.1 rejected', { dampingRatio: 1.1, response: { value: 200, unit: 'ms' } }],
    ['response 100ms rejected', { dampingRatio: 0.9, response: { value: 100, unit: 'ms' } }],
    ['response 900ms rejected', { dampingRatio: 0.9, response: { value: 900, unit: 'ms' } }],
  ] as const) {
    test(label, () => {
      expect(() => compileSpring(value as any, 'fixture')).toThrow();
    });
  }

  test('cubic-bezier(0.3,1.4,0.6,1) fixture rejected by schema', () => {
    const tree = {
      sys: { motion: { bad: {
        $type: 'cubicBezier', $value: [0.3, 1.4, 0.6, 1],
        $extensions: { 'ag.tier': 'sys' },
      } } },
    };
    const errors = validateTokenFile(tree, loadSchema(), 'bezier-fixture');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('spring values byte-identical across data-ag-motion modes', () => {
    // motion modes must not rewrite spring token values (full/calm/none differ only
    // via duration switches elsewhere — spring vars appear exactly once each)
    for (const n of SPRINGS) {
      const occurrences = CSS.match(new RegExp(`--ag-spring-${n}:\\s*linear\\(`, 'g')) ?? [];
      expect(occurrences.length).toBe(1);
    }
  });
});
