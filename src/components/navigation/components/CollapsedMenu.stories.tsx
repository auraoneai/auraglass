import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CollapsedMenu from './CollapsedMenu';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof CollapsedMenu> = {
  title: 'Components/Components/CollapsedMenu',
  component: CollapsedMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism collapsedmenu component.',
      },
    },
  },
  argTypes: {
  },
  args: {
  },
};

export default meta;
type Story = StoryObj<typeof CollapsedMenu>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <CollapsedMenu {...args}>
        Default
      </CollapsedMenu>
    </div>
  ),
  args: {
    
  },
};
