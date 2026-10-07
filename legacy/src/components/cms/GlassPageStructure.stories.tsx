import type { Meta, StoryObj } from "@storybook/react";
import { GlassPageStructure as GlassPageStructureComponent } from "./GlassPageStructure";
import { GlassDragDropProvider } from "./GlassDragDropProvider";

const meta: Meta = {
  title: "Workflows/Glass Page Structure",
  component: GlassPageStructureComponent,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real page-structure navigator mounted against a live drag-and-drop context.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const GlassPageStructure: Story = {
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
        <GlassPageStructureComponent
          className="glass-max-w-full"
          data-testid="glass-page-structure-story"
        />
      </GlassDragDropProvider>
    </div>
  ),
};
