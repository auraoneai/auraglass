import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Folder, LayoutDashboard, Shield, Users } from "@/icons";
import { GlassTreeSelect, type TreeNode } from "./GlassTreeSelect";

const data: TreeNode[] = [
  {
    id: "workspace",
    label: "Workspace",
    icon: <Folder size={16} />,
    children: [
      {
        id: "overview",
        label: "Overview",
        icon: <LayoutDashboard size={16} />,
      },
      { id: "audiences", label: "Audiences", icon: <Users size={16} /> },
    ],
  },
  {
    id: "governance",
    label: "Governance",
    icon: <Shield size={16} />,
    children: [
      { id: "roles", label: "Roles" },
      { id: "audit", label: "Audit log" },
      { id: "policies", label: "Policies" },
    ],
  },
];

const InteractiveTreeSelect = (
  args: React.ComponentProps<typeof GlassTreeSelect>
) => {
  const [value, setValue] = useState<(string | number)[]>(
    args.value ?? ["overview", "roles"]
  );

  return (
    <div
      style={{
        width: "min(420px, calc(100vw - 48px))",
        minHeight: 420,
        display: "grid",
        alignItems: "start",
      }}
    >
      <GlassTreeSelect {...args} value={value} onChange={setValue} />
    </div>
  );
};

const meta = {
  title: 'Controls/Inputs/Glass Tree Select',
  component: GlassTreeSelect,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A searchable glass tree select for hierarchical navigation, permissions, and taxonomy fields.",
      },
    },
  },
  args: {
    data,
    value: ["overview", "roles"],
    placeholder: "Select workspace areas",
    multiple: true,
    searchable: true,
    searchPlaceholder: "Search areas...",
    showCheckbox: true,
    defaultExpanded: true,
    maxHeight: "280px",
  },
} satisfies Meta<typeof GlassTreeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <InteractiveTreeSelect {...args} />,
};

export const SingleSelect: Story = {
  args: {
    multiple: false,
    showCheckbox: false,
    value: ["audit"],
    placeholder: "Choose destination",
  },
  render: (args) => <InteractiveTreeSelect {...args} />,
};
