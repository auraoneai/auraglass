/* CMP-307: Skeleton — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Skeleton } from './index';

describe('Skeleton', () => {
  it('is aria-hidden with data-ag-shape', () => {
    for (const shape of ['text', 'rect', 'circle'] as const) {
      const { container, unmount } = render(<Skeleton shape={shape} />);
      const el = container.querySelector('[data-ag-part="root"]')!;
      expect(el.getAttribute('aria-hidden')).toBe('true');
      expect(el.getAttribute('data-ag-shape')).toBe(shape);
      unmount();
    }
  });
  it('lines>1 renders line parts', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.querySelectorAll('[data-ag-part="line"]').length).toBe(3);
  });
});
