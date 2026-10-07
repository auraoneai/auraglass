import type { Meta, StoryObj } from "@storybook/react";
import * as GlassCollaborationProviderModule from "./GlassCollaborationProvider";
import { GlassCollaborationDashboard } from "./GlassCollaborationDashboard";

type ProviderComponent =
  typeof GlassCollaborationProviderModule.CollaborationProvider;

const meta: Meta<ProviderComponent> = {
  title: "Workflows/Glass Collaboration Provider",
  component: GlassCollaborationProviderModule.CollaborationProvider,
  parameters: {
    layout: "centered",
    previewSurface: "app",
    docs: {
      description: {
        component:
          "Both public provider exports mounted with a real collaboration-dashboard consumer. Network transport is disabled for deterministic Storybook rendering.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<ProviderComponent>;

const ProviderChild = () => (
  <div
    style={{
      width: "min(360px, calc(100vw - 32px))",
      minWidth: 0,
      minHeight: 136,
      display: "grid",
      placeItems: "center",
    }}
  >
    <GlassCollaborationDashboard />
  </div>
);

export const CollaborationProvider: Story = {
  args: {
    children: null,
    roomId: "storybook-collaboration-room",
  },
  render: () => (
    <GlassCollaborationProviderModule.CollaborationProvider
      roomId="storybook-collaboration-room"
      enableRealTime={false}
      data-testid="collaboration-provider-story"
    >
      <ProviderChild />
    </GlassCollaborationProviderModule.CollaborationProvider>
  ),
};

export const GlassCollaborationProvider: Story = {
  args: {
    children: null,
    roomId: "storybook-glass-collaboration-room",
  },
  render: () => (
    <GlassCollaborationProviderModule.GlassCollaborationProvider
      roomId="storybook-glass-collaboration-room"
      enableRealTime={false}
      data-testid="glass-collaboration-provider-story"
    >
      <ProviderChild />
    </GlassCollaborationProviderModule.GlassCollaborationProvider>
  ),
};
