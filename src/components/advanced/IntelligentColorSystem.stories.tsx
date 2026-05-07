import type { Meta, StoryObj } from "@storybook/react";
import { IntelligentColorProvider } from "./IntelligentColorSystem";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'AI + Intelligence/Intelligent Color System',
  component: IntelligentColorProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/IntelligentColorSystem stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IntelligentColorProvider>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`IntelligentColorSystem / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const InteractiveDemo: Story = makeStory("Interactive Demo");
export const TimeBasedAdaptation: Story = makeStory("Time Based Adaptation");
export const SeasonalThemes: Story = makeStory("Seasonal Themes");
export const BrandIntegration: Story = makeStory("Brand Integration");
export const QuantumNeuromorphicDemo: Story = makeStory("Quantum Neuromorphic Demo");
export const PracticalEnhancementsDemo: Story = makeStory("Practical Enhancements Demo");
