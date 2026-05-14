import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Bold, Columns3, Grid3X3, Italic, List, Underline } from "@/icons";
import { GlassToggle, GlassToggleGroup, GlassToggleGroupItem } from "./GlassToggle";

const meta: Meta<typeof GlassToggle> = {
  title: 'Controls/Inputs/Glass Toggle',
  component: GlassToggle,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass toggle and toggle group for mode selection, formatting, and compact tools.",
      },
    },
  },
  args: {
    children: "Preview mode",
    leftIcon: <Grid3X3 size={16} />,
    defaultPressed: true,
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof GlassToggle>;

const ToggleFrame = (args: ComponentProps<typeof GlassToggle>) => {
  const [pressed, setPressed] = useState(args.pressed ?? args.defaultPressed ?? true);
  const [layout, setLayout] = useState(["grid"]);

  return (
    <div className="glass-grid glass-w-[min(600px,calc(100vw-48px))] glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <div>
        <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">Editor tools</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Controls keep fixed spacing and readable active states.</p>
      </div>
      <GlassToggle {...args} pressed={pressed} onPressedChange={setPressed} />
      <GlassToggleGroup type="single" value={layout} onValueChange={setLayout} className="glass-flex glass-flex-wrap glass-gap-2">
        <GlassToggleGroupItem value="grid" leftIcon={<Grid3X3 size={15} />}>Grid</GlassToggleGroupItem>
        <GlassToggleGroupItem value="list" leftIcon={<List size={15} />}>List</GlassToggleGroupItem>
        <GlassToggleGroupItem value="columns" leftIcon={<Columns3 size={15} />}>Columns</GlassToggleGroupItem>
      </GlassToggleGroup>
      <GlassToggleGroup type="multiple" defaultValue={["bold"]} className="glass-flex glass-flex-wrap glass-gap-2">
        <GlassToggleGroupItem value="bold" aria-label="Bold"><Bold size={15} /></GlassToggleGroupItem>
        <GlassToggleGroupItem value="italic" aria-label="Italic"><Italic size={15} /></GlassToggleGroupItem>
        <GlassToggleGroupItem value="underline" aria-label="Underline"><Underline size={15} /></GlassToggleGroupItem>
      </GlassToggleGroup>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ToggleFrame {...args} />,
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Compact preview",
    defaultPressed: false,
  },
  render: (args) => <ToggleFrame {...args} />,
};
