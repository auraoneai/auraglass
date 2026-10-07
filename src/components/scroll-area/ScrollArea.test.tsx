/* CMP-315: ScrollArea — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { ScrollArea } from './index';

describe('ScrollArea', () => {
  it('renders root/viewport/scrollbar/thumb parts (keepMounted)', () => {
    const { container } = render(
      <ScrollArea.Root>
        <ScrollArea.Viewport><div>content</div></ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" keepMounted><ScrollArea.Thumb /></ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );
    for (const p of ['root', 'viewport', 'scrollbar', 'thumb']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).not.toBeNull();
    }
  });
  it('viewport is not keyboard-focusable beyond BU tabindex=-1 when not overflowing', () => {
    const { container } = render(
      <ScrollArea.Root><ScrollArea.Viewport><div>x</div></ScrollArea.Viewport></ScrollArea.Root>,
    );
    const vp = container.querySelector('[data-ag-part="viewport"]')!;
    expect(vp.getAttribute('tabindex')).not.toBe('0');
  });
  it('viewport gains tabindex=0 when content overflows', () => {
    const orig = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight');
    const orig2 = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight');
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get() { return 500; } });
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, get() { return 100; } });
    try {
      const { container } = render(
        <ScrollArea.Root><ScrollArea.Viewport><div>x</div></ScrollArea.Viewport></ScrollArea.Root>,
      );
      const vp = container.querySelector('[data-ag-part="viewport"]')!;
      expect(vp.getAttribute('tabindex')).toBe('0');
    } finally {
      if (orig) Object.defineProperty(HTMLElement.prototype, 'scrollHeight', orig);
      if (orig2) Object.defineProperty(HTMLElement.prototype, 'clientHeight', orig2);
    }
  });
});
