/* packages/qa/src/perf/freeze.ts — REQ-QUAL-39 calibration freeze (D-26), logic behind tests/perf/qual/budgets-frozen.test.ts.

   Calibration happens once, at the first pre-release where `Button` and `Dialog` carry no seed marker (contract §6.1).
   Before it (certification/calibration.json `sha: null`) each stream may raise its own size-/perf-budget rows ONCE, in
   its own PR carrying the `Perf-Budget-Raise:` trailer (changeset marker `perf-budget-raise`), to at most
   min(provisional, ceil(measured × 1.10)) — bytes ceil(measured × 1.10 / 256) × 256 — from QUAL's own qual:certify:l10 /
   qual:certify:l2 artifacts. QUAL then records the calibration SHA with scripts/qual/perf/record-calibration.mjs.
   From that SHA on, any PR whose fragment rows raise a `max`/`limitBytes`, delete a row (a deletion falls back to the
   looser default), or leave `provisional: true` fails. */

export interface PerfRowLike { subject: string; profile: string; metric: string; max: number | string; provisional?: boolean }
export interface SizeRowLike { id: string; import: string; limitBytes: number; kind: string }
export interface Calibration { sha: string | null; tag?: string; recordedAt?: string; evidence?: { l10: string; l2: string } }

const LETTERS = ['A', 'B', 'C', 'D', 'F'];
const perfKey = (r: PerfRowLike) => `${r.subject}|${r.profile}|${r.metric}`;

/** true when `head` permits more than `base` (numbers: larger; grade letters: worse). */
export function raised(base: number | string, head: number | string): boolean {
  if (typeof base === 'string' || typeof head === 'string') return LETTERS.indexOf(String(head)) > LETTERS.indexOf(String(base));
  return head > base;
}

export function frozenViolations(base: { perf: PerfRowLike[]; size: SizeRowLike[] }, head: { perf: PerfRowLike[]; size: SizeRowLike[] }): string[] {
  const out: string[] = [];
  const hp = new Map(head.perf.map((r) => [perfKey(r), r]));
  for (const b of base.perf) {
    const h = hp.get(perfKey(b));
    if (!h) out.push(`perf-budgets row ${perfKey(b)} (max ${b.max}) deleted after calibration`);
    else if (raised(b.max, h.max)) out.push(`perf-budgets row ${perfKey(b)} raised ${b.max} → ${h.max} after calibration`);
  }
  for (const h of head.perf) if (h.provisional === true) out.push(`perf-budgets row ${perfKey(h)} is still provisional: true after calibration`);
  const hs = new Map(head.size.map((r) => [r.id, r]));
  for (const b of base.size) {
    const h = hs.get(b.id);
    if (!h) out.push(`size-budgets row ${b.id} (${b.limitBytes} B) deleted after calibration`);
    else if (h.limitBytes > b.limitBytes) out.push(`size-budgets row ${b.id} raised ${b.limitBytes} → ${h.limitBytes} B after calibration`);
  }
  return out;
}

/** Calibration-window raise ceiling for one row (D-26). `measured` comes from a QUAL lane artifact, never by hand. */
export function calibrationCeiling(kind: 'bytes' | 'perf', provisional: number, measured: number, factor = 1.1, roundTo = 256): number {
  const raisedTo = kind === 'bytes' ? Math.ceil((measured * factor) / roundTo) * roundTo : Math.ceil(measured * factor * 10) / 10;
  return Math.min(provisional, raisedTo);
}

export function parseCalibration(raw: unknown): Calibration {
  const o = raw as Record<string, unknown> | null;
  if (!o || typeof o !== 'object' || !('sha' in o)) throw new Error('certification/calibration.json must be an object with a `sha` key');
  if (o.sha === null) return { sha: null };
  if (typeof o.sha !== 'string' || !/^[0-9a-f]{40}$/.test(o.sha)) throw new Error('calibration sha must be null or a 40-hex commit sha');
  const ev = o.evidence as Record<string, unknown> | undefined;
  if (!ev || typeof ev.l10 !== 'string' || typeof ev.l2 !== 'string' || !/^https:\/\//.test(ev.l10) || !/^https:\/\//.test(ev.l2)) {
    throw new Error('a recorded calibration needs evidence.{l10,l2} job artifact URLs');
  }
  if (typeof o.tag !== 'string' || !/^v5\.\d+\.\d+-/.test(o.tag)) throw new Error('a recorded calibration needs the pre-release tag (v5.x.y-<pre>)');
  return o as unknown as Calibration;
}

/** Seed markers (contract §6.1): the S-30 seed helper import or the `@ag-contract-seed` banner. */
export const SEED_MARKER_RE = /@ag-contract-seed|from\s+['"][^'"]*contracts\/seed['"]|data-ag-seed/;
