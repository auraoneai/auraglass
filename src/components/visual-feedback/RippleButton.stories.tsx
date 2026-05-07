import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Check, CloudUpload, Trash2, Zap } from "lucide-react";
import RippleButton from "./RippleButton";

const meta: Meta<typeof RippleButton> = {
  title: 'Controls/Inputs/Ripple Button',
  component: RippleButton,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass button with pointer ripple feedback for high-confidence actions.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "ghost", "outline", "destructive"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    loading: { control: "boolean" },
    centerRipple: { control: "boolean" },
  },
  args: {
    variant: "primary",
    size: "md",
    loading: false,
    centerRipple: false,
    rippleColor: "white",
  },
};

export default meta;
type Story = StoryObj<typeof RippleButton>;

export const Default: Story = {
  render: (args) => (
    <RippleButton {...args}>
      <CloudUpload size={16} aria-hidden="true" />
      Upload changes
    </RippleButton>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div
      className="glass-grid glass-gap-3"
      style={{ width: "min(680px, calc(100vw - 64px))" }}
    >
      <div className="glass-grid glass-grid-cols-1 sm:glass-grid-cols-2 glass-gap-3">
        <RippleButton {...args} variant="primary" rippleColor="primary">
          <Check size={16} aria-hidden="true" />
          Approve
        </RippleButton>
        <RippleButton {...args} variant="secondary" rippleColor="secondary">
          <Zap size={16} aria-hidden="true" />
          Optimize
        </RippleButton>
        <RippleButton {...args} variant="outline" rippleColor="info">
          Review
        </RippleButton>
        <RippleButton {...args} variant="destructive" rippleColor="error">
          <Trash2 size={16} aria-hidden="true" />
          Delete
        </RippleButton>
      </div>
      <p className="glass-text-sm glass-text-secondary">
        Variants use valid GlassButton variants, so the ripple layer no longer
        passes an unsupported danger value into the glass lighting config.
      </p>
    </div>
  ),
};

export const CenterRipple: Story = {
  args: {
    children: "Centered ripple",
    centerRipple: true,
    variant: "outline",
  },
};
