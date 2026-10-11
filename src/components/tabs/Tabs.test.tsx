/** @jest-environment jsdom */
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Tabs } from './Tabs';

const Demo = ({ onChange, keepMounted }: { onChange?: (v: string) => void; keepMounted?: boolean }) => (
  <Tabs.Root defaultValue="a" onValueChange={onChange}>
    <Tabs.List>
      <Tabs.Tab value="a">Alpha</Tabs.Tab>
      <Tabs.Tab value="b">Beta</Tabs.Tab>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Panel value="a" {...(keepMounted ? { keepMounted: true } : {})}>A</Tabs.Panel>
    <Tabs.Panel value="b" {...(keepMounted ? { keepMounted: true } : {})}>B</Tabs.Panel>
  </Tabs.Root>
);

describe('Tabs (SURF-065)', () => {
  it('two instances have unique ids', () => {
    render(
      <>
        <Demo />
        <Demo />
      </>,
    );
    const tabs = document.querySelectorAll('[role="tab"]');
    const ids = [...tabs].map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no landmark role and emits part contract attributes', () => {
    render(<Demo />);
    expect(document.querySelector('[data-ag-part="tabs"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-part="list"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-part="tab"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-part="panel"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-part="indicator"]')).not.toBeNull();
    expect(screen.queryAllByRole('navigation')).toHaveLength(0);
  });

  it('onValueChange receives the value string', () => {
    const seen: string[] = [];
    render(<Demo onChange={(v) => seen.push(v)} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(seen).toEqual(['b']);
  });

  it('data-state tracks activation on tabs', () => {
    render(<Demo />);
    const beta = screen.getByRole('tab', { name: 'Beta' });
    expect(beta).toHaveAttribute('data-state', 'inactive');
    fireEvent.click(beta);
    expect(beta).toHaveAttribute('data-state', 'active');
  });

  it('inactive panels unmount by default; keepMounted keeps them hidden', () => {
    const { rerender } = render(<Demo />);
    expect(screen.queryByText('B')).toBeNull();
    rerender(<Demo keepMounted />);
    const b = screen.getByText('B').closest('[data-ag-part="panel"]')!;
    expect(b).toHaveAttribute('hidden');
  });

  it('SURF-47/48: pill default + id/aria-controls resolution both ways', () => {
    const { container } = render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a" keepMounted>pa</Tabs.Panel>
        <Tabs.Panel value="b" keepMounted>pb</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(container.querySelector('[data-ag-appearance="pill"]')).toBeTruthy();
    // tab -> panel via aria-controls; panel -> tab via aria-labelledby
    for (const tab of screen.getAllByRole('tab')) {
      const panelId = tab.getAttribute('aria-controls')!;
      const panel = document.getElementById(panelId);
      expect(panel).toBeTruthy();
      expect(panel!.getAttribute('aria-labelledby')).toBe(tab.id);
    }
    // two identical instances -> 0 duplicate ids
    const { container: c2 } = render(
      <Tabs.Root defaultValue="a">
        <Tabs.List><Tabs.Tab value="a">A</Tabs.Tab></Tabs.List>
        <Tabs.Panel value="a">x</Tabs.Panel>
      </Tabs.Root>,
    );
    const ids = new Set(
      Array.from(document.querySelectorAll('[id]')).map((e) => e.id),
    );
    expect(ids.size).toBe(document.querySelectorAll('[id]').length);
    void c2;
  });
});
