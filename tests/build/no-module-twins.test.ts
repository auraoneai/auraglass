/* @jest-environment node */
/* REQ-PLAT-65: no two src/ files differ only by .ts/.tsx/.js (a twin makes the
   resolver pick one silently), and no module is emitted at two dist paths with
   identical content (a real twin double-instantiates module state). */
import { describe, expect, it } from '@jest/globals';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { DIST, ROOT, SRC, ensureBuilt, walk } from './helpers';

describe('no-module-twins (REQ-PLAT-65)', () => {
  it('no src basename exists with more than one of .ts/.tsx/.js/.jsx/.mjs', () => {
    const byStem = new Map<string, string[]>();
    for (const f of walk(SRC, (p) => /\.(tsx?|jsx?|mjs)$/.test(p) && !p.endsWith('.d.ts'))) {
      const stem = relative(ROOT, f).replace(/\.(tsx?|jsx?|mjs)$/, '');
      byStem.set(stem, [...(byStem.get(stem) ?? []), relative(ROOT, f)]);
    }
    expect([...byStem.values()].filter((v) => v.length > 1)).toEqual([]);
  });

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
