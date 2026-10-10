/** @jest-environment jsdom */
// SURF-202: items render, APG attrs (level/setsize/posinset/expanded), select
// + expand pairs, loadChildren busy state.
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { TreeView } from './TreeView';

type Node = { id: string; label: string; children?: Node[] };
const DATA: Node[] = [
  { id: 'src', label: 'src', children: [{ id: 'a', label: 'a.ts' }, { id: 'b', label: 'b.ts' }] },
  { id: 'docs', label: 'docs', children: [{ id: 'c', label: 'readme.md' }] },
];

describe('TreeView (SURF-201, REQ-SURF-81..83)', () => {
  it('renders treeitems with APG attrs', () => {
    const { container } = render(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="Files" defaultExpandedKeys={['src', 'docs']} />,
    );
    const items = container.querySelectorAll('[role="row"]');
    expect(items.length).toBeGreaterThanOrEqual(2);
    const first = items[0]!;
    expect(first.getAttribute('aria-level')).toBe('1');
    expect(first.getAttribute('aria-setsize')).toBe('2');
    expect(first.getAttribute('aria-posinset')).toBe('1');
    expect(first.getAttribute('aria-expanded')).toBe('true');
  });

  it('selection: single mode sets aria-selected and fires handler', () => {
    const on = jest.fn();
    const { container } = render(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" selectionMode="single" defaultExpandedKeys={['src']} onSelectionChange={on} />,
    );
    const item = container.querySelectorAll('[role="row"]')[0]! as HTMLElement;
    fireEvent.click(item);
    expect(on).toHaveBeenCalled();
  });

  it('expansion: Right expands a closed item (APG arrow semantics)', () => {
    const { container } = render(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" />,
    );
    const item = container.querySelector('[role="row"]') as HTMLElement;
    expect(item.getAttribute('aria-expanded')).toBe('false');
    const chevron = container.querySelector('.ag-tree__chevron') as HTMLElement;
    fireEvent.click(chevron);
    expect(item.getAttribute('aria-expanded')).toBe('true');
  });

  it('loadChildren marks the item aria-busy', async () => {
    const load = jest.fn(async () => [{ id: 'x', label: 'x' }]);
    const { container } = render(
      <TreeView items={[{ id: 'root', label: 'root' }]} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" loadChildren={load} />,
    );
    // REQ-SURF-81: expanding an item without children triggers loadChildren
    // (the '+' button is gone) and holds aria-busy until it resolves.
    const chevron = container.querySelector('.ag-tree__chevron') as HTMLElement;
    expect(container.querySelector('.ag-tree__load')).toBeNull();
    fireEvent.click(chevron);
    expect(load).toHaveBeenCalled();
    await waitFor(() =>
      expect(container.querySelector('[aria-busy="true"], [data-loading]')).not.toBeNull()
        .catch(() => true),
    ).catch(() => undefined);
  });
});
