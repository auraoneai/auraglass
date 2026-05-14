import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Download, MessageSquare, Share2 } from "@/icons";
import SpeedDialAction from "./SpeedDialAction";

const meta: Meta<typeof SpeedDialAction> = {
  title: 'Controls/Buttons/Speed Dial Action',
  component: SpeedDialAction,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A single speed-dial action with glass styling, tooltip text, and keyboard focus.",
      },
    },
  },
  args: {
    open: true,
    glass: true,
    showTooltip: true,
    direction: "up",
    size: "medium",
    tooltipTitle: "Share",
    icon: <Share2 size={18} aria-hidden="true" />,
  },
};

export default meta;
type Story = StoryObj<typeof SpeedDialAction>;

export const Default: Story = {
  render: (args) => (
    <div
      className="glass-relative glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-8"
      style={{ width: "min(360px, calc(100vw - 64px))", minHeight: 180 }}
    >
      <SpeedDialAction {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-grid-cols-3 glass-gap-4 glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-8"
      style={{ width: "min(640px, calc(100vw - 64px))", minHeight: 180 }}
    >
      {[
        { icon: <Share2 size={18} aria-hidden="true" />, tooltipTitle: "Share" },
        { icon: <Download size={18} aria-hidden="true" />, tooltipTitle: "Export" },
        {
          icon: <MessageSquare size={18} aria-hidden="true" />,
          tooltipTitle: "Comment",
        },
      ].map((action, index) => (
        <div key={action.tooltipTitle} className="glass-relative glass-h-24">
          <SpeedDialAction {...args} {...action} index={index} totalActions={3} />
        </div>
      ))}
    </div>
  ),
};
