import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassQuantumField as GlassQuantumFieldComponent,
  type GlassQuantumFieldProps,
} from "./GlassQuantumField";

const meta = {
  title: "Effects + Advanced/Glass Quantum Field",
  component: GlassQuantumFieldComponent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A live mount of GlassQuantumField configured as a compact, motion-stable quantum particle visualization.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassQuantumFieldComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const stableQuantumFieldArgs = {
  width: 280,
  height: 210,
  particleCount: 12,
  fieldResolution: 40,
  coherence: 0.82,
  entanglementStrength: 0.5,
  uncertaintyLevel: 0.34,
  energyLevel: 0.68,
  showWaveFunctions: true,
  showProbabilityClouds: true,
  showEntanglement: true,
  showMeasurement: false,
  simulationType: "particle",
  timeEvolution: false,
  temperature: 0.08,
  externalField: 0.2,
  showControls: false,
  showQuantumInfo: false,
  respectMotionPreference: true,
} satisfies GlassQuantumFieldProps;

export const GlassQuantumField: Story = {
  args: stableQuantumFieldArgs,
};
