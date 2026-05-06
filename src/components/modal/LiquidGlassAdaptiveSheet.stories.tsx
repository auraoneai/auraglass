import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassAdaptiveSheet } from "./LiquidGlassAdaptiveSheet";

const meta: Meta<typeof LiquidGlassAdaptiveSheet> = { title: "Modal/LiquidGlassAdaptiveSheet", component: LiquidGlassAdaptiveSheet };
export default meta;
type Story = StoryObj<typeof LiquidGlassAdaptiveSheet>;

export const Bottom: Story = { args: { open: true, title: "Sheet", children: "Sheet content" } };
