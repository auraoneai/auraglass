import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BarChart3, Gauge, ShieldCheck } from "@/icons";
import { GlassRadioGroup } from "./GlassRadioGroup";

const options = [
  {
    value: "balanced",
    label: "Balanced delivery",
    description: "Optimize pacing across reach, spend, and quality.",
    icon: <Gauge size={18} />,
  },
  {
    value: "performance",
    label: "Performance first",
    description: "Prioritize conversion likelihood and active segments.",
    icon: <BarChart3 size={18} />,
  },
  {
    value: "guarded",
    label: "Guarded rollout",
    description: "Slow changes until policy checks and approvals clear.",
    icon: <ShieldCheck size={18} />,
  },
];

const meta: Meta<typeof GlassRadioGroup> = {
  title: 'Controls/Inputs/Glass Radio Group',
  component: GlassRadioGroup,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass radio group for mutually exclusive choices with card and compact layouts.",
      },
    },
  },
  args: {
    label: "Optimization mode",
    description: "Choose how the launch system should tune delivery.",
    options,
    defaultValue: "balanced",
    variant: "card",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof GlassRadioGroup>;

const RadioFrame = (args: ComponentProps<typeof GlassRadioGroup>) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? "balanced");

  return (
    <div className="glass-w-[min(720px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassRadioGroup {...args} value={value} onValueChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <RadioFrame {...args} />,
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    variant: "default",
    options: options.map(({ value, label }) => ({ value, label })),
  },
  render: (args) => <RadioFrame {...args} />,
};
