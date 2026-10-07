/* CMP-033 test: span.ag-visually-hidden[data-ag-part=root], stylesheet text in
   @layer ag.components, focusable variant selector, render prop. */
import * as React from 'react';
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { VisuallyHidden } from './VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders span.ag-visually-hidden[data-ag-part=root] with content', () => {
    const { container } = render(
      <VisuallyHidden>secret</VisuallyHidden>,
    );
    const el = container.querySelector('span.ag-visually-hidden');
    expect(el).not.toBeNull();
    expect(el!.getAttribute('data-ag-part')).toBe('root');
    expect(el!.textContent).toBe('secret');
  });

  it('honours the render prop with class merge', () => {
    const { container } = render(
      <VisuallyHidden render={<a href="#main" className="skip" />}>Skip to content</VisuallyHidden>,
    );
    const el = container.querySelector('a.ag-visually-hidden');
    expect(el).not.toBeNull();
    expect(el!.className).toContain('skip');
    expect(el!.getAttribute('data-ag-part')).toBe('root');
  });

  it('marks the focusable variant', () => {
    const { container } = render(<VisuallyHidden focusable>x</VisuallyHidden>);
    expect(container.querySelector('span')!.hasAttribute('data-ag-focusable')).toBe(true);
  });
});

describe('VisuallyHidden.css', () => {
  const css = readFileSync(join(__dirname, 'VisuallyHidden.css'), 'utf8');
  it('lives in @layer ag.components and clips the element', () => {
    expect(css).toContain('@layer ag.components');
    expect(css).toContain('clip-path: inset(50%)');
    expect(css).toContain('inline-size: 1px');
    expect(css).toContain('block-size: 1px');
    expect(css).toContain('margin: -1px');
    expect(css).toContain('overflow: hidden');
    expect(css).toContain('white-space: nowrap');
    expect(css).toContain('position: absolute');
  });
  it('has a :focus-visible un-hide rule for the focusable variant', () => {
    expect(css).toMatch(/\[data-ag-focusable\]:focus-visible/);
  });
});
