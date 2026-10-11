/* @jest-environment node */
/* MAT-103: fixture trees tests/material/ci/fixtures/glass-recipes/{zero,one,three} —
   0/1/3 outside emitters + 1 inside src/material => N=1/2/4; ratchet with higher N
   exits 1; noRegression file re-emitting exits 1; --strict with N=2 exits 1. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = join(__dirname, '../../../scripts/mat/count-glass-recipes.mjs');
const FIX = join(__dirname, 'fixtures/glass-recipes');
const EVDIR = mkdtempSync(join(tmpdir(), 'ag-recipes-'));

const run = (root: string, extra: string[] = []) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, '--root', join(FIX, root), ...extra], {
      encoding: 'utf8',
      env: { ...process.env, AURAGLASS_EVIDENCE_DIR: EVDIR },
    });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('count-glass-recipes', () => {
  it.each([
    ['zero', 1],
    ['one', 2],
    ['three', 4],
  ] as const)('%s => N=%d', (dir, n) => {
    const r = run(dir);
    expect(r.code).toBe(0);
    expect(r.out).toContain(`independent-glass-recipes: ${n}`);
  });

  it('writes the artifact summary', async () => {
    run('one');
    const { readFileSync } = await import('node:fs');
    const json = JSON.parse(readFileSync(join(EVDIR, 'mat/count-glass-recipes/recipes.json'), 'utf8'));
    expect(json['independent-glass-recipes']).toBe(2);
    expect(json.inside).toEqual(['src/material/engine.ts']);
    expect(json.outside).toEqual(['src/components/a.ts']);
  });

  it('--ratchet fails when N increases over baseline', () => {
    const r = run('regress', ['--ratchet', join(FIX, 'regress/baseline.json')]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/ratchet regression: 2 -> 3/);
  });

  it('--ratchet fails when a noRegression file re-emits', () => {
    const r = run('noreg', ['--ratchet', join(FIX, 'noreg/baseline.json')]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/noRegression file re-emitted/);
  });

  it('--strict fails when N > 1', () => {
    const r = run('strict', ['--strict']);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/strict: 2 > 1/);
  });

  it('--strict passes when N = 1', () => {
    const r = run('zero', ['--strict']);
    expect(r.code).toBe(0);
  });
});
