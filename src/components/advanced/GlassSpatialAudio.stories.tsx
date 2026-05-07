import type { Meta, StoryObj } from "@storybook/react";
import { GlassSpatialAudioProvider } from "./GlassSpatialAudio";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Glass Spatial Audio',
  component: GlassSpatialAudioProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/Consciousness Interface/Spatial Audio stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassSpatialAudioProvider>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassSpatialAudio / ${state}`}
      kind="media"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const Interactive: Story = makeStory("Interactive");
export const MinimalMode: Story = makeStory("Minimal Mode");
export const ImmersiveMode: Story = makeStory("Immersive Mode");
export const GamingMode: Story = makeStory("Gaming Mode");
export const AudioReactiveOnly: Story = makeStory("Audio Reactive Only");
