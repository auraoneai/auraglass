import type { Meta, StoryObj } from "@storybook/react";
import { ShowcaseCard } from "./ShowcaseCard";
import { DisplayText } from "./DisplayText";

const meta: Meta<typeof ShowcaseCard> = {
  title: "Marketing/Showcase Card",
  component: ShowcaseCard,
  parameters: { layout: "centered" },
  argTypes: {
    intensity: { control: "select", options: ["subtle", "medium", "strong"] },
    glow: { control: "select", options: ["none", "subtle", "aurora"] },
    radius: { control: "select", options: ["md", "lg", "xl"] },
    padding: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof ShowcaseCard>;

export const Default: Story = {
  args: {
    intensity: "medium",
    glow: "aurora",
    interactive: true,
    children: (
      <div style={{ width: 320 }}>
        <DisplayText as="h3" size="title">
          Showcase surface
        </DisplayText>
        <p>Polished glass for landing pages, galleries, and launch surfaces.</p>
      </div>
    ),
  },
};

export const Floating: Story = {
  args: {
    floating: true,
    highlight: true,
    padding: "lg",
    children: "Floating hero card",
  },
};
