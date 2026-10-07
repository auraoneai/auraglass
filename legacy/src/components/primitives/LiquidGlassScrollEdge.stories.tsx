import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassScrollEdge } from "../../primitives/LiquidGlassScrollEdge";

const meta: Meta<typeof LiquidGlassScrollEdge> = {
  title: 'Foundations/Liquid Glass Primitives/Liquid Glass Scroll Edge',
  component: LiquidGlassScrollEdge,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof LiquidGlassScrollEdge>;

export const SoftTop: Story = {
  args: { edge: "top", styleMode: "soft", active: true },
  render: (args) => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <div className="glass-relative glass-overflow-hidden glass-surface-subtle" style={{ width: "min(680px, 100%)", minHeight: 430, borderRadius: 28, boxShadow: "0 24px 80px rgba(15,23,42,.14)" }}>
        <LiquidGlassScrollEdge {...args} />
        <div style={{ padding: "42px 28px 28px", display: "grid", gap: 12 }}>
          {["Project brief", "Surface tokens", "Motion settings", "Contrast notes", "Release checklist"].map((item) => (
            <div key={item} style={{ borderRadius: 16, padding: 14, background: "rgba(255,255,255,0.78)", color: "#0f172a" }}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  ),
};
