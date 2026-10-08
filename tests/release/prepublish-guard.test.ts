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
