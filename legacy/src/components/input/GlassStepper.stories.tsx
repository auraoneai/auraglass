import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassStepper } from "./GlassStepper";

const ControlledStepper = (args: React.ComponentProps<typeof GlassStepper>) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? 12);

  return (
    <div
      className="glass-flex glass-flex-col glass-gap-4 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
      style={{ width: 360 }}
    >
      <GlassStepper {...args} value={value} onChange={setValue} />
      <div className="glass-radius-lg glass-surface-overlay glass-p-3">
        <div className="glass-text-xs glass-text-secondary">
          Current allocation
        </div>
        <div className="glass-text-xl glass-font-semibold glass-text-primary">
          {args.formatValue ? args.formatValue(value) : value}
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Controls/Inputs/Glass Stepper',
  component: GlassStepper,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass numeric stepper for bounded quantities, percentages, and compact form controls.",
      },
    },
  },
  args: {
    label: "Daily budget",
    description: "Adjust in $250 increments.",
    min: 0,
    max: 5000,
    step: 250,
    defaultValue: 1250,
    precision: 0,
    size: "lg",
    variant: "info",
    formatValue: (value: number) => `$${value.toLocaleString()}`,
  },
} satisfies Meta<typeof GlassStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ControlledStepper {...args} />,
};

export const Vertical: Story = {
  args: {
    label: "Review threshold",
    description: "Escalate when confidence drops below this score.",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 85,
    orientation: "vertical",
    variant: "warning",
    formatValue: (value: number) => `${value}%`,
  },
  render: (args) => <ControlledStepper {...args} />,
};
