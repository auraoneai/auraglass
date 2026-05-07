import type { Meta, StoryObj } from "@storybook/react";
import { SeasonalParticles } from "./SeasonalParticles";
import { StorybookVisualShowcase } from "../advanced/StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Seasonal Particles',
  component: SeasonalParticles,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Effects/SeasonalParticles stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SeasonalParticles>;

export default meta;
type Story = StoryObj<typeof meta>;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`SeasonalParticles / ${state}`}
      kind="effect"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const Winter: Story = makeStory("Winter");
export const Spring: Story = makeStory("Spring");
export const Summer: Story = makeStory("Summer");
export const Autumn: Story = makeStory("Autumn");
export const AutoSeason: Story = makeStory("Auto Season");
export const MinimalWinter: Story = makeStory("Minimal Winter");
export const IntenseSummer: Story = makeStory("Intense Summer");
export const SeasonalGallery: Story = makeStory("Seasonal Gallery");
