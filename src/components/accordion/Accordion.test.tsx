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
describe('Accordion REQ-CMP-121', () => {
  it('trigger aria-controls resolves to the content element id', () => {
    const { container } = render(
      <Accordion.Root defaultValue={['i1']}>
        <Accordion.Item value="i1">
          <Accordion.Header><Accordion.Trigger>T</Accordion.Trigger></Accordion.Header>
          <Accordion.Content>B</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const trigger = container.querySelector('[data-ag-part="trigger"]')!;
    const content = container.querySelector('[data-ag-part="content"]')!;
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();
    expect(trigger.getAttribute('aria-controls')).toBe(content.id);
  });
  /* REQ-CMP-121: Arrow, Home and End move focus between headers. */
  it('ArrowDown/ArrowUp/End/Home move focus between triggers', async () => {
    const { getByText } = render(
      <Accordion.Root>
        {['one', 'two', 'three'].map((v) => (
          <Accordion.Item key={v} value={v}>
            <Accordion.Header><Accordion.Trigger>{v}</Accordion.Trigger></Accordion.Header>
            <Accordion.Content>{`panel ${v}`}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>,
    );
    // let Base UI's composite list register every trigger index
    await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
    const t = (label: string) => getByText(label).closest('button')!;
    act(() => { t('one').focus(); });
    const press = (key: string) => { fireEvent.keyDown(document.activeElement!, { key }); };
    press('ArrowDown');
    expect(document.activeElement).toBe(t('two'));
    press('ArrowDown');
    expect(document.activeElement).toBe(t('three'));
    press('ArrowUp');
    expect(document.activeElement).toBe(t('two'));
    press('End');
    expect(document.activeElement).toBe(t('three'));
    press('Home');
    expect(document.activeElement).toBe(t('one'));
  });
});
