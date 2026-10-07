import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassFoldableSupport } from "./GlassFoldableSupport";

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 82% 16%, rgba(255,255,255,0.82), rgba(255,255,255,0) 30%), linear-gradient(145deg, #f2f2f1, #d9d9d7)",
};

const meta = {
  title: "Effects + Advanced/Glass Foldable Support",
  component: GlassFoldableSupport,
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The real GlassFoldableSupport export in its single-screen fallback, ready to adapt when a segmented display is available.",
      },
    },
  },
} satisfies Meta<typeof GlassFoldableSupport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <div
        className="glass-w-full glass-max-w-3xl glass-radius-3xl"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,.72), rgba(231,231,228,.58))",
          border: "1px solid rgba(255,255,255,.82)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.94), 0 24px 60px rgba(58,58,56,.14)",
          color: "rgba(15,23,42,.94)",
        }}
      >
        <GlassFoldableSupport
          className="glass-w-full glass-radius-3xl glass-p-6"
          adaptiveLayout
          bridgeHinge
          continuousGlass
          foldAnimation={false}
        >
          <div className="glass-grid glass-gap-5 sm:glass-grid-cols-2">
          <section className="glass-radius-2xl glass-border glass-border-white/20 glass-p-6">
            <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{ color: "rgba(15, 23, 42, 0.68)" }}>
              Primary pane
            </span>
            <h2 className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">
              One continuous surface
            </h2>
            <p className="glass-mt-3 glass-text-sm glass-leading-relaxed glass-text-secondary">
              Content remains composed on a traditional viewport and separates
              cleanly around a physical hinge when segments are detected.
            </p>
          </section>
          <section className="glass-radius-2xl glass-border glass-border-white/20 glass-p-6">
            <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{ color: "rgba(15, 23, 42, 0.68)" }}>
              Adaptive pane
            </span>
            <div className="glass-mt-5 glass-grid glass-gap-3">
              {["Hinge aware", "Segment balanced", "Motion safe"].map(
                (label) => (
                  <div
                    key={label}
                    className="glass-flex glass-items-center glass-justify-between glass-radius-xl glass-border glass-border-white/15 glass-p-3"
                  >
                    <span className="glass-text-sm glass-text-primary">
                      {label}
                    </span>
                    <span className="glass-text-xs" style={{ color: "rgba(15, 23, 42, 0.68)" }}>
                      On
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
          </div>
        </GlassFoldableSupport>
      </div>
    </main>
  ),
};
