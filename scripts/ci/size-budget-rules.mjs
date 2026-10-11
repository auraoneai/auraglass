/* scripts/ci/size-budget-rules.mjs — REQ-PLAT-76 pure rules shared by
   verify-size-budgets.mjs and its tests (no top-level await, no I/O, so Jest
   can import it). */

/* Row-id prefix of the compat rows derived in fragments/size-budgets/plat.ts
   (target row + 2048 B). A fragment may only default-export its rows, so the
   prefix is mirrored there. */
export const COMPAT_ROW_PREFIX = 'plat:compat-';

/* Subpaths a PLAT row names that are not yet public entries. Each value names
   the producer; the row reports 'pending' (never 'pass') until the subpath is
   in build/exports.manifest.json, then it is measured like any other row. */
export const AWAITING_PRODUCER = Object.freeze({
  './internal': 'FIN-A REQ-FIN-06: package.json#exports + build/exports.manifest.json row for ./internal (cn, warnDeprecated); handed off from #177',
});

/* PLAT provisional floors (REQ-PLAT-76): a row looser than its floor is
   itself a raise and needs the changelog row + trailer even on a fresh base. */
export const FLOORS = Object.freeze({ 'plat:tailwind-bridge': 6144, 'plat:compat-globals': 1024, 'plat:cn': 512, 'plat:warnDeprecated': 150 });

/** True for the derived compat rows (reported separately; not ratcheted on
   their own because their limit follows the target row). */
export const isCompatRow = (row) => row.id.startsWith(COMPAT_ROW_PREFIX) && !(row.id in FLOORS);

/** Expiring-baseline check (PRD-F §4.3 rule 3) for
   scripts/integration/baselines/size-budgets.json: rows are
   `{ row, owner, reqFin, expires: 'RC-1' }`. PLAT's own floor rows are never
   baselinable; a row for an unknown id or one whose budget now passes is
   stale and must be removed. `results` = the gate's per-row results. */
export function baselineProblems(baseline, results) {
  if (!Array.isArray(baseline)) return ['size-budgets baseline: must be a JSON array'];
  const problems = [];
  const byId = new Map(results.map((r) => [r.id, r]));
  const seen = new Set();
  for (const b of baseline) {
    const ok = b && typeof b.row === 'string' && typeof b.owner === 'string' && typeof b.reqFin === 'string' && b.expires === 'RC-1';
    if (!ok) { problems.push(`size-budgets baseline: malformed row ${JSON.stringify(b)}`); continue; }
    if (seen.has(b.row)) problems.push(`size-budgets baseline: duplicate row ${b.row}`);
    seen.add(b.row);
    if (b.row in FLOORS) { problems.push(`size-budgets baseline: ${b.row} is a PLAT floor row and cannot be baselined`); continue; }
    const r = byId.get(b.row);
    if (!r) problems.push(`size-budgets baseline: stale row ${b.row} (no such budget row)`);
    else if (r.status === 'pass') problems.push(`size-budgets baseline: stale row ${b.row} (now passes — remove it)`);
  }
  return problems;
}

/** Ratchet — a row may be stricter than its base limit, never looser without
   'Perf-Budget-Raise: <id>' in an MR commit message AND the changelog. */
export function ratchetProblems(rows, baseRows, commitMessages, changelogText) {
  const problems = [];
  for (const row of rows) {
    if (isCompatRow(row)) continue;
    const base = baseRows?.get(row.id);
    const floor = FLOORS[row.id];
    const baseLimit = base ? Math.min(base.limitBytes, floor ?? base.limitBytes) : floor;
    if (baseLimit === undefined || row.limitBytes <= baseLimit) continue;
    const trailer = `Perf-Budget-Raise: ${row.id}`;
    const from = base?.limitBytes ?? `floor ${floor}`;
    if (!commitMessages.includes(trailer)) problems.push(`${row.id}: limit raised ${from} -> ${row.limitBytes} without '${trailer}' in an MR commit message`);
    if (!changelogText.includes(trailer)) problems.push(`${row.id}: limit raised ${from} -> ${row.limitBytes} without a docs/size-budgets.changelog.md row`);
  }
  return problems;
}
