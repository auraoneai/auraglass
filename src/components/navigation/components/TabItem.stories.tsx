import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, LayoutDashboard, Settings } from "@/icons";
import TabItem from "./TabItem";

const meta: Meta<typeof TabItem> = {
  title: 'Navigation/Tab Item',
  component: TabItem,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A low-level tab item used by tab bars with active, badge, and disabled states.",
      },
    },
  },
  args: {
    id: "overview",
    label: "Overview",
    active: true,
  },
};

export default meta;
type Story = StoryObj<typeof TabItem>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-w-[min(560px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <div role="tablist" className="glass-flex glass-flex-wrap glass-gap-2">
        <TabItem {...args} icon={<LayoutDashboard size={15} />} aria-controls="overview-panel" />
        <TabItem id="metrics" label="Metrics" icon={<BarChart3 size={15} />} badge="3" aria-controls="metrics-panel" />
        <TabItem id="settings" label="Settings" icon={<Settings size={15} />} disabled aria-controls="settings-panel" />
      </div>
      <div id="overview-panel" role="tabpanel" className="glass-mt-4 glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/25 glass-p-4 glass-text-sm glass-text-secondary">
        Active tabs remain legible inside a realistic navigation strip.
      </div>
    </div>
  ),
};
