/* tests/registry/certification.test.ts — REQ-PLAT-97: the render gate's
   per-(item, project) records aggregate into the artifact build.mjs consumes.
   The pass flag is the conjunction over every expected project. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DEFAULT_PROJECTS, aggregate, certifiedNames, recordFile } from '../../scripts/registry/certification.mjs';

const SHA = 'a'.repeat(40);
const rec = (item: string, project: string, status = 'passed', sha = SHA) => ({ item, project, sha, status });

describe('aggregate', () => {
  it('passes an item only when every project passed for this sha', () => {
    const records = [
      rec('good', 'registry-chromium'), rec('good', 'registry-webkit'),
      rec('half', 'registry-chromium'), rec('half', 'registry-webkit', 'failed'),
      rec('timeout', 'registry-chromium', 'timedOut'), rec('timeout', 'registry-webkit'),
      rec('stale', 'registry-chromium', 'passed', 'b'.repeat(40)), rec('stale', 'registry-webkit'),
      rec('lonely', 'registry-chromium'),
    ];
    const c = aggregate({ items: ['good', 'half', 'timeout', 'stale', 'lonely', 'never'], records, sha: SHA });
    expect(Object.entries(c.items).filter(([, v]: any) => v.pass).map(([k]) => k)).toEqual(['good']);
    expect(c.items.half?.reasons).toEqual(['registry-webkit: failed']);
    expect(c.items.timeout?.reasons).toEqual(['registry-chromium: timedOut']);
    expect(c.items.stale?.reasons).toEqual([`registry-chromium: recorded for ${'b'.repeat(40)}, not ${SHA}`]);
    expect(c.items.lonely?.reasons).toEqual(['registry-webkit: no record']);
    expect(c.items.never?.projects).toEqual({ 'registry-chromium': 'missing', 'registry-webkit': 'missing' });
    expect(c).toMatchObject({ version: 1, sha: SHA, projects: DEFAULT_PROJECTS });
  });
  it('refuses to aggregate without a sha', () => {
    expect(() => aggregate({ items: ['x'], records: [], sha: '' })).toThrow(/no sha/);
  });
});

describe('certifiedNames', () => {
  it('returns passing names for the matching sha and throws on a foreign artifact', () => {
    const cert = aggregate({ items: ['a', 'b'], records: [rec('a', 'registry-chromium'), rec('a', 'registry-webkit')], sha: SHA });
    expect([...certifiedNames(cert, SHA)]).toEqual(['a']);
    expect(() => certifiedNames(cert, 'c'.repeat(40))).toThrow(/is for a+, the build is for c+/);
    expect(() => certifiedNames({ version: 2 }, SHA)).toThrow(/unsupported shape/);
    expect(certifiedNames(null, SHA).size).toBe(0);
  });
});

describe('CLI', () => {
  it('reads CI_COMMIT_SHA (never GITHUB_SHA), the index and the record dir, and writes the artifact', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-cert-'));
    try {
      mkdirSync(join(dir, 'records'));
      for (const p of DEFAULT_PROJECTS) writeFileSync(recordFile(join(dir, 'records'), 'app-frame', p), JSON.stringify(rec('app-frame', p)));
      writeFileSync(join(dir, 'records', 'broken--registry-chromium.json'), '{');
      writeFileSync(join(dir, 'index.json'), JSON.stringify({ items: [
        { name: 'auraglass', type: 'registry:base' }, { name: 'app-frame', type: 'registry:block' }, { name: 'kanban', type: 'registry:item' },
      ] }));
      const run = (env: Record<string, string>) => spawnSync(process.execPath, ['scripts/registry/certification.mjs', '--records', join(dir, 'records'), '--index', join(dir, 'index.json'), '--out', join(dir, 'out/cert.json')], {
        encoding: 'utf8', env: { PATH: process.env.PATH ?? '', ...env },
      });
      expect(run({ GITHUB_SHA: SHA }).status).toBe(64);
      const r = run({ CI_COMMIT_SHA: SHA });
      expect(r.status).toBe(0);
      expect(r.stdout).toContain('1/2 item(s) pass every project');
      const cert = JSON.parse(readFileSync(join(dir, 'out/cert.json'), 'utf8'));
      expect(Object.keys(cert.items)).toEqual(['app-frame', 'kanban']);
      expect(cert.items['app-frame'].pass).toBe(true);
      expect(cert.items.kanban.pass).toBe(false);
      expect(cert.malformed).toEqual(['broken--registry-chromium.json']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
