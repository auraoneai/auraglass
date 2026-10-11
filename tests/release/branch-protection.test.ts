/* @jest-environment node */
// PLAT-017/050, REQ-FIN-25: verify-branch-protection.mjs is read-only, refuses
// CI, url-encodes release branches, enforces review count >= 1 and linear
// history per branch, and checks the status context when --od9 (stub `gh`).
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(process.cwd(), 'scripts/release/verify-branch-protection.mjs');

const compliant = (contexts: string[] = []) => ({
  required_status_checks: { strict: true, contexts },
  enforce_admins: { enabled: true },
  required_pull_request_reviews: {
    dismiss_stale_reviews: true,
    require_code_owner_reviews: true,
    required_approving_review_count: 1,
  },
  restrictions: null,
  required_linear_history: { enabled: true },
  allow_force_pushes: { enabled: false },
  allow_deletions: { enabled: false },
});

/* Stub `gh api repos/<r>/branches/<encoded>/protection`. `payloads` maps the
   url-encoded branch to a protection payload; anything else → 404 (exit 1).
   Every invocation is logged so the test can assert the encoded path. */
function stubGh(payloads: Record<string, unknown>) {
  const dir = mkdtempSync(join(tmpdir(), 'ghstub-'));
  const log = join(dir, 'log');
  const cases = Object.entries(payloads)
    .map(([enc, p]) => {
      const file = join(dir, `${enc}.json`);
      writeFileSync(file, JSON.stringify(p));
      return `  */branches/${enc}/protection) cat '${file}' ;;`;
    })
    .join('\n');
  writeFileSync(
    join(dir, 'gh'),
    `#!/bin/sh\necho "$*" >> '${log}'\ncase "$2" in\n${cases}\n  *) echo 'gh: Not Found (HTTP 404)' >&2; exit 1 ;;\nesac\n`,
  );
  chmodSync(join(dir, 'gh'), 0o755);
  return { log, env: { PATH: `${dir}:${process.env.PATH}` } };
}

const run = (env: NodeJS.ProcessEnv, ...args: string[]) => {
  const base = { ...process.env, ...env };
  delete base.CI;
  delete base.GITLAB_CI;
  try {
    const out = execFileSync('node', [SCRIPT, ...args], { encoding: 'utf8', env: base, stdio: 'pipe' });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

const ALL = { main: compliant(), next: compliant(), 'release%2F4.x': compliant(), 'release%2F4.1.x': compliant() };

describe('verify-branch-protection.mjs', () => {
  it('refuses to run under CI', () => {
    try {
      execFileSync('node', [SCRIPT], { env: { ...process.env, GITLAB_CI: 'true' }, encoding: 'utf8', stdio: 'pipe' });
      throw new Error('expected non-zero exit');
    } catch (e: any) {
      expect(e.status).toBe(2);
      expect(`${e.stdout}${e.stderr}`).toContain('never run under CI');
    }
  });

  it('issues only read-only gh api calls', () => {
    const src = readFileSync(SCRIPT, 'utf8');
    expect(src).not.toMatch(/(-X|--method)['",\s]+(PUT|POST|PATCH|DELETE)/);
    expect(src).toContain('protection');
  });

  it('compliant main, next, release/4.x, release/4.1.x → exit 0, paths url-encoded', () => {
    const { env, log } = stubGh(ALL);
    const r = run(env);
    expect(r.code).toBe(0);
    expect(r.out).toContain('4/4 branches verified');
    const calls = readFileSync(log, 'utf8');
    expect(calls).toContain('branches/release%2F4.x/protection');
    expect(calls).toContain('branches/release%2F4.1.x/protection');
  });

  it('missing linear history → exit 1 naming the branch', () => {
    const bad = compliant() as any;
    bad.required_linear_history = { enabled: false };
    const { env } = stubGh({ ...ALL, next: bad });
    const r = run(env);
    expect(r.code).toBe(1);
    expect(r.out).toContain('branch-protection FAIL next (1): required_linear_history');
    expect(r.out).toContain('branch-protection OK    main');
  });

  it('review count 0 → exit 1 with a per-branch failure counter', () => {
    const bad = compliant() as any;
    bad.required_pull_request_reviews.required_approving_review_count = 0;
    const { env } = stubGh({ ...ALL, 'release%2F4.1.x': bad });
    const r = run(env);
    expect(r.code).toBe(1);
    expect(r.out).toContain('branch-protection FAIL release/4.1.x (1): required_approving_review_count >= 1');
    expect(r.out).toContain('1 failure(s) across 4 branches');
  });

  it('unprotected branch (404) fails', () => {
    const { env } = stubGh({ main: compliant() });
    const r = run(env, '--branch', 'main,release/4.x');
    expect(r.code).toBe(1);
    expect(r.out).toContain('FAIL release/4.x (1): protection read failed (404');
  });

  it('--od9 requires the pipeline status context', () => {
    expect(run(stubGh({ main: compliant() }).env, '--branch', 'main', '--od9').out).toContain(
      "required status context 'gitlab-pipeline' (OD-9 on)",
    );
    expect(run(stubGh({ main: compliant() }).env, '--branch', 'main', '--od9').code).toBe(1);
    expect(run(stubGh({ main: compliant(['gitlab-pipeline']) }).env, '--branch', 'main', '--od9').code).toBe(0);
  });
});
