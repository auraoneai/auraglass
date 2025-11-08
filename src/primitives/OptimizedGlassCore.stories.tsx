'use client';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OptimizedGlassCore } from './OptimizedGlassCore';
import type { GlassVariant, BlurIntensity } from '../core/mixins/glassMixins';

const meta: Meta<typeof OptimizedGlassCore> = {
  title: 'Primitives/OptimizedGlassCore',
  component: OptimizedGlassCore,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The optimized glass morphism component with performance enhancements and advanced features.',
      },
    },
  },
  argTypes: {
    intent: {
      control: { type: 'select' },
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
      description: 'Glass intent that determines color scheme',
    },
    elevation: {
      control: { type: 'select' },
      options: ['level1', 'level2', 'level3', 'level4', 'level5'],
      description: 'Glass elevation level',
    },
    tier: {
      control: { type: 'select' },
      options: ['high', 'medium', 'low'],
      description: 'Performance tier',
    },
    intensity: {
      control: { type: 'select' },
      options: ['subtle', 'medium', 'strong', 'intense', 'ultra', 'extreme'],
      description: 'Glass intensity level',
    },
    rounded: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
      description: 'Border radius',
    },
    glow: {
      control: 'boolean',
      description: 'Enable glow effect',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive effects',
    },
    press: {
      control: 'boolean',
      description: 'Enable press effect',
    },
    liftOnHover: {
      control: 'boolean',
      description: 'Enable lift on hover effect',
    },
  },
  args: {
    intent: 'neutral',
    elevation: 'level2',
    tier: 'high',
    intensity: 'medium',
    rounded: 'md',
    glow: false,
    interactive: true,
    press: false,
    liftOnHover: false,
  },
};

export default meta;
type Story = StoryObj<typeof OptimizedGlassCore>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Optimized Glass</h3>
        <p className="text-sm opacity-80">Performance-optimized glass morphism surface.</p>
      </div>
    ),
  },
};

export const ElevationLevels: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['level1', 'level2', 'level3', 'level4', 'level5'] as const).map((elevation) => (
        <OptimizedGlassCore key={elevation} {...args} elevation={elevation}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{elevation}</h4>
            <p className="text-xs opacity-70">Elevation</p>
          </div>
        </OptimizedGlassCore>
      ))}
    </div>
  ),
  args: {
    children: null,
  },
};

export const IntentVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['neutral', 'primary', 'success', 'warning', 'danger', 'info'] as const).map((intent) => (
        <OptimizedGlassCore key={intent} {...args} intent={intent}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{intent}</h4>
            <p className="text-xs opacity-70">Intent</p>
          </div>
        </OptimizedGlassCore>
      ))}
    </div>
  ),
  args: {
    children: null,
  },
};

export const PerformanceTiers: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl">
      {(['high', 'medium', 'low'] as const).map((tier) => (
        <OptimizedGlassCore key={tier} {...args} tier={tier}>
          <div className="p-4 text-center">
            <h4 className="text-sm font-medium capitalize mb-1">{tier}</h4>
            <p className="text-xs opacity-70">Performance Tier</p>
          </div>
        </OptimizedGlassCore>
      ))}
    </div>
  ),
  args: {
    children: null,
  },
};

export const HighPerformance: Story = {
  args: {
    tier: 'high',
    hardwareAcceleration: true,
    children: (
      <div className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">High Performance</h3>
        <p className="text-sm opacity-80">
          Optimized for maximum performance with high tier enabled.
        </p>
      </div>
    ),
  },
};

export const Showcase: Story = {
  args: {
    intent: 'primary',
    elevation: 'level4',
    tier: 'high',
    intensity: 'strong',
    rounded: 'lg',
    glow: true,
    interactive: true,
    liftOnHover: true,
    press: true,
    children: (
      <div className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Premium Glass Effect
        </h3>
        <p className="text-sm opacity-80 mb-6 leading-relaxed">
          Experience the pinnacle of glass morphism technology with high elevation,
          primary intent, and interactive effects.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs font-medium">High Performance</span>
          <span className="px-3 py-1 bg-pink-500/20 rounded-full text-xs font-medium">Interactive</span>
          <span className="px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium">Premium Quality</span>
        </div>
      </div>
    ),
  },
};