import type { Meta, StoryObj } from "@storybook/react";
import { GlassDateField } from "./GlassDateField";

const meta = {
  title: "Controls/Inputs/Glass Date Field",
  component: GlassDateField,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
  args: {
    label: "Launch date",
    defaultValue: "2026-09-18",
    helperText: "Dates use your current workspace time zone.",
    fullWidth: true,
  },
} satisfies Meta<typeof GlassDateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: "min(420px, calc(100vw - 48px))" }}>
      <GlassDateField {...args} />
    </div>
  ),
};

export const Required: Story = {
  args: {
    required: true,
    "aria-required": true,
  },
  render: (args) => (
    <div style={{ width: "min(420px, calc(100vw - 48px))" }}>
      <GlassDateField {...args} />
    </div>
  ),
};
