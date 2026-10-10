/* @jest-environment node */
// REQ-PLAT-13: scripts/release/dry-run.mjs run for real in a temp git repo with
// a bare `origin`, a stub `npm` on PATH, a stub classifier and the real
// ledgerCheck over fixture ledger sources.
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'yaml';

const ROOT = process.cwd();
const DRY_RUN = join(ROOT, 'scripts/release/dry-run.mjs');

const GIT_ENV = {
  GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid',
  GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid',
  GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null',
};

type Opts = {
  version?: string; // package.json version
  changelog?: string;
  tag?: string;
  prevTags?: string[]; // tags created on the base commit
  branch?: string; // branch pushed to origin
  tagOffBranch?: boolean; // tag a commit that never reaches origin/<branch>
  classifier?: 'ok' | 'fail' | 'absent';
  ledger?: { changelog: string[]; tags: string[]; gitlab: string[]; npm: string[]; github: null | string[] };
};

function repo(o: Opts = {}) {
  const tag = o.tag ?? 'v5.0.0-alpha.1';
  const version = o.version ?? tag.slice(1);
  const branch = o.branch ?? 'next';
  const base = mkdtempSync(join(tmpdir(), 'ag-dryrun-'));
  const work = join(base, 'work');
  const origin = join(base, 'origin.git');
  const git = (cwd: string, ...a: string[]) =>
    execFileSync('git', a, { cwd, encoding: 'utf8', env: { ...process.env, ...GIT_ENV } }).trim();
  mkdirSync(work);
  execFileSync('git', ['init', '-q', '--bare', origin], { env: { ...process.env, ...GIT_ENV } });
  git(work, 'init', '-q', '-b', branch);
  git(work, 'remote', 'add', 'origin', origin);

  mkdirSync(join(work, 'scripts/release'), { recursive: true });
  mkdirSync(join(work, 'bin'));
  writeFileSync(join(work, 'README.md'), 'base\n');
  git(work, 'add', '-A');
  git(work, 'commit', '-q', '-m', 'base');
  for (const t of o.prevTags ?? []) git(work, 'tag', t);

  writeFileSync(join(work, 'package.json'), JSON.stringify({ name: 'aura-glass', version }));
  writeFileSync(join(work, 'CHANGELOG.md'), o.changelog ?? `# Changelog\n\n## [${version}] - 2026-10-10\n\n- x\n\n## [4.1.0] - 2026-09-05\n`);
  if ((o.classifier ?? 'ok') !== 'absent') {
    writeFileSync(
      join(work, 'scripts/release/classify-change.mjs'),
      `import { appendFileSync } from 'node:fs';
appendFileSync(process.env.AG_TEST_LOG, JSON.stringify(['classify', ...process.argv.slice(2)]) + '\\n');
${o.classifier === 'fail' ? "console.error('C-B not allowed on 5x'); process.exit(1);" : "console.log('C-E');"}
`,
    );
  }
  writeFileSync(
    join(work, 'scripts/release/verify-release-ledger.mjs'),
    `export { ledgerCheck } from ${JSON.stringify(join(ROOT, 'scripts/release/verify-release-ledger.mjs'))};
export async function collectLive() { return JSON.parse(process.env.AG_TEST_LEDGER); }
`,
  );
  writeFileSync(
    join(work, 'bin/npm'),
    `#!/bin/sh\nprintf '%s\\n' "npm $*" >> "$AG_TEST_LOG"\nexit 0\n`,
  );
  chmodSync(join(work, 'bin/npm'), 0o755);
  git(work, 'add', '-A');
  git(work, 'commit', '-q', '-m', `release ${version}`);
  if (o.tagOffBranch) {
    git(work, 'push', '-q', 'origin', `HEAD:refs/heads/${branch}`);
    writeFileSync(join(work, 'README.md'), 'side\n');
    git(work, 'commit', '-q', '-am', 'side commit, never pushed');
    git(work, 'tag', tag);
  } else {
    git(work, 'tag', tag);
    git(work, 'push', '-q', 'origin', `HEAD:refs/heads/${branch}`);
  }
  // the tag pipeline checkout has no remote-tracking branch refs
  git(work, 'update-ref', '-d', `refs/remotes/origin/${branch}`);

  const ledger = o.ledger ?? { changelog: [version, '4.1.0'], tags: [version, '4.1.0'], gitlab: ['4.1.0'], npm: ['4.1.0'], github: null };
  const log = join(base, 'log.txt');
  const r = spawnSync('node', [DRY_RUN, '--tag', tag, '--line', tag.startsWith('v4.') ? '4x' : '5x'], {
    cwd: work,
    encoding: 'utf8',
    env: {
      ...process.env,
      ...GIT_ENV,
      PATH: `${join(work, 'bin')}:${process.env.PATH}`,
      AG_TEST_LOG: log,
      AG_TEST_LEDGER: JSON.stringify(ledger),
      AG_RELEASE_BRANCH: '',
    },
  });
  const lines = existsSync(log) ? readFileSync(log, 'utf8').trim().split('\n').filter(Boolean) : [];
  return {
    code: r.status,
    out: `${r.stdout}${r.stderr}`,
    npm: lines.filter((l) => l.startsWith('npm ')),
    classify: lines.filter((l) => l.startsWith('[')).map((l) => JSON.parse(l)),
  };
}

describe('dry-run.mjs in a temp repo (REQ-PLAT-13)', () => {
  it('all checks pass: fetches the branch, classifies vs the previous same-line tag, dry-runs npm', () => {
    const r = repo({ prevTags: ['v4.9.0', 'v5.0.0-alpha.0'] });
    expect(r.out).toContain('dry-run: all tag checks passed');
    expect(r.code).toBe(0);
    expect(r.out).toContain('is an ancestor of origin/next');
    expect(r.classify).toEqual([['classify', '--base', 'v5.0.0-alpha.0', '--line', '5x']]);
    expect(r.npm).toEqual(['npm publish --dry-run --ignore-scripts --access public --tag next']);
  });

  it('tag != package.json version -> exit 1', () => {
    const r = repo({ version: '5.0.0-alpha.2' });
    expect(r.code).toBe(1);
    expect(r.out).toContain('package.json version 5.0.0-alpha.2 != tag 5.0.0-alpha.1');
  });

  it('the FIRST ## [X.Y.Z] heading must be the tag (a later matching heading does not count)', () => {
    const r = repo({ changelog: '# Changelog\n\n## [Unreleased]\n\n## [5.0.0-alpha.1]\n' });
    expect(r.code).toBe(1);
    expect(r.out).toContain('first ## [X.Y.Z] heading is Unreleased, not 5.0.0-alpha.1');
  });

  it('a tag that is not an ancestor of its line branch -> exit 1', () => {
    const r = repo({ tagOffBranch: true });
    expect(r.code).toBe(1);
    expect(r.out).toContain('v5.0.0-alpha.1 is not an ancestor of origin/next');
    expect(r.npm).toEqual([]);
  });

  it('v4.1.* is checked against release/4.1.x (OD-13), other v4.* against release/4.x', () => {
    const ok = repo({ tag: 'v4.1.1', branch: 'release/4.1.x', prevTags: ['v4.1.0'] });
    expect(ok.out).toContain('is an ancestor of origin/release/4.1.x');
    expect(ok.code).toBe(0);
    expect(ok.classify).toEqual([['classify', '--base', 'v4.1.0', '--line', '4x']]);
    const wrong = repo({ tag: 'v4.2.0', branch: 'release/4.1.x' });
    expect(wrong.code).toBe(1);
    expect(wrong.out).toContain('refs/heads/release/4.x');
  });

  it('a failing change-class re-run -> exit 1', () => {
    const r = repo({ prevTags: ['v5.0.0-alpha.0'], classifier: 'fail' });
    expect(r.code).toBe(1);
    expect(r.out).toContain('classify-change against v5.0.0-alpha.0 failed: C-B not allowed on 5x');
  });

  it('a missing classifier with a previous tag -> exit 1 (no PENDING pass)', () => {
    const r = repo({ prevTags: ['v5.0.0-alpha.0'], classifier: 'absent' });
    expect(r.code).toBe(1);
    expect(r.out).toContain('classify-change.mjs missing');
  });

  it('a ledger disagreement on an earlier >= 4.1.1 version -> exit 1', () => {
    const r = repo({
      ledger: {
        changelog: ['5.0.0-alpha.1', '5.0.0-alpha.0', '4.1.1'],
        tags: ['5.0.0-alpha.1', '5.0.0-alpha.0', '4.1.1'],
        gitlab: ['5.0.0-alpha.0', '4.1.1'],
        npm: ['4.1.1'],
        github: null,
      },
    });
    expect(r.code).toBe(1);
    expect(r.out).toContain('5.0.0-alpha.0: missing from npm');
    expect(r.npm).toEqual([]);
  });

  it("the tag's own version may be absent from npm and the GitLab Release (produced later by this pipeline)", () => {
    const r = repo({
      ledger: { changelog: ['5.0.0-alpha.1'], tags: ['5.0.0-alpha.1'], gitlab: [], npm: [], github: null },
    });
    expect(r.code).toBe(0);
  });

  it('a non-release tag -> exit 1', () => {
    const r = repo({ tag: 'v5.0.0-preview' });
    expect(r.code).toBe(1);
    expect(r.out).toContain("tag 'v5.0.0-preview' is not a release tag");
  });
});

describe('tag pipeline wiring', () => {
  it('plat:package:pack runs dry-run.mjs --tag on release scope', () => {
    const doc = yaml.parse(readFileSync('ci/plat.gitlab-ci.yml', 'utf8'));
    const s = yaml.stringify(doc['plat:package:pack'].script);
    expect(s).toContain('$AG_SCOPE" = "release"');
    expect(s).toContain('dry-run.mjs --tag "$CI_COMMIT_TAG"');
  });
});
