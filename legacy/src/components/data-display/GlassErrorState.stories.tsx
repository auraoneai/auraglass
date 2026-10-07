import type { Meta, StoryObj } from "@storybook/react";
import { GlassErrorState } from "./GlassErrorState";

const meta = {
  title: "Data + Visualization/Glass Error State",
  component: GlassErrorState,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
  args: {
    title: "Analytics are temporarily unavailable",
    description:
      "We could not refresh this workspace. Your existing data is safe.",
    retryLabel: "Try again",
    onRetry: () => undefined,
    details: "Request ID: AG-1048 · Last successful sync: 2 minutes ago",
  },
} satisfies Meta<typeof GlassErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "min(620px, calc(100vw - 48px))" }}>
      <GlassErrorState {...args} />
    </div>
  ),
};

export const Warning: Story = {
  args: {
    severity: "warning",
    title: "Some metrics may be delayed",
    description: "The latest warehouse sync is still processing.",
    details: undefined,
  },
  render: (args) => (
    <div style={{ width: "min(620px, calc(100vw - 48px))" }}>
      <GlassErrorState {...args} />
    </div>
  ),
};
