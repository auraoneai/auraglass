import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassMetaDashboard as ActualGlassMetaDashboard,
  GlassMetaEngineProvider as ActualGlassMetaEngineProvider,
} from "./GlassMetaEngine";

const StoryStage = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      boxSizing: "border-box",
      display: "grid",
      minHeight: "100vh",
      minWidth: 0,
      padding: "clamp(24px, 6vw, 72px)",
      placeItems: "center",
      width: "100%",
    }}
  >
    <div style={{ minWidth: 0, width: "min(100%, 720px)" }}>{children}</div>
  </div>
);

const meta = {
  title: "Effects + Advanced/Glass Meta Engine",
  component: ActualGlassMetaDashboard,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct stories for the public GlassMetaEngine provider and dashboard exports, with the dashboard mounted under its required runtime context.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ActualGlassMetaDashboard>;

export default meta;
type Story = StoryObj;

export const GlassMetaEngineProvider: Story = {
  name: "GlassMetaEngineProvider",
  render: () => (
    <StoryStage>
      <ActualGlassMetaEngineProvider>
        <ActualGlassMetaDashboard defaultOpen inline showQuantumStates={false} />
      </ActualGlassMetaEngineProvider>
    </StoryStage>
  ),
};

export const GlassMetaDashboard: Story = {
  name: "GlassMetaDashboard",
  render: () => (
    <StoryStage>
      <ActualGlassMetaEngineProvider>
        <ActualGlassMetaDashboard
          maxOptimizations={6}
          showEvolutions
          showQuantumStates={false}
          defaultOpen
          inline
        />
      </ActualGlassMetaEngineProvider>
    </StoryStage>
  ),
};
