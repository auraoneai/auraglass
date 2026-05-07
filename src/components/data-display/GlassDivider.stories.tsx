import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassDivider } from "./GlassDivider";

const meta: Meta<typeof GlassDivider> = {
  title: 'Data + Visualization/Glass Divider',
  component: GlassDivider,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass divider with labels, decorative endpoints, orientation, and animated variants.",
      },
    },
  },
  args: {
    label: "Overview",
    variant: "gradient",
    color: "primary",
    size: "sm",
  },
};

export default meta;
type Story = StoryObj<typeof GlassDivider>;

export const Default: Story = {
  render: (args) => (
    <div
      className="glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-6"
      style={{ width: 640 }}
    >
      <h3 className="glass-text-base glass-font-semibold glass-text-primary">
        Campaign summary
      </h3>
      <p className="glass-mt-1 glass-text-sm glass-text-secondary">
        Section dividers separate dense content without heavy visual chrome.
      </p>
      <GlassDivider {...args} />
      <div className="glass-grid glass-grid-cols-3 glass-gap-3">
        {["Spend", "Reach", "Quality"].map((label) => (
          <div
            key={label}
            className="glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3"
          >
            <div className="glass-text-xs glass-text-secondary">{label}</div>
            <div className="glass-text-sm glass-font-semibold glass-text-primary">
              Healthy
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div
      className="glass-flex glass-flex-col glass-gap-4 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-6"
      style={{ width: 680 }}
    >
      <GlassDivider label="Gradient" variant="gradient" color="primary" />
      <GlassDivider label="Dashed" variant="dashed" color="muted" />
      <GlassDivider
        label="Glow"
        variant="glow"
        color="accent"
        opacity="strong"
      />
      <div className="glass-flex glass-h-36 glass-gap-6">
        <div className="glass-flex-1 glass-radius-lg glass-surface-overlay glass-p-4">
          Left panel
        </div>
        <GlassDivider orientation="vertical" variant="gradient" label="or" />
        <div className="glass-flex-1 glass-radius-lg glass-surface-overlay glass-p-4">
          Right panel
        </div>
      </div>
    </div>
  ),
};
