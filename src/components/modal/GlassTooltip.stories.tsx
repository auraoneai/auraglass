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
      <button className="glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg hover:glass-surface-blue/30 transition-colors">
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
    <div className="glass-grid glass-glass-grid-cols-2 glass-gap-8 max-w-2xl">
      <GlassTooltip position="top" content="Tooltip on top" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="glass-px-4 glass-py-2 glass-surface-danger glass-radius-lg">Top</button>
      </GlassTooltip>

      <GlassTooltip position="right" content="Tooltip on right" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="glass-px-4 glass-py-2 glass-surface-success glass-radius-lg">Right</button>
      </GlassTooltip>

      <GlassTooltip position="bottom" content="Tooltip on bottom" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg">Bottom</button>
      </GlassTooltip>

      <GlassTooltip position="left" content="Tooltip on left" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <button className="glass-px-4 glass-py-2 glass-surface-info glass-radius-lg">Left</button>
      </GlassTooltip>
    </div>
  ),
};

export const RichContent: Story = {
  render: (args) => (
    <GlassTooltip {...args}>
      <button className="glass-px-6 glass-py-3 glass-gradient-primary glass-gradient-primary glass-gradient-primary dark:glass-gradient-primary dark:glass-gradient-primary glass-radius-lg glass-font-medium">
        Rich Tooltip
      </button>
    </GlassTooltip>
  ),
  args: {
    content: (
      <div className="glass-gap-2 max-w-xs">
        <div className="glass-font-semibold">Advanced Tooltip</div>
        <p className="glass-text-sm glass-opacity-90">
          This tooltip supports rich content including multiple paragraphs,
          formatting, and even interactive elements.
        </p>
        <div className="glass-flex glass-gap-2 pt-2">
          <span className="glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius-md glass-text-xs">Feature</span>
          <span className="glass-px-2 glass-py-1 glass-surface-subtle/20 glass-radius-md glass-text-xs">Interactive</span>
        </div>
      </div>
    )
  }
};

// Explicit stories for GlassTooltipTrigger and GlassTooltipContent
export const TooltipComponents: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div className="glass-text-center">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Tooltip Component Examples</h3>
        <p className="glass-text-sm opacity-80">Using GlassTooltipTrigger and GlassTooltipContent explicitly</p>
      </div>

      <div className="glass-flex glass-justify-center glass-gap-4">
        <GlassTooltip content={<p>This tooltip uses explicit GlassTooltipTrigger and GlassTooltipContent components</p>} showDelay={args.showDelay} hideDelay={args.hideDelay}>
          <GlassTooltipTrigger asChild>
            <button className="glass-px-4 glass-py-2 glass-surface-primary glass-radius-lg hover:glass-surface-blue/30 transition-colors">
              Trigger Button
            </button>
          </GlassTooltipTrigger>
          <GlassTooltipContent>
            <p>This tooltip uses explicit GlassTooltipTrigger and GlassTooltipContent components</p>
          </GlassTooltipContent>
        </GlassTooltip>

        <GlassTooltip content={<p>Tooltip positioned to the right</p>} position="right" showDelay={args.showDelay} hideDelay={args.hideDelay}>
          <GlassTooltipTrigger asChild>
            <button className="glass-px-4 glass-py-2 glass-surface-success glass-radius-lg hover:glass-surface-green/30 transition-colors">
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
    <div className="glass-gap-4">
      <GlassTooltip content={
        <div className="glass-gap-2">
          <div className="glass-font-semibold">Custom Trigger</div>
          <p className="glass-text-sm glass-opacity-90">
            This tooltip uses a custom div element as the trigger instead of a button.
          </p>
        </div>
      } showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <div className="glass-p-3 glass-surface-info glass-radius-lg glass-cursor-pointer hover:glass-surface-primary/30 transition-colors">
            <span className="glass-text-sm glass-font-medium">Custom Trigger Element</span>
          </div>
        </GlassTooltipTrigger>
        <GlassTooltipContent>
          <div className="glass-gap-2">
            <div className="glass-font-semibold">Custom Trigger</div>
            <p className="glass-text-sm glass-opacity-90">
              This tooltip uses a custom div element as the trigger instead of a button.
            </p>
          </div>
        </GlassTooltipContent>
      </GlassTooltip>

      <GlassTooltip content={<p>Inline span element as tooltip trigger</p>} position="bottom" showDelay={args.showDelay} hideDelay={args.hideDelay}>
        <GlassTooltipTrigger asChild>
          <span className="inline-glass-block glass-px-2 glass-py-1 glass-surface-primary/20 glass-radius-md glass-cursor-pointer hover:glass-surface-primary/30 transition-colors glass-text-sm">
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