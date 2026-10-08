/* @jest-environment node */
// PLAT-009: one failing fixture per §4.13.4 rule + one passing fixture equal
// to the C0 seeds. Fixtures live under tests/ci/fixtures/ci-fragments/<case>/.
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const SCRIPT = join(process.cwd(), 'scripts/ci/verify-ci-fragments.mjs');
const FIXTURES = 'tests/ci/fixtures/ci-fragments';

function run(root: string): { code: number; out: string } {
  try {
    const out = execFileSync('node', [SCRIPT, '--root', root], {
      encoding: 'utf8',
      env: { ...process.env, GITLAB_CI: undefined, CI: undefined },
    });
    return { code: 0, out };
  } catch (e: unknown) {
    const err = e as { status: number; stdout: string; stderr: string };
    return { code: err.status ?? 1, out: `${err.stdout ?? ''}${err.stderr ?? ''}` };
  }
}

describe('verify-ci-fragments fixtures', () => {
  it('passes on the live tree (C0 seeds + current plat fragment)', () => {
    const r = run('.');
    expect(r.code).toBe(0);
    expect(r.out).toContain('contract:ci-fragments OK');
  });

  const cases = existsSync(FIXTURES) ? readdirSync(FIXTURES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'passing').map((d) => d.name) : [];
  it.each(cases)('rejects fixture %s', (name) => {
    const r = run(join(FIXTURES, name));
    expect(r.code).toBe(1);
    expect(r.out).toContain('contract:ci-fragments FAIL');
  });
});
