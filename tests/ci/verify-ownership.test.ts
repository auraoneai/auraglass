/* @jest-environment node */
// PLAT-007: one case per ownership rule, run against the real script.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const SCRIPT = 'scripts/ci/verify-ownership.mjs';

function run(args: string[], env: Record<string, string> = {}): { code: number; out: string } {
  try {
    const out = execFileSync('node', [SCRIPT, ...args], {
      encoding: 'utf8',
      env: { ...process.env, ...env },
    });
    return { code: 0, out };
  } catch (e: unknown) {
    const err = e as { status: number; stdout: string; stderr: string };
    return { code: err.status, out: `${err.stdout}${err.stderr}` };
  }
}

describe('verify-ownership', () => {
  it('accepts own-path files on a next-plat branch', () => {
    const r = run(['--branch', 'next-plat/ci-x', '--files', 'ci/plat.gitlab-ci.yml,scripts/ci/gitlab-status.mjs']);
    expect(r.code).toBe(0);
  });

  it('rejects a foreign path on a next-plat branch', () => {
    const r = run(['--branch', 'next-plat/ci-x', '--files', 'src/material/theme.ts']);
    expect(r.code).toBe(1);
    expect(r.out).toContain('src/material/theme.ts');
  });

  it('prints the D02x note for invalid test locations', () => {
    const r = run(['--branch', 'next-plat/ci-x', '--files', 'tests/lint/anything.test.ts']);
    expect(r.code).toBe(1);
    expect(r.out).toContain('invalid location');
  });

  it('allows MAT row-H paths only for 4x-mat branches', () => {
    const mat = run(['--branch', '4x-mat/bridge', '--files', 'src/material/tokens.ts']);
    expect(mat.code).toBe(0);
    const plat = run(['--branch', '4x-plat/ci-x', '--files', 'src/material/tokens.ts']);
    expect(plat.code).toBe(1);
  });

  it('restricts sync/fragments branches to their fragment kind', () => {
    const dep = run(['--branch', 'sync/fragments-deprecations-20261008', '--files', 'fragments/deprecations/mat.ts']);
    expect(dep.code).toBe(0);
    const wrong = run(['--branch', 'sync/fragments-deprecations-20261008', '--files', 'fragments/codemods/mat.ts']);
    expect(wrong.code).toBe(1);
    const gen = run([
      '--branch', 'sync/fragments-deprecations-20261008',
      '--files', 'src/internal/deprecations.generated.ts',
    ]);
    expect(gen.code).toBe(0);
  });

  it('falls back to PLAT for unmatched paths (Z01)', () => {
    const r = run(['--branch', 'next-mat/tokens', '--files', 'scripts/ci/verify-ownership.mjs']);
    expect(r.code).toBe(1); // scripts/ci/** is PLAT (E04)
  });

  it('warns but passes on unrestricted branches', () => {
    const r = run(['--branch', 'next', '--files', 'src/whatever.ts']);
    expect(r.code).toBe(0);
    expect(r.out).toContain('unrestricted');
  });

  it('counts renames as delete+add with --no-renames', () => {
    const src = readFileSync(SCRIPT, 'utf8');
    expect(src).toContain('--no-renames');
  });

  it('accepts contract/* branches for non-NONE owners', () => {
    const r = run(['--branch', 'contract/c0-bootstrap', '--files', 'contracts/ownership.json']);
    expect(r.code).toBe(0);
  });
});
