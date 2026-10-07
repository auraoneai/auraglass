import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassBottomSheet } from "./GlassBottomSheet";

const SheetContent = () => (
  <div className="glass-flex glass-flex-col glass-gap-4">
    <div className="glass-grid glass-grid-cols-1 sm:glass-grid-cols-3 glass-gap-3">
      {["Plan", "Review", "Ship"].map((label, index) => (
        <div
          key={label}
          className="glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-4"
        >
          <div className="glass-text-xs glass-text-secondary">
            Step {index + 1}
          </div>
          <div className="glass-text-sm glass-font-semibold glass-text-primary">
            {label}
          </div>
        </div>
      ))}
    </div>
    <p className="glass-text-sm glass-text-secondary">
      Use bottom sheets for mobile-first task flows that need context without
      sending the user to a new page.
    </p>
    <div className="glass-flex glass-gap-2">
      <button className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary glass-text-sm">
        Continue
      </button>
      <button className="glass-px-4 glass-py-2 glass-radius-md glass-surface-overlay glass-text-primary glass-text-sm">
        Save draft
      </button>
    </div>
  </div>
);

const ControlledSheet = (
  args: React.ComponentProps<typeof GlassBottomSheet>
) => {
  const [open, setOpen] = useState(args.open ?? true);

  return (
    <div style={{ minHeight: 520, width: "min(920px, calc(100vw - 64px))" }}>
      <div className="glass-flex glass-flex-col glass-gap-4 glass-p-6 glass-radius-xl glass-surface-overlay glass-border glass-border-subtle">
        <div>
          <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
            Campaign review
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            The sheet is mounted open so its glass surface, header, and actions
            are visible in Storybook.
          </p>
        </div>
        <button
          className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary glass-text-sm"
          onClick={() => setOpen(true)}
        >
          Open bottom sheet
        </button>
      </div>
      <GlassBottomSheet {...args} open={open} onOpenChange={setOpen}>
        <SheetContent />
      </GlassBottomSheet>
    </div>
  );
};

const meta: Meta<typeof GlassBottomSheet> = {
  title: 'Surfaces/Modals/Glass Bottom Sheet',
  component: GlassBottomSheet,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A glass bottom sheet for compact action flows and mobile-style task panels.",
      },
    },
  },
  args: {
    open: true,
    title: "Publish campaign",
    description: "Confirm the launch checklist before continuing.",
    height: 420,
  },
};

export default meta;
type Story = StoryObj<typeof GlassBottomSheet>;

export const Default: Story = {
  render: (args) => <ControlledSheet {...args} />,
};

export const TallWorkflow: Story = {
  args: {
    title: "Audience settings",
    description:
      "Segment and budget controls stay reachable in a taller sheet.",
    height: "72%",
  },
  render: (args) => <ControlledSheet {...args} />,
};
