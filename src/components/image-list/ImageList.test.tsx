/* CMP-308/424: ImageList — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
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
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-cols')).toBe('1');
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
  it('masonry creates exactly one ResizeObserver', () => {
    const seen: unknown[] = [];
    const RO = class { observe(){} unobserve(){} disconnect(){} constructor(){ seen.push(this); } };
    const old = (globalThis as Record<string, unknown>).ResizeObserver;
    (globalThis as Record<string, unknown>).ResizeObserver = RO;
    try {
      render(
        <ImageList variant="masonry" items={[{ src: 'a.png', alt: 'a' }, { src: 'b.png', alt: 'b' }]} />,
      );
      expect(seen.length).toBe(1);
    } finally {
      (globalThis as Record<string, unknown>).ResizeObserver = old;
    }
  });
  it('flat items render on the server (renderToString) with img alt and no ResizeObserver', () => {
    const seen: unknown[] = [];
    const RO = class { observe(){} unobserve(){} disconnect(){} constructor(){ seen.push(this); } };
    const old = (globalThis as Record<string, unknown>).ResizeObserver;
    (globalThis as Record<string, unknown>).ResizeObserver = RO;
    try {
      const html = renderToString(
        <ImageList
          cols={4}
          items={[
            { src: '/a.jpg', alt: 'Alpine lake', title: 'Lake', subtitle: 'Dawn' },
            { src: '/b.jpg', alt: 'Desert road' },
          ]}
        />,
      );
      expect(html).toContain('alt="Alpine lake"');
      expect(html).toContain('alt="Desert road"');
      expect(html).toContain('data-ag-part="item-bar-title"');
      expect(html).toContain('data-cols="4"');
      expect(seen.length).toBe(0);
    } finally {
      (globalThis as Record<string, unknown>).ResizeObserver = old;
    }
  });
  it('items rows without title/subtitle/actions render no ItemBar', () => {
    const { container } = render(<ImageList items={[{ src: '/b.jpg', alt: 'b' }]} />);
    expect(container.querySelector('[data-ag-part="item-img"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="item-bar"]')).toBeNull();
  });
  it('ItemBar carries chrome-thin material', () => {
    const { container } = render(<ImageList.ItemBar title="t" />);
    const bar = container.querySelector('[data-ag-part="item-bar"]')!;
    expect(bar.getAttribute('data-ag-layer')).toBe('chrome');
    expect(bar.getAttribute('data-ag-thickness')).toBe('thin');
    expect(bar.getAttribute('data-ag-backdrop')).toBe('media');
  });
});
