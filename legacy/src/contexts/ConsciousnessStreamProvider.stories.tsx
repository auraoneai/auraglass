import type { Meta, StoryObj } from "@storybook/react";

import { OptimizedGlassCore } from "../primitives/OptimizedGlassCore";
import {
  ConsciousnessStreamProvider,
  useConsciousnessStream,
} from "./ConsciousnessStreamProvider";

const ConsciousnessStreamConsumer = () => {
  const { config, events, updateFeature, clearEvents } =
    useConsciousnessStream();

  return (
    <OptimizedGlassCore
      as="section"
      elevation="level2"
      aria-label="Consciousness stream state"
      className="glass-p-6"
      style={{
        width: "min(34rem, calc(100vw - 32px))",
        maxWidth: "100%",
        display: "grid",
        gap: 16,
      }}
    >
      <div>
        <p className="glass-text-sm glass-text-secondary">
          Consciousness stream provider
        </p>
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
          Live feature state
        </h2>
      </div>
      <dl
        className="glass-grid glass-gap-3"
        style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
      >
        <div>
          <dt className="glass-text-sm glass-text-secondary">Predictive</dt>
          <dd className="glass-font-semibold glass-text-primary">
            {config.features.predictive ? "Enabled" : "Paused"}
          </dd>
        </div>
        <div>
          <dt className="glass-text-sm glass-text-secondary">Events</dt>
          <dd className="glass-font-semibold glass-text-primary">
            {events.length}
          </dd>
        </div>
      </dl>
      <div className="glass-flex glass-flex-wrap glass-gap-3">
        <button
          type="button"
          className="glass-surface-subtle/10 glass-backdrop-blur-sm glass-border glass-border-white/20 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary"
          onClick={() =>
            updateFeature("predictive", !config.features.predictive)
          }
        >
          Toggle predictive
        </button>
        <button
          type="button"
          className="glass-surface-subtle/10 glass-backdrop-blur-sm glass-border glass-border-white/20 glass-radius-lg glass-px-4 glass-py-2 glass-text-primary"
          onClick={clearEvents}
        >
          Clear events
        </button>
      </div>
    </OptimizedGlassCore>
  );
};

const meta = {
  title: "Foundations/Providers/Consciousness Stream Provider",
  component: ConsciousnessStreamProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Direct provider coverage with a consumer that reads feature configuration and initial stream events, then exercises provider actions.",
      },
    },
  },
} satisfies Meta<typeof ConsciousnessStreamProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <ConsciousnessStreamProvider
      config={{
        enabled: true,
        features: {
          predictive: true,
          eyeTracking: false,
          adaptive: false,
          spatialAudio: false,
          achievements: false,
        },
      }}
      initialEvents={[
        {
          id: "story-signal",
          feature: "predictive",
          timestamp: 1_750_000_000_000,
          confidence: 0.94,
          status: "success",
        },
      ]}
    >
      <ConsciousnessStreamConsumer />
    </ConsciousnessStreamProvider>
  ),
};
