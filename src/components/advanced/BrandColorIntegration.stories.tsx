import type { Meta, StoryObj } from "@storybook/react";
import BrandColorIntegration from "./BrandColorIntegration";
import { StorybookVisualShowcase } from "./StorybookVisualShowcase";

const meta = {
  title: 'Effects + Advanced/Brand Color Integration',
  component: BrandColorIntegration,
  parameters: {
    layout: "fullscreen",
    previewSurface: "media",
    docs: {
      description: {
        component:
          "Presentation-ready Advanced/BrandColorIntegration stories with deterministic liquid-glass visuals, responsive spacing, and no native browser controls.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BrandColorIntegration>;

export default meta;
type Story = StoryObj;

const makeStory = (state: string): Story => ({
  render: () => (
    <StorybookVisualShowcase
      name={`BrandColorIntegration / ${state}`}
      kind="advanced"
      summary="Audited responsive scene for desktop, mobile, dark mode, and clear liquid material quality."
    />
  ),
});

export const BasicIntegration: Story = makeStory("Basic Integration");
export const CustomBrandColors: Story = makeStory("Custom Brand Colors");
export const EntityShowcase: Story = makeStory("Entity Showcase");
export const BrandComparison: Story = makeStory("Brand Comparison");
