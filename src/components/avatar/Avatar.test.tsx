/* CMP-310/422: Avatar — generated for lane 3g (T0/T2 components). */
import { describe, expect, it, jest } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { Avatar } from './index';

describe('Avatar', () => {
  it('renders root + auto-composed image/fallback parts', () => {
    const { container } = render(<Avatar.Root src="x.png" alt="Ada" />);
    expect(container.querySelector('[data-ag-part="root"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="image"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="fallback"]')).not.toBeNull();
  });
  it('src without alt logs a dev warning', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Avatar.Root src="x.png" />);
    expect(spy.mock.calls.some((c) => String(c[0]).includes('alt'))).toBe(true);
    spy.mockRestore();
  });
  it('name initials land on the fallback with aria-label', async () => {
    const { container } = render(<Avatar.Root name="Ada Lovelace" />);
    await act(async () => {});
    const fb = container.querySelector('[data-ag-part="fallback"]')!;
    expect(fb.textContent).toBe('AL');
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('aria-label')).toBe('Ada Lovelace');
  });
});
