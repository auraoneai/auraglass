/* @jest-environment node */
// REQ-FIN-110 (C-16) / REQ-MAT-66 / REQ-QUAL-72: verify-a11y-manual.mjs against
// fixture record sets (never under records/, which holds tester-produced
// SrRecords only).
import { describe, expect, it } from '@jest/globals';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SCRIPT = 'scripts/mat/verify-a11y-manual.mjs';
const FIX = 'tests/a11y/manual/__fixtures__/verify';
const SHA = '0123456789abcdef0123456789abcdef01234567';

function run(...args: string[]): { code: number; out: string; err: string } {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
  return { code: r.status ?? -1, out: r.stdout, err: r.stderr };
}

describe('verify-a11y-manual.mjs', () => {
  it('valid record set exits 0 and prints total + per-stream counts', () => {
    const r = run('--sha', SHA, join(FIX, 'valid'));
    expect(r.err).toBe('');
    expect(r.code).toBe(0);
    expect(r.out).toContain('3 total, valid');
    expect(r.out).toContain('mat=2 cmp=1 surf=0');
    expect(r.out).toContain(`sha ${SHA}`);
  });

  it('empty record directory exits 1', () => {
    const dir = mkdtempSync(join(tmpdir(), 'sr-empty-'));
    try {
      const r = run(dir);
      expect(r.code).toBe(1);
      expect(r.err).toContain('no records found');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('record bound to another SHA exits 1', () => {
    const other = 'fedcba9876543210fedcba9876543210fedcba98';
    const r = run('--sha', other, join(FIX, 'valid'));
    expect(r.code).toBe(1);
    expect(r.err).toContain(`sha ${SHA} != ${other}`);
  });

  it('record without steps exits 1', () => {
    const r = run(join(FIX, 'missing-steps'));
    expect(r.code).toBe(1);
    expect(r.err).toContain('missing required "steps"');
  });

  it('record with an `at` outside the enum exits 1', () => {
    const r = run(join(FIX, 'bad-at'));
    expect(r.code).toBe(1);
    expect(r.err).toMatch(/\/at: "jaws" not in voiceover-macos\|/);
  });

  it('record whose path is not <stream>/<subject>-<at>.json exits 1', () => {
    const r = run(join(FIX, 'misplaced'));
    expect(r.code).toBe(1);
    expect(r.err).toContain('must be at <records>/mat/surface-material-lab-voiceover-macos.json');
    // the record itself is schema-valid: the path rule alone fails it
    expect(r.err.trim().split('\n')).toHaveLength(1);
  });

  it('two records with the same (subject, at, pass) exit 1', () => {
    const r = run(join(FIX, 'duplicate'));
    expect(r.code).toBe(1);
    expect(r.err).toContain('duplicate (subject, at, pass) = (button, nvda-chrome, sr)');
    expect(r.err.trim().split('\n')).toHaveLength(1);
  });

  it('--sha without a value exits 1', () => {
    const r = run('--sha');
    expect(r.code).toBe(1);
    expect(r.err).toContain('--sha requires a value');
    const r2 = run('--sha', '--', join(FIX, 'valid'));
    expect(r2.code).toBe(1);
  });

  it('exactly one sr-record.schema.json is tracked in the repo', () => {
    const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
      .split('\n')
      .filter((f) => f.endsWith('sr-record.schema.json'));
    expect(tracked).toHaveLength(1);
  });
});
