/** @jest-environment node */
// MAT-053: gate tests — undefined-vars, dead-vars and tier-skip exit 0 on the real
// build; each fixture dir under tests/tokens/fixtures/gates exits 1 with the
// expected message; total gate runtime <= 30 s.
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT } from '../../scripts/tokens/validate.mjs';

const GATES = join(ROOT, 'scripts/tokens/gates');
const F = join(ROOT, 'tests/tokens/fixtures/gates');

const run = (script: string, args: string[]): { code: number; out: string } => {
  try {
    const out = execFileSync('node', [join(GATES, script), ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

describe('gates (MAT-053)', () => {
  test('real build: all three gates exit 0 within 30 s total', () => {
    const t0 = Date.now();
    const u = run('undefined-vars.mjs', []);
    const d = run('dead-vars.mjs', []);
    const t = run('tier-skip.mjs', []);
    const elapsed = Date.now() - t0;
    console.log(`gate runtimes total: ${elapsed}ms`);
    console.log([u.out, d.out, t.out].join(''));
    expect(elapsed).toBeLessThanOrEqual(30_000);
    expect({ u: u.code, d: d.code, t: t.code }).toEqual({ u: 0, d: 0, t: 0 });
  }, 40_000);

  test('fixture: undefined-var exits 1 naming the var', () => {
    const r = run('undefined-vars.mjs', [
      '--dist', join(F, 'undefined-var'),
      '--src', join(F, 'undefined-var/css'),
      '--manifest', join(F, 'dead-var/manifest.json'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('--ag-color-does-not-exist');
  });

  test('fixture: dead-var exits 1 naming the var', () => {
    const r = run('dead-vars.mjs', [
      '--dist', join(F, 'dead-var/dist'),
      '--src', join(F, 'dead-var/src'),
      '--manifest', join(F, 'dead-var/manifest.json'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('--ag-dead-fixture');
  });

  test('fixture: ref-in-src exits 1 (tier-skip)', () => {
    const r = run('tier-skip.mjs', [
      '--src', join(F, 'ref-in-src'),
      '--tokens', join(ROOT, 'tokens'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/_ag-ref|ref\.color|tier/i);
  });

  test('fixture: unmanifested-tsx exits 1 (undefined-vars src scan)', () => {
    const r = run('undefined-vars.mjs', [
      '--dist', join(F, 'dead-var/dist'),
      '--src', join(F, 'unmanifested-tsx'),
      '--manifest', join(F, 'dead-var/manifest.json'),
    ]);
    expect(r.code).toBe(1);
    expect(r.out).toContain('--ag-color-not-in-manifest');
  });
});
