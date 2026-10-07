import type { Meta, StoryObj } from "@storybook/react";

import {
  NeuralWeightVisualization,
  type NeuralWeightMatrix,
} from "./NeuralWeightVisualization";

const representativeLayers: NeuralWeightMatrix[] = [
  {
    id: "sensor-array",
    label: "Sensor Array",
    weights: [
      [0.84, -0.31, 0.46],
      [-0.18, 0.72, 0.29],
      [0.37, 0.15, -0.63],
    ],
    activation: [0.84, 0.58, 0.72],
  },
  {
    id: "reasoning-core",
    label: "Reasoning Core",
    weights: [
      [0.61, -0.42, 0.78, -0.16],
      [-0.33, 0.56, 0.24, 0.67],
      [0.19, 0.38, -0.51, 0.45],
    ],
    activation: [0.76, 0.64, 0.53, 0.81],
  },
  {
    id: "decision-layer",
    label: "Decision Layer",
    weights: [
      [0.73, -0.22],
      [0.48, 0.31],
      [-0.41, 0.69],
      [0.27, -0.35],
    ],
    activation: [0.88, 0.42],
  },
];

const meta = {
  title: "AI + Intelligence/Neural Weight Visualization",
  component: NeuralWeightVisualization,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct rendering of the public NeuralWeightVisualization export with deterministic weights and activation data.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    highlightThreshold: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
    },
    precision: {
      control: { type: "range", min: 0, max: 4, step: 1 },
    },
    maxHeight: { control: false },
  },
} satisfies Meta<typeof NeuralWeightVisualization>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    layers: representativeLayers,
    highlightThreshold: 0.7,
    precision: 2,
    compact: false,
    contained: false,
  },
};

export const Compact: Story = {
  args: {
    layers: representativeLayers,
    highlightThreshold: 0.7,
    precision: 2,
    compact: true,
    contained: true,
    maxHeight: 320,
  },
};
