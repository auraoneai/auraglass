/* @jest-environment node */
/* PLAT-253 (REQ-PLAT-66): d.ts hygiene — no tsconfig aliases, no @/ imports,
   every relative specifier resolves to a sibling d.ts, and the types graph is
   path-identical to the runtime graph. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DIST, ensureBuilt, walk } from './helpers';

describe('d.ts hygiene (PLAT-253)', () => {
  it('no emitted d.ts references tsconfig path aliases', () => {
    ensureBuilt();
    const bad: string[] = [];
    for (const f of walk(DIST, p => p.endsWith('.d.ts'))) {
      for (const m of readFileSync(f, 'utf8').matchAll(/['"]([^'"]+)['"]/g)) {
        const spec = m[1];
        if (spec.startsWith('@/') || spec === 'aura-glass' || spec.startsWith('aura-glass/')) bad.push(`${f}: ${spec}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('the types graph mirrors the runtime graph (x.js <-> x.d.ts)', () => {
    const js = walk(DIST, p => p.endsWith('.js')).map(p => p.replace(/\.js$/, ''));
    const missing = js.filter(stem => !existsSync(stem + '.d.ts') && !existsSync(stem.replace(/\/index$/, '/index.d.ts')));
    // pending seed entries legitimately lack a js+d.ts pair; every EMITTED js must twin.
    expect(missing).toEqual([]);
  });

  it('every relative d.ts specifier resolves to an emitted d.ts', () => {
    const bad: string[] = [];
    for (const f of walk(DIST, p => p.endsWith('.d.ts'))) {
      for (const m of readFileSync(f, 'utf8').matchAll(/from\s*['"]([^'"]+)['"]/g)) {
        const spec = m[1];
        if (!spec.startsWith('.')) continue;
        const stem = resolve(dirname(f), spec);
        if (!(existsSync(stem) || existsSync(stem + '.d.ts') || existsSync(stem + '/index.d.ts') || existsSync(stem.replace(/\.js$/, '.d.ts')))) bad.push(`${f}: ${spec}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

/* REQ-PLAT-66: JSX-namespace hygiene — emitted d.ts must reference React.JSX
   (import-qualified), never the bare global JSX namespace. */
describe('jsx namespace hygiene (REQ-PLAT-66)', () => {
  it('no bare JSX.* references leak the global namespace', () => {
    ensureBuilt();
    const bad: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.d.ts'))) {
      for (const [i, line] of readFileSync(f, 'utf8').split('\n').entries()) {
        // React.JSX.* is fine; a bare JSX.* (no qualifier) leaks the global
        if (/(?<![\w.])JSX\./.test(line) && !/React\.JSX\./.test(line)) bad.push(`${f}:${i + 1}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
