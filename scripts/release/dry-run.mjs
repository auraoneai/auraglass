#!/usr/bin/env node
/* dry-run.mjs --tag <tag> --line <4x|5x> (REQ-PLAT-13, PLAT-038..040).
   Runs inside plat:package:pack on release scope, before npm pack:
   1. tag's version === package.json version and matches a CHANGELOG.md heading;
   2. tag is an ancestor of the line's branch (origin/release/4.x for v4.*,
      origin/next for v5 pre-release, origin/main for v5.x.y);
   3. re-runs classify-change against the previous tag and prints the class;
   4. verifies the release ledger has a row for the tag when the ledger exists;
   5. finishes with `npm publish --dry-run` per package tarball context.
   Exits non-zero on any check failure. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const tag = arg('tag') ?? process.env.CI_COMMIT_TAG ?? '';
const line = arg('line') ?? process.env.AG_LINE ?? '5x';
const git = (a) => execFileSync('git', a, { encoding: 'utf8' }).trim();

const fail = (msg) => {
  console.error(`dry-run FAIL: ${msg}`);
  process.exit(1);
};

if (!/^v\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/.test(tag)) fail(`tag '${tag}' is not a release tag`);
const version = tag.replace(/^v/, '');

// 1. version + changelog
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (pkg.version !== version) fail(`package.json version ${pkg.version} != tag ${version}`);
const changelog = existsSync('CHANGELOG.md') ? readFileSync('CHANGELOG.md', 'utf8') : '';
// the FIRST `## [X.Y.Z]` heading must be this tag's version (REQ-PLAT-13)
const firstHeading = /^##\s*\[(\d+\.\d+\.\d+[^\]]*)\]/m.exec(changelog);
if (!firstHeading || firstHeading[1].replace(/^v/, '') !== version) {
  fail(`CHANGELOG.md first ## [X.Y.Z] heading is ${firstHeading?.[1] ?? 'none'}, not ${version}`);
}
console.log(`dry-run: version ${version} matches package.json and CHANGELOG.md`);

// 2. ancestry
const wantBranch =
  line === '4x' ? 'origin/release/4.x' : /-(alpha|beta|rc)\.\d+$/.test(version) ? 'origin/next' : 'origin/main';
try {
  git(['merge-base', '--is-ancestor', tag, wantBranch]);
} catch {
  fail(`${tag} is not an ancestor of ${wantBranch}`);
}
console.log(`dry-run: ${tag} is an ancestor of ${wantBranch}`);

// 3. re-run classify-change vs previous tag
const tags = git(['tag', '--list', '--sort=-v:refname'])
  .split('\n')
  .filter((t) => t && t !== tag);
const prev = tags.find((t) => t.startsWith(line === '4x' ? 'v4.' : 'v5.')) ?? tags[0] ?? null;
if (existsSync('scripts/release/classify-change.mjs') && prev) {
  try {
    const out = execFileSync('node', ['scripts/release/classify-change.mjs', '--base', prev, '--line', line], {
      encoding: 'utf8',
    }).trim();
    console.log(`dry-run: classify-change vs ${prev}: ${out}`);
  } catch (e) {
    fail(`classify-change against ${prev} failed: ${e.message}`);
  }
} else if (!prev) {
  console.log(`dry-run: no previous tag on this line — skipping classify-change re-run`);
} else {
  console.log(`dry-run: PENDING scripts/release/classify-change.mjs (lane 1c)`);
}

// 4. release ledger row — verify-release-ledger.mjs is the checker (REQ-PLAT-13)
const ledger = 'docs/release/release-ledger.json';
if (existsSync(ledger)) {
  if (existsSync('scripts/release/verify-release-ledger.mjs')) {
    try {
      execFileSync('node', ['scripts/release/verify-release-ledger.mjs', '--tag', tag], {
        stdio: 'inherit', env: { ...process.env, AG_RELEASE_TAG: tag },
      });
    } catch {
      fail(`verify-release-ledger.mjs rejected tag ${tag}`);
    }
  } else {
    const rows = JSON.parse(readFileSync(ledger, 'utf8'));
    const list = Array.isArray(rows) ? rows : (rows.rows ?? []);
    if (!list.some((r) => r.tag === tag || r.version === version)) {
      fail(`release ledger ${ledger} has no row for ${tag}`);
    }
  }
  console.log(`dry-run: release-ledger row for ${tag} present`);
} else {
  console.log(`dry-run: no ${ledger} yet — ledger check skipped (PENDING lane 1c)`);
}

// 5. npm publish --dry-run on the workspace root (the real publish happens in plat:publish:npm)
try {
  execFileSync('npm', ['publish', '--dry-run', '--ignore-scripts', '--access', 'public'], { stdio: 'inherit' });
} catch {
  fail('npm publish --dry-run failed');
}
console.log('dry-run: all tag checks passed');
