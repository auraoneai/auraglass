#!/usr/bin/env node
/* dist-tag.mjs (REQ-PLAT-14): pure dist-tag policy.
   Library:   distTagFor(version, {v4DistTag, now}) -> 'next'|'latest'|v4DistTag; throws otherwise.
   CLI:       node scripts/release/dist-tag.mjs <version> [--v4-dist-tag t]
              node scripts/release/dist-tag.mjs --check <tag> --line <4x|5x> --v4-dist-tag t
              node scripts/release/dist-tag.mjs --move <tag> --version <v> [--package p]
                [--registry url] [--userconfig f] [--current v] [--dry-run]   (REQ-PLAT-33)
   Rules: pre-release (semver prerelease) -> 'next'; 4.x stable -> 'latest' pre-GA
   else v4DistTag once 5.0 GA exists; 5.x stable -> 'latest'; anything else throws. */
import { execFileSync } from 'node:child_process';

const SEMVER = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/;

export function distTagFor(version, { v4DistTag = 'latest', ga5 = false } = {}) {
  const m = SEMVER.exec(String(version).replace(/^v/, ''));
  if (!m) throw new Error(`dist-tag: not semver: ${version}`);
  const [, major, , , pre] = m.map((x) => x ?? null);
  if (pre) return 'next';
  if (Number(major) === 4) return ga5 ? v4DistTag : 'latest';
  if (Number(major) === 5) return 'latest';
  throw new Error(`dist-tag: no rule for major ${major} (${version})`);
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

// REQ-PLAT-33 runbook S2/S7: a backward 'latest' move (e.g. 5.x -> 4.x) is
// refused unless AG_ROLLBACK_LATEST_TO_4X=true records the human intent.
export function monotonicViolation(tag, version, current, env = process.env) {
  if (tag !== 'latest' || !current) return null;
  const nM = Number(String(version).replace(/^v/, '').split('.')[0]);
  const cM = Number(String(current).replace(/^v/, '').split('.')[0]);
  if (nM < cM && env.AG_ROLLBACK_LATEST_TO_4X !== 'true') {
    return (
      `dist-tag --move: refusing to move 'latest' from ${current} back to ${version} ` +
      `(set AG_ROLLBACK_LATEST_TO_4X=true to record the rollback)`
    );
  }
  return null;
}

// --move <tag> --version <v> [--package p] [--registry url] [--userconfig f]
//        [--current <v>] [--dry-run]
function move(arg, has) {
  const tag = arg('move');
  const version = arg('version');
  const pkg = arg('package') ?? 'aura-glass';
  if (!tag || !version || !SEMVER.test(version.replace(/^v/, ''))) {
    console.error('usage: dist-tag.mjs --move <tag> --version <semver> [--package p] [--registry url]');
    process.exit(2);
  }
  const reg = [];
  if (arg('registry')) reg.push('--registry', arg('registry'));
  if (arg('userconfig')) reg.push('--userconfig', arg('userconfig'));
  let current = arg('current');
  if (!current) {
    try {
      current = execFileSync('npm', ['view', pkg, `dist-tags.${tag}`, ...reg], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
    } catch (e) {
      console.error(`dist-tag --move: registry read failed for ${pkg}: ${e.message}`);
      process.exit(1);
    }
  }
  const v = version.replace(/^v/, '');
  const violation = monotonicViolation(tag, v, current);
  if (violation) {
    console.error(violation);
    process.exit(1);
  }
  const cmd = ['dist-tag', 'add', `${pkg}@${v}`, tag, ...reg];
  if (has('dry-run')) {
    console.log(`dist-tag --move (dry-run): npm ${cmd.join(' ')}`);
    process.exit(0);
  }
  execFileSync('npm', cmd, { stdio: 'inherit' });
  console.log(`dist-tag --move: ${pkg} ${tag} ${current || '(none)'} -> ${v}`);
  process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (n) => {
    const i = process.argv.indexOf(`--${n}`);
    return i >= 0 ? process.argv[i + 1] : null;
  };
  const has = (n) => process.argv.includes(`--${n}`);
  if (arg('move')) move(arg, has);
  const check = arg('check');
  const v4DistTag = arg('v4-dist-tag') ?? process.env.AG_V4_DIST_TAG ?? 'latest';
  const line = arg('line') ?? process.env.AG_LINE ?? '';
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
