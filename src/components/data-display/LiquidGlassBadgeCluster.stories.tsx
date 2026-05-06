import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassBadgeCluster } from "./LiquidGlassBadgeCluster";

const meta: Meta<typeof LiquidGlassBadgeCluster> = { title: "Data Display/LiquidGlassBadgeCluster", component: LiquidGlassBadgeCluster };
export default meta;
type Story = StoryObj<typeof LiquidGlassBadgeCluster>;

export const Collapsed: Story = { args: { items: [{ id: "a", label: "Adaptive" }, { id: "b", label: "Grouped" }, { id: "c", label: "Accessible" }], maxCollapsed: 2 } };
