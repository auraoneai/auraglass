import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassInsetSidebar } from "./LiquidGlassInsetSidebar";

const meta: Meta<typeof LiquidGlassInsetSidebar> = { title: "Navigation/LiquidGlassInsetSidebar", component: LiquidGlassInsetSidebar };
export default meta;
type Story = StoryObj<typeof LiquidGlassInsetSidebar>;

export const Default: Story = {
  args: { items: [{ id: "home", label: "Home" }, { id: "media", label: "Media" }], selectedId: "home" },
};
