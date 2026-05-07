import type { Meta, StoryObj } from "@storybook/react";
import { GlassAchievementProvider } from "./GlassAchievementSystem";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Glass Achievement System',
  component: GlassAchievementProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/Consciousness Interface/Achievement System stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassAchievementProvider>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassAchievementSystem / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const Interactive: Story = makeStory("Interactive");
export const CasualMode: Story = makeStory("Casual Mode");
export const HardcoreMode: Story = makeStory("Hardcore Mode");
export const MinimalMode: Story = makeStory("Minimal Mode");
export const NotificationsOnly: Story = makeStory("Notifications Only");
export const DashboardOnly: Story = makeStory("Dashboard Only");
