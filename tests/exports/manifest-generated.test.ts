/* @jest-environment node */
/* REQ-PLAT-67 (PLAT-255/257): package.json#exports is exactly the output of
   scripts/build/generate-exports.mjs over build/exports.manifest.json, and
   --check fails on any drift (a hand-added condition, a reordered key, a
   top-level main). */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { desiredExports, desiredTopLevel, packageDrift } from '../../scripts/build/generate-exports.mjs';
import { ROOT, read } from '../build/helpers';

const SCRIPT = join(ROOT, 'scripts/build/generate-exports.mjs');
const FIXTURE = join(ROOT, 'tests/integration/fixtures/seed');
const run = (args: string[]) => spawnSync('node', [SCRIPT, ...args], { cwd: ROOT, encoding: 'utf8' });

function withFixture(fn: (dir: string) => void) {
  const dir = mkdtempSync(join(tmpdir(), 'ag-manifest-gen-'));
  cpSync(FIXTURE, dir, { recursive: true });
  try { fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}
const editPkg = (dir: string, f: (p: Record<string, any>) => void) => {
  const p = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  f(p);
  writeFileSync(join(dir, 'package.json'), JSON.stringify(p, null, 2) + '\n');
};

describe('generated exports (REQ-PLAT-67)', () => {
  it('generate-exports --check exits 0 on the repo', () => {
    const r = run(['--check']);
    expect(r.stderr).toBe('');
    expect(r.status).toBe(0);
  });
  it('package.json exports equal the generator output, key order included', () => {
    const pkg = JSON.parse(read('package.json'));
    const want = desiredExports();
    expect(Object.keys(pkg.exports)).toEqual(Object.keys(want));
    expect(pkg.exports).toEqual(want);
    expect(pkg.types).toBe(desiredTopLevel().types);
    expect(packageDrift()).toEqual([]);
  });
  it('JS entries with a css bundle get a string CSS subpath right after them', () => {
    const want = desiredExports();
    const keys = Object.keys(want);
    expect(want['./data']).toEqual({ types: './dist/data/index.d.ts', default: './dist/data/index.js' });
    expect(want['./data.css']).toBe('./dist/data.css');
    expect(keys.indexOf('./data.css')).toBe(keys.indexOf('./data') + 1);
    // '.' -> dist/styles.css is the manifest's own ./styles.css row; not duplicated
    expect(keys.filter((k) => want[k] === './dist/styles.css')).toEqual(['./styles.css']);
  });
  it('--check fails on drift and --write converges', () => {
    const drifts: Array<[string, (p: Record<string, any>) => void, RegExp]> = [
      ['css condition', (p) => { p.exports['.'].css = './dist/styles.css'; }, /exports\["\."\]/],
      ['top-level main', (p) => { p.main = './dist/index.js'; }, /"main": .*want none/],
      ['key order', (p) => { const e = p.exports; p.exports = Object.fromEntries(Object.entries(e).reverse()); }, /key order/],
      ['module field', (p) => { p.module = './dist/index.js'; }, /"module": .*want none/],
    ];
    for (const [name, mutate, re] of drifts) {
      withFixture((dir) => {
        expect(run(['--write', '--root', dir]).status).toBe(0);
        expect(run(['--check', '--root', dir]).status).toBe(0);
        editPkg(dir, mutate);
        const r = run(['--check', '--root', dir]);
        expect([name, r.status]).toEqual([name, 1]);
        expect(r.stderr).toMatch(re);
        expect(run(['--write', '--root', dir]).status).toBe(0);
        expect(run(['--check', '--root', dir]).status).toBe(0);
      });
    }
  });
});
