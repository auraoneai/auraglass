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

describe('ScrollArea REQ-CMP-122', () => {
  const RO = globalThis.ResizeObserver;
  afterEach(() => { globalThis.ResizeObserver = RO; });

  it('warns once when the viewport overflows unlabeled', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    // make jsdom elements report overflow
    const proto = HTMLElement.prototype;
    const sh = Object.getOwnPropertyDescriptor(proto, 'scrollHeight')!;
    const ch = Object.getOwnPropertyDescriptor(proto, 'clientHeight')!;
    Object.defineProperty(proto, 'scrollHeight', { configurable: true, get: () => 500 });
    Object.defineProperty(proto, 'clientHeight', { configurable: true, get: () => 100 });
    globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as any;
    try {
      render(
        <ScrollArea.Root>
          <ScrollArea.Viewport><div /></ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0][0])).toContain('ScrollArea');
    } finally {
      Object.defineProperty(proto, 'scrollHeight', sh);
      Object.defineProperty(proto, 'clientHeight', ch);
      warn.mockRestore();
    }
  });

  it('does not warn when aria-label is present', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const proto = HTMLElement.prototype;
    const sh = Object.getOwnPropertyDescriptor(proto, 'scrollHeight')!;
    const ch = Object.getOwnPropertyDescriptor(proto, 'clientHeight')!;
    Object.defineProperty(proto, 'scrollHeight', { configurable: true, get: () => 500 });
    Object.defineProperty(proto, 'clientHeight', { configurable: true, get: () => 100 });
    globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as any;
    try {
      render(
        <ScrollArea.Root>
          <ScrollArea.Viewport aria-label="list"><div /></ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
      expect(warn).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(proto, 'scrollHeight', sh);
      Object.defineProperty(proto, 'clientHeight', ch);
      warn.mockRestore();
    }
  });
});
