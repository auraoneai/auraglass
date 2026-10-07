import { useEffect, type CSSProperties, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ColorAdaptationDemo as ColorAdaptationDemoComponent,
  IntelligentColorProvider as IntelligentColorProviderComponent,
  IntelligentColorSystem as IntelligentColorSystemComponent,
  useIntelligentColor,
} from "./IntelligentColorSystem";

const meta = {
  title: "AI + Intelligence/Intelligent Color System",
  component: IntelligentColorSystemComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct stories for every visual IntelligentColorSystem export, mounted on neutral liquid glass with no surrogate showcase layer.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof IntelligentColorSystemComponent>;

export default meta;
type Story = StoryObj;

const stageStyle: CSSProperties = {
  boxSizing: "border-box",
  display: "grid",
  minHeight: "100vh",
  minWidth: 0,
  padding: "clamp(20px, 6vw, 72px)",
  placeItems: "center",
  width: "100%",
};

function StoryStage({ children }: { children: ReactNode }) {
  return (
    <div style={stageStyle}>
      <div style={{ minWidth: 0, width: "min(100%, 760px)" }}>{children}</div>
    </div>
  );
}

function DeterministicNeutralPalette({ children }: { children: ReactNode }) {
  const { adaptToPalette, updateConfig } = useIntelligentColor();

  useEffect(() => {
    updateConfig({
      seasonalAdaptation: false,
      timeBasedShifts: false,
    });

    const animationFrame = window.requestAnimationFrame(() => {
      adaptToPalette({
        brightness: 0.45,
        contrast: 0.72,
        dominantColors: ["#737373"],
        mood: "calm",
        saturation: 0,
        temperature: "neutral",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [adaptToPalette, updateConfig]);

  return children;
}

function ProviderPreview() {
  return (
    <IntelligentColorProviderComponent>
      <DeterministicNeutralPalette>
        <section className="glass-foundation-complete glass-radius-3xl glass-p-8 glass-shadow-soft-xl">
          <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
            Adaptive palette context
          </p>
          <h2 className="glass-mt-2 glass-text-3xl glass-font-semibold glass-text-primary">
            Material stays neutral
          </h2>
          <p className="glass-mt-3 glass-max-w-xl glass-text-base glass-leading-relaxed glass-text-secondary">
            Color intelligence is available to descendants while the supporting
            surface remains clear, restrained liquid glass.
          </p>
        </section>
      </DeterministicNeutralPalette>
    </IntelligentColorProviderComponent>
  );
}

export const IntelligentColorSystem: Story = {
  name: "IntelligentColorSystem",
  render: () => (
    <StoryStage>
      <IntelligentColorSystemComponent className="glass-w-full">
        <DeterministicNeutralPalette>
          <ColorAdaptationDemoComponent />
        </DeterministicNeutralPalette>
      </IntelligentColorSystemComponent>
    </StoryStage>
  ),
};

export const IntelligentColorProvider: Story = {
  name: "IntelligentColorProvider",
  render: () => (
    <StoryStage>
      <ProviderPreview />
    </StoryStage>
  ),
};

export const ColorAdaptationDemo: Story = {
  name: "ColorAdaptationDemo",
  render: () => (
    <StoryStage>
      <IntelligentColorProviderComponent>
        <DeterministicNeutralPalette>
          <ColorAdaptationDemoComponent />
        </DeterministicNeutralPalette>
      </IntelligentColorProviderComponent>
    </StoryStage>
  ),
};
