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

describe('Skeleton REQ-CMP-118', () => {
  it('root carries content-sunken material attrs', () => {
    const { container } = render(<Skeleton shape="rect" />);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-ag-content')).toBe('content-sunken');
    expect(el.getAttribute('data-ag-layer')).toBe('content');
  });

  it('shimmer is gated on [data-ag-continuous=on] with the ambient token', () => {
    const css = require('node:fs').readFileSync(require('node:path').join(__dirname, 'Skeleton.css'), 'utf8');
    expect(css).toContain("[data-ag-continuous='on'] .ag-skeleton");
    expect(css).toContain('var(--ag-duration-ambient');
    // no ungated shimmer path remains
    const ungated = css.match(/@media \(prefers-reduced-motion: no-preference\)[^}]*ag-skeleton-shimmer/);
    expect(ungated).toBeNull();
  });
});
