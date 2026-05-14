import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { fn } from "@storybook/test";
import { Copy, FileCheck2, PanelsTopLeft, RotateCcw, Save, Undo2 } from "@/icons";
import { GlassCommandBar } from "./GlassCommandBar";

const meta: Meta<typeof GlassCommandBar> = {
  title: 'Navigation/Glass Command Bar',
  component: GlassCommandBar,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A responsive glass command bar for editor and workflow actions.",
      },
    },
  },
  args: {
    position: "bottom",
    items: [
      { id: "save", label: "Save", icon: <Save size={16} />, shortcut: "S", onSelect: fn() },
      { id: "review", label: "Review", icon: <FileCheck2 size={16} />, shortcut: "R", onSelect: fn() },
      { id: "copy", label: "Copy link", icon: <Copy size={16} />, shortcut: "L", onSelect: fn() },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassCommandBar>;

const CommandBarFrame = (args: ComponentProps<typeof GlassCommandBar>) => (
  <div className="glass-flex glass-min-h-screen glass-w-full glass-items-center glass-justify-center glass-p-4">
    <section className="glass-grid glass-w-full glass-max-w-4xl glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-2xl glass-backdrop-blur-xl md:glass-p-7">
      <div className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-3">
        <div>
          <h2 className="glass-m-0 glass-text-2xl glass-font-semibold glass-text-primary">
            Campaign canvas
          </h2>
          <p className="glass-m-0 glass-text-sm glass-text-secondary">
            The command bar wraps actions without clipping shortcuts.
          </p>
        </div>
        <span className="glass-rounded-full glass-border glass-border-white/25 glass-px-3 glass-py-1 glass-text-sm glass-text-secondary">
          Draft saved
        </span>
      </div>
      <div className="glass-grid glass-min-h-64 glass-place-items-center glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/30 glass-p-6 glass-text-center">
        <div>
          <PanelsTopLeft className="glass-mx-auto glass-mb-3 glass-text-primary" size={34} />
          <p className="glass-m-0 glass-max-w-md glass-text-sm glass-text-secondary">
            Layout, copy, and preview tools remain reachable across desktop and mobile widths.
          </p>
        </div>
      </div>
      <GlassCommandBar {...args} />
    </section>
  </div>
);

export const Default: Story = {
  render: (args) => <CommandBarFrame {...args} />,
};

export const TopPosition: Story = {
  args: {
    position: "top",
    items: [
      { id: "undo", label: "Undo", icon: <Undo2 size={16} />, shortcut: "Z", onSelect: fn() },
      { id: "redo", label: "Redo", icon: <RotateCcw size={16} />, shortcut: "Y", onSelect: fn() },
      { id: "save", label: "Save", icon: <Save size={16} />, shortcut: "S", onSelect: fn() },
    ],
  },
  render: (args) => <CommandBarFrame {...args} />,
};
