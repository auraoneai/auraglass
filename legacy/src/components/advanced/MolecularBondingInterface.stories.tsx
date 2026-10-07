import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import {
  MolecularBondingInterface,
  type MolecularBond,
  type MoleculeNode,
} from "./MolecularBondingInterface";

const representativeMolecules: MoleculeNode[] = [
  {
    id: "c",
    symbol: "C",
    name: "Carbon",
    charge: 0,
    valence: 4,
    electronegativity: 2.55,
  },
  {
    id: "o",
    symbol: "O",
    name: "Oxygen",
    charge: -1,
    valence: 2,
    electronegativity: 3.44,
  },
  {
    id: "h",
    symbol: "H",
    name: "Hydrogen",
    charge: 1,
    valence: 1,
    electronegativity: 2.2,
  },
  {
    id: "n",
    symbol: "N",
    name: "Nitrogen",
    charge: 0,
    valence: 3,
    electronegativity: 3.04,
  },
];

const representativeBonds: MolecularBond[] = [
  {
    id: "c-o",
    from: "c",
    to: "o",
    strength: 0.86,
    type: "covalent",
    resonance: 0.62,
  },
  {
    id: "o-h",
    from: "o",
    to: "h",
    strength: 0.71,
    type: "hydrogen",
    resonance: 0.38,
  },
  {
    id: "c-n",
    from: "c",
    to: "n",
    strength: 0.77,
    type: "ionic",
    resonance: 0.49,
  },
];

const meta = {
  title: "Effects + Advanced/Molecular Bonding Interface",
  component: MolecularBondingInterface,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Direct rendering of the public MolecularBondingInterface export with a deterministic molecule and bond network.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    onInspectBond: fn(),
  },
  argTypes: {
    onInspectBond: { action: undefined },
  },
} satisfies Meta<typeof MolecularBondingInterface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    molecules: representativeMolecules,
    bonds: representativeBonds,
  },
};

export const CompactNetwork: Story = {
  args: {
    molecules: representativeMolecules.slice(0, 3),
    bonds: representativeBonds.slice(0, 2),
  },
};
