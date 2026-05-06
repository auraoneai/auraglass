import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassShowcase } from "./LiquidGlassShowcase";

const meta: Meta<typeof LiquidGlassShowcase> = { title: "Showcase/LiquidGlassShowcase", component: LiquidGlassShowcase, parameters: { layout: "fullscreen" } };
export default meta;
type Story = StoryObj<typeof LiquidGlassShowcase>;

export const AppExperience: Story = {};
