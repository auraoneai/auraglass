import type { Meta, StoryObj } from '@storybook/react';
import { GlassWeatherGlass } from './GlassWeatherGlass';
import { fn } from 'storybook/test';

const meta = {
  title: 'Effects + Advanced/Glass Weather Glass',
  component: GlassWeatherGlass,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onWeatherChange: fn(), onAtmosphericEvent: fn() },
  argTypes: {
    width: {
      control: { type: 'range', min: 300, max: 1000, step: 50 },
    },
    height: {
      control: { type: 'range', min: 200, max: 600, step: 50 },
    },
    particleDensity: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
    },
    animationSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
    windStrength: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
    timeOfDay: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
    },
  },
} satisfies Meta<typeof GlassWeatherGlass>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 600,
    height: 400,
    showControls: true,
    showWeatherInfo: true,
    weatherResponsive: true,
  },
};

export const ClearSky: Story = {
  args: {
    width: 500,
    height: 350,
    weather: {
      type: 'clear',
      intensity: 0.3,
      temperature: 22,
      humidity: 0.5,
      pressure: 1015,
      windSpeed: 8,
      windDirection: 90,
      visibility: 15,
      id: 'clear-weather'
    },
    dayNightCycle: true,
    timeOfDay: 14,
  },
};

export const RainyDay: Story = {
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'rainy',
      intensity: 0.8,
      temperature: 16,
      humidity: 0.9,
      pressure: 1005,
      windSpeed: 15,
      windDirection: 225,
      visibility: 5,
      id: 'rainy-weather'
    },
    particleDensity: 1.5,
    showAtmosphericEffects: true,
  },
};

export const SnowyWeather: Story = {
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'snowy',
      intensity: 0.7,
      temperature: -5,
      humidity: 0.8,
      pressure: 1020,
      windSpeed: 12,
      windDirection: 0,
      visibility: 3,
      id: 'snowy-weather'
    },
    particleDensity: 1.2,
    windStrength: 0.8,
  },
};

export const StormyWeather: Story = {
  args: {
    width: 700,
    height: 450,
    weather: {
      type: 'stormy',
      intensity: 0.9,
      temperature: 18,
      humidity: 0.95,
      pressure: 995,
      windSpeed: 35,
      windDirection: 270,
      visibility: 2,
      id: 'stormy-weather'
    },
    showAtmosphericEffects: true,
    animationSpeed: 1.5,
  },
};

export const FoggyConditions: Story = {
  args: {
    width: 500,
    height: 300,
    weather: {
      type: 'foggy',
      intensity: 0.8,
      temperature: 12,
      humidity: 0.99,
      pressure: 1018,
      windSpeed: 3,
      windDirection: 180,
      visibility: 0.5,
      id: 'foggy-weather'
    },
    particleDensity: 2,
    showAtmosphericEffects: true,
  },
};

export const SunnyWeather: Story = {
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'sunny',
      intensity: 0.9,
      temperature: 28,
      humidity: 0.4,
      pressure: 1022,
      windSpeed: 5,
      windDirection: 135,
      visibility: 20,
      id: 'sunny-weather'
    },
    timeOfDay: 12,
    dayNightCycle: true,
  },
};

export const WindyConditions: Story = {
  args: {
    width: 600,
    height: 350,
    weather: {
      type: 'windy',
      intensity: 0.7,
      temperature: 20,
      humidity: 0.6,
      pressure: 1010,
      windSpeed: 25,
      windDirection: 315,
      visibility: 12,
      id: 'windy-weather'
    },
    windStrength: 2,
    particleDensity: 0.8,
  },
};

export const NightTime: Story = {
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'clear',
      intensity: 0.2,
      temperature: 10,
      humidity: 0.7,
      pressure: 1015,
      windSpeed: 8,
      windDirection: 90,
      visibility: 15,
      id: 'night-weather'
    },
    dayNightCycle: true,
    timeOfDay: 2,
    showAtmosphericEffects: true,
  },
};

export const AutoUpdating: Story = {
  args: {
    width: 600,
    height: 400,
    autoUpdate: true,
    updateInterval: 5000,
    weatherResponsive: true,
    showWeatherInfo: true,
    showAtmosphericEffects: true,
  },
};

export const MinimalInterface: Story = {
  args: {
    width: 400,
    height: 250,
    showControls: false,
    showWeatherInfo: false,
    weatherResponsive: true,
    weather: {
      type: 'cloudy',
      intensity: 0.6,
      temperature: 18,
      humidity: 0.7,
      pressure: 1012,
      windSpeed: 10,
      windDirection: 180,
      visibility: 8,
      id: 'minimal-weather'
    },
  },
};

export const HighDensityParticles: Story = {
  args: {
    width: 700,
    height: 500,
    weather: {
      type: 'rainy',
      intensity: 1,
      temperature: 14,
      humidity: 1,
      pressure: 1000,
      windSpeed: 20,
      windDirection: 225,
      visibility: 3,
      id: 'heavy-rain'
    },
    particleDensity: 2.5,
    animationSpeed: 1.8,
    windStrength: 1.5,
  },
};

export const TemperatureExtreme: Story = {
  args: {
    width: 600,
    height: 400,
    weather: {
      type: 'sunny',
      intensity: 0.9,
      temperature: 38,
      humidity: 0.2,
      pressure: 1025,
      windSpeed: 3,
      windDirection: 90,
      visibility: 25,
      id: 'extreme-heat'
    },
    weatherResponsive: true,
    temperatureRange: [-20, 45],
    timeOfDay: 13,
  },
};