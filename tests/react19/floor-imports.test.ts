/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { DIST, ROOT, SRC, ensureBuilt, walk } from '../build/helpers';

describe('react 19: floor imports (PLAT-271)', () => {
  it('no feature-detected/unstable react API named imports in src or dist (PLAT-owned)', () => {
    ensureBuilt();
    const banned = /import\s*\{[^}]*(unstable_ViewTransition|experimental_useEffectEvent|unstable_getCacheForType|unstable_Activity)[^}]*\}\s*from\s*['"]react['"]/;
    const scan = (dir: string) => walk(dir, p => /\.(js|ts|tsx|d\.ts)$/.test(p))
      .filter(f => banned.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(`${ROOT}/`, ''));
    const hits = [...scan(SRC), ...scan(DIST)]
      .filter(f => /^(src\/(internal|contracts|tokens|compat)|dist\/|scripts\/(build|ci)|build\/)/.test(f));
    expect(hits).toEqual([]);
  }, 120_000);
});
