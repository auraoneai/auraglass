import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ScrollButtons from './ScrollButtons';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof ScrollButtons> = {
  title: 'Components/Components/ScrollButtons',
  component: ScrollButtons,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism scrollbuttons component.',
      },
    },
  },
  argTypes: {
  },
  args: {
  },
};

export default meta;
type Story = StoryObj<typeof ScrollButtons>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <ScrollButtons key="primary" {...args} variant="primary">
        primary
      </ScrollButtons>
      <ScrollButtons key="secondary" {...args} variant="secondary">
        secondary
      </ScrollButtons>
      <ScrollButtons key="ghost" {...args} variant="ghost">
        ghost
      </ScrollButtons>
      <ScrollButtons key="outline" {...args} variant="outline">
        outline
      </ScrollButtons>
      <ScrollButtons key="danger" {...args} variant="danger">
        danger
      </ScrollButtons>
    </div>
  ),
  args: {
    
  },
};
