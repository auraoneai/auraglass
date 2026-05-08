import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassBiomeSimulator } from './GlassBiomeSimulator';

const useResponsiveAtmosphericLayout = (desktopWidth: number, desktopHeight: number) => {
  const [layout, setLayout] = React.useState({
    width: desktopWidth,
    height: desktopHeight,
    mobile: false,
  });

  React.useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth < 520;
      setLayout({
        width: mobile ? Math.min(260, window.innerWidth - 96) : desktopWidth,
        height: mobile ? 320 : desktopHeight,
        mobile,
      });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [desktopHeight, desktopWidth]);

  return layout;
};

const ResponsiveBiomeSimulator = (args: React.ComponentProps<typeof GlassBiomeSimulator>) => {
  const layout = useResponsiveAtmosphericLayout(args.width ?? 800, args.height ?? 500);
  return (
    <GlassBiomeSimulator
      {...args}
      width={layout.width}
      height={layout.height}
      showControls={layout.mobile ? false : args.showControls}
    />
  );
};

const meta = {
  title: 'Effects + Advanced/Glass Biome Simulator',
  component: GlassBiomeSimulator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 400, max: 1200, step: 50 },
    },
    height: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    particleDensity: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
    animationSpeed: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
    wildlifeActivity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    windStrength: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
    },
  },
} satisfies Meta<typeof GlassBiomeSimulator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ResponsiveBiomeSimulator {...args} />,
  args: {
    width: 800,
    height: 500,
    showControls: true,
    showBiomeInfo: true,
    dayNightCycle: true,
    parallaxEnabled: true,
  },
};

export const ForestBiome: Story = {
  args: {
    width: 700,
    height: 400,
    biome: {
      type: 'forest',
      temperature: 18,
      humidity: 0.7,
      windSpeed: 8,
      lightLevel: 0.8,
      season: 'spring',
      timeOfDay: 14,
      id: 'forest-biome'
    },
    particleDensity: 1.2,
    wildlifeActivity: 0.7,
  },
};

export const OceanBiome: Story = {
  args: {
    width: 800,
    height: 450,
    biome: {
      type: 'ocean',
      temperature: 22,
      humidity: 0.9,
      windSpeed: 15,
      lightLevel: 0.9,
      season: 'summer',
      timeOfDay: 12,
      id: 'ocean-biome'
    },
    showWeatherEffects: true,
    parallaxEnabled: true,
  },
};

export const DesertBiome: Story = {
  args: {
    width: 600,
    height: 350,
    biome: {
      type: 'desert',
      temperature: 35,
      humidity: 0.2,
      windSpeed: 12,
      lightLevel: 1,
      season: 'summer',
      timeOfDay: 15,
      id: 'desert-biome'
    },
    particleDensity: 0.8,
    windStrength: 1.5,
  },
};

export const TundraBiome: Story = {
  args: {
    width: 700,
    height: 400,
    biome: {
      type: 'tundra',
      temperature: -15,
      humidity: 0.6,
      windSpeed: 20,
      lightLevel: 0.6,
      season: 'winter',
      timeOfDay: 10,
      id: 'tundra-biome'
    },
    particleDensity: 1.5,
    showWeatherEffects: true,
  },
};

export const GrasslandBiome: Story = {
  args: {
    width: 800,
    height: 400,
    biome: {
      type: 'grassland',
      temperature: 24,
      humidity: 0.5,
      windSpeed: 10,
      lightLevel: 0.9,
      season: 'spring',
      timeOfDay: 16,
      id: 'grassland-biome'
    },
    wildlifeActivity: 0.8,
    windStrength: 1.2,
  },
};

export const RainforestBiome: Story = {
  args: {
    width: 750,
    height: 450,
    biome: {
      type: 'rainforest',
      temperature: 26,
      humidity: 0.95,
      windSpeed: 5,
      lightLevel: 0.6,
      season: 'summer',
      timeOfDay: 13,
      id: 'rainforest-biome'
    },
    particleDensity: 2,
    showAtmosphericLayers: true,
  },
};

export const MountainBiome: Story = {
  args: {
    width: 800,
    height: 500,
    biome: {
      type: 'mountain',
      temperature: 5,
      humidity: 0.7,
      windSpeed: 25,
      lightLevel: 0.8,
      season: 'autumn',
      timeOfDay: 11,
      id: 'mountain-biome'
    },
    parallaxEnabled: true,
    showAtmosphericLayers: true,
  },
};

export const SwampBiome: Story = {
  args: {
    width: 700,
    height: 400,
    biome: {
      type: 'swamp',
      temperature: 20,
      humidity: 1,
      windSpeed: 3,
      lightLevel: 0.4,
      season: 'autumn',
      timeOfDay: 18,
      id: 'swamp-biome'
    },
    particleDensity: 1.8,
    wildlifeActivity: 0.9,
  },
};

export const NightTimeForest: Story = {
  args: {
    width: 600,
    height: 350,
    biome: {
      type: 'forest',
      temperature: 12,
      humidity: 0.8,
      windSpeed: 6,
      lightLevel: 0.2,
      season: 'autumn',
      timeOfDay: 2,
      id: 'night-forest'
    },
    dayNightCycle: true,
    wildlifeActivity: 0.3,
  },
};

export const WinterTundra: Story = {
  args: {
    width: 800,
    height: 400,
    biome: {
      type: 'tundra',
      temperature: -25,
      humidity: 0.4,
      windSpeed: 30,
      lightLevel: 0.5,
      season: 'winter',
      timeOfDay: 14,
      id: 'winter-tundra'
    },
    particleDensity: 2.5,
    windStrength: 2,
    showWeatherEffects: true,
  },
};

export const SummerDesert: Story = {
  args: {
    width: 700,
    height: 350,
    biome: {
      type: 'desert',
      temperature: 42,
      humidity: 0.1,
      windSpeed: 8,
      lightLevel: 1,
      season: 'summer',
      timeOfDay: 13,
      id: 'summer-desert'
    },
    particleDensity: 0.5,
    windStrength: 1.8,
  },
};

export const MinimalInterface: Story = {
  args: {
    width: 500,
    height: 300,
    showControls: false,
    showBiomeInfo: false,
    biome: {
      type: 'ocean',
      temperature: 20,
      humidity: 0.8,
      windSpeed: 10,
      lightLevel: 0.7,
      season: 'spring',
      timeOfDay: 15,
      id: 'minimal-ocean'
    },
    particleDensity: 0.8,
  },
};

export const HighActivity: Story = {
  args: {
    width: 800,
    height: 500,
    biome: {
      type: 'rainforest',
      temperature: 28,
      humidity: 1,
      windSpeed: 8,
      lightLevel: 0.7,
      season: 'summer',
      timeOfDay: 14,
      id: 'active-rainforest'
    },
    particleDensity: 3,
    wildlifeActivity: 1,
    animationSpeed: 1.5,
    showWeatherEffects: true,
    showAtmosphericLayers: true,
  },
};
