/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { DIST, ensureBuilt, walk } from '../build/helpers';

describe('react 19: public ref props are React.Ref<T> (PLAT-271)', () => {
  it('0 LegacyRef/MutableRefObject in emitted d.ts', () => {
    ensureBuilt();
    const hits = walk(DIST, p => p.endsWith('.d.ts'))
      .filter(f => /\b(LegacyRef|MutableRefObject)\b/.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });
});
