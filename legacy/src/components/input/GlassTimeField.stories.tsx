import type { Meta, StoryObj } from "@storybook/react";
import { GlassTimeField } from "./GlassTimeField";

const meta = {
  title: "Controls/Inputs/Glass Time Field",
  component: GlassTimeField,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
  args: {
    label: "Publish time",
    defaultValue: "09:30",
    helperText: "Pacific Time (UTC−07:00)",
    fullWidth: true,
  },
} satisfies Meta<typeof GlassTimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "min(420px, calc(100vw - 48px))" }}>
      <GlassTimeField {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div style={{ width: "min(420px, calc(100vw - 48px))" }}>
      <GlassTimeField {...args} />
    </div>
  ),
};
