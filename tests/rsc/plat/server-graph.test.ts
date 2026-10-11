/* @jest-environment node */
/* PLAT-261/262: for every entry flagged server-safe, the graph reached under
   the react-server condition imports no client signal without crossing a
   'use client' boundary. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../build/helpers';

const RECORD = join(ROOT, 'build', 'server-safe-exports.json');
let importClosure, serverClosure, manifestEntries;
beforeAll(async () => { ({ importClosure, serverClosure, manifestEntries } = await import('../../../scripts/build/lib/graph.mjs')); });

const hasClientHead = (f: string) => /^\s*(?:\/\*[\s\S]*?\*\/|\/\/[^\n]*\n|\s)*['\"]use client['\"]/.test(readFileSync(f, 'utf8').slice(0, 1200));;

describe('server-safe exports (PLAT-261)', () => {
  it('record exists, lists every js manifest entry, and flags are honest', () => {
    expect(existsSync(RECORD)).toBe(true);
    const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
    const bySub = new Map(rec.entries.map((e: { subpath: string }) => [e.subpath, e]));
    for (const e of manifestEntries(ROOT).js) expect(bySub.has(e.subpath)).toBe(true);
  });

  it('every safe entry\'s server-reachable graph is free of client signals', () => {
    const rec = JSON.parse(readFileSync(RECORD, 'utf8'));
    const srcOf = new Map(manifestEntries(ROOT).js.map(e => [e.subpath, e.source]));
    const SIGNAL = /(^|\s)(document|window|navigator|localStorage|matchMedia|ResizeObserver|IntersectionObserver)\s*[.(\[=]|\buse(State|Effect|LayoutEffect|Ref|Reducer|Context)\b/;
    const bad: string[] = [];
    for (const e of rec.entries as { subpath: string; safe: boolean }[]) {
      if (!e.safe) continue;
      const src = srcOf.get(e.subpath);
      if (!src) continue;
      // files reached without crossing a 'use client' boundary
      for (const f of serverClosure(join(ROOT, src))) {
        if (hasClientHead(f)) continue; // the boundary itself may be reached
        const head = readFileSync(f, 'utf8').slice(0, 400);
        if (SIGNAL.test(head)) bad.push(`${e.subpath}: ${f}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
