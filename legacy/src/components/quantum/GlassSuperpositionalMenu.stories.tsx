import type { Meta, StoryObj } from '@storybook/react';
import { GlassSuperpositionalMenu, type QuantumMenuState } from './GlassSuperpositionalMenu';

const mockQuantumStates: QuantumMenuState[] = [
  {
    id: 'state1',
    label: 'Navigation Menu',
    icon: '🧭',
    probability: 0.3,
    energy: 0.8,
    coherence: 0.9,
    subStates: [
      { id: 'nav1', label: 'Home', probability: 0.4, energy: 0.2, coherence: 0.8 },
      { id: 'nav2', label: 'About', probability: 0.3, energy: 0.3, coherence: 0.7 },
      { id: 'nav3', label: 'Contact', probability: 0.3, energy: 0.4, coherence: 0.6 }
    ]
  },
  {
    id: 'state2',
    label: 'Settings Panel',
    icon: '⚙️',
    probability: 0.25,
    energy: 0.6,
    coherence: 0.85,
  },
  {
    id: 'state3',
    label: 'User Profile',
    icon: '👤',
    probability: 0.2,
    energy: 0.4,
    coherence: 0.8,
  },
  {
    id: 'state4',
    label: 'Search Interface',
    icon: '🔍',
    probability: 0.15,
    energy: 0.7,
    coherence: 0.75,
  },
  {
    id: 'state5',
    label: 'Notifications',
    icon: '🔔',
    probability: 0.1,
    energy: 0.9,
    coherence: 0.7,
  }
];

const entangledStates: QuantumMenuState[] = [
  {
    id: 'particle1',
    label: 'Spin Up',
    icon: '⬆️',
    probability: 0.5,
    energy: 0.5,
    coherence: 0.9,
    entangled: ['particle2']
  },
  {
    id: 'particle2',
    label: 'Spin Down',
    icon: '⬇️',
    probability: 0.5,
    energy: 0.5,
    coherence: 0.9,
    entangled: ['particle1']
  },
  {
    id: 'photon1',
    label: 'Polarization A',
    icon: '💫',
    probability: 0.4,
    energy: 0.8,
    coherence: 0.85,
    entangled: ['photon2']
  },
  {
    id: 'photon2',
    label: 'Polarization B',
    icon: '⭐',
    probability: 0.6,
    energy: 0.8,
    coherence: 0.85,
    entangled: ['photon1']
  }
];

const complexStates: QuantumMenuState[] = [
  {
    id: 'complex1',
    label: 'Main Dashboard',
    icon: '📊',
    probability: 0.4,
    energy: 0.6,
    coherence: 0.9,
    subStates: [
      { id: 'dash1', label: 'Analytics', probability: 0.5, energy: 0.4, coherence: 0.8 },
      { id: 'dash2', label: 'Reports', probability: 0.3, energy: 0.5, coherence: 0.7 },
      { id: 'dash3', label: 'Metrics', probability: 0.2, energy: 0.6, coherence: 0.6 }
    ]
  },
  {
    id: 'complex2',
    label: 'File Manager',
    icon: '📁',
    probability: 0.3,
    energy: 0.4,
    coherence: 0.8,
    entangled: ['complex3']
  },
  {
    id: 'complex3',
    label: 'Data Processor',
    icon: '⚡',
    probability: 0.2,
    energy: 0.8,
    coherence: 0.75,
    entangled: ['complex2']
  },
  {
    id: 'complex4',
    label: 'AI Assistant',
    icon: '🤖',
    probability: 0.1,
    energy: 0.9,
    coherence: 0.6,
  }
];

const meta = {
  title: 'Effects + Advanced/Glass Superpositional Menu',
  component: GlassSuperpositionalMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    measurementType: {
      control: { type: 'select' },
      options: ['collapse', 'decoherence', 'interference'],
    },
    coherenceDecay: {
      control: { type: 'range', min: 0, max: 0.1, step: 0.005 },
    },
    entanglementStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    maxSuperpositions: {
      control: { type: 'range', min: 2, max: 10, step: 1 },
    },
  },
} satisfies Meta<typeof GlassSuperpositionalMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    menuStates: mockQuantumStates,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const ObservedState: Story = {
  args: {
    menuStates: mockQuantumStates,
    isObserved: true,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: false,
  },
};

export const EntangledSystem: Story = {
  args: {
    menuStates: entangledStates,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
    entanglementStrength: 0.8,
  },
};

export const FastDecoherence: Story = {
  args: {
    menuStates: mockQuantumStates,
    coherenceDecay: 0.05,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const SlowDecoherence: Story = {
  args: {
    menuStates: mockQuantumStates,
    coherenceDecay: 0.01,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const CollapseMode: Story = {
  args: {
    menuStates: mockQuantumStates,
    measurementType: 'collapse',
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const DecoherenceMode: Story = {
  args: {
    menuStates: mockQuantumStates,
    measurementType: 'decoherence',
    coherenceDecay: 0.03,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const InterferenceMode: Story = {
  args: {
    menuStates: mockQuantumStates,
    measurementType: 'interference',
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const MinimalVisualization: Story = {
  args: {
    menuStates: mockQuantumStates,
    visualizeWaveFunction: false,
    showProbabilities: false,
    showQuantumNoise: false,
  },
};

export const ComplexSystem: Story = {
  args: {
    menuStates: complexStates,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
    entanglementStrength: 0.6,
  },
};

export const LimitedSuperpositions: Story = {
  args: {
    menuStates: mockQuantumStates,
    maxSuperpositions: 3,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const HighCoherence: Story = {
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      coherence: 0.95
    })),
    coherenceDecay: 0.01,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const LowCoherence: Story = {
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      coherence: 0.3
    })),
    coherenceDecay: 0.04,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const UniformProbabilities: Story = {
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      probability: 0.2
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const SkewedProbabilities: Story = {
  args: {
    menuStates: [
      { ...mockQuantumStates[0], probability: 0.7 },
      { ...mockQuantumStates[1], probability: 0.2 },
      { ...mockQuantumStates[2], probability: 0.08 },
      { ...mockQuantumStates[3], probability: 0.02 }
    ],
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const HighEnergyStates: Story = {
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      energy: 0.9
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const LowEnergyStates: Story = {
  args: {
    menuStates: mockQuantumStates.map(state => ({
      ...state,
      energy: 0.1
    })),
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const StrongEntanglement: Story = {
  args: {
    menuStates: entangledStates,
    entanglementStrength: 1.0,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};

export const WeakEntanglement: Story = {
  args: {
    menuStates: entangledStates,
    entanglementStrength: 0.2,
    visualizeWaveFunction: true,
    showProbabilities: true,
    showQuantumNoise: true,
  },
};