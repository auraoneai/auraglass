import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GlassCollaborativeCursor as Component } from "./GlassCollaborativeCursor";
import { GlassCollaborationProvider as Provider } from "./GlassCollaborationProvider";

const meta: Meta = {
  title: 'Workflows/Glass Collaborative Cursor',
  component: Component as React.ComponentType,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Component-owned Storybook coverage for GlassCollaborativeCursor.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="glass-relative glass-h-32 glass-w-96 glass-overflow-hidden glass-radius-lg glass-surface-subtle">
      <Provider roomId="storybook-owned-cursor" enableRealTime={false}>
        <Component />
      </Provider>
    </div>
  ),
};
