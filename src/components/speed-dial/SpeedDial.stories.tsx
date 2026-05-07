import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Download, MessageSquare, Plus, Share2 } from "lucide-react";
import { SpeedDial } from "./SpeedDial";
import SpeedDialAction from "./SpeedDialAction";

const actions = [
  { icon: <Share2 size={18} aria-hidden="true" />, tooltipTitle: "Share" },
  { icon: <Download size={18} aria-hidden="true" />, tooltipTitle: "Export" },
  {
    icon: <MessageSquare size={18} aria-hidden="true" />,
    tooltipTitle: "Comment",
  },
];

const meta: Meta<typeof SpeedDial> = {
  title: 'Controls/Buttons/Speed Dial',
  component: SpeedDial,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A floating glass action launcher with visible actions and responsive spacing.",
      },
    },
  },
  argTypes: {
    direction: {
      control: { type: "select" },
      options: ["up", "down", "left", "right"],
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    color: {
      control: { type: "select" },
      options: ["default", "primary", "secondary", "success", "warning", "error", "info"],
    },
  },
  args: {
    defaultOpen: true,
    direction: "up",
    size: "medium",
    color: "primary",
    glass: true,
    glassActions: true,
    showTooltips: true,
    ariaLabel: "Create or share",
    icon: <Plus size={22} aria-hidden="true" />,
    position: { bottom: 40, right: 40 },
  },
};

export default meta;
type Story = StoryObj<typeof SpeedDial>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-min-h-screen glass-p-6">
      <div
        className="glass-mx-auto glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
        style={{ maxWidth: 720 }}
      >
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
          Speed dial preview
        </h3>
        <p className="glass-text-sm glass-text-secondary">
          The menu is open by default so action spacing, tooltips, and glass
          surfaces are visible without interaction.
        </p>
      </div>
      <SpeedDial {...args}>
        {actions.map((action) => (
          <SpeedDialAction key={action.tooltipTitle} {...action} />
        ))}
      </SpeedDial>
    </div>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: "left",
    position: { bottom: 40, right: 40 },
  },
  render: (args) => (
    <div className="glass-min-h-screen glass-p-6">
      <SpeedDial {...args}>
        {actions.map((action) => (
          <SpeedDialAction key={action.tooltipTitle} {...action} />
        ))}
      </SpeedDial>
    </div>
  ),
};
