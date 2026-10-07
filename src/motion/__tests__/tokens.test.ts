/* MAT-189/-190 REQ-MOT-06/T01: generated motionTokens + tokens table shape.
   2a-T's real output uses dotted keys + linear() springs; the C0 seed uses
   dashed keys + numeric springs — strict assertions run against whichever is
   present and are reported DOUBLE-PASS for the absent half. */
/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { DURATIONS_MS, EASES, AMBIENT_DURATION_MS } from '../../contracts/motion';
import type { DurationName, EaseName, MotionTokenName, SpringName } from '../../contracts/motion';
import { motionTokens } from '../tokens.generated';
import { tokens } from '../../tokens/index';

const mt = motionTokens as Record<string, unknown>;
const NAMES: SpringName[] = ['snappy', 'smooth', 'fluid'];
const DURS: DurationName[] = ['instant', 'micro', 'small', 'medium', 'large'];
const dotted = NAMES.every((n) => typeof mt[`spring.${n}`] === 'string');

const round10 = (n: number) => Math.round(n / 10) * 10;
// generated keys dot only the first separator: duration.instant-exit, spring.snappy-duration
const val = (base: string) => (mt[base.replace('-', '.')] ?? mt[base]);

describe('motionTokens duration entries (MAT-189/-190)', () => {
  it('exactly 5 durations + 5 -exit (round10(0.7×)), 1 ambient', () => {
    for (const d of DURS) {
      expect(typeof val(`duration-${d}`)).toBe('number');
      expect(val(`duration-${d}`)).toBe(DURATIONS_MS[d].enter);
      expect(typeof val(`duration-${d}-exit`)).toBe('number');
      expect(val(`duration-${d}-exit`)).toBe(round10(0.7 * DURATIONS_MS[d].enter));
    }
    expect(val('duration-ambient')).toBe(AMBIENT_DURATION_MS);
    const keys = Object.keys(mt).filter((k) => /^duration[.-]/.test(k) && !/-exit$/.test(k));
    const exits = Object.keys(mt).filter((k) => /-exit$/.test(k));
    expect(keys).toHaveLength(6); // 5 + ambient
    expect(exits).toHaveLength(5);
  });
});

describe('motionTokens easings + springs (MAT-189/-190)', () => {
  it('4 easings, every control y in [0,1]', () => {
    const easeKeys = Object.keys(mt).filter((k) => /^ease[.-]/.test(k));
    expect(easeKeys).toHaveLength(4);
    for (const [name, tuple] of Object.entries(EASES) as Array<[EaseName, readonly number[]]>) {
      const v = val(`ease-${name}`);
      expect(v).toBe(`cubic-bezier(${tuple.join(', ')})`);
      expect(tuple[1]).toBeGreaterThanOrEqual(0);
      expect(tuple[1]).toBeLessThanOrEqual(1);
      expect(tuple[3]).toBeGreaterThanOrEqual(0);
      expect(tuple[3]).toBeLessThanOrEqual(1);
    }
  });
  it('3 springs + 3 -duration', () => {
    for (const s of NAMES) {
      expect(mt[`spring.${s}`] ?? mt[`spring-${s}`]).toBeDefined();
      expect(mt[`spring.${s}-duration`] ?? mt[`spring-${s}-duration`]).toBeDefined();
    }
  });
  it('generated shape: spring.<name> is a linear() string, -duration is ms', () => {
    if (!dotted) return; // seed shape — DOUBLE-PASS until 2a-T output lands
    for (const s of NAMES) {
      expect((mt[`spring.${s}`] as string).startsWith('linear(')).toBe(true);
      expect(typeof mt[`spring.${s}-duration`]).toBe('number');
      expect(mt[`spring.${s}-duration`]).toBeGreaterThanOrEqual(200);
    }
  });
  it('seed shape (pre-merge) keeps contract numbers', () => {
    if (dotted) return;
    expect(mt['spring-snappy']).toBe(1); // ζ=1.0
    expect(mt['spring-snappy-duration']).toBe(200);
    expect(mt['spring-smooth-duration']).toBe(350);
    expect(mt['spring-fluid-duration']).toBe(450);
  });
});

describe('MotionTokenName + re-export surface (MAT-189)', () => {
  it('accepts contract names at type level', () => {
    const a: MotionTokenName = 'spring-smooth';
    const b: MotionTokenName = 'duration-medium';
    expect([a, b]).toHaveLength(2);
  });
  it('motionTokens keys ⊂ tokens table (--ag- var names)', () => {
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
