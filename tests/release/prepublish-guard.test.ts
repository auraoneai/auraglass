/* @jest-environment node */
// REQ-PLAT-12 / AC-PLAT-03: require-ci-publish.js exits 1 outside plat:publish:npm.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';

const S = 'scripts/ci/require-ci-publish.js';
const run = (env: Record<string, string>) => {
  try {
    execFileSync('node', [S], { env: { ...process.env, ...env }, encoding: 'utf8' });
    return 0;
  } catch (e: any) {
    return e.status ?? 1;
  }
};

describe('require-ci-publish guard', () => {
  it('fails on a laptop (no GitLab env)', () => {
    expect(run({ GITLAB_CI: undefined as any })).toBe(1);
  });
  it('fails in the wrong job', () => {
    expect(run({ GITLAB_CI: 'true', CI_PROJECT_ID: '87152036', CI_JOB_NAME: 'plat:package:pack',
      CI_COMMIT_TAG: 'v4.1.1', NPM_ID_TOKEN: 'x' })).toBe(1);
  });
  it('fails on a non-release tag', () => {
    expect(run({ GITLAB_CI: 'true', CI_PROJECT_ID: '87152036', CI_JOB_NAME: 'plat:publish:npm',
      CI_COMMIT_TAG: 'v4.1.1-alpha', NPM_ID_TOKEN: 'x' })).toBe(1);
  });
  it('fails without NPM_ID_TOKEN', () => {
    expect(run({ GITLAB_CI: 'true', CI_PROJECT_ID: '87152036', CI_JOB_NAME: 'plat:publish:npm',
      CI_COMMIT_TAG: 'v4.1.1' })).toBe(1);
  });
  it('passes inside plat:publish:npm on a release tag', () => {
    expect(run({ GITLAB_CI: 'true', CI_PROJECT_ID: '87152036', CI_JOB_NAME: 'plat:publish:npm',
      CI_COMMIT_TAG: 'v4.1.1', NPM_ID_TOKEN: 'token' })).toBe(0);
  });
});

describe('REQ-FIN-31 guard hardening', () => {
  it('fails inside GitHub Actions even when names match', () => {
    expect(run({ GITHUB_ACTIONS: 'true', GITLAB_CI: 'true', CI_PROJECT_ID: '87152036',
      CI_JOB_NAME: 'plat:publish:npm', CI_COMMIT_TAG: 'v4.1.1', NPM_ID_TOKEN: 'x' })).toBe(1);
  });
  it('fails on a branch pipeline (no tag)', () => {
    expect(run({ GITLAB_CI: 'true', CI_PROJECT_ID: '87152036', CI_JOB_NAME: 'plat:publish:npm',
      CI_COMMIT_TAG: undefined as any, NPM_ID_TOKEN: 'x' })).toBe(1);
  });
  it('prepublishOnly runs the guard FIRST, at an existing path, in every PLAT-published package', () => {
    // Package set from contracts/packages.json; `@auraglass/labs` is SURF-owned
    // (contract F02) and its guard is asserted by REQ-FIN-87's labs tests.
    const { readFileSync, existsSync } = require('node:fs');
    const { join, resolve } = require('node:path');
    const contract = JSON.parse(readFileSync('contracts/packages.json', 'utf8'));
    const rows = Object.entries(contract.packages as Record<string, any>)
      .filter(([, p]) => p.published === true && p.owner === 'PLAT' && existsSync(join(p.dir, 'package.json')));
    expect(rows.map(([n]) => n).sort()).toEqual(['@auraglass/cli', '@auraglass/mcp', '@auraglass/registry', 'aura-glass']);
    for (const [name, p] of rows) {
      const d = JSON.parse(readFileSync(join(p.dir, 'package.json'), 'utf8'));
      const first = (d.scripts?.prepublishOnly ?? '').split('&&')[0].trim();
      const m = /^node (\S+require-ci-publish\.js)$/.exec(first);
      expect({ name, first, guard: m ? existsSync(resolve(p.dir, m[1])) : false })
        .toEqual({ name, first, guard: true });
    }
  });
  it('root prepublishOnly = guard && prepublish:verify (REQ-PLAT-38 split)', () => {
    const d = JSON.parse(require('node:fs').readFileSync('package.json', 'utf8'));
    expect(d.scripts.prepublishOnly).toBe('node scripts/ci/require-ci-publish.js && npm run prepublish:verify');
    expect(d.scripts['prepublish:verify']).toMatch(/^npm run build && npm run pack:verify && /);
    expect(d.scripts['prepublish:verify']).not.toContain('require-ci-publish');
    expect(d.scripts.release).toBeUndefined();
    expect(d.scripts['release:dry-run']).toBeUndefined();
  });
});
