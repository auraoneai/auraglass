/* MAT-302: HitArea is a single aria-hidden decorative span. */
import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react';
import { HitArea } from '../../src/a11y/HitArea';

describe('HitArea (A11Y-024)', () => {
  it('renders exactly one node keyed on data-ag-part="hit-area"', () => {
    const { container } = render(<HitArea />);
    const nodes = container.querySelectorAll('*');
    expect(nodes.length).toBe(1);
    const el = nodes[0] as HTMLElement;
    expect(el.tagName).toBe('SPAN');
    expect(el.getAttribute('data-ag-part')).toBe('hit-area');
  });

  it('is aria-hidden and absent from the a11y tree', () => {
    const { container } = render(
      <div role="button" tabIndex={0}>
        <HitArea />
        Label
      </div>,
    );
    const hit = container.querySelector('[data-ag-part="hit-area"]')!;
    expect(hit.getAttribute('aria-hidden')).toBe('true');
    // jsdom has no a11y tree — aria-hidden on a non-focusable element is the
    // contract that removes it everywhere.
    expect(hit.getAttribute('tabindex')).toBeNull();
  });

  it('spreads extra props without dropping the keyed attributes', () => {
    const { container } = render(<HitArea id="h" className="x" />);
    const el = container.querySelector('[data-ag-part="hit-area"]')!;
    expect(el.id).toBe('h');
    expect(el.classList.contains('x')).toBe(true);
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });
});
