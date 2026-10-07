import type { Meta, StoryObj } from "@storybook/react";

import { OptimizedGlassCore } from "../../primitives/OptimizedGlassCore";
import { AuraGlassClientBoundary } from "./AuraGlassClientBoundary";

const meta = {
  title: "Foundations/SSR/AuraGlass Client Boundary",
  component: AuraGlassClientBoundary,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Direct client-boundary coverage. The mounted Storybook preview proves that the client child replaces the server fallback after hydration.",
      },
    },
  },
} satisfies Meta<typeof AuraGlassClientBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <AuraGlassClientBoundary fallback={<p>Preparing client surface…</p>}>
      <OptimizedGlassCore
        as="section"
        elevation="level2"
        aria-label="Client boundary content"
        className="glass-p-6"
        style={{
          width: "min(32rem, calc(100vw - 32px))",
          maxWidth: "100%",
          display: "grid",
          gap: 8,
        }}
      >
        <p className="glass-text-sm glass-text-secondary">Client boundary</p>
        <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
          Hydrated glass content
        </h2>
        <p className="glass-text-secondary">
          Browser-only children are mounted and ready for interaction.
        </p>
      </OptimizedGlassCore>
    </AuraGlassClientBoundary>
  ),
};
