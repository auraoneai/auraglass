/* @jest-environment node */
/* REQ-FIN-12 (REQ-MAT-46), AC-FIN-12: verify-motion-css fails on `infinite`
   animations and --ag-duration-ambient outside [data-ag-continuous="on"]; the
   PRD-F §4.3 rule 3 baseline (scripts/integration/baselines/ungated-loops.json)
   fails on a new offender, a stale row, a malformed row and every row once
   RC-1 is reached; over src/** the loop gate exits 0 with the committed
   baseline. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '../..');
const SCRIPT = join(ROOT, 'scripts/mat/verify-motion-css.mjs');
const FIX = 'tests/integration/fixtures';
const BAD = `${FIX}/ungated-loop.bad.css`;
const NEGATED = `${FIX}/ungated-loop-negated.bad.css`;
const GOOD = `${FIX}/gated-loop.good.css`;

const run = (args: string[], env: Record<string, string> = {}) => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT, ...args], {
      encoding: 'utf8', cwd: ROOT, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out, err: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return { code: err.status ?? 1, out: err.stdout ?? '', err: err.stderr ?? '' };
  }
};

describe('verify-motion-css ungated-loop gate (REQ-FIN-12)', () => {
  it('exits 1 on an ungated infinite animation, names the gate and the fix', () => {
    const r = run(['--file', BAD]);
    expect(r.code).toBe(1);
    expect(r.err).toContain(`${BAD}:4:5  ungated-loop`);
    expect(r.err).toContain('[data-ag-continuous="on"]');
    expect(r.err).toContain('[NEW: fix, or add a baseline row');
  });

  it('does not accept a negated gate and flags --ag-duration-ambient outside the gate', () => {
    const r = run(['--file', NEGATED]);
    expect(r.code).toBe(1);
    expect(r.err).toContain(`${NEGATED}:5:5  ungated-loop`);
    expect(r.err).toContain(`${NEGATED}:8:5  ungated-loop`);
  });

  it('exits 0 when every loop is gated by its own selector or a nesting ancestor', () => {
    const r = run(['--file', GOOD]);
    expect(r.err).toBe('');
    expect(r.code).toBe(0);
    expect(r.out).toContain('verify-motion-css: clean (1 files)');
  });

  it('a baseline row covers the offending file until RC-1', () => {
    const r = run(['--file', BAD, '--baseline', `${FIX}/ungated-loops.covering.json`], { AG_VERSION: '5.0.0-alpha.0' });
    expect(r.code).toBe(0);
    expect(r.out).toContain('1 file(s) baselined until RC-1');
  });

  it('fails on every baseline row once the version reaches RC-1', () => {
    for (const v of ['5.0.0-rc.1', '5.0.0']) {
      const r = run(['--file', BAD, '--baseline', `${FIX}/ungated-loops.covering.json`], { AG_VERSION: v });
      expect(r.code).toBe(1);
      expect(r.err).toContain(`[EXPIRED: baseline row (owner FIN-A, REQ-FIN-12) expired at RC-1 (version ${v})`);
    }
  });

  it('fails on a stale baseline row whose file no longer has an ungated loop', () => {
    const r = run(['--file', GOOD, '--baseline', `${FIX}/ungated-loops.stale.json`]);
    expect(r.code).toBe(1);
    expect(r.err).toContain(`${GOOD}: baseline row is STALE — file no longer offends; delete the row (owner FIN-A, REQ-FIN-12)`);
  });

  it('fails on a malformed baseline row and does not let it cover the file', () => {
    const r = run(['--file', BAD, '--baseline', `${FIX}/ungated-loops.malformed.json`]);
    expect(r.code).toBe(1);
    expect(r.err).toContain('baseline row is malformed');
    expect(r.err).toContain(`${BAD}:4:5  ungated-loop`);
  });

  it('rejects an unknown --gate value', () => {
    const r = run(['--gate', 'bogus']);
    expect(r.code).toBe(2);
    expect(r.err).toContain("unknown --gate 'bogus'");
  });

  it('committed baseline rows are well-formed and unique', () => {
    const rows = JSON.parse(
      readFileSync(join(ROOT, 'scripts/integration/baselines/ungated-loops.json'), 'utf8'),
    ) as Array<Record<string, unknown>>;
    const files = rows.map((r) => r.file);
    expect(new Set(files).size).toBe(files.length);
    for (const r of rows) {
      expect(Object.keys(r).sort()).toEqual(['expires', 'file', 'owner', 'reqFin']);
      expect(r.expires).toBe('RC-1');
    }
  });

  it('exits 0 over src/** with the committed expiring baseline (loop gate)', () => {
    const r = run(['--gate', 'ungated-loop'], { AG_VERSION: '5.0.0-alpha.0' });
    expect(r.err).toBe('');
    expect(r.code).toBe(0);
    expect(r.out).toContain('baselined until RC-1');
  });
});
