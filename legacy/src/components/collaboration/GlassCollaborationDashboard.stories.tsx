import type { Meta, StoryObj } from "@storybook/react";
import * as GlassCollaborationDashboardModule from "./GlassCollaborationDashboard";

type DashboardComponent =
  typeof GlassCollaborationDashboardModule.GlassCollaborationDashboard;

const meta: Meta<DashboardComponent> = {
  title: "Workflows/Glass Collaboration Dashboard",
  component: GlassCollaborationDashboardModule.GlassCollaborationDashboard,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "The real collaboration dashboard rendering its deterministic demo users and activity state.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<DashboardComponent>;

export const GlassCollaborationDashboard: Story = {
  render: () => (
    <div
      style={{
        width: "min(352px, calc(100vw - 32px))",
        minWidth: 0,
        minHeight: 136,
        display: "grid",
        placeItems: "center",
      }}
    >
      <GlassCollaborationDashboardModule.GlassCollaborationDashboard
        data-testid="glass-collaboration-dashboard-story"
      />
    </div>
  ),
};
