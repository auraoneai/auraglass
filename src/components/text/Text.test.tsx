/* CMP-295/420: Text — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Text } from './index';

describe('Text', () => {
  it('renders <p> by default with type/size/intent attrs', () => {
    const { container } = render(<Text>hello</Text>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.tagName).toBe('P');
    expect(el.getAttribute('data-type')).toBe('body');
    expect(el.getAttribute('data-ag-size')).toBe('md');
    expect(el.getAttribute('data-ag-intent')).toBe('neutral');
  });
  it('maps type roles callout|caption|label|mono onto data-type', () => {
    for (const t of ['callout', 'caption', 'label', 'mono'] as const) {
      const { container, unmount } = render(<Text type={t}>x</Text>);
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-type')).toBe(t);
      unmount();
    }
  });
  it('emits muted, weight, truncate and size attrs', () => {
    const { container } = render(<Text size="xs" muted weight="bold" truncate>q</Text>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-ag-size')).toBe('xs');
    expect(el.hasAttribute('data-muted')).toBe(true);
    expect(el.getAttribute('data-weight')).toBe('bold');
    expect(el.hasAttribute('data-truncate')).toBe(true);
  });
  it('honours the render prop (span for inline)', () => {
    const { container } = render(<Text render={<span data-x="1" />}>i</Text>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.tagName).toBe('SPAN');
    expect(el.getAttribute('data-x')).toBe('1');
  });
});
