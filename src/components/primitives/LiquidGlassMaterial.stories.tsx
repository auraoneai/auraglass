import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { LiquidGlassMaterial } from '../../primitives/LiquidGlassMaterial';

const meta: Meta<typeof LiquidGlassMaterial> = {
  title: 'Foundations/Liquid Glass Primitives/Liquid Glass Material',
  component: LiquidGlassMaterial,
  render: (args) => (
    <MaterialStage narrow>
      <LiquidGlassMaterial {...args} />
    </MaterialStage>
  ),
  parameters: {
    layout: 'fullscreen',
    previewSurface: 'app',
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

function MaterialStage({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: 32,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: narrow ? 'min(420px, 100%)' : 'min(960px, 100%)',
          display: 'grid',
          gap: 20,
          padding: 28,
          borderRadius: 32,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.70), rgba(219,234,254,0.52)), radial-gradient(circle at 16% 16%, rgba(59,130,246,0.22), transparent 28%), radial-gradient(circle at 84% 76%, rgba(20,184,166,0.18), transparent 30%)',
          boxShadow: '0 24px 80px rgba(15,23,42,0.14)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

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
    radius: '2xl',
    className: 'glass-p-6',
    style: { width: 'min(320px, 100%)', minHeight: 180 },
    children: (
      <div className="glass-text-primary">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Liquid Glass</h3>
        <p className="glass-text-sm opacity-80">
          Experience Apple-quality liquid glass with physically accurate refraction and environmental adaptation.
        </p>
      </div>
    ),
  },
  render: (args) => (
    <MaterialStage narrow>
      <LiquidGlassMaterial {...args} />
    </MaterialStage>
  ),
};

export const HighIOR: Story = {
  args: {
    ...Default.args,
    ior: 1.8,
    thickness: 20,
    tint: { r: 59, g: 130, b: 246, a: 0.15 },
    children: (
      <div className="glass-text-primary">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">High IOR Glass</h3>
        <p className="glass-text-sm opacity-80">
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
      <div className="glass-text-primary">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Ultra Clear</h3>
        <p className="glass-text-sm opacity-80">
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
      <div className="glass-text-primary">
        <h3 className="glass-text-lg glass-font-semibold glass-mb-2">Interactive Surface</h3>
        <p className="glass-text-sm opacity-80">
          Hover and interact to see micro-refraction effects in action.
        </p>
      </div>
    ),
  },
};

export const QualityComparison: Story = {
  render: () => (
    <MaterialStage>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
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
          radius="2xl"
          className="glass-p-4"
          style={{ minHeight: 132 }}
        >
          <div className="glass-text-primary">
            <h4 className="glass-font-medium glass-mb-1 glass-capitalize">{quality} Quality</h4>
            <p className="glass-text-xs opacity-70">
              {quality === 'ultra' && 'Maximum fidelity'}
              {quality === 'high' && 'Balanced performance'}
              {quality === 'balanced' && 'Optimized rendering'}
              {quality === 'efficient' && 'Battery friendly'}
            </p>
          </div>
        </LiquidGlassMaterial>
      ))}
      </div>
    </MaterialStage>
  ),
};

export const MaterialVariants: Story = {
  render: () => (
    <MaterialStage>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
      <LiquidGlassMaterial
        ior={1.45}
        thickness={12}
        tint={{ r: 0, g: 0, b: 0, a: 0.1 }}
        variant="regular"
        quality="high"
        environmentAdaptation
        motionResponsive
        radius="2xl"
        className="glass-p-5"
        style={{ minHeight: 150 }}
      >
        <div className="glass-text-primary">
          <h4 className="glass-font-medium glass-mb-1">Regular Variant</h4>
          <p className="glass-text-xs opacity-70">
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
        radius="2xl"
        className="glass-p-5"
        style={{ minHeight: 150 }}
      >
        <div className="glass-text-primary">
          <h4 className="glass-font-medium glass-mb-1">Clear Variant</h4>
          <p className="glass-text-xs opacity-70">
            Ultra-transparent with minimal visual weight.
          </p>
        </div>
      </LiquidGlassMaterial>
      </div>
    </MaterialStage>
  ),
};

export const ColorfulTints: Story = {
  render: () => (
    <MaterialStage>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14 }}>
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
          radius="xl"
          className="glass-p-3"
          style={{ minHeight: 104 }}
        >
          <div className="glass-text-primary glass-text-center">
            <h5 className="glass-text-sm glass-font-medium">{name}</h5>
          </div>
        </LiquidGlassMaterial>
      ))}
      </div>
    </MaterialStage>
  ),
};

export const ThicknessVariations: Story = {
  render: () => (
    <MaterialStage>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
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
          radius="xl"
          className="glass-p-3"
          style={{ minHeight: 104 }}
        >
          <div className="glass-text-primary glass-text-center">
            <h5 className="glass-text-sm glass-font-medium">{thickness}px</h5>
            <p className="glass-text-xs opacity-70">thickness</p>
          </div>
        </LiquidGlassMaterial>
      ))}
      </div>
    </MaterialStage>
  ),
};

export const Playground: Story = {
  args: {
    ...Default.args,
    radius: '2xl',
    className: 'glass-p-8',
    style: { width: 'min(420px, 100%)', minHeight: 280 },
    children: (
      <div className="glass-text-primary glass-h-full glass-flex glass-flex-col glass-justify-between">
        <div>
          <h2 className="glass-text-xl glass-font-bold glass-mb-3">Liquid Glass Playground</h2>
          <p className="glass-text-sm opacity-80 glass-mb-4">
            Adjust the controls in the Storybook panel to experiment with different IOR values, 
            thickness, tints, and quality settings.
          </p>
        </div>
        <div className="glass-text-xs opacity-60">
          <p>Physics: Real-time IOR calculations</p>
          <p>Adaptive: Content-aware environmental tinting</p>
          <p>Performance: GPU-accelerated with CSS fallbacks</p>
        </div>
      </div>
    ),
  },
  render: (args) => (
    <MaterialStage narrow>
      <LiquidGlassMaterial {...args} />
    </MaterialStage>
  ),
};
