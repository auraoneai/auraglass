import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassInfiniteScroll } from "./GlassInfiniteScroll";
import { cn } from "../../lib/utils";

const meta: Meta<typeof GlassInfiniteScroll> = {
  title: "Effects + Advanced/Glass Infinite Scroll",
  component: GlassInfiniteScroll,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism glassinfinitescroll component.",
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
type Story = StoryObj<typeof GlassInfiniteScroll>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-neutral-level1 glass-rounded-3xl glass-p-5 glass-box-border glass-overflow-auto">
      <GlassInfiniteScroll {...args} className="glass-h-64 glass-w-full">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="glass-rounded-lg glass-bg-white/70 glass-mb-2 glass-p-3 glass-text-sm glass-text-primary"
          >
            Row {i + 1}
          </div>
        ))}
      </GlassInfiniteScroll>
    </div>
  ),
  args: {
    className: "",
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassInfiniteScroll {...args}>Default</GlassInfiniteScroll>
    </div>
  ),
  args: {},
};
