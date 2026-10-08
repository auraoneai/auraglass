/* @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { ROOT, SRC, walk } from '../build/helpers';

describe('react 19: no element.ref reads (PLAT-271)', () => {
  it('0 .ref reads on ReactElement in PLAT-owned src paths', () => {
    const hits = walk(SRC, p => /\.tsx?$/.test(p))
      .filter(f => /\b\w+\.ref\b(?!\s*=)/.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(`${ROOT}/`, ''))
      .filter(f => /^src\/(internal|contracts|tokens|compat)\//.test(f));
    expect(hits).toEqual([]);
  });
});
