import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassLayerProvider } from "../../primitives/LiquidGlassLayerProvider";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

const meta: Meta<typeof LiquidGlassLayerProvider> = {
  title: "Primitives/LiquidGlassLayerProvider",
  component: LiquidGlassLayerProvider,
};

export default meta;
type Story = StoryObj<typeof LiquidGlassLayerProvider>;

export const EfficientPolicy: Story = {
  render: () => (
    <LiquidGlassLayerProvider performanceLevel="efficient">
      <LiquidGlassMaterial material="liquid">Layer policy</LiquidGlassMaterial>
    </LiquidGlassLayerProvider>
  ),
};
