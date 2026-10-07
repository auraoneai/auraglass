import type { Meta, StoryObj } from "@storybook/react";
import { DisplayText } from "./DisplayText";

const meta: Meta<typeof DisplayText> = {
  title: "Marketing/Display Text",
  component: DisplayText,
  parameters: { layout: "padded" },
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3", "p", "span"] },
    size: { control: "select", options: ["hero", "section", "title", "label"] },
    gradient: {
      control: "select",
      options: [false, true, "aurora", "prism", "ocean", "ember"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DisplayText>;

export const HeroGradient: Story = {
  args: {
    as: "h1",
    size: "hero",
    gradient: "aurora",
    balance: true,
    children: "Hand-polished Liquid Glass interfaces",
  },
};

export const Label: Story = {
  args: {
    as: "p",
    size: "label",
    children: "Marketing Kit",
  },
};
