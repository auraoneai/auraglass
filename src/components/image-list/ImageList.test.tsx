/* CMP-308/424: ImageList — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { ImageList } from './index';

describe('ImageList', () => {
  it('renders root/item parts', () => {
    const { container } = render(
      <ImageList cols={3}>
        <ImageList.Item><img alt="a" /></ImageList.Item>
      </ImageList>,
    );
    expect(container.querySelector('[data-ag-part="root"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="item"]')).not.toBeNull();
  });
  it('ItemBar declares data-ag-backdrop="media" and text parts', () => {
    const { container } = render(
      <ImageList>
        <ImageList.Item>
          <img alt="a" />
          <ImageList.ItemBar title="T" subtitle="S" actionIcon={<button>go</button>} />
        </ImageList.Item>
      </ImageList>,
    );
    const bar = container.querySelector('[data-ag-part="item-bar"]')!;
    expect(bar.getAttribute('data-ag-backdrop')).toBe('media');
    expect(container.querySelector('[data-ag-part="item-bar-title"]')!.textContent).toBe('T');
    expect(container.querySelector('[data-ag-part="item-bar-subtitle"]')!.textContent).toBe('S');
    expect(container.querySelector('[data-ag-part="item-bar-action"]')).not.toBeNull();
  });
  it('masonry clamps cols by observed container width', () => {
    const old = (globalThis as Record<string, unknown>).ResizeObserver;
    (globalThis as Record<string, unknown>).ResizeObserver = class {
      private cb: (entries: Array<{ contentRect: { width: number } }>) => void;
      constructor(cb: (entries: Array<{ contentRect: { width: number } }>) => void) { this.cb = cb; }
      observe() { this.cb([{ contentRect: { width: 100 } }]); }
      unobserve() {} disconnect() {}
    };
    try {
      const { container } = render(<ImageList variant="masonry" cols={6} minItemWidth={160}><ImageList.Item><img alt="a" /></ImageList.Item></ImageList>);
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-cols')).toBe('1');
    } finally {
      (globalThis as Record<string, unknown>).ResizeObserver = old;
    }
  });
  it('creates no ResizeObserver for non-masonry variant', () => {
    const seen: unknown[] = [];
    const RO = class { observe(){} unobserve(){} disconnect(){} constructor(){ seen.push(this); } };
    const old = (globalThis as Record<string, unknown>).ResizeObserver;
    (globalThis as Record<string, unknown>).ResizeObserver = RO;
    try {
      render(<ImageList variant="standard"><ImageList.Item><img alt="a" /></ImageList.Item></ImageList>);
      expect(seen.length).toBe(0);
    } finally {
      (globalThis as Record<string, unknown>).ResizeObserver = old;
    }
  });
});
