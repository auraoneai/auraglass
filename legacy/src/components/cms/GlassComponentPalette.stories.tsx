import type { Meta, StoryObj } from "@storybook/react";
import { GlassComponentPalette as GlassComponentPaletteComponent } from "./GlassComponentPalette";
import { GlassDragDropProvider } from "./GlassDragDropProvider";

const meta: Meta = {
  title: "Workflows/Glass Component Palette",
  component: GlassComponentPaletteComponent,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real component palette, with its live searchable component library supplied by GlassDragDropProvider.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const GlassComponentPalette: Story = {
  render: () => (
    <div
      style={{
        width: "min(352px, calc(100vw - 32px))",
        height: "min(620px, calc(100vh - 32px))",
        minWidth: 0,
        minHeight: 420,
        overflow: "hidden",
      }}
    >
      <GlassDragDropProvider style={{ width: "100%", height: "100%" }}>
        <GlassComponentPaletteComponent
          className="glass-max-w-full"
          data-testid="glass-component-palette-story"
        />
      </GlassDragDropProvider>
    </div>
  ),
};
