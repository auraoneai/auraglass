import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import DimensionalGlass from "./DimensionalGlass";

const meta: Meta<typeof DimensionalGlass> = {
  title: "Surfaces/Cards + Panels/Dimensional Glass",
  component: DimensionalGlass,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism dimensionalglass component.",
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
type Story = StoryObj<typeof DimensionalGlass>;

export const Default: Story = {
  render: (args) => (
    <DimensionalGlass
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
          Spatial surface
        </span>
        <strong style={{ color: "#0f172a", fontSize: 20, lineHeight: 1.2 }}>
          Dimensional clarity
        </strong>
        <span style={{ color: "#475569", fontSize: 14, lineHeight: 1.5 }}>
          Layered depth, restrained shadow, and a crisp luminous edge.
        </span>
      </div>
    </DimensionalGlass>
  ),
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <DimensionalGlass {...args}>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>Default</span>
      </DimensionalGlass>
    </div>
  ),
  args: {},
};
