import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox as GlassCheckboxUI } from './GlassCheckboxUI';

const meta: Meta<typeof GlassCheckboxUI> = {
  title: 'Controls/Inputs/Glass Checkbox UI',
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
    label: 'Enable glass controls',
    description: 'Checked state is visible in the default story.',
    defaultChecked: true,
    size: 'lg',
    style: { color: '#0f172a' },
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-grid glass-gap-3">
      <GlassCheckboxUI {...args} label="Default" />
      <GlassCheckboxUI {...args} label="Checked" defaultChecked />
      <GlassCheckboxUI {...args} label="Disabled" disabled />
    </div>
  ),
  args: {
    
  },
};
