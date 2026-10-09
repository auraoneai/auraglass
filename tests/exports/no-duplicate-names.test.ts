/* @jest-environment node */
/* REQ-PLAT-67: no two export rows resolve to the same dist target (duplicate
   module twins would double-instantiate). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../build/helpers';

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

describe('no-duplicate-names', () => {
  it('no two export rows share a default target', () => {
    const seen = new Map<string, string>();
    const dups: string[] = [];
    for (const [sub, cond] of Object.entries(pkg.exports)) {
      const target = typeof cond === 'string' ? cond : (cond as Record<string, string>).default;
      if (!target || target.includes('*')) continue;
      const prev = seen.get(target);
      if (prev) dups.push(`${target}: ${prev} + ${sub}`);
      else seen.set(target, sub);
    }
    expect(dups).toEqual([]);
  });
  it('no export row duplicates its own subpath as target', () => {
    const self = Object.keys(pkg.exports).filter((k) => pkg.exports[k] === k && !k.endsWith('.json'));
    expect(self).toEqual([]);
  });
});
