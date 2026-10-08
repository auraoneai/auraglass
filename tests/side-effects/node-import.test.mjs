/* PLAT-266 support: the cold-import measurement script exists, is executable,
   and its local (unmetered) run exits 0 reporting the median. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

describe('measure-node-import (PLAT-266)', () => {
  it('script exists and runs locally in --local mode', () => {
    const p = join(ROOT, 'scripts/ci/measure-node-import.mjs');
    expect(existsSync(p)).toBe(true);
    const out = execFileSync('node', [p, '--local', '--samples', '3'], { cwd: ROOT, encoding: 'utf8', timeout: 120_000 });
    expect(out).toMatch(/median \d+(\.\d+)? ms/);
  }, 130_000);
});
