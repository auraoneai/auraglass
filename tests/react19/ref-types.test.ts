/* @jest-environment node */
/* REQ-PLAT-72 (PLAT-271): public ref types are React.Ref<T> — 0
   LegacyRef / MutableRefObject in any emitted d.ts (all of dist, no filter). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { DIST, ROOT, ensureBuilt, walk } from '../build/helpers';

describe('react 19: public ref props are React.Ref<T> (PLAT-271)', () => {
  it('0 LegacyRef/MutableRefObject in emitted d.ts', () => {
    ensureBuilt();
    const dts = walk(DIST, p => p.endsWith('.d.ts'));
    expect(dts.length).toBeGreaterThan(0);
    const hits = dts
      .filter(f => /\b(LegacyRef|MutableRefObject)\b/.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(`${ROOT}/`, ''));
    expect(hits).toEqual([]);
  }, 300_000);
});
