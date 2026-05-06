import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassSearchTab } from "./LiquidGlassSearchTab";

const meta: Meta<typeof LiquidGlassSearchTab> = { title: "Search/LiquidGlassSearchTab", component: LiquidGlassSearchTab };
export default meta;
type Story = StoryObj<typeof LiquidGlassSearchTab>;

export const Active: Story = { args: { active: true, results: [{ id: "a", label: "Find item" }] } };
