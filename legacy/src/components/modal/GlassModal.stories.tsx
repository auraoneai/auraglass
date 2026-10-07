import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassModal } from "./GlassModal";

const ModalBody = () => (
  <div className="glass-flex glass-flex-col glass-gap-4 glass-p-6">
    <p className="glass-text-sm glass-text-secondary">
      This open modal demonstrates real content density, a footer action row,
      and enough surrounding application surface to judge the overlay.
    </p>
    <div className="glass-grid glass-grid-cols-1 sm:glass-grid-cols-2 glass-gap-3">
      {[
        ["Audience", "Enterprise admins"],
        ["Budget", "$24,000"],
        ["Flight", "May 8-17"],
        ["Status", "Ready"],
      ].map(([label, value]) => (
        <div
          key={label}
          className="glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-3"
        >
          <div className="glass-text-xs glass-text-secondary">{label}</div>
          <div className="glass-text-sm glass-font-semibold glass-text-primary">
            {value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ControlledModal = (args: React.ComponentProps<typeof GlassModal>) => {
  const [open, setOpen] = useState(args.open ?? true);

  return (
    <div style={{ minHeight: 620, width: "100%" }}>
      <div className="glass-m-8 glass-flex glass-max-w-xl glass-flex-col glass-gap-4 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-6">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
          Campaign launch
        </h3>
        <p className="glass-text-sm glass-text-secondary">
          Modal stories should render the component itself, not a closed trigger
          that leaves the preview empty.
        </p>
        <button
          className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary glass-text-sm"
          onClick={() => setOpen(true)}
        >
          Open modal
        </button>
      </div>
      <GlassModal
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div className="glass-flex glass-justify-end glass-gap-2 glass-p-4">
            <button
              className="glass-px-4 glass-py-2 glass-radius-md glass-surface-overlay glass-text-primary glass-text-sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary glass-text-sm"
              onClick={() => setOpen(false)}
            >
              Launch
            </button>
          </div>
        }
      >
        <ModalBody />
      </GlassModal>
    </div>
  );
};

const meta: Meta<typeof GlassModal> = {
  title: 'Surfaces/Modals/Glass Modal',
  component: GlassModal,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A versatile glassmorphism modal for focused workflows and confirmations.",
      },
    },
  },
  args: {
    open: true,
    title: "Launch campaign",
    description: "Review the campaign settings before publishing.",
    size: "md",
    animation: "scale",
    showCloseButton: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassModal>;

export const Default: Story = {
  render: (args) => <ControlledModal {...args} />,
};

export const FullscreenReview: Story = {
  args: {
    title: "Production readiness report",
    description: "Fullscreen mode for long-form review and sign-off.",
    variant: "fullscreen",
    size: "full",
  },
  render: (args) => <ControlledModal {...args} />,
};
