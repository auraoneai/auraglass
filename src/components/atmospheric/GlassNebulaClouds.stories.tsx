import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GlassNebulaClouds } from './GlassNebulaClouds';

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

const ResponsiveNebulaClouds = (args: React.ComponentProps<typeof GlassNebulaClouds>) => {
  const layout = useResponsiveAtmosphericLayout(args.width ?? 800, args.height ?? 600);
  return (
    <GlassNebulaClouds
      {...args}
      width={layout.width}
      height={layout.height}
      showControls={layout.mobile ? false : args.showControls}
    />
  );
};

const meta = {
  title: 'Effects + Advanced/Glass Nebula Clouds',
  component: GlassNebulaClouds,
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
    density: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
    },
    temperature: {
      control: { type: 'range', min: 10, max: 100000, step: 1000 },
    },
    stellarWindStrength: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    colorIntensity: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.1 },
    },
    turbulenceLevel: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
    },
    timeScale: {
      control: { type: 'range', min: 0.1, max: 10, step: 0.1 },
    },
    nebulaType: {
      control: { type: 'select' },
      options: ['emission', 'reflection', 'dark', 'planetary', 'supernova'],
    },
  },
} satisfies Meta<typeof GlassNebulaClouds>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <ResponsiveNebulaClouds {...args} />,
  args: {
    width: 800,
    height: 600,
    showControls: true,
    showNebulaInfo: true,
    showStarClusters: true,
    showCosmicDust: true,
  },
};

export const EmissionNebula: Story = {
  args: {
    width: 700,
    height: 500,
    nebulaType: 'emission',
    temperature: 10000,
    density: 0.8,
    ionizationLevel: 0.9,
    showEmissionLines: true,
    colorIntensity: 0.9,
  },
};

export const ReflectionNebula: Story = {
  args: {
    width: 600,
    height: 400,
    nebulaType: 'reflection',
    temperature: 3000,
    density: 0.6,
    ionizationLevel: 0.2,
    showStarClusters: true,
    showCosmicDust: true,
  },
};

export const DarkNebula: Story = {
  args: {
    width: 650,
    height: 450,
    nebulaType: 'dark',
    temperature: 10,
    density: 0.9,
    colorIntensity: 0.4,
    showCosmicDust: true,
    showStarClusters: false,
  },
};

export const PlanetaryNebula: Story = {
  args: {
    width: 500,
    height: 500,
    nebulaType: 'planetary',
    temperature: 50000,
    density: 0.5,
    ionizationLevel: 1,
    layerCount: 3,
    showEmissionLines: true,
    turbulenceLevel: 0.3,
  },
};

export const SupernovaRemnant: Story = {
  args: {
    width: 800,
    height: 600,
    nebulaType: 'supernova',
    temperature: 1000000,
    density: 0.4,
    stellarWindStrength: 0.9,
    turbulenceLevel: 1.5,
    showMagneticField: true,
    colorIntensity: 1,
  },
};

export const YoungNebula: Story = {
  args: {
    width: 700,
    height: 500,
    nebulaType: 'emission',
    density: 0.9,
    temperature: 15000,
    timeScale: 5,
    showStarClusters: true,
    turbulenceLevel: 0.8,
  },
};

export const MaturingNebula: Story = {
  args: {
    width: 750,
    height: 550,
    nebulaType: 'emission',
    density: 0.6,
    temperature: 8000,
    timeScale: 2,
    stellarWindStrength: 0.7,
    layerCount: 6,
  },
};

export const DispersingNebula: Story = {
  args: {
    width: 800,
    height: 600,
    nebulaType: 'reflection',
    density: 0.3,
    temperature: 5000,
    stellarWindStrength: 0.8,
    timeScale: 1,
    colorIntensity: 0.5,
  },
};

export const HighTurbulence: Story = {
  args: {
    width: 600,
    height: 400,
    turbulenceLevel: 2,
    stellarWindStrength: 0.9,
    density: 0.8,
    animationSpeed: 1.5,
    layerCount: 7,
  },
};

export const ColdMolecularCloud: Story = {
  args: {
    width: 700,
    height: 500,
    nebulaType: 'dark',
    temperature: 20,
    density: 1,
    showCosmicDust: true,
    showStarClusters: true,
    colorIntensity: 0.3,
  },
};

export const HotIonizedGas: Story = {
  args: {
    width: 650,
    height: 450,
    nebulaType: 'emission',
    temperature: 30000,
    ionizationLevel: 1,
    density: 0.7,
    showEmissionLines: true,
    colorIntensity: 1,
  },
};

export const MinimalInterface: Story = {
  args: {
    width: 400,
    height: 300,
    showControls: false,
    showNebulaInfo: false,
    nebulaType: 'emission',
    density: 0.6,
    showStarClusters: true,
  },
};

export const MagneticFieldVisible: Story = {
  args: {
    width: 800,
    height: 600,
    showMagneticField: true,
    nebulaType: 'supernova',
    stellarWindStrength: 0.8,
    ionizationLevel: 0.9,
    turbulenceLevel: 1.2,
  },
};

export const StarFormingRegion: Story = {
  args: {
    width: 750,
    height: 550,
    nebulaType: 'emission',
    density: 0.9,
    temperature: 12000,
    showStarClusters: true,
    showCosmicDust: true,
    timeScale: 3,
    turbulenceLevel: 0.9,
  },
};

export const ComplexNebula: Story = {
  args: {
    width: 900,
    height: 700,
    layerCount: 8,
    density: 0.8,
    temperature: 15000,
    showStarClusters: true,
    showCosmicDust: true,
    showEmissionLines: true,
    showMagneticField: true,
    turbulenceLevel: 1.5,
    colorIntensity: 0.9,
    stellarWindStrength: 0.7,
  },
};
