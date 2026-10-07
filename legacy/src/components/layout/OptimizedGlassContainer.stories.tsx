import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OptimizedGlassContainer } from './OptimizedGlassContainer';
import { cn } from '../../lib/utils';

const meta: Meta<typeof OptimizedGlassContainer> = {
  title: 'Surfaces/App Shells + Layout/Optimized Glass Container',
  component: OptimizedGlassContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism optimizedglasscontainer component.',
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
type Story = StoryObj<typeof OptimizedGlassContainer>;

export const Default: Story = {
  render: (args) => (
    <OptimizedGlassContainer
      {...args}
      autoOptimize={false}
      initialOptimizationLevel="light"
      className={cn("glass-w-full glass-max-w-xl glass-radius-3xl glass-p-6", args.className)}
    >
      <div style={{ display: 'grid', gap: 16, color: '#172033', minWidth: 0 }}>
        <div>
          <p style={{ margin: 0, color: '#526071', fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>Adaptive rendering</p>
          <h2 style={{ margin: '5px 0 4px', fontSize: 24, lineHeight: 1.15 }}>Optimized liquid glass</h2>
          <p style={{ margin: 0, color: '#526071', lineHeight: 1.5 }}>Material depth responds to available performance while content and layout remain stable.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: 10 }}>
          {[["Target", "60 FPS"], ["Material", "Light frost"], ["Motion", "Reduced-safe"]].map(([label, value]) => (
            <div key={label} style={{ padding: 14, borderRadius: 16, border: '1px solid rgba(80,102,130,.16)', background: 'rgba(255,255,255,.22)' }}>
              <small style={{ display: 'block', color: '#526071' }}>{label}</small>
              <strong style={{ display: 'block', marginTop: 4 }}>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </OptimizedGlassContainer>
  ),
  args: { className: '' },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <OptimizedGlassContainer {...args}>
        Default
      </OptimizedGlassContainer>
    </div>
  ),
  args: {
    
  },
};
