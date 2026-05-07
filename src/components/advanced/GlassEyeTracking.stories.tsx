import type { Meta, StoryObj } from "@storybook/react";
import { GlassEyeTrackingProvider } from "./GlassEyeTracking";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Glass Eye Tracking',
  component: GlassEyeTrackingProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/Consciousness Interface/Eye Tracking stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassEyeTrackingProvider>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassEyeTracking / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const Interactive: Story = makeStory("Interactive");
export const WithCalibration: Story = makeStory("With Calibration");
export const SubtleMode: Story = makeStory("Subtle Mode");
export const DramaticMode: Story = makeStory("Dramatic Mode");
export const AccessibilityMode: Story = makeStory("Accessibility Mode");
export const VisualizationOnly: Story = makeStory("Visualization Only");
