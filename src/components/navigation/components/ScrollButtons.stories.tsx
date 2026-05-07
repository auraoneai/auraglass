import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import ScrollButtons from "./ScrollButtons";

const meta: Meta<typeof ScrollButtons> = {
  title: 'Navigation/Scroll Buttons',
  component: ScrollButtons,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Edge scroll buttons for horizontally overflowing tab and navigation rails.",
      },
    },
  },
  args: {
    showLeft: true,
    showRight: true,
    onScrollLeft: fn(),
    onScrollRight: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ScrollButtons>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-relative glass-w-[min(640px,calc(100vw-48px))] glass-overflow-hidden glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <div className="glass-flex glass-gap-3 glass-overflow-hidden glass-px-9">
        {["Overview", "Audience", "Delivery", "Creative", "Budget", "Review"].map((item) => (
          <span key={item} className="glass-whitespace-nowrap glass-rounded-full glass-border glass-border-white/20 glass-bg-white/25 glass-px-4 glass-py-2 glass-text-sm glass-text-primary">
            {item}
          </span>
        ))}
      </div>
      <ScrollButtons {...args} className="glass-bg-black/45 glass-text-white" />
    </div>
  ),
};

export const RightOnly: Story = {
  args: { showLeft: false, showRight: true },
  render: (args) => (
    <div className="glass-relative glass-w-[min(520px,calc(100vw-48px))] glass-overflow-hidden glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <div className="glass-flex glass-gap-3 glass-overflow-hidden glass-pr-9">
        {["Roadmap", "Launches", "Incidents", "Approvals"].map((item) => (
          <span key={item} className="glass-whitespace-nowrap glass-rounded-full glass-border glass-border-white/20 glass-bg-white/25 glass-px-4 glass-py-2 glass-text-sm glass-text-primary">
            {item}
          </span>
        ))}
      </div>
      <ScrollButtons {...args} className="glass-bg-black/45 glass-text-white" />
    </div>
  ),
};
