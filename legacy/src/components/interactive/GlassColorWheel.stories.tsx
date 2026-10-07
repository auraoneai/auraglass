import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassColorWheel as GlassColorWheelComponent } from "./GlassColorWheel";

const frameStyle: CSSProperties = {
  boxSizing: "border-box",
  display: "grid",
  justifyItems: "center",
  maxWidth: "100%",
  minWidth: 0,
  padding: "clamp(4px, 2vw, 12px)",
  width: "min(320px, calc(100vw - 32px))",
};

const meta = {
  title: "Effects + Advanced/Glass Color Wheel",
  component: GlassColorWheelComponent,
  parameters: {
    layout: "centered",
    previewSurface: "component",
    controls: {
      exclude: ["onChange", "onAlphaChange"],
    },
    docs: {
      description: {
        component:
          "The real GlassColorWheel export in a compact, deterministic color-selection state. Color remains confined to the working control while the surrounding material uses neutral liquid glass.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    defaultValue: "#526273",
    defaultAlpha: 0.86,
    disabled: false,
    inputFormat: "hex",
    respectMotionPreference: false,
    showAlpha: true,
    showInputs: true,
    showSwatches: false,
    size: "md",
  },
} satisfies Meta<typeof GlassColorWheelComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassColorWheel: Story = {
  name: "GlassColorWheel",
  render: (args) => (
    <div style={frameStyle}>
      <GlassColorWheelComponent
        {...args}
        aria-label="Product accent color"
        data-testid="glass-color-wheel-story"
      />
    </div>
  ),
};
