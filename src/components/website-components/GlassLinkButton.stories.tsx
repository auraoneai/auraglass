import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassLinkButton } from './GlassLinkButton';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassLinkButton> = {
  title: 'Reference/Legacy Components/Glass Link Button',
  component: GlassLinkButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasslinkbutton component.',
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
    variant: {
      control: { type: 'select' },
      options: ["primary","secondary","ghost"],
      description: 'variant prop',
    },
    size: {
      control: { type: 'select' },
      options: ["sm","md","lg"],
      description: 'size prop',
    },
  },
  args: {
    className: '',
    children: 'Click me',
    variant: 'primary',
    size: 'sm',
  },
};

export default meta;
type Story = StoryObj<typeof GlassLinkButton>;

export const Default: Story = {
  args: {
    children: 'GlassLinkButton',
    href: '#',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassLinkButton key="primary" {...args} variant="primary">
        Primary
      </GlassLinkButton>
      <GlassLinkButton key="secondary" {...args} variant="secondary">
        Secondary
      </GlassLinkButton>
      <GlassLinkButton key="ghost" {...args} variant="ghost">
        Ghost
      </GlassLinkButton>
    </div>
  ),
  args: {
    href: '#',
  },
};
