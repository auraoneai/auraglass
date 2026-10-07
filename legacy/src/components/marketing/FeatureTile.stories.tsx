import type { Meta, StoryObj } from "@storybook/react";
import { FeatureTile } from "./FeatureTile";

const meta: Meta<typeof FeatureTile> = {
  title: "Marketing/Feature Tile",
  component: FeatureTile,
  parameters: { layout: "padded" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    tone: {
      control: "select",
      options: ["neutral", "aurora", "success", "info", "warning"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof FeatureTile>;

export const Default: Story = {
  args: {
    index: "01",
    title: "Refractive depth",
    description: "Reusable marketing cards with package-owned token defaults.",
    tone: "aurora",
    visual: <div style={{ height: 80 }} />,
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
      {["SSR safe", "Reduced motion", "Token driven"].map((title, index) => (
        <FeatureTile
          key={title}
          index={index + 1}
          title={title}
          description="Built for package consumers and homepage composition."
          visual={<div style={{ height: 72 }} />}
        />
      ))}
    </div>
  ),
};
