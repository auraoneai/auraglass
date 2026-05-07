import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassNowPlayingBar } from "./LiquidGlassNowPlayingBar";

const meta: Meta<typeof LiquidGlassNowPlayingBar> = {
  title: 'Media/Liquid Glass Now Playing Bar',
  component: LiquidGlassNowPlayingBar,
  parameters: { layout: "fullscreen", previewSurface: "media" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassNowPlayingBar>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, boxSizing: "border-box" }}>
      <div
        style={{
          width: "min(760px, 100%)",
          minHeight: 420,
          display: "grid",
          alignItems: "end",
          padding: 28,
          boxSizing: "border-box",
          borderRadius: 32,
          background:
            "radial-gradient(circle at 24% 24%, rgba(147,197,253,.58), transparent 26%), radial-gradient(circle at 78% 66%, rgba(45,212,191,.44), transparent 28%), linear-gradient(135deg, #0f172a, #1d4ed8 48%, #0f766e)",
          boxShadow: "0 28px 90px rgba(2,6,23,.34)",
        }}
      >
        <LiquidGlassNowPlayingBar
          title="Liquid Study"
          subtitle="Aura System"
          progress={0.42}
          artwork={<div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1d4ed8, #14b8a6)" }} />}
        />
      </div>
    </div>
  ),
};
