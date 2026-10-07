import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassSlider } from "./GlassSlider";

const meta: Meta<typeof GlassSlider> = {
  title: 'Controls/Inputs/Glass Slider',
  component: GlassSlider,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass slider for ranges, thresholds, and numeric tuning controls.",
      },
    },
  },
  args: {
    label: "Campaign intensity",
    description: "Balance reach and frequency for the active audience.",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 65,
    showValue: true,
    showTicks: true,
    ticks: [0, 25, 50, 75, 100],
    variant: "info",
    formatValue: (value: number) => `${value}%`,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSlider>;

const SliderFrame = (args: ComponentProps<typeof GlassSlider>) => {
  const [value, setValue] = useState<number | number[]>(
    args.value ?? args.defaultValue ?? 65
  );

  return (
    <div className="glass-w-[min(640px,calc(100vw-48px))] glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <GlassSlider {...args} value={value} onChange={setValue} />
      <div className="glass-mt-5 glass-grid glass-gap-3 sm:glass-grid-cols-3">
        {["Audience", "Spend", "Quality"].map((label, index) => (
          <div key={label} className="glass-rounded-2xl glass-border glass-border-white/20 glass-bg-white/25 glass-p-3">
            <div className="glass-text-xs glass-text-secondary">{label}</div>
            <div className="glass-text-lg glass-font-semibold glass-text-primary">
              {Array.isArray(value) ? value[index % value.length] : Math.max(12, Number(value) - index * 8)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <SliderFrame {...args} />,
};

export const Range: Story = {
  args: {
    label: "Budget guardrail",
    description: "Keep experiments inside the approved range.",
    defaultValue: [25, 80],
    range: true,
    variant: "success",
    formatValue: (value: number) => `$${value}k`,
  },
  render: (args) => <SliderFrame {...args} />,
};
