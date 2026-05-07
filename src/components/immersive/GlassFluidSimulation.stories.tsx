import type { Meta, StoryObj } from '@storybook/react';
import { GlassFluidSimulation } from './GlassFluidSimulation';
import { fn } from 'storybook/test';

const meta = {
  title: 'Effects + Advanced/Glass Fluid Simulation',
  component: GlassFluidSimulation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: fn(), onForceChange: fn() },
  argTypes: {
    // Avoid color control for non-string tuple
    fluidColor: { control: false },
    width: {
      control: { type: 'range', min: 400, max: 1200, step: 50 },
    },
    height: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    particleCount: {
      control: { type: 'range', min: 50, max: 500, step: 10 },
    },
    viscosity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    gravity: {
      control: { type: 'range', min: -1, max: 2, step: 0.1 },
    },
    preset: {
      control: { type: 'select' },
      options: ['water', 'honey', 'mercury', 'gas', 'plasma'],
    },
  },
} satisfies Meta<typeof GlassFluidSimulation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 800,
    height: 600,
    particleCount: 200,
    showControls: true,
    interactive: true,
  },
};

export const WaterSimulation: Story = {
  args: {
    width: 600,
    height: 400,
    preset: 'water',
    particleCount: 150,
    showTrails: true,
    interactive: true,
  },
};

export const HoneyFlow: Story = {
  args: {
    width: 500,
    height: 400,
    preset: 'honey',
    particleCount: 100,
    viscosity: 0.8,
    gravity: 0.3,
    showTrails: false,
  },
};

export const MercuryDroplets: Story = {
  args: {
    width: 400,
    height: 300,
    preset: 'mercury',
    particleCount: 80,
    gravity: 0.8,
    interactive: true,
  },
};

export const GasCloud: Story = {
  args: {
    width: 700,
    height: 500,
    preset: 'gas',
    particleCount: 300,
    gravity: -0.1,
    showTrails: true,
    trailLength: 20,
  },
};

export const PlasmaField: Story = {
  args: {
    width: 800,
    height: 600,
    preset: 'plasma',
    particleCount: 250,
    showTrails: true,
    interactive: true,
    forces: [
      {
        x: 200,
        y: 300,
        strength: 15,
        type: 'vortex',
        radius: 100,
        id: 'vortex1'
      },
      {
        x: 600,
        y: 300,
        strength: 10,
        type: 'pull',
        radius: 80,
        id: 'pull1'
      }
    ],
  },
};

export const InteractivePlayground: Story = {
  args: {
    width: 900,
    height: 700,
    particleCount: 300,
    interactive: true,
    showControls: true,
    debug: true,
    showTrails: true,
    forceStrength: 2,
  },
};

export const MinimalFluid: Story = {
  args: {
    width: 400,
    height: 300,
    particleCount: 100,
    showControls: false,
    showTrails: false,
    interactive: false,
    backgroundColor: 'transparent',
  },
};

export const HighViscosity: Story = {
  args: {
    width: 600,
    height: 400,
    particleCount: 150,
    viscosity: 0.9,
    damping: 0.9,
    gravity: 0.2,
    showTrails: true,
  },
};

export const ZeroGravity: Story = {
  args: {
    width: 700,
    height: 500,
    particleCount: 200,
    gravity: 0,
    interactive: true,
    forces: [
      {
        x: 350,
        y: 250,
        strength: 20,
        type: 'vortex',
        radius: 150,
        id: 'center-vortex'
      }
    ],
  },
};

export const MultiForceField: Story = {
  args: {
    width: 800,
    height: 600,
    particleCount: 250,
    interactive: true,
    forces: [
      {
        x: 200,
        y: 200,
        strength: 12,
        type: 'push',
        radius: 60,
        id: 'push1'
      },
      {
        x: 600,
        y: 200,
        strength: 12,
        type: 'pull',
        radius: 60,
        id: 'pull1'
      },
      {
        x: 200,
        y: 400,
        strength: 15,
        type: 'vortex',
        radius: 80,
        id: 'vortex1'
      },
      {
        x: 600,
        y: 400,
        strength: 8,
        type: 'wave',
        radius: 70,
        id: 'wave1'
      }
    ],
  },
};