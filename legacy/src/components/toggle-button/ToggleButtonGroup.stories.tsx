import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ToggleButtonGroup from './ToggleButtonGroup';
import { cn } from '../../lib/utils';
import ToggleButton from './ToggleButton';

const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Reference/Legacy Components/Toggle Button Group',
  component: ToggleButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A group of toggle buttons with glassmorphism styling and coordinated selection behavior.',
      },
    },
  },
  argTypes: {
    exclusive: {
      control: 'boolean',
      description: 'Whether only one button can be selected at a time',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'medium'],
      description: 'Size of buttons in the group',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'outlined'],
      description: 'Visual variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'Color theme',
    },
    glass: {
      control: 'boolean',
      description: 'Enable glassmorphism effect',
    },
    glassVariant: {
      control: { type: 'select' },
      options: ['frosted', 'dynamic', 'clear', 'tinted', 'luminous'],
      description: 'Glass styling variant',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make the group full width',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    exclusive: true,
    orientation: 'horizontal',
    size: 'md',
    variant: 'default',
    color: 'primary',
    glass: true,
    glassVariant: 'frosted',
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

export const Default: Story = {
  render: (args: any) => (
    <ToggleButtonGroup {...args}>
      <ToggleButton value="bold">Bold</ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
    </ToggleButtonGroup>
  ),
};

export const Exclusive: Story = {
  render: (args: any) => (
    <ToggleButtonGroup {...args} exclusive={true}>
      <ToggleButton value="left">Left</ToggleButton>
      <ToggleButton value="center">Center</ToggleButton>
      <ToggleButton value="right">Right</ToggleButton>
    </ToggleButtonGroup>
  ),
  args: {
    exclusive: true,
  },
};

export const Multiple: Story = {
  render: (args: any) => (
    <ToggleButtonGroup {...args} exclusive={false}>
      <ToggleButton value="bold">Bold</ToggleButton>
      <ToggleButton value="italic">Italic</ToggleButton>
      <ToggleButton value="underline">Underline</ToggleButton>
      <ToggleButton value="strikethrough">Strike</ToggleButton>
    </ToggleButtonGroup>
  ),
  args: {
    exclusive: false,
  },
};

export const Vertical: Story = {
  render: (args: any) => (
    <ToggleButtonGroup {...args} orientation="vertical">
      <ToggleButton value="top">Top</ToggleButton>
      <ToggleButton value="middle">Middle</ToggleButton>
      <ToggleButton value="bottom">Bottom</ToggleButton>
    </ToggleButtonGroup>
  ),
  args: {
    orientation: 'vertical',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-gap-4">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Default</h4>
        <ToggleButtonGroup {...args} variant="default">
          <ToggleButton value="1">One</ToggleButton>
          <ToggleButton value="2">Two</ToggleButton>
          <ToggleButton value="3">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Primary</h4>
        <ToggleButtonGroup {...args} variant="primary">
          <ToggleButton value="1">One</ToggleButton>
          <ToggleButton value="2">Two</ToggleButton>
          <ToggleButton value="3">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Secondary</h4>
        <ToggleButtonGroup {...args} variant="secondary">
          <ToggleButton value="1">One</ToggleButton>
          <ToggleButton value="2">Two</ToggleButton>
          <ToggleButton value="3">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Outlined</h4>
        <ToggleButtonGroup {...args} variant="outlined">
          <ToggleButton value="1">One</ToggleButton>
          <ToggleButton value="2">Two</ToggleButton>
          <ToggleButton value="3">Three</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args: any) => (
    <div className="glass-gap-4">
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Small</h4>
        <ToggleButtonGroup {...args} size="sm">
          <ToggleButton value="s">Small</ToggleButton>
          <ToggleButton value="m">Medium</ToggleButton>
          <ToggleButton value="l">Large</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Medium</h4>
        <ToggleButtonGroup {...args} size="md">
          <ToggleButton value="s">Small</ToggleButton>
          <ToggleButton value="m">Medium</ToggleButton>
          <ToggleButton value="l">Large</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        <h4 className="glass-text-sm glass-font-medium glass-mb-2">Large</h4>
        <ToggleButtonGroup {...args} size="lg">
          <ToggleButton value="s">Small</ToggleButton>
          <ToggleButton value="m">Medium</ToggleButton>
          <ToggleButton value="l">Large</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  ),
};
