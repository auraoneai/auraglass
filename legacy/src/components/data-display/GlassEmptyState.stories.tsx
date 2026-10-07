import type { Meta, StoryObj } from "@storybook/react";
import { GlassEmptyState } from "./GlassEmptyState";

const meta = {
  title: "Data + Visualization/Glass Empty State",
  component: GlassEmptyState,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
  args: {
    title: "No launch plans yet",
    description:
      "Create your first plan to coordinate owners, milestones, and release notes.",
    primaryAction: { label: "Create launch plan" },
    secondaryAction: { label: "View a template", href: "#templates" },
  },
} satisfies Meta<typeof GlassEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "min(680px, calc(100vw - 48px))" }}>
      <GlassEmptyState {...args} />
    </div>
  ),
};

export const SearchResults: Story = {
  args: {
    variant: "search",
    title: "No matching projects",
    description: "Try a shorter query or remove one of the active filters.",
    primaryAction: { label: "Clear filters" },
    secondaryAction: undefined,
  },
  render: (args) => (
    <div style={{ width: "min(680px, calc(100vw - 48px))" }}>
      <GlassEmptyState {...args} />
    </div>
  ),
};
