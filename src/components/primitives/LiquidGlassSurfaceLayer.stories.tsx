import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassSurfaceLayer } from "../../primitives/LiquidGlassLayerProvider";

const meta: Meta<typeof LiquidGlassSurfaceLayer> = {
  title: "Primitives/LiquidGlassSurfaceLayer",
  component: LiquidGlassSurfaceLayer,
};

export default meta;
type Story = StoryObj<typeof LiquidGlassSurfaceLayer>;

export const Default: Story = {
  render: () => <LiquidGlassSurfaceLayer>Surface layer context</LiquidGlassSurfaceLayer>,
};
