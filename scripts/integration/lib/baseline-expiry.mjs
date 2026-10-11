/* PRD-F §4.3 rule 3: an expiring cross-stream baseline row is
   {file, owner, reqFin, expires}. `expires` is either an ISO date
   (YYYY-MM-DD; the row fails the day after) or the milestone 'RC-1' (the RC-1
   date is not fixed yet, so the row fails once the version being built is
   5.0.0-rc.1 or later: AG_RELEASE_VERSION, else a v* CI_COMMIT_TAG, else
   package.json#version). A gate that loads a baseline calls rowProblems() and
   fails on every message it returns. */
import fs from 'node:fs';
import path from 'node:path';

const SEMVER = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

export function currentVersion(root = process.cwd(), env = process.env) {
  if (env.AG_RELEASE_VERSION) return env.AG_RELEASE_VERSION;
  if (env.CI_COMMIT_TAG && SEMVER.test(env.CI_COMMIT_TAG)) return env.CI_COMMIT_TAG.replace(/^v/, '');
  const pkg = path.join(root, 'package.json');
  if (fs.existsSync(pkg)) return JSON.parse(fs.readFileSync(pkg, 'utf8')).version ?? '0.0.0';
  return '0.0.0';
}

/** true when `version` is 5.0.0-rc.1 or any later 5.x prerelease/GA, or ≥ 5.0.1 */
export function atOrAfterRc1(version) {
  const m = SEMVER.exec(String(version));
  if (!m) return false;
  const [maj, min, pat] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (maj !== 5 || min !== 0 || pat !== 0) return maj > 5 || (maj === 5 && (min > 0 || pat > 0));
  const pre = m[4];
  if (!pre) return true;                          // 5.0.0 GA
  const rc = /^rc\.(\d+)/.exec(pre);
  return rc ? Number(rc[1]) >= 1 : false;         // alpha/beta < rc.1
}

/**
 * messages for malformed or expired rows; [] when every row is valid and live
 * @param {unknown} rows parsed baseline JSON
 * @param {{ gate?: string, today?: Date, version?: string }} [opts]
 * @returns {string[]}
 */
export function rowProblems(rows, { gate = 'baseline', today = new Date(), version = currentVersion() } = {}) {
  const out = [];
  if (!Array.isArray(rows)) return [`${gate}: baseline must be a JSON array of {file, owner, reqFin, expires}`];
  const isoToday = today.toISOString().slice(0, 10);
  for (const r of rows) {
    const id = r?.file ?? JSON.stringify(r);
    if (!r || typeof r.file !== 'string' || typeof r.owner !== 'string'
      || typeof r.reqFin !== 'string' || !/^REQ-FIN-/.test(r.reqFin) || typeof r.expires !== 'string') {
      out.push(`${gate}: malformed baseline row ${id} — needs {file, owner, reqFin: 'REQ-FIN-…', expires}`);
      continue;
    }
    if (r.expires === 'RC-1') {
      if (atOrAfterRc1(version)) out.push(`${gate}: expired baseline row ${r.file} (expires RC-1, building ${version}) — ${r.reqFin} (${r.owner}) must fix the file`);
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(r.expires)) {
      if (isoToday > r.expires) out.push(`${gate}: expired baseline row ${r.file} (expires ${r.expires}) — ${r.reqFin} (${r.owner}) must fix the file`);
    } else {
      out.push(`${gate}: baseline row ${r.file} has expires '${r.expires}' — use 'RC-1' or YYYY-MM-DD`);
    }
  }
  return out;
}
