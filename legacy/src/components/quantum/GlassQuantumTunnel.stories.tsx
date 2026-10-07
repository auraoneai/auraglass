import type { Meta, StoryObj } from '@storybook/react';
import { GlassQuantumTunnel, type QuantumState, type TunnelBarrier } from './GlassQuantumTunnel';

const mockQuantumStates: QuantumState[] = [
  {
    id: 'state1',
    label: 'Ground State',
    icon: '⚪',
    position: { x: 100, y: 150, z: 0 },
    waveFunction: 0.8,
    energy: 1.0,
    barrierHeight: 3.0,
    tunnelingProbability: 0.3,
    isActive: true,
    connections: ['state2', 'state3']
  },
  {
    id: 'state2',
    label: 'Excited State',
    icon: '🔴',
    position: { x: 300, y: 100, z: 0 },
    waveFunction: 0.6,
    energy: 2.5,
    barrierHeight: 3.0,
    tunnelingProbability: 0.7,
    isActive: true,
    connections: ['state1', 'state4']
  },
  {
    id: 'state3',
    label: 'Metastable',
    icon: '🟡',
    position: { x: 200, y: 200, z: 0 },
    waveFunction: -0.4,
    energy: 1.8,
    barrierHeight: 4.0,
    tunnelingProbability: 0.5,
    isActive: true,
    connections: ['state1', 'state4']
  },
  {
    id: 'state4',
    label: 'High Energy',
    icon: '🔵',
    position: { x: 500, y: 120, z: 0 },
    waveFunction: 0.9,
    energy: 4.0,
    barrierHeight: 2.0,
    tunnelingProbability: 0.9,
    isActive: true,
    connections: ['state2', 'state3']
  }
];

const mockBarriers: TunnelBarrier[] = [
  {
    id: 'barrier1',
    height: 3.0,
    width: 30,
    position: { x: 200, y: 0 },
    transparency: 0.6,
    quantumCoherence: 0.8
  },
  {
    id: 'barrier2',
    height: 4.0,
    width: 40,
    position: { x: 400, y: 0 },
    transparency: 0.7,
    quantumCoherence: 0.6
  }
];

const highEnergyStates: QuantumState[] = mockQuantumStates.map(state => ({
  ...state,
  energy: state.energy + 2,
  tunnelingProbability: Math.min(0.95, state.tunnelingProbability + 0.3)
}));

const lowEnergyStates: QuantumState[] = mockQuantumStates.map(state => ({
  ...state,
  energy: Math.max(0.5, state.energy - 1),
  tunnelingProbability: Math.max(0.1, state.tunnelingProbability - 0.4)
}));

const complexSystem: QuantumState[] = [
  ...mockQuantumStates,
  {
    id: 'state5',
    label: 'Virtual State',
    icon: '👻',
    position: { x: 150, y: 250, z: 0 },
    waveFunction: 0.3,
    energy: 0.8,
    barrierHeight: 5.0,
    tunnelingProbability: 0.2,
    isActive: true,
    connections: ['state1', 'state3']
  },
  {
    id: 'state6',
    label: 'Resonance',
    icon: '⭐',
    position: { x: 350, y: 180, z: 0 },
    waveFunction: -0.7,
    energy: 3.2,
    barrierHeight: 1.5,
    tunnelingProbability: 0.8,
    isActive: true,
    connections: ['state2', 'state4', 'state5']
  }
];

const meta = {
  title: 'Effects + Advanced/Glass Quantum Tunnel',
  component: GlassQuantumTunnel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tunnelingSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
    waveAmplitude: {
      control: { type: 'range', min: 5, max: 50, step: 5 },
    },
    coherenceDecay: {
      control: { type: 'range', min: 0, max: 0.1, step: 0.005 },
    },
  },
} satisfies Meta<typeof GlassQuantumTunnel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    animateTransitions: true,
    realTimeMode: true,
  },
};

export const RealTimeMode: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    realTimeMode: true,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    animateTransitions: true,
    tunnelingSpeed: 1.5,
  },
};

export const HighEnergyStates: Story = {
  args: {
    quantumStates: highEnergyStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: true,
  },
};

export const LowEnergyStates: Story = {
  args: {
    quantumStates: lowEnergyStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: true,
  },
};

export const NoBarriers: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: [],
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: false,
    realTimeMode: true,
  },
};

export const WaveFunctionOnly: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: true,
    showTunnelingProbability: false,
    showEnergyLevels: false,
    showBarriers: false,
    realTimeMode: true,
  },
};

export const EnergyLevelsOnly: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: false,
    showTunnelingProbability: false,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: false,
  },
};

export const MinimalVisualization: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    showWaveFunction: false,
    showTunnelingProbability: false,
    showEnergyLevels: false,
    showBarriers: false,
    animateTransitions: false,
    realTimeMode: false,
  },
};

export const ComplexSystem: Story = {
  args: {
    quantumStates: complexSystem,
    barriers: [
      ...mockBarriers,
      {
        id: 'barrier3',
        height: 2.5,
        width: 25,
        position: { x: 250, y: 0 },
        transparency: 0.5,
        quantumCoherence: 0.9
      }
    ],
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
    realTimeMode: true,
  },
};

export const FastTunneling: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    tunnelingSpeed: 3,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true,
  },
};

export const SlowTunneling: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    tunnelingSpeed: 0.3,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true,
  },
};

export const HighAmplitude: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    waveAmplitude: 40,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true,
  },
};

export const LowAmplitude: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    waveAmplitude: 10,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true,
  },
};

export const FastCoherenceDecay: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    coherenceDecay: 0.08,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true,
  },
};

export const SlowCoherenceDecay: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    coherenceDecay: 0.01,
    showWaveFunction: true,
    showTunnelingProbability: true,
    realTimeMode: true,
  },
};

export const ThickBarriers: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers.map(barrier => ({
      ...barrier,
      width: barrier.width * 2,
      height: barrier.height * 1.5
    })),
    showWaveFunction: true,
    showTunnelingProbability: true,
    showBarriers: true,
    realTimeMode: true,
  },
};

export const ThinBarriers: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers.map(barrier => ({
      ...barrier,
      width: Math.max(5, barrier.width * 0.3),
      height: barrier.height * 0.7
    })),
    showWaveFunction: true,
    showTunnelingProbability: true,
    showBarriers: true,
    realTimeMode: true,
  },
};

export const SingleState: Story = {
  args: {
    quantumStates: [mockQuantumStates[0]],
    barriers: [],
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    realTimeMode: false,
  },
};

export const StaticMode: Story = {
  args: {
    quantumStates: mockQuantumStates,
    barriers: mockBarriers,
    realTimeMode: false,
    animateTransitions: false,
    showWaveFunction: true,
    showTunnelingProbability: true,
    showEnergyLevels: true,
    showBarriers: true,
  },
};