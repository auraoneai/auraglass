import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassBackdropSampler } from "../../primitives/LiquidGlassBackdropSampler";

const meta: Meta<typeof LiquidGlassBackdropSampler> = {
  title: "Primitives/LiquidGlassBackdropSampler",
  component: LiquidGlassBackdropSampler,
};

export default meta;
type Story = StoryObj<typeof LiquidGlassBackdropSampler>;

export const Default: Story = {
  render: () => (
    <LiquidGlassBackdropSampler>
      {(sample) => <pre>{JSON.stringify(sample, null, 2)}</pre>}
    </LiquidGlassBackdropSampler>
  ),
};
