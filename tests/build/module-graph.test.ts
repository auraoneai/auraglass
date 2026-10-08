/* @jest-environment node */
/* PLAT-249 (REQ-PLAT-65): unbundle shape — every emitted .js maps to a src file,
   no shared chunks, every relative specifier resolves inside dist. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DIST, ensureBuilt, walk, withBuildLock } from './helpers';

const SPEC_RE = /(?:import|export)[\s\S]*?from\s*['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;

/** read with one retry: a concurrent worker's rebuild may briefly remove a file. */
const read = (f: string) => {
  try { return readFileSync(f, 'utf8'); } catch { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150); return readFileSync(f, 'utf8'); }
};

describe('module graph (PLAT-249)', () => {
  it('emits no shared chunks', () => {
    ensureBuilt();
    const chunks = walk(DIST, p => p.endsWith('.js')).filter(f => /chunk-[\w-]+\.js$|__common/.test(f));
    expect(chunks).toEqual([]);
  });

  it('every relative specifier resolves to an emitted file', () => {
    const missing = withBuildLock(() => {
      const all = new Set(walk(DIST));
      const out: string[] = [];
      for (const f of walk(DIST).filter(p => p.endsWith('.js'))) {
        for (const m of readFileSync(f, 'utf8').matchAll(SPEC_RE)) {
          const spec = m[1] ?? m[2];
          if (!spec?.startsWith('.')) continue;
          const base = resolve(dirname(f), spec);
          if (!(all.has(base) || all.has(base + '.js') || all.has(base + '/index.js') || all.has(base + '.css'))) out.push(`${f} -> ${spec}`);
        }
      }
      return out;
    });
    expect(missing).toEqual([]);
  });

  it('emitted files only ever reference in-package or external specifiers', () => {
    const bad = withBuildLock(() => {
      const out: string[] = [];
      for (const f of walk(DIST).filter(p => p.endsWith('.js'))) {
        for (const m of readFileSync(f, 'utf8').matchAll(SPEC_RE)) {
          const spec = m[1] ?? m[2];
          if (spec?.startsWith('..') && !resolve(dirname(f), spec).startsWith(DIST)) out.push(`${f} -> ${spec}`);
          if (spec?.startsWith('/')) out.push(`${f} -> absolute ${spec}`);
        }
      }
      return out;
    });
    expect(bad).toEqual([]);
  });
});
