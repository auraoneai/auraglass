/* CMP-313: Accordion — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Accordion } from './index';

const Demo = (props: Record<string, unknown> = {}) => (
  <Accordion.Root defaultValue={['a']} {...props}>
    <Accordion.Item value="a">
      <Accordion.Header><Accordion.Trigger>A</Accordion.Trigger></Accordion.Header>
      <Accordion.Content>panel a</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="b">
      <Accordion.Header><Accordion.Trigger>B</Accordion.Trigger></Accordion.Header>
      <Accordion.Content>panel b</Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
);

describe('Accordion', () => {
  it('renders parts with h3 header by default, no tab roles', () => {
    const { container } = render(<Demo />);
    expect(container.querySelector('h3[data-ag-part="header"]')).not.toBeNull();
    for (const p of ['root', 'item', 'header', 'trigger', 'content']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).not.toBeNull();
    }
    expect(container.querySelector('[role="tab"], [role="tablist"]')).toBeNull();
  });
  it('headingLevel 2-6 respected', () => {
    const { container } = render(
      <Accordion.Root><Accordion.Item value="a"><Accordion.Header headingLevel={5}><Accordion.Trigger>t</Accordion.Trigger></Accordion.Header></Accordion.Item></Accordion.Root>,
    );
    expect(container.querySelector('h5[data-ag-part="header"]')).not.toBeNull();
  });
  it('trigger toggles the panel (aria-expanded)', () => {
    const { container } = render(<Demo />);
    const trigB = container.querySelectorAll('[data-ag-part="trigger"]')[1]!;
    expect(trigB.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trigB);
    act(() => {});
    expect(trigB.getAttribute('aria-expanded')).toBe('true');
  });
  it('multiple allows two open items', () => {
    const { container } = render(<Demo multiple defaultValue={['a', 'b']} />);
    for (const t of container.querySelectorAll('[data-ag-part="trigger"]')) {
      expect(t.getAttribute('aria-expanded')).toBe('true');
    }
  });
});
