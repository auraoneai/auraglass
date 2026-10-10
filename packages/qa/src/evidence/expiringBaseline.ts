/* QUAL. Shrink-only expiring baselines for new cross-stream gates (PRD-F §4.3 rule 3).
   A row is { file, owner, reqFin, expires: 'RC-1', ...gate keys }. The gate fails on any new
   offender, on a stale row (its offence is gone — delete the row), on a malformed row, and on
   every row once `expires` is reached. RC-1 is the first release-scope pipeline (the RC tag),
   so rows are expired whenever the scope is 'release'. */
import { readFileSync } from 'node:fs';

export interface BaselineRow { file: string; owner: string; reqFin: string; expires: 'RC-1'; [k: string]: string }
export interface BaselineCheck<O> { fresh: O[]; stale: BaselineRow[]; expired: BaselineRow[]; malformed: unknown[] }

const OWNERS = new Set(['PLAT', 'MAT', 'CMP', 'SURF', 'QUAL', 'CONTRACT']);

export function isBaselineRow(r: unknown): r is BaselineRow {
  if (!r || typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  return typeof o.file === 'string' && !!o.file && typeof o.owner === 'string' && OWNERS.has(o.owner)
    && typeof o.reqFin === 'string' && /^REQ-FIN-\d+$/.test(o.reqFin) && o.expires === 'RC-1'
    && Object.values(o).every((v) => typeof v === 'string');
}

export function readBaseline(path: string): unknown[] {
  const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  if (!Array.isArray(raw)) throw new Error(`baseline ${path} must be a JSON array`);
  return raw;
}

/** `keyOfRow` and `keyOfOffender` must produce the same key for a row that covers an offender. */
export function checkBaseline<O>(rows: unknown[], offenders: readonly O[], keyOfRow: (r: BaselineRow) => string,
  keyOfOffender: (o: O) => string, scope: string | undefined): BaselineCheck<O> {
  const malformed = rows.filter((r) => !isBaselineRow(r));
  const valid = rows.filter(isBaselineRow);
  const rowKeys = new Set(valid.map(keyOfRow));
  const offKeys = new Set(offenders.map(keyOfOffender));
  return {
    fresh: offenders.filter((o) => !rowKeys.has(keyOfOffender(o))),
    stale: valid.filter((r) => !offKeys.has(keyOfRow(r))),
    expired: scope === 'release' ? valid : [],
    malformed,
  };
}

export function baselineFailures<O>(name: string, c: BaselineCheck<O>, describe: (o: O) => string): string[] {
  return [
    ...c.fresh.map((o) => `${name}: new offender ${describe(o)}`),
    ...c.stale.map((r) => `${name}: stale baseline row ${JSON.stringify(r)} — its offence is gone, delete the row`),
    ...c.expired.map((r) => `${name}: baseline row expired at RC-1 ${JSON.stringify(r)}`),
    ...c.malformed.map((r) => `${name}: malformed baseline row ${JSON.stringify(r)}`),
  ];
}
