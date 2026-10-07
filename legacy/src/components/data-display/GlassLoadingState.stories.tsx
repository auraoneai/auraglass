import type { Meta, StoryObj } from "@storybook/react";
import { GlassLoadingState } from "./GlassLoadingState";

const meta = {
  title: "Data + Visualization/Glass Loading State",
  component: GlassLoadingState,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
  args: {
    label: "Preparing your workspace",
    description: "Applying permissions and loading the latest project data.",
    variant: "spinner",
  },
} satisfies Meta<typeof GlassLoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "min(620px, calc(100vw - 48px))" }}>
      <GlassLoadingState {...args} />
    </div>
  ),
};

export const Skeleton: Story = {
  args: {
    variant: "skeleton",
    label: "Loading activity",
    description: "Fetching the latest workspace changes.",
    rows: 4,
  },
  render: (args) => (
    <div style={{ width: "min(620px, calc(100vw - 48px))" }}>
      <GlassLoadingState {...args} />
    </div>
  ),
};

export const Progress: Story = {
  args: {
    variant: "progress",
    label: "Importing customer records",
    description: "3,840 of 5,200 records processed.",
    progress: 74,
  },
  render: (args) => (
    <div style={{ width: "min(620px, calc(100vw - 48px))" }}>
      <GlassLoadingState {...args} />
    </div>
  ),
};
