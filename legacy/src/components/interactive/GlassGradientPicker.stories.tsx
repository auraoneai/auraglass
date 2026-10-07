import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassGradientPicker } from "./GlassGradientPicker";
import { fn } from "@storybook/test";

const meta: Meta<typeof GlassGradientPicker> = {
  title: "Effects + Advanced/Glass Gradient Picker",
  component: GlassGradientPicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism glassgradientpicker component.",
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "Current gradient CSS value",
    },
    presets: {
      control: "object",
      description: "Array of gradient presets",
    },
    enableCustom: {
      control: "boolean",
      description: "Whether to enable custom gradient creation",
    },
    showTypeSelector: {
      control: "boolean",
      description: "Whether to show gradient type selector",
    },
    showAngleControl: {
      control: "boolean",
      description: "Whether to show angle control for linear gradients",
    },
    showStopsEditor: {
      control: "boolean",
      description: "Whether to show color stops editor",
    },
    maxStops: {
      control: "number",
      description: "Maximum number of color stops",
    },
  },
  args: {
    value:
      "linear-gradient(45deg, rgba(255,255,255,.30) 0%, rgba(168,168,168,.22) 100%)",
    presets: [
      {
        id: "pearl",
        name: "Pearl",
        type: "linear",
        angle: 45,
        stops: [
          { color: "#ffffff", position: 0 },
          { color: "#e2e8f0", position: 50 },
          { color: "#94a3b8", position: 100 },
        ],
      },
      {
        id: "silver",
        name: "Silver",
        type: "linear",
        angle: 90,
        stops: [
          { color: "#f8fafc", position: 0 },
          { color: "#94a3b8", position: 100 },
        ],
      },
      {
        id: "graphite",
        name: "Graphite",
        type: "radial",
        stops: [
          { color: "#cbd5e1", position: 0 },
          { color: "#475569", position: 100 },
        ],
      },
    ],
    enableCustom: true,
    showTypeSelector: true,
    showAngleControl: true,
    showStopsEditor: true,
    maxStops: 5,
    contained: true,
    maxHeight: "min(760px, calc(100vh - 32px))",
    onChange: fn(),
    onPresetSelect: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof GlassGradientPicker>;

export const Default: Story = {
  args: {
    value: "linear-gradient(145deg, #ffffff 0%, #dfe4ea 100%)",
    presets: [
      {
        id: "pearl-default",
        name: "Pearl",
        type: "linear",
        angle: 45,
        stops: [
          { color: "#ffffff", position: 0 },
          { color: "#94a3b8", position: 100 },
        ],
      },
    ],
    onChange: fn(),
    onPresetSelect: fn(),
  },
};

export const Variants: Story = {
  args: {
    value: "radial-gradient(circle, #ff6b35 0%, #f7931e 50%, #ffd23f 100%)",
    presets: [
      {
        id: "radial-sun",
        name: "Radial Sun",
        type: "radial",
        stops: [
          { color: "#ff6b35", position: 0 },
          { color: "#f7931e", position: 50 },
          { color: "#ffd23f", position: 100 },
        ],
      },
      {
        id: "conic-spectrum",
        name: "Conic Spectrum",
        type: "conic",
        stops: [
          { color: "#ff0000", position: 0 },
          { color: "#00ff00", position: 33 },
          { color: "#0000ff", position: 66 },
          { color: "#ff0000", position: 100 },
        ],
      },
    ],
    enableCustom: true,
    showTypeSelector: true,
    showAngleControl: true,
    showStopsEditor: true,
    onChange: fn(),
    onPresetSelect: fn(),
  },
};
