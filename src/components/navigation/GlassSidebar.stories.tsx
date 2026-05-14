import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, FolderKanban, Home, Settings } from "@/icons";
import { GlassSidebar, type NavigationItem } from "./GlassSidebar";

const items: NavigationItem[] = [
  { id: "home", label: "Home", icon: <Home size={18} /> },
  { id: "projects", label: "Projects", icon: <FolderKanban size={18} />, badge: 5 },
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
];

const meta: Meta<typeof GlassSidebar> = {
  title: 'Navigation/Glass Sidebar',
  component: GlassSidebar,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A glass sidebar for app navigation with badges, collapse behavior, and surrounding content.",
      },
    },
  },
  args: {
    items,
    activeId: "projects",
    variant: "floating",
    width: "md",
    collapsible: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSidebar>;

const SidebarFrame = (args: ComponentProps<typeof GlassSidebar>) => {
  const [collapsed, setCollapsed] = useState(args.collapsed ?? false);

  return (
    <div className="glass-flex glass-min-h-screen glass-w-full glass-gap-5 glass-p-4">
      <GlassSidebar
        {...args}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        header={<div className="glass-text-base glass-font-semibold glass-text-primary">Aura Ops</div>}
        footer={<div className="glass-text-xs glass-text-secondary">Workspace online</div>}
      />
      <main className="glass-min-w-0 glass-flex-1 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
        <h2 className="glass-m-0 glass-text-2xl glass-font-semibold glass-text-primary">Project operations</h2>
        <p className="glass-mt-2 glass-max-w-2xl glass-text-sm glass-text-secondary">
          The sidebar is shown with adjacent app content so width, scrolling, and collapsed states are easy to inspect.
        </p>
      </main>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <SidebarFrame {...args} />,
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
  render: (args) => <SidebarFrame {...args} />,
};
