import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassTabItem as Component } from "./GlassTabItem";

const meta = {
  title: 'Navigation/Glass Tab Item',
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component-owned Storybook coverage for GlassTabItem.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Overview",
    value: "overview",
  },
  render: () => (
    <div
      role="tablist"
      className="glass-flex glass-gap-2 glass-p-3 glass-radius-lg glass-surface-subtle"
    >
      <Component label="Overview" value="overview" active badge="1" />
      <Component label="Settings" value="settings" />
    </div>
  ),
};
