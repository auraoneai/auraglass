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

describe('Collapsible REQ-CMP-120', () => {
  it('trigger aria-controls resolves to the content id', () => {
    const { container } = render(
      <Collapsible.Root defaultOpen>
        <Collapsible.Trigger>T</Collapsible.Trigger>
        <Collapsible.Content>B</Collapsible.Content>
      </Collapsible.Root>,
    );
    const trigger = container.querySelector('[data-ag-part="trigger"]')!;
    const content = container.querySelector('[data-ag-part="content"]')!;
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);
  });

  it('closed content is hidden and CSS carries the height/calm contract', () => {
    const { container } = render(
      <Collapsible.Root>
        <Collapsible.Trigger>T</Collapsible.Trigger>
        <Collapsible.Content>B</Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = container.querySelector('[data-ag-part="content"]');
    // BU unmounts the panel when closed (or marks it hidden) — either is legal
    expect(content === null || content.getAttribute('hidden') !== null || content.getAttribute('data-hidden') !== null).toBe(true);
    const css = require('node:fs').readFileSync(require('node:path').join(__dirname, 'Collapsible.css'), 'utf8');
    expect(css).toContain('var(--collapsible-panel-height');
    expect(css).toContain('[data-ag-motion=\'calm\']');
  });
});
