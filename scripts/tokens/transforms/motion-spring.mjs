/* motion-spring -> linear() easing (MAT-042/044, REQ-MOT-04 contract).
   omega0 = 2*pi / response; step response sampled at 1 ms until |1-x| < 0.001 and
   |x'| < 0.001*omega0 have held for 50 ms; settle T = start of that hold (REQ-MAT-08);
   stops decimated by RDP at tolerance 0.002,
   capped at 40 stops, 4 decimals, last stop exactly 1. Deterministic. */

const clamp01 = (x) => Math.min(1, Math.max(0, x));

/** x(t) for a unit step input at time t seconds, zeta damping, omega0 rad/s. */
function springStep(zeta, omega0, t) {
  if (zeta >= 1) {                                   // critically/over damped limit form
    const w = omega0 * t;
    return 1 - Math.exp(-w) * (1 + w);
  }
  const wd = omega0 * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * omega0 * t) * (Math.cos(wd * t) + (zeta * omega0 / wd) * Math.sin(wd * t));
}

/** Numerical derivative dx/dt at t (central difference over 0.5 ms). */
function springVel(zeta, omega0, t) {
  const h = 0.0005;
  return (springStep(zeta, omega0, t + h) - springStep(zeta, omega0, Math.max(0, t - h))) / (t > 0 ? 2 * h : h);
}

/** Ramer-Douglas-Peucker on [{t, x}] with tolerance tol (on x). */
function rdp(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const dt = b.t - a.t || 1;
  let maxD = -1, idx = -1;
  for (let i = 1; i < pts.length - 1; i++) {
    const xHat = a.x + (b.x - a.x) * ((pts[i].t - a.t) / dt);
    const d = Math.abs(pts[i].x - xHat);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= tol) return [a, b];
  return [...rdp(pts.slice(0, idx + 1), tol), ...rdp(pts.slice(idx), tol).slice(1)];
}

/**
 * Compile a spring token value {dampingRatio, response:{value,unit}} to:
 *   { linear: 'linear(...)', durationMs: settle time rounded up to 10 ms,
 *     zeta, responseMs, stiffness, damping }.
 * Rejects zeta outside [0.8, 1.0] or response outside [120, 800] ms (MAT-042).
 */
export function compileSpring(spring, tokenPath = '<token>') {
  const { dampingRatio: zeta, response } = spring;
  const rMs = response.unit === 's' ? response.value * 1000 : response.value;
  if (!(zeta >= 0.8 && zeta <= 1.0))
    throw new Error(`${tokenPath}: spring dampingRatio ${zeta} outside [0.8, 1.0]`);
  if (!(rMs >= 120 && rMs <= 800))
    throw new Error(`${tokenPath}: spring response ${rMs}ms outside [120, 800]`);

  const omega0 = (2 * Math.PI) / (rMs / 1000);        // rad/s
  // 1 ms samples until |1-x|<0.001 and |x'|<0.001*omega0 hold for 50 ms (or 3*r cap)
  const samples = [];
  let settledSince = -1;
  for (let tMs = 0; tMs <= rMs * 3 + 100; tMs++) {
    const x = springStep(zeta, omega0, tMs / 1000);
    samples.push({ t: tMs, x });
    const settled = Math.abs(1 - x) < 0.001 && Math.abs(springVel(zeta, omega0, tMs / 1000)) < 0.001 * omega0;
    if (settled && settledSince < 0) settledSince = tMs;
    if (!settled) settledSince = -1;
    if (settledSince >= 0 && tMs - settledSince >= 50) break;
  }
  // REQ-MAT-08: settle T is the START of the 50 ms hold (the earliest t from which
  // the spring stays settled), not its end. Samples past it are dropped so the
  // curve ends at x(settledSince), normalised to exactly 1.
  if (settledSince < 0) throw new Error(`${tokenPath}: spring did not settle within ${rMs * 3 + 100}ms`);
  samples.length = settledSince + 1;                  // samples[i].t === i ms
  const settleMs = settledSince;
  // normalize so the endpoint is exactly 1
  const endX = samples.at(-1).x || 1;
  for (const p of samples) p.x /= endX;
  samples.at(-1).x = 1;

  let stops = rdp(samples, 0.002);
  while (stops.length > 40) stops = rdp(samples, 0.002 * (stops.length / 40));
  // Emit `x p%` stops so the non-uniform sample times survive: plain lists are
  // spaced uniformly and break the |x(t)-linear(t)| <= 0.005 contract (MAT-044).
  // Progress is relative to the emitted (rounded) duration so x(p*durationMs)=x(t).
  const durationMs = Math.ceil(settleMs / 10) * 10;
  const pts = stops.map((p, i) => {
    // no clamp01: the overshoot (x>1 for underdamped springs) must be encoded or the
    // emitted curve deviates from the analytic solution past the 0.005 contract.
    const x = (Math.round(p.x * 10000) / 10000).toString();
    const progress = (p.t / durationMs) * 100;
    if (i === 0) return x;
    if (i === stops.length - 1) return `1 100%`; // last stop exactly 1 (contract)
    return `${x} ${+progress.toFixed(4)}%`;
  });
  // motion-library params (REQ-MAT-08): stiffness = (2π/(r/1000))², damping = 2ζ√k, mass 1
  const stiffness = omega0 * omega0;
  const damping = 2 * zeta * Math.sqrt(stiffness);
  return { linear: `linear(${pts.join(', ')})`, durationMs, zeta, responseMs: rMs, stiffness, damping };
}

/** Back-compat shim for earlier call sites. */
export const springToLinear = (v) => compileSpring(v).linear;
export const springDurationMs = (v) => compileSpring(v).durationMs;
