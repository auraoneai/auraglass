import type { Meta, StoryObj } from "@storybook/react";
import { GlassDateField } from "./GlassDateField";
import { GlassFieldGroup } from "./GlassFieldGroup";
import { GlassTimeField } from "./GlassTimeField";

const meta = {
  title: "Controls/Inputs/Glass Field Group",
  component: GlassFieldGroup,
  parameters: {
    layout: "centered",
    previewSurface: "component",
  },
} satisfies Meta<typeof GlassFieldGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "min(680px, calc(100vw - 48px))" }}>
      <GlassFieldGroup
        legend="Launch window"
        description="Choose the date and time when the release becomes available."
        columns={2}
      >
        <GlassDateField label="Date" defaultValue="2026-09-18" fullWidth />
        <GlassTimeField label="Time" defaultValue="09:30" fullWidth />
      </GlassFieldGroup>
    </div>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <div style={{ width: "min(860px, calc(100vw - 48px))" }}>
      <GlassFieldGroup legend="Milestones" columns={3}>
        <GlassDateField label="Review" defaultValue="2026-09-11" fullWidth />
        <GlassDateField label="Launch" defaultValue="2026-09-18" fullWidth />
        <GlassDateField label="Retrospective" defaultValue="2026-09-25" fullWidth />
      </GlassFieldGroup>
    </div>
  ),
};
