/* @jest-environment node */
/* REQ-PLAT-65: module graph. Every src module reachable from an emitted entry
   (tests, stories and src/contracts/{seed.tsx,testing.ts,fragments.ts,load-fragments.mjs}
   excluded) maps to exactly one dist/<path>.js; no chunk-* or hashed file.
   Reachability is computed with the TypeScript compiler API at statement level
   (tests/build/ts-graph.ts), mirroring the bundler's moduleSideEffects:false
   tree-shaking: a module emits when an entry demands live runtime code of its
   own; pure forwarding barrels and type-only modules are reachable but own no
   code, so they fold into their importers and emit nothing. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { basename, join, relative } from 'node:path';
import { DIST, ROOT, SRC, ensureBuilt, walk } from './helpers';
import { bindingGraph, isExcludedSource } from './ts-graph';

type Graph = typeof import('../../scripts/build/lib/graph.mjs');
let g: Graph;
let reachable: Set<string>;
let emitting: Set<string>;
let stem: (srcFile: string) => string;

beforeAll(async () => {
  g = await import('../../scripts/build/lib/graph.mjs');
  const { keep } = g.buildableEntries();
  const entries = [...keep, ...g.patternEntries(keep)].map((e: { source: string }) => join(ROOT, e.source));
  ({ reachable, emitting } = bindingGraph(entries, (f) => isExcludedSource(f) || !!g.seamReexportTarget(f)));
  stem = (f) => `dist/${g.distChunkStem(relative(SRC, f).replace(/\.(tsx?|jsx?|mjs)$/, ''))}.js`;
});

const distJs = () => walk(DIST, (p) => p.endsWith('.js')).map((p) => relative(ROOT, p));

describe('preserve-modules (REQ-PLAT-65)', () => {
  it('the reachable set is non-trivial and excludes tests, stories and contract seeds', () => {
    expect(emitting.size).toBeGreaterThan(10);
    const leaked = [...reachable].filter(isExcludedSource).map((f) => relative(ROOT, f));
    expect(leaked).toEqual([]);
  });

  it('no two reachable sources claim the same dist path', () => {
    const owners = new Map<string, string[]>();
    for (const f of reachable) owners.set(stem(f), [...(owners.get(stem(f)) ?? []), relative(ROOT, f)]);
    expect([...owners].filter(([, o]) => o.length > 1)).toEqual([]);
  });

  it('every reachable source with live runtime code emits exactly its dist/<path>.js', () => {
    ensureBuilt();
    const have = new Set(distJs());
    const missing = [...emitting].map(stem).filter((d) => !have.has(d)).sort();
    expect(missing).toEqual([]);
  });

  it('every dist js is the emit of exactly one reachable source (no extra, chunk or hashed file)', () => {
    ensureBuilt();
    const expected = new Set([...emitting].map(stem));
    const extra = distJs().filter((d) => !expected.has(d));
    expect(extra).toEqual([]);
    // a hashed name cannot equal a src-derived path, so the equality above already rejects it
    const shaped = distJs().filter((d) => /^(chunk|rolldown-runtime|rollup)[-_.]/.test(basename(d)) || /(^|\/)_virtual\//.test(d));
    expect(shaped).toEqual([]);
  });
});
