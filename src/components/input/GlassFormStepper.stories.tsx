import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Building2, CreditCard, UserRound } from "@/icons";
import { GlassFormStepper } from "./GlassFormStepper";

const steps = [
  { id: "profile", title: "Profile", description: "Workspace owner", icon: <UserRound size={18} />, completed: true },
  { id: "company", title: "Company", description: "Business details", icon: <Building2 size={18} /> },
  { id: "billing", title: "Billing", description: "Plan and payment", icon: <CreditCard size={18} />, optional: true },
];

const meta: Meta<typeof GlassFormStepper> = {
  title: 'Controls/Inputs/Glass Form Stepper',
  component: GlassFormStepper,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass form stepper for multi-step forms with descriptions and clickable progress.",
      },
    },
  },
  args: {
    steps,
    currentStep: 1,
    showDescriptions: true,
    showProgressLine: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassFormStepper>;

const StepperFrame = (args: ComponentProps<typeof GlassFormStepper>) => {
  const [currentStep, setCurrentStep] = useState(args.currentStep ?? 1);

  return (
    <div className="glass-w-[min(760px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassFormStepper {...args} currentStep={currentStep} onStepClick={setCurrentStep} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <StepperFrame {...args} />,
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    currentStep: 2,
  },
  render: (args) => <StepperFrame {...args} />,
};
