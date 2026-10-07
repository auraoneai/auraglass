import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { GlassPhysicsEngine as GlassPhysicsEngineComponent } from "./GlassPhysicsEngine";

const meta: Meta<typeof GlassPhysicsEngineComponent> = {
  title: "Effects + Advanced/Glass Physics Engine",
  component: GlassPhysicsEngineComponent,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A direct rendering of GlassPhysicsEngine around a bounded liquid-glass surface, with deterministic visual state for cross-viewport certification.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GlassPhysicsEngineComponent>;

const StoryFrame = ({ children }: { children: ReactNode }) => (
  <main
    style={{
      alignItems: "center",
      background:
        "radial-gradient(circle at 20% 16%, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.08) 35%), radial-gradient(circle at 82% 78%, rgba(212, 212, 216, 0.28), rgba(255, 255, 255, 0.08) 33%), linear-gradient(145deg, #fafafa 0%, #e7e7e7 100%)",
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
      Physical response
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
      Responsive, bounded, and precise.
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
      The physics layer remains clipped to its material, preserving legibility
      and clean geometry at desktop, tablet, and mobile widths.
    </p>
  </article>
);

export const GlassPhysicsEngine: Story = {
  args: {
    children: null,
  },
  render: () => (
    <StoryFrame>
      <GlassPhysicsEngineComponent
        enabled={false}
        interaction="ripple"
        respectMotionPreference
        tabIndex={-1}
      >
        <LiquidGlassSpecimen />
      </GlassPhysicsEngineComponent>
    </StoryFrame>
  ),
};
