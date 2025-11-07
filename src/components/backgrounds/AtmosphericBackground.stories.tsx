import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AtmosphericBackground from './AtmosphericBackground';
import { cn } from '../../lib/utils';

const meta: Meta<typeof AtmosphericBackground> = {
  title: 'Components/Backgrounds/AtmosphericBackground',
  component: AtmosphericBackground,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism atmosphericbackground component.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS class name',
    },
    variant: {
      control: { type: 'select' },
      options: ['clear', 'cloudy', 'rainy', 'stormy', 'foggy', 'sunny'],
      description: 'Atmospheric variant',
    },
    intensity: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Effect intensity',
    },
    animated: {
      control: 'boolean',
      description: 'Enable animations',
    },
  },
  args: {
    className: '',
    variant: 'clear',
    intensity: 0.5,
    animated: true,
  },
};

export default meta;
type Story = StoryObj<typeof AtmosphericBackground>;

export const Default: Story = {
  args: {
    variant: 'clear',
    intensity: 0.5,
    animated: true,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <AtmosphericBackground {...args} />
    </div>
  ),
  args: {
    variant: 'cloudy',
  },
};
