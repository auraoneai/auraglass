import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import {
  GlassContextualDashboard as ActualGlassContextualDashboard,
  GlassContextualEngine as ActualGlassContextualEngine,
  GlassContextualEngineProvider as ActualGlassContextualEngineProvider,
} from "./GlassContextualEngine";

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

const meta: Meta = {
  title: "AI + Intelligence/Glass Contextual Engine",
  component: ActualGlassContextualEngine,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct stories for every public visual export in GlassContextualEngine, including the provider-backed dashboard and the complete adaptive summary.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const GlassContextualEngine: Story = {
  name: "GlassContextualEngine",
  render: () => (
    <StoryStage>
      <ActualGlassContextualEngine showDashboard={false} />
    </StoryStage>
  ),
};

export const GlassContextualEngineProvider: Story = {
  name: "GlassContextualEngineProvider",
  render: () => (
    <StoryStage>
      <ActualGlassContextualEngineProvider>
        <ActualGlassContextualDashboard />
      </ActualGlassContextualEngineProvider>
    </StoryStage>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", {
        name: "Toggle contextual engine dashboard",
      })
    );
  },
};

export const GlassContextualDashboard: Story = {
  name: "GlassContextualDashboard",
  render: () => (
    <StoryStage>
      <ActualGlassContextualEngineProvider>
        <ActualGlassContextualDashboard showSensors />
      </ActualGlassContextualEngineProvider>
    </StoryStage>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", {
        name: "Toggle contextual engine dashboard",
      })
    );
  },
};
