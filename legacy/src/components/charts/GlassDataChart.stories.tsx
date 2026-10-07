import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassDataChart, type ChartDataset } from './GlassDataChart';

const datasets: ChartDataset[] = [
  {
    id: 'activation',
    label: 'Activation',
    formatType: 'percentage',
    data: [
      { x: 'Mon', y: 61 },
      { x: 'Tue', y: 66 },
      { x: 'Wed', y: 72 },
      { x: 'Thu', y: 69 },
      { x: 'Fri', y: 78 },
      { x: 'Sat', y: 82 },
    ],
  },
  {
    id: 'retention',
    label: 'Retention',
    formatType: 'percentage',
    data: [
      { x: 'Mon', y: 54 },
      { x: 'Tue', y: 58 },
      { x: 'Wed', y: 63 },
      { x: 'Thu', y: 64 },
      { x: 'Fri', y: 68 },
      { x: 'Sat', y: 71 },
    ],
  },
];

const ChartFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    className="glass-rounded-xl glass-border glass-border-white/40 glass-bg-white/55 glass-p-5 glass-shadow-xl"
    style={{ width: 'min(960px, calc(100vw - 48px))', overflowX: 'auto' }}
  >
    {children}
  </div>
);

const meta: Meta<typeof GlassDataChart> = {
  title: 'Data + Visualization/Glass Data Chart',
  component: GlassDataChart,
  parameters: {
    layout: 'padded',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Production data chart example with explicit datasets, legend, toolbar, and responsive frame.',
      },
    },
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['line', 'bar', 'area', 'pie', 'doughnut', 'polarArea', 'kpi'] },
    glassVariant: { control: { type: 'select' }, options: ['clear', 'frosted', 'tinted', 'luminous'] },
    height: { control: 'number' },
  },
  args: {
    title: 'Activation cohort',
    subtitle: 'Daily conversion and retention across the current launch week',
    variant: 'line',
    datasets,
    width: '100%',
    height: 380,
    glassVariant: 'frosted',
    showToolbar: true,
    allowDownload: false,
    legend: {
      show: true,
      position: 'top',
      align: 'center',
      style: 'default',
      glassEffect: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassDataChart>;

export const Default: Story = {
  render: (args) => (
    <ChartFrame>
      <GlassDataChart {...args} />
    </ChartFrame>
  ),
};

export const AreaComparison: Story = {
  render: (args) => (
    <ChartFrame>
      <GlassDataChart {...args} title="Area comparison" variant="area" />
    </ChartFrame>
  ),
};
