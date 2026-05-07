import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Building2 } from "lucide-react";
import { GlassSelect } from "./GlassSelect";

const options = [
  { value: "startup", label: "Startup workspace" },
  { value: "growth", label: "Growth team" },
  { value: "enterprise", label: "Enterprise program" },
  { value: "partner", label: "Partner operations" },
];

const meta: Meta<typeof GlassSelect> = {
  title: 'Controls/Inputs/Glass Select',
  component: GlassSelect,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass select field with searchable, multi-select, and validation states.",
      },
    },
  },
  args: {
    label: "Workspace segment",
    placeholder: "Choose a segment",
    options,
    helperText: "Segments tune navigation and reporting defaults.",
    leftIcon: <Building2 size={16} />,
    fullWidth: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSelect>;

const SelectFrame = (args: ComponentProps<typeof GlassSelect>) => (
  <div className="glass-grid glass-w-[min(640px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
    <GlassSelect {...args} />
    <div className="glass-grid glass-gap-3 md:glass-grid-cols-2">
      <GlassSelect label="Region" placeholder="Select region" options={[{ value: "na", label: "North America" }, { value: "eu", label: "Europe" }, { value: "apac", label: "Asia Pacific" }]} variant="filled" fullWidth />
      <GlassSelect label="Approval lane" placeholder="Select lane" options={[{ value: "fast", label: "Fast track" }, { value: "standard", label: "Standard review" }]} state="warning" helperText="Review is required for external launches." fullWidth />
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => <SelectFrame {...args} />,
};

export const Searchable: Story = {
  args: {
    searchable: true,
    placeholder: "Search workspace segment",
  },
  render: (args) => <SelectFrame {...args} />,
};
