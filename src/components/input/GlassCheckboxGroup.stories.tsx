import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Bell, Database, ShieldCheck, Users } from "lucide-react";
import { GlassCheckboxGroup } from "./GlassCheckboxGroup";

const options = [
  {
    value: "audience",
    label: "Audience alerts",
    description: "Notify workspace owners when high-value segments change.",
    icon: <Users size={18} />,
  },
  {
    value: "delivery",
    label: "Delivery monitoring",
    description: "Track pacing, throttling, and error budgets.",
    icon: <Bell size={18} />,
  },
  {
    value: "data",
    label: "Data sync",
    description: "Surface warehouse refresh and schema events.",
    icon: <Database size={18} />,
  },
  {
    value: "security",
    label: "Security review",
    description: "Require approval for permission-sensitive changes.",
    icon: <ShieldCheck size={18} />,
  },
];

const InteractiveGroup = (
  args: React.ComponentProps<typeof GlassCheckboxGroup>
) => {
  const [value, setValue] = useState<string[]>(
    args.value ?? ["audience", "data"]
  );

  return (
    <div style={{ width: "min(720px, calc(100vw - 64px))" }}>
      <GlassCheckboxGroup {...args} value={value} onChange={setValue} />
    </div>
  );
};

const meta = {
  title: 'Controls/Inputs/Glass Checkbox Group',
  component: GlassCheckboxGroup,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A styled glass checkbox group for multi-select preferences and form sections.",
      },
    },
  },
  args: {
    label: "Operational notifications",
    description: "Select the alert categories this workspace should receive.",
    options,
    value: ["audience", "data"],
    variant: "info",
    size: "md",
    orientation: "vertical",
    maxSelections: 3,
  },
} satisfies Meta<typeof GlassCheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <InteractiveGroup {...args} />,
};

export const Horizontal: Story = {
  args: {
    label: "Review gates",
    description: "A compact horizontal layout for short option sets.",
    options: options.slice(0, 3),
    value: ["delivery"],
    orientation: "horizontal",
    maxSelections: undefined,
  },
  render: (args) => <InteractiveGroup {...args} />,
};
