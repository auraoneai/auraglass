import type { Meta, StoryObj } from "@storybook/react";
import { AuroraOrb } from "./AuroraOrb";

const meta: Meta<typeof AuroraOrb> = {
  title: "Marketing/Aurora Orb",
  component: AuroraOrb,
  parameters: { layout: "centered" },
  argTypes: {
    palette: {
      control: "select",
      options: ["aurora", "prism", "ocean", "ember", "mono"],
    },
    glow: {
      control: "select",
      options: ["none", "subtle", "medium", "strong"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuroraOrb>;

export const Pulsing: Story = {
  args: {
    size: 280,
    pulse: true,
    glow: "strong",
  },
};

export const Static: Story = {
  args: {
    size: 220,
    pulse: false,
    glow: "subtle",
    palette: "ocean",
  },
};

export const ControlledTilt: Story = {
  args: {
    interactive: true,
    tiltX: 8,
    tiltY: -10,
    size: "18rem",
  },
};
