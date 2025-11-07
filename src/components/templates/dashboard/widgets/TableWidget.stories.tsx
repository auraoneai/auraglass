import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TableWidget } from './TableWidget';
import { cn } from '../../../../lib/utils';

const meta: Meta<typeof TableWidget> = {
  title: 'Components/Widgets/TableWidget',
  component: TableWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism tablewidget component.',
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
type Story = StoryObj<typeof TableWidget>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <TableWidget {...args}>
        Default
      </TableWidget>
    </div>
  ),
  args: {
    
  },
};
