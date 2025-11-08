'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassCore } from './GlassCore';
import { GlassVariant, BlurIntensity } from '../core/mixins/glassMixins';

const meta: Meta<typeof GlassCore> = {
  title: 'Primitives/GlassCore',
  component: GlassCore,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The core glass morphism component that provides the foundation for all glass effects in the design system.',
      },
    },
  },
  argTypes: {
    intent: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
      description: 'Glass semantic intent that affects color theming',
    },
    elevation: {
      control: { type: 'select' },
      options: ['level1', 'level2', 'level3', 'level4'],
      description: 'Glass elevation level affecting shadow and blur intensity',
    },
    tier: {
      control: { type: 'select' },
      options: ['low', 'medium', 'high', 'ultra'],
      description: 'Performance quality tier for rendering optimization',
    },
    radius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Border radius of the glass surface',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive states (hover, focus, active)',
    },
    hoverLift: {
      control: 'boolean',
      description: 'Enable hover lift effect',
    },
    focusRing: {
      control: 'boolean',
      description: 'Enable focus ring for accessibility',
    },
    press: {
      control: 'boolean',
      description: 'Enable press effect for interactive feedback',
    },
  },
  args: {
    intent: 'neutral',
    elevation: 'level2',
    tier: 'high',
    radius: 'md',
    interactive: false,
    hoverLift: false,
    focusRing: false,
    press: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassCore>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Default Glass Surface</h3>
        <p className="text-sm opacity-80">This is the default glass morphism effect.</p>
      </div>
    ),
  },
};

export const Intents: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const).map((intent) => (
        <GlassCore key={intent} {...args} intent={intent}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{intent}</h4>
            <p className="text-xs opacity-70">Intent</p>
          </div>
        </GlassCore>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const Elevations: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['level1', 'level2', 'level3', 'level4'] as const).map((elevation) => (
        <GlassCore key={elevation} {...args} elevation={elevation}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{elevation}</h4>
            <p className="text-xs opacity-70">Elevation</p>
          </div>
        </GlassCore>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    hoverLift: true,
    focusRing: true,
    press: true,
    children: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Interactive Glass</h3>
        <p className="text-sm opacity-80">Glass surface with interactive effects.</p>
      </div>
    ),
  },
};

export const HoverLift: Story = {
  args: {
    hoverLift: true,
    children: (
      <div className="p-6 text-center cursor-pointer">
        <h3 className="text-lg font-semibold mb-2">Hover Lift Effect</h3>
        <p className="text-sm opacity-80">Hover over this surface to see the lift effect.</p>
      </div>
    ),
  },
};

export const DifferentBorderRadii: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((radius) => (
        <GlassCore key={radius} {...args} radius={radius}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{radius}</h4>
            <p className="text-xs opacity-70">Radius</p>
          </div>
        </GlassCore>
      ))}
    </div>
  ),
  args: {
    children: null, // Will be overridden in render
  },
};

export const ContentShowcase: Story = {
  args: {
    intent: 'primary',
    elevation: 'level3',
    interactive: true,
    hoverLift: true,
    children: (
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2">Premium Glass Effect</h3>
        <p className="text-sm opacity-80 mb-4">
          This showcases the full capabilities of our glass morphism system with crystal variant,
          heavy blur, purple glow, and hover effects.
        </p>
        <div className="flex justify-center space-x-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Interactive</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Responsive</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs">Accessible</span>
        </div>
      </div>
    ),
  },
};