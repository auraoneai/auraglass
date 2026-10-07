import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassOrientationEffects } from "./GlassOrientationEffects";

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 80% 14%, #ffffff 0%, transparent 30%), linear-gradient(145deg, #f2f2f1, #d8d8d6)",
};

const meta = {
  title: "Effects + Advanced/Glass Orientation Effects",
  component: GlassOrientationEffects,
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The real GlassOrientationEffects export, including its desktop fallback when orientation sensors are unavailable.",
      },
    },
  },
} satisfies Meta<typeof GlassOrientationEffects>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <GlassOrientationEffects
        className="glass-foundation-complete glass-w-full glass-max-w-2xl glass-radius-3xl glass-p-8"
        sensitivity={0.55}
        smoothing={0.85}
        effectTypes={["tilt", "parallax", "refraction", "shimmer"]}
        gyroscopeEnabled
        accelerometerEnabled
        compassEnabled
        showDebugHud={false}
      >
        <div className="glass-grid glass-min-h-280 glass-content-center glass-gap-4 glass-text-center">
          <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
            Spatial material
          </span>
          <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
            Responsive to orientation
          </h2>
          <p className="glass-mx-auto glass-max-w-lg glass-text-secondary glass-leading-relaxed">
            Tilt, parallax, refraction, and shimmer respond to supported device
            sensors while the desktop fallback remains fully composed.
          </p>
        </div>
      </GlassOrientationEffects>
    </main>
  ),
};
