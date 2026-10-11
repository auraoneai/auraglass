/* CMP-297: Stack — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Stack } from './index';

describe('Stack', () => {
  it('defaults to column with data-direction', () => {
    const { container } = render(<Stack><i /><i /></Stack>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-direction')).toBe('column');
  });
  it('row direction is RTL-aware via logical properties (data attr only)', () => {
    const { container } = render(<Stack direction="row">x</Stack>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-direction')).toBe('row');
  });
  it('gap=4 emits data-gap', () => {
    const { container } = render(<Stack gap={4}>x</Stack>);
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-gap')).toBe('4');
  });
  it('interleaves aria-hidden separators between children', () => {
    const { container } = render(
      <Stack separator={<hr />}>
        <p>a</p><p>b</p><p>c</p>
      </Stack>,
    );
    const seps = container.querySelectorAll('[data-ag-part="separator"]');
    expect(seps.length).toBe(2);
    for (const s of seps) expect(s.getAttribute('aria-hidden')).toBe('true');
  });
});
