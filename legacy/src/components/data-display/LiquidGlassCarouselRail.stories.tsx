import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassCarouselRail } from "./LiquidGlassCarouselRail";

const meta: Meta<typeof LiquidGlassCarouselRail> = {
  title: "Data + Visualization/Liquid Glass Carousel Rail",
  component: LiquidGlassCarouselRail,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};
export default meta;
type Story = StoryObj<typeof LiquidGlassCarouselRail>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "clamp(12px, 4vw, 32px)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <style>{`
        .liquid-carousel-story,
        .liquid-carousel-story * {
          color: #0f172a !important;
        }

        .liquid-glass-carousel-rail>button {
          border: 0;
          border-radius: 999px;
          background: rgba(255,255,255,.72);
          color: #111827 !important;
          cursor: pointer;
          font: 24px/1 system-ui;
          width: 36px;
          height: 36px;
          transform: translateY(-50%);
          box-shadow: 0 10px 28px rgba(15,23,42,.24);
        }
      `}</style>
      <div
        className="liquid-carousel-story"
        style={{
          width: "min(860px, 100%)",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
          borderRadius: 28,
          padding: "clamp(14px, 4vw, 24px)",
          background: "rgba(255,255,255,0.32)",
          color: "#0f172a",
        }}
      >
        <h2 style={{ margin: "0 0 14px", fontSize: 20 }}>Featured surfaces</h2>
        <LiquidGlassCarouselRail
          items={Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="glass-radius-xl glass-surface-subtle glass-p-4"
              style={{
                width: "min(180px, calc(100vw - 128px))",
                minHeight: 128,
                display: "grid",
                alignContent: "end",
                background: `linear-gradient(135deg, rgba(255,255,255,.32), rgba(255,255,255,${0.12 + i * 0.02}))`,
                color: "#0f172a",
                border: "1px solid rgba(15,23,42,.12)",
                boxShadow:
                  "0 12px 30px rgba(15,23,42,.10), inset 0 1px 0 rgba(255,255,255,.26)",
              }}
            >
              <strong>Surface {i + 1}</strong>
              <span style={{ color: "#475569", fontSize: 12 }}>
                Adaptive preview
              </span>
            </div>
          ))}
        />
      </div>
    </div>
  ),
};
