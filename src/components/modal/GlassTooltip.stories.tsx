import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassTooltip, GlassTooltipTrigger, GlassTooltipContent } from './GlassTooltip';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassTooltip> = {
  title: 'Components/Modal/GlassTooltip',
  component: GlassTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A sophisticated tooltip component with glass morphism styling and advanced positioning.',
      },
    },
  },
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left', 'auto'],
      description: 'Tooltip position relative to trigger',
    },
    showDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay before showing tooltip (ms)',
    },
    hideDelay: {
      control: { type: 'number', min: 0, max: 2000, step: 100 },
      description: 'Delay before hiding tooltip (ms)',
    },
  },
  args: {
    position: 'top',
    showDelay: 300,
    hideDelay: 100,
  },
};

export default meta;
type Story = StoryObj<typeof GlassTooltip>;

export const Default: Story = {
  render: (args) => (
    <GlassTooltip {...args}>
      <button className="px-4 py-2 glass-surface-primary glass-radius-lg hover:glass-surface-blue/30 transition-colors">
        Hover me
      </button>
    </GlassTooltip>
  ),
  args: {
    content: <p>This is a glass morphism tooltip!</p>
  }
};

export const Positions: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-8 max-w-2xl">
      <GlassTooltip position="top" content="Tooltip on top" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="px-4 py-2 glass-surface-danger glass-radius-lg">Top</button>
      </GlassTooltip>

      <GlassTooltip position="right" content="Tooltip on right" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="px-4 py-2 glass-surface-success glass-radius-lg">Right</button>
      </GlassTooltip>

      <GlassTooltip position="bottom" content="Tooltip on bottom" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="px-4 py-2 glass-surface-primary glass-radius-lg">Bottom</button>
      </GlassTooltip>

      <GlassTooltip position="left" content="Tooltip on left" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="px-4 py-2 glass-surface-info glass-radius-lg">Left</button>
      </GlassTooltip>
    </div>
  ),
};

export const RichContent: Story = {
  render: (args) => (
    <GlassTooltip {...args}>
      <button className="px-6 py-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-radius-lg font-medium">
        Rich Tooltip
      </button>
    </GlassTooltip>
  ),
  args: {
    content: (
      <div className="gap-2 max-w-xs">
        <div className="font-semibold">Advanced Tooltip</div>
        <p className="text-sm opacity-90">
          This tooltip supports rich content including multiple paragraphs,
          formatting, and even interactive elements.
        </p>
        <div className="flex gap-2 pt-2">
          <span className="px-2 py-1 glass-surface-subtle/20 glass-radius-md text-xs">Feature</span>
          <span className="px-2 py-1 glass-surface-subtle/20 glass-radius-md text-xs">Interactive</span>
        </div>
      </div>
    )
  }
};

// Explicit stories for GlassTooltipTrigger and GlassTooltipContent
export const TooltipComponents: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Tooltip Component Examples</h3>
        <p className="text-sm opacity-80">Using GlassTooltipTrigger and GlassTooltipContent explicitly</p>
      </div>

      <div className="flex justify-center gap-4">
        <GlassTooltip content={<p>This tooltip uses explicit GlassTooltipTrigger and GlassTooltipContent components</p>} showDelay={args.showDelay} hideDelay={args.hideDelay}>
          <GlassTooltipTrigger asChild>
            <button className="px-4 py-2 glass-surface-primary glass-radius-lg hover:glass-surface-blue/30 transition-colors">
              Trigger Button
            </button>
          </GlassTooltipTrigger>
          <GlassTooltipContent>
            <p>This tooltip uses explicit GlassTooltipTrigger and GlassTooltipContent components</p>
          </GlassTooltipContent>
        </GlassTooltip>

        <GlassTooltip content={<p>Tooltip positioned to the right</p>} position="right" showDelay={args.showDelay} hideDelay={args.hideDelay}>
          <GlassTooltipTrigger asChild>
            <button className="px-4 py-2 glass-surface-success glass-radius-lg hover:glass-surface-green/30 transition-colors">
              Right Side
            </button>
          </GlassTooltipTrigger>
          <GlassTooltipContent>
            <p>Tooltip positioned to the right</p>
          </GlassTooltipContent>
        </GlassTooltip>
      </div>
    </div>
  ),
  args: {
    children: null,
  },
};

export const CustomTriggerContent: Story = {
  render: (args) => (
    <div className="gap-4">
      <GlassTooltip content={
        <div className="gap-2">
          <div className="font-semibold">Custom Trigger</div>
          <p className="text-sm opacity-90">
            This tooltip uses a custom div element as the trigger instead of a button.
          </p>
        </div>
      } showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <div className="p-3 glass-surface-info glass-radius-lg cursor-pointer hover:glass-surface-primary/30 transition-colors">
            <span className="text-sm font-medium">Custom Trigger Element</span>
          </div>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <div className="gap-2">
            <div className="font-semibold">Custom Trigger</div>
            <p className="text-sm opacity-90">
              This tooltip uses a custom div element as the trigger instead of a button.
            </p>
          </div>
        </GlassTooltipContent>
      </GlassTooltip>

      <GlassTooltip content={<p>Inline span element as tooltip trigger</p>} position="bottom" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <span className="inline-block px-2 py-1 glass-surface-primary/20 glass-radius-md cursor-pointer hover:glass-surface-primary/30 transition-colors text-sm">
            Hover me
          </span>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <p>Inline span element as tooltip trigger</p>
        </GlassTooltipContent>
      </GlassTooltip>
    </div>
  ),
  args: {
    children: null,
  },
};