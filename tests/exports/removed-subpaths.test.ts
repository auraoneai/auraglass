/* @jest-environment node */
/* REQ-PLAT-67: tarball-level check — every v4 subpath the 5.0 map dropped must
   reject with ERR_PACKAGE_PATH_NOT_EXPORTED (not a raw ENOENT). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, read } from '../build/helpers';
import { exportKeyFor } from './ts-exports';

const v4 = JSON.parse(read('build/v4-exports.snapshot.json'));
const pkg = JSON.parse(read('package.json'));

// kept = exported verbatim or through a pattern row (./icons/<cat> via ./icons/*)
const REMOVED = Object.keys(v4).filter((k) => exportKeyFor(pkg.exports, k) === null);

describe('removed-subpaths (tarball)', () => {
  it('the v4 snapshot freezes the 47 keys of aura-glass@4.1.0, each kept as a manifest subpath or removed', () => {
    const keys = Object.keys(v4);
    expect(keys).toHaveLength(47);
    const manifest = new Set(JSON.parse(read('build/exports.manifest.json')).entries.map((e: { subpath: string }) => e.subpath));
    const kept = keys.filter((k) => exportKeyFor(pkg.exports, k) !== null);
    // exact keys are manifest (ENTRIES) subpaths; pattern-matched keys hang off a manifest base entry
    const unmapped = kept.filter((k) => {
      const key = exportKeyFor(pkg.exports, k)!;
      return key === k ? !manifest.has(k) : !manifest.has(key.slice(0, key.lastIndexOf('/')));
    });
    expect(unmapped).toEqual([]);
    expect(REMOVED.length).toBeGreaterThan(0);
  });
  it('every removed v4 subpath rejects with ERR_PACKAGE_PATH_NOT_EXPORTED from a packed install', () => {
    const work = mkdtempSync(join(tmpdir(), 'ag-exports-'));
    try {
      execFileSync('npm', ['pack', '--ignore-scripts', '--pack-destination', work], { cwd: ROOT, stdio: 'pipe' });
      const tgz = join(work, readdirSync(work).find((f) => f.endsWith('.tgz'))!);
      const app = join(work, 'app');
      mkdirSync(app, { recursive: true });
      writeFileSync(join(app, 'package.json'), JSON.stringify({ name: 'app', type: 'module', dependencies: { 'aura-glass': `file:${tgz}` } }));
      execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--legacy-peer-deps'], { cwd: app, stdio: 'pipe' });
      const probe = join(app, 'probe.mjs');
            writeFileSync(probe, `import { createRequire } from 'node:module';
const req = createRequire(import.meta.url);
const subs = ${JSON.stringify(REMOVED)};
for (const s of subs) {
  try { req.resolve('aura-glass' + s.slice(1)); console.log(s + ':RESOLVED'); }
  catch (e) { console.log(s + ':' + (e.code ?? 'UNKNOWN')); }
}`);
      const out = execFileSync('node', [probe], { cwd: app, encoding: 'utf8' });
      const unresolved = out.trim().split('\n').filter((l) => !l.endsWith(':ERR_PACKAGE_PATH_NOT_EXPORTED'));
      expect(unresolved).toEqual([]);
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  }, 180_000);
});
