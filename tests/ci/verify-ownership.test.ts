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

describe('REQ-FIN-30 rule cases (AC-FIN-30)', () => {
  it('(a) unmatched path on next-mat/* fails naming Z01 PLAT', () => {
    const r = run(['--branch', 'next-mat/x', '--files', 'zz-unmatched/x']);
    expect(r.code).toBe(1);
    expect(r.out).toContain('Z01');
    expect(r.out).toContain('PLAT');
  });

  it('(b) a real git rename lists old and new paths under --base', () => {
    const dir = require('node:fs').mkdtempSync(require('node:path').join(require('node:os').tmpdir(), 'own-'));
    const g = (a: string[]) => execFileSync('git', a, { cwd: dir, encoding: 'utf8' });
    g(['init', '-q']);
    g(['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '--allow-empty', '-qm', 'base']);
    require('node:fs').mkdirSync(`${dir}/scripts/ci`, { recursive: true });
    require('node:fs').mkdirSync(`${dir}/contracts`, { recursive: true });
    require('node:fs').writeFileSync(`${dir}/contracts/ownership.json`, require('node:fs').readFileSync('contracts/ownership.json'));
    require('node:fs').writeFileSync(`${dir}/scripts/ci/a.mjs`, 'x\n');
    g(['add', '-A']); g(['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'add']);
    g(['mv', 'scripts/ci/a.mjs', 'scripts/ci/b.mjs']);
    g(['-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'rename']);
    const r = (() => {
      try {
        const out = execFileSync('node', [`${process.cwd()}/${SCRIPT}`, '--branch', 'next-mat/x', '--base', 'HEAD~1'], { cwd: dir, encoding: 'utf8' });
        return { code: 0, out };
      } catch (e: any) { return { code: e.status ?? 1, out: `${e.stdout}${e.stderr}` }; }
    })();
    expect(r.code).toBe(1);
    expect(r.out).toContain('scripts/ci/b.mjs');
    expect(r.out).toContain('scripts/ci/a.mjs'); // delete+add pair (--no-renames)
  });

  it('(c) 4x-cmp/* may touch fragments/deprecations/cmp.ts but not src/components/a.tsx', () => {
    expect(run(['--branch', '4x-cmp/x', '--files', 'fragments/deprecations/cmp.ts']).code).toBe(0);
    const r = run(['--branch', '4x-cmp/x', '--files', 'src/components/a.tsx']);
    expect(r.code).toBe(1);
    expect(r.out).toContain('src/components/a.tsx');
  });

  it('(d) sync/fragments-codemods-* allows codemods, rejects src/x.ts', () => {
    expect(run(['--branch', 'sync/fragments-codemods-20261008', '--files', 'fragments/codemods/mat.ts']).code).toBe(0);
    expect(run(['--branch', 'sync/fragments-codemods-20261008', '--files', 'src/x.ts']).code).toBe(1);
  });

  it('(e) a NONE-owned path fails with the use tests/<kind>/<stream>/ message', () => {
    const r = run(['--branch', 'next-mat/x', '--files', 'tests/e2e/foo/x.spec.ts']);
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/use tests\/<kind>\/|invalid location|tests\//);
  });

  it('(f) a non-prefixed branch fails', () => {
    const r = run(['--branch', 'feature/foo', '--files', 'src/theme/a.ts']);
    expect(r.code).toBe(1);
  });

  it('(g) 4x11-<stream>/* follows the 4x zone rule (OD-13)', () => {
    expect(run(['--branch', '4x11-cmp/x', '--files', 'fragments/deprecations/cmp.ts']).code).toBe(0);
    expect(run(['--branch', '4x11-cmp/x', '--files', 'src/components/a.tsx']).code).toBe(1);
    expect(run(['--branch', '4x11-plat/x', '--files', 'ci/plat.gitlab-ci.yml']).code).toBe(0);
  });
});
