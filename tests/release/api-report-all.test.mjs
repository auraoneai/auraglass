/* @jest-environment node */
/* tests/release/api-report-all.test.mjs — REQ-PLAT-22 (#127 split, c9f0cea8a):
   `api-report.mjs --all [--check]` enumerates every committed
   etc/api/*.exports.json stem, resolves `root` through the '.' manifest row,
   and is fail-closed (empty corpus, orphan report, stale report → exit 1). */
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { allEntries, entrySource, main } from '../../scripts/build/api-report.mjs';

let root;
let errSpy;
let logSpy;

function write(rel, text) {
  mkdirSync(join(root, rel, '..'), { recursive: true });
  writeFileSync(join(root, rel), text);
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'api-all-'));
  write('package.json', JSON.stringify({ name: 'aura-glass', version: '5.0.0-alpha.0', type: 'module' }));
  write('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'es2022', module: 'esnext' } }));
  write('build/exports.manifest.json', JSON.stringify({
    entries: [
      { subpath: '.', source: 'src/index.ts' },
      { subpath: './a', source: 'src/a/index.ts' },
    ],
  }));
  write('src/index.ts', 'export const Root1 = 1;\nexport function Root2() { return 2; }\n');
  write('src/a/index.ts', 'export const A1 = 1;\nexport const A2 = 2;\n');
  errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  errSpy.mockRestore(); logSpy.mockRestore();
  rmSync(root, { recursive: true, force: true });
});

const errors = () => errSpy.mock.calls.map((c) => c.join(' ')).join('\n');

describe('entrySource root', () => {
  it("resolves the bare 'root' stem through the '.' manifest row", () => {
    expect(entrySource('root', { root })).toEqual({ source: 'src/index.ts', subpath: '.' });
  });
  it("keeps root.<stream> on the per-stream barrel", () => {
    expect(entrySource('root.mat', { root })).toEqual({ source: 'src/root/mat.ts', subpath: './mat' });
  });
  it("returns null for bare 'root' when the manifest has no '.' row", () => {
    write('build/exports.manifest.json', JSON.stringify({ entries: [] }));
    expect(entrySource('root', { root })).toBeNull();
  });
});

describe('allEntries', () => {
  it('lists every committed *.exports.json stem, sorted, ignoring other files', () => {
    write('etc/api/root.exports.json', '{}');
    write('etc/api/a.exports.json', '{}');
    write('etc/api/a.api.md', '');
    write('etc/api/material.css-api.json', '{}');
    expect(allEntries(root)).toEqual(['a', 'root']);
  });
  it('is empty when etc/api is absent', () => {
    expect(allEntries(root)).toEqual([]);
  });
});

describe('api-report --all', () => {
  it('writes, then --all --check passes on the regenerated tree', async () => {
    write('etc/api/root.exports.json', '{}');
    write('etc/api/a.exports.json', '{}');
    expect(await main(['--all'], { root })).toBe(0);
    const rootReport = JSON.parse(readFileSync(join(root, 'etc/api/root.exports.json'), 'utf8'));
    expect(rootReport.entry).toBe('root');
    expect(rootReport.exports).toEqual(['Root1', 'Root2']);
    expect(JSON.parse(readFileSync(join(root, 'etc/api/a.exports.json'), 'utf8')).exports).toEqual(['A1', 'A2']);
    expect(existsSync(join(root, 'etc/api/a.api.md'))).toBe(true);
    expect(await main(['--all', '--check'], { root })).toBe(0);
  });

  it('--all --check fails and names the stale file when an export is added', async () => {
    write('etc/api/root.exports.json', '{}');
    write('etc/api/a.exports.json', '{}');
    expect(await main(['--all'], { root })).toBe(0);
    write('src/a/index.ts', 'export const A1 = 1;\nexport const A2 = 2;\nexport const A3 = 3;\n');
    expect(await main(['--all', '--check'], { root })).toBe(1);
    expect(errors()).toContain('etc/api/a.exports.json');
    expect(errors()).not.toContain('etc/api/root.exports.json');
  });

  it('--check does not write', async () => {
    write('etc/api/a.exports.json', '{"stale":true}');
    expect(await main(['--all', '--check'], { root })).toBe(1);
    expect(readFileSync(join(root, 'etc/api/a.exports.json'), 'utf8')).toBe('{"stale":true}');
    expect(existsSync(join(root, 'etc/api/a.api.md'))).toBe(false);
  });

  it('fails closed on an empty corpus instead of passing vacuously', async () => {
    expect(await main(['--all', '--check'], { root })).toBe(1);
    expect(errors()).toContain('no etc/api/*.exports.json');
  });

  it('fails on a committed report whose stem has no ENTRIES row', async () => {
    write('etc/api/a.exports.json', '{}');
    write('etc/api/gone.exports.json', '{}');
    expect(await main(['--all'], { root })).toBe(1);
    expect(errors()).toContain('gone');
    // nothing was written for the valid stem either: the run aborted first
    expect(readFileSync(join(root, 'etc/api/a.exports.json'), 'utf8')).toBe('{}');
  });

  it('usage error (2) without --entry/--all/--line', async () => {
    expect(await main([], { root })).toBe(2);
  });

  it('unknown --entry is a usage error (2)', async () => {
    expect(await main(['--entry', 'nope'], { root })).toBe(2);
    expect(existsSync(join(root, 'etc/api/nope.exports.json'))).toBe(false);
  });
});
