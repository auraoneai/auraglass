import type { Meta, StoryObj } from '@storybook/react';
import { GlassCoherenceIndicator, type CoherenceData } from './GlassCoherenceIndicator';

const mockHistoricalData: CoherenceData[] = Array.from({ length: 20 }, (_, i) => ({
  timestamp: Date.now() - (20 - i) * 1000,
  coherence: 0.8 - Math.random() * 0.3,
  phase: (i * 0.3) % (2 * Math.PI),
  amplitude: 0.7 + Math.random() * 0.2,
  frequency: 1.0,
  decoherenceRate: 0.02 + Math.random() * 0.01,
  entanglementStrength: Math.random() * 0.5
}));

const meta = {
  title: 'Effects + Advanced/Glass Coherence Indicator',
  component: GlassCoherenceIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    coherenceLevel: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    phase: {
      control: { type: 'range', min: 0, max: 6.28, step: 0.1 },
    },
    decoherenceRate: {
      control: { type: 'range', min: 0, max: 0.1, step: 0.005 },
    },
    entanglementStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    coherenceThreshold: {
      control: { type: 'range', min: 0.1, max: 0.9, step: 0.1 },
    },
    animationSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
  },
} satisfies Meta<typeof GlassCoherenceIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 4,
    decoherenceRate: 0.02,
    entanglementStrength: 0.3,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
  },
};

export const HighCoherence: Story = {
  args: {
    coherenceLevel: 0.95,
    phase: 0,
    decoherenceRate: 0.01,
    entanglementStrength: 0.8,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
    realTimeMode: false,
  },
};

export const LowCoherence: Story = {
  args: {
    coherenceLevel: 0.2,
    phase: Math.PI,
    decoherenceRate: 0.08,
    entanglementStrength: 0.1,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
    alertOnDecoherence: true,
  },
};

export const RealTimeMode: Story = {
  args: {
    coherenceLevel: 0.6,
    phase: Math.PI / 2,
    decoherenceRate: 0.03,
    entanglementStrength: 0.4,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
    alertOnDecoherence: true,
  },
};

export const FastDecoherence: Story = {
  args: {
    coherenceLevel: 0.8,
    phase: 0,
    decoherenceRate: 0.1,
    entanglementStrength: 0.2,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    alertOnDecoherence: true,
  },
};

export const SlowDecoherence: Story = {
  args: {
    coherenceLevel: 0.9,
    phase: Math.PI / 6,
    decoherenceRate: 0.005,
    entanglementStrength: 0.6,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
  },
};

export const HighEntanglement: Story = {
  args: {
    coherenceLevel: 0.8,
    phase: Math.PI / 3,
    decoherenceRate: 0.02,
    entanglementStrength: 0.9,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showEntanglement: true,
    realTimeMode: true,
  },
};

export const NoEntanglement: Story = {
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 4,
    decoherenceRate: 0.02,
    entanglementStrength: 0,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showEntanglement: false,
  },
};

export const MinimalView: Story = {
  args: {
    coherenceLevel: 0.5,
    showPhaseIndicator: false,
    showWaveVisualization: false,
    showDecoherenceRate: false,
    showEntanglement: false,
  },
};

export const PhaseIndicatorOnly: Story = {
  args: {
    coherenceLevel: 0.8,
    phase: Math.PI * 1.5,
    showPhaseIndicator: true,
    showWaveVisualization: false,
    showDecoherenceRate: false,
    showEntanglement: false,
    realTimeMode: true,
    animationSpeed: 2,
  },
};

export const WaveVisualizationOnly: Story = {
  args: {
    coherenceLevel: 0.6,
    phase: Math.PI / 2,
    entanglementStrength: 0.4,
    showPhaseIndicator: false,
    showWaveVisualization: true,
    showDecoherenceRate: false,
    showEntanglement: false,
    realTimeMode: true,
  },
};

export const WithHistoricalData: Story = {
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 4,
    decoherenceRate: 0.02,
    entanglementStrength: 0.3,
    historicalData: mockHistoricalData,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    showEntanglement: true,
    realTimeMode: true,
  },
};

export const CriticalThreshold: Story = {
  args: {
    coherenceLevel: 0.25,
    phase: Math.PI,
    decoherenceRate: 0.05,
    coherenceThreshold: 0.3,
    alertOnDecoherence: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    realTimeMode: true,
  },
};

export const FastAnimation: Story = {
  args: {
    coherenceLevel: 0.8,
    phase: 0,
    decoherenceRate: 0.02,
    entanglementStrength: 0.5,
    animationSpeed: 3,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
  },
};

export const SlowAnimation: Story = {
  args: {
    coherenceLevel: 0.7,
    phase: Math.PI / 6,
    decoherenceRate: 0.02,
    entanglementStrength: 0.4,
    animationSpeed: 0.3,
    realTimeMode: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
  },
};

export const HighThreshold: Story = {
  args: {
    coherenceLevel: 0.6,
    phase: Math.PI / 4,
    decoherenceRate: 0.03,
    coherenceThreshold: 0.7,
    alertOnDecoherence: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    realTimeMode: true,
  },
};

export const LowThreshold: Story = {
  args: {
    coherenceLevel: 0.4,
    phase: Math.PI / 2,
    decoherenceRate: 0.04,
    coherenceThreshold: 0.2,
    alertOnDecoherence: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    realTimeMode: true,
  },
};

export const DecoherentState: Story = {
  args: {
    coherenceLevel: 0.1,
    phase: Math.PI * 1.7,
    decoherenceRate: 0.08,
    entanglementStrength: 0.05,
    coherenceThreshold: 0.3,
    alertOnDecoherence: true,
    showPhaseIndicator: true,
    showWaveVisualization: true,
    showDecoherenceRate: true,
    realTimeMode: false,
  },
};