import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassWipeSlider } from "./GlassWipeSlider";
import { cn } from "../../lib/utils";

const meta: Meta<typeof GlassWipeSlider> = {
  title: "Reference/Legacy Components/Glass Wipe Slider",
  component: GlassWipeSlider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "A glass morphism glasswipeslider component.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "className prop",
    },
    initialPosition: {
      control: { type: "range", min: 0, max: 100 },
      description: "initial position prop",
    },
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "orientation prop",
    },
  },
  args: {
    className: "",
    initialPosition: 50,
    orientation: "horizontal",
  },
};

export default meta;
type Story = StoryObj<typeof GlassWipeSlider>;

export const Default: Story = {
  render: (args) => (
    <div
      style={{
        width: "calc(100vw - 64px)",
        maxWidth: 760,
        minWidth: 0,
        margin: "auto",
      }}
    >
      <GlassWipeSlider {...args} />
    </div>
  ),
  args: {
    beforeContent: (
      <div
        className="glass-p-8 glass-text-center glass-radius-lg glass-flex glass-flex-col glass-items-center glass-justify-center"
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          paddingLeft: "56%",
          color: "rgba(22,27,34,.94)",
          background:
            "linear-gradient(145deg, rgba(252,253,254,.98), rgba(215,220,227,.96))",
        }}
      >
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide">
          Original
        </p>
        <h3 className="glass-text-xl glass-font-semibold glass-mb-2">
          Soft daylight
        </h3>
        <p className="glass-text-sm">Neutral tonal range before refinement</p>
      </div>
    ),
    afterContent: (
      <div
        className="glass-p-8 glass-text-center glass-radius-lg glass-flex glass-flex-col glass-items-center glass-justify-center"
        style={{
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          paddingRight: "56%",
          color: "rgba(22,27,34,.94)",
          background:
            "radial-gradient(circle at 25% 20%, rgba(255,255,255,.92), transparent 35%), linear-gradient(145deg, rgba(235,238,242,.98), rgba(181,188,198,.96))",
        }}
      >
        <p className="glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wide">
          Refined
        </p>
        <h3 className="glass-text-xl glass-font-semibold glass-mb-2">
          Sculpted glass
        </h3>
        <p className="glass-text-sm">Balanced highlights and material depth</p>
      </div>
    ),
    initialPosition: 50,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassWipeSlider {...args} />
    </div>
  ),
  args: {
    beforeContent: (
      <div className="glass-p-4 glass-text-center glass-surface-red/20 glass-radius-md">
        <span className="glass-text-sm">Before</span>
      </div>
    ),
    afterContent: (
      <div className="glass-p-4 glass-text-center glass-surface-green/20 glass-radius-md">
        <span className="glass-text-sm">After</span>
      </div>
    ),
    initialPosition: 30,
  },
};
