/* REQ-QUAL-66 determinism, flake and quarantine (QUAL, FIN-425).

   certification/quarantine.json is an array of { cell, issue, expires } (schema certification/schemas/quarantine.schema.json).
   - `cell` is a capture-cell id `<storyId>|<scene>|<engine>|<axes>` (packages/qa/src/matrix, PRD-QUAL §4.3); a Playwright
     test is the cell's when its title is the id followed by ` @engine-<engine>` (environment-visual.spec.ts naming).
   - `issue` links the tracking issue (URL or `#<n>`).
   - `expires` is an ISO date at most QUARANTINE_MAX_DAYS (7) days after the run's date; an expired entry, or one more
     than 7 days out, fails every lane run until it is removed.
   A failing test whose cell is quarantined is reported `quarantined` (not `pass`, not `fail`) at pr/main/nightly. At
   release scope it is `fail`, and any active quarantine entry fails the run: no release SHA carries a quarantined cell.

   Nightly runs L7 twice on the same SHA; ≥ DETERMINISM_MIN_AGREEMENT (99.9 %) of the cells must agree between the two
   runs (agreementOf). */

import { parseCellId } from '../matrix/axes.ts';

export const QUARANTINE_FILE = 'certification/quarantine.json';
export const QUARANTINE_MAX_DAYS = 7;
export const DETERMINISM_MIN_AGREEMENT = 0.999;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface QuarantineEntry { cell: string; issue: string; expires: string }
export interface QuarantineProblem { index: number; cell: string | null; code: 'shape' | 'cell' | 'issue' | 'expires-format' | 'expired' | 'too-long' | 'duplicate'; message: string }

/** A real capture-cell id (parseCellId throws on any malformed or unknown axis). */
function validCell(id: string): boolean {
  try { parseCellId(id); return true; } catch { return false; }
}
const ISSUE_RE = /^(https:\/\/\S+|#\d+)$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/;

/** End of the `expires` day (UTC) for a date-only value; the instant itself otherwise. */
function expiryMs(expires: string): number {
  return /^\d{4}-\d{2}-\d{2}$/.test(expires) ? Date.parse(`${expires}T23:59:59.999Z`) : Date.parse(expires);
}

/** Validates the parsed quarantine file at `now`. Every problem fails the run (fail closed). */
export function validateQuarantine(value: unknown, now: Date): QuarantineProblem[] {
  if (!Array.isArray(value)) return [{ index: -1, cell: null, code: 'shape', message: `${QUARANTINE_FILE} must be a JSON array` }];
  const problems: QuarantineProblem[] = [];
  const seen = new Set<string>();
  value.forEach((raw, index) => {
    const e = raw as Partial<QuarantineEntry> | null;
    if (!e || typeof e !== 'object' || Array.isArray(e)) { problems.push({ index, cell: null, code: 'shape', message: `entry ${index} is not an object` }); return; }
    const extra = Object.keys(e).filter((k) => !['cell', 'issue', 'expires'].includes(k));
    if (extra.length) problems.push({ index, cell: e.cell ?? null, code: 'shape', message: `entry ${index} has unknown key(s) ${extra.join(', ')} (allowed: cell, issue, expires)` });
    const cell = typeof e.cell === 'string' ? e.cell : null;
    if (!cell || !validCell(cell)) problems.push({ index, cell, code: 'cell', message: `entry ${index}: cell must be a capture-cell id <storyId>|<scene>|<engine>|<axes> (got ${JSON.stringify(e.cell)})` });
    else if (seen.has(cell)) problems.push({ index, cell, code: 'duplicate', message: `entry ${index}: cell ${cell} is quarantined twice` });
    if (cell) seen.add(cell);
    if (typeof e.issue !== 'string' || !ISSUE_RE.test(e.issue)) problems.push({ index, cell, code: 'issue', message: `entry ${index}: issue must be an issue URL or #<n> (got ${JSON.stringify(e.issue)})` });
    if (typeof e.expires !== 'string' || !DATE_RE.test(e.expires) || Number.isNaN(expiryMs(e.expires))) {
      problems.push({ index, cell, code: 'expires-format', message: `entry ${index}: expires must be an ISO date (got ${JSON.stringify(e.expires)})` });
      return;
    }
    const at = expiryMs(e.expires);
    if (at < now.getTime()) problems.push({ index, cell, code: 'expired', message: `entry ${index}: quarantine of ${cell} expired ${e.expires} — fix the cell or remove the entry` });
    else if (at - now.getTime() > QUARANTINE_MAX_DAYS * DAY_MS) {
      problems.push({ index, cell, code: 'too-long', message: `entry ${index}: quarantine of ${cell} expires ${e.expires}, more than ${QUARANTINE_MAX_DAYS} days out` });
    }
  });
  return problems;
}

/** Cell id of a Playwright test title (`<cell id> @engine-<engine>`), or null for non-cell tests. */
export function cellOfTitle(title: string): string | null {
  const m = /^(\S+\|\S+\|(chromium|webkit|firefox)\|\S+) @engine-(chromium|webkit|firefox)\b/.exec(title);
  return m ? m[1]! : null;
}

export interface FailingTest { title: string; file?: string }

/** Splits failing tests into quarantined (cell listed) and the rest. */
export function partitionQuarantined<T extends FailingTest>(failing: readonly T[], entries: readonly QuarantineEntry[]): { quarantined: T[]; other: T[] } {
  const cells = new Set(entries.map((e) => e.cell));
  const quarantined: T[] = [];
  const other: T[] = [];
  for (const t of failing) {
    const cell = cellOfTitle(t.title);
    (cell && cells.has(cell) ? quarantined : other).push(t);
  }
  return { quarantined, other };
}

// ---------------------------------------------------------------- nightly double run (L7)

export type Outcome = 'passed' | 'failed' | 'skipped';
export interface Agreement { cells: number; agreeing: number; ratio: number; disagreements: Array<{ id: string; first: Outcome | 'missing'; second: Outcome | 'missing' }>; ok: boolean }

/** Agreement of two runs over the union of their test ids. A test present in one run only disagrees. 0 tests = not ok
    (an empty double run proves nothing). */
export function agreementOf(first: ReadonlyMap<string, Outcome>, second: ReadonlyMap<string, Outcome>, min = DETERMINISM_MIN_AGREEMENT): Agreement {
  const ids = [...new Set([...first.keys(), ...second.keys()])].sort();
  const disagreements: Agreement['disagreements'] = [];
  for (const id of ids) {
    const a = first.get(id) ?? 'missing';
    const b = second.get(id) ?? 'missing';
    if (a !== b) disagreements.push({ id, first: a, second: b });
  }
  const agreeing = ids.length - disagreements.length;
  const ratio = ids.length ? agreeing / ids.length : 0;
  return { cells: ids.length, agreeing, ratio, disagreements, ok: ids.length > 0 && ratio >= min };
}

interface PwTest { projectName?: string; status?: string; results?: Array<{ status?: string }> }
interface PwSpec { title?: string; file?: string; tests?: PwTest[] }
interface PwSuite { title?: string; file?: string; specs?: PwSpec[]; suites?: PwSuite[] }

/** Per-test outcome of a Playwright JSON report, keyed `<project>|<file>|<title>`. A retried-then-passed (`flaky`)
    test counts as `failed`: determinism compares first-attempt behaviour, so a flake is a disagreement candidate. */
export function playwrightOutcomes(report: { suites?: PwSuite[] }): Map<string, Outcome> {
  const out = new Map<string, Outcome>();
  const walk = (suite: PwSuite) => {
    for (const spec of suite.specs ?? []) for (const t of spec.tests ?? []) {
      const key = `${t.projectName ?? ''}|${spec.file ?? suite.file ?? ''}|${spec.title ?? ''}`;
      out.set(key, t.status === 'skipped' ? 'skipped' : t.status === 'expected' ? 'passed' : 'failed');
    }
    for (const s of suite.suites ?? []) walk(s);
  };
  for (const s of report.suites ?? []) walk(s);
  return out;
}
