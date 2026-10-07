import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import WidgetGlass from './WidgetGlass';

const meta: Meta<typeof WidgetGlass> = {
  title: 'Surfaces/Cards + Panels/Widget Glass',
  component: WidgetGlass,
  parameters: {
    layout: 'centered',
    previewSurface: 'component',
    docs: {
      description: {
        component: 'Widget glass surface presented as real dashboard modules.',
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
type Story = StoryObj<typeof WidgetGlass>;

export const Default: Story = {
  render: (args) => (
    <WidgetGlass
      {...args}
      widgetType="panel"
      priority="high"
      padding={20}
      style={{ width: "min(380px, calc(100vw - 64px))" }}
    >
      <div className="glass-flex glass-items-center glass-justify-between glass-gap-4">
        <div>
          <p className="glass-text-sm glass-text-secondary">Throughput</p>
          <h3 className="glass-text-3xl glass-font-semibold glass-text-primary">18.2k</h3>
        </div>
        <span
          className="glass-radius-full glass-px-3 glass-py-1 glass-text-xs glass-font-medium"
          style={{ background: "rgba(220, 252, 231, 0.92)", color: "#15803d" }}
        >
          +9.4%
        </span>
      </div>
      <div className="glass-mt-5 glass-flex glass-h-20 glass-items-end glass-gap-2">
        {[36, 52, 44, 72, 58, 84, 68, 92].map((height, index) => (
          <div
            key={index}
            className="glass-flex-1"
            style={{
              height,
              borderRadius: "8px 8px 0 0",
              background: "rgba(59, 130, 246, 0.45)",
            }}
          />
        ))}
      </div>
    </WidgetGlass>
  ),
  args: {
    className: '',
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div
      className="glass-grid glass-grid-cols-3 glass-gap-4"
      style={{ width: "min(820px, calc(100vw - 64px))" }}
    >
      {[
        ['Queue', '24', 'medium'],
        ['Errors', '3', 'high'],
        ['Idle', '12%', 'low'],
      ].map(([label, value, priority]) => (
        <WidgetGlass key={label} {...args} priority={priority as any} className="glass-min-h-40">
          <p className="glass-text-sm glass-text-secondary">{label}</p>
          <div className="glass-mt-3 glass-text-2xl glass-font-semibold glass-text-primary">{value}</div>
          <p className="glass-mt-3 glass-text-sm glass-text-secondary">
            Widget content stays inside the glass surface.
          </p>
        </WidgetGlass>
      ))}
    </div>
  ),
  args: {
    className: '',
  },
};
