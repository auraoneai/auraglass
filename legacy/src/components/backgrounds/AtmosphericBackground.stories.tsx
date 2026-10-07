import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AtmosphericBackground from './AtmosphericBackground';

const meta: Meta<typeof AtmosphericBackground> = {
  title: 'Effects + Advanced/Atmospheric Background',
  component: AtmosphericBackground,
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Atmospheric background constrained to a readable media-style composition.',
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Custom CSS class name',
    },
    variant: {
      control: { type: 'select' },
      options: ['clear', 'cloudy', 'rainy', 'stormy', 'foggy', 'sunny'],
      description: 'Atmospheric variant',
    },
    intensity: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Effect intensity',
    },
    animate: {
      control: 'boolean',
      description: 'Enable animations',
    },
  },
  args: {
    className: '',
    variant: 'clear',
    intensity: 0.5,
    animate: false,
  },
};

export default meta;
type Story = StoryObj<typeof AtmosphericBackground>;

export const Default: Story = {
  render: (args) => (
    <AtmosphericBackground
      {...args}
      className="glass-w-full glass-flex glass-items-center glass-justify-center"
      style={{ minHeight: 'min(100vh, 760px)' }}
      baseColor="rgba(226, 232, 240, 0.72)"
      gradientColors={[
        'rgba(255, 255, 255, 0.28)',
        'rgba(241, 245, 249, 0.22)',
        'rgba(226, 232, 240, 0.18)',
      ]}
      animate={false}
    >
      <section
        className="glass-w-full glass-max-w-3xl glass-rounded-2xl glass-p-8 glass-shadow-2xl glass-backdrop-blur-md"
        style={{ width: 'min(calc(100vw - 48px), 48rem)', maxWidth: '100%', minWidth: 0, color: '#0f172a', background: 'rgba(255,255,255,.24)' }}
      >
        <p className="glass-text-sm glass-font-semibold glass-uppercase glass-tracking-wide" style={{ color: 'rgba(15, 23, 42, 0.94)' }}>
          Atmospheric surface
        </p>
        <h1
          className="glass-mt-2 glass-font-semibold"
          style={{ overflowWrap: 'anywhere', wordBreak: 'normal', color: '#0f172a', fontSize: 'clamp(1.45rem, 7vw, 1.875rem)', lineHeight: 1.1, maxWidth: '18ch' }}
        >
          Command center backdrop
        </h1>
        <p className="glass-mt-3 glass-max-w-2xl glass-text-sm" style={{ color: 'rgba(51, 65, 85, 0.92)' }}>
          Foreground panels remain legible while the background demonstrates depth and color.
        </p>
      </section>
    </AtmosphericBackground>
  ),
  args: {
    variant: 'clear',
    intensity: 0.5,
    animate: false,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-w-full glass-gap-4 glass-p-6"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
        minHeight: 'min(100vh, 760px)',
      }}
    >
      {[
        ['Dawn', ['rgba(14, 165, 233, 0.44)', 'rgba(245, 158, 11, 0.28)']],
        ['Night', ['rgba(37, 99, 235, 0.38)', 'rgba(124, 58, 237, 0.3)']],
        ['Signal', ['rgba(20, 184, 166, 0.38)', 'rgba(16, 185, 129, 0.24)']],
      ].map(([label, colors]) => (
        <AtmosphericBackground
          key={label as string}
          {...args}
          gradientColors={colors as string[]}
          className="glass-min-h-[360px] glass-overflow-hidden glass-rounded-2xl glass-p-5 glass-flex glass-items-end"
          animate={false}
        >
          <div className="glass-rounded-xl glass-bg-black/30 glass-p-4 glass-text-white glass-backdrop-blur-md">
            <h3 className="glass-text-base glass-font-semibold">{label as string}</h3>
            <p className="glass-mt-2 glass-text-sm glass-text-white/75">
              Compact media tile with controlled contrast.
            </p>
          </div>
        </AtmosphericBackground>
      ))}
    </div>
  ),
  args: {
    variant: 'cloudy',
  },
};
