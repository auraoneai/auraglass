/* @jest-environment node */
/* REQ-PLAT-67: the ./icons/* wildcard row resolves glyph modules. */
import { describe, expect, it } from '@jest/globals';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';

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
  it('icon category barrels resolve (./icons/<cat> rows)', () => {
    const missing: string[] = [];
    for (const cat of ['action', 'ai', 'collaboration', 'commerce', 'data', 'media', 'navigation', 'status']) {
      const row = pkg.exports[`./icons/${cat}`];
      if (!row) continue;
      if (!existsSync(join(ROOT, row.default.replace('./', '')))) missing.push(cat);
    }
    expect(missing).toEqual([]);
  });
});
