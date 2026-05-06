import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassTabBar } from "./LiquidGlassTabBar";

const meta: Meta<typeof LiquidGlassTabBar> = { title: "Navigation/LiquidGlassTabBar", component: LiquidGlassTabBar };
export default meta;
type Story = StoryObj<typeof LiquidGlassTabBar>;

export const WithSearchTab: Story = {
  args: { tabs: [{ id: "home", label: "Home" }, { id: "search", label: "Search" }], activeTab: "home", searchTabId: "search" },
};
