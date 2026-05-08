import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { BarChart3, Home, Settings, Users } from "lucide-react";
import { GlassTabBar } from "./GlassTabBar";

const tabs = [
  { id: "home", label: "Home", icon: <Home size={16} /> },
  { id: "audience", label: "Audience", icon: <Users size={16} />, badge: 8 },
  { id: "metrics", label: "Metrics", icon: <BarChart3 size={16} /> },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

const meta: Meta<typeof GlassTabBar> = {
  title: 'Navigation/Glass Tab Bar',
  component: GlassTabBar,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "An animated glass tab bar with badges, overflow handling, and responsive labels.",
      },
    },
  },
  args: {
    tabs,
    activeTab: 1,
    onChange: fn(),
    scrollable: false,
    fullWidth: true,
    showLabels: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassTabBar>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-w-[min(760px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassTabBar {...args} />
      <div className="glass-mt-4 glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/25 glass-p-4 glass-text-sm glass-text-secondary">
        Tab content follows the rail without layout shift or horizontal page overflow.
      </div>
    </div>
  ),
};

export const Compact: Story = {
  args: {
    tabs: tabs.slice(0, 3),
    showLabels: false,
    fullWidth: true,
  },
  render: (args) => (
    <div className="glass-w-[min(420px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassTabBar {...args} />
    </div>
  ),
};
