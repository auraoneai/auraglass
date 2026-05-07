import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassCarouselRail } from "./LiquidGlassCarouselRail";

const meta: Meta<typeof LiquidGlassCarouselRail> = {
  title: 'Data + Visualization/Liquid Glass Carousel Rail',
  component: LiquidGlassCarouselRail,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassCarouselRail>;

export const Default: Story = {
  render: () => (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32, boxSizing: "border-box" }}>
      <style>{`
        .liquid-carousel-story,
        .liquid-carousel-story * {
          color: #0f172a !important;
        }

        .liquid-glass-carousel-rail>button {
          border: 0;
          border-radius: 999px;
          background: rgba(15,23,42,.84);
          color: #fff !important;
          cursor: pointer;
          font: 24px/1 system-ui;
          width: 36px;
          height: 36px;
          transform: translateY(-50%);
          box-shadow: 0 10px 28px rgba(15,23,42,.24);
        }
      `}</style>
      <div className="liquid-carousel-story" style={{ width: "min(860px, 100%)", borderRadius: 28, padding: 24, background: "rgba(255,255,255,0.82)", color: "#0f172a" }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 20 }}>Featured surfaces</h2>
        <LiquidGlassCarouselRail
          items={Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="glass-radius-xl glass-surface-subtle glass-p-4"
              style={{ width: 180, minHeight: 128, display: "grid", alignContent: "end", background: `linear-gradient(135deg, rgba(255,255,255,.86), rgba(${40 + i * 20},${120 + i * 10},220,.18))`, color: "#0f172a" }}
            >
              <strong>Surface {i + 1}</strong>
              <span style={{ color: "#475569", fontSize: 12 }}>Adaptive preview</span>
            </div>
          ))}
        />
      </div>
    </div>
  ),
};
