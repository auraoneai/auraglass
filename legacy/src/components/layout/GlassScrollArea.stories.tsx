import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassScrollArea } from "./GlassScrollArea";
import { cn } from "../../lib/utils";

const meta: Meta<typeof GlassScrollArea> = {
  title: "Surfaces/App Shells + Layout/Glass Scroll Area",
  component: GlassScrollArea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism glassscrollarea component.",
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
    maxHeight: 240,
    maxWidth: 440,
    contained: true,
    showScrollbars: "always",
    children: (
      <div className="glass-flex glass-flex-col glass-gap-3 glass-p-4">
        {[
          "Design review",
          "Material calibration",
          "Accessibility pass",
          "Responsive proof",
          "Release notes",
          "Final approval",
        ].map((item, index) => (
          <div
            key={item}
            className="glass-radius-xl glass-border glass-p-4"
            style={{
              background: "rgba(255,255,255,0.22)",
              borderColor: "rgba(148,163,184,0.22)",
              color: "rgba(30,41,59,0.94)",
            }}
          >
            <div className="glass-text-sm glass-font-semibold">{item}</div>
            <div
              className="glass-mt-1 glass-text-xs"
              style={{ color: "rgba(71,85,105,0.88)" }}
            >
              Step {index + 1} of 6 · Liquid glass system checklist
            </div>
          </div>
        ))}
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof GlassScrollArea>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassScrollArea {...args}>Default</GlassScrollArea>
    </div>
  ),
  args: {},
};
