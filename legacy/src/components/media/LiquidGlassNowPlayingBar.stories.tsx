import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassNowPlayingBar } from "./LiquidGlassNowPlayingBar";

const meta: Meta<typeof LiquidGlassNowPlayingBar> = {
  title: "Media/Liquid Glass Now Playing Bar",
  component: LiquidGlassNowPlayingBar,
  parameters: { layout: "fullscreen", previewSurface: "component" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassNowPlayingBar>;

export const Default: Story = {
  render: () => (
    <div
      className="ag-now-playing-stage"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <style>
        {`
          .ag-now-playing-stage .liquid-glass-now-playing-bar,
          .ag-now-playing-stage .liquid-glass-now-playing-bar button {
            color: #0f172a;
            -webkit-text-fill-color: currentColor;
          }

          .ag-now-playing-stage .liquid-glass-now-playing-bar .glass-text-secondary {
            color: rgba(15,23,42,.72) !important;
            -webkit-text-fill-color: rgba(15,23,42,.72);
          }

          .ag-now-playing-stage .liquid-glass-now-playing-bar button[aria-label] {
            color: #0f172a;
            -webkit-text-fill-color: #0f172a;
          }
        `}
      </style>
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
            "radial-gradient(circle at 24% 24%, rgba(255,255,255,.72), transparent 26%), radial-gradient(circle at 78% 66%, rgba(160,160,160,.12), transparent 28%), linear-gradient(135deg, #dedede, #fafafa 48%, #d2d2d2)",
          boxShadow: "0 28px 90px rgba(15,23,42,.18)",
        }}
      >
        <LiquidGlassNowPlayingBar
          title="Liquid Study"
          subtitle="Aura System"
          progress={0.42}
          artwork={
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #d2d2d2, #fafafa)",
              }}
            />
          }
        />
      </div>
    </div>
  ),
};
