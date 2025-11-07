import type { Meta, StoryObj } from '@storybook/react';
import { LiquidGlassMaterial } from '../../primitives/LiquidGlassMaterial';

import { cn } from '../../lib/utils';
const meta: Meta<typeof LiquidGlassMaterial> = {
  title: 'Primitives/LiquidGlassMaterial',
  component: LiquidGlassMaterial,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# LiquidGlassMaterial

The **LiquidGlassMaterial** primitive provides Apple Liquid Glass parity+ with physically accurate refraction, environmental adaptation, and motion responsiveness. Built on advanced IOR physics and GPU acceleration.

## Key Features

- **Physical IOR System**: Real-time refraction using Snell's law calculations
- **Environmental Adaptation**: Content-aware tinting with WCAG compliance 
- **Motion Responsiveness**: Device tilt and user interaction effects
- **GPU Acceleration**: WebGL shaders with CSS fallbacks
- **Quality Tiers**: Ultra/High/Balanced/Efficient performance levels

## Material Variants

- **Regular**: Standard liquid glass with subtle refraction
- **Clear**: Ultra-transparent with minimal visual weight
        `,
      },
    },
  },
  argTypes: {
    ior: {
      control: { type: 'range', min: 1.0, max: 2.0, step: 0.01 },
      description: 'Index of Refraction (1.0-2.0)',
      defaultValue: 1.45,
    },
    thickness: {
      control: { type: 'range', min: 1, max: 50, step: 1 },
      description: 'Material thickness in pixels',
      defaultValue: 12,
    },
    tint: {
      control: 'object',
      description: 'RGBA tint color object',
      defaultValue: { r: 0, g: 0, b: 0, a: 0.1 },
    },
    variant: {
      control: { type: 'select' },
      options: ['regular', 'clear'],
      description: 'Material density variant',
      defaultValue: 'regular',
    },
    quality: {
      control: { type: 'select' },
      options: ['ultra', 'high', 'balanced', 'efficient'],
      description: 'Rendering quality tier',
      defaultValue: 'high',
    },
    environmentAdaptation: {
      control: 'boolean',
      description: 'Enable content-aware environmental adaptation',
      defaultValue: true,
    },
    motionResponsive: {
      control: 'boolean',
      description: 'Enable device motion responsiveness',
      defaultValue: true,
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interaction-based micro-effects',
      defaultValue: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ior: 1.45,
    thickness: 12,
    tint: { r: 0, g: 0, b: 0, a: 0.1 },
    variant: 'regular',
    quality: 'high',
    environmentAdaptation: true,
    motionResponsive: true,
    interactive: false,
    className: 'w-64 h-40 p-6',
    children: (
      <div className="text-primary">
        <h3 className="text-lg font-semibold mb-2">Liquid Glass</h3>
        <p className="text-sm opacity-80">
          Experience Apple-quality liquid glass with physically accurate refraction and environmental adaptation.
        </p>
      </div>
    ),
  },
};

export const HighIOR: Story = {
  args: {
    ...Default.args,
    ior: 1.8,
    thickness: 20,
    tint: { r: 59, g: 130, b: 246, a: 0.15 },
    children: (
      <div className="text-primary">
        <h3 className="text-lg font-semibold mb-2">High IOR Glass</h3>
        <p className="text-sm opacity-80">
          Enhanced refraction creates dramatic depth and crystal-like appearance.
        </p>
      </div>
    ),
  },
};

export const UltraClear: Story = {
  args: {
    ...Default.args,
    ior: 1.33,
    thickness: 6,
    tint: { r: 0, g: 0, b: 0, a: 0.02 },
    variant: 'clear',
    quality: 'ultra',
    children: (
      <div className="text-primary">
        <h3 className="text-lg font-semibold mb-2">Ultra Clear</h3>
        <p className="text-sm opacity-80">
          Minimal visual weight with water-like transparency.
        </p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    ...Default.args,
    interactive: true,
    thickness: 16,
    tint: { r: 34, g: 197, b: 94, a: 0.12 },
    children: (
      <div className="text-primary">
        <h3 className="text-lg font-semibold mb-2">Interactive Surface</h3>
        <p className="text-sm opacity-80">
          Hover and interact to see micro-refraction effects in action.
        </p>
      </div>
    ),
  },
};

export const QualityComparison: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-6">
      {(['ultra', 'high', 'balanced', 'efficient'] as const).map((quality) => (
        <LiquidGlassMaterial
          key={quality}
          ior={1.48}
          thickness={12}
          tint={{ r: 0, g: 0, b: 0, a: 0.1 }}
          variant="regular"
          quality={quality}
          environmentAdaptation
          motionResponsive
          className="w-48 h-32 p-4"
        >
          <div className="text-primary">
            <h4 className="font-medium mb-1 capitalize">{quality} Quality</h4>
            <p className="text-xs opacity-70">
              {quality === 'ultra' && 'Maximum fidelity'}
              {quality === 'high' && 'Balanced performance'}
              {quality === 'balanced' && 'Optimized rendering'}
              {quality === 'efficient' && 'Battery friendly'}
            </p>
          </div>
        </LiquidGlassMaterial>
      ))}
    </div>
  ),
};

export const MaterialVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-6">
      <LiquidGlassMaterial
        ior={1.45}
        thickness={12}
        tint={{ r: 0, g: 0, b: 0, a: 0.1 }}
        variant="regular"
        quality="high"
        environmentAdaptation
        motionResponsive
        className="w-48 h-32 p-4"
      >
        <div className="text-primary">
          <h4 className="font-medium mb-1">Regular Variant</h4>
          <p className="text-xs opacity-70">
            Standard liquid glass with subtle refraction and depth.
          </p>
        </div>
      </LiquidGlassMaterial>

      <LiquidGlassMaterial
        ior={1.33}
        thickness={8}
        tint={{ r: 0, g: 0, b: 0, a: 0.05 }}
        variant="clear"
        quality="high"
        environmentAdaptation
        motionResponsive
        className="w-48 h-32 p-4"
      >
        <div className="text-primary">
          <h4 className="font-medium mb-1">Clear Variant</h4>
          <p className="text-xs opacity-70">
            Ultra-transparent with minimal visual weight.
          </p>
        </div>
      </LiquidGlassMaterial>
    </div>
  ),
};

export const ColorfulTints: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 p-6">
      {[
        { name: 'Blue', tint: { r: 59, g: 130, b: 246, a: 0.12 } },
        { name: 'Green', tint: { r: 34, g: 197, b: 94, a: 0.12 } },
        { name: 'Purple', tint: { r: 168, g: 85, b: 247, a: 0.12 } },
        { name: 'Orange', tint: { r: 249, g: 115, b: 22, a: 0.12 } },
        { name: 'Pink', tint: { r: 236, g: 72, b: 153, a: 0.12 } },
        { name: 'Red', tint: { r: 239, g: 68, b: 68, a: 0.12 } },
      ].map(({ name, tint }) => (
        <LiquidGlassMaterial
          key={name}
          ior={1.48}
          thickness={14}
          tint={tint}
          variant="regular"
          quality="high"
          environmentAdaptation
          motionResponsive
          className="w-32 h-24 p-3"
        >
          <div className="text-primary text-center">
            <h5 className="text-sm font-medium">{name}</h5>
          </div>
        </LiquidGlassMaterial>
      ))}
    </div>
  ),
};

export const ThicknessVariations: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4 p-6">
      {[4, 8, 16, 32].map((thickness) => (
        <LiquidGlassMaterial
          key={thickness}
          ior={1.48}
          thickness={thickness}
          tint={{ r: 0, g: 0, b: 0, a: 0.08 }}
          variant="regular"
          quality="high"
          environmentAdaptation
          motionResponsive
          className="w-32 h-24 p-3"
        >
          <div className="text-primary text-center">
            <h5 className="text-sm font-medium">{thickness}px</h5>
            <p className="text-xs opacity-70">thickness</p>
          </div>
        </LiquidGlassMaterial>
      ))}
    </div>
  ),
};

export const Playground: Story = {
  args: {
    ...Default.args,
    className: 'w-96 h-64 p-8',
    children: (
      <div className="text-primary h-full flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-3">Liquid Glass Playground</h2>
          <p className="text-sm opacity-80 mb-4">
            Adjust the controls in the Storybook panel to experiment with different IOR values, 
            thickness, tints, and quality settings.
          </p>
        </div>
        <div className="text-xs opacity-60">
          <p>🔬 Physics: Real-time IOR calculations</p>
          <p>🌍 Adaptive: Content-aware environmental tinting</p>
          <p>⚡ Performance: GPU-accelerated with CSS fallbacks</p>
        </div>
      </div>
    ),
  },
};