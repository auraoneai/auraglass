import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassToolbar } from "./LiquidGlassToolbar";

const meta: Meta<typeof LiquidGlassToolbar> = { title: "Navigation/LiquidGlassToolbar", component: LiquidGlassToolbar };
export default meta;
type Story = StoryObj<typeof LiquidGlassToolbar>;

export const Default: Story = {
  args: {
    floating: true,
    left: "Aura",
    groups: [{ id: "tools", items: [{ id: "save", label: "Save" }, { id: "share", label: "Share" }] }],
    right: "Profile",
  },
};
