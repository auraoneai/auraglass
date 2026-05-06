import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassInspectorPanel } from "./LiquidGlassInspectorPanel";

const meta: Meta<typeof LiquidGlassInspectorPanel> = { title: "Navigation/LiquidGlassInspectorPanel", component: LiquidGlassInspectorPanel };
export default meta;
type Story = StoryObj<typeof LiquidGlassInspectorPanel>;

export const Default: Story = { args: { open: true, selectionLabel: "Selected row", sections: [{ id: "s", title: "Properties", content: "Value" }] } };
