/* CMP-310/422: Avatar — generated for lane 3g (T0/T2 components). */
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
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
    /* REQ-CMP-115 */
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('role')).toBe('img');
    expect(container.querySelector('[role="img"]')).not.toBeNull();
  });

  describe('REQ-CMP-115: fallback keeps the name when the image fails', () => {
    /* The image part is keepMounted, so its own load/error events drive Base
       UI's loading status (jsdom never loads images — fire them by hand). */
    it('src errors → fallback initials exposed as role=img named by `name`', async () => {
      const { container, getByRole } = render(<Avatar.Root src="broken.png" alt="Ada Lovelace" name="Ada Lovelace" />);
      await act(async () => {});
      const img = container.querySelector('img[data-ag-part="image"]')!;
      await act(async () => {
        fireEvent.error(img);
      });
      expect(img.hasAttribute('data-error')).toBe(true);
      expect(container.querySelector('[data-ag-part="fallback"]')!.textContent).toBe('AL');
      const root = getByRole('img', { name: 'Ada Lovelace' });
      expect(root.getAttribute('data-ag-part')).toBe('root');
    });

    it('src loads → the root drops its label (the image alt names the avatar)', async () => {
      const { container } = render(<Avatar.Root src="ok.png" alt="Ada Lovelace" name="Ada Lovelace" />);
      await act(async () => {});
      const img = container.querySelector('img[data-ag-part="image"]')!;
      await act(async () => {
        fireEvent.load(img);
      });
      const root = container.querySelector('[data-ag-part="root"]')!;
      expect(root.hasAttribute('role')).toBe(false);
      expect(root.hasAttribute('aria-label')).toBe(false);
      expect(img.getAttribute('alt')).toBe('Ada Lovelace');
      expect(img.hasAttribute('aria-hidden')).toBe(false);
    });
  });
});
