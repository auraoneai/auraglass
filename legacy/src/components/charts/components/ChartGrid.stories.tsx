import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChartGrid } from './ChartGrid';

const GridPreview = (args: React.ComponentProps<typeof ChartGrid>) => (
  <div
    className="glass-relative glass-overflow-hidden glass-rounded-xl glass-border glass-border-white/40 glass-bg-white/55 glass-p-6 glass-shadow-xl"
    style={{ width: 'min(260px, calc(100vw - 48px))', height: 220 }}
  >
    <ChartGrid {...args} />
    <div className="glass-absolute glass-inset-6 glass-flex glass-items-end glass-justify-around glass-gap-3">
      {[68, 46, 82, 58, 74].map((height, index) => (
        <div
          key={index}
          className="glass-w-7 glass-rounded-t-lg glass-shadow-md"
          style={{ height: `${height}%`, background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.88), rgba(20, 184, 166, 0.76))' }}
        />
      ))}
    </div>
    <div className="glass-absolute glass-left-6 glass-top-5 glass-text-sm glass-font-semibold glass-text-primary">
      Grid Example
    </div>
  </div>
);

const meta: Meta<typeof ChartGrid> = {
  title: 'Data + Visualization/Chart Grid',
  component: ChartGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A glass morphism chartgrid component.',
      },
    },
  },
  argTypes: {
    show: {
      control: 'boolean',
      description: 'Show grid lines',
    },
    style: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted'],
      description: 'Grid line style',
    },
    horizontal: {
      control: 'boolean',
      description: 'Show horizontal lines',
    },
    vertical: {
      control: 'boolean',
      description: 'Show vertical lines',
    },
  },
  args: {
    show: true,
    style: 'solid',
    horizontal: true,
    vertical: true,
  },
};

export default meta;
type Story = StoryObj<typeof ChartGrid>;

export const Default: Story = {
  render: (args) => <GridPreview {...args} />,
  args: {
    show: true,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-col glass-gap-4">
      <GridPreview {...args} />
    </div>
  ),
};
