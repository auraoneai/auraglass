import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TreeView } from './TreeView';

const meta = {
  title: 'surf/tree-view',
  parameters: { ag: { subject: 'TreeView', kind: 'component' } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

type Node = { id: string; label: string; children?: Node[] };
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
