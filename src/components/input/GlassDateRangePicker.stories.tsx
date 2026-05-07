import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassDateRangePicker, type DateRange } from "./GlassDateRangePicker";

const meta: Meta<typeof GlassDateRangePicker> = {
  title: 'Controls/Inputs/Glass Date Range Picker',
  component: GlassDateRangePicker,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass date range picker for reporting, planning, and campaign windows.",
      },
    },
  },
  args: {
    placeholder: "Select reporting range",
    showClear: true,
    presets: [
      {
        label: "Next 14 days",
        getValue: () => ({ from: new Date(2026, 4, 1), to: new Date(2026, 4, 14) }),
      },
      {
        label: "Launch month",
        getValue: () => ({ from: new Date(2026, 4, 1), to: new Date(2026, 4, 31) }),
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GlassDateRangePicker>;

const RangeFrame = (args: ComponentProps<typeof GlassDateRangePicker>) => {
  const [value, setValue] = useState<DateRange>({
    from: new Date(2026, 4, 1),
    to: new Date(2026, 4, 15),
  });

  return (
    <div className="glass-grid glass-w-[min(620px,calc(100vw-48px))] glass-gap-4 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <div>
        <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">Reporting period</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">The trigger stays bounded while the calendar has room for two months.</p>
      </div>
      <GlassDateRangePicker {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <RangeFrame {...args} />,
};

export const Compact: Story = {
  args: {
    placeholder: "Select approval range",
    size: "sm",
  },
  render: (args) => <RangeFrame {...args} />,
};
