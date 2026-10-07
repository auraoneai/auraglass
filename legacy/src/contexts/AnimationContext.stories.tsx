import type { Meta, StoryObj } from "@storybook/react";

import { OptimizedGlassCore } from "../primitives/OptimizedGlassCore";
import { AnimationProvider, useAnimation } from "./AnimationContext";

const AnimationConsumer = () => {
  const { reducedMotion, setReducedMotion, defaultSpring } = useAnimation();

  return (
    <OptimizedGlassCore
      as="section"
      elevation="level2"
      aria-label="Animation provider state"
      className="glass-p-6"
      style={{
        width: "min(32rem, calc(100vw - 32px))",
        maxWidth: "100%",
        display: "grid",
        gap: 16,
      }}
    >
      <div>
        <p className="glass-text-sm glass-text-secondary">Animation provider</p>
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
          {reducedMotion ? "Reduced motion" : "Full motion"}
        </h2>
      </div>
      <p className="glass-text-secondary">
        Spring {defaultSpring.stiffness} / {defaultSpring.damping} /{" "}
        {defaultSpring.mass}
      </p>
      <button
        type="button"
        className="glass-surface-subtle/10 glass-backdrop-blur-sm glass-border glass-border-white/20 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary"
        onClick={() => setReducedMotion(!reducedMotion)}
      >
        Toggle motion preference
      </button>
    </OptimizedGlassCore>
  );
};

const meta = {
  title: "Foundations/Providers/Animation Provider",
  component: AnimationProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Direct provider coverage with a consumer that reads and updates the reduced-motion state and spring configuration.",
      },
    },
  },
} satisfies Meta<typeof AnimationProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <AnimationProvider
      defaultReducedMotion
      defaultSpring={{ stiffness: 120, damping: 18, mass: 0.9 }}
    >
      <AnimationConsumer />
    </AnimationProvider>
  ),
};
