import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassSegmentedControl } from "./LiquidGlassSegmentedControl";

const meta: Meta<typeof LiquidGlassSegmentedControl> = { title: "Navigation/LiquidGlassSegmentedControl", component: LiquidGlassSegmentedControl };
export default meta;
type Story = StoryObj<typeof LiquidGlassSegmentedControl>;

export const Default: Story = { args: { value: "grid", segments: [{ id: "grid", label: "Grid" }, { id: "list", label: "List" }] } };
