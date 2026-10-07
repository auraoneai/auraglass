import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FrostedGlass from "./FrostedGlass";

const meta: Meta<typeof FrostedGlass> = {
  title: "Surfaces/Cards + Panels/Frosted Glass",
  component: FrostedGlass,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism frostedglass component.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "className prop",
    },
  },
  args: {
    className: "",
  },
};

export default meta;
type Story = StoryObj<typeof FrostedGlass>;

export const Default: Story = {
  render: (args) => (
    <FrostedGlass
      {...args}
      fullWidth
      interactive={false}
      style={{ width: "min(320px, calc(100vw - 48px))" }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <span
          style={{
            color: "#475569",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Frosted material
        </span>
        <strong style={{ color: "#0f172a", fontSize: 20, lineHeight: 1.2 }}>
          Soft diffusion
        </strong>
        <span style={{ color: "#475569", fontSize: 14, lineHeight: 1.5 }}>
          Fine texture and gentle specular light preserve content clarity.
        </span>
      </div>
    </FrostedGlass>
  ),
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <FrostedGlass {...args}>Default</FrostedGlass>
    </div>
  ),
  args: {},
};
