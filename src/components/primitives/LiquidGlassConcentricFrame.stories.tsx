import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassConcentricFrame } from "../../primitives/LiquidGlassConcentricFrame";

const meta: Meta<typeof LiquidGlassConcentricFrame> = {
  title: "Primitives/LiquidGlassConcentricFrame",
  component: LiquidGlassConcentricFrame,
};

export default meta;
type Story = StoryObj<typeof LiquidGlassConcentricFrame>;

export const Nested: Story = {
  render: () => (
    <LiquidGlassConcentricFrame radius="2xl" inset={10} className="glass-p-4 glass-surface-subtle">
      <LiquidGlassConcentricFrame radius="xl" inset={6} className="glass-p-4 glass-surface-default">
        Concentric frame
      </LiquidGlassConcentricFrame>
    </LiquidGlassConcentricFrame>
  ),
};
