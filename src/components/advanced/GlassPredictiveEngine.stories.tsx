import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/test";
import {
  GlassPredictionIndicator as ActualGlassPredictionIndicator,
  GlassPredictiveEngine as ActualGlassPredictiveEngine,
  GlassPredictiveEngineProvider as ActualGlassPredictiveEngineProvider,
} from "./GlassPredictiveEngine";

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

const openPredictionPanel = async (canvasElement: HTMLElement) => {
  const button = canvasElement.querySelector("button");
  if (button) await userEvent.click(button);
};

const meta: Meta = {
  title: "AI + Intelligence/Glass Predictive Engine",
  component: ActualGlassPredictiveEngine,
  parameters: {
    layout: "fullscreen",
    previewSurface: "component",
    docs: {
      description: {
        component:
          "Direct stories for every public visual export in GlassPredictiveEngine: the complete engine, its provider, and the provider-backed prediction indicator.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;


/** @deprecated GlassPredictiveEngine DEP-S0406 since 4.2.0, removed in 5.0.0. {@link none — predictive/simulated AI is rejected at 5.0} */
export const GlassPredictiveEngine: Story = {
  name: "GlassPredictiveEngine",
  render: () => (
    <StoryStage>
      <ActualGlassPredictiveEngine showIndicator={false} />
    </StoryStage>
  ),
};

export const GlassPredictiveEngineProvider: Story = {
  name: "GlassPredictiveEngineProvider",
  render: () => (
    <StoryStage>
      <ActualGlassPredictiveEngineProvider>
        <ActualGlassPredictionIndicator />
      </ActualGlassPredictiveEngineProvider>
    </StoryStage>
  ),
  play: async ({ canvasElement }) => openPredictionPanel(canvasElement),
};


/** @deprecated GlassPredictionIndicator DEP-S0420 since 4.2.0, removed in 5.0.0. {@link none — predictive/simulated AI is rejected at 5.0} */
export const GlassPredictionIndicator: Story = {
  name: "GlassPredictionIndicator",
  render: () => (
    <StoryStage>
      <ActualGlassPredictiveEngineProvider>
        <ActualGlassPredictionIndicator showInsights maxPredictions={5} />
      </ActualGlassPredictiveEngineProvider>
    </StoryStage>
  ),
  play: async ({ canvasElement }) => openPredictionPanel(canvasElement),
};
