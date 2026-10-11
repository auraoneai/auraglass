/* Frame statistics and the REQ-QUAL-48 gate. Pure functions; no I/O. */
import { BUDGETS, budgetFor } from './matrix.mjs';

/** Nearest-rank percentile over a numeric array (p in (0, 100]). */
export function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length);
  return sorted[Math.min(sorted.length, Math.max(1, rank)) - 1];
}

const round = (n) => (n == null ? null : Math.round(n * 100) / 100);

/**
 * Frame summary from raw rAF timestamps (ms, monotonically increasing).
 * A frame is one interval between consecutive callbacks. `dropped` counts the
 * vsync slots skipped, using the median interval as the display period.
 */
export function summarizeFrames(timestamps) {
  const ts = (timestamps ?? []).filter((t) => Number.isFinite(t));
  const intervals = [];
  for (let i = 1; i < ts.length; i++) {
    const d = ts[i] - ts[i - 1];
    if (d > 0) intervals.push(d);
  }
  if (!intervals.length) return { frames: 0, p50: null, p95: null, p99: null, maxMs: null, dropped: 0, periodMs: null };
  const period = percentile(intervals, 50);
  const dropped = intervals.reduce((n, d) => n + Math.max(0, Math.round(d / period) - 1), 0);
  return {
    frames: intervals.length,
    p50: round(period),
    p95: round(percentile(intervals, 95)),
    p99: round(percentile(intervals, 99)),
    maxMs: round(Math.max(...intervals)),
    dropped,
    periodMs: round(period),
  };
}

/** Long-animation-frame summary (Android Chrome via CDP); null when the engine has no LoAF. */
export function summarizeLoaf(entries) {
  if (entries == null) return null;
  const list = entries.filter((e) => Number.isFinite(e?.duration));
  return {
    count: list.length,
    over100ms: list.filter((e) => e.duration > 100).length,
    maxMs: list.length ? round(Math.max(...list.map((e) => e.duration))) : 0,
    blockingMs: round(list.reduce((s, e) => s + (Number(e.blockingDuration) || 0), 0)),
  };
}

/**
 * Status of one (target × subject) cell.
 *  - pass                 p95 within the tier budget
 *  - exception-required   mid-tier Android, budget < p95 ≤ 33 ms (needs one signed exception)
 *  - fail                 anything else, including 0 frames, a probe error or an unresolved story
 */
export function evaluateCell(target, measured) {
  const budgetMs = budgetFor(target);
  if (measured.error) return { status: 'fail', budgetMs, reason: measured.error };
  if (!measured.frames) return { status: 'fail', budgetMs, reason: 'zero-frames' };
  if (measured.p95 <= budgetMs) return { status: 'pass', budgetMs, reason: null };
  if (target.tier === 'mid' && measured.p95 <= BUDGETS.midExceptionMaxMs) {
    return { status: 'exception-required', budgetMs, reason: `p95 ${measured.p95} ms > ${budgetMs} ms (≤${BUDGETS.midExceptionMaxMs} ms needs a signed exception)` };
  }
  return { status: 'fail', budgetMs, reason: `p95 ${measured.p95} ms > ${target.tier === 'mid' ? BUDGETS.midExceptionMaxMs : budgetMs} ms` };
}

/**
 * Verdict over all evaluated cells against the full expected matrix.
 * A missing cell is a failure (fail closed). Real-device results never pass on
 * their own: a clean run is `measured-awaiting-signoff` until a human signs
 * docs/certification/real-device-matrix.md (REQ-FIN-112).
 */
export function verdict(cells, { targets, subjects }) {
  const failures = [];
  const have = new Set(cells.map((c) => `${c.target}|${c.subject}`));
  for (const t of targets) {
    for (const s of subjects) {
      if (!have.has(`${t.id}|${s.subject}`)) failures.push({ target: t.id, subject: s.subject, reason: 'missing-cell' });
    }
  }
  for (const c of cells) if (c.status === 'fail') failures.push({ target: c.target, subject: c.subject, reason: c.reason });
  const exceptions = cells.filter((c) => c.status === 'exception-required').map((c) => ({ target: c.target, subject: c.subject, p95: c.p95 }));
  if (exceptions.length > BUDGETS.maxSignedExceptions) {
    failures.push({ target: '*', subject: '*', reason: `${exceptions.length} cells need a signed exception; at most ${BUDGETS.maxSignedExceptions} allowed` });
  }
  return {
    status: failures.length ? 'fail' : 'measured-awaiting-signoff',
    failures,
    exceptions,
    signoff: { required: true, file: 'docs/certification/real-device-matrix.md', req: 'REQ-FIN-112' },
  };
}
