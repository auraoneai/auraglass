import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassStepper as Component } from "./GlassStepper";

const meta = {
  title: "Components/Input/GlassStepper",
  component: Component,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component-owned Storybook coverage for GlassStepper.",
      },
    },
  },
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Component
      label="Glass intensity"
      description="Adjust the certification sample intensity."
      defaultValue={4}
      min={0}
      max={10}
      step={1}
    />
  ),
};
