import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassSpotlight } from "./GlassSpotlight";
import { fn } from "@storybook/test";

const meta: Meta<typeof GlassSpotlight> = {
  title: "Effects + Advanced/Glass Spotlight",
  component: GlassSpotlight,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism glassspotlight component.",
      },
    },
  },
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof GlassSpotlight>;

export const Default: Story = {
  render: (args) => (
    <div
      className="glass-neutral-level1 glass-rounded-3xl glass-p-4 glass-w-full glass-min-w-0"
      style={{ width: "min(620px, calc(100vw - 32px))" }}
    >
      <GlassSpotlight {...args} contained preview height={320}>
        <div className="glass-relative glass-z-0 glass-flex glass-h-full glass-flex-col glass-gap-4 glass-p-5 glass-text-primary">
          <div>
            <p className="glass-m-0 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-wider glass-text-secondary">
              Guided focus
            </p>
            <h2 className="glass-mt-1 glass-text-xl glass-font-semibold">
              Choose the next action
            </h2>
          </div>
          <div className="glass-neutral-level1 glass-radius-2xl glass-p-4 glass-shadow-sm">
            <p className="glass-m-0 glass-font-medium">
              Continue your workspace
            </p>
            <p className="glass-mt-1 glass-text-sm glass-text-secondary">
              The highlighted surface keeps the next step clear without hiding
              context.
            </p>
          </div>
          <div className="glass-mt-auto glass-flex glass-flex-wrap glass-gap-3">
            <span className="glass-neutral-level1 glass-radius-full glass-px-4 glass-py-2 glass-text-sm">
              Review
            </span>
            <span className="glass-neutral-level1 glass-radius-full glass-px-4 glass-py-2 glass-text-sm">
              Continue
            </span>
          </div>
        </div>
      </GlassSpotlight>
    </div>
  ),
  args: {
    targetRect: new DOMRect(20, 92, 560, 108),
    onClose: fn(),
  },
};

export const LargeTarget: Story = {
  args: {
    targetRect: new DOMRect(50, 50, 300, 200),
    onClose: fn(),
  },
};
