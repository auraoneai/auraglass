import type { CSSProperties, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AdaptiveGlass as AdaptiveGlassComponent,
  EnvironmentalGlass as EnvironmentalGlassComponent,
  GlassColorTinting as GlassColorTintingComponent,
  GlassEngine as GlassEngineComponent,
  GlassEngineDemo as GlassEngineDemoComponent,
  GlassEngineProvider as GlassEngineProviderComponent,
  GlassOpacityEngine as GlassOpacityEngineComponent,
  GlassTextureVariations as GlassTextureVariationsComponent,
} from "./GlassEngine";

const meta = {
  title: "Effects + Advanced/Glass Engine",
  component: GlassEngineComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Actual public GlassEngine exports, mounted independently against a deterministic liquid-glass presentation surface.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassEngineComponent>;

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
  maxWidth: 720,
  padding: "clamp(24px, 5vw, 48px)",
  width: "100%",
};

function StoryFrame({ children }: { children: ReactNode }) {
  return <div style={frameStyle}>{children}</div>;
}

function PanelCopy({
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
      <p className="glass-max-w-xl glass-text-base glass-leading-relaxed glass-text-secondary">
        {description}
      </p>
    </div>
  );
}

function ProviderPreview() {
  return (
    <GlassEngineProviderComponent
      initialConfig={{
        blur: { base: 24, hover: 24, active: 16 },
        texture: { type: "liquid", intensity: 0.4, animated: false },
      }}
    >
      <AdaptiveGlassComponent
        environmentalAware={false}
        className="glass-border glass-border-white/20 glass-shadow-soft-xl"
        style={panelStyle}
      >
        <PanelCopy
          eyebrow="Context online"
          title="Adaptive material engine"
          description="The real provider supplies a canonical neutral glass configuration to this responsive child surface."
        />
      </AdaptiveGlassComponent>
    </GlassEngineProviderComponent>
  );
}

export const GlassEngine: Story = {
  name: "GlassEngine",
  render: () => (
    <StoryFrame>
      <GlassEngineComponent
        renderDemo={false}
        className="glass-w-full glass-max-w-3xl"
      >
        <AdaptiveGlassComponent
          environmentalAware={false}
          className="glass-border glass-border-white/20 glass-shadow-soft-xl"
          style={panelStyle}
        >
          <PanelCopy
            eyebrow="Unified runtime"
            title="GlassEngine"
            description="The public composition root is mounted with its own provider and an actual adaptive liquid-glass child."
          />
        </AdaptiveGlassComponent>
      </GlassEngineComponent>
    </StoryFrame>
  ),
};

export const GlassEngineProvider: Story = {
  name: "GlassEngineProvider",
  render: () => (
    <StoryFrame>
      <ProviderPreview />
    </StoryFrame>
  ),
};

export const AdaptiveGlass: Story = {
  name: "AdaptiveGlass",
  render: () => (
    <StoryFrame>
      <GlassEngineProviderComponent>
        <AdaptiveGlassComponent
          textureOverride="liquid"
          environmentalAware={false}
          className="glass-border glass-border-white/20 glass-shadow-soft-xl"
          style={panelStyle}
        >
          <PanelCopy
            eyebrow="Responsive surface"
            title="AdaptiveGlass"
            description="Pointer states change the material response while preserving the same neutral liquid-glass foundation."
          />
        </AdaptiveGlassComponent>
      </GlassEngineProviderComponent>
    </StoryFrame>
  ),
};

export const GlassOpacityEngine: Story = {
  name: "GlassOpacityEngine",
  render: () => (
    <StoryFrame>
      <GlassEngineProviderComponent>
        <GlassOpacityEngineComponent
          dynamicOpacity={false}
          opacityRange={[0.16, 0.24]}
          className="glass-border glass-border-white/20 glass-radius-3xl glass-shadow-soft-xl"
        >
          <div style={panelStyle}>
            <PanelCopy
              eyebrow="Controlled translucency"
              title="GlassOpacityEngine"
              description="A deterministic opacity range demonstrates the real engine without time- or scroll-dependent output."
            />
          </div>
        </GlassOpacityEngineComponent>
      </GlassEngineProviderComponent>
    </StoryFrame>
  ),
};

export const GlassColorTinting: Story = {
  name: "GlassColorTinting",
  render: () => (
    <StoryFrame>
      <GlassEngineProviderComponent>
        <GlassColorTintingComponent
          contentAware={false}
          tintColor="rgba(255, 255, 255, 0.16)"
          intensity={0.16}
          className="glass-border glass-border-white/20 glass-radius-3xl glass-shadow-soft-xl"
        >
          <div style={panelStyle}>
            <PanelCopy
              eyebrow="Neutral tint discipline"
              title="GlassColorTinting"
              description="The actual tinting export is constrained to a white-channel material so content color never contaminates the glass body."
            />
          </div>
        </GlassColorTintingComponent>
      </GlassEngineProviderComponent>
    </StoryFrame>
  ),
};

export const GlassTextureVariations: Story = {
  name: "GlassTextureVariations",
  render: () => (
    <StoryFrame>
      <GlassEngineProviderComponent>
        <GlassTextureVariationsComponent
          contentType="text"
          autoAdapt={false}
          className="glass-border glass-border-white/20 glass-radius-3xl glass-shadow-soft-xl"
        >
          <div style={panelStyle}>
            <PanelCopy
              eyebrow="Material texture"
              title="GlassTextureVariations"
              description="The text-oriented texture path is rendered directly with automatic mutation disabled for a stable visual baseline."
            />
          </div>
        </GlassTextureVariationsComponent>
      </GlassEngineProviderComponent>
    </StoryFrame>
  ),
};

export const EnvironmentalGlass: Story = {
  name: "EnvironmentalGlass",
  render: () => (
    <StoryFrame>
      <GlassEngineProviderComponent>
        <EnvironmentalGlassComponent
          weatherAPI={false}
          timeSync={false}
          className="glass-border glass-border-white/20 glass-radius-3xl glass-shadow-soft-xl"
        >
          <div style={panelStyle}>
            <PanelCopy
              eyebrow="Environment aware"
              title="EnvironmentalGlass"
              description="The real environmental surface runs with deterministic local conditions and no remote weather dependency."
            />
          </div>
        </EnvironmentalGlassComponent>
      </GlassEngineProviderComponent>
    </StoryFrame>
  ),
};

export const GlassEngineDemo: Story = {
  name: "GlassEngineDemo",
  render: () => (
    <StoryFrame>
      <div className="glass-w-full glass-max-w-5xl">
        <GlassEngineProviderComponent>
          <GlassEngineDemoComponent />
        </GlassEngineProviderComponent>
      </div>
    </StoryFrame>
  ),
};
