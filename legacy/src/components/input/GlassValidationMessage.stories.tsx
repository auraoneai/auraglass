import type { Meta, StoryObj } from "@storybook/react";
import { GlassValidationMessage } from "./GlassValidationMessage";

const meta = {
  title: "Controls/Inputs/Glass Validation Message",
  component: GlassValidationMessage,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
  args: {
    tone: "error",
    children: "Enter a valid workspace URL before continuing.",
  },
} satisfies Meta<typeof GlassValidationMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ToneMatrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 12,
        width: "min(480px, calc(100vw - 48px))",
      }}
    >
      <GlassValidationMessage tone="error">
        The workspace URL is already in use.
      </GlassValidationMessage>
      <GlassValidationMessage tone="warning">
        This change will affect twelve collaborators.
      </GlassValidationMessage>
      <GlassValidationMessage tone="success">
        Workspace settings are ready to publish.
      </GlassValidationMessage>
      <GlassValidationMessage tone="info">
        You can update this value again at any time.
      </GlassValidationMessage>
    </div>
  ),
};
