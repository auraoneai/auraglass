import type { Meta, StoryObj } from "@storybook/react";
import { GlassPredictiveEngineProvider } from "./GlassPredictiveEngine";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'AI + Intelligence/Glass Predictive Engine',
  component: GlassPredictiveEngineProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/Consciousness Interface/Predictive Engine stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassPredictiveEngineProvider>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassPredictiveEngine / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const Interactive: Story = makeStory("Interactive");
export const Conservative: Story = makeStory("Conservative");
export const Aggressive: Story = makeStory("Aggressive");
export const Experimental: Story = makeStory("Experimental");
export const PredictionIndicatorOnly: Story = makeStory("Prediction Indicator Only");
