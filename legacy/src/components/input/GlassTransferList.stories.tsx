import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Code2, Database, Gauge, ShieldCheck, Users } from "@/icons";
import { GlassTransferList, type TransferListItem } from "./GlassTransferList";

const items: TransferListItem[] = [
  {
    id: "audience",
    label: "Audience insights",
    description: "Segment growth, churn, and overlap signals",
    icon: <Users size={16} />,
  },
  {
    id: "performance",
    label: "Performance metrics",
    description: "Delivery, pacing, conversion, and spend",
    icon: <Gauge size={16} />,
  },
  {
    id: "warehouse",
    label: "Warehouse sync",
    description: "Freshness, lineage, and schema health",
    icon: <Database size={16} />,
  },
  {
    id: "security",
    label: "Security posture",
    description: "Permissions, audit trails, and policy status",
    icon: <ShieldCheck size={16} />,
  },
  {
    id: "developer",
    label: "Developer events",
    description: "Deployments, webhooks, and API errors",
    icon: <Code2 size={16} />,
  },
];

const InteractiveTransferList = (
  args: React.ComponentProps<typeof GlassTransferList>
) => {
  const [value, setValue] = useState<(string | number)[]>(
    args.value ?? ["audience", "performance"]
  );

  return (
    <div style={{ width: "min(940px, calc(100vw - 64px))" }}>
      <GlassTransferList {...args} value={value} onChange={setValue} />
    </div>
  );
};

const meta = {
  title: 'Controls/Inputs/Glass Transfer List',
  component: GlassTransferList,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A dual-list glass transfer control for assigning available items to a selected set.",
      },
    },
  },
  args: {
    items,
    value: ["audience", "performance"],
    leftTitle: "Available modules",
    rightTitle: "Dashboard modules",
    leftSearchPlaceholder: "Search modules...",
    rightSearchPlaceholder: "Search dashboard...",
    minHeight: "300px",
    maxHeight: "360px",
    searchable: true,
  },
} satisfies Meta<typeof GlassTransferList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <InteractiveTransferList {...args} />,
};

export const CompactPicker: Story = {
  args: {
    minHeight: "230px",
    maxHeight: "260px",
    value: ["warehouse"],
    leftTitle: "Integrations",
    rightTitle: "Enabled",
  },
  render: (args) => <InteractiveTransferList {...args} />,
};
