/* @jest-environment node */
/* REQ-PLAT-66: foundation subpaths (tokens/, contracts/) emit only declaration
   types — no runtime js under dist/tokens or dist/contracts that could leak
   into a runtime import graph. */
import { describe, expect, it } from '@jest/globals';
import { join } from 'node:path';
import { DIST, ensureBuilt, walk } from '../build/helpers';

describe('no-foundation-types', () => {
  it('dist/contracts emits d.ts only', () => {
    ensureBuilt();
    const js = walk(join(DIST, 'contracts'), (p) => p.endsWith('.js'));
    expect(js).toEqual([]);
  });
  it('no emitted d.ts exports the private foundation namespace', () => {
    ensureBuilt();
    const bad: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.d.ts'))) {
      if (/foundation\//.test(f) || /from ['"][^'"]*foundation/.test(require('node:fs').readFileSync(f, 'utf8'))) {
        bad.push(f);
      }
    }
    expect(bad).toEqual([]);
  });
});
