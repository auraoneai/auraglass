/* @jest-environment node */
/* REQ-PLAT-70: cold-import latency of the root entries — median of 11 spawns
   of `node -e "import('<entry>')"` must stay ≤ 150 ms (AG_COLD_IMPORT_*
   envs retune). Part of the pack-matrix so it runs on Node 20.19 and 22. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { ROOT, ensureBuilt } from './helpers';

describe('cold import (REQ-PLAT-70)', () => {
  it('root-entry medians stay within budget', () => {
    ensureBuilt();
    const out = execFileSync(process.execPath, ['scripts/ci/cold-import.mjs'], {
      cwd: ROOT, encoding: 'utf8',
      env: { ...process.env, AG_COLD_IMPORT_RUNS: process.env.AG_COLD_IMPORT_RUNS ?? '11' },
    });
    expect(out).toMatch(/cold-import: all medians within/);
  }, 300_000);
});
