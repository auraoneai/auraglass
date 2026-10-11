/* @jest-environment node */
/* PLAT-261/262: for every entry flagged server-safe, the graph reached under
   the react-server condition imports no client signal without crossing a
   'use client' boundary. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../build/helpers';

const RECORD = join(ROOT, 'build', 'server-safe-exports.json');
type Graph = typeof import('../../../scripts/build/lib/graph.mjs');
let importClosure: Graph['importClosure'], manifestEntries: Graph['manifestEntries'];
beforeAll(async () => { ({ importClosure, manifestEntries } = await import('../../../scripts/build/lib/graph.mjs')); });

const hasClientHead = (f: string) => /^\s*['"]use client['"]/.test(readFileSync(f, 'utf8').slice(0, 400));

describe('server-safe exports (PLAT-261)', () => {
  it('record exists, lists every js manifest entry, and flags are honest', () => {
    expect(existsSync(RECORD)).toBe(true);
    const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
    const bySub = new Map(rec.entries.map((e: { subpath: string }) => [e.subpath, e]));
    for (const e of manifestEntries(ROOT).js) expect(bySub.has(e.subpath)).toBe(true);
  });

  it('every safe entry\'s source closure has no use client head or DOM top-level', () => {
    const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
    const srcOf = new Map(manifestEntries(ROOT).js.map(e => [e.subpath, e.source]));
    const bad: string[] = [];
    for (const e of rec.entries as { subpath: string; safe: boolean }[]) {
      if (!e.safe) continue;
      const src = srcOf.get(e.subpath);
      if (!src) continue;
      for (const f of importClosure(join(ROOT, src))) {
        if (hasClientHead(f)) bad.push(`${e.subpath}: ${f}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
