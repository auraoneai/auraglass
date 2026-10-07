import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassDialog } from "./GlassDialog";

const DialogContent = () => (
  <div className="glass-flex glass-flex-col glass-gap-4">
    <p className="glass-text-sm glass-text-secondary">
      This dialog uses realistic confirmation copy, a visible footer, and a
      Storybook wrapper that keeps the overlay from feeling like a blank page.
    </p>
    <div className="glass-radius-lg glass-border glass-border-subtle glass-surface-overlay glass-p-4">
      <div className="glass-text-xs glass-text-secondary">Release window</div>
      <div className="glass-text-sm glass-font-semibold glass-text-primary">
        May 8, 10:00 AM Pacific
      </div>
    </div>
  </div>
);

const ControlledDialog = (args: React.ComponentProps<typeof GlassDialog>) => {
  const [open, setOpen] = useState(args.open ?? true);

  return (
    <div style={{ minHeight: 520, width: "100%" }}>
      <div className="glass-m-8 glass-flex glass-max-w-lg glass-flex-col glass-gap-4 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-6">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
          Pending approval
        </h3>
        <p className="glass-text-sm glass-text-secondary">
          Open state is enabled by default so the dialog presentation can be
          reviewed immediately.
        </p>
        <button
          className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary glass-text-sm"
          onClick={() => setOpen(true)}
        >
          Open dialog
        </button>
      </div>
      <GlassDialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        footer={
          <div className="glass-flex glass-justify-end glass-gap-2">
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
              Approve
            </button>
          </div>
        }
      >
        <DialogContent />
      </GlassDialog>
    </div>
  );
};

const meta: Meta<typeof GlassDialog> = {
  title: 'Surfaces/Modals/Glass Dialog',
  component: GlassDialog,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A glass dialog for confirmations, forms, and focused decision points.",
      },
    },
  },
  args: {
    open: true,
    title: "Approve launch",
    description: "Confirm the campaign launch details before publishing.",
    size: "md",
    variant: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof GlassDialog>;

export const Default: Story = {
  render: (args) => <ControlledDialog {...args} />,
};

export const LargeReview: Story = {
  args: {
    size: "lg",
    title: "Review production changes",
    description: "A wider dialog for multi-field review flows.",
  },
  render: (args) => <ControlledDialog {...args} />,
};
