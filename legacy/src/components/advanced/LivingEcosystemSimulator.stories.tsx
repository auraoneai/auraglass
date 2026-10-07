import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import {
  LivingEcosystemSimulator,
  type EcosystemLayer,
} from "./LivingEcosystemSimulator";

const representativeLayers: EcosystemLayer[] = [
  {
    id: "cloud-forest",
    name: "Cloud Forest",
    health: 91,
    trend: 5,
    biodiversity: 0.86,
    status: "thriving",
    description: "Canopy moisture, pollinator traffic, and nesting density.",
  },
  {
    id: "grassland",
    name: "Open Grassland",
    health: 72,
    trend: 2,
    biodiversity: 0.69,
    status: "stable",
    description: "Grazing balance, seed dispersal, and soil carbon signals.",
  },
  {
    id: "wetland",
    name: "Coastal Wetland",
    health: 56,
    trend: -2,
    biodiversity: 0.58,
    status: "recovering",
    description: "Salinity, tidal exchange, and migratory bird activity.",
  },
  {
    id: "coral-shelf",
    name: "Coral Shelf",
    health: 39,
    trend: -6,
    biodiversity: 0.43,
    status: "critical",
    description: "Thermal stress, reef cover, and juvenile fish counts.",
  },
];

const meta = {
  title: "Effects + Advanced/Living Ecosystem Simulator",
  component: LivingEcosystemSimulator,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct rendering of the public LivingEcosystemSimulator export across every supported habitat state.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onSelectLayer: fn(),
  },
  argTypes: {
    onSelectLayer: { action: undefined },
    highlightThreshold: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof LivingEcosystemSimulator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Living Ecosystem Simulator",
    layers: representativeLayers,
    highlightThreshold: 45,
  },
};

export const RecoveryProgram: Story = {
  args: {
    title: "Habitat Recovery Program",
    layers: representativeLayers.map((layer) => ({
      ...layer,
      health: Math.min(100, layer.health + 12),
      trend: Math.max(1, layer.trend ?? 0),
      status: undefined,
    })),
    highlightThreshold: 45,
  },
};
