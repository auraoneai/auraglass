import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { GlassMorphingEngine as GlassMorphingEngineComponent } from "./GlassMorphingEngine";

const meta: Meta<typeof GlassMorphingEngineComponent> = {
  title: "Effects + Advanced/Glass Morphing Engine",
  component: GlassMorphingEngineComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A direct, deterministic rendering of GlassMorphingEngine using a restrained neutral adaptation state and a responsive liquid-glass surface.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GlassMorphingEngineComponent>;

const StoryFrame = ({ children }: { children: ReactNode }) => (
  <main
    style={{
      alignItems: "center",
      background:
        "radial-gradient(circle at 24% 12%, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.08) 36%), radial-gradient(circle at 78% 84%, rgba(212, 212, 216, 0.28), rgba(255, 255, 255, 0.08) 34%), linear-gradient(145deg, #fafafa 0%, #e7e7e7 100%)",
      boxSizing: "border-box",
      color: "rgba(15, 23, 42, 0.92)",
      display: "flex",
      justifyContent: "center",
      minHeight: "100dvh",
      overflow: "hidden",
      padding: "clamp(20px, 5vw, 64px)",
      width: "100%",
    }}
  >
    <div style={{ minWidth: 0, width: "min(720px, 100%)" }}>{children}</div>
  </main>
);

const LiquidGlassSpecimen = () => (
  <article
    className="glass-foundation-complete glass-contrast-guard"
    style={{
      WebkitBackdropFilter:
        "blur(32px) saturate(1.8) brightness(1.05) contrast(1.04)",
      backdropFilter:
        "blur(32px) saturate(1.8) brightness(1.05) contrast(1.04)",
      background:
        "linear-gradient(145deg, rgba(255, 255, 255, 0.32), rgba(255, 255, 255, 0.14))",
      border: "1px solid rgba(255, 255, 255, 0.32)",
      borderRadius: 32,
      boxShadow:
        "inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 24px 70px rgba(15, 23, 42, 0.14)",
      boxSizing: "border-box",
      minHeight: 360,
      overflow: "hidden",
      padding: "clamp(24px, 6vw, 52px)",
      width: "100%",
    }}
  >
    <p
      style={{
        color: "rgba(15, 23, 42, 0.72)",
        fontSize: 13,
        fontWeight: 650,
        letterSpacing: "0.12em",
        margin: 0,
        textTransform: "uppercase",
      }}
    >
      Adaptive clarity
    </p>
    <h2
      style={{
        color: "rgba(15, 23, 42, 0.92)",
        fontSize: "clamp(30px, 6vw, 56px)",
        letterSpacing: "-0.045em",
        lineHeight: 0.98,
        margin: "18px 0 20px",
        maxWidth: 520,
      }}
    >
      A material that responds quietly.
    </h2>
    <p
      style={{
        color: "rgba(15, 23, 42, 0.72)",
        fontSize: "clamp(15px, 2.4vw, 18px)",
        lineHeight: 1.55,
        margin: 0,
        maxWidth: 500,
      }}
    >
      Morphing remains subtle and content-led, with a neutral white channel,
      crisp perimeter highlights, and no opaque color wash.
    </p>
  </article>
);

export const GlassMorphingEngine: Story = {
  args: {
    children: null,
  },
  render: () => (
    <StoryFrame>
      <GlassMorphingEngineComponent
        adaptationSpeed={0}
        className="glass-foundation-complete"
        style={{
          boxShadow:
            "0 18px 42px -28px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
        }}
        contentType="text"
        enableRealTimeAdaptation={false}
        environmentalContext={{
          humidity: 0,
          lightLevel: 100,
          temperature: 20,
        }}
        intensity={0}
        userActivity="focused"
      >
        <LiquidGlassSpecimen />
      </GlassMorphingEngineComponent>
    </StoryFrame>
  ),
};
