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
    /* compat rows (target + 2048 B) are reported separately and gate too */
    expect(Array.isArray(agg.compat)).toBe(true);
    expect(agg.compat.every((r: { status: string }) => r.status !== 'fail')).toBe(true);
    /* every PLAT floor row is measured once its subject ships; until then it
       names its producer */
    for (const r of agg.rows.filter((x: { id: string }) => ['plat:cn', 'plat:warnDeprecated', 'plat:tailwind-bridge', 'plat:compat-globals'].includes(x.id))) {
      if (r.measuredBytes === null) expect(r.pendingOn).toEqual(expect.any(String));
    }
  }, 180_000);
});
