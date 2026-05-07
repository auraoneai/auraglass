import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";
import { fn } from "@storybook/test";
import { Copy, Download, FilePenLine, FolderOpen, Trash2 } from "lucide-react";
import { GlassContextMenu, type ContextMenuItem } from "./GlassContextMenu";

const menuItems: ContextMenuItem[] = [
  { id: "open", label: "Open in workspace", icon: <FolderOpen size={16} />, shortcut: "Enter", action: fn() },
  { id: "rename", label: "Rename asset", icon: <FilePenLine size={16} />, shortcut: "R", action: fn() },
  { id: "copy", label: "Copy link", icon: <Copy size={16} />, shortcut: "C", action: fn() },
  { id: "download", label: "Download", icon: <Download size={16} />, action: fn() },
  { id: "separator", label: "", separator: true },
  { id: "delete", label: "Delete draft", icon: <Trash2 size={16} />, destructive: true, action: fn() },
];

const meta: Meta<typeof GlassContextMenu> = {
  title: 'Navigation/Glass Context Menu',
  component: GlassContextMenu,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A glass context menu for right-click actions with bounded trigger content.",
      },
    },
  },
  args: {
    items: menuItems,
    align: "start",
    side: "bottom",
  },
};

export default meta;
type Story = StoryObj<typeof GlassContextMenu>;

const ContextMenuFrame = (args: ComponentProps<typeof GlassContextMenu>) => (
  <div className="glass-flex glass-min-h-screen glass-w-full glass-items-center glass-justify-center glass-p-4">
    <GlassContextMenu {...args} className="glass-w-full glass-max-w-2xl">
      <section className="glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-2xl glass-backdrop-blur-xl">
        <div className="glass-flex glass-flex-wrap glass-items-start glass-justify-between glass-gap-4">
          <div>
            <h2 className="glass-m-0 glass-text-2xl glass-font-semibold glass-text-primary">
              Hero campaign asset
            </h2>
            <p className="glass-mt-2 glass-max-w-md glass-text-sm glass-text-secondary">
              Right-click anywhere on this asset card to open the menu. The trigger has enough room to inspect the interaction without clipping the portal.
            </p>
          </div>
          <span className="glass-rounded-full glass-bg-emerald-500/15 glass-px-3 glass-py-1 glass-text-sm glass-text-primary">
            Approved
          </span>
        </div>
        <div className="glass-mt-5 glass-grid glass-h-44 glass-place-items-center glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/25">
          <FolderOpen className="glass-text-primary" size={42} />
        </div>
      </section>
    </GlassContextMenu>
  </div>
);

export const Default: Story = {
  render: (args) => <ContextMenuFrame {...args} />,
};

export const RightAligned: Story = {
  args: {
    align: "end",
    side: "right",
  },
  render: (args) => <ContextMenuFrame {...args} />,
};
