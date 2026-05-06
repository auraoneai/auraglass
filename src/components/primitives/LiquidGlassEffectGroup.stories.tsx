import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassEffectGroup } from "../../primitives/LiquidGlassEffectGroup";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

const meta: Meta<typeof LiquidGlassEffectGroup> = {
  title: "Primitives/LiquidGlassEffectGroup",
  component: LiquidGlassEffectGroup,
};

export default meta;
type Story = StoryObj<typeof LiquidGlassEffectGroup>;

export const GroupedButtons: Story = {
  render: () => (
    <LiquidGlassEffectGroup className="glass-flex glass-gap-2">
      <LiquidGlassMaterial material="liquid" interactive>One</LiquidGlassMaterial>
      <LiquidGlassMaterial material="liquid" interactive>Two</LiquidGlassMaterial>
      <LiquidGlassMaterial material="liquid" interactive>Three</LiquidGlassMaterial>
    </LiquidGlassEffectGroup>
  ),
};
