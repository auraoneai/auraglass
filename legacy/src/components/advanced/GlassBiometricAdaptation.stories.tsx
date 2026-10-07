import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  BiometricAdaptationEngine as BiometricAdaptationEngineClass,
  BiometricStressDetector as BiometricStressDetectorClass,
  GlassBiometricAdaptation as GlassBiometricAdaptationComponent,
  GlassBiometricAdaptationProvider as GlassBiometricAdaptationProviderComponent,
  GlassBiometricDashboard as GlassBiometricDashboardComponent,
  GlassStressResponsive as GlassStressResponsiveComponent,
} from "./GlassBiometricAdaptation";

const meta: Meta = {
  title: "Effects + Advanced/Glass Biometric Adaptation",
  component: GlassBiometricAdaptationComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Actual public biometric-adaptation exports with hardware initialization disabled for deterministic, privacy-safe Storybook rendering.",
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
  boxSizing: "border-box",
  maxWidth: 680,
  padding: "clamp(20px, 5vw, 44px)",
  width: "min(100%, calc(100vw - 32px))",
};

function StoryFrame({ children }: { children: ReactNode }) {
  return <div style={frameStyle}>{children}</div>;
}

function BiometricCopy({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-space-y-3" style={{ minWidth: 0 }}>
      <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
        {eyebrow}
      </p>
      <h2
        className="glass-font-semibold glass-text-primary"
        style={{
          fontSize: "clamp(1.45rem, 7vw, 1.875rem)",
          overflowWrap: "anywhere",
        }}
      >
        {title}
      </h2>
      <p className="glass-text-base glass-leading-relaxed glass-text-secondary">
        {description}
      </p>
    </div>
  );
}

function ProviderSurface({ children }: { children: ReactNode }) {
  return (
    <GlassBiometricAdaptationProviderComponent autoInitialize={false}>
      <div
        className="glass-surface glass-surface-medium glass-backdrop-blur glass-border glass-border-white/20 glass-shadow-soft-xl"
        style={panelStyle}
      >
        {children}
      </div>
    </GlassBiometricAdaptationProviderComponent>
  );
}

function AdaptationEnginePreview() {
  const engine = new BiometricAdaptationEngineClass({
    enableAudioAdaptation: false,
    responseSpeed: 800,
    sensitivity: 0.7,
  });
  const profile = engine.getProfile();

  return (
    <ProviderSurface>
      <BiometricCopy
        eyebrow="Runtime engine"
        title="BiometricAdaptationEngine"
        description="The exported engine is instantiated directly and exposes a local, uninitialized profile without requesting sensors or Bluetooth access."
      />
      <dl
        className="glass-mt-6 glass-grid glass-gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
      >
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <dt className="glass-text-xs glass-text-tertiary">Baseline pulse</dt>
          <dd className="glass-mt-1 glass-text-xl glass-font-semibold glass-text-primary">
            {profile.baselineHeartRate} bpm
          </dd>
        </div>
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <dt className="glass-text-xs glass-text-tertiary">Stored readings</dt>
          <dd className="glass-mt-1 glass-text-xl glass-font-semibold glass-text-primary">
            {profile.history.length}
          </dd>
        </div>
      </dl>
    </ProviderSurface>
  );
}

function StressDetectorPreview() {
  const detector = new BiometricStressDetectorClass({
    enableAudioAdaptation: false,
    sensitivity: 0.8,
  });

  return (
    <ProviderSurface>
      <BiometricCopy
        eyebrow="Signal interpreter"
        title="BiometricStressDetector"
        description="The exported detector is exercised before initialization, demonstrating its safe zero-signal baseline without attaching device listeners."
      />
      <div
        className="glass-mt-6 glass-grid glass-gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}
      >
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <p className="glass-text-xs glass-text-tertiary">Stress level</p>
          <p className="glass-mt-1 glass-text-xl glass-font-semibold glass-text-primary">
            {Math.round(detector.getStressLevel() * 100)}%
          </p>
        </div>
        <div className="glass-surface-subtle glass-radius-xl glass-p-4">
          <p className="glass-text-xs glass-text-tertiary">Confidence</p>
          <p className="glass-mt-1 glass-text-xl glass-font-semibold glass-text-primary">
            {Math.round(detector.getConfidence() * 100)}%
          </p>
        </div>
      </div>
    </ProviderSurface>
  );
}

export const GlassBiometricAdaptation: Story = {
  name: "GlassBiometricAdaptation",
  render: () => (
    <StoryFrame>
      <div className="glass-w-full glass-max-w-2xl">
        <GlassBiometricAdaptationComponent
          autoInitialize={false}
          showDashboard={false}
          settings={{ enableAudioAdaptation: false }}
        />
      </div>
    </StoryFrame>
  ),
};

export const GlassBiometricAdaptationProvider: Story = {
  name: "GlassBiometricAdaptationProvider",
  render: () => (
    <StoryFrame>
      <ProviderSurface>
        <BiometricCopy
          eyebrow="Privacy-safe context"
          title="Biometric provider ready"
          description="The real provider is mounted with automatic hardware initialization disabled and supplies its stable baseline context to this surface."
        />
      </ProviderSurface>
    </StoryFrame>
  ),
};

export const GlassStressResponsive: Story = {
  name: "GlassStressResponsive",
  render: () => (
    <StoryFrame>
      <GlassBiometricAdaptationProviderComponent autoInitialize={false}>
        <GlassStressResponsiveComponent
          adaptationType="all"
          aria-label="Stress-responsive planning surface"
          className="glass-w-full glass-max-w-2xl glass-shadow-soft-xl"
        >
          <div className="glass-p-8">
            <BiometricCopy
              eyebrow="Calm by default"
              title="Stress-responsive workspace"
              description="The actual adaptive wrapper starts from a neutral baseline and can respond when verified biometric readings become available."
            />
          </div>
        </GlassStressResponsiveComponent>
      </GlassBiometricAdaptationProviderComponent>
    </StoryFrame>
  ),
};

export const GlassBiometricDashboard: Story = {
  name: "GlassBiometricDashboard",
  render: () => (
    <StoryFrame>
      <GlassBiometricAdaptationProviderComponent autoInitialize={false}>
        <div className="glass-relative glass-h-80 glass-w-full glass-max-w-2xl">
          <GlassBiometricDashboardComponent
            aria-label="Biometric monitoring dashboard preview"
            className="glass-shadow-soft-xl"
          />
        </div>
      </GlassBiometricAdaptationProviderComponent>
    </StoryFrame>
  ),
};

export const BiometricAdaptationEngine: Story = {
  name: "BiometricAdaptationEngine",
  render: () => (
    <StoryFrame>
      <AdaptationEnginePreview />
    </StoryFrame>
  ),
};

export const BiometricStressDetector: Story = {
  name: "BiometricStressDetector",
  render: () => (
    <StoryFrame>
      <StressDetectorPreview />
    </StoryFrame>
  ),
};
