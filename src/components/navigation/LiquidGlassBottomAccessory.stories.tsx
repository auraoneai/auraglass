import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassBottomAccessory } from "./LiquidGlassBottomAccessory";

const meta: Meta<typeof LiquidGlassBottomAccessory> = { title: "Navigation/LiquidGlassBottomAccessory", component: LiquidGlassBottomAccessory };
export default meta;
type Story = StoryObj<typeof LiquidGlassBottomAccessory>;

export const Default: Story = { render: () => <LiquidGlassBottomAccessory>Now playing</LiquidGlassBottomAccessory> };
