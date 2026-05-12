import type { Meta, StoryObj } from "@storybook/react";
import { AuroraBackground } from "./AuroraBackground";
import { DisplayText } from "./DisplayText";

const meta: Meta<typeof AuroraBackground> = {
  title: "Marketing/Aurora Background",
  component: AuroraBackground,
  parameters: { layout: "fullscreen" },
  argTypes: {
    palette: {
      control: "select",
      options: ["aurora", "prism", "ocean", "ember", "mono"],
    },
    intensity: {
      control: "select",
      options: ["subtle", "medium", "strong"],
    },
    motion: {
      control: "select",
      options: ["none", "subtle", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuroraBackground>;

export const Contained: Story = {
  args: {
    particles: 24,
    grain: true,
    vignette: true,
    seed: "storybook-contained",
  },
  render: (args) => (
    <section style={{ position: "relative", minHeight: 520, overflow: "hidden", padding: 48 }}>
      <AuroraBackground {...args} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
        <DisplayText as="h1" size="hero" gradient="aurora">
          Liquid Glass marketing surfaces
        </DisplayText>
      </div>
    </section>
  ),
};

export const ReducedMotion: Story = {
  args: {
    particles: 12,
    reducedMotion: true,
    grain: true,
    vignette: true,
    seed: "storybook-reduced",
  },
};
