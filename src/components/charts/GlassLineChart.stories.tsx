import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassLineChart, type ChartSeries } from './GlassLineChart';

const revenueSeries: ChartSeries[] = [
  {
    id: 'revenue',
    name: 'Revenue',
    color: 'var(--glass-color-primary)',
    data: [
      { x: 'Jan', y: 92 },
      { x: 'Feb', y: 118 },
      { x: 'Mar', y: 132 },
      { x: 'Apr', y: 126 },
      { x: 'May', y: 148 },
      { x: 'Jun', y: 171 },
    ],
  },
  {
    id: 'target',
    name: 'Target',
    color: 'var(--glass-color-success)',
    data: [
      { x: 'Jan', y: 100 },
      { x: 'Feb', y: 112 },
      { x: 'Mar', y: 124 },
      { x: 'Apr', y: 136 },
      { x: 'May', y: 148 },
      { x: 'Jun', y: 160 },
    ],
  },
];

const ChartFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    className="glass-w-full glass-rounded-xl glass-border glass-border-white/40 glass-bg-white/55 glass-p-5 glass-shadow-xl"
    style={{ width: 'min(920px, calc(100vw - 48px))', overflowX: 'auto' }}
  >
    {children}
  </div>
);

const meta: Meta<typeof GlassLineChart> = {
  title: 'Data + Visualization/Glass Line Chart',
  component: GlassLineChart,
  parameters: {
    layout: 'padded',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Glass line chart with multiple series, readable axes, legend, and hoverable data points.',
      },
    },
  },
  argTypes: {
    showGrid: { control: 'boolean' },
    showPoints: { control: 'boolean' },
    showLegend: { control: 'boolean' },
    showTooltips: { control: 'boolean' },
  },
  args: {
    title: 'Pipeline velocity',
    series: revenueSeries,
    width: 760,
    height: 360,
    showGrid: true,
    showPoints: true,
    showLegend: true,
    showTooltips: true,
    yAxisLabel: 'Bookings',
    formatYValue: (value) => `${Math.round(value)}k`,
  },
};

export default meta;
type Story = StoryObj<typeof GlassLineChart>;

export const Default: Story = {
  render: (args) => (
    <ChartFrame>
      <GlassLineChart {...args} />
    </ChartFrame>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-grid glass-gap-5 lg:glass-grid-cols-2">
      <ChartFrame>
        <GlassLineChart {...args} title="With points and legend" width={560} height={320} />
      </ChartFrame>
      <ChartFrame>
        <GlassLineChart
          {...args}
          title="Minimal trend"
          width={560}
          height={320}
          showPoints={false}
          showLegend={false}
          showGrid={false}
        />
      </ChartFrame>
    </div>
  ),
};
