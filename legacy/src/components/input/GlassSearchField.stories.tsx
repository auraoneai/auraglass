import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassSearchField } from "./GlassSearchField";

const meta = {
  title: "Controls/Inputs/Glass Search Field",
  component: GlassSearchField,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
  args: {
    label: "Search projects",
    placeholder: "Name, owner, or tag",
    helperText: "Results update as you type.",
    fullWidth: true,
  },
} satisfies Meta<typeof GlassSearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

const SearchFieldExample = (
  props: React.ComponentProps<typeof GlassSearchField>
) => {
  const [value, setValue] = useState("Northstar");

  return (
    <div style={{ width: "min(480px, calc(100vw - 48px))" }}>
      <GlassSearchField
        {...props}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onClear={() => setValue("")}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <SearchFieldExample {...args} />,
};

export const Empty: Story = {
  render: (args) => (
    <div style={{ width: "min(480px, calc(100vw - 48px))" }}>
      <GlassSearchField {...args} defaultValue="" />
    </div>
  ),
};
