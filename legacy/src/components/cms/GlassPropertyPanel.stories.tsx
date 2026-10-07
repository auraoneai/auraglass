import type { Meta, StoryObj } from "@storybook/react";
import { GlassPropertyPanel as GlassPropertyPanelComponent } from "./GlassPropertyPanel";
import { GlassDragDropProvider } from "./GlassDragDropProvider";

const meta: Meta = {
  title: "Workflows/Glass Property Panel",
  component: GlassPropertyPanelComponent,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real property inspector mounted against a live drag-and-drop context.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const GlassPropertyPanel: Story = {
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
        <GlassPropertyPanelComponent
          className="glass-max-w-full"
          data-testid="glass-property-panel-story"
        />
      </GlassDragDropProvider>
    </div>
  ),
};
