import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassContextAware } from "./GlassContextAware";

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 18% 12%, #ffffff 0%, transparent 34%), linear-gradient(145deg, #f2f2f1, #d9d9d7)",
};

const meta = {
  title: "AI + Intelligence/Glass Context Aware",
  component: GlassContextAware,
  args: {
    children: null,
  },
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The actual GlassContextAware export with a deterministic material override for visual inspection.",
      },
    },
  },
} satisfies Meta<typeof GlassContextAware>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <GlassContextAware
        className="glass-w-full glass-max-w-2xl glass-radius-3xl glass-p-8"
        adaptationSpeed={0.4}
        sensitivity={0.65}
        override={{
          intensity: 0.78,
          blur: 24,
          opacity: 0.18,
          contrast: 1.04,
          saturation: 0.82,
        }}
        showDebugHud={false}
      >
        <div className="glass-grid glass-gap-4">
          <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide" style={{ color: "rgba(15, 23, 42, 0.68)" }}>
            Ambient intelligence
          </span>
          <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
            Context-aware clarity
          </h2>
          <p className="glass-text-secondary glass-leading-relaxed">
            Light, device conditions, and task focus tune one coherent liquid
            surface while preserving readable hierarchy.
          </p>
          <div className="glass-grid glass-grid-cols-3 glass-gap-3 glass-pt-3">
            {[
              ["Light", "Balanced"],
              ["Focus", "Deep work"],
              ["Motion", "Adaptive"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="glass-radius-xl glass-border glass-border-white/20 glass-p-3"
              >
                <div className="glass-text-xs" style={{ color: "rgba(15, 23, 42, 0.68)" }}>{label}</div>
                <div className="glass-mt-1 glass-text-sm glass-font-semibold glass-text-primary">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassContextAware>
    </main>
  ),
};
