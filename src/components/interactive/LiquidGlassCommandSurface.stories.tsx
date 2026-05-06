import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassCommandSurface } from "./LiquidGlassCommandSurface";

const meta: Meta<typeof LiquidGlassCommandSurface> = { title: "Interactive/LiquidGlassCommandSurface", component: LiquidGlassCommandSurface };
export default meta;
type Story = StoryObj<typeof LiquidGlassCommandSurface>;

export const Default: Story = { args: { open: true, items: [{ id: "one", label: "Open dashboard", shortcut: "⌘K" }] } };
