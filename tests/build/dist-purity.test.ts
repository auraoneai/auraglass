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
    /* REQ-FIN-06 (cc300eb93/7d133756e): the report is the "excluded entries:" section
       (seed closure, missing source or ga gate); one "<subpath>  <reason>" row per entry. */
    const section = out.split('excluded entries:')[1] ?? '';
    expect(section).not.toBe('');
    const lines = section.split('\n').filter((l) => /^ {2}\.(\/|\s|$)/.test(l));
    const json = JSON.parse(execFileSync('node', ['scripts/build/generate-exports.mjs', '--list-entries', '--json'], {
      cwd: ROOT, encoding: 'utf8',
    })) as { excluded: { subpath: string }[] };
    // every excluded entry is printed — never a silent drop
    expect(lines.map((l) => l.trim().split(/\s+/)[0])).toEqual(json.excluded.map((x) => x.subpath));
    const noReason = lines.filter((l) => !/import graph contains|missing source|ga:'[^']+' > /.test(l));
    expect(noReason).toEqual([]);
    expect(lines.filter((l) => l.includes('[STALE'))).toEqual([]);
  });
});
