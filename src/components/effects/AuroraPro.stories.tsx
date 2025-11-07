import type { Meta, StoryObj } from '@storybook/react';
import { AuroraPro } from './AuroraPro';

import { cn } from '../../lib/utils';
const meta: Meta<typeof AuroraPro> = {
  title: 'Effects/AuroraPro',
  component: AuroraPro,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Spectacular aurora borealis effects with dynamic color palettes, particle systems, and immersive atmospheric lighting.'
      }
    }
  },
  argTypes: {
    intensity: {
      control: { type: 'number', min: 0.1, max: 2, step: 0.1 },
      description: 'Overall intensity of aurora effects'
    },
    speed: {
      control: { type: 'number', min: 0.1, max: 2, step: 0.1 },
      description: 'Animation speed multiplier'
    },
    colorPalette: {
      control: { type: 'select', options: ['arctic', 'forest', 'sunset', 'ocean', 'cosmic', 'custom'] },
      description: 'Color palette for aurora effects'
    },
    particleCount: {
      control: { type: 'number', min: 10, max: 100, step: 10 },
      description: 'Number of aurora particles'
    },
    showParticles: {
      control: 'boolean',
      description: 'Show particle effects'
    },
    showWaves: {
      control: 'boolean',
      description: 'Show aurora wave effects'
    },
    showCurtain: {
      control: 'boolean',
      description: 'Show aurora curtain effects'
    },
    animationMode: {
      control: { type: 'select', options: ['flow', 'pulse', 'shift', 'mixed'] },
      description: 'Animation mode for aurora effects'
    },
    showControls: {
      control: 'boolean',
      description: 'Show aurora controls'
    }
  }
};

export default meta;
type Story = StoryObj<typeof AuroraPro>;

export const ArcticAurora: Story = {
  args: {
    intensity: 1.0,
    speed: 1.0,
    colorPalette: 'arctic',
    particleCount: 50,
    showParticles: true,
    showWaves: true,
    showCurtain: false,
    animationMode: 'flow',
    showControls: true
  },
  render: (args) => (
    <div className="relative">
      <AuroraPro {...args}>
        <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-blue-900 glass-gradient-primary flex items-center justify-center p-8">
          <div className="text-center text-primary max-w-2xl">
            <div className="text-6xl mb-6">🌌</div>
            <h1 className="text-4xl font-bold mb-6">Arctic Aurora</h1>
            <p className="text-xl text-blue-200 mb-8">
              Experience the mesmerizing beauty of the northern lights with ethereal blue and green aurora waves
              dancing across the night sky. This arctic display captures the magic of polar light shows.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">❄️</div>
                <div className="font-semibold">Arctic Colors</div>
                <div className="glass-text-secondary">Cool blue & green palette</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🌊</div>
                <div className="font-semibold">Flowing Waves</div>
                <div className="glass-text-secondary">Smooth, organic movement</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-semibold">Particle Effects</div>
                <div className="glass-text-secondary">Scattered light particles</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
  )
};

export const ForestAurora: Story = {
  args: {
    intensity: 1.2,
    speed: 0.8,
    colorPalette: 'forest',
    particleCount: 40,
    showParticles: true,
    showWaves: true,
    showCurtain: true,
    animationMode: 'pulse',
    showControls: true
  },
  render: (args) => (
    <div className="relative">
      <AuroraPro {...args}>
        <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-emerald-900 glass-gradient-primary flex items-center justify-center p-8">
          <div className="text-center text-primary max-w-2xl">
            <div className="text-6xl mb-6">🌲</div>
            <h1 className="text-4xl font-bold mb-6">Forest Aurora</h1>
            <p className="text-xl text-green-200 mb-8">
              Immerse yourself in nature's light show with deep forest greens and earthy aurora effects.
              Experience the tranquility of woodland aurora displays with pulsing light patterns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🌿</div>
                <div className="font-semibold">Forest Greens</div>
                <div className="glass-text-secondary">Deep emerald & jade tones</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">💚</div>
                <div className="font-semibold">Pulsing Rhythm</div>
                <div className="glass-text-secondary">Organic breathing effect</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🌳</div>
                <div className="font-semibold">Curtain Effect</div>
                <div className="glass-text-secondary">Layered aurora curtains</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
  )
};

export const SunsetAurora: Story = {
  args: {
    intensity: 1.5,
    speed: 1.2,
    colorPalette: 'sunset',
    particleCount: 60,
    showParticles: true,
    showWaves: true,
    showCurtain: false,
    animationMode: 'shift',
    showControls: true
  },
  render: (args) => (
    <div className="relative">
      <AuroraPro {...args}>
        <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-pink-600 glass-gradient-primary flex items-center justify-center p-8">
          <div className="text-center text-primary max-w-2xl">
            <div className="text-6xl mb-6">🌅</div>
            <h1 className="text-4xl font-bold mb-6">Sunset Aurora</h1>
            <p className="text-xl text-orange-200 mb-8">
              Witness the spectacular fusion of sunset colors with aurora effects.
              Experience shifting color palettes that dance like fire in the evening sky.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🔥</div>
                <div className="font-semibold">Fiery Colors</div>
                <div className="glass-text-secondary">Orange, pink & purple hues</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🌈</div>
                <div className="font-semibold">Color Shifting</div>
                <div className="glass-text-secondary">Dynamic color transitions</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">⭐</div>
                <div className="font-semibold">Intense Display</div>
                <div className="glass-text-secondary">High-intensity effects</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
  )
};

export const OceanAurora: Story = {
  args: {
    intensity: 0.8,
    speed: 0.6,
    colorPalette: 'ocean',
    particleCount: 35,
    showParticles: true,
    showWaves: true,
    showCurtain: true,
    animationMode: 'mixed',
    showControls: true
  },
  render: (args) => (
    <div className="relative">
      <AuroraPro {...args}>
        <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-cyan-800 glass-gradient-primary flex items-center justify-center p-8">
          <div className="text-center text-primary max-w-2xl">
            <div className="text-6xl mb-6">🌊</div>
            <h1 className="text-4xl font-bold mb-6">Ocean Aurora</h1>
            <p className="text-xl text-cyan-200 mb-8">
              Dive into the depths of oceanic aurora with calming blue and teal colors.
              Experience the gentle ebb and flow of underwater light patterns.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🏄‍♂️</div>
                <div className="font-semibold">Ocean Blues</div>
                <div className="glass-text-secondary">Deep sea & coastal colors</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🌊</div>
                <div className="font-semibold">Wave Motion</div>
                <div className="glass-text-secondary">Fluid, flowing animations</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🐚</div>
                <div className="font-semibold">Serene Effect</div>
                <div className="glass-text-secondary">Calming, peaceful display</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
  )
};

export const CosmicAurora: Story = {
  args: {
    intensity: 1.3,
    speed: 1.0,
    colorPalette: 'cosmic',
    particleCount: 70,
    showParticles: true,
    showWaves: true,
    showCurtain: true,
    animationMode: 'mixed',
    showControls: true
  },
  render: (args) => (
    <div className="relative">
      <AuroraPro {...args}>
        <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-indigo-900 glass-gradient-primary flex items-center justify-center p-8">
          <div className="text-center text-primary max-w-2xl">
            <div className="text-6xl mb-6">🌌</div>
            <h1 className="text-4xl font-bold mb-6">Cosmic Aurora</h1>
            <p className="text-xl text-purple-200 mb-8">
              Journey through the cosmos with deep purple and violet aurora effects.
              Experience the mystery and wonder of universal light displays.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🪐</div>
                <div className="font-semibold">Cosmic Colors</div>
                <div className="glass-text-secondary">Deep space color palette</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">🌟</div>
                <div className="font-semibold">Mixed Effects</div>
                <div className="glass-text-secondary">Combined animation modes</div>
              </div>
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-semibold">Stellar Display</div>
                <div className="glass-text-secondary">High particle density</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
  )
};

export const MinimalAurora: Story = {
  args: {
    intensity: 0.6,
    speed: 0.4,
    colorPalette: 'arctic',
    particleCount: 20,
    showParticles: true,
    showWaves: true,
    showCurtain: false,
    animationMode: 'flow',
    showControls: false
  },
  render: (args) => (
    <div className="relative">
      <AuroraPro {...args}>
        <div className="glass-min-h-screen glass-surface-subtle flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <div className="text-4xl mb-6">🌟</div>
            <h1 className="text-2xl font-bold glass-text-secondary mb-6">Minimal Aurora</h1>
            <p className="glass-text-secondary">
              A subtle aurora display perfect for clean, minimal designs.
              Gentle effects that enhance without overwhelming the content.
            </p>
          </div>
        </div>
      </AuroraPro>
    </div>
  )
};

export const AuroraShowcase: Story = {
  args: {
    intensity: 1.0,
    speed: 1.0,
    colorPalette: 'cosmic',
    particleCount: 50,
    showParticles: true,
    showWaves: true,
    showCurtain: true,
    animationMode: 'mixed',
    showControls: true
  },
  render: (args) => (
    <div className="relative">
      <AuroraPro {...args}>
        <div className="glass-min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-primary text-center mb-12">
              Aurora Pro Showcase
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 glass-surface-subtle/10 backdrop-blur-lg glass-radius-xl border border-white/20">
                <h3 className="text-xl font-semibold text-primary mb-4">🌌 Dynamic Effects</h3>
                <ul className="text-primary/80 space-y-2 text-sm">
                  <li>• Flowing aurora waves with organic movement</li>
                  <li>• Pulsing intensity for breathing effects</li>
                  <li>• Color shifting through cosmic palettes</li>
                  <li>• Mixed animations combining all modes</li>
                </ul>
              </div>

              <div className="p-6 glass-surface-subtle/10 backdrop-blur-lg glass-radius-xl border border-white/20">
                <h3 className="text-xl font-semibold text-primary mb-4">✨ Visual Features</h3>
                <ul className="text-primary/80 space-y-2 text-sm">
                  <li>• Multiple aurora wave layers</li>
                  <li>• Particle systems with realistic physics</li>
                  <li>• Curtain effects for depth</li>
                  <li>• Atmospheric lighting and fog</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20 text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-primary font-semibold">Color Palettes</div>
                <div className="text-primary/60 text-sm">6+ themes</div>
              </div>

              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20 text-center">
                <div className="text-3xl mb-2">🎭</div>
                <div className="text-primary font-semibold">Animation Modes</div>
                <div className="text-primary/60 text-sm">4 styles</div>
              </div>

              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-primary font-semibold">Performance</div>
                <div className="text-primary/60 text-sm">60fps</div>
              </div>

              <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-lg border border-white/20 text-center">
                <div className="text-3xl mb-2">🎛️</div>
                <div className="text-primary font-semibold">Controls</div>
                <div className="text-primary/60 text-sm">Interactive</div>
              </div>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
  )
};

export const CustomAurora: Story = {
  args: {
    intensity: 1.2,
    speed: 1.0,
    colorPalette: 'custom',
    customColors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    particleCount: 45,
    showParticles: true,
    showWaves: true,
    showCurtain: false,
    animationMode: 'shift',
    showControls: true
  },
  render: (args) => (
    <div className="relative">
      <AuroraPro {...args}>
        <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-slate-800 glass-gradient-primary flex items-center justify-center p-8">
          <div className="text-center text-primary max-w-2xl">
            <div className="text-6xl mb-6">🎨</div>
            <h1 className="text-4xl font-bold mb-6">Custom Aurora</h1>
            <p className="text-xl text-gray-300 mb-8">
              Create your own aurora experience with custom color palettes.
              Mix and match colors to create unique atmospheric effects.
            </p>
            <div className="p-4 glass-surface-subtle/10 backdrop-blur-lg glass-radius-xl border border-white/20">
              <h3 className="text-lg font-semibold text-primary mb-4">Custom Colors</h3>
              <div className="flex justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 glass-radius-full glass-surface-red"></div>
                  <span className="text-primary/80 text-sm">Coral Red</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 glass-radius-full bg-teal-400"></div>
                  <span className="text-primary/80 text-sm">Teal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 glass-radius-full glass-surface-blue"></div>
                  <span className="text-primary/80 text-sm">Sky Blue</span>
                </div>
              </div>
              <p className="text-primary/60 text-sm">
                Customize the aurora colors to match your brand or create unique visual experiences
              </p>
            </div>
          </div>
        </div>
      </AuroraPro>
    </div>
  )
};

