import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

const meta: Meta<typeof LiquidGlassScrollEdge> = {
  title: "Primitives/LiquidGlassScrollEdge",
  component: LiquidGlassScrollEdge,
};

export default meta;
type Story = StoryObj<typeof LiquidGlassScrollEdge>;

export const SoftTop: Story = {
  args: { edge: "top", styleMode: "soft", active: true },
  render: (args) => <div className="glass-relative glass-h-40 glass-overflow-hidden glass-surface-subtle"><LiquidGlassScrollEdge {...args} /></div>,
};
