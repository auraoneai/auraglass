/* MAT lane V: analytic spring parameters (REQ-MAT-08). The DS-053 generator
   emits `spring.<name>` linear() strings + `spring.<name>-duration` ms; this
   module derives the equivalent motion-library params from the frozen contract
   SPRINGS row and evaluates the analytic step response for equivalence tests. */
import { SPRINGS } from '../../contracts/motion';
import type { SpringName } from '../../contracts/motion';
import { motionTokens } from '../tokens.generated';

export interface SpringParams {
  name: SpringName;
  zeta: number;
  responseMs: number;   // contract response (settle target)
  stiffness: number;    // (2π / (r/1000))²
  damping: number;      // 2ζ·√stiffness
  durationMs: number;   // generated settle duration (linear() span)
  linear: string | null; // generated linear() string, when present
}

/** Read a generated spring token in either the dotted (generated) or dashed (seed) key shape. */

/** Stiffness/damping/duration for a contract spring, reading generated tokens when present. */
export function springParams(name: SpringName): SpringParams {
  const { zeta, responseMs } = SPRINGS[name];
  const stiffness = Math.pow((2 * Math.PI) / (responseMs / 1000), 2);
  const damping = 2 * zeta * Math.sqrt(stiffness);
  const mt = motionTokens as Record<string, unknown>;
  const dotted = `spring.${name}`;
  const dashed = `spring-${name}`;
  const durationMs =
    (typeof mt[`${dotted}-duration`] === 'number' && (mt[`${dotted}-duration`] as number)) ||
    (typeof mt[`${dashed}-duration`] === 'number' && (mt[`${dashed}-duration`] as number)) ||
    responseMs;
  const linear =
    (typeof mt[dotted] === 'string' && (mt[dotted] as string)) ||
    (typeof mt[dashed] === 'string' && (mt[dashed] as string)) || null;
  return { name, zeta, responseMs, stiffness, damping, durationMs, linear };
}

/** Unit step response of a damped spring at time t ms (position from 0 toward 1). */
export function springResponse(zeta: number, responseMs: number, tMs: number): number {
  const omega0 = (2 * Math.PI) / (responseMs / 1000); // rad/s — contract formula
  const t = tMs / 1000;
  if (zeta >= 1) {
    const w = omega0 * t;
    return 1 - Math.exp(-w) * (1 + w);
  }
  const wd = omega0 * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * omega0 * t) * (Math.cos(wd * t) + (zeta * omega0 / wd) * Math.sin(wd * t));
}

/** Parse a CSS linear() easing string into an evaluator position(t01) → position. */
export function parseLinear(src: string): (t01: number) => number {
  const body = src.trim().replace(/^linear\(/i, '').replace(/\)\s*$/, '');
  // stops: "v" or "v p1% p2%" — paren-aware split
  const stops: Array<{ v: number; ps: number[] }> = [];
  for (const leg of body.split(/,(?![^(]*\))/)) {
    const m = leg.trim().match(/^(-?[\d.]+)\s*(.*)$/);
    if (!m || m[1] === undefined) continue;
    const ps = (m[2] ?? '').split(/\s+/).filter(Boolean).map((p) => parseFloat(p) / 100);
    stops.push({ v: parseFloat(m[1]), ps });
  }
  if (stops.length === 0) return () => 0;
  const n = stops.length;
  const at = (i: number): { v: number; p: number } => {
    const s = stops[Math.max(0, Math.min(i, n - 1))]!;
    const p = s.ps.length === 2 ? s.ps[i === 0 ? 0 : 1]!
      : s.ps.length === 1 ? s.ps[0]!
      : i / (n - 1);
    return { v: s.v, p };
  };
  return (t01: number) => {
    const t = Math.max(0, Math.min(1, t01));
    for (let i = 0; i < n - 1; i++) {
      const a = at(i), b = at(i + 1);
      if (t >= a.p && t <= b.p) {
        const k = b.p === a.p ? 0 : (t - a.p) / (b.p - a.p);
        return a.v + (b.v - a.v) * k;
      }
    }
    return t <= at(0).p ? at(0).v : at(n - 1).v;
  };
}
