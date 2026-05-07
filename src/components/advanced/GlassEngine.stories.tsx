import type { Meta, StoryObj } from "@storybook/react";
import { GlassEngineProvider } from "./GlassEngine";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Glass Engine',
  component: GlassEngineProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/GlassEngine stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassEngineProvider>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassEngine / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const InteractiveDemo: Story = makeStory("Interactive Demo");
export const TextureVariations: Story = makeStory("Texture Variations");
export const EnvironmentalAdaptation: Story = makeStory("Environmental Adaptation");
export const ContentAdaptation: Story = makeStory("Content Adaptation");
export const OpacityEngine: Story = makeStory("Opacity Engine");
