import type { Meta, StoryObj } from "@storybook/react";
import { Check, CreditCard, UserRound } from "@/icons";
import { GlassStepIcon } from "./GlassStepIcon";

const meta: Meta<typeof GlassStepIcon> = {
  title: 'Controls/Inputs/Glass Step Icon',
  component: GlassStepIcon,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "The stepper icon primitive for active, completed, and pending workflow states.",
      },
    },
  },
  args: {
    index: 1,
    active: true,
    completed: false,
    icon: <UserRound size={15} />,
  },
};

export default meta;
type Story = StoryObj<typeof GlassStepIcon>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-flex glass-w-[min(360px,calc(100vw-48px))] glass-items-center glass-justify-center glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassStepIcon index={0} active={false} completed icon={<Check size={15} />} />
      <GlassStepIcon {...args} />
      <GlassStepIcon index={2} active={false} completed={false} icon={<CreditCard size={15} />} />
    </div>
  ),
};
