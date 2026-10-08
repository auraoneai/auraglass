/* @jest-environment node */
/* MAT-179 test: fixtures recipe-removal/{src-compat-only,outsiders,cross-ref};
   deprecation coverage check uses a local deprecations.json fixture (the 4.x
   fragment table is authored on release/4.x; without --deprecations the check is
   reported pending, never failed). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const SCRIPT = join(__dirname, '../../../scripts/mat/verify-recipe-removal.mjs');
const FIX = join(__dirname, 'fixtures/recipe-removal');

const run = (root: string, extra: string[] = []) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, '--root', join(FIX, root), ...extra], { encoding: 'utf8' });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('verify-recipe-removal', () => {
  it('passes when recipe symbols appear only inside src/compat/**', () => {
    const r = run('src-compat-only');
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/compat\s+src\/compat\/adapter\.ts/);
    expect(r.out).toMatch(/OK — 2 compat-only/);
  });

  it('fails when a recipe symbol appears outside src/compat/**', () => {
    const r = run('outsiders');
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/outside src\/compat/);
  });

  it('reports the coverage check pending without a deprecations table', () => {
    const r = run('src-compat-only', ['--deprecations', join(FIX, 'nope.json')]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/coverage check pending/);
  });

  it('verifies every §5.10 removal row has a deprecation entry', () => {
    const ok = run('cross-ref', ['--deprecations', join(FIX, 'cross-ref/deprecations.json')]);
    expect(ok.code).toBe(0);
    expect(ok.out).toMatch(/every recipe removal has a deprecation entry/);
    const bad = run('cross-ref', ['--deprecations', join(FIX, 'cross-ref/deprecations-partial.json')]);
    expect(bad.code).toBe(1);
    expect(bad.err).toMatch(/removals without deprecation entries/);
  });
});
