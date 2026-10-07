import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeView } from './TreeView';
import { TreeItem } from './TreeItem';

const meta: Meta<typeof TreeView> = {
  title: 'Controls/Inputs/Tree View',
  component: TreeView,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism treeview component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
  },
  args: {
    className: ''
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

export const Default: Story = {
  render: (args: any) => (
    <TreeView
      {...args}
      className="glass-w-[min(20rem,calc(100vw-3rem))] !glass-text-slate-950"
      expandedIds={['workspace', 'components']}
      selectedIds={['charts']}
      showIcons
      showLines
    >
      <TreeItem nodeId="workspace" label="AuraGlass workspace" icon="[ ]">
        <TreeItem nodeId="tokens" label="Design tokens" icon="T" />
        <TreeItem nodeId="components" label="Components" icon="C">
          <TreeItem nodeId="buttons" label="Buttons" icon="◼" />
          <TreeItem nodeId="charts" label="Charts" icon="▦" />
        </TreeItem>
      </TreeItem>
    </TreeView>
  ),
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <TreeView {...args}>
        Default
      </TreeView>
    </div>
  ),
  args: {
    
  },
};
