/* @jest-environment node */
/* REQ-PLAT-65: no module is emitted at two dist paths with identical content
   (a real twin double-instantiates module state). */
import { describe, expect, it } from '@jest/globals';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { DIST, ensureBuilt, walk } from './helpers';

describe('no-module-twins', () => {
  it('no two dist js files have identical non-trivial content', () => {
    ensureBuilt();
    const seen = new Map<string, string>();
    const twins: string[] = [];
    for (const f of walk(DIST, (p) => p.endsWith('.js'))) {
      const text = readFileSync(f, 'utf8');
      if (text.length < 64) continue; // tiny re-export shims are allowed
      const key = createHash('sha256').update(text).digest('hex');
      const prev = seen.get(key);
      if (prev) twins.push(`${prev} === ${f}`);
      else seen.set(key, f);
    }
    expect(twins).toEqual([]);
  });
});
