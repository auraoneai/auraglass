import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { KpiChart } from './KpiChart';
import { cn } from '../../../lib/utils';

const meta: Meta<typeof KpiChart> = {
  title: 'Components/Components/KpiChart',
  component: KpiChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism kpichart component.',
      },
    },
  },
  argTypes: {
    kpi: {
      control: 'object',
      description: 'KPI data object',
    },
    qualityTier: {
      control: 'select',
      options: ['low', 'medium', 'high', 'ultra'],
      description: 'Quality tier for animations',
    },
    color: {
      control: 'color',
      type: 'string',
      table: { type: { summary: 'string' } },
      description: 'Chart color',
    },
  },
  args: {
    kpi: {
      value: 1250,
      label: 'Revenue',
      change: 12.5,
      changeLabel: '+12.5%',
      format: 'currency',
    },
    qualityTier: 'medium',
    color: '#3b82f6',
  },
};

export default meta;
type Story = StoryObj<typeof KpiChart>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <KpiChart {...args} />
    </div>
  ),
};
