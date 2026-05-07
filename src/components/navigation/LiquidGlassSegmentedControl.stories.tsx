import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassSegmentedControl } from "./LiquidGlassSegmentedControl";

const meta: Meta<typeof LiquidGlassSegmentedControl> = {
  title: 'Navigation/Liquid Glass Segmented Control',
  component: LiquidGlassSegmentedControl,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassSegmentedControl>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, boxSizing: "border-box" }}>
      <style>{`
        .liquid-segment-story,
        .liquid-segment-story * {
          color: #0f172a !important;
        }

        .liquid-segment-story .liquid-glass-segmented-control button {
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
        }
      `}</style>
      <div
        className="liquid-segment-story"
        style={{
          width: "min(620px, 100%)",
          display: "grid",
          gap: 18,
          justifyItems: "center",
          borderRadius: 30,
          padding: 28,
          background:
            "radial-gradient(circle at 20% 20%, rgba(96,165,250,.30), transparent 28%), radial-gradient(circle at 82% 72%, rgba(45,212,191,.24), transparent 30%), rgba(255,255,255,0.82)",
          boxShadow: "0 24px 80px rgba(15,23,42,.14)",
          color: "#0f172a",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>Browse mode</h2>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>Segmented control sizing across common navigation modes.</p>
        </div>
        <LiquidGlassSegmentedControl value="grid" segments={[{ id: "grid", label: "Grid" }, { id: "list", label: "List" }, { id: "map", label: "Map" }]} />
      </div>
    </div>
  ),
};
