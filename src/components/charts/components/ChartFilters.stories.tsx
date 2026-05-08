import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartFilters } from './ChartFilters';

const swatches = [
  'var(--glass-color-primary)',
  'var(--glass-color-success)',
  'var(--glass-color-warning)',
];

const FilterPreview = ({ qualityTier = 'medium' }: { qualityTier?: 'low' | 'medium' | 'high' | 'ultra' }) => (
  <div
    className="glass-relative glass-overflow-hidden glass-rounded-xl glass-border glass-border-white/40 glass-bg-white/55 glass-p-6 glass-shadow-xl"
    style={{ width: 'min(260px, calc(100vw - 48px))' }}
  >
    <ChartFilters qualityTier={qualityTier} />
    <div className="glass-grid glass-grid-cols-3 glass-gap-3">
      {['Revenue', 'Margin', 'Forecast'].map((label, index) => (
        <div key={label} className="glass-flex glass-flex-col glass-items-center glass-gap-2">
          <div
            className="glass-h-12 glass-w-12 glass-rounded-full glass-border glass-border-white/50 glass-shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${swatches[index]} 0%, rgba(255,255,255,0.72) 100%)`,
              filter: index === 1 ? 'url(#chart-glow)' : 'url(#chart-shadow)',
            }}
          />
          <span className="glass-text-xs glass-font-medium glass-text-primary" style={{ overflowWrap: 'anywhere' }}>{label}</span>
        </div>
      ))}
    </div>
  </div>
);

const meta: Meta<typeof ChartFilters> = {
  title: 'Data + Visualization/Chart Filters',
  component: ChartFilters,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism chartfilters component.',
      },
    },
  },
  argTypes: {
    qualityTier: {
      control: { type: 'select' },
      options: ['low', 'medium', 'high', 'ultra'],
      description: 'Quality tier for filter effects',
    },
  },
  args: {
    qualityTier: 'medium',
  },
};

export default meta;
type Story = StoryObj<typeof ChartFilters>;

export const Default: Story = {
  render: (args) => <FilterPreview qualityTier={args.qualityTier} />,
  args: {
    qualityTier: 'medium',
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4 glass-text-primary">
      <div>Quality: Low</div>
      <FilterPreview qualityTier="low" />
      <div>Quality: Medium</div>
      <FilterPreview qualityTier="medium" />
      <div>Quality: High</div>
      <FilterPreview qualityTier="high" />
    </div>
  ),
};
