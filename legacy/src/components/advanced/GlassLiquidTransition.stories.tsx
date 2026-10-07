import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassLiquidTransition } from "./GlassLiquidTransition";

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.08) 32%), linear-gradient(150deg, #f7f7f7, #dedede)",
};

const meta = {
  title: "Effects + Advanced/Glass Liquid Transition",
  component: GlassLiquidTransition,
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The actual GlassLiquidTransition export; click the material to move between its resting and morphed states.",
      },
    },
  },
} satisfies Meta<typeof GlassLiquidTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <GlassLiquidTransition
        className="glass-foundation-complete glass-w-full glass-max-w-xl glass-radius-3xl glass-p-8"
        style={{
          boxShadow:
            "0 18px 42px -28px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
        }}
        variant="morph"
        trigger="click"
        duration={700}
        stiffness={120}
        damping={18}
        intensity={0.55}
        aria-label="Interactive liquid transition preview"
      >
        <div className="glass-grid glass-gap-4 glass-text-center">
          <span
            className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide"
            style={{ color: "rgba(15, 23, 42, 0.76)" }}
          >
            Material motion
          </span>
          <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
            Liquid state transition
          </h2>
          <p className="glass-text-secondary glass-leading-relaxed">
            Click anywhere on the panel to inspect the spring-driven morph and
            its continuous refractive highlight.
          </p>
        </div>
      </GlassLiquidTransition>
    </main>
  ),
};
