import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassVirtualTable } from "./GlassVirtualTable";
import { cn } from "../../lib/utils";

const meta: Meta<typeof GlassVirtualTable> = {
  title: "Data + Visualization/Glass Virtual Table",
  component: GlassVirtualTable,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A glass morphism glassvirtualtable component.",
      },
    },
  },
  argTypes: {
    className: {
      control: "text",
      description: "className prop",
    },
    children: {
      control: "text",
      description: "children prop",
    },
    disabled: {
      control: "boolean",
      description: "disabled prop",
    },
  },
  args: {
    className: "",
    disabled: false,
    searchable: false,
    pagination: false,
    columns: [
      { id: "name", header: "Name", accessorKey: "name" },
      { id: "status", header: "Status", accessorKey: "status" },
      { id: "updated", header: "Updated", accessorKey: "updated" },
    ],
    rows: [
      {
        id: "aurora",
        name: "Aurora workspace",
        status: "Ready",
        updated: "2 min ago",
      },
      {
        id: "meridian",
        name: "Meridian research",
        status: "Review",
        updated: "18 min ago",
      },
      {
        id: "foundry",
        name: "Foundry systems",
        status: "Ready",
        updated: "1 hr ago",
      },
      {
        id: "helios",
        name: "Helios launch",
        status: "Draft",
        updated: "Yesterday",
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassVirtualTable>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div className="glass-flex glass-flex-wrap glass-gap-4">
      <GlassVirtualTable {...args}>Default</GlassVirtualTable>
    </div>
  ),
  args: {
    children: null,
  },
};
