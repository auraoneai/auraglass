import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ParticleBackground from './ParticleBackground';

const meta: Meta<typeof ParticleBackground> = {
  title: 'Effects + Advanced/Particle Background',
  component: ParticleBackground,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'media',
    docs: {
      description: {
        component: 'Animated particle background shown behind readable media content.',
      },
    },
  },
  argTypes: {
    // Component-specific argTypes will be added here
  },
  args: {
    // Default args will be added here
  },
};

export default meta;
type Story = StoryObj<typeof ParticleBackground>;

export const Default: Story = {
  render: (args) => (
    <ParticleBackground
      {...args}
      className="glass-w-full glass-flex glass-items-center glass-justify-center"
      style={{ minHeight: 'min(100vh, 760px)' }}
    >
      <div
        className="glass-w-full glass-max-w-3xl glass-rounded-2xl glass-bg-black/35 glass-p-8 glass-text-white glass-shadow-2xl glass-backdrop-blur-md"
        style={{ width: 'min(calc(100vw - 48px), 48rem)', maxWidth: '100%', minWidth: 0, color: '#f8fafc' }}
      >
        <p className="glass-text-sm glass-font-semibold glass-uppercase glass-tracking-wide glass-text-white/70" style={{ color: 'rgba(248, 250, 252, 0.78)' }}>
          Background layer
        </p>
        <h1
          className="glass-mt-2 glass-font-semibold"
          style={{ overflowWrap: 'anywhere', wordBreak: 'normal', color: '#ffffff', fontSize: 'clamp(1.45rem, 7vw, 1.875rem)', lineHeight: 1.1, maxWidth: '18ch' }}
        >
          Signal processing monitor
        </h1>
        <div
          className="glass-mt-6 glass-grid glass-gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
          }}
        >
          {['Nodes', 'Throughput', 'Noise'].map((label, index) => (
            <div key={label} className="glass-rounded-xl glass-bg-white/15 glass-p-4">
              <p className="glass-text-sm glass-text-white/70">{label}</p>
              <div className="glass-mt-2 glass-text-2xl glass-font-semibold">
                {['48', '6.8gb', 'Low'][index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ParticleBackground>
  ),
  args: {
    children: null,
  },
};

export const Variants: Story = {
  render: (args) => (
    <ParticleBackground
      {...args}
      className="glass-w-full glass-p-8 glass-flex glass-items-end glass-justify-center"
      style={{ minHeight: 'min(100vh, 760px)' }}
    >
      <div className="glass-w-full glass-max-w-4xl glass-rounded-2xl glass-bg-white/15 glass-p-6 glass-text-white glass-backdrop-blur-md">
        <h2 className="glass-text-xl glass-font-semibold">Media surface variant</h2>
        <p className="glass-mt-2 glass-text-sm glass-text-white/75">
          The particle field is constrained to the viewport with readable foreground content.
        </p>
      </div>
    </ParticleBackground>
  ),
  args: {
    children: null,
  },
};
