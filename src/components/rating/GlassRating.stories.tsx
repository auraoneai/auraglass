import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MessageSquare, Sparkles } from "lucide-react";
import { GlassRating } from "./GlassRating";

const RatingPreview = (args: React.ComponentProps<typeof GlassRating>) => {
  const [value, setValue] = useState(args.value ?? 4);

  return (
    <div
      className="glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
      style={{ width: "min(520px, calc(100vw - 64px))" }}
    >
      <div className="glass-flex glass-items-start glass-justify-between glass-gap-4 glass-mb-5">
        <div>
          <h3 className="glass-text-base glass-font-semibold glass-text-primary">
            Customer sentiment
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            Interactive rating with clear focus and dark-mode contrast.
          </p>
        </div>
        <span className="glass-inline-flex glass-h-10 glass-w-10 glass-items-center glass-justify-center glass-radius-full glass-surface-blue">
          <Sparkles size={18} aria-hidden="true" />
        </span>
      </div>

      <GlassRating
        {...args}
        value={value}
        onChange={setValue}
        labels={["Poor", "Fair", "Good", "Very good", "Excellent"]}
      />

      <div className="glass-mt-4 glass-radius-lg glass-surface-overlay glass-border glass-border-subtle glass-p-3">
        <div className="glass-text-xs glass-text-secondary">Current score</div>
        <div className="glass-text-xl glass-font-semibold glass-text-primary">
          {value.toFixed(args.allowHalf ? 1 : 0)} / {args.max ?? 5}
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Controls/Buttons/Glass Rating',
  component: GlassRating,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass rating control with keyboard navigation, half-star support, and readable value labels.",
      },
    },
  },
  args: {
    value: 4,
    max: 5,
    size: "lg",
    variant: "warning",
    allowHalf: false,
    showValue: true,
    readOnly: false,
    disabled: false,
    glass: true,
    elevation: "level2",
  },
} satisfies Meta<typeof GlassRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <RatingPreview {...args} />,
};

export const HalfStars: Story = {
  args: {
    value: 3.5,
    allowHalf: true,
    variant: "primary",
  },
  render: (args) => <RatingPreview {...args} />,
};

export const ReadOnlySummary: Story = {
  args: {
    value: 4.8,
    allowHalf: true,
    readOnly: true,
    size: "md",
    variant: "success",
  },
  render: (args) => (
    <div
      className="glass-flex glass-flex-col glass-gap-4 glass-radius-2xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
      style={{ width: "min(560px, calc(100vw - 64px))" }}
    >
      <div className="glass-flex glass-items-center glass-gap-3">
        <MessageSquare size={20} className="glass-text-primary" aria-hidden="true" />
        <div>
          <h3 className="glass-text-base glass-font-semibold glass-text-primary">
            Review snapshot
          </h3>
          <p className="glass-text-sm glass-text-secondary">
            Static score for dense dashboards and summary cards.
          </p>
        </div>
      </div>
      <GlassRating {...args} />
    </div>
  ),
};
