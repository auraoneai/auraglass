import type { Meta, StoryObj } from '@storybook/react';
import { GlassVortexPortal } from './GlassVortexPortal';

const meta = {
  title: 'Effects + Advanced/Glass Vortex Portal',
  component: GlassVortexPortal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 400, max: 800, step: 50 },
    },
    height: {
      control: { type: 'range', min: 400, max: 800, step: 50 },
    },
    radius: {
      control: { type: 'range', min: 50, max: 300, step: 10 },
    },
    intensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    rotationSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
    type: {
      control: { type: 'select' },
      options: ['dimensional', 'energy', 'void', 'quantum', 'temporal'],
    },
    colorScheme: {
      control: { type: 'select' },
      options: ['blue', 'purple', 'green', 'red', 'gold', 'cosmic'],
    },
  },
} satisfies Meta<typeof GlassVortexPortal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 600,
    height: 600,
    radius: 150,
    active: true,
    showControls: true,
    interactive: true,
  },
};

export const DimensionalPortal: Story = {
  args: {
    width: 500,
    height: 500,
    type: 'dimensional',
    colorScheme: 'blue',
    radius: 120,
    intensity: 0.9,
    pulsing: true,
    showDistortion: true,
  },
};

export const EnergyVortex: Story = {
  args: {
    width: 600,
    height: 600,
    type: 'energy',
    colorScheme: 'gold',
    radius: 180,
    rotationSpeed: 2,
    energyLevel: 1.5,
    particleCount: 150,
  },
};

export const VoidPortal: Story = {
  args: {
    width: 400,
    height: 400,
    type: 'void',
    colorScheme: 'purple',
    radius: 100,
    intensity: 0.7,
    showEventHorizon: true,
    distortionIntensity: 0.8,
  },
};

export const QuantumTunnel: Story = {
  args: {
    width: 700,
    height: 500,
    type: 'quantum',
    colorScheme: 'cosmic',
    radius: 200,
    ringCount: 12,
    pulsing: true,
    pulseFrequency: 3,
  },
};

export const TemporalRift: Story = {
  args: {
    width: 550,
    height: 550,
    type: 'temporal',
    colorScheme: 'green',
    radius: 160,
    depth: 15,
    showDistortion: true,
    distortionIntensity: 0.6,
  },
};

export const RedVortex: Story = {
  args: {
    width: 500,
    height: 500,
    colorScheme: 'red',
    radius: 140,
    intensity: 0.8,
    rotationSpeed: 1.5,
    particleCount: 120,
    interactive: true,
  },
};

export const OpeningPortal: Story = {
  args: {
    width: 600,
    height: 600,
    opening: true,
    radius: 150,
    colorScheme: 'blue',
    showControls: false,
  },
};

export const ClosingPortal: Story = {
  args: {
    width: 600,
    height: 600,
    closing: true,
    radius: 150,
    colorScheme: 'red',
    showControls: false,
  },
};

export const MinimalPortal: Story = {
  args: {
    width: 300,
    height: 300,
    radius: 80,
    showControls: false,
    showEventHorizon: false,
    showDistortion: false,
    pulsing: false,
    ringCount: 5,
  },
};

export const HighIntensityVortex: Story = {
  args: {
    width: 700,
    height: 700,
    radius: 250,
    intensity: 1,
    rotationSpeed: 2.5,
    ringCount: 15,
    particleCount: 200,
    depth: 20,
    energyLevel: 2,
  },
};

export const InteractivePlayground: Story = {
  args: {
    width: 800,
    height: 600,
    radius: 200,
    interactive: true,
    showControls: true,
    debug: true,
    pulsing: true,
    showDistortion: true,
    colorScheme: 'cosmic',
  },
};

export const SlowMotionVortex: Story = {
  args: {
    width: 500,
    height: 500,
    radius: 130,
    rotationSpeed: 0.3,
    timeScale: 0.5,
    pulsing: true,
    pulseFrequency: 1,
    showDistortion: true,
  },
};