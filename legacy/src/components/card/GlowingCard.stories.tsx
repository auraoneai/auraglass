import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlowingCard } from "./GlowingCard";

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 80% 15%, #ffffff 0%, rgba(255,255,255,0.08) 32%), linear-gradient(145deg, #f2f2f2, #d9d9d9)",
};

const meta = {
  title: "Surfaces/Cards + Panels/Glowing Card",
  component: GlowingCard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The real GlowingCard export with a white-channel edge glow that reinforces, rather than recolors, its liquid material.",
      },
    },
  },
} satisfies Meta<typeof GlowingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <GlowingCard
        variant="subtle"
        glowColor="rgba(255,255,255,0.95)"
        glowIntensity={0.32}
        animationDuration={4200}
        interactive
        aria-label="Neutral glowing liquid glass card"
        style={{ width: "min(440px, calc(100vw - 40px))" }}
      >
        <div className="glass-grid glass-gap-4 glass-p-2">
          <span className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide glass-text-tertiary">
            Precision edge
          </span>
          <h2 className="glass-text-3xl glass-font-semibold glass-text-primary">
            Light traces the material.
          </h2>
          <p className="glass-text-secondary glass-leading-relaxed">
            A restrained white-channel glow clarifies the boundary while the
            neutral glass surface keeps its surrounding context visible.
          </p>
        </div>
      </GlowingCard>
    </main>
  ),
};
