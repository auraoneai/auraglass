import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { Glass3DEngine as Glass3DEngineComponent } from "./Glass3DEngine";

const meta: Meta<typeof Glass3DEngineComponent> = {
  title: "Effects + Advanced/Glass 3D Engine",
  component: Glass3DEngineComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A direct, deterministic rendering of Glass3DEngine with neutral depth layers and an accessible liquid-glass specimen.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Glass3DEngineComponent>;

const StoryFrame = ({ children }: { children: ReactNode }) => (
  <main
    style={{
      alignItems: "center",
      background:
        "radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.08) 34%), radial-gradient(circle at 82% 76%, rgba(212, 212, 216, 0.28), rgba(255, 255, 255, 0.08) 32%), linear-gradient(145deg, #fafafa 0%, #e7e7e7 100%)",
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
      Spatial material
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
      Depth without visual noise.
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
      Neutral layers preserve hierarchy, edge definition, and content clarity
      while the engine maintains a convincing three-dimensional field.
    </p>
  </article>
);

export const Glass3DEngine: Story = {
  args: {
    children: null,
  },
  render: () => (
    <StoryFrame>
      <Glass3DEngineComponent
        enableDepthOfField
        enableDistortion={false}
        enableHolographic={false}
        enableParallax={false}
        interactionTypes={[]}
        respectMotionPreference
      >
        <LiquidGlassSpecimen />
      </Glass3DEngineComponent>
    </StoryFrame>
  ),
};
