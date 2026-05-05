import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassErrorBoundary as Component } from "./GlassErrorBoundary";

const meta = {
  title: "Components/misc/GlassErrorBoundary",
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component-owned Storybook coverage for GlassErrorBoundary.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Component className="glass-p-4">
      <div className="glass glass-p-4 glass-radius-lg">
        <strong>GlassErrorBoundary protected content</strong>
        <p className="glass-text-sm glass-text-secondary">
          Component-owned story coverage sample.
        </p>
      </div>
    </Component>
  ),
};
