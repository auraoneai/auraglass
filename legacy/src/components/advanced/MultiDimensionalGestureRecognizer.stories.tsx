import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import {
  MultiDimensionalGestureRecognizer,
  type GestureDefinition,
} from "./MultiDimensionalGestureRecognizer";

const representativeGestures: GestureDefinition[] = [
  {
    id: "orbit-select",
    name: "Orbit Select",
    pattern: "clockwise-orbit",
    dimensions: [
      { axis: "x", weight: 0.42, sensitivity: 0.78 },
      { axis: "y", weight: 0.38, sensitivity: 0.74 },
      { axis: "z", weight: 0.2, sensitivity: 0.61 },
      { axis: "rotation", weight: 0.31, sensitivity: 0.82 },
    ],
    description: "Circular selection gesture with a controlled depth rise.",
    baselineConfidence: 0.89,
  },
  {
    id: "focus-shift",
    name: "Focus Shift",
    pattern: "figure-eight",
    dimensions: [
      { axis: "x", weight: 0.36, sensitivity: 0.67 },
      { axis: "y", weight: 0.36, sensitivity: 0.67 },
      { axis: "time", weight: 0.18, sensitivity: 0.56 },
      { axis: "pressure", weight: 0.25, sensitivity: 0.64 },
    ],
    description: "Alternating loop that transfers focus between workspaces.",
    baselineConfidence: 0.81,
  },
  {
    id: "depth-pull",
    name: "Depth Pull",
    pattern: "arc-toward-user",
    dimensions: [
      { axis: "z", weight: 0.52, sensitivity: 0.84 },
      { axis: "pressure", weight: 0.3, sensitivity: 0.72 },
      { axis: "time", weight: 0.18, sensitivity: 0.49 },
    ],
    description: "Pull motion that reveals a contextual command surface.",
    baselineConfidence: 0.76,
  },
];

const meta = {
  title: "Effects + Advanced/Multi Dimensional Gesture Recognizer",
  component: MultiDimensionalGestureRecognizer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct rendering of the public MultiDimensionalGestureRecognizer export with representative six-axis input patterns.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onRecognize: fn(),
  },
  argTypes: {
    onRecognize: { action: undefined },
  },
} satisfies Meta<typeof MultiDimensionalGestureRecognizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gestures: representativeGestures,
    showConfidence: true,
  },
};

export const Simplified: Story = {
  args: {
    gestures: representativeGestures,
    showConfidence: false,
  },
};
