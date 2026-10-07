import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AuroraPro as AuroraProComponent } from "./AuroraPro";

const meta = {
  title: "Effects + Advanced/Aurora Pro",
  component: AuroraProComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The actual AuroraPro export mounted as a bounded, neutral liquid-glass effect surface. The React 18 compatibility fallback remains visible rather than being replaced by a story surrogate.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AuroraProComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const stageStyle: CSSProperties = {
  alignItems: "center",
  background:
    "radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.98), transparent 35%), radial-gradient(circle at 82% 80%, rgba(148, 163, 184, 0.2), transparent 32%), linear-gradient(145deg, #dce3ea 0%, #f8fafc 50%, #e2e8f0 100%)",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  minHeight: "100dvh",
  padding: "clamp(20px, 5vw, 64px)",
  width: "100%",
};

export const AuroraPro: Story = {
  name: "AuroraPro",
  render: () => (
    <main data-bg="light" style={stageStyle}>
      <div style={{ minWidth: 0, width: "min(100%, 760px)" }}>
        <AuroraProComponent className="glass-foundation-complete glass-bg-black/20 glass-w-full glass-h-96 glass-radius-2xl glass-shadow-soft-xl">
          <article className="glass-flex glass-h-full glass-items-center glass-p-8">
            <div className="glass-space-y-4">
              <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
                Atmospheric effect
              </p>
              <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
                AuroraPro
              </h2>
              <p className="glass-text-base glass-leading-relaxed glass-text-secondary">
                The exported effect owns this responsive material boundary; its
                optional renderer can enhance the surface when the compatible
                React Three Fiber runtime is available.
              </p>
            </div>
          </article>
        </AuroraProComponent>
      </div>
    </main>
  ),
};
