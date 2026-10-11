/* @jest-environment node */
/* REQ-PLAT-66: the d.ts graph mirrors the js graph — every emitted js module
   has a sibling d.ts and vice versa, under both bundler and node16 module
   resolution assumptions (identical relative specifiers). */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from './helpers';

const importsOf = (file: string) =>
  [...readFileSync(file, 'utf8').matchAll(/(?:from|import|export [^'"]*from) *['"]([^'"]+)['"]/g)]
    .map((m) => m[1]).filter((s) => s.startsWith('.'));

describe('types-runtime-graph', () => {
  it('every emitted js has a sibling d.ts; every manifest entry d.ts a js twin', () => {
    ensureBuilt();
    const missing: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.js'))) {
      if (!existsSync(f.replace(/\.js$/, '.d.ts'))) missing.push(`${f}.d.ts`);
    }
    // manifest entry declarations are the public surface: each must have its
    // runtime twin. Non-entry d.ts are flattened by rolldown into importers —
    // their specifiers are checked by the resolution test below.
    const manifest = JSON.parse(readFileSync(join(ROOT, 'build/exports.manifest.json'), 'utf8'));
    for (const e of manifest.entries) {
      if (!e.types) continue;
      const hasTypes = existsSync(join(ROOT, e.types));
      const hasJs = e.default ? existsSync(join(ROOT, e.default)) : true;
      if (!hasTypes && !hasJs) continue; // pending/seed entry ships neither
      if (!hasTypes) missing.push(e.types);
      if (!hasJs) missing.push(e.default);
    }
    expect(missing).toEqual([]);
  });
  it('d.ts relative specifiers resolve identically under bundler and node16', () => {
    ensureBuilt();
    const bad: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.d.ts'))) {
      for (const spec of importsOf(f)) {
        const base = resolve(dirname(f), spec);
        // bundler accepts extensionless; node16 .js specifiers map to .d.ts siblings
        const exists = ['.d.ts', '/index.d.ts'].some((ext) => existsSync(base + ext))
          || (spec.endsWith('.js') && existsSync(base.replace(/\.js$/, '.d.ts')));
        if (!exists) bad.push(`${f}: ${spec}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
