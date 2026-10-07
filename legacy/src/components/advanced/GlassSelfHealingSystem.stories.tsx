import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassSelfHealingDashboard as ActualGlassSelfHealingDashboard,
  GlassSelfHealingProvider as ActualGlassSelfHealingProvider,
  GlassSelfHealingWrapper as ActualGlassSelfHealingWrapper,
} from "./GlassSelfHealingSystem";

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
    <div style={{ minWidth: 0, width: "min(100%, 680px)" }}>{children}</div>
  </div>
);

const MonitoredGlassCard = () => (
  <ActualGlassSelfHealingWrapper
    componentId="story-workspace-health"
    componentType="workspace-status"
    monitoringEnabled
    healingEnabled
  >
    <section className="glass-foundation-complete glass-radius-2xl glass-p-6 glass-space-y-3">
      <p className="glass-text-xs glass-uppercase glass-tracking-wide" style={{ color: "rgba(15, 23, 42, 0.68)" }}>
        Continuous diagnostics
      </p>
      <h2 className="glass-text-xl glass-text-primary glass-font-semibold">
        Workspace surface healthy
      </h2>
      <p className="glass-text-sm glass-text-secondary">
        Rendering, interaction, accessibility, and performance checks are
        active.
      </p>
    </section>
  </ActualGlassSelfHealingWrapper>
);

const meta = {
  title: "Effects + Advanced/Glass Self Healing System",
  component: ActualGlassSelfHealingWrapper,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct, provider-backed stories for the self-healing provider, monitored wrapper, and system-health dashboard exports.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ActualGlassSelfHealingWrapper>;

export default meta;
type Story = StoryObj;

export const GlassSelfHealingProvider: Story = {
  name: "GlassSelfHealingProvider",
  render: () => (
    <StoryStage>
      <ActualGlassSelfHealingProvider diagnosticInterval={5000}>
        <MonitoredGlassCard />
      </ActualGlassSelfHealingProvider>
    </StoryStage>
  ),
};

export const GlassSelfHealingWrapper: Story = {
  name: "GlassSelfHealingWrapper",
  render: () => (
    <StoryStage>
      <ActualGlassSelfHealingProvider diagnosticInterval={5000}>
        <MonitoredGlassCard />
      </ActualGlassSelfHealingProvider>
    </StoryStage>
  ),
};

export const GlassSelfHealingDashboard: Story = {
  name: "GlassSelfHealingDashboard",
  render: () => (
    <StoryStage>
      <ActualGlassSelfHealingProvider diagnosticInterval={5000}>
        <MonitoredGlassCard />
        <ActualGlassSelfHealingDashboard defaultOpen />
      </ActualGlassSelfHealingProvider>
    </StoryStage>
  ),
};
