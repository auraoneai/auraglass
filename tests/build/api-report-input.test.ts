/* @jest-environment node */
/* PLAT-274 (REQ-PLAT-73): the api-report seed reads --entry <entry> and produces
   etc/api/<entry>.{exports.json,api.md} listing the barrel's value exports.
   Runs against the real repo barrel without writing into the tracked tree. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { run5x } from '../../scripts/build/api-report.mjs';
import { ROOT } from './helpers';

describe('api report input (PLAT-274)', () => {
  it('--entry tokens yields etc/api/tokens.exports.json with value exports', async () => {
    const { files, unanalysable } = await run5x('tokens', { root: ROOT });
    expect(unanalysable).toEqual([]);
    const report = JSON.parse(files['etc/api/tokens.exports.json']);
    expect(report.entry).toBe('tokens');
    expect(Array.isArray(report.exports)).toBe(true);
    expect(report.exports.length).toBeGreaterThan(0);
    expect(files['etc/api/tokens.api.md']).toContain('aura-glass tokens');
  });

  it('rejects an unknown entry with exit 2 and writes nothing', () => {
    let status: number | null = null;
    try {
      execFileSync('node', ['scripts/build/api-report.mjs', '--entry', 'nope'], { cwd: ROOT, stdio: 'pipe' });
    } catch (e) { status = (e as { status: number }).status; }
    expect(status).toBe(2);
    expect(existsSync(join(ROOT, 'etc/api/nope.exports.json'))).toBe(false);
  });
});
