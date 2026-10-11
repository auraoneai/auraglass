/* CMP-296/420: Heading — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Heading } from './index';

describe('Heading', () => {
  for (const lvl of [1, 2, 3, 4, 5, 6] as const) {
    it(`level ${lvl} renders h${lvl}`, () => {
      const { container, unmount } = render(<Heading level={lvl}>T</Heading>);
      const el = container.querySelector('[data-ag-part="root"]')!;
      expect(el.tagName).toBe('H' + lvl);
      expect(el.getAttribute('data-ag-level')).toBe(String(lvl));
      unmount();
    });
  }
  it('size is independent of level (display on h3)', () => {
    const { container } = render(<Heading level={3} size="display">T</Heading>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.tagName).toBe('H3');
    expect(el.getAttribute('data-ag-size')).toBe('display');
  });
  it('derives size from level when unset (REQ-CMP-111)', () => {
    const cases: Array<[1 | 2 | 3 | 4 | 5 | 6, string]> = [
      [1, 'title-1'], [2, 'title-2'], [3, 'title-3'], [6, 'title-3'],
    ];
    for (const [level, expected] of cases) {
      const { container, unmount } = render(<Heading level={level}>T</Heading>);
      const el = container.querySelector('[data-ag-part="root"]')!;
      expect(el.tagName).toBe(`H${level}`);
      expect(el.getAttribute('data-ag-size')).toBe(expected);
      unmount();
    }
  });
  it('supports title-1..3 sizes', () => {
    for (const s of ['title-1', 'title-2', 'title-3'] as const) {
      const { container, unmount } = render(<Heading level={2} size={s}>T</Heading>);
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-size')).toBe(s);
      unmount();
    }
  });
});
