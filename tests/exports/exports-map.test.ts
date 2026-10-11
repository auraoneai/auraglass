/* @jest-environment node */
/* REQ-PLAT-67/73: exports-map invariants — generate-exports --list-entries --json
   is manifest-shaped (shipped rows verbatim, every exclusion with a reason, the
   pair partitions the manifest); every built target exists. The --json mode is
   produced by FIN-A (next-fin/a-exports-plat67, #403). */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, ensureBuilt } from '../build/helpers';
import { manifestEntries } from './ts-exports';

const listJson = () => JSON.parse(execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries', '--json'], { cwd: ROOT, encoding: 'utf8' }));

describe('exports map (REQ-PLAT-67)', () => {
  it('--list-entries --json is manifest-shaped and partitions the manifest', () => {
    const d = listJson();
    const manifest = manifestEntries();
    const shipped = new Set(d.entries.map((e: { subpath: string }) => e.subpath));
    expect(d.entries).toEqual(manifest.filter((e) => shipped.has(e.subpath))); // verbatim, manifest order
    for (const x of d.excluded) expect(x.reason).toBeTruthy(); // never silent
    expect([...shipped, ...d.excluded.map((x: { subpath: string }) => x.subpath)].sort()).toEqual(manifest.map((e) => e.subpath).sort());
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    expect(d.exports).toEqual(pkg.exports);
  });
  it('every exported non-pattern JS target exists in dist', () => {
    ensureBuilt();
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const missing: string[] = [];
    for (const [sub, cond] of Object.entries(pkg.exports)) {
      if (typeof cond === 'string' || sub.includes('*')) continue; // css/json artifacts; ./icons/* is checked in icons-wildcard
      for (const k of ['types', 'default'] as const) {
        const t = (cond as Record<string, string>)[k];
        if (!t || !existsSync(join(ROOT, t))) missing.push(`${sub} ${k} -> ${t}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
