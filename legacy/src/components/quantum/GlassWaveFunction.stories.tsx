import type { Meta, StoryObj } from "@storybook/react";
import {
  GlassWaveFunction as GlassWaveFunctionComponent,
  type GlassWaveFunctionProps,
  type WaveEquation,
} from "./GlassWaveFunction";

const stableWaves = [
  {
    id: "carrier",
    name: "Carrier",
    type: "sine",
    amplitude: 0.86,
    frequency: 0.8,
    phase: 0,
    wavelength: 96,
    velocity: 24,
    damping: 0,
    color: "rgba(255, 255, 255, 0.92)",
  },
  {
    id: "harmonic",
    name: "Harmonic",
    type: "cosine",
    amplitude: 0.54,
    frequency: 1.3,
    phase: Math.PI / 3,
    wavelength: 64,
    velocity: 18,
    damping: 0,
    color: "rgba(255, 255, 255, 0.64)",
  },
] satisfies WaveEquation[];

const meta = {
  title: "Effects + Advanced/Glass Wave Function",
  component: GlassWaveFunctionComponent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A live mount of GlassWaveFunction with deterministic equations and time evolution disabled for stable visual certification.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassWaveFunctionComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const stableWaveFunctionArgs = {
  width: 280,
  height: 180,
  waveEquations: stableWaves,
  showInterference: true,
  showPhaseSpace: false,
  showAmplitude: true,
  showFrequencySpectrum: false,
  resolution: 2,
  timeScale: 1,
  showGrid: true,
  showLabels: true,
  realTimeMode: false,
} satisfies GlassWaveFunctionProps;

export const GlassWaveFunction: Story = {
  args: stableWaveFunctionArgs,
};
