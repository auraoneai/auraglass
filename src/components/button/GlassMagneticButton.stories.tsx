import type { Meta, StoryObj } from '@storybook/react';
import { MagneticButton } from './GlassMagneticButton';

import { cn } from '../../lib/utils';
const meta: Meta<typeof MagneticButton> = {
  title: 'Controls/Buttons/Glass Magnetic Button',
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
  render: (args) => (
    <div
      className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-6"
      style={{ width: "min(560px, calc(100vw - 64px))" }}
    >
      <div className="glass-flex glass-flex-col glass-gap-4">
        <div>
          <h3 className="glass-text-base glass-font-semibold glass-text-primary">
            Magnetic button
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            Pointer-responsive action with clear label and generous spacing.
          </p>
        </div>
        <div>
          <MagneticButton {...args}>Open workspace</MagneticButton>
        </div>
      </div>
    </div>
  ),
  args: {
    children: null,
    size: 'md',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div
      className="glass-flex glass-flex-wrap glass-gap-4 glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-6"
      style={{ width: "min(720px, calc(100vw - 64px))" }}
    >
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
