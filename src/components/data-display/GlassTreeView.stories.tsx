import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassTreeView as Component } from "./GlassTreeView";

const meta = {
  title: "Components/Data Display/GlassTreeView",
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component-owned Storybook coverage for GlassTreeView.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Component
      data={[
        {
          id: "overview",
          label: "Overview",
          children: [{ id: "metrics", label: "Metrics" }],
        },
        {
          id: "settings",
          label: "Settings",
          children: [{ id: "tokens", label: "Tokens" }],
        },
      ]}
      defaultExpandedIds={["overview"]}
      selectionMode="single"
      showLines
      showIcons
    />
  ),
};
