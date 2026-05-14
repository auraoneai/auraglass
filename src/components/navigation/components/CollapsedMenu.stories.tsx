import type { Meta, StoryObj } from "@storybook/react";
import { Archive, Bell, Settings, UserRound } from "@/icons";
import CollapsedMenu from "./CollapsedMenu";

const meta: Meta<typeof CollapsedMenu> = {
  title: 'Navigation/Collapsed Menu',
  component: CollapsedMenu,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "An overflow menu used by responsive navigation when items collapse.",
      },
    },
  },
  args: {
    "aria-label": "Collapsed navigation actions",
    items: [
      { id: "profile", label: "Profile", icon: <UserRound size={16} /> },
      { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
      { id: "archive", label: "Archive", icon: <Archive size={16} /> },
      { id: "settings", label: "Settings", icon: <Settings size={16} /> },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof CollapsedMenu>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-relative glass-h-72 glass-w-[min(420px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <div className="glass-flex glass-items-center glass-justify-between">
        <span className="glass-text-sm glass-font-semibold glass-text-primary">Responsive overflow</span>
        <button className="glass-rounded-xl glass-border glass-border-white/25 glass-bg-white/25 glass-px-3 glass-py-2 glass-text-primary">
          More
        </button>
      </div>
      <CollapsedMenu {...args} className="glass-top-16 glass-right-5" />
    </div>
  ),
};
