import type { Meta, StoryObj } from '@storybook/react';
import { MagneticButton } from './GlassMagneticButton';

import { cn } from '../../lib/utils';
const meta: Meta<typeof MagneticButton> = {
  title: 'Components/Button/MagneticButton',
  component: MagneticButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassmagneticbutton component.',
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
    variant: {
      control: { type: 'select' },
      options: ["default","primary","secondary","tertiary","ghost","destructive","error","outline","link","gradient","success","warning"],
      description: 'variant prop',
    },
    size: {
      control: { type: 'select' },
      options: ["sm","md","lg"],
      description: 'size prop',
    },
    loading: {
      control: 'boolean',
      description: 'loading prop',
    },
  },
  args: {
    className: '',
    children: '',
    disabled: false,
    variant: 'primary',
    size: 'sm',
    loading: false,
  },
};

export default meta;
type Story = StoryObj<typeof MagneticButton>;

export const Default: Story = {
  args: {
    children: (
      <div className="glass-p-4 glass-text-center">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">MagneticButton</h3>
        <p className="glass-text-sm opacity-80">This is the default glassmagneticbutton component.</p>
      </div>
    ),
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <MagneticButton key="primary" {...args} variant="primary">
        primary
      </MagneticButton>
      <MagneticButton key="secondary" {...args} variant="secondary">
        secondary
      </MagneticButton>
      <MagneticButton key="ghost" {...args} variant="ghost">
        ghost
      </MagneticButton>
      <MagneticButton key="outline" {...args} variant="outline">
        outline
      </MagneticButton>
      <MagneticButton key="destructive" {...args} variant="destructive">
        destructive
      </MagneticButton>
    </div>
  ),
  args: {
    children: null,
  },
};
