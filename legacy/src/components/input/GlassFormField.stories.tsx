import type { Meta, StoryObj } from "@storybook/react";
import { GlassInput } from "./GlassInput";
import { GlassFormField } from "./GlassFormField";

const meta = {
  title: "Controls/Inputs/Glass Form Field",
  component: GlassFormField,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
} satisfies Meta<typeof GlassFormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "min(440px, calc(100vw - 48px))" }}>
      <GlassFormField
        label="Workspace name"
        htmlFor="workspace-name"
        description="This appears in navigation and shared links."
        required
      >
        <GlassInput
          id="workspace-name"
          defaultValue="Northstar Studio"
          aria-label="Workspace name"
          fullWidth
        />
      </GlassFormField>
    </div>
  ),
};

export const WithValidationError: Story = {
  render: () => (
    <div style={{ width: "min(440px, calc(100vw - 48px))" }}>
      <GlassFormField
        label="Workspace slug"
        htmlFor="workspace-slug"
        error="Use lowercase letters, numbers, and hyphens only."
      >
        <GlassInput
          id="workspace-slug"
          defaultValue="Northstar Studio"
          aria-invalid={true}
          aria-label="Workspace slug"
          state="error"
          fullWidth
        />
      </GlassFormField>
    </div>
  ),
};
