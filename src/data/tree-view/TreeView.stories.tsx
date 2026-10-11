import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TreeView } from './TreeView';
import { KEYBOARD_TREE, VIRTUAL_TREE, VIRTUAL_TREE_PARENT_KEYS, type TreeFixtureNode } from './treeFixtures';

const meta = {
  title: 'surf/tree-view',
  parameters: { ag: { subject: 'TreeView', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Node = TreeFixtureNode;
const DATA: Node[] = [
  { id: 'src', label: 'src', children: [{ id: 'a', label: 'a.ts' }, { id: 'b', label: 'b.ts' }] },
  { id: 'docs', label: 'docs', children: [{ id: 'r', label: 'README.md' }] },
  { id: 'pkg', label: 'package.json' },
];

const renderTree = () => (
  <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="Project files" defaultExpandedKeys={['src']} selectionMode="single" />
);
export const Basic: Story = { render: renderTree };
export const FilesPreset: Story = {
  render: () => (
    <TreeView items={DATA} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="Files" preset="files" defaultExpandedKeys={['src', 'docs']} selectionMode="multiple" />
  ),
};
export const RTL: Story = { globals: { dir: 'rtl' }, render: renderTree };

/** REQ-SURF-82: subject of tests/a11y/apg/surf/tree-view.apg.spec.ts. A
    focusable before and after the tree proves the single tab stop; onAction
    (Enter) is logged to the output so the spec can read it. */
function KeyboardDemo() {
  const [log, setLog] = React.useState<string[]>([]);
  return (
    <div>
      <button type="button" data-testid="before-tree">Before</button>
      <TreeView
        items={KEYBOARD_TREE}
        getKey={(n) => n.id}
        getTextValue={(n) => n.label}
        aria-label="Fruit"
        selectionMode="multiple"
        onAction={(key) => setLog((l) => [...l, `action:${String(key)}`])}
      />
      <button type="button" data-testid="after-tree">After</button>
      <output data-testid="tree-action-log">{log.join(' ')}</output>
    </div>
  );
}
export const Keyboard: Story = { render: () => <KeyboardDemo /> };

/** REQ-SURF-83: 5,000 nodes (50 folders x 99 files) virtualized in a 480px
    container. "Expand all" / "Collapse all" drive the controlled
    expandedKeys for tests/e2e/surf/data/tree-virtual.spec.ts and
    tests/perf/browser/surf/data-tree-view.spec.ts. */
function Virtual5000Demo() {
  const [expanded, setExpanded] = React.useState<Set<React.Key>>(new Set());
  return (
    <div>
      <button type="button" data-testid="tree-expand-all" onClick={() => setExpanded(new Set(VIRTUAL_TREE_PARENT_KEYS))}>
        Expand all
      </button>
      <button type="button" data-testid="tree-collapse-all" onClick={() => setExpanded(new Set())}>
        Collapse all
      </button>
      <div data-testid="tree-viewport" style={{ blockSize: 480, inlineSize: 360 }}>
        <TreeView
          items={VIRTUAL_TREE}
          getKey={(n) => n.id}
          getTextValue={(n) => n.label}
          aria-label="5,000 files"
          virtualize
          expandedKeys={expanded}
          onExpandedChange={setExpanded}
        />
      </div>
    </div>
  );
}
export const Virtual5000: Story = { render: () => <Virtual5000Demo /> };
