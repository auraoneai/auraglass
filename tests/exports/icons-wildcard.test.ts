/* @jest-environment node */
/* REQ-PLAT-67: the ./icons/* wildcard row resolves glyph modules. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';
import { exportKeyFor } from './ts-exports';

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

describe('./icons/* wildcard', () => {
  it('the wildcard row is present with types+default', () => {
    expect(pkg.exports['./icons/*']).toEqual({ types: './dist/icons/*.d.ts', default: './dist/icons/*.js' });
  });
  it('every wildcard-resolvable glyph target exists in dist', () => {
    ensureBuilt();
    const missing: string[] = [];
    for (const f of walk(join(DIST, 'icons'), (p) => p.endsWith('.js'))) {
      const rel = f.replace(DIST + '/', 'dist/');
      if (!existsSync(join(DIST, rel.replace('dist/', '').replace(/\.js$/, '.d.ts')))) missing.push(rel);
    }
    expect(missing).toEqual([]);
  });
  it('./icons/* is the only pattern row', () => {
    expect(Object.keys(pkg.exports).filter((k) => k.includes('*'))).toEqual(['./icons/*']);
  });
  it('the 4.x category subpaths (./icons/<cat>) resolve through the wildcard to built barrels', () => {
    ensureBuilt();
    const missing: string[] = [];
    for (const cat of ['action', 'ai', 'collaboration', 'commerce', 'data', 'media', 'navigation', 'status']) {
      const key = exportKeyFor(pkg.exports, `./icons/${cat}`);
      if (key !== './icons/*') { missing.push(`./icons/${cat}: matched ${key}`); continue; }
      for (const cond of ['types', 'default'] as const) {
        const target = (pkg.exports[key][cond] as string).replace('*', cat).replace(/^\.\//, '');
        if (!existsSync(join(ROOT, target))) missing.push(`./icons/${cat} ${cond} -> ${target}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
