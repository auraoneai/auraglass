import type { Meta, StoryObj } from "@storybook/react";
import { GlassParallaxLayers } from "./GlassParallaxLayers";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Glass Parallax Layers',
  component: GlassParallaxLayers,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/GlassParallaxLayers stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassParallaxLayers>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassParallaxLayers / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const HeroSection: Story = makeStory("Hero Section");
export const CardStack: Story = makeStory("Card Stack");
export const AutoRotating: Story = makeStory("Auto Rotating");
export const DataVisualization: Story = makeStory("Data Visualization");
export const InteractiveDebug: Story = makeStory("Interactive Debug");
