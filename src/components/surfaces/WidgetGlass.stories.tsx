import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import WidgetGlass from './WidgetGlass';
import { cn } from '../../lib/utils';

const meta: Meta<typeof WidgetGlass> = {
  title: 'Components/Surfaces/WidgetGlass',
  component: WidgetGlass,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism widgetglass component.',
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
type Story = StoryObj<typeof WidgetGlass>;

export const Default: Story = {
  args: {
    
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-4">
      <WidgetGlass {...args}>
        Default
      </WidgetGlass>
    </div>
  ),
  args: {
    
  },
};
