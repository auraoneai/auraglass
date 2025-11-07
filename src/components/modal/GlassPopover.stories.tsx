import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassPopover } from './GlassPopover';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassPopover> = {
  title: 'Components/Modal/GlassPopover',
  component: GlassPopover,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glasspopover component.',
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the popover is open',
    },
    placement: {
      control: { type: 'select' },
      options: ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'],
      description: 'Popover placement',
    },
    trigger: {
      control: { type: 'select' },
      options: ['click', 'hover', 'focus', 'manual'],
      description: 'Trigger type',
    },
    showArrow: {
      control: 'boolean',
      description: 'Show arrow',
    },
    animation: {
      control: { type: 'select' },
      options: ['fade', 'scale', 'slide'],
      description: 'Animation preset',
    },
  },
  args: {
    open: true,
    placement: 'bottom',
    trigger: 'click',
    showArrow: true,
    animation: 'fade',
  },
};

export default meta;
type Story = StoryObj<typeof GlassPopover>;

export const Default: Story = {
  args: {
    content: (
      <div className="p-4">
        <h3 className="font-semibold mb-2">Popover Content</h3>
        <p className="text-sm">This is the content inside the popover.</p>
        <button className="glass-mt-2 px-3 py-1 glass-surface-blue text-primary glass-radius-md text-sm">
          Action
        </button>
      </div>
    ),
    children: (
      <button className="px-4 py-2 glass-surface-blue text-primary glass-radius-md">
        Click me
      </button>
    ),
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Settings',
    description: 'Configure your preferences',
    content: (
      <div className="p-4 gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Notifications</span>
          <input type="checkbox" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Dark Mode</span>
          <input type="checkbox" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Auto-save</span>
          <input type="checkbox" defaultChecked />
        </div>
      </div>
    ),
    children: (
      <button className="px-4 py-2 glass-surface-primary text-primary glass-radius-md">
        Settings
      </button>
    ),
    placement: 'top-start',
  },
};
