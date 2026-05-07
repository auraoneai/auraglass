import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassColorPicker } from "./GlassColorPicker";

const brandPalette = ["#2563eb", "#0f766e", "#be123c", "#7c3aed", "#f59e0b", "#111827"];

const meta: Meta<typeof GlassColorPicker> = {
  title: 'Controls/Inputs/Glass Color Picker',
  component: GlassColorPicker,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "A glass color picker for theme accents, presets, and editable color values.",
      },
    },
  },
  args: {
    defaultValue: "#2563eb",
    format: "hex",
    showAlpha: false,
    showInput: true,
    showPresets: true,
    palette: brandPalette,
  },
};

export default meta;
type Story = StoryObj<typeof GlassColorPicker>;

const ColorFrame = (args: ComponentProps<typeof GlassColorPicker>) => {
  const [value, setValue] = useState(args.value ?? args.defaultValue ?? "#2563eb");

  return (
    <div className="glass-grid glass-w-[min(560px,calc(100vw-48px))] glass-gap-5 glass-rounded-3xl glass-border glass-border-white/25 glass-bg-white/35 glass-p-6 glass-shadow-xl glass-backdrop-blur-xl">
      <div>
        <h3 className="glass-m-0 glass-text-lg glass-font-semibold glass-text-primary">Brand accent</h3>
        <p className="glass-mt-1 glass-text-sm glass-text-secondary">Preset swatches and typed values stay inside the bounded story panel.</p>
      </div>
      <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-4">
        <div className="glass-h-20 glass-w-28 glass-rounded-2xl glass-border glass-border-white/30" style={{ background: value }} />
        <GlassColorPicker {...args} value={value} onChange={setValue} />
      </div>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ColorFrame {...args} />,
};

export const WithAlpha: Story = {
  args: {
    defaultValue: "#0f766ecc",
    format: "rgba",
    showAlpha: true,
    placement: "right",
  },
  render: (args) => <ColorFrame {...args} />,
};
