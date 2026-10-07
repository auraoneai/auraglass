import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassTransitions } from "./GlassTransitions";

const frameStyle: CSSProperties = {
  minHeight: "100vh",
  width: "100%",
  display: "grid",
  placeItems: "center",
  padding: "clamp(20px, 5vw, 64px)",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.08) 34%), linear-gradient(145deg, #f5f5f5, #dddddd)",
  color: "rgba(15, 23, 42, 0.92)",
};

const meta: Meta = {
  title: "Foundations/Motion/Glass Transitions",
  component: GlassTransitions,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The actual composed GlassTransitions export with its page transition and swipeable card primitives.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <main style={frameStyle}>
      <GlassTransitions
        variant="liquid"
        className="glass-w-full glass-max-w-3xl"
        aria-label="Liquid glass transitions demonstration"
      />
    </main>
  ),
};
