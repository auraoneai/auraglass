import type { Meta, StoryObj } from "@storybook/react";
import { Building2, CreditCard, UserRound } from "lucide-react";
import { GlassStep } from "./GlassStep";

const meta: Meta<typeof GlassStep> = {
  title: 'Controls/Inputs/Glass Step',
  component: GlassStep,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass step row for composing custom steppers with icons and labels.",
      },
    },
  },
  args: {
    step: { id: "company", title: "Company", label: "Company", icon: <Building2 size={15} /> },
    index: 1,
    active: true,
    completed: false,
    orientation: "horizontal",
  },
};

export default meta;
type Story = StoryObj<typeof GlassStep>;

export const Default: Story = {
  render: (args) => (
    <div className="glass-grid glass-w-[min(640px,calc(100vw-48px))] glass-gap-3 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-5 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassStep step={{ id: "profile", title: "Profile", label: "Profile", icon: <UserRound size={15} /> }} index={0} active={false} completed orientation="horizontal" />
      <GlassStep {...args} />
      <GlassStep step={{ id: "billing", title: "Billing", label: "Billing", icon: <CreditCard size={15} /> }} index={2} active={false} completed={false} orientation="horizontal" />
    </div>
  ),
};
