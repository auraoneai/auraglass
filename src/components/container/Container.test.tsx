/* CMP-299: Container — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { Container } from './index';

describe('Container', () => {
  it('emits data-ag-size and inline-size containment styles', () => {
    const { container } = render(<Container size="lg">x</Container>);
    const el = container.querySelector('[data-ag-part="root"]')! as HTMLElement;
    expect(el.getAttribute('data-ag-size')).toBe('lg');
    expect(el.style.containerType).toBe('inline-size');
    expect(el.style.containerName).toBe('ag-container');
    expect(el.style.maxInlineSize).toContain('var(--_ag-container-lg');
  });
  it('supports sm/md/xl sizes', () => {
    for (const s of ['sm', 'md', 'xl'] as const) {
      const { container, unmount } = render(<Container size={s}>x</Container>);
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-ag-size')).toBe(s);
      unmount();
    }
  });
});
