import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassFlex } from './GlassFlex';

const meta: Meta<typeof GlassFlex> = {
  title: 'Surfaces/App Shells + Layout/Glass Flex',
  component: GlassFlex,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Responsive flex layouts with realistic toolbar and metric content.',
      },
    },
  },
  argTypes: {
    className: { control: 'text', description: 'Additional CSS classes' },
  },
  args: {
    className: '',
    gap: 'md',
    wrap: 'wrap',
    align: 'stretch',
  },
};

export default meta;
type Story = StoryObj<typeof GlassFlex>;

const tiles = [
  ['Queue', '18', 'Ready for review'],
  ['Velocity', '+12%', 'Week over week'],
  ['Risk', '3', 'Needs owner'],
];

export const Default: Story = {
  render: (args) => (
    <GlassFlex
      {...args}
      className="glass-w-full glass-max-w-4xl glass-rounded-2xl glass-bg-white/55 glass-p-5 glass-shadow-xl"
      aria-label="Operations metric row"
    >
      {tiles.map(([label, value, note]) => (
        <article key={label} className="glass-min-w-0 glass-flex-1 glass-rounded-xl glass-bg-white/65 glass-p-4">
          <p className="glass-text-sm glass-text-secondary">{label}</p>
          <div className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">{value}</div>
          <p className="glass-mt-2 glass-text-sm glass-text-secondary">{note}</p>
        </article>
      ))}
    </GlassFlex>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-w-full glass-max-w-4xl glass-space-y-4">
      <GlassFlex {...args} justify="between" className="glass-rounded-2xl glass-bg-white/60 glass-p-4 glass-shadow-lg">
        <strong className="glass-text-primary">Between alignment</strong>
        <button className="glass-rounded-lg glass-bg-blue-600 glass-px-3 glass-py-2 glass-text-sm glass-font-medium glass-text-white">
          Review
        </button>
      </GlassFlex>
      <GlassFlex {...args} direction="col" gap="sm" className="glass-rounded-2xl glass-bg-white/60 glass-p-4 glass-shadow-lg">
        {['Discovery', 'Build', 'Ship'].map((step) => (
          <div key={step} className="glass-rounded-lg glass-bg-white/65 glass-p-3 glass-text-sm glass-text-primary">
            {step}
          </div>
        ))}
      </GlassFlex>
    </div>
  ),
};
