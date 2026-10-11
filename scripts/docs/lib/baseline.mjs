/* scripts/docs/lib/baseline.mjs — PRD-F §4.3 rule 3 expiring baselines for the
   REQ-PLAT-102 docs gates. A cross-stream gate lands green with the current
   offenders listed per file in scripts/integration/baselines/<gate>.json
   (FIN-A-owned directory; FIN-C hands the rows over). Rows:
     { "file": "<repo path>", "owner": "PLAT|MAT|CMP|SURF|QUAL", "reqFin": "REQ-FIN-NN", "expires": "RC-1" }
   A row excuses that file's findings until it expires; an expired row, a row
   whose file has no finding any more (stale) and a malformed row are errors,
   so the baseline can only shrink. */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const BASELINE_DIR = 'scripts/integration/baselines';

/** RC-1 rows expire once the package version is a release candidate or GA. */
export function expired(row, version) {
  if (row.expires !== 'RC-1') return true; // unknown expiry = not a valid excuse
  return !/-(alpha|beta)(\.|$)/.test(version);
}

export function loadBaseline(root, gate) {
  const p = join(root, BASELINE_DIR, `${gate}.json`);
  if (!existsSync(p)) return { path: `${BASELINE_DIR}/${gate}.json`, rows: [], present: false };
  const rows = JSON.parse(readFileSync(p, 'utf8'));
  if (!Array.isArray(rows)) throw new Error(`${BASELINE_DIR}/${gate}.json must be an array`);
  return { path: `${BASELINE_DIR}/${gate}.json`, rows, present: true };
}

/**
 * Splits findings ({ file, ... }) into excused and blocking, and returns
 * baseline errors (expired / stale / malformed rows).
 */
export function applyBaseline(findings, rows, version) {
  const errors = [];
  const valid = new Map();
  for (const r of rows) {
    if (!r || typeof r.file !== 'string' || !r.owner || !/^REQ-FIN-\d+$/.test(String(r.reqFin)) || !r.expires) {
      errors.push(`malformed baseline row ${JSON.stringify(r)}`);
    } else if (expired(r, version)) {
      errors.push(`expired baseline row ${r.file} (expires ${r.expires}, version ${version})`);
    } else valid.set(r.file, r);
  }
  const files = new Set(findings.map((f) => f.file));
  for (const r of valid.values()) if (!files.has(r.file)) errors.push(`stale baseline row ${r.file}: no finding left — delete the row`);
  const excused = findings.filter((f) => valid.has(f.file));
  const blocking = findings.filter((f) => !valid.has(f.file));
  return { excused, blocking, errors };
}

/** Version from the root package.json. */
export const packageVersion = (root) => JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
