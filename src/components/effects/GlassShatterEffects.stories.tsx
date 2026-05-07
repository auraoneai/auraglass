import type { Meta, StoryObj } from "@storybook/react";
import { GlassShatterEffects } from "./GlassShatterEffects";
import { StorybookVisualShowcase } from "../advanced/StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Glass Shatter Effects',
  component: GlassShatterEffects,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Effects/GlassShatterEffects stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassShatterEffects>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`GlassShatterEffects / ${state}`}
      kind="effect"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const Default: Story = makeStory("Default");
export const Dramatic: Story = makeStory("Dramatic");
export const HoverTrigger: Story = makeStory("Hover Trigger");
export const AutoShatter: Story = makeStory("Auto Shatter");
export const Minimal: Story = makeStory("Minimal");
export const NoReform: Story = makeStory("No Reform");
export const InteractiveGallery: Story = makeStory("Interactive Gallery");
