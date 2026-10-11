/** @jest-environment jsdom */
// REQ-SURF-83: `virtualize` wraps the RAC Tree in a RAC Virtualizer
// (ListLayout), so a fully expanded 5,000-node tree in a 480px viewport
// renders only the visible slice. jsdom has no layout, so the scroll
// container's size is mocked (clientWidth/clientHeight).
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { TreeView, type TreeViewBaseProps } from './TreeView';
import { TREE_ITEM_SELECTOR, TREE_ROLE } from './treeSemantics';
import { VIRTUAL_TREE, VIRTUAL_TREE_NODE_COUNT, VIRTUAL_TREE_PARENT_KEYS, type TreeFixtureNode } from './treeFixtures';

const VIEWPORT = 480;
const restore: Array<() => void> = [];
const mockSize = (prop: 'clientHeight' | 'clientWidth', value: number) => {
  const original = Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop);
  Object.defineProperty(HTMLElement.prototype, prop, { configurable: true, get: () => value });
  restore.push(() => {
    if (original) Object.defineProperty(HTMLElement.prototype, prop, original);
  });
};

beforeAll(() => {
  mockSize('clientHeight', VIEWPORT);
  mockSize('clientWidth', 360);
});
afterAll(() => restore.forEach((r) => r()));

const tree = (props: Partial<TreeViewBaseProps<TreeFixtureNode>> = {}) => (
  <div style={{ blockSize: VIEWPORT }}>
    <TreeView<TreeFixtureNode>
      items={VIRTUAL_TREE}
      getKey={(n) => n.id}
      getTextValue={(n) => n.label}
      aria-label="5,000 files"
      virtualize
      defaultExpandedKeys={VIRTUAL_TREE_PARENT_KEYS}
      {...props}
    />
  </div>
);

describe('TreeView virtualize (REQ-SURF-83)', () => {
  it('fixture is 5,000 nodes', () => {
    expect(VIRTUAL_TREE_NODE_COUNT).toBe(5000);
    expect(VIRTUAL_TREE.reduce((n, f) => n + 1 + (f.children?.length ?? 0), 0)).toBe(5000);
  });

  it('all 5,000 nodes expanded in a 480px viewport render <= 40 rows', () => {
    const { container } = render(tree());
    const rows = container.querySelectorAll(TREE_ITEM_SELECTOR);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThanOrEqual(40);
    // the slice starts at the top of the tree
    expect(rows[0]!.getAttribute('data-key')).toBe('folder-0');
    expect(rows[1]!.getAttribute('aria-level')).toBe('2');
    // the root advertises the full sibling count even though most rows are absent
    expect(rows[0]!.getAttribute('aria-setsize')).toBe('50');
    expect(container.querySelector(`[role="${TREE_ROLE}"]`)!.classList.contains('ag-tree--virtual')).toBe(true);
  });

  it('rows are laid out at the fixed row height (estimateRowHeight)', () => {
    const at32 = render(tree()).container.querySelectorAll(TREE_ITEM_SELECTOR).length;
    const { container } = render(tree({ virtualize: { estimateRowHeight: 40 } }));
    const rows = [...container.querySelectorAll<HTMLElement>(TREE_ITEM_SELECTOR)];
    // taller rows -> fewer of them fit the same viewport
    expect(rows.length).toBeLessThan(at32);
    // each row sits in the virtualizer's absolutely positioned wrapper
    expect(rows[0]!.parentElement!.style.height).toBe('40px');
    expect(rows[1]!.parentElement!.style.top).toBe('40px');
  });

  it('overscan adds rows beyond the viewport (none above the first row)', () => {
    const base = render(tree()).container.querySelectorAll(TREE_ITEM_SELECTOR).length;
    const { container } = render(tree({ virtualize: { overscan: 5 } }));
    const withOverscan = container.querySelectorAll(TREE_ITEM_SELECTOR).length;
    expect(withOverscan).toBe(base + 5);
  });

  it('scrolling moves the rendered slice (row 4,999 reachable, still <= 40 rows)', () => {
    const { container } = render(tree());
    const scroller = container.querySelector(`[role="${TREE_ROLE}"]`) as HTMLElement;
    scroller.scrollTop = 4990 * 32;
    fireEvent.scroll(scroller);
    const rows = [...container.querySelectorAll(TREE_ITEM_SELECTOR)];
    expect(rows.length).toBeLessThanOrEqual(40);
    expect(rows.map((r) => r.getAttribute('data-key'))).toContain('file-49-98');
  });

  it('without virtualize every expanded row is in the DOM', () => {
    const { container } = render(
      <TreeView items={VIRTUAL_TREE.slice(0, 3)} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="3 folders"
        defaultExpandedKeys={VIRTUAL_TREE_PARENT_KEYS} />,
    );
    expect(container.querySelectorAll(TREE_ITEM_SELECTOR).length).toBe(300);
    expect(container.querySelector('.ag-tree--virtual')).toBeNull();
  });
});
