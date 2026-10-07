import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import {
  NeuromorphicLearningNetwork,
  type NeuromorphicSignal,
} from "./NeuromorphicLearningNetwork";

const representativeSignals: NeuromorphicSignal[] = [
  {
    channel: "visual cortex",
    weights: [0.68, -0.21, 0.54, 0.31, -0.17],
    phase: 0.76,
  },
  {
    channel: "reasoning lattice",
    weights: [0.72, -0.38, 0.44, 0.58, -0.29],
    phase: 0.64,
  },
  {
    channel: "motor planning",
    weights: [0.47, -0.16, 0.63, -0.25, 0.39],
    phase: 0.57,
  },
];

const meta = {
  title: "AI + Intelligence/Neuromorphic Learning Network",
  component: NeuromorphicLearningNetwork,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct rendering of the public NeuromorphicLearningNetwork export with stable signal telemetry.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onSnapshot: fn(),
  },
  argTypes: {
    autoSampleInterval: { control: false },
    onSnapshot: { action: undefined },
  },
} satisfies Meta<typeof NeuromorphicLearningNetwork>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    signals: representativeSignals,
  },
};

export const HighCoherence: Story = {
  args: {
    signals: representativeSignals.map((signal) => ({
      ...signal,
      weights: signal.weights.map((weight) => Math.abs(weight) * 0.72),
      phase: 0.52,
    })),
  },
};
