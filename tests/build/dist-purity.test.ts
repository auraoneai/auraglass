/* @jest-environment node */
/* REQ-PLAT-65: dist contains only build outputs — no src seeds, fixtures,
   test files, or scratch artifacts. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from './helpers';

describe('dist-purity', () => {
  it('no test/fixture/seed artifacts under dist', () => {
    ensureBuilt();
    const bad = walk(DIST, (p) =>
      /\.(test|spec)\.(js|ts)|__tests__|fixtures|\.seed\.|\.bak$|\.tmp$/.test(p));
    expect(bad).toEqual([]);
  });
  it('no emitted file references the seed contract module', () => {
    ensureBuilt();
    const seeded = walk(DIST, (p) => p.endsWith('.js')).filter((p) =>
      readFileSync(p, 'utf8').includes('@ag-contract-seed'));
    expect(seeded).toEqual([]);
  });
});

describe('seed-skipped entries are reported (REQ-PLAT-65)', () => {
  it('generate-exports --list-entries prints every pending entry with a reason', () => {
    const out = execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries'], {
      cwd: ROOT, encoding: 'utf8',
    });
    const pendingSection = out.split('pending (seed graph / missing):')[1] ?? '';
    // every pending line is "<subpath>  <reason>" — never a silent drop
    const lines = pendingSection.split('\n').filter((l) => l.trim().startsWith('./') || l.trim() === '.');
    expect(lines.length).toBeGreaterThan(0);
    const noReason = lines.filter((l) => !/import graph contains|missing source|pending:/.test(l));
    expect(noReason).toEqual([]);
  });
});
