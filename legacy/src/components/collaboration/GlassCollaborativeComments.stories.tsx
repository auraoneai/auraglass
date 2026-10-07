import type { Meta, StoryObj } from "@storybook/react";
import * as GlassCollaborativeCommentsModule from "./GlassCollaborativeComments";

type CommentsComponent =
  typeof GlassCollaborativeCommentsModule.GlassCollaborativeComments;

const meta: Meta<CommentsComponent> = {
  title: "Workflows/Glass Collaborative Comments",
  component: GlassCollaborativeCommentsModule.GlassCollaborativeComments,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real collaborative-comments overlay in its contained demo mode, including a visible seeded review thread.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<CommentsComponent>;

export const GlassCollaborativeComments: Story = {
  render: () => (
    <div
      style={{
        width: "min(352px, calc(100vw - 32px))",
        height: 260,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <GlassCollaborativeCommentsModule.GlassCollaborativeComments
        contained
        compact
        maxHeight={260}
        aria-label="Collaborative review comments"
        data-testid="glass-collaborative-comments-story"
      />
    </div>
  ),
};
