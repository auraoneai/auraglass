import type { Meta, StoryObj } from "@storybook/react";
import { AuroraPro } from "./AuroraPro";
import { StorybookVisualShowcase } from "../advanced/StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Aurora Pro',
  component: AuroraPro,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Effects/AuroraPro stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AuroraPro>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`AuroraPro / ${state}`}
      kind="effect"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const ArcticAurora: Story = makeStory("Arctic Aurora");
export const ForestAurora: Story = makeStory("Forest Aurora");
export const SunsetAurora: Story = makeStory("Sunset Aurora");
export const OceanAurora: Story = makeStory("Ocean Aurora");
export const CosmicAurora: Story = makeStory("Cosmic Aurora");
export const MinimalAurora: Story = makeStory("Minimal Aurora");
export const AuroraShowcase: Story = makeStory("Aurora Showcase");
export const CustomAurora: Story = makeStory("Custom Aurora");
