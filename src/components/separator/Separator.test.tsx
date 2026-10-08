/* CMP-302/423: Separator — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Separator } from './index';

describe('Separator', () => {
  it('semantic renders role=separator + aria-orientation', () => {
    const { container } = render(<Separator decorative={false} />);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('role')).toBe('separator');
    expect(el.getAttribute('aria-orientation')).toBe('horizontal');
  });
  it('vertical orientation', () => {
    const { container } = render(<Separator decorative={false} orientation="vertical" />);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('aria-orientation')).toBe('vertical');
  });
  it('decorative collapses to role=none + aria-hidden', () => {
    const { container } = render(<Separator decorative />);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('role')).toBe('none');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});
