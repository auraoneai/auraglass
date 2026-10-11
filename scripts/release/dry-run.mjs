#!/usr/bin/env node
/* dry-run.mjs --tag <tag> --line <4x|5x> (REQ-PLAT-13, PLAT-038..040).
   Runs inside plat:package:pack on release scope, after the build:
   1. the tag's version === package.json version === the FIRST `## [X.Y.Z]`
      heading of CHANGELOG.md;
   2. the tagged commit is an ancestor of its line's branch — release/4.1.x for
      v4.1.* (OD-13), release/4.x for other v4.*, next for v5 pre-releases, main
      for v5.x.y (override: --branch / AG_RELEASE_BRANCH). The branch is fetched
      first (`git fetch --no-tags origin +refs/heads/<b>:refs/remotes/origin/<b>`,
      unshallowing a shallow CI clone), because a tag pipeline has no branch refs;
   3. scripts/release/classify-change.mjs re-runs against the previous tag on the
      same line (same major, semver-lower); a missing classifier is a failure;
   4. the release ledger (scripts/release/verify-release-ledger.mjs, REQ-PLAT-31)
      agrees for every version >= 4.1.1 except this tag's own version, whose npm
      version and GitLab Release are produced later by this pipeline;
   5. `npm publish --dry-run --ignore-scripts` (the lifecycle scripts already ran
      in this job; running prepublishOnly here would trip require-ci-publish.js).
   Exits 1 on any failure. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cmpSemver, parseSemver } from './dist-tag.mjs';

export const TAG_RE = /^v\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/;

export function lineBranch(version) {
  const p = parseSemver(version);
  if (!p) return null;
  if (p.major === 4) return p.minor === 1 ? 'release/4.1.x' : 'release/4.x';
  if (p.major === 5) return p.pre.length ? 'next' : 'main';
  return null;
}

export function firstChangelogHeading(text) {
  const m = /^##\s*\[([^\]]+)\]/m.exec(text);
  return m ? m[1].trim().replace(/^v/, '') : null;
}

export function previousTag(tags, tag) {
  const cur = parseSemver(tag);
  return (
    tags
      .filter((t) => TAG_RE.test(t) && t !== tag)
      .filter((t) => parseSemver(t).major === cur.major && cmpSemver(t, tag) < 0)
      .sort((a, b) => cmpSemver(b, a))[0] ?? null
  );
}

export async function main(argv = process.argv.slice(2), { root = process.cwd() } = {}) {
  const arg = (n) => {
    const i = argv.indexOf(`--${n}`);
    return i >= 0 ? argv[i + 1] : null;
  };
  const tag = arg('tag') ?? process.env.CI_COMMIT_TAG ?? '';
  const line = arg('line') ?? process.env.AG_LINE ?? '5x';
  const git = (a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const fail = (msg) => {
    throw new Error(msg);
  };

  if (!TAG_RE.test(tag)) fail(`tag '${tag}' is not a release tag`);
  const version = tag.replace(/^v/, '');

  // 1. version + changelog
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  if (pkg.version !== version) fail(`package.json version ${pkg.version} != tag ${version}`);
  const changelogPath = resolve(root, 'CHANGELOG.md');
  const first = existsSync(changelogPath) ? firstChangelogHeading(readFileSync(changelogPath, 'utf8')) : null;
  if (first !== version) fail(`CHANGELOG.md first ## [X.Y.Z] heading is ${first ?? 'none'}, not ${version}`);
  console.log(`dry-run: version ${version} matches package.json and the first CHANGELOG.md heading`);

  // 2. ancestry
  const branch = arg('branch') || process.env.AG_RELEASE_BRANCH || lineBranch(version);
  if (!branch) fail(`no release branch for ${tag}`);
  const fetchArgs = ['fetch', '--no-tags'];
  try {
    if (git(['rev-parse', '--is-shallow-repository']) === 'true') fetchArgs.push('--unshallow');
  } catch {
    /* old git: no shallow flag */
  }
  fetchArgs.push('origin', `+refs/heads/${branch}:refs/remotes/origin/${branch}`);
  try {
    git(fetchArgs);
  } catch (e) {
    fail(`git ${fetchArgs.join(' ')} failed: ${String(e.stderr ?? e.message).trim()}`);
  }
  try {
    git(['merge-base', '--is-ancestor', `${tag}^{commit}`, `origin/${branch}`]);
  } catch {
    fail(`${tag} is not an ancestor of origin/${branch}`);
  }
  console.log(`dry-run: ${tag} is an ancestor of origin/${branch}`);

  // 3. classify-change vs the previous tag on the same line
  const prev = previousTag(git(['tag', '--list', 'v*']).split('\n').filter(Boolean), tag);
  if (prev) {
    if (!existsSync(resolve(root, 'scripts/release/classify-change.mjs'))) {
      fail('scripts/release/classify-change.mjs missing — cannot re-run the change class against the previous tag');
    }
    try {
      const out = execFileSync('node', ['scripts/release/classify-change.mjs', '--base', prev, '--line', line], {
        cwd: root,
        encoding: 'utf8',
      }).trim();
      console.log(`dry-run: classify-change vs ${prev}: ${out}`);
    } catch (e) {
      fail(`classify-change against ${prev} failed: ${String(e.stderr || e.stdout || e.message).trim()}`);
    }
  } else {
    console.log(`dry-run: ${tag} is the first release tag of major ${parseSemver(version).major} — no previous tag to classify against`);
  }

  // 4. release ledger (REQ-PLAT-31)
  const ledgerScript = resolve(root, 'scripts/release/verify-release-ledger.mjs');
  if (!existsSync(ledgerScript)) fail('scripts/release/verify-release-ledger.mjs missing');
  const ledger = await import(pathToFileURL(ledgerScript).href);
  const correctionsPath = resolve(root, 'docs/release/ledger-corrections.json');
  const corrections = existsSync(correctionsPath)
    ? (JSON.parse(readFileSync(correctionsPath, 'utf8')).corrections ?? [])
    : [];
  const live = await ledger.collectLive({ root });
  const without = (a) => (a == null ? a : a.filter((v) => v !== version));
  const { errors, records } = ledger.ledgerCheck(
    {
      changelog: without(live.changelog),
      tags: without(live.tags),
      gitlab: without(live.gitlab),
      npm: without(live.npm),
      github: without(live.github),
    },
    { cut: '4.1.1', corrections },
  );
  for (const r of records) console.log(`dry-run: ledger ${r}`);
  if (errors.length) fail(`release ledger disagrees:\n  ${errors.join('\n  ')}`);
  console.log('dry-run: release ledger agrees for every earlier version >= 4.1.1');

  // 5. npm publish --dry-run on the root package (npm 11 requires an explicit --tag
  // for a pre-release; the real dist-tag is derived in publish.mjs)
  const dryTag = parseSemver(version).pre.length ? 'next' : 'latest';
  try {
    execFileSync('npm', ['publish', '--dry-run', '--ignore-scripts', '--access', 'public', '--tag', dryTag], {
      cwd: root,
      stdio: 'inherit',
    });
  } catch {
    fail('npm publish --dry-run --ignore-scripts failed');
  }
  console.log('dry-run: all tag checks passed');
  return 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().then(
    (c) => process.exit(c),
    (e) => {
      console.error(`dry-run FAIL: ${e.message}`);
      process.exit(1);
    },
  );
}
