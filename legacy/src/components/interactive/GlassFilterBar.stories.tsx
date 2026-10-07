import type { Meta, StoryObj } from "@storybook/react";

import { GlassButton } from "../button/GlassButton";
import { GlassFilterBar } from "./GlassFilterBar";

const meta = {
  title: "Controls/Filtering/Glass Filter Bar",
  component: GlassFilterBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Direct coverage of the filter-summary surface, removable filter chips, clear action, and trailing actions.",
      },
    },
  },
  args: {
    label: "Active filters",
    filters: [
      { id: "status", label: "Status", value: "Open" },
      { id: "owner", label: "Owner", value: "Design" },
      { id: "period", label: "Period", value: "This week" },
    ],
    onClear: () => undefined,
  },
} satisfies Meta<typeof GlassFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "min(44rem, calc(100vw - 32px))", maxWidth: "100%" }}>
      <GlassFilterBar
        {...args}
        actions={<GlassButton size="sm">Apply</GlassButton>}
      />
    </div>
  ),
};
