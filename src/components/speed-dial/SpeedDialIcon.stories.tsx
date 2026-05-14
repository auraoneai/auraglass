import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Minus, Plus } from "@/icons";
import SpeedDialIcon from "./SpeedDialIcon";

const meta: Meta<typeof SpeedDialIcon> = {
  title: 'Controls/Buttons/Speed Dial Icon',
  component: SpeedDialIcon,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The speed-dial icon transition between closed and open action states.",
      },
    },
  },
  args: {
    icon: <Plus size={24} aria-hidden="true" />,
    openIcon: <Minus size={24} aria-hidden="true" />,
    open: false,
  },
};

export default meta;
type Story = StoryObj<typeof SpeedDialIcon>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-blue glass-text-primary">
      <SpeedDialIcon {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <div className="glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-blue glass-text-primary">
        <SpeedDialIcon {...args} open={false} />
      </div>
      <div className="glass-inline-flex glass-h-14 glass-w-14 glass-items-center glass-justify-center glass-radius-full glass-surface-overlay glass-text-primary">
        <SpeedDialIcon {...args} open />
      </div>
    </div>
  ),
};
