import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassShatterEffects as GlassShatterEffectsComponent } from "./GlassShatterEffects";

const meta = {
  title: "Effects + Advanced/Glass Shatter Effects",
  component: GlassShatterEffectsComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The actual GlassShatterEffects export in a deterministic manual-trigger state. Its compatibility fallback remains visible without a surrogate certification surface.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassShatterEffectsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const stageStyle: CSSProperties = {
  alignItems: "center",
  background:
    "radial-gradient(circle at 20% 14%, rgba(255, 255, 255, 0.98), transparent 35%), radial-gradient(circle at 80% 82%, rgba(148, 163, 184, 0.2), transparent 32%), linear-gradient(145deg, #dce3ea 0%, #f8fafc 52%, #e2e8f0 100%)",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  minHeight: "100dvh",
  padding: "clamp(20px, 5vw, 64px)",
  width: "100%",
};

export const GlassShatterEffects: Story = {
  name: "GlassShatterEffects",
  render: () => (
    <main data-bg="light" style={stageStyle}>
      <div style={{ minWidth: 0, width: "min(100%, 760px)" }}>
        <GlassShatterEffectsComponent
          className="glass-foundation-complete glass-bg-black/20 glass-w-full glass-h-96 glass-radius-2xl glass-shadow-soft-xl"
          trigger="manual"
        >
          <article className="glass-flex glass-h-full glass-items-center glass-p-8">
            <div className="glass-space-y-4">
              <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
                Material fracture
              </p>
              <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
                GlassShatterEffects
              </h2>
              <p className="glass-text-base glass-leading-relaxed glass-text-secondary">
                The public effect wrapper is mounted directly in a stable manual
                state, preserving the authored content boundary for responsive
                inspection.
              </p>
            </div>
          </article>
        </GlassShatterEffectsComponent>
      </div>
    </main>
  ),
};
