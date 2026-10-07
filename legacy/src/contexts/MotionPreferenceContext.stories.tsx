import type { Meta, StoryObj } from "@storybook/react";

import { OptimizedGlassCore } from "../primitives/OptimizedGlassCore";
import {
  MotionPreferenceProvider,
  useMotionPreferenceContext,
} from "./MotionPreferenceContext";

const MotionPreferenceConsumer = () => {
  const { prefersReducedMotion, isMotionSafe, motionPolicy } =
    useMotionPreferenceContext();

  return (
    <OptimizedGlassCore
      as="section"
      elevation="level2"
      aria-label="Motion preference provider state"
      className="glass-p-6"
      style={{
        width: "min(32rem, calc(100vw - 32px))",
        maxWidth: "100%",
        display: "grid",
        gap: 16,
      }}
    >
      <div>
        <p className="glass-text-sm glass-text-secondary">
          Motion preference provider
        </p>
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
          {isMotionSafe ? "Motion is safe" : "Motion is reduced"}
        </h2>
      </div>
      <dl
        className="glass-grid glass-gap-3"
        style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
      >
        <div>
          <dt className="glass-text-sm glass-text-secondary">Policy</dt>
          <dd className="glass-font-semibold glass-text-primary">
            {motionPolicy}
          </dd>
        </div>
        <div>
          <dt className="glass-text-sm glass-text-secondary">Preference</dt>
          <dd className="glass-font-semibold glass-text-primary">
            {prefersReducedMotion ? "Reduced" : "Standard"}
          </dd>
        </div>
      </dl>
    </OptimizedGlassCore>
  );
};

const meta = {
  title: "Foundations/Providers/Motion Preference Provider",
  component: MotionPreferenceProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Direct provider coverage with a consumer that proves the resolved policy, reduced-motion preference, and motion-safety state.",
      },
    },
  },
} satisfies Meta<typeof MotionPreferenceProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <MotionPreferenceProvider
      initialMotionPolicy="never-safe"
      initialPrefersReducedMotion
    >
      <MotionPreferenceConsumer />
    </MotionPreferenceProvider>
  ),
};
