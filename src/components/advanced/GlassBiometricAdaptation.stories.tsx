import type { Meta, StoryObj } from "@storybook/react";
import { GlassBiometricAdaptationProvider } from "./GlassBiometricAdaptation";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Glass Biometric Adaptation',
  component: GlassBiometricAdaptationProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/Consciousness Interface/Biometric Adaptation stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassBiometricAdaptationProvider>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassBiometricAdaptation / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const Interactive: Story = makeStory("Interactive");
export const SubtleMode: Story = makeStory("Subtle Mode");
export const SensitiveMode: Story = makeStory("Sensitive Mode");
export const AccessibilityMode: Story = makeStory("Accessibility Mode");
export const DashboardOnly: Story = makeStory("Dashboard Only");
