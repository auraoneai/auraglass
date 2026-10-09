/* @jest-environment node */
// REQ-FIN-25 (PLAT-017): verify-branch-protection.mjs with a mocked `gh` —
// url-encodes release/4.x, enforces required_approving_review_count >= 1,
// reports per-branch failures, checks the status context when --od9.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chmodSync } from 'node:fs';

const SCRIPT = join(process.cwd(), 'scripts/ci/verify-branch-protection.mjs');

/* Stubs `gh api repos/<r>/branches/<encoded>/protection`: OK for main/next/4.x
   (review count 1), review count 0 for release/4.1.x, 404 for anything else.
   Asserts the encoded path appears. */
function stubGh({ contexts = [] as string[] } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'ghstub-'));
  const log = join(dir, 'log');
  writeFileSync(
    join(dir, 'gh'),
    `#!/bin/sh
echo "$*" >> "${log}"
case "$2" in
  *release%2F4.1.x/protection) echo '{"required_pull_request_reviews":{"required_approving_review_count":0},"required_status_checks":{"contexts":${JSON.stringify(contexts)}}}' ;;
  *release%2F4.x/protection|*main/protection|*next/protection) echo '{"required_pull_request_reviews":{"required_approving_review_count":1},"required_status_checks":{"contexts":${JSON.stringify(contexts)}}}' ;;
  *) exit 1 ;;
esac
`,
  );
  chmodSync(join(dir, 'gh'), 0o755);
  return { dir, log, env: { PATH: `${dir}:${process.env.PATH}` } };
}

const run = (env: NodeJS.ProcessEnv, ...args: string[]) => {
  try {
    const out = execFileSync('node', [SCRIPT, ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('verify-branch-protection.mjs (mocked gh)', () => {
  it('fails the branch with required_approving_review_count 0 and names it', () => {
    const { env } = stubGh();
    const r = run(env);
    expect(r.code).toBe(1);
    expect(r.out).toContain('release/4.1.x');
    expect(r.out).toContain('required_approving_review_count < 1');
    expect(r.out).toContain('branch-protection OK    main');
  });

  it('URL-encodes release/4.x in the api path', () => {
    const { env, log } = stubGh();
    run(env);
    expect(require('node:fs').readFileSync(log, 'utf8')).toContain('release%2F4.x');
  });

  it('passes when every checked branch is protected', () => {
    const { env } = stubGh();
    const r = run(env, '--branch', 'main,next,release/4.x');
    expect(r.code).toBe(0);
    expect(r.out).toContain('3/3 branches verified');
  });

  it('--od9 requires the pipeline status context', () => {
    const { env } = stubGh({ contexts: [] });
    const r = run(env, '--branch', 'main', '--od9');
    expect(r.code).toBe(1);
    expect(r.out).toContain("status context 'gitlab-pipeline' missing");
    const ok = stubGh({ contexts: ['gitlab-pipeline'] });
    expect(run(ok.env, '--branch', 'main', '--od9').code).toBe(0);
  });
});
