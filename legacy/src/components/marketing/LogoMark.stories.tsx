import type { Meta, StoryObj } from "@storybook/react";
import { LogoMark } from "./LogoMark";

const meta: Meta<typeof LogoMark> = {
  title: "Marketing/Logo Mark",
  component: LogoMark,
  parameters: { layout: "centered" },
  argTypes: {
    palette: {
      control: "select",
      options: ["aurora", "prism", "ocean", "ember", "mono"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LogoMark>;

export const Decorative: Story = {
  args: {
    size: 64,
  },
};

export const Labeled: Story = {
  args: {
    size: 96,
    label: "AuraGlass",
    animated: true,
  },
};
