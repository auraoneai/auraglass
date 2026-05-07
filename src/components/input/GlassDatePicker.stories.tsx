import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassDatePicker } from "./GlassDatePicker";

const meta: Meta<typeof GlassDatePicker> = {
  title: 'Controls/Inputs/Glass Date Picker',
  component: GlassDatePicker,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass date picker for scheduling workflows with helper text and calendar actions.",
      },
    },
  },
  args: {
    placeholder: "Select launch date",
    helperText: "Dates outside the current planning window are disabled.",
    showTodayButton: true,
    showClearButton: true,
  },
};

export default meta;
type Story = StoryObj<typeof GlassDatePicker>;

const DatePickerFrame = (args: ComponentProps<typeof GlassDatePicker>) => {
  const [value, setValue] = useState<Date | null>(new Date(2026, 4, 12));

  return (
    <div className="glass-grid glass-w-[min(520px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <div>
        <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">Launch window</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Calendar popovers open with enough surrounding room to inspect alignment.</p>
      </div>
      <GlassDatePicker {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <DatePickerFrame {...args} />,
};

export const WithWeekNumbers: Story = {
  args: {
    showWeekNumbers: true,
    firstDayOfWeek: 1,
    placeholder: "Choose review date",
  },
  render: (args) => <DatePickerFrame {...args} />,
};
