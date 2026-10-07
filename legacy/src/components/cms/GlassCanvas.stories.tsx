import type { Meta, StoryObj } from "@storybook/react";
import { GlassCanvas as GlassCanvasComponent } from "./GlassCanvas";
import { GlassDragDropProvider } from "./GlassDragDropProvider";

const meta: Meta = {
  title: "Workflows/Glass Canvas",
  component: GlassCanvasComponent,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real GlassCanvas mounted inside its drag-and-drop provider at a bounded, responsive editing size.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const GlassCanvas: Story = {
  render: () => (
    <div
      style={{
        width: "min(920px, calc(100vw - 32px))",
        height: "min(620px, calc(100vh - 32px))",
        minWidth: 0,
        minHeight: 360,
        display: "flex",
        overflow: "hidden",
      }}
    >
      <GlassDragDropProvider style={{ width: "100%", minWidth: 0 }}>
        <GlassCanvasComponent data-testid="glass-canvas-story" />
      </GlassDragDropProvider>
    </div>
  ),
};
