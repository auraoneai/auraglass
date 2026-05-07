import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle2, Clock, Filter, X } from "lucide-react";
import { GlassChip } from "./GlassChip";

const InteractiveChipSet = () => {
  const [selected, setSelected] = useState(["active", "review"]);
  const [visible, setVisible] = useState(["north-america", "enterprise"]);

  const toggle = (value: string) => {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  return (
    <div
      className="glass-flex glass-flex-col glass-gap-5 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-5"
      style={{ width: 560 }}
    >
      <div>
        <h3 className="glass-text-base glass-font-semibold glass-text-primary">
          Segment filters
        </h3>
        <p className="glass-text-sm glass-text-secondary">
          Chips show selection, icon, avatar, and removable states together.
        </p>
      </div>
      <div className="glass-flex glass-flex-wrap glass-gap-2">
        <GlassChip
          selected={selected.includes("active")}
          clickable
          onSelect={() => toggle("active")}
          icon={<CheckCircle2 size={14} />}
          variant="success"
        >
          Active
        </GlassChip>
        <GlassChip
          selected={selected.includes("review")}
          clickable
          onSelect={() => toggle("review")}
          icon={<Clock size={14} />}
          variant="warning"
        >
          Needs review
        </GlassChip>
        {visible.map((item) => (
          <GlassChip
            key={item}
            removable
            variant="info"
            removeIcon={<X size={12} />}
            onRemove={() =>
              setVisible((current) => current.filter((value) => value !== item))
            }
          >
            {item === "north-america" ? "North America" : "Enterprise"}
          </GlassChip>
        ))}
        <GlassChip icon={<Filter size={14} />} variant="outline">
          Add filter
        </GlassChip>
      </div>
    </div>
  );
};

const meta = {
  title: 'Data + Visualization/Glass Chip',
  component: GlassChip,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A compact glass chip for filters, labels, selected facets, and removable metadata.",
      },
    },
  },
  args: {
    children: "Enterprise",
    variant: "primary",
    size: "md",
  },
} satisfies Meta<typeof GlassChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <InteractiveChipSet />,
};

export const Sizes: Story = {
  render: () => (
    <div className="glass-flex glass-items-center glass-gap-3 glass-radius-xl glass-border glass-border-subtle glass-surface-overlay glass-p-5">
      <GlassChip size="xs">XS</GlassChip>
      <GlassChip size="sm" variant="secondary">
        Small
      </GlassChip>
      <GlassChip size="md" variant="primary" selected>
        Medium
      </GlassChip>
      <GlassChip size="lg" variant="success" removable>
        Large
      </GlassChip>
    </div>
  ),
};
