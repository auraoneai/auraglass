import type { Meta, StoryObj } from "@storybook/react";
import * as GlassRichTextEditorModule from "./GlassRichTextEditor";

const meta = {
  title: "Reference/Legacy Components/Glass Rich Text Editor",
  component: GlassRichTextEditorModule.GlassRichTextEditor,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real rich-text editor with live editable content and its complete formatting toolbar.",
      },
    },
  },
} satisfies Meta<typeof GlassRichTextEditorModule.GlassRichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GlassRichTextEditor: Story = {
  render: () => (
    <div
      style={{
        width: "min(760px, calc(100vw - 32px))",
        minWidth: 0,
      }}
    >
      <GlassRichTextEditorModule.GlassRichTextEditor
        value={
          "<h2>Launch review</h2><p>Shape the final release narrative, confirm the visual system, and prepare the handoff.</p><blockquote>Every detail is ready for a focused editorial pass.</blockquote>"
        }
        minHeight="240px"
        maxHeight="min(420px, calc(100vh - 180px))"
        data-testid="glass-rich-text-editor-story"
      />
    </div>
  ),
};
