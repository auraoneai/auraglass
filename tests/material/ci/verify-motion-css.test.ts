/* @jest-environment node */
/* REQ-FIN-12 (MAT-46): verify-motion-css fails on `infinite` animations and
   --ag-duration-ambient outside [data-ag-continuous="on"], exits 0 on src/**
   with the committed §4.3 baseline, and emits the gate's message naming the fix. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(__dirname, '../../..');
const SCRIPT = join(ROOT, 'scripts/mat/verify-motion-css.mjs');
const BAD = join(ROOT, 'scripts/mat/__fixtures__/ungated-loop.bad.css');

const run = (args: string[]) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd: ROOT });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('verify-motion-css ungated-loop gate (REQ-FIN-12)', () => {
  it('exits 1 on an ungated infinite animation and names the fix', () => {
    const r = run(['--file', BAD]);
    expect(r.code).toBe(1);
    expect(r.err).toContain('ungated-loop');
    expect(r.err).toContain('[data-ag-continuous="on"]');
    expect(r.err).toContain('baseline row');
  });

  it('exits 0 over src/** with the committed expiring baseline', () => {
    const r = run([]);
    expect(r.code).toBe(0);
    expect(r.out).toContain('baselined until RC-1');
  });
});
