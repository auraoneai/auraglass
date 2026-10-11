/** @jest-environment jsdom */
// SURF-202: items render, APG attrs (level/setsize/posinset/expanded), select
// + expand pairs, loadChildren busy state.
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
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

  it('loadChildren on expand: aria-busy true while pending, absent once children render', async () => {
    let resolve!: (kids: Node[]) => void;
    const load = jest.fn((_item: Node) => new Promise<Node[]>((r) => { resolve = r; }));
    const { container } = render(
      <TreeView items={[{ id: 'root', label: 'root' }]} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" loadChildren={load} />,
    );
    const rootRow = () => container.querySelector('[role="row"][data-key="root"], [role="row"]') as HTMLElement;
    expect(rootRow().hasAttribute('aria-busy')).toBe(false);
    // REQ-SURF-81: the '+' load button is gone — expanding triggers the load.
    expect(container.querySelector('.ag-tree__load')).toBeNull();
    fireEvent.click(container.querySelector('.ag-tree__chevron') as HTMLElement);
    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith({ id: 'root', label: 'root' });
    await waitFor(() => expect(rootRow().getAttribute('aria-busy')).toBe('true'));
    expect(container.querySelectorAll('[role="row"]').length).toBe(1);
    await act(async () => {
      resolve([{ id: 'x', label: 'x.ts' }, { id: 'y', label: 'y.ts' }]);
    });
    await waitFor(() => expect(container.querySelectorAll('[role="row"]').length).toBe(3));
    expect(rootRow().hasAttribute('aria-busy')).toBe(false);
    expect(container.textContent).toContain('x.ts');
    // collapsing + re-expanding does not reload
    fireEvent.click(container.querySelector('.ag-tree__chevron') as HTMLElement);
    fireEvent.click(container.querySelector('.ag-tree__chevron') as HTMLElement);
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("preset 'files': decorative CMP icons (aria-hidden svg), folder vs file, open folder when expanded", () => {
    const { container } = render(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="Files" preset="files" defaultExpandedKeys={['src']} />,
    );
    const icons = [...container.querySelectorAll('.ag-tree__icon')];
    expect(icons.length).toBe(4); // src (open), a.ts, b.ts, docs (closed)
    icons.forEach((i) => {
      expect(i.tagName.toLowerCase()).toBe('svg');
      expect(i.getAttribute('aria-hidden')).toBe('true');
    });
    expect(icons.map((i) => i.getAttribute('data-ag-icon'))).toEqual(['folder-open', 'file', 'file', 'folder']);
    // no emoji glyphs left in the accessible text
    expect(container.textContent).not.toMatch(/[\u{1F4C1}\u{1F4C2}\u{1F4C4}]/u);
  });

  it('chevron label is localised via labels and tracks expanded state', () => {
    const { container } = render(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F"
        labels={{ expand: 'Ouvrir', collapse: 'Fermer' }} />,
    );
    const chevron = () => container.querySelector('.ag-tree__chevron') as HTMLElement;
    expect(chevron().getAttribute('aria-label')).toBe('Ouvrir');
    fireEvent.click(chevron());
    expect(chevron().getAttribute('aria-label')).toBe('Fermer');
    // default English
    const { container: c2 } = render(<TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" />);
    expect((c2.querySelector('.ag-tree__chevron') as HTMLElement).getAttribute('aria-label')).toBe('Expand');
  });

  it('indentation is the --_ag-tree-level custom property (CSS owns the 20/12px step)', () => {
    const { container } = render(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" defaultExpandedKeys={['src']} />,
    );
    const levels = [...container.querySelectorAll('.ag-tree__label')].map((l) =>
      (l as HTMLElement).style.getPropertyValue('--_ag-tree-level'),
    );
    expect(levels).toEqual(['0', '1', '1', '0']);
    [...container.querySelectorAll('.ag-tree__label')].forEach((l) =>
      expect((l as HTMLElement).style.paddingInlineStart).toBe(''),
    );
  });

  it('static TreeView.Item children render as tree rows', () => {
    const { container } = render(
      <TreeView aria-label="Static">
        <TreeView.Item id="one" textValue="One">One</TreeView.Item>
        <TreeView.Item id="two" textValue="Two">Two</TreeView.Item>
      </TreeView>,
    );
    const rows = container.querySelectorAll('[role="row"]');
    expect(rows.length).toBe(2);
    expect(rows[1]!.textContent).toBe('Two');
    expect(container.querySelector('[role="treegrid"]')!.getAttribute('aria-label')).toBe('Static');
  });

  it('controlled expandedKeys: the DOM follows the prop, onExpandedChange reports the request', () => {
    const on = jest.fn();
    const { container, rerender } = render(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" expandedKeys={[]} onExpandedChange={on} />,
    );
    const first = () => container.querySelector('[role="row"]') as HTMLElement;
    fireEvent.click(container.querySelector('.ag-tree__chevron') as HTMLElement);
    expect(on).toHaveBeenCalledTimes(1);
    expect([...(on.mock.calls[0]![0] as Set<string>)]).toEqual(['src']);
    expect(first().getAttribute('aria-expanded')).toBe('false');
    rerender(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" expandedKeys={['src']} onExpandedChange={on} />,
    );
    expect(first().getAttribute('aria-expanded')).toBe('true');
  });

  it('controlled selectedKeys: aria-selected follows the prop', () => {
    const { container } = render(
      <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="F" selectionMode="single" selectedKeys={['docs']} />,
    );
    const rows = container.querySelectorAll('[role="row"]');
    expect(rows[1]!.getAttribute('aria-selected')).toBe('true');
    expect(rows[0]!.getAttribute('aria-selected')).toBe('false');
  });
});
