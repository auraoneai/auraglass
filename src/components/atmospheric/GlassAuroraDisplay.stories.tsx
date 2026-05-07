import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { GlassAuroraDisplay } from './GlassAuroraDisplay';

const meta = {
  title: 'Effects + Advanced/Glass Aurora Display',
  component: GlassAuroraDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onAuroraChange: fn(),
    onSolarEvent: fn(),
  },
  argTypes: {
    width: {
      control: { type: 'range', min: 400, max: 1200, step: 50 },
    },
    height: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    intensity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    solarWindStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    geomagneticActivity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    observationTime: {
      control: { type: 'range', min: 0, max: 24, step: 0.5 },
    },
    latitude: {
      control: { type: 'range', min: 0, max: 90, step: 5 },
    },
    colorPreset: {
      control: { type: 'select' },
      options: ['classic', 'rare', 'storm', 'sunset', 'cosmic'],
    },
    activityLevel: {
      control: { type: 'select' },
      options: ['low', 'moderate', 'high', 'storm'],
    },
  },
} satisfies Meta<typeof GlassAuroraDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 800,
    height: 500,
    showControls: true,
    showAuroraInfo: true,
    showStars: true,
    showSolarWind: true,
  },
};

export const ClassicAurora: Story = {
  args: {
    width: 700,
    height: 400,
    intensity: 0.8,
    colorPreset: 'classic',
    activityLevel: 'moderate',
    observationTime: 22,
    latitude: 65,
    showStars: true,
    showAtmosphericGlow: true,
  },
};

export const StormyAurora: Story = {
  args: {
    width: 800,
    height: 500,
    intensity: 1,
    colorPreset: 'storm',
    activityLevel: 'storm',
    solarWindStrength: 0.9,
    geomagneticActivity: 0.9,
    observationTime: 23,
    showSolarWind: true,
  },
};

export const RareColors: Story = {
  args: {
    width: 600,
    height: 350,
    intensity: 0.9,
    colorPreset: 'rare',
    activityLevel: 'high',
    latitude: 70,
    observationTime: 1,
    layerCount: 6,
  },
};

export const SunsetAurora: Story = {
  args: {
    width: 750,
    height: 450,
    intensity: 0.6,
    colorPreset: 'sunset',
    activityLevel: 'moderate',
    observationTime: 19,
    showAtmosphericGlow: true,
    waveComplexity: 1.5,
  },
};

export const CosmicDisplay: Story = {
  args: {
    width: 800,
    height: 600,
    intensity: 0.8,
    colorPreset: 'cosmic',
    activityLevel: 'high',
    solarWindStrength: 0.7,
    observationTime: 2,
    latitude: 75,
    layerCount: 5,
  },
};

export const LowActivity: Story = {
  args: {
    width: 500,
    height: 300,
    intensity: 0.3,
    activityLevel: 'low',
    solarWindStrength: 0.2,
    geomagneticActivity: 0.3,
    showSolarWind: false,
    layerCount: 2,
  },
};

export const HighLatitude: Story = {
  args: {
    width: 700,
    height: 400,
    intensity: 0.9,
    latitude: 85,
    activityLevel: 'high',
    observationTime: 0,
    colorPreset: 'classic',
    showStars: true,
  },
};

export const Midnight: Story = {
  args: {
    width: 600,
    height: 400,
    intensity: 0.7,
    observationTime: 0,
    colorPreset: 'classic',
    showStars: true,
    showAtmosphericGlow: true,
    activityLevel: 'moderate',
  },
};

export const DaytimeView: Story = {
  args: {
    width: 600,
    height: 350,
    intensity: 0.2,
    observationTime: 14,
    showStars: false,
    colorPreset: 'classic',
    activityLevel: 'low',
  },
};

export const ComplexWaves: Story = {
  args: {
    width: 800,
    height: 500,
    intensity: 0.8,
    waveComplexity: 2,
    layerCount: 6,
    colorPreset: 'cosmic',
    activityLevel: 'high',
    observationTime: 23,
  },
};

export const MinimalInterface: Story = {
  args: {
    width: 400,
    height: 250,
    showControls: false,
    showAuroraInfo: false,
    intensity: 0.6,
    colorPreset: 'classic',
    observationTime: 22,
  },
};

export const RealTimeMode: Story = {
  args: {
    width: 800,
    height: 500,
    realTimeMode: true,
    intensity: 0.5,
    colorPreset: 'storm',
    showSolarWind: true,
    activityLevel: 'moderate',
    observationTime: 21,
  },
};

export const NoStars: Story = {
  args: {
    width: 600,
    height: 400,
    showStars: false,
    showAtmosphericGlow: false,
    intensity: 0.9,
    colorPreset: 'rare',
    observationTime: 22,
  },
};

export const IntenseActivity: Story = {
  args: {
    width: 900,
    height: 600,
    intensity: 1,
    activityLevel: 'storm',
    solarWindStrength: 1,
    geomagneticActivity: 1,
    colorPreset: 'storm',
    layerCount: 8,
    waveComplexity: 2,
    observationTime: 1,
    latitude: 80,
  },
};
