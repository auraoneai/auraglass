import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ImageListItemBar } from "./ImageListItemBar";
import { cn } from "../../lib/utils";

const meta: Meta<typeof ImageListItemBar> = {
  title: "Media/Image List Item Bar",
  component: ImageListItemBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism imagelistitembar component.",
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
type Story = StoryObj<typeof ImageListItemBar>;

export const Default: Story = {
  render: (args) => (
    <div
      className="glass-neutral-level1 glass-rounded-3xl glass-p-6 glass-relative glass-w-full glass-min-h-32"
      style={{ width: "min(560px, calc(100vw - 64px))" }}
    >
      <ImageListItemBar
        {...args}
        title="Campaign hero"
        subtitle="Assets • 24"
      />
    </div>
  ),
  args: {
    className: "",
  },
};

export const Variants: Story = {
  render: (args: any) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <ImageListItemBar {...args}>Default</ImageListItemBar>
    </div>
  ),
  args: {},
};
