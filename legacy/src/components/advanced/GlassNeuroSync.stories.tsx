import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassNeuroFeedback as ActualGlassNeuroFeedback,
  GlassNeuroMetricsDashboard as ActualGlassNeuroMetricsDashboard,
  GlassNeuroSyncProvider as ActualGlassNeuroSyncProvider,
} from "./GlassNeuroSync";

const previewMetrics = {
  attention: 0.74,
  relaxation: 0.62,
  meditation: 0.48,
  engagement: 0.81,
  cognitiveLoad: 0.44,
  fatigue: 0.18,
  stress: 0.26,
  flow: 0.69,
};

const StoryStage = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      boxSizing: "border-box",
      display: "grid",
      minHeight: "100vh",
      minWidth: 0,
      padding: "clamp(24px, 6vw, 72px)",
      placeItems: "center",
      width: "100%",
    }}
  >
    <div style={{ minWidth: 0, width: "min(100%, 720px)" }}>{children}</div>
  </div>
);

const meta = {
  title: "Effects + Advanced/Glass Neuro Sync",
  component: ActualGlassNeuroSyncProvider,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct provider-backed stories for the NeuroSync provider, metrics dashboard, and neural feedback exports. Device signals remain in deterministic disconnected mode for visual certification.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ActualGlassNeuroSyncProvider>;

export default meta;
type Story = StoryObj;

export const GlassNeuroSyncProvider: Story = {
  name: "GlassNeuroSyncProvider",
  render: () => (
    <StoryStage>
      <ActualGlassNeuroSyncProvider autoConnect={false} initialMetrics={previewMetrics}>
        <ActualGlassNeuroMetricsDashboard contained defaultOpen />
      </ActualGlassNeuroSyncProvider>
    </StoryStage>
  ),
};

export const GlassNeuroMetricsDashboard: Story = {
  name: "GlassNeuroMetricsDashboard",
  render: () => (
    <StoryStage>
      <ActualGlassNeuroSyncProvider autoConnect={false} initialMetrics={previewMetrics}>
        <ActualGlassNeuroMetricsDashboard contained defaultOpen showBrainwaves />
      </ActualGlassNeuroSyncProvider>
    </StoryStage>
  ),
};

export const GlassNeuroFeedback: Story = {
  name: "GlassNeuroFeedback",
  render: () => (
    <StoryStage>
      <ActualGlassNeuroSyncProvider autoConnect={false} initialMetrics={previewMetrics}>
        <section
          className="glass-neutral-level2 glass-contrast-guard"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,.32), rgba(255,255,255,.14))",
            border: "1px solid rgba(255,255,255,.28)",
            borderRadius: 28,
            boxShadow: "0 24px 64px rgba(15,23,42,.12), inset 0 1px 10px rgba(255,255,255,.12)",
            color: "rgba(15,23,42,.94)",
            padding: "clamp(24px,5vw,36px)",
            width: "100%",
          }}
        >
          <p style={{ color: "rgba(15,23,42,.72)", fontSize: 13, fontWeight: 650, letterSpacing: ".1em", margin: 0, textTransform: "uppercase" }}>Live neural feedback</p>
          <h2 style={{ color: "rgba(15,23,42,.94)", fontSize: "clamp(24px,5vw,34px)", margin: "10px 0 8px" }}>Attention is near target</h2>
          <p style={{ color: "rgba(15,23,42,.74)", lineHeight: 1.55, margin: "0 0 28px" }}>A deterministic disconnected sample demonstrates the actual feedback meter without requiring EEG hardware.</p>
          <ActualGlassNeuroFeedback type="attention" target={0.78} />
          <div style={{ color: "rgba(15,23,42,.68)", display: "flex", fontSize: 13, justifyContent: "space-between", marginTop: 12 }}><span>Current 74%</span><span>Target 78%</span></div>
        </section>
      </ActualGlassNeuroSyncProvider>
    </StoryStage>
  ),
};
