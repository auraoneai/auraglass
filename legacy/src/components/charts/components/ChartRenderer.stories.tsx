import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartRenderer } from './ChartRenderer';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof ChartRenderer> = {
  title: 'Data + Visualization/Chart Renderer',
  component: ChartRenderer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism chartrenderer component.',
      },
    },
  },
  argTypes: {
    chartType: {
      control: { type: 'select' },
      options: ['line', 'bar', 'area', 'pie', 'scatter', 'heatmap', 'radar'],
      description: 'Type of chart to render',
    },
    qualityTier: {
      control: { type: 'select' },
      options: ['low', 'medium', 'high', 'ultra'],
      description: 'Quality tier for rendering',
    },
    glassVariant: {
      control: { type: 'select' },
      options: ['frosted', 'dynamic', 'clear', 'tinted', 'luminous'],
      description: 'Glass morphism variant',
    },
  },
  args: {
    chartType: 'line',
    qualityTier: 'medium',
    glassVariant: 'frosted',
  },
};

export default meta;
type Story = StoryObj<typeof ChartRenderer>;

export const Default: Story = {
  args: {
    chartType: 'line',
    datasets: [{
            label: 'Sample Data',
            data: [10, 20, 15, 25, 30, 20],
            borderColor: 'hsl(var(--glass-color-primary))',
            backgroundColor: 'rgba(59, 130, 246, 0.18)',
    }],
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4">
      <div className="glass-relative glass-w-80 h-40 glass-surface-subtle/20 glass-radius-md glass-border glass-p-4 glass-contrast-guard">
        <ChartRenderer
          {...args}
          datasets={[{
            label: 'Sample Chart',
            data: [10, 20, 15, 25, 30, 20],
            borderColor: 'hsl(var(--glass-color-primary))',
            backgroundColor: 'rgba(59, 130, 246, 0.18)',
          }]}
        />
      </div>
    </div>
  ),
};
