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
});
