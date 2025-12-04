import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton } from './ToggleButton';
import { cn } from '../../lib/utils';
import { Star, Heart, ThumbsUp } from 'lucide-react';

const meta: Meta<typeof ToggleButton> = {
  title: 'Components/Toggle-button/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A toggle button with glassmorphism styling and physics-based animations.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Button content/text',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the button is selected/toggled',
    },
    value: {
      control: 'text',
      description: 'Value associated with the button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'medium'],
      description: 'Size variant',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'outlined'],
      description: 'Visual variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'default'],
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
    blurStrength: {
      control: { type: 'select' },
      options: ['none', 'light', 'standard', 'heavy'],
      description: 'Blur strength for glass effect',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make button full width',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    children: 'Toggle',
    selected: false,
    size: 'md',
    variant: 'default',
    color: 'primary',
    glass: true,
    glassVariant: 'frosted',
    blurStrength: 'standard',
    fullWidth: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  args: {
    children: 'Like',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ToggleButton {...args} variant="default">
        Default
      </ToggleButton>
      <ToggleButton {...args} variant="primary">
        Primary
      </ToggleButton>
      <ToggleButton {...args} variant="secondary">
        Secondary
      </ToggleButton>
      <ToggleButton {...args} variant="outlined">
        Outlined
      </ToggleButton>
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ToggleButton {...args} color="primary">
        Primary
      </ToggleButton>
      <ToggleButton {...args} color="secondary">
        Secondary
      </ToggleButton>
      <ToggleButton {...args} color="success">
        Success
      </ToggleButton>
      <ToggleButton {...args} color="warning">
        Warning
      </ToggleButton>
      <ToggleButton {...args} color="error">
        Error
      </ToggleButton>
      <ToggleButton {...args} color="info">
        Info
      </ToggleButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="glass-flex glass-items-center glass-gap-4">
      <ToggleButton {...args} size="sm">
        Small
      </ToggleButton>
      <ToggleButton {...args} size="md">
        Medium
      </ToggleButton>
      <ToggleButton {...args} size="lg">
        Large
      </ToggleButton>
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ToggleButton {...args}>
        <ThumbsUp className="glass-w-4 glass-h-4 glass-mr-2" />
        Like
      </ToggleButton>
      <ToggleButton {...args}>
        <Star className="glass-w-4 glass-h-4 glass-mr-2" />
        Favorite
      </ToggleButton>
      <ToggleButton {...args}>
        <Heart className="glass-w-4 glass-h-4 glass-mr-2" />
        Love
      </ToggleButton>
    </div>
  ),
};

export const Selected: Story = {
  args: {
    children: 'Selected',
    selected: true,
  },
};

export const GlassVariants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ToggleButton {...args} glassVariant="frosted">
        Frosted
      </ToggleButton>
      <ToggleButton {...args} glassVariant="dynamic">
        Dynamic
      </ToggleButton>
      <ToggleButton {...args} glassVariant="clear">
        Clear
      </ToggleButton>
      <ToggleButton {...args} glassVariant="tinted">
        Tinted
      </ToggleButton>
      <ToggleButton {...args} glassVariant="luminous">
        Luminous
      </ToggleButton>
    </div>
  ),
  args: {
    glass: true,
  },
};
