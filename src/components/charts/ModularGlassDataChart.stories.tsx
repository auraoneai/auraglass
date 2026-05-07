import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ModularGlassDataChart } from './ModularGlassDataChart';

const datasets = [
  {
    id: 'forecast',
    label: 'Forecast',
    data: [
      { x: 'Q1', y: 112 },
      { x: 'Q2', y: 128 },
      { x: 'Q3', y: 147 },
      { x: 'Q4', y: 166 },
    ],
    borderColor: 'var(--glass-color-primary)',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  {
    id: 'actual',
    label: 'Actual',
    data: [
      { x: 'Q1', y: 108 },
      { x: 'Q2', y: 136 },
      { x: 'Q3', y: 142 },
      { x: 'Q4', y: 174 },
    ],
    borderColor: 'var(--glass-color-success)',
    backgroundColor: 'rgba(34, 197, 94, 0.18)',
  },
];

const ChartFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    className="glass-rounded-xl glass-border glass-border-white/40 glass-bg-white/55 glass-p-5 glass-shadow-xl"
    style={{ width: 'min(980px, calc(100vw - 48px))', overflowX: 'auto' }}
  >
    {children}
  </div>
);

const meta: Meta<typeof ModularGlassDataChart> = {
  title: 'Data + Visualization/Modular Glass Data Chart',
  component: ModularGlassDataChart,
  parameters: {
    layout: 'padded',
    previewSurface: 'app',
    docs: {
      description: {
        component: 'Modular glass data chart composed from reusable renderer, tooltip, legend, and toolbar primitives.',
      },
    },
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: ['line', 'bar', 'area', 'pie', 'doughnut', 'polarArea', 'kpi'] },
    glassVariant: { control: { type: 'select' }, options: ['frosted', 'dynamic', 'clear', 'tinted', 'luminous'] },
    color: { control: { type: 'select' }, options: ['primary', 'secondary', 'blue', 'green', 'yellow', 'red', 'pink', 'gray'] },
  },
  args: {
    title: 'Forecast accuracy',
    subtitle: 'Modular chart renderer with glass legend and static export disabled for Storybook',
    variant: 'line' as any,
    datasets,
    width: '100%',
    height: 390,
    showToolbar: true,
    allowDownload: false,
    allowTypeSwitch: true,
    glassVariant: 'frosted',
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
type Story = StoryObj<typeof ModularGlassDataChart>;

export const Default: Story = {
  render: (args) => (
    <ChartFrame>
      <ModularGlassDataChart {...args} />
    </ChartFrame>
  ),
};

export const BarVariant: Story = {
  render: (args) => (
    <ChartFrame>
      <ModularGlassDataChart {...args} title="Quarterly bookings" variant={'bar' as any} allowTypeSwitch={false} />
    </ChartFrame>
  ),
};
