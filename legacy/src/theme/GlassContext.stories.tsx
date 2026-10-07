import type { Meta, StoryObj } from "@storybook/react";

import {
  GlassContext as GlassContextValue,
  type GlassContextType,
  useGlass,
} from "./GlassContext";

const demonstratedContext: GlassContextType = {
  reducedEffects: false,
  useHardwareAcceleration: true,
  qualityTier: "ultra",
  isDarkMode: false,
  themeVariant: "liquid-glass",
  getColor: (_path, fallback = "") => fallback,
};

const ContextReadout = () => {
  const glass = useGlass();

  return (
    <section
      className="glass-foundation-complete glass-w-full glass-p-5"
      style={{ maxWidth: 720 }}
      aria-label="Glass context values"
    >
      <p className="glass-m-0 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-secondary">
        Live context consumer
      </p>
      <h2 className="glass-mt-2 glass-text-2xl glass-font-semibold glass-text-primary">
        {glass.themeVariant}
      </h2>
      <div
        className="glass-mt-4 glass-grid glass-gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}
      >
        <div className="glass-rounded-lg glass-bg-white/10 glass-p-3">
          <span className="glass-text-xs glass-text-secondary">Quality</span>
          <p className="glass-mt-1 glass-font-semibold glass-text-primary">
            {glass.qualityTier}
          </p>
        </div>
        <div className="glass-rounded-lg glass-bg-white/10 glass-p-3">
          <span className="glass-text-xs glass-text-secondary">
            Acceleration
          </span>
          <p className="glass-mt-1 glass-font-semibold glass-text-primary">
            {glass.useHardwareAcceleration ? "Enabled" : "Disabled"}
          </p>
        </div>
        <div className="glass-rounded-lg glass-bg-white/10 glass-p-3">
          <span className="glass-text-xs glass-text-secondary">Effects</span>
          <p className="glass-mt-1 glass-font-semibold glass-text-primary">
            {glass.reducedEffects ? "Reduced" : "Full fidelity"}
          </p>
        </div>
      </div>
    </section>
  );
};

const meta = {
  title: "Foundations/Theming/Glass Context",
  component: GlassContextValue.Provider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Direct coverage for the exported GlassContext. The story mounts its real Provider and reads the supplied value through useGlass.",
      },
    },
  },
  args: {
    value: demonstratedContext,
    children: null,
  },
} satisfies Meta<typeof GlassContextValue.Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassContext: Story = {
  name: "GlassContext",
  render: () => (
    <div
      className="glass-grid glass-w-full glass-p-4"
      style={{ minHeight: "100vh", placeItems: "center" }}
    >
      <GlassContextValue.Provider value={demonstratedContext}>
        <ContextReadout />
      </GlassContextValue.Provider>
    </div>
  ),
};
