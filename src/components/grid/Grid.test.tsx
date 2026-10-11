/* CMP-298: Grid — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Grid } from './index';

describe('Grid', () => {
  it('number columns emits data-cols', () => {
    const { container } = render(<Grid columns={3}>x</Grid>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-cols')).toBe('3');
    expect(el.getAttribute('data-ag-appearance')).toBe('standard');
  });
  it('responsive object emits base/sm/md/lg attrs', () => {
    const { container } = render(<Grid columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>x</Grid>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-cols-base')).toBe('1');
    expect(el.getAttribute('data-cols-sm')).toBe('2');
    expect(el.getAttribute('data-cols-md')).toBe('3');
    expect(el.getAttribute('data-cols-lg')).toBe('4');
  });
  it('minItemWidth marks auto-fill mode', () => {
    const { container } = render(<Grid minItemWidth={200}>x</Grid>);
    expect(container.querySelector('[data-ag-part="root"]')!.hasAttribute('data-min-item')).toBe(true);
  });
  it('masonry variant absorbs the masonry grid', () => {
    const { container } = render(<Grid variant="masonry" columns={3}>x</Grid>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-appearance')).toBe('masonry');
  });
});
