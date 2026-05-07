import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassPopover } from "./GlassPopover";

const ToggleRow = ({ label, active }: { label: string; active?: boolean }) => (
  <div className="glass-flex glass-items-center glass-justify-between glass-gap-6 glass-py-2">
    <span className="glass-text-sm glass-text-primary">{label}</span>
    <span
      aria-hidden="true"
      className="glass-relative glass-inline-flex glass-h-5 glass-w-9 glass-items-center glass-radius-full glass-border glass-border-subtle glass-surface-overlay"
    >
      <span
        className="glass-h-4 glass-w-4 glass-radius-full glass-surface-blue"
        style={{ transform: active ? "translateX(16px)" : "translateX(2px)" }}
      />
    </span>
  </div>
);

const meta: Meta<typeof GlassPopover> = {
  title: 'Surfaces/Modals/Glass Popover',
  component: GlassPopover,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A positioned glass popover for compact contextual controls and detail cards.",
      },
    },
  },
  argTypes: {
    open: { control: "boolean" },
    placement: {
      control: { type: "select" },
      options: [
        "top",
        "top-start",
        "top-end",
        "right",
        "right-start",
        "right-end",
        "bottom",
        "bottom-start",
        "bottom-end",
        "left",
        "left-start",
        "left-end",
      ],
    },
    trigger: {
      control: { type: "select" },
      options: ["click", "hover", "focus", "manual"],
    },
    showArrow: { control: "boolean" },
    animation: {
      control: { type: "select" },
      options: ["fade", "scale", "slide"],
    },
  },
  args: {
    open: true,
    placement: "bottom",
    trigger: "manual",
    showArrow: true,
    animation: "scale",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "min(520px, calc(100vw - 48px))",
          minHeight: 360,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GlassPopover>;

export const Default: Story = {
  args: {
    content: (
      <div className="glass-w-72 glass-p-4">
        <h3 className="glass-text-sm glass-font-semibold glass-text-primary">
          Project actions
        </h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">
          Quick operations for the selected workspace.
        </p>
        <div className="glass-mt-4 glass-flex glass-flex-col glass-gap-2">
          {["Duplicate board", "Archive completed cards", "Export report"].map(
            (item) => (
              <button
                key={item}
                className="glass-w-full glass-radius-md glass-surface-overlay glass-px-3 glass-py-2 glass-text-left glass-text-sm glass-text-primary"
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>
    ),
    children: (
      <button className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary">
        Workspace menu
      </button>
    ),
  },
};

export const WithSettings: Story = {
  args: {
    title: "Notification settings",
    description: "Tune project alerts without leaving the current view.",
    placement: "top-start",
    content: (
      <div className="glass-w-80 glass-p-4">
        <ToggleRow label="Assignment changes" active />
        <ToggleRow label="Weekly digest" active />
        <ToggleRow label="Release warnings" />
      </div>
    ),
    children: (
      <button className="glass-px-4 glass-py-2 glass-radius-md glass-surface-overlay glass-text-primary">
        Notification rules
      </button>
    ),
  },
};
