import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import {
  GlassCombobox,
  type GlassComboboxOption,
} from "./GlassCombobox";

const OPTIONS: GlassComboboxOption[] = [
  { value: "design", label: "Design systems", group: "Product" },
  { value: "growth", label: "Growth analytics", group: "Product" },
  { value: "operations", label: "Revenue operations", group: "Business" },
  {
    value: "archived",
    label: "Archived workspace",
    group: "Business",
    disabled: true,
  },
];

const meta = {
  title: "Controls/Inputs/Glass Combobox",
  component: GlassCombobox,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
  args: {
    label: "Destination workspace",
    placeholder: "Search workspaces",
    options: OPTIONS,
    defaultValue: "design",
  },
} satisfies Meta<typeof GlassCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const ComboboxExample = (props: React.ComponentProps<typeof GlassCombobox>) => {
  const [value, setValue] = useState(props.defaultValue ?? "");

  return (
    <div style={{ width: "min(420px, calc(100vw - 48px))" }}>
      <GlassCombobox
        {...props}
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ComboboxExample {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};

export const EmptyResults: Story = {
  args: {
    options: [],
    defaultValue: undefined,
    emptyText: "No matching workspaces",
  },
  render: (args) => <ComboboxExample {...args} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("combobox"));
  },
};
