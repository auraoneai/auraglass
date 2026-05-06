import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassMapControls } from "./LiquidGlassMapControls";

const meta: Meta<typeof LiquidGlassMapControls> = { title: "Interactive/LiquidGlassMapControls", component: LiquidGlassMapControls };
export default meta;
type Story = StoryObj<typeof LiquidGlassMapControls>;

export const Satellite: Story = { args: { controls: [{ id: "zoom-in", label: "+" }, { id: "zoom-out", label: "-" }] } };
