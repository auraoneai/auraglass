import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassReactions } from "./GlassReactions";

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 80% 14%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0) 30%), linear-gradient(145deg, #f7f7f6 0%, #e2e2e0 100%)",
};

const surfaceStyle: CSSProperties = {
  background:
    "linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.14))",
  border: "1px solid rgba(15, 23, 42, 0.16)",
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.32), 0 24px 56px rgba(15, 23, 42, 0.12)",
  backdropFilter: "blur(24px) saturate(1.5) brightness(1.04) contrast(1.02)",
  WebkitBackdropFilter:
    "blur(24px) saturate(1.5) brightness(1.04) contrast(1.02)",
};

const initialReactions = [
  {
    id: "reaction-like",
    emoji: "👍",
    position: { x: 28, y: 28 },
    timestamp: 0,
    intensity: 0.1,
  },
];

const meta = {
  title: "Effects + Advanced/Glass Reactions",
  component: GlassReactions,
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The real GlassReactions export with deterministic initial reactions and all overlays constrained to the liquid surface.",
      },
    },
  },
} satisfies Meta<typeof GlassReactions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <GlassReactions
        className="glass-foundation-complete glass-w-full glass-max-w-3xl glass-radius-3xl glass-p-8"
        style={surfaceStyle}
        reactions={initialReactions}
        enablePhysics={false}
        enableSounds={false}
        enableShortcuts={false}
        enableBurst={false}
        autoExpire={0}
        glassEffect
      >
        <div className="glass-grid glass-min-h-320 glass-content-center glass-gap-4 glass-text-center">
          <span
            className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide"
            style={{ color: "rgba(15, 23, 42, 0.68)" }}
          >
            Live feedback
          </span>
          <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
            Reactions with physical presence
          </h2>
          <p className="glass-mx-auto glass-max-w-lg glass-text-secondary glass-leading-relaxed">
            Lightweight emoji feedback can burst, drift, and expire without
            disturbing the layout beneath it.
          </p>
        </div>
      </GlassReactions>
    </main>
  ),
};
