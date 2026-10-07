import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassShowcase } from "./LiquidGlassShowcase";

const meta: Meta<typeof LiquidGlassShowcase> = {
  title: 'Showcases/Liquid Glass Showcase',
  component: LiquidGlassShowcase,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassShowcase>;

export const AppExperience: Story = {};
