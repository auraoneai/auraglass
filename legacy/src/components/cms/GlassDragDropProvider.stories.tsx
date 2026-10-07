import type { Meta, StoryObj } from "@storybook/react";
import * as GlassDragDropProviderModule from "./GlassDragDropProvider";
import { GlassCanvas } from "./GlassCanvas";

const meta = {
  title: "Workflows/Glass Drag Drop Provider",
  component: GlassDragDropProviderModule.GlassDragDropProvider,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real GlassDragDropProvider supplying live page-builder state to a GlassCanvas child.",
      },
    },
  },
} satisfies Meta<typeof GlassDragDropProviderModule.GlassDragDropProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassDragDropProvider: Story = {
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
      <GlassDragDropProviderModule.GlassDragDropProvider
        data-testid="glass-drag-drop-provider-story"
        style={{ width: "100%", minWidth: 0 }}
      >
        <GlassCanvas />
      </GlassDragDropProviderModule.GlassDragDropProvider>
    </div>
  ),
};
