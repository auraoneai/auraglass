import type { Meta, StoryObj } from "@storybook/react";

import {
  QuantumEntanglementVisualizer,
  type QuantumEntanglementPair,
} from "./QuantumEntanglementVisualizer";

const representativePairs: QuantumEntanglementPair[] = [
  {
    id: "qubit-a1",
    nodes: ["Q1", "Q9"],
    fidelity: 0.96,
    phaseCorrelation: 0.9,
    state: "entangled",
    latency: 3.8,
  },
  {
    id: "qubit-b4",
    nodes: ["Q4", "Q12"],
    fidelity: 0.72,
    phaseCorrelation: 0.61,
    state: "decohering",
    latency: 6.4,
  },
  {
    id: "qubit-c2",
    nodes: ["Q2", "Q7"],
    fidelity: 0.84,
    phaseCorrelation: 0.79,
    state: "entangled",
    latency: 4.9,
  },
  {
    id: "qubit-d6",
    nodes: ["Q6", "Q14"],
    fidelity: 0.41,
    phaseCorrelation: 0.33,
    state: "collapsed",
    latency: 8.7,
  },
];

const meta = {
  title: "Effects + Advanced/Quantum Entanglement Visualizer",
  component: QuantumEntanglementVisualizer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct rendering of the public QuantumEntanglementVisualizer export across entangled, decohering, and collapsed states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    highlightThreshold: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
    },
  },
} satisfies Meta<typeof QuantumEntanglementVisualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pairs: representativePairs,
    highlightThreshold: 0.7,
  },
};

export const DerivedStates: Story = {
  args: {
    pairs: representativePairs.map(({ state: _state, ...pair }) => pair),
    highlightThreshold: 0.75,
  },
};
