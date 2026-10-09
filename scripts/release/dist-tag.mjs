#!/usr/bin/env node
/* dist-tag.mjs (REQ-PLAT-14): pure dist-tag policy.
   Library:   distTagFor(version, {v4DistTag, now}) -> 'next'|'latest'|v4DistTag; throws otherwise.
   CLI:       node scripts/release/dist-tag.mjs <version> [--v4-dist-tag t]
              node scripts/release/dist-tag.mjs --check <tag> --line <4x|5x> --v4-dist-tag t
   Rules: pre-release (semver prerelease) -> 'next'; 4.x stable -> 'latest' pre-GA
   else v4DistTag once 5.0 GA exists; 5.x stable -> 'latest'; anything else throws. */
import { execFileSync } from 'node:child_process';

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

export function distTagFor(version, { v4DistTag = 'latest', ga = false, rollback = false, ga5 } = {}) {
  const gaFlag = ga || ga5;
  const m = SEMVER.exec(String(version).replace(/^v/, ''));
  if (!m) throw new Error(`dist-tag: not semver: ${version}`);
  const [, major, , , pre] = m.map((x) => x ?? null);
  if (pre) return 'next';
  if (Number(major) === 4) {
    // rollback: explicitly moving latest back to 4.x after a bad 5.x (AG_ROLLBACK_LATEST_TO_4X)
    if (rollback) return 'latest';
    return gaFlag ? v4DistTag : 'latest';
  }
  if (Number(major) === 5) return 'latest';
  throw new Error(`dist-tag: no rule for major ${major} (${version})`);
}

// Full semver compare (major.minor.patch, prerelease < stable of same tuple).
export function cmpSemver(a, b) {
  const pa = SEMVER.exec(String(a).replace(/^v/, ''));
  const pb = SEMVER.exec(String(b).replace(/^v/, ''));
  if (!pa || !pb) return 0;
  for (let i = 1; i <= 3; i++) {
    const d = Number(pa[i]) - Number(pb[i]);
    if (d) return d < 0 ? -1 : 1;
  }
  if (pa[4] === pb[4]) return 0;
  if (!pa[4]) return 1; // stable > prerelease
  if (!pb[4]) return -1;
  return pa[4] < pb[4] ? -1 : 1;
}

// Monotonic guard (REQ-PLAT-14): a dist-tag may never move to an older version,
// except 'latest' -> 4.x when AG_ROLLBACK_LATEST_TO_4X=true after a bad 5.x.
export function monotonicViolation(tag, newVersion, currentVersion, { rollbackOk = false } = {}) {
  if (!currentVersion) return null;
  if (cmpSemver(newVersion, currentVersion) >= 0) return null;
  if (tag === 'latest' && (rollbackOk || process.env.AG_ROLLBACK_LATEST_TO_4X === 'true')
      && /^4\./.test(newVersion)) return null;
  return `dist-tag '${tag}' would move backward ${currentVersion} -> ${newVersion}` +
    (tag === 'latest' ? ' (set AG_ROLLBACK_LATEST_TO_4X=true for a deliberate 4.x rollback)' : '');
}

// GA marker: a 5.x.y stable already on npm means v4 stables must stop moving 'latest'.
function ga5Published() {
  try {
    const out = execFileSync('npm', ['view', 'aura-glass', 'version'], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return /^5\.\d+\.\d+$/.test(out);
  } catch {
    return false;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (n) => {
    const i = process.argv.indexOf(`--${n}`);
    return i >= 0 ? process.argv[i + 1] : null;
  };
  const check = arg('check');
  const v4DistTag = arg('v4-dist-tag') ?? process.env.AG_V4_DIST_TAG ?? 'latest';
  const line = arg('line') ?? process.env.AG_LINE ?? '';
  const out = arg('out');
  const ga5 = arg('ga') === 'true' || ga5Published();
  if (check) {
    // verify registry dist-tags agree with policy for this tag
    const version = check.replace(/^v/, '');
    const expected = distTagFor(version, { v4DistTag, ga5 });
    let actual;
    try {
      const tags = execFileSync('npm', ['dist-tag', 'list', 'aura-glass', '--json'], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      const map = JSON.parse(tags);
      actual = Object.entries(map).find(([, v]) => v === version)?.[0] ?? null;
    } catch (e) {
      console.error(`dist-tag --check: registry read failed: ${e.message}`);
      process.exit(1);
    }
    if (actual !== expected) {
      console.error(
        `dist-tag --check FAIL: ${version} expected '${expected}' (line ${line || 'n/a'}), registry shows '${actual}'`,
      );
      process.exit(1);
    }
    // monotonic guard across latest / v4-lts / next
    for (const t of ['latest', v4DistTag, 'next']) {
      const cur = map[t];
      const isThis = t === expected;
      const nv = isThis ? version : cur;
      const v = monotonicViolation(t, nv, map[t]);
      if (v && isThis) {
        console.error(`dist-tag --check FAIL: ${v}`);
        process.exit(1);
      }
    }
    if (out) {
      const { mkdirSync, writeFileSync } = await import('node:fs');
      mkdirSync(out.split('/').slice(0, -1).join('/') || '.', { recursive: true });
      writeFileSync(out, JSON.stringify({ tag: check, version, line, expected, registry: map }, null, 2) + '\n');
      console.log(`dist-tag --check: wrote ${out}`);
    }
    console.log(`dist-tag --check OK: ${version} -> ${expected}`);
    process.exit(0);
  }
  const version = process.argv[2];
  if (!version || version.startsWith('-')) {
    console.error('usage: dist-tag.mjs <version> [--v4-dist-tag t] [--ga true|false] | --check <tag> ...');
    process.exit(2);
  }
  console.log(distTagFor(version, { v4DistTag, ga5 }));
}
