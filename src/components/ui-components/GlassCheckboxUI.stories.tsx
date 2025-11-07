import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox as GlassCheckboxUI } from './GlassCheckboxUI';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassCheckboxUI> = {
  title: 'Components/Ui-components/GlassCheckboxUI',
  component: GlassCheckboxUI,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasscheckboxui component.',
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
type Story = StoryObj<typeof GlassCheckboxUI>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <GlassCheckboxUI {...args}>
        Default
      </GlassCheckboxUI>
    </div>
  ),
  args: {
    
  },
};
