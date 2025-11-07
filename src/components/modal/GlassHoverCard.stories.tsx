import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassHoverCard } from './GlassHoverCard';
import { cn } from '../../lib/utils';
import { Info, User, Settings } from 'lucide-react';

const meta: Meta<typeof GlassHoverCard> = {
  title: 'Components/Modal/GlassHoverCard',
  component: GlassHoverCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glassmorphism hover card that appears on hover with smooth animations and glass effects.',
      },
    },
  },
  argTypes: {
    placement: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left', 'top-start', 'top-end', 'right-start', 'right-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end'],
      description: 'Position of the hover card relative to trigger',
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'Alignment of the hover card',
    },
    offset: {
      control: 'number',
      description: 'Offset from trigger element in pixels',
    },
    showDelay: {
      control: 'number',
      description: 'Delay before showing the card (ms)',
    },
    hideDelay: {
      control: 'number',
      description: 'Delay before hiding the card (ms)',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the hover card',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for the card',
    },
    triggerClassName: {
      control: 'text',
      description: 'Additional CSS classes for the trigger',
    },
  },
  args: {
    placement: 'top',
    align: 'center',
    offset: 8,
    showDelay: 300,
    hideDelay: 100,
    maxWidth: '300px',
  },
};

export default meta;
type Story = StoryObj<typeof GlassHoverCard>;

export const Default: Story = {
  args: {
    children: (
      <button className="px-4 py-2 glass-surface-blue/20 backdrop-blur-md border border-white/20 glass-radius-lg hover:glass-surface-blue/30 transition-colors">
        Hover me
      </button>
    ),
    content: (
      <div className="p-4">
        <h3 className="font-semibold mb-2">Default Hover Card</h3>
        <p className="text-sm opacity-80">
          This is a basic hover card with glassmorphism effects.
        </p>
      </div>
    ),
  },
};

export const Placements: Story = {
  render: (args) => (
    <div className="grid grid-cols-3 gap-8 p-8">
      <GlassHoverCard
        {...args}
        placement="top"
        content={<div className="p-3"><Info className="w-4 h-4 inline glass-mr-2" />Top placement</div>}
      >
        <button className="px-3 py-2 glass-surface-subtle/10 backdrop-blur-md border border-white/20 glass-radius-md hover:glass-surface-subtle/20 transition-colors">
          Top
        </button>
      </GlassHoverCard>

      <GlassHoverCard
        {...args}
        placement="right"
        content={<div className="p-3"><Info className="w-4 h-4 inline glass-mr-2" />Right placement</div>}
      >
        <button className="px-3 py-2 glass-surface-subtle/10 backdrop-blur-md border border-white/20 glass-radius-md hover:glass-surface-subtle/20 transition-colors">
          Right
        </button>
      </GlassHoverCard>

      <GlassHoverCard
        {...args}
        placement="bottom"
        content={<div className="p-3"><Info className="w-4 h-4 inline glass-mr-2" />Bottom placement</div>}
      >
        <button className="px-3 py-2 glass-surface-subtle/10 backdrop-blur-md border border-white/20 glass-radius-md hover:glass-surface-subtle/20 transition-colors">
          Bottom
        </button>
      </GlassHoverCard>

      <GlassHoverCard
        {...args}
        placement="left"
        content={<div className="p-3"><Info className="w-4 h-4 inline glass-mr-2" />Left placement</div>}
      >
        <button className="px-3 py-2 glass-surface-subtle/10 backdrop-blur-md border border-white/20 glass-radius-md hover:glass-surface-subtle/20 transition-colors">
          Left
        </button>
      </GlassHoverCard>

      <GlassHoverCard
        {...args}
        placement="top-start"
        content={<div className="p-3"><Info className="w-4 h-4 inline glass-mr-2" />Top start</div>}
      >
        <button className="px-3 py-2 glass-surface-subtle/10 backdrop-blur-md border border-white/20 glass-radius-md hover:glass-surface-subtle/20 transition-colors">
          Top-Start
        </button>
      </GlassHoverCard>

      <GlassHoverCard
        {...args}
        placement="bottom-end"
        content={<div className="p-3"><Info className="w-4 h-4 inline glass-mr-2" />Bottom end</div>}
      >
        <button className="px-3 py-2 glass-surface-subtle/10 backdrop-blur-md border border-white/20 glass-radius-md hover:glass-surface-subtle/20 transition-colors">
          Bottom-End
        </button>
      </GlassHoverCard>
    </div>
  ),
};

export const WithRichContent: Story = {
  args: {
    children: (
      <div className="flex items-center gap-3 p-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary backdrop-blur-md border border-white/20 glass-radius-lg cursor-pointer hover:glass-gradient-primary hover:glass-gradient-primary dark:hover:glass-gradient-primary dark:hover:glass-gradient-primary transition-all">
        <User className="w-5 h-5" />
        <div>
          <div className="font-medium">John Doe</div>
          <div className="text-sm opacity-70">Software Engineer</div>
        </div>
      </div>
    ),
    content: (
      <div className="p-4 max-w-xs">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-radius-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">John Doe</h4>
            <p className="text-sm opacity-80">Software Engineer</p>
          </div>
        </div>
        <div className="gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4" />
            <span>5 years experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Info className="w-4 h-4" />
            <span>React, TypeScript, Node.js</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20">
          <button className="w-full px-3 py-1 glass-surface-subtle/20 hover:glass-surface-subtle/30 glass-radius-md text-sm transition-colors">
            View Profile
          </button>
        </div>
      </div>
    ),
    placement: 'right',
    offset: 12,
  },
};

export const WithDelay: Story = {
  args: {
    children: (
      <button className="px-4 py-2 glass-surface-green/20 backdrop-blur-md border border-white/20 glass-radius-lg hover:glass-surface-green/30 transition-colors">
        Hover with delay
      </button>
    ),
    content: (
      <div className="p-3">
        <p className="text-sm">This card appears after a 500ms delay and stays for 300ms after hover ends.</p>
      </div>
    ),
    showDelay: 500,
    hideDelay: 300,
  },
};
