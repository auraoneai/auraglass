import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlassBarChart } from './GlassBarChart';
import { cn } from '../../lib/utils';

const meta: Meta<typeof GlassBarChart> = {
  title: 'Components/Charts/GlassBarChart',
  component: GlassBarChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism glassbarchart component.',
      },
    },
  },
  argTypes: {
    showGrid: {
      control: 'boolean',
      description: 'Show grid lines',
    },
    showDataLabels: {
      control: 'boolean',
      description: 'Show data labels on bars',
    },
    showLegend: {
      control: 'boolean',
      description: 'Show legend',
    },
  },
  args: {
    showGrid: true,
    showDataLabels: true,
    showLegend: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassBarChart>;

const sampleData = [
  {
    id: 'series1',
    name: 'Series 1',
    data: [
      { x: 'Jan', y: 10 },
      { x: 'Feb', y: 15 },
      { x: 'Mar', y: 12 },
      { x: 'Apr', y: 18 },
    ],
  },
  {
    id: 'series2',
    name: 'Series 2',
    data: [
      { x: 'Jan', y: 8 },
      { x: 'Feb', y: 12 },
      { x: 'Mar', y: 16 },
      { x: 'Apr', y: 14 },
    ],
  },
];

export const Default: Story = {
  args: {
    series: sampleData,
    width: 400,
    height: 300,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-8">
      <GlassBarChart {...args} showGrid={true} showDataLabels={true} />
      <GlassBarChart {...args} showGrid={false} showDataLabels={false} showLegend={false} />
    </div>
  ),
  args: {
    series: sampleData,
    width: 400,
    height: 300,
  },
};
