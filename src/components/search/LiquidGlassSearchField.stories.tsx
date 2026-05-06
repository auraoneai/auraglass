import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassSearchField } from "./LiquidGlassSearchField";

const meta: Meta<typeof LiquidGlassSearchField> = { title: "Search/LiquidGlassSearchField", component: LiquidGlassSearchField };
export default meta;
type Story = StoryObj<typeof LiquidGlassSearchField>;

export const Default: Story = { args: { results: [{ id: "one", label: "Dashboard" }, { id: "two", label: "Media" }], suggestions: ["Dashboard", "Media"] } };
