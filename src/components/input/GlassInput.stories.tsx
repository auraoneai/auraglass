import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Check, Mail, Search, UserRound } from "lucide-react";
import { GlassInput } from "./GlassInput";

const meta: Meta<typeof GlassInput> = {
  title: 'Controls/Inputs/Glass Input',
  component: GlassInput,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass text input with icons, helper text, validation, and liquid material support.",
      },
    },
  },
  args: {
    label: "Workspace name",
    placeholder: "Revenue operations",
    helperText: "Used in navigation, reports, and shared links.",
    size: "md",
    variant: "default",
    fullWidth: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassInput>;

const InputFrame = (args: ComponentProps<typeof GlassInput>) => {
  const [value, setValue] = useState("");

  return (
    <div className="glass-grid glass-w-[min(640px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassInput
        {...args}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <div className="glass-grid glass-gap-3 md:glass-grid-cols-2">
        <GlassInput label="Owner" placeholder="Avery Stone" leftIcon={<UserRound size={16} />} fullWidth />
        <GlassInput label="Contact" placeholder="ops@auraglass.dev" leftIcon={<Mail size={16} />} rightIcon={<Check size={16} />} state="success" fullWidth />
        <GlassInput label="Search" placeholder="Find segments" leftIcon={<Search size={16} />} variant="filled" fullWidth />
        <GlassInput label="Budget code" placeholder="Required" errorText="Budget code is required before publishing." fullWidth />
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InputFrame {...args} />,
};

export const Liquid: Story = {
  args: {
    material: "liquid",
    label: "Launch title",
    placeholder: "Spring activation",
  },
  render: (args) => <InputFrame {...args} />,
};
