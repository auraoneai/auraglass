import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassEyeTracking as GlassEyeTrackingComponent,
  GlassEyeTrackingCalibration as GlassEyeTrackingCalibrationComponent,
  GlassEyeTrackingProvider as GlassEyeTrackingProviderComponent,
  GlassGazeResponsive as GlassGazeResponsiveComponent,
  GlassGazeVisualization as GlassGazeVisualizationComponent,
} from "./GlassEyeTracking";

const meta: Meta = {
  title: "Effects + Advanced/Glass Eye Tracking",
  component: GlassEyeTrackingComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Actual public eye-tracking exports with camera initialization disabled for deterministic, privacy-safe Storybook rendering.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const frameStyle: CSSProperties = {
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  minHeight: "min(760px, 100vh)",
  padding: "clamp(24px, 6vw, 72px)",
  width: "100%",
};

const panelStyle: CSSProperties = {
  borderRadius: 28,
  maxWidth: 680,
  padding: "clamp(24px, 5vw, 44px)",
  width: "100%",
};

function StoryFrame({ children }: { children: ReactNode }) {
  return <div style={frameStyle}>{children}</div>;
}

function EyeTrackingCopy({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-space-y-3">
      <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
        {eyebrow}
      </p>
      <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
        {title}
      </h2>
      <p className="glass-text-base glass-leading-relaxed glass-text-secondary">
        {description}
      </p>
    </div>
  );
}

function ProviderPanel({ children }: { children: ReactNode }) {
  return (
    <GlassEyeTrackingProviderComponent autoInitialize={false}>
      <div
        className="glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl"
        style={panelStyle}
      >
        {children}
      </div>
    </GlassEyeTrackingProviderComponent>
  );
}

export const GlassEyeTracking: Story = {
  name: "GlassEyeTracking",
  render: () => (
    <StoryFrame>
      <div className="glass-w-full glass-max-w-2xl">
        <GlassEyeTrackingComponent
          autoInitialize={false}
          showCalibration
          showVisualization={false}
        />
      </div>
    </StoryFrame>
  ),
};

export const GlassEyeTrackingProvider: Story = {
  name: "GlassEyeTrackingProvider",
  render: () => (
    <StoryFrame>
      <ProviderPanel>
        <EyeTrackingCopy
          eyebrow="Camera remains off"
          title="Eye-tracking context ready"
          description="The actual provider supplies a stable empty interaction state without requesting camera access or loading WebGazer."
        />
      </ProviderPanel>
    </StoryFrame>
  ),
};

export const GlassEyeTrackingCalibration: Story = {
  name: "GlassEyeTrackingCalibration",
  render: () => (
    <StoryFrame>
      <ProviderPanel>
        <GlassEyeTrackingCalibrationComponent className="glass-w-full" />
      </ProviderPanel>
    </StoryFrame>
  ),
};

export const GlassGazeResponsive: Story = {
  name: "GlassGazeResponsive",
  render: () => (
    <StoryFrame>
      <GlassEyeTrackingProviderComponent autoInitialize={false}>
        <GlassGazeResponsiveComponent
          regionId="story-gaze-focus-card"
          className="glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl"
        >
          <div style={panelStyle}>
            <EyeTrackingCopy
              eyebrow="Registered gaze region"
              title="Focus follows attention"
              description="The actual responsive wrapper registers this panel as a gaze region while maintaining a neutral state before tracking begins."
            />
          </div>
        </GlassGazeResponsiveComponent>
      </GlassEyeTrackingProviderComponent>
    </StoryFrame>
  ),
};

export const GlassGazeVisualization: Story = {
  name: "GlassGazeVisualization",
  render: () => (
    <StoryFrame>
      <GlassEyeTrackingProviderComponent autoInitialize={false}>
        <div
          className="glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl"
          style={panelStyle}
        >
          <EyeTrackingCopy
            eyebrow="Visualization layer mounted"
            title="Gaze overlay standby"
            description="The real fixed visualization overlay is active with an empty interaction collection, so no fabricated gaze markers are displayed."
          />
          <div className="glass-mt-6 glass-flex glass-items-center glass-gap-3">
            <span
              className="glass-h-2 glass-w-2 glass-radius-full glass-surface-success"
              aria-hidden
            />
            <span className="glass-text-sm glass-text-secondary">
              Waiting for verified gaze events
            </span>
          </div>
        </div>
        <GlassGazeVisualizationComponent show />
      </GlassEyeTrackingProviderComponent>
    </StoryFrame>
  ),
};
