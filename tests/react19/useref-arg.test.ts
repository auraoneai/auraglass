/* @jest-environment node */
/* REQ-PLAT-72 (PLAT-271): React 19 requires an argument to useRef — 0
   argument-less useRef() / useRef<T>() calls in all of src/ (no path filter). */
import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { ROOT } from '../build/helpers';
import { srcFiles } from '../../scripts/ci/lib/react19-gate.mjs';

const NO_ARG_USEREF = /\buseRef\s*(?:<[^>]+>)?\s*\(\s*\)/;

describe('react 19: useRef requires an argument (PLAT-271)', () => {
  it('the pattern catches useRef() and useRef<T>(), not useRef(null)', () => {
    expect(NO_ARG_USEREF.test('const r = useRef();')).toBe(true);
    expect(NO_ARG_USEREF.test('const r = React.useRef<HTMLDivElement>();')).toBe(true);
    expect(NO_ARG_USEREF.test('const r = useRef<HTMLDivElement | null>(null);')).toBe(false);
  });

  it('0 argument-less useRef() in all of src/', () => {
    const hits = srcFiles(ROOT)
      .filter(f => NO_ARG_USEREF.test(readFileSync(f, 'utf8')))
      .map(f => f.replace(`${ROOT}/`, ''));
    expect(hits).toEqual([]);
  });
});
