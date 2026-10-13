/* @jest-environment node */
/* PLAT-263/265: the verify script + the empty PLAT fragment gate imports. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DIST, ROOT, ensureBuilt } from '../build/helpers';

describe('side-effects gate (PLAT-263)', () => {
  it('Node trap ignores unchanged NaN and still reports actual global writes', () => {
    const work = mkdtempSync(join(tmpdir(), 'ag-trap-test-'));
    try {
      mkdirSync(join(work, 'dist'));
      writeFileSync(join(work, 'package.json'), '{"type":"module"}');
      writeFileSync(join(work, 'dist', 'clean.js'), 'export const value = 1;\n');
      writeFileSync(join(work, 'dist', 'write.js'), 'globalThis.__agTrapTest = 1;\n');
      const out = execFileSync(process.execPath, [join(ROOT, 'tests/side-effects/trap-node.mjs')],
        { cwd: work, encoding: 'utf8' });
      const observed = JSON.parse(out.trim().split('\n').pop()!) as { api: string; module: string }[];
      expect(observed).not.toContainEqual(expect.objectContaining({ api: 'globalThis.NaN write' }));
      expect(observed).toContainEqual({ api: 'globalThis.__agTrapTest write', module: 'dist/write.js' });
      expect(observed.filter((call) => call.module === 'dist/clean.js')).toEqual([]);
    } finally { rmSync(work, { recursive: true, force: true }); }
  });

  it('verify-side-effects passes on the emitted artifact', () => {
    ensureBuilt();
    const out = execFileSync('node', ['scripts/ci/verify-side-effects.mjs'], { cwd: ROOT, encoding: 'utf8' });
    expect(out).toMatch(/verify-side-effects: \d+ recorded call\(s\)/);
  }, 180_000);

  it('writes .artifacts/plat/side-effects.json with zero violations', () => {
    const p = join(ROOT, '.artifacts', 'plat', 'side-effects.json');
    expect(existsSync(p)).toBe(true);
    const rec = JSON.parse(readFileSync(p, 'utf8'));
    expect(rec.violations).toEqual([]);
  });
});
