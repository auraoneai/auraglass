import type { Meta, StoryObj } from "@storybook/react";
import { LiquidGlassBackdropSampler } from "../../primitives/LiquidGlassBackdropSampler";

const meta: Meta<typeof LiquidGlassBackdropSampler> = {
  title: 'Foundations/Liquid Glass Primitives/Liquid Glass Backdrop Sampler',
  component: LiquidGlassBackdropSampler,
  parameters: { layout: "fullscreen", previewSurface: "app" },
};

export default meta;
type Story = StoryObj<typeof LiquidGlassBackdropSampler>;

export const Default: Story = {
  render: () => (
    <div
      style={{
        width: "min(960px, 100%)",
        margin: "0 auto",
        padding: 32,
        display: "grid",
        gap: 20,
      }}
    >
      <div
        className="glass-neutral-level1"
        style={{
          minHeight: 320,
          borderRadius: 28,
          padding: 28,
          color: "#0f172a",
          boxShadow: "0 24px 80px rgba(15,23,42,0.16)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22 }}>Backdrop sampling</h2>
        <p style={{ maxWidth: 560, margin: "8px 0 24px", color: "#475569" }}>
          The sampler reads the content behind a Liquid Glass surface and exposes a stable preview payload for adaptive tinting.
        </p>
        <LiquidGlassBackdropSampler>
          {(sample) => (
            <pre
              style={{
                margin: 0,
                maxWidth: 520,
                overflow: "auto",
                borderRadius: 18,
                padding: 16,
                border: "1px solid rgba(80,102,130,0.18)",
                background: "rgba(255,255,255,0.28)",
                color: "#172033",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)",
                fontSize: 12,
              }}
            >
              {JSON.stringify(sample, null, 2)}
            </pre>
          )}
        </LiquidGlassBackdropSampler>
      </div>
    </div>
  ),
};
