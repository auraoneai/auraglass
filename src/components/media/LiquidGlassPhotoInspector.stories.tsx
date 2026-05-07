import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassPhotoInspector } from "./LiquidGlassPhotoInspector";

const meta: Meta<typeof LiquidGlassPhotoInspector> = {
  title: 'Media/Liquid Glass Photo Inspector',
  component: LiquidGlassPhotoInspector,
  parameters: { layout: "fullscreen", previewSurface: "media" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassPhotoInspector>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 24, padding: 32, boxSizing: "border-box" }}>
      <style>{`.liquid-glass-inspector-panel button{border:0;border-radius:999px;background:rgba(255,255,255,.76);color:#0f172a;cursor:pointer;font:inherit;padding:4px 10px}`}</style>
      <div
        style={{
          borderRadius: 30,
          minHeight: 520,
          background:
            "radial-gradient(circle at 32% 28%, #bfdbfe, transparent 24%), radial-gradient(circle at 72% 64%, #5eead4, transparent 28%), linear-gradient(135deg, #020617, #1d4ed8 48%, #0f766e)",
          boxShadow: "0 28px 90px rgba(2,6,23,0.34)",
        }}
      />
      <LiquidGlassPhotoInspector
        open
        title="Photo Inspector"
        selectionLabel="Campaign hero - selected"
        metadata={{ Camera: "AuraCam Pro", Lens: "35mm", Exposure: "1/250", Color: "Display P3" }}
        tags={["portrait", "review", "hero"]}
        rating={<span style={{ color: "#0f172a" }}>Approved</span>}
        materialVariant="clear"
        style={{ width: "100%", minHeight: 520 }}
      />
    </div>
  ),
};
