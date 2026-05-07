import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassGrid } from './GlassGrid';

const meta: Meta<typeof GlassGrid> = {
  title: 'Surfaces/App Shells + Layout/Glass Grid',
  component: GlassGrid,
  parameters: {
    layout: 'centered',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Responsive CSS grid used in dashboard and panel layouts.',
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
type Story = StoryObj<typeof GlassGrid>;

const gridCards = [
  ['Revenue', '$128.4k', '+12.8%'],
  ['Pipeline', '42 deals', '+6'],
  ['Latency', '124ms', '-18ms'],
  ['Tickets', '17 open', '-9'],
];

export const Default: Story = {
  render: (args) => (
    <section className="glass-w-full glass-max-w-5xl glass-rounded-2xl glass-bg-white/60 glass-p-6 glass-shadow-xl">
      <div className="glass-mb-5 glass-flex glass-items-center glass-justify-between glass-gap-4">
        <div>
          <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
            Operations
          </p>
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
            Grid overview
          </h2>
        </div>
        <span className="glass-rounded-full glass-bg-blue-100 glass-px-3 glass-py-1 glass-text-xs glass-font-medium glass-text-blue-700">
          Live
        </span>
      </div>
      <GlassGrid {...args} cols={4} gap="md" className="glass-w-full">
        {gridCards.map(([label, value, change]) => (
          <article key={label} className="glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm">
            <p className="glass-text-sm glass-text-secondary">{label}</p>
            <div className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">
              {value}
            </div>
            <p className="glass-mt-2 glass-text-sm glass-text-green-700">{change}</p>
          </article>
        ))}
      </GlassGrid>
    </section>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <section className="glass-w-full glass-max-w-5xl glass-space-y-4">
      <GlassGrid {...args} autoFit minColWidth="180px" gap="lg" className="glass-w-full">
        {['Review queue', 'Health checks', 'Deployments', 'Incidents', 'Budgets', 'Owners'].map((label) => (
          <div key={label} className="glass-min-h-28 glass-rounded-xl glass-bg-white/70 glass-p-4 glass-shadow-sm">
            <h3 className="glass-text-sm glass-font-semibold glass-text-primary">{label}</h3>
            <p className="glass-mt-2 glass-text-sm glass-text-secondary">
              Compact content keeps the grid readable across viewport sizes.
            </p>
          </div>
        ))}
      </GlassGrid>
    </section>
  ),
  args: {
    className: '',
  },
};
