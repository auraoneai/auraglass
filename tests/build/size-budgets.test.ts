/* @jest-environment node */
/* PLAT-282/285: every size-budget row measures within its limit. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, ensureBuilt, withBuildLock } from './helpers';

describe('size budgets (PLAT-282)', () => {
  it('verify-size-budgets passes and writes docs/size-budgets.json', () => {
    ensureBuilt();
    const out = withBuildLock(() => execFileSync('node', ['scripts/ci/verify-size-budgets.mjs'], { cwd: ROOT, encoding: 'utf8' }));
    expect(out).toMatch(/verify-size-budgets: \d+\/\d+ rows within limits/);
    expect(existsSync(join(ROOT, 'docs', 'size-budgets.json'))).toBe(true);
    const agg = JSON.parse(readFileSync(join(ROOT, 'docs', 'size-budgets.json'), 'utf8'));
    expect(agg.rows.every((r: { status: string }) => r.status !== 'fail')).toBe(true);
  }, 180_000);
});
