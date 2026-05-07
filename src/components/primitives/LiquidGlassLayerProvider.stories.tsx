import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassLayerProvider } from "../../primitives/LiquidGlassLayerProvider";
import { LiquidGlassMaterial } from "../../primitives/LiquidGlassMaterial";

const meta: Meta<typeof LiquidGlassLayerProvider> = {
  title: 'Foundations/Liquid Glass Primitives/Liquid Glass Layer Provider',
  component: LiquidGlassLayerProvider,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof LiquidGlassLayerProvider>;

export const EfficientPolicy: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <style>{`
        .liquid-layer-provider-story,
        .liquid-layer-provider-story * {
          color: #0f172a !important;
        }
      `}</style>
      <LiquidGlassLayerProvider performanceLevel="efficient">
        <LiquidGlassMaterial
          material="liquid"
          radius="2xl"
          className="glass-p-6 liquid-layer-provider-story"
          style={{
            width: "min(680px, 100%)",
            minHeight: 280,
            display: "grid",
            alignContent: "center",
            gap: 18,
            color: "#0f172a",
          }}
        >
          <div>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 22 }}>Efficient layer policy</strong>
            <span style={{ color: "#475569" }}>The provider keeps nested Liquid Glass effects on a conservative rendering path for dense dashboards.</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {["Shared backdrop", "Reduced motion", "Stable blur"].map((label) => (
              <span key={label} style={{ borderRadius: 999, padding: "8px 12px", background: "rgba(255,255,255,.82)", color: "#0f172a" }}>
                {label}
              </span>
            ))}
          </div>
        </LiquidGlassMaterial>
      </LiquidGlassLayerProvider>
    </div>
  ),
};
