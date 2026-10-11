/* @jest-environment node */
/* PLAT-274 (REQ-PLAT-73): the api-report seed reads --entry <entry> and writes
   etc/api/<entry>.{exports.json,api.md} listing the barrel's value exports.
   Runs the CLI from the repo root (the ROOT fix: it used to resolve to scripts/). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers';

// The committed reports are read by other suites; restore them after the CLI rewrites them.
function preserving<T>(files: string[], fn: () => T): T {
  const saved = files.map((f) => (existsSync(f) ? readFileSync(f) : null));
  try { return fn(); } finally {
    files.forEach((f, i) => { const s = saved[i]; if (s === null) rmSync(f, { force: true }); else writeFileSync(f, s); });
  }
}

describe('api report input (PLAT-274)', () => {
  it('api-report.mjs --entry tokens writes etc/api/tokens.exports.json with value exports', () => {
    const f = join(ROOT, 'etc/api/tokens.exports.json');
    preserving([f, f.replace('exports.json', 'api.md')], () => {
      execFileSync('node', ['scripts/build/api-report.mjs', '--entry', 'tokens'], { cwd: ROOT });
      expect(existsSync(f)).toBe(true);
      const report = JSON.parse(readFileSync(f, 'utf8'));
      expect(report.entry).toBe('./tokens');
      expect(Array.isArray(report.exports)).toBe(true);
      expect(report.exports.length).toBeGreaterThan(0);
    });
  });

  it('rejects an unknown entry and writes nothing', () => {
    const f = join(ROOT, 'etc/api/nope.exports.json');
    preserving([f, f.replace('exports.json', 'api.md')], () => {
      let status: number | null = null;
      try { execFileSync('node', ['scripts/build/api-report.mjs', '--entry', 'nope'], { cwd: ROOT, stdio: 'pipe' }); }
      catch (e) { status = (e as { status: number | null }).status; }
      expect(status).toBe(2);
      expect(existsSync(f)).toBe(false);
    });
  });
});
