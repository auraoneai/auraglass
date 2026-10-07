import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassMediaControls } from "./LiquidGlassMediaControls";

const meta: Meta<typeof LiquidGlassMediaControls> = {
  title: "Media/Liquid Glass Media Controls",
  component: LiquidGlassMediaControls,
  parameters: { layout: "fullscreen", previewSurface: "component" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassMediaControls>;

export const ClearOverMedia: Story = {
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .liquid-media-story-shell input[type="range"] {
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,.28);
          box-shadow: inset 0 0 0 1px rgba(71,85,105,.34), inset 0 2px 4px rgba(71,85,105,.14);
        }

        .liquid-media-story-shell input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 999px;
          background: rgba(248,250,252,.96);
          box-shadow: 0 6px 18px rgba(15,23,42,.2);
        }

        .liquid-media-story-shell input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: 1px solid rgba(255,255,255,.9);
          border-radius: 999px;
          background: rgba(248,250,252,.96);
          box-shadow: 0 6px 18px rgba(15,23,42,.2);
        }

        .liquid-media-story-shell .liquid-glass-media-controls {
          max-width: 100%;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .liquid-media-story-shell { aspect-ratio: auto; min-height: 620px; align-items: end; }
          .liquid-media-story-shell .liquid-glass-media-controls > div { flex-wrap: wrap; }
          .liquid-media-story-shell input[type="range"] { min-width: 100px; flex: 1 1 130px; }
        }
      `}</style>
      <div
        className="liquid-media-story-shell"
        style={{
          width: "min(860px, 100%)",
          aspectRatio: "16 / 9",
          borderRadius: 30,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          padding: 24,
          boxSizing: "border-box",
          background:
            "radial-gradient(circle at 28% 24%, rgba(255,255,255,.72), transparent 24%), radial-gradient(circle at 72% 58%, rgba(160,160,160,.12), transparent 30%), linear-gradient(135deg, #dedede, #fafafa 48%, #d2d2d2)",
          boxShadow: "0 28px 90px rgba(15,23,42,0.18)",
        }}
      >
        <div style={{ display: "grid", gap: 14, width: "min(620px, 100%)" }}>
          <div style={{ color: "#0f172a" }}>
            <strong style={{ display: "block", fontSize: 20 }}>
              Review playback
            </strong>
            <span style={{ display: "block", opacity: 0.82 }}>
              Clear controls over live media
            </span>
          </div>
          <LiquidGlassMediaControls
            playing={false}
            currentTime={30}
            duration={120}
            volume={0.68}
            variant="clear"
          />
        </div>
      </div>
    </div>
  ),
};
