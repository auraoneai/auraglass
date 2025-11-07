import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassChart, ConsciousGlassChart, PredictiveGlassChart, AdaptiveGlassChart, ImmersiveGlassChart } from './GlassChart';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassChart> = {
  title: 'Components/Charts/GlassChart',
  component: GlassChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glassmorphism chart component with consciousness interface features including predictive analysis, eye tracking, biometric adaptation, and spatial audio.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'className prop',
    },
    data: {
      control: 'object',
      description: 'Chart data',
    },
    type: {
      control: 'select',
      options: ['line', 'bar', 'area', 'pie'],
      description: 'Chart type',
    },
  },
  args: {
    className: '',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 120 },
      { x: 'Mar', y: 150 },
      { x: 'Apr', y: 130 },
      { x: 'May', y: 180 },
    ],
    type: 'line' as const,
  },
};

export default meta;

// Consciousness interface demonstrations
export const ConsciousnessOverview: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="text-center gap-2">
        <h2 className="text-xl font-semibold text-primary">Consciousness Interface Features</h2>
        <p className="text-sm glass-text-secondary">Experience next-generation chart interactions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 glass-surface-blue glass-radius-full animate-pulse"></div>
            <h3 className="font-medium text-primary">Predictive Engine</h3>
          </div>
          <ul className="text-sm glass-text-secondary gap-1 ml-5">
            <li>• Automatic data preloading</li>
            <li>• Pattern recognition</li>
            <li>• Predictive insights</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 glass-surface-green glass-radius-full animate-pulse"></div>
            <h3 className="font-medium text-primary">Eye Tracking</h3>
          </div>
          <ul className="text-sm glass-text-secondary gap-1 ml-5">
            <li>• Gaze-responsive highlighting</li>
            <li>• Attention-based interactions</li>
            <li>• Focus analytics</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 glass-surface-primary glass-radius-full animate-pulse"></div>
            <h3 className="font-medium text-primary">Biometric Adaptation</h3>
          </div>
          <ul className="text-sm glass-text-secondary gap-1 ml-5">
            <li>• Stress-level responsiveness</li>
            <li>• Complexity adjustment</li>
            <li>• Cognitive load optimization</li>
          </ul>
        </div>
        
        <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 glass-surface-primary glass-radius-full animate-pulse"></div>
            <h3 className="font-medium text-primary">Spatial Audio</h3>
          </div>
          <ul className="text-sm glass-text-secondary gap-1 ml-5">
            <li>• Positional sound feedback</li>
            <li>• Audio data sonification</li>
            <li>• Immersive experience</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
type Story = StoryObj<typeof GlassChart>;

export const Default: Story = {
  args: {
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 120 },
      { x: 'Mar', y: 150 },
      { x: 'Apr', y: 130 },
      { x: 'May', y: 180 },
    ],
    type: 'line' as const,
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="flex flex-wrap gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-primary">Default</h3>
        <GlassChart {...args} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-primary">Bar Chart</h3>
        <GlassChart {...args} type="bar" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-primary">Area Chart</h3>
        <GlassChart {...args} type="area" />
      </div>
    </div>
  ),
  args: {
    data: [
      { x: 'Q1', y: 150 },
      { x: 'Q2', y: 200 },
      { x: 'Q3', y: 180 },
      { x: 'Q4', y: 220 },
    ],
  },
};

export const WithPredictiveFeatures: Story = {
  render: (args: any) => (
    <div className="gap-4">
      <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4">
        <h3 className="text-sm font-medium text-primary mb-2">Predictive Chart</h3>
        <p className="text-xs glass-text-secondary mb-4">Automatically preloads data and shows predictive insights</p>
        <PredictiveGlassChart {...args} />
      </div>
    </div>
  ),
  args: {
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 120 },
      { x: 'Mar', y: 150 },
      { x: 'Apr', y: 130 },
      { x: 'May', y: 180 },
      { x: 'Jun', y: 200 },
    ],
    type: 'line' as const,
  },
};

export const WithEyeTracking: Story = {
  render: (args: any) => (
    <div className="gap-4">
      <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4">
        <h3 className="text-sm font-medium text-primary mb-2">Eye Tracking Enabled</h3>
        <p className="text-xs glass-text-secondary mb-4">Responds to user gaze and highlights data points</p>
        <GlassChart {...args} />
      </div>
    </div>
  ),
  args: {
    data: [
      { x: 'Product A', y: 150 },
      { x: 'Product B', y: 200 },
      { x: 'Product C', y: 180 },
      { x: 'Product D', y: 220 },
      { x: 'Product E', y: 190 },
    ],
    type: 'bar' as const,
  },
};

export const AdaptiveChart: Story = {
  render: (args: any) => (
    <div className="gap-4">
      <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4">
        <h3 className="text-sm font-medium text-primary mb-2">Biometric Adaptive</h3>
        <p className="text-xs glass-text-secondary mb-4">Adjusts complexity based on user stress levels</p>
        <AdaptiveGlassChart {...args} />
      </div>
    </div>
  ),
  args: {
    data: [
      { x: '00:00', y: 45 },
      { x: '04:00', y: 32 },
      { x: '08:00', y: 78 },
      { x: '12:00', y: 95 },
      { x: '16:00', y: 85 },
      { x: '20:00', y: 55 },
    ],
    type: 'area' as const,
  },
};

export const ImmersiveExperience: Story = {
  render: (args: any) => (
    <div className="gap-4">
      <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4">
        <h3 className="text-sm font-medium text-primary mb-2">Immersive with Spatial Audio</h3>
        <p className="text-xs glass-text-secondary mb-4">Full consciousness features with spatial audio feedback</p>
        <ImmersiveGlassChart {...args} />
      </div>
    </div>
  ),
  args: {
    data: [
      { x: 'Revenue', y: 2500000 },
      { x: 'Costs', y: 1800000 },
      { x: 'Profit', y: 700000 },
      { x: 'Growth', y: 350000 },
    ],
    type: 'bar' as const,
  },
};

export const ConsciousnessComparison: Story = {
  render: (args: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4">
        <h3 className="text-sm font-medium text-primary mb-2">Standard Chart</h3>
        <GlassChart {...args} />
      </div>
      <div className="glass-surface-overlay backdrop-blur-sm glass-radius-lg p-4">
        <h3 className="text-sm font-medium text-primary mb-2">Consciousness Enhanced</h3>
        <ConsciousGlassChart {...args} />
      </div>
    </div>
  ),
  args: {
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 120 },
      { x: 'Mar', y: 150 },
      { x: 'Apr', y: 130 },
      { x: 'May', y: 180 },
    ],
    type: 'line' as const,
  },
};
