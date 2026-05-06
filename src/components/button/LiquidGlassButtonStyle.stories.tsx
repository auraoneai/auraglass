import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassButtonStyle } from "./LiquidGlassButtonStyle";

const meta: Meta<typeof LiquidGlassButtonStyle> = { title: "Button/LiquidGlassButtonStyle", component: LiquidGlassButtonStyle };
export default meta;
type Story = StoryObj<typeof LiquidGlassButtonStyle>;

export const Prominent: Story = { args: { children: "Continue", prominent: true, size: "xl" } };
