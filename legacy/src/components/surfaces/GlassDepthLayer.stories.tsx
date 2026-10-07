import type { Meta, StoryObj } from "@storybook/react";
import { GlassDepthLayer as GlassDepthLayerComponent } from "./GlassDepthLayer";

const meta: Meta<typeof GlassDepthLayerComponent> = {
  title: "Surfaces/Cards + Panels/Glass Depth Layer",
  component: GlassDepthLayerComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "A direct mount of the depth-layer export with deterministic motion settings for reliable liquid-glass visual certification.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GlassDepthLayerComponent>;

export const GlassDepthLayer: Story = {
  args: {
    children: null,
    layer: "mid",
  },
  render: () => (
    <main
      style={{
        minHeight: "100vh",
        padding: "clamp(1.25rem, 6vw, 4rem)",
        display: "grid",
        placeItems: "center",
        color: "rgba(15, 23, 42, 0.92)",
        background:
          "radial-gradient(circle at 76% 18%, rgba(255, 255, 255, 0.98), rgba(255,255,255,0.08) 32%), linear-gradient(145deg, #eeeeee 0%, #fafafa 52%, #dddddd 100%)",
      }}
    >
      <div style={{ width: "min(100%, 34rem)" }}>
        <GlassDepthLayerComponent
          layer="mid"
          initial={false}
          enableParallax={false}
          enableHover={false}
          className="glass-w-full glass-radius-2xl glass-border glass-border-white/20 glass-p-6"
        >
          <p className="glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide">
            Mid-depth plane
          </p>
          <h2 className="glass-text-2xl glass-text-primary glass-font-semibold glass-mt-2">
            Dimensional liquid glass
          </h2>
          <p className="glass-text-sm glass-text-secondary glass-mt-3">
            A real depth layer with a neutral white channel, sharp edge
            definition, and stable three-dimensional placement.
          </p>
        </GlassDepthLayerComponent>
      </div>
    </main>
  ),
};
