import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlassProbabilityCloud, type ProbabilityPoint } from './GlassProbabilityCloud';

const mockProbabilityPoints: ProbabilityPoint[] = [
  {
    id: 'point1',
    x: 150,
    y: 100,
    z: 50,
    probability: 0.8,
    uncertainty: 0.3,
    waveFunction: 0.6,
    phase: Math.PI / 4,
    observationCount: 0
  },
  {
    id: 'point2',
    x: 300,
    y: 200,
    z: 80,
    probability: 0.6,
    uncertainty: 0.5,
    waveFunction: -0.4,
    phase: Math.PI / 2,
    observationCount: 2
  },
  {
    id: 'point3',
    x: 450,
    y: 150,
    z: 120,
    probability: 0.9,
    uncertainty: 0.2,
    waveFunction: 0.8,
    phase: 3 * Math.PI / 4,
    observationCount: 1
  },
  {
    id: 'point4',
    x: 200,
    y: 300,
    z: 90,
    probability: 0.4,
    uncertainty: 0.7,
    waveFunction: -0.3,
    phase: Math.PI,
    observationCount: 0
  }
];

const highUncertaintyPoints: ProbabilityPoint[] = mockProbabilityPoints.map(point => ({
  ...point,
  uncertainty: 0.8 + Math.random() * 0.2,
  waveFunction: (Math.random() - 0.5) * 2
}));

const lowUncertaintyPoints: ProbabilityPoint[] = mockProbabilityPoints.map(point => ({
  ...point,
  uncertainty: 0.1 + Math.random() * 0.1,
  probability: 0.7 + Math.random() * 0.3
}));

const meta: Meta<typeof GlassProbabilityCloud> = {
  title: 'Effects + Advanced/Glass Probability Cloud',
  component: GlassProbabilityCloud,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onMeasurement: fn(),
    onUncertaintyChange: fn(),
  },
  argTypes: {
    onMeasurement: { action: undefined },
    onUncertaintyChange: { action: undefined },
    width: {
      control: { type: 'range', min: 400, max: 1000, step: 50 },
    },
    height: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    particleCount: {
      control: { type: 'range', min: 20, max: 200, step: 10 },
    },
    heisenbergUncertainty: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
    },
    animationSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
    measurementPrecision: {
      control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    waveParticleDuality: true,
    showProbabilityDensity: true,
    showWaveFunction: true,
    showUncertaintyBounds: true,
    realTimeMode: true,
  },
};

export const RealTimeMode: Story = {
  args: {
    width: 700,
    height: 500,
    particleCount: 80,
    realTimeMode: true,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    waveParticleDuality: true,
    showProbabilityDensity: true,
    showWaveFunction: true,
    showUncertaintyBounds: true,
  },
};

export const HighUncertainty: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: highUncertaintyPoints,
    heisenbergUncertainty: 0.8,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    showUncertaintyBounds: true,
    realTimeMode: true,
  },
};

export const LowUncertainty: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: lowUncertaintyPoints,
    heisenbergUncertainty: 0.1,
    uncertaintyPrinciple: true,
    quantumFluctuations: false,
    showUncertaintyBounds: true,
    realTimeMode: true,
  },
};

export const WaveOnly: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    waveParticleDuality: false,
    showWaveFunction: true,
    showProbabilityDensity: true,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    realTimeMode: true,
  },
};

export const ParticleOnly: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: lowUncertaintyPoints,
    waveParticleDuality: false,
    showWaveFunction: false,
    showProbabilityDensity: false,
    showUncertaintyBounds: false,
    uncertaintyPrinciple: false,
    quantumFluctuations: false,
    realTimeMode: true,
  },
};

export const NoObserverEffect: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    observerEffect: false,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    realTimeMode: true,
  },
};

export const NoQuantumFluctuations: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    quantumFluctuations: false,
    uncertaintyPrinciple: false,
    observerEffect: true,
    realTimeMode: true,
  },
};

export const MinimalVisualization: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    showProbabilityDensity: false,
    showWaveFunction: false,
    showUncertaintyBounds: false,
    uncertaintyPrinciple: false,
    quantumFluctuations: false,
    observerEffect: false,
  },
};

export const ManyParticles: Story = {
  args: {
    width: 800,
    height: 600,
    particleCount: 150,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    realTimeMode: true,
  },
};

export const FewParticles: Story = {
  args: {
    width: 600,
    height: 400,
    particleCount: 20,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    realTimeMode: true,
  },
};

export const FastAnimation: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    animationSpeed: 3,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    realTimeMode: true,
  },
};

export const SlowAnimation: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    animationSpeed: 0.3,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    realTimeMode: true,
  },
};

export const PreciseMeasurement: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    measurementPrecision: 0.01,
    uncertaintyPrinciple: true,
    observerEffect: true,
    realTimeMode: true,
  },
};

export const ImpreciseMeasurement: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    measurementPrecision: 0.5,
    uncertaintyPrinciple: true,
    observerEffect: true,
    realTimeMode: true,
  },
};

export const LargeCanvas: Story = {
  args: {
    width: 900,
    height: 700,
    particleCount: 120,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    realTimeMode: true,
  },
};

export const SmallCanvas: Story = {
  args: {
    width: 400,
    height: 300,
    particleCount: 40,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    observerEffect: true,
    realTimeMode: true,
  },
};

export const StaticMode: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    realTimeMode: false,
    showProbabilityDensity: true,
    showWaveFunction: true,
    showUncertaintyBounds: true,
  },
};

export const QuantumTunneling: Story = {
  args: {
    width: 600,
    height: 400,
    probabilityPoints: mockProbabilityPoints,
    heisenbergUncertainty: 0.7,
    uncertaintyPrinciple: true,
    quantumFluctuations: true,
    waveParticleDuality: true,
    realTimeMode: true,
  },
};
