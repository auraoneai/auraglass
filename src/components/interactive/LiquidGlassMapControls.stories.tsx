import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassMapControls } from "./LiquidGlassMapControls";

const meta: Meta<typeof LiquidGlassMapControls> = {
  title: 'Effects + Advanced/Liquid Glass Map Controls',
  component: LiquidGlassMapControls,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassMapControls>;

export const Satellite: Story = {
  render: () => (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "grid",
        placeItems: "center",
        padding: 32,
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .liquid-map-story {
          position: relative;
          width: min(980px, 100%);
          min-height: 560px;
          overflow: hidden;
          border-radius: 32px;
          color: #0f172a;
          background:
            radial-gradient(circle at 24% 26%, rgba(96,165,250,.55), transparent 24%),
            radial-gradient(circle at 72% 64%, rgba(20,184,166,.48), transparent 26%),
            linear-gradient(135deg, #dbeafe, #e0f2fe 44%, #ccfbf1);
          box-shadow: 0 28px 90px rgba(15,23,42,.18);
        }

        .liquid-map-story::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(15,23,42,.08) 1px, transparent 1px),
            linear-gradient(0deg, rgba(15,23,42,.08) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(135deg, rgba(0,0,0,.85), rgba(0,0,0,.28));
        }

        .liquid-map-story-label {
          position: absolute;
          left: 24px;
          bottom: 24px;
          max-width: min(360px, calc(100% - 48px));
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,.58);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.68), 0 18px 60px rgba(15,23,42,.14);
        }

        .liquid-glass-map-controls button {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #0f172a;
          cursor: pointer;
          font: 700 18px/1 system-ui, sans-serif;
        }

        @media (max-width: 720px) {
          .liquid-map-story { min-height: 620px; }
        }
      `}</style>
      <div className="liquid-map-story">
        <LiquidGlassMapControls
          placement="top-right"
          style={{ top: 24, right: 24 }}
          controls={[
            { id: "zoom-in", label: "Zoom in", icon: "+" },
            { id: "zoom-out", label: "Zoom out", icon: "-" },
            { id: "locate", label: "Locate", icon: "O" },
            { id: "layers", label: "Layers", icon: "L" },
          ]}
        />
        <div className="liquid-map-story-label">
          <strong style={{ display: "block", fontSize: 18 }}>Satellite operations</strong>
          <span style={{ display: "block", marginTop: 6, color: "#475569" }}>
            Clear vertical map controls remain readable over detailed map content.
          </span>
        </div>
      </div>
    </div>
  ),
};
