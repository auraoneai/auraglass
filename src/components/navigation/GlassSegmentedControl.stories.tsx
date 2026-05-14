import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Grid3X3, List, PanelsTopLeft } from "@/icons";
import { GlassSegmentedControl } from "./GlassSegmentedControl";

const items = [
  { id: "list", label: "List", icon: <List size={15} /> },
  { id: "grid", label: "Grid", icon: <Grid3X3 size={15} /> },
  { id: "board", label: "Board", icon: <PanelsTopLeft size={15} /> },
];

const meta: Meta<typeof GlassSegmentedControl> = {
  title: 'Navigation/Glass Segmented Control',
  component: GlassSegmentedControl,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A compact glass segmented control for switching views and modes.",
      },
    },
  },
  args: {
    items,
    value: "grid",
    size: "md",
    "aria-label": "View mode",
  },
};

export default meta;
type Story = StoryObj<typeof GlassSegmentedControl>;

const SegmentedFrame = (args: ComponentProps<typeof GlassSegmentedControl>) => {
  const [value, setValue] = useState(args.value ?? "grid");

  return (
    <div className="glass-grid glass-w-[min(560px,calc(100vw-48px))] glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <div>
        <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">View controls</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Segment labels and icons stay inside the control at narrow widths.</p>
      </div>
      <GlassSegmentedControl {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <SegmentedFrame {...args} />,
};

export const Condensed: Story = {
  args: {
    condensed: true,
    size: "lg",
  },
  render: (args) => <SegmentedFrame {...args} />,
};
