import type { Meta, StoryObj } from "@storybook/react";
import { GlassCheckbox } from "./GlassCheckbox";

const meta: Meta<typeof GlassCheckbox> = {
  title: 'Controls/Inputs/Glass Checkbox',
  component: GlassCheckbox,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass checkbox for consent, preference, and review checklist flows.",
      },
    },
  },
  args: {
    label: "Require launch approval",
    description: "Route campaign changes to the workspace approver before publishing.",
    variant: "info",
    size: "md",
    defaultChecked: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassCheckbox>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-grid glass-w-[min(560px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassCheckbox {...args} />
      <GlassCheckbox label="Notify channel" description="Post a summary to the launch room." variant="success" defaultChecked />
      <GlassCheckbox label="Flag budget changes" description="Warn reviewers when spend changes by more than 10%." variant="warning" />
      <GlassCheckbox label="External sharing" description="Blocked by workspace policy." variant="error" disabled />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="glass-grid glass-w-[min(520px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassCheckbox {...args} size="sm" label="Small approval item" />
      <GlassCheckbox {...args} size="md" label="Medium approval item" />
      <GlassCheckbox {...args} size="lg" label="Large approval item" />
    </div>
  ),
};
