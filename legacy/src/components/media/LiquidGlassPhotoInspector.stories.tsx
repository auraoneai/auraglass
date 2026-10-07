import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassPhotoInspector } from "./LiquidGlassPhotoInspector";

const meta: Meta<typeof LiquidGlassPhotoInspector> = {
  title: "Media/Liquid Glass Photo Inspector",
  component: LiquidGlassPhotoInspector,
  parameters: { layout: "fullscreen", previewSurface: "component" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassPhotoInspector>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 32,
        boxSizing: "border-box",
        background:
          "radial-gradient(circle at 32% 28%, rgba(255,255,255,.82), transparent 24%), radial-gradient(circle at 72% 64%, rgba(160,160,160,.12), transparent 28%), linear-gradient(135deg, #dedede, #fafafa 48%, #d2d2d2)",
      }}
    >
      <style>{`.liquid-glass-inspector-panel button{appearance:none;-webkit-appearance:none;min-width:44px;min-height:44px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(255,255,255,.24);box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 8px 18px rgba(15,15,15,.12);color:#0f172a;cursor:pointer;font:inherit;padding:4px 10px}`}</style>
      <LiquidGlassPhotoInspector
        open
        title="Photo Inspector"
        selectionLabel="Campaign hero - selected"
        metadata={{
          Camera: "AuraCam Pro",
          Lens: "35mm",
          Exposure: "1/250",
          Color: "Display P3",
        }}
        tags={["portrait", "review", "hero"]}
        rating={<span style={{ color: "#0f172a" }}>Approved</span>}
        materialVariant="clear"
        style={{ width: "min(320px, 100%)" }}
      />
    </div>
  ),
};
