import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from './Box';

const meta: Meta<typeof Box> = {
  title: 'Surfaces/App Shells + Layout/Box',
  component: Box,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Primitive layout wrapper shown with realistic dashboard content.',
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
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: (args) => (
    <Box
      {...args}
      className="glass-w-[360px] glass-rounded-xl glass-border glass-border-white/30 glass-bg-white/70 glass-p-5 glass-shadow-lg"
      role="region"
      aria-label="Release status card"
    >
      <div className="glass-flex glass-items-start glass-justify-between glass-gap-4">
        <div>
          <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
            Release
          </p>
          <h3 className="glass-mt-1 glass-text-lg glass-font-semibold glass-text-primary">
            Mobile Shell 2.4
          </h3>
        </div>
        <span className="glass-rounded-full glass-bg-green-100 glass-px-3 glass-py-1 glass-text-xs glass-font-medium glass-text-green-700">
          Ready
        </span>
      </div>
      <div className="glass-mt-5 glass-grid glass-grid-cols-3 glass-gap-3 glass-text-sm">
        {[
          ['Checks', '18/18'],
          ['Bundle', '42kb'],
          ['A11y', 'AA'],
        ].map(([label, value]) => (
          <div key={label} className="glass-rounded-lg glass-bg-white/60 glass-p-3">
            <div className="glass-text-xs glass-text-secondary">{label}</div>
            <div className="glass-mt-1 glass-font-semibold glass-text-primary">{value}</div>
          </div>
        ))}
      </div>
    </Box>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-grid glass-w-[720px] glass-grid-cols-3 glass-gap-4">
      {['Muted', 'Elevated', 'Outlined'].map((label, index) => (
        <Box
          key={label}
          {...args}
          className={[
            'glass-min-h-32 glass-rounded-xl glass-p-4 glass-shadow-md',
            index === 0 && 'glass-bg-white/55',
            index === 1 && 'glass-bg-white/75 glass-shadow-xl',
            index === 2 && 'glass-border glass-border-white/40 glass-bg-transparent',
          ].filter(Boolean).join(' ')}
        >
          <h3 className="glass-text-sm glass-font-semibold glass-text-primary">{label}</h3>
          <p className="glass-mt-2 glass-text-sm glass-text-secondary">
            A composed box with stable padding and readable content.
          </p>
        </Box>
      ))}
    </div>
  ),
  args: {
    className: '',
  },
};
