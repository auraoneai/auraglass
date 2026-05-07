import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassSurfaceLayer } from "../../primitives/LiquidGlassLayerProvider";

const meta: Meta<typeof LiquidGlassSurfaceLayer> = {
  title: 'Foundations/Liquid Glass Primitives/Liquid Glass Surface Layer',
  component: LiquidGlassSurfaceLayer,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof LiquidGlassSurfaceLayer>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <style>{`
        .liquid-surface-layer-story,
        .liquid-surface-layer-story * {
          color: #0f172a !important;
        }
      `}</style>
      <LiquidGlassSurfaceLayer>
        <div
          className="glass-p-6 liquid-surface-layer-story"
          style={{
            width: "min(720px, 100%)",
            minHeight: 300,
            borderRadius: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: 18,
            background:
              "radial-gradient(circle at 20% 20%, rgba(96,165,250,.28), transparent 30%), radial-gradient(circle at 82% 72%, rgba(45,212,191,.22), transparent 30%), rgba(255,255,255,0.78)",
            boxShadow: "0 24px 80px rgba(15,23,42,.14)",
            color: "#0f172a",
          }}
        >
          <div style={{ alignSelf: "center" }}>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 22 }}>Surface layer context</strong>
            <span style={{ color: "#475569" }}>Layer metadata is visible in a contained composition instead of a blank page.</span>
          </div>
          <div style={{ borderRadius: 22, padding: 18, background: "rgba(255,255,255,.82)", color: "#0f172a" }}>
            <span style={{ display: "block", color: "#64748b", fontSize: 12 }}>Layer role</span>
            <strong>Foreground glass</strong>
          </div>
        </div>
      </LiquidGlassSurfaceLayer>
    </div>
  ),
};
