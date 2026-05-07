import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassConcentricFrame } from "../../primitives/LiquidGlassConcentricFrame";

const meta: Meta<typeof LiquidGlassConcentricFrame> = {
  title: 'Foundations/Liquid Glass Primitives/Liquid Glass Concentric Frame',
  component: LiquidGlassConcentricFrame,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof LiquidGlassConcentricFrame>;

export const Nested: Story = {
  render: () => (
    <div style={{ width: "100%", minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, boxSizing: "border-box" }}>
      <LiquidGlassConcentricFrame radius="2xl" inset={10} className="glass-p-4 glass-surface-subtle" style={{ width: "min(680px, 100%)", boxShadow: "0 24px 80px rgba(15,23,42,.14)" }}>
        <LiquidGlassConcentricFrame radius="xl" inset={6} className="glass-p-4 glass-surface-default">
          <div style={{ display: "grid", gap: 8, minHeight: 220, alignContent: "center", padding: 24, color: "#0f172a" }}>
            <strong style={{ fontSize: 22 }}>Nested source card</strong>
            <span style={{ color: "#475569" }}>Inset rings keep the refractive edge readable around grouped content.</span>
          </div>
        </LiquidGlassConcentricFrame>
      </LiquidGlassConcentricFrame>
    </div>
  ),
};
