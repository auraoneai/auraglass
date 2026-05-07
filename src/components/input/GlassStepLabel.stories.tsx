import type { Meta, StoryObj } from "@storybook/react";
import { GlassStepLabel } from "./GlassStepLabel";

const meta: Meta<typeof GlassStepLabel> = {
  title: 'Controls/Inputs/Glass Step Label',
  component: GlassStepLabel,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The stepper label primitive for active, completed, and pending workflow states.",
      },
    },
  },
  args: {
    label: "Company profile",
    active: true,
    completed: false,
    orientation: "horizontal",
  },
};

export default meta;
type Story = StoryObj<typeof GlassStepLabel>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-grid glass-w-[min(420px,calc(100vw-48px))] glass-gap-3 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassStepLabel label="Account" active={false} completed orientation="horizontal" />
      <GlassStepLabel {...args} />
      <GlassStepLabel label="Billing" active={false} completed={false} orientation="horizontal" />
    </div>
  ),
};
