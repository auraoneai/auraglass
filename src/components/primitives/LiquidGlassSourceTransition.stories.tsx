import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassDestination, LiquidGlassSource, LiquidGlassTransitionProvider } from "../../primitives/LiquidGlassSourceTransition";

const meta: Meta<typeof LiquidGlassTransitionProvider> = {
  title: "Primitives/LiquidGlassSourceTransition",
  component: LiquidGlassTransitionProvider,
};

export default meta;
type Story = StoryObj<typeof LiquidGlassTransitionProvider>;

export const SourceToSheet: Story = {
  render: () => (
    <LiquidGlassTransitionProvider>
      <LiquidGlassSource id="demo" className="glass-inline-block glass-p-2 glass-surface-subtle">Open</LiquidGlassSource>
      <LiquidGlassDestination id="demo" className="glass-mt-4 glass-p-4 glass-surface-default">Destination</LiquidGlassDestination>
    </LiquidGlassTransitionProvider>
  ),
};
