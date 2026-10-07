import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import {
  BatteryAwareGlass as BatteryAwareGlassComponent,
  EfficientGlassRendering as EfficientGlassRenderingComponent,
  GlassPerformanceMonitor as GlassPerformanceMonitorComponent,
  GlassPerformanceOptimization as GlassPerformanceOptimizationComponent,
  GlassPerformanceProvider as GlassPerformanceProviderComponent,
  LazyGlassLoading as LazyGlassLoadingComponent,
  ProgressiveGlassEnhancement as ProgressiveGlassEnhancementComponent,
  ReducedMotionGlass as ReducedMotionGlassComponent,
  useGlassPerformance,
} from "./GlassPerformanceOptimization";

const meta: Meta = {
  title: "Effects + Advanced/Glass Performance Optimization",
  component: GlassPerformanceOptimizationComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The real performance exports, mounted individually with their required provider context and deterministic content.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const Scene = ({ children }: { children: ReactNode }) => (
  <main
    style={{
      minHeight: "100vh",
      padding: "clamp(1.25rem, 5vw, 4rem)",
      display: "grid",
      placeItems: "center",
      color: "rgba(15, 23, 42, 0.92)",
      background:
        "radial-gradient(circle at 18% 14%, rgba(255, 255, 255, 0.96), transparent 35%), linear-gradient(145deg, #ececec 0%, #fafafa 52%, #dedede 100%)",
    }}
  >
    <div style={{ width: "min(100%, 56rem)" }}>{children}</div>
  </main>
);

const DemoSurface = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) => (
  <section className="glass-surface-primary glass-blur-backdrop glass-border glass-border-white/20 glass-radius-2xl glass-p-6 glass-space-y-3">
    <p className="glass-text-xs glass-text-tertiary glass-uppercase glass-tracking-wide">
      {eyebrow}
    </p>
    <h2 className="glass-text-2xl glass-text-primary glass-font-semibold">
      {title}
    </h2>
    <p className="glass-text-sm glass-text-secondary">
      {children ??
        "Rendering fidelity adapts without compromising the liquid-glass material."}
    </p>
  </section>
);

function PerformanceProviderConsumer() {
  const { performanceMode, gpuAcceleration, reducedMotion, lazyLoading } =
    useGlassPerformance();

  return (
    <DemoSurface eyebrow="Live provider context" title={performanceMode}>
      GPU acceleration {gpuAcceleration ? "enabled" : "disabled"}; motion{" "}
      {reducedMotion ? "reduced" : "full"}; lazy loading{" "}
      {lazyLoading ? "enabled" : "disabled"}.
    </DemoSurface>
  );
}

export const GlassPerformanceOptimization: Story = {
  name: "GlassPerformanceOptimization",
  render: () => (
    <Scene>
      <GlassPerformanceOptimizationComponent
        adaptivePerformance={false}
        showMonitor={false}
      />
    </Scene>
  ),
};

export const GlassPerformanceProvider: Story = {
  name: "GlassPerformanceProvider",
  render: () => (
    <Scene>
      <GlassPerformanceProviderComponent adaptivePerformance={false}>
        <PerformanceProviderConsumer />
      </GlassPerformanceProviderComponent>
    </Scene>
  ),
};

export const GlassPerformanceMonitor: Story = {
  name: "GlassPerformanceMonitor",
  render: () => (
    <Scene>
      <GlassPerformanceProviderComponent adaptivePerformance={false}>
        <DemoSurface eyebrow="Runtime telemetry" title="Adaptive monitor">
          The mounted monitor reports the active performance profile in the
          upper-right corner.
        </DemoSurface>
        <GlassPerformanceMonitorComponent className="glass-p-4 glass-radius-xl" />
      </GlassPerformanceProviderComponent>
    </Scene>
  ),
};

export const EfficientGlassRendering: Story = {
  name: "EfficientGlassRendering",
  render: () => (
    <Scene>
      <GlassPerformanceProviderComponent adaptivePerformance={false}>
        <EfficientGlassRenderingComponent className="glass-p-6 glass-radius-2xl">
          <DemoSurface
            eyebrow="GPU-aware surface"
            title="Efficient rendering"
          />
        </EfficientGlassRenderingComponent>
      </GlassPerformanceProviderComponent>
    </Scene>
  ),
};

export const LazyGlassLoading: Story = {
  name: "LazyGlassLoading",
  render: () => (
    <Scene>
      <LazyGlassLoadingComponent threshold={0} rootMargin="200px">
        <DemoSurface eyebrow="Viewport aware" title="Lazy glass loading" />
      </LazyGlassLoadingComponent>
    </Scene>
  ),
};

export const ReducedMotionGlass: Story = {
  name: "ReducedMotionGlass",
  render: () => (
    <Scene>
      <GlassPerformanceProviderComponent adaptivePerformance={false}>
        <ReducedMotionGlassComponent className="glass-p-6 glass-radius-2xl">
          <DemoSurface
            eyebrow="Preference aware"
            title="Reduced-motion glass"
          />
        </ReducedMotionGlassComponent>
      </GlassPerformanceProviderComponent>
    </Scene>
  ),
};

export const BatteryAwareGlass: Story = {
  name: "BatteryAwareGlass",
  render: () => (
    <Scene>
      <GlassPerformanceProviderComponent adaptivePerformance={false}>
        <BatteryAwareGlassComponent className="glass-p-6 glass-radius-2xl">
          <DemoSurface eyebrow="Energy aware" title="Battery-aware glass" />
        </BatteryAwareGlassComponent>
      </GlassPerformanceProviderComponent>
    </Scene>
  ),
};

export const ProgressiveGlassEnhancement: Story = {
  name: "ProgressiveGlassEnhancement",
  render: () => (
    <Scene>
      <GlassPerformanceProviderComponent adaptivePerformance={false}>
        <ProgressiveGlassEnhancementComponent
          autoDetect={false}
          className="glass-p-6 glass-radius-2xl"
        >
          <DemoSurface
            eyebrow="Capability aware"
            title="Progressive enhancement"
          />
        </ProgressiveGlassEnhancementComponent>
      </GlassPerformanceProviderComponent>
    </Scene>
  ),
};
