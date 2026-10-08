/* CMP-314: Collapsible — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Collapsible } from './index';

describe('Collapsible', () => {
  it('data-state collapsed → expanded on trigger click', () => {
    const { container } = render(
      <Collapsible.Root>
        <Collapsible.Trigger>Toggle</Collapsible.Trigger>
        <Collapsible.Content>Body</Collapsible.Content>
      </Collapsible.Root>,
    );
    const root = container.querySelector('[data-ag-part="root"]')!;
    expect(root.getAttribute('data-state')).toBe('collapsed');
    fireEvent.click(container.querySelector('[data-ag-part="trigger"]')!);
    act(() => {});
    expect(root.getAttribute('data-state')).toBe('expanded');
  });
  it('onOpenChange receives (open, details)', () => {
    const seen: boolean[] = [];
    const { container } = render(
      <Collapsible.Root onOpenChange={(open) => seen.push(open)}>
        <Collapsible.Trigger>T</Collapsible.Trigger>
        <Collapsible.Content>B</Collapsible.Content>
      </Collapsible.Root>,
    );
    fireEvent.click(container.querySelector('[data-ag-part="trigger"]')!);
    expect(seen[0]).toBe(true);
  });
});
