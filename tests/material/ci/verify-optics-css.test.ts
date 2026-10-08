/* @jest-environment node */
/* MAT-101: fixtures under tests/material/ci/fixtures/optics-css/ — clean → 0,
   violating *.module.css → reported with line, exempt src/material/css → 0,
   ratchet increase → exit 1. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const SCRIPT = join(__dirname, '../../../scripts/mat/verify-optics-css.mjs');
const FIX = join(__dirname, 'fixtures/optics-css');

const run = (root: string, extra: string[] = []) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, '--root', join(FIX, root), ...extra], { encoding: 'utf8' });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('verify-optics-css', () => {
  it('clean tree reports 0 violations and exits 0', () => {
    const r = run('clean');
    expect(r.code).toBe(0);
    expect(r.out).not.toMatch(/backdrop-filter/);
  });

  it('violating *.module.css is reported with a line number', () => {
    const r = run('violating');
    expect(r.code).toBe(1);
    expect(r.out).toMatch(/src\/components\/y\.module\.css:\d+\s+backdrop-filter/);
    expect(r.out).toMatch(/white-rgba/);
  });

  it('src/material/css files are exempt', () => {
    const r = run('exempt');
    expect(r.code).toBe(0);
  });

  it('--ratchet fails on a new violating file', () => {
    const r = run('ratchet', ['--ratchet', join(FIX, 'ratchet/baseline.json')]);
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/new violating file/);
  });

  it('--ratchet passes when counts do not increase', () => {
    const r = run('ratchet', ['--ratchet', join(FIX, 'ratchet/baseline-ok.json')]);
    expect(r.code).toBe(0);
    expect(r.out).toMatch(/ratchet OK/);
  });
});
