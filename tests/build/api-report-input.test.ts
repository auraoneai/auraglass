/* @jest-environment node */
/* PLAT-274 (REQ-PLAT-73): the api-report seed reads --entry <entry> and writes
   etc/api/<entry>.{exports.json,api.md} listing the barrel's value exports. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './helpers';

describe('api report input (PLAT-274)', () => {
  it('api-report.mjs --entry tokens writes etc/api/tokens.exports.json with value exports', () => {
    execFileSync('node', ['scripts/build/api-report.mjs', '--entry', 'tokens'], { cwd: ROOT });
    const f = join(ROOT, 'etc/api/tokens.exports.json');
    expect(existsSync(f)).toBe(true);
    const report = JSON.parse(readFileSync(f, 'utf8'));
    expect(report.entry).toBe('./tokens');
    expect(Array.isArray(report.exports)).toBe(true);
    expect(report.exports.length).toBeGreaterThan(0);
    rmSync(f); rmSync(f.replace('exports.json', 'api.md'));
  });

  it('rejects an unknown entry', () => {
    expect(() => execFileSync('node', ['scripts/build/api-report.mjs', '--entry', 'nope'], { cwd: ROOT, stdio: 'pipe' })).toThrow();
  });
});
