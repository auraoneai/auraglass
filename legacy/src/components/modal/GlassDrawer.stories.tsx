import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassDrawer } from "./GlassDrawer";

const DrawerBody = () => (
  <div className="glass-flex glass-flex-col glass-gap-5">
    <div className="glass-grid glass-grid-cols-2 glass-gap-3">
      {[
        ["Status", "Ready"],
        ["Owner", "Design Ops"],
        ["Priority", "High"],
        ["Due", "Friday"],
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
    <div className="glass-flex glass-flex-col glass-gap-2">
      <h4 className="glass-text-sm glass-font-semibold glass-text-primary">
        Review checklist
      </h4>
      {["Contrast approved", "Keyboard path verified", "Copy finalized"].map(
        (item) => (
          <div
            key={item}
            className="glass-flex glass-items-center glass-justify-between glass-radius-md glass-surface-overlay glass-border glass-border-subtle glass-px-3 glass-py-2"
          >
            <span className="glass-text-sm glass-text-primary">{item}</span>
            <span className="glass-text-xs glass-text-secondary">Complete</span>
          </div>
        )
      )}
    </div>
  </div>
);

const ControlledDrawer = (args: React.ComponentProps<typeof GlassDrawer>) => {
  const [open, setOpen] = useState(args.open ?? true);

  return (
    <div style={{ minHeight: 620, width: "100%" }}>
      <div className="glass-m-8 glass-flex glass-max-w-xl glass-flex-col glass-gap-4 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-6">
        <h3 className="glass-text-lg glass-font-semibold glass-text-primary">
          Project command center
        </h3>
        <p className="glass-text-sm glass-text-secondary">
          The drawer opens over a real application surface with enough space to
          inspect its edge treatment and scrolling content.
        </p>
        <button
          className="glass-px-4 glass-py-2 glass-radius-md glass-surface-blue glass-text-primary glass-text-sm"
          onClick={() => setOpen(true)}
        >
          Open drawer
        </button>
      </div>
      <GlassDrawer {...args} open={open} onOpenChange={setOpen}>
        <DrawerBody />
      </GlassDrawer>
    </div>
  );
};

const meta: Meta<typeof GlassDrawer> = {
  title: 'Surfaces/Modals/Glass Drawer',
  component: GlassDrawer,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A slide-out glass drawer for side-panel workflows and contextual details.",
      },
    },
  },
  args: {
    open: true,
    position: "right",
    size: "md",
    title: "Launch readiness",
    description: "Operational details for the selected campaign.",
    showCloseButton: true,
    showOverlay: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassDrawer>;

export const Default: Story = {
  render: (args) => <ControlledDrawer {...args} />,
};

export const LeftNavigation: Story = {
  args: {
    position: "left",
    title: "Workspace navigation",
    description: "A left drawer for dense navigation and quick filters.",
  },
  render: (args) => <ControlledDrawer {...args} />,
};
