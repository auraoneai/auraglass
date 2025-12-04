import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeItem } from './TreeItem';
import { cn } from '../../lib/utils';
import { TreeView } from './TreeView';

const meta: Meta<typeof TreeItem> = {
  title: 'Components/Tree-view/TreeItem',
  component: TreeItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism treeitem component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    children: {
      control: 'text',
      description: 'children prop',
    },
    disabled: {
      control: 'boolean',
      description: 'disabled prop',
    },
  },
  args: {
    className: '',
    children: '',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof TreeItem>;

export const Default: Story = {
  render: (args) => (
    <TreeView>
      <TreeItem 
        {...args}
        nodeId="default-item"
        label="TreeItem Example"
      >
        <TreeItem 
          nodeId="child-1" 
          label="Child Item 1"
        />
        <TreeItem 
          nodeId="child-2" 
          label="Child Item 2"
        />
      </TreeItem>
    </TreeView>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <TreeView>
        <TreeItem {...args} nodeId="variant-1" label="Basic Item" />
        <TreeItem {...args} nodeId="variant-2" label="With Icon" icon="📁" />
        <TreeItem {...args} nodeId="variant-3" label="Disabled Item" disabled />
      </TreeView>
    </div>
  ),
};
