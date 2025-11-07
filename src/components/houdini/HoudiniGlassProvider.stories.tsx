import type { Meta, StoryObj } from '@storybook/react';
import { HoudiniGlassCard, HoudiniGlassShowcase } from './HoudiniGlassCard';
import { HoudiniGlassProvider } from './HoudiniGlassProvider';
import { cn } from '../../lib/utils';

const meta: Meta<typeof HoudiniGlassProvider> = {
  title: 'Houdini/HoudiniGlassProvider',
  component: HoudiniGlassProvider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Native CSS Houdini integration for browser-accelerated glass effects with Paint Worklets and Properties API.'
      }
    }
  },
  argTypes: {
    defaultPreset: {
      control: { type: 'select', options: ['standard', 'frosted', 'minimal', 'heavy', 'crystal'] },
      description: 'Initial glass preset'
    },
    performanceMode: {
      control: 'boolean',
      description: 'Enable performance optimizations'
    },
    debugMode: {
      control: 'boolean',
      description: 'Enable debug interface'
    }
  }
};

export default meta;
type Story = StoryObj<typeof HoudiniGlassProvider>;

export const Showcase: Story = {
  args: {
    defaultPreset: 'standard',
    enabledEffects: ['frost', 'caustics', 'border'],
    performanceMode: false,
    debugMode: true
  },
  render: (args) => (
    <HoudiniGlassProvider {...args}>
      <HoudiniGlassShowcase />
    </HoudiniGlassProvider>
  )
};

export const CardGallery: Story = {
  args: {
    defaultPreset: 'frosted',
    enabledEffects: ['frost', 'caustics'],
    performanceMode: false,
    debugMode: false
  },
  render: (args) => (
    <HoudiniGlassProvider {...args}>
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary text-center mb-12">
            Houdini Glass Card Gallery
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <HoudiniGlassCard
              title="Standard Glass"
              description="Clean, balanced glass effect"
              preset="standard"
              effects={['frost']}
              showControls={true}
              interactive={true}
            >
              <div className="p-4">
                <div className="text-4xl mb-4">✨</div>
                <p className="text-primary/80 text-sm">
                  Standard glass with subtle frost effect and smooth interactions.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard
              title="Frosted Glass"
              description="Enhanced frost with caustics"
              preset="frosted"
              effects={['frost', 'caustics']}
              showControls={true}
              interactive={true}
            >
              <div className="p-4">
                <div className="text-4xl mb-4">❄️</div>
                <p className="text-primary/80 text-sm">
                  Frosted glass with dynamic caustics and enhanced blur.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard
              title="Crystal Clear"
              description="Ultra-clear minimal glass"
              preset="crystal"
              effects={['border']}
              showControls={true}
              interactive={true}
            >
              <div className="p-4">
                <div className="text-4xl mb-4">💎</div>
                <p className="text-primary/80 text-sm">
                  Crystal clear glass with minimal blur and elegant borders.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard
              title="Heavy Glass"
              description="Maximum glass intensity"
              preset="heavy"
              effects={['frost', 'caustics', 'border']}
              showControls={true}
              interactive={true}
            >
              <div className="p-4">
                <div className="text-4xl mb-4">🔮</div>
                <p className="text-primary/80 text-sm">
                  Heavy glass with maximum blur, multiple effects, and rich depth.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard
              title="Minimal Glass"
              description="Subtle, clean appearance"
              preset="minimal"
              effects={['frost']}
              showControls={true}
              interactive={true}
            >
              <div className="p-4">
                <div className="text-4xl mb-4">🌟</div>
                <p className="text-primary/80 text-sm">
                  Minimal glass with subtle effects and clean aesthetics.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard
              title="Performance Mode"
              description="Optimized for performance"
              preset="standard"
              effects={['frost']}
              showControls={true}
              interactive={true}
            >
              <div className="p-4">
                <div className="text-4xl mb-4">⚡</div>
                <p className="text-primary/80 text-sm">
                  Performance-optimized glass with reduced effects for smooth rendering.
                </p>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </div>
    </HoudiniGlassProvider>
  )
};

export const PerformanceMode: Story = {
  args: {
    defaultPreset: 'minimal',
    enabledEffects: ['frost'],
    performanceMode: true,
    debugMode: true
  },
  render: (args) => (
    <HoudiniGlassProvider {...args}>
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-blue-900 glass-gradient-primary p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary text-center mb-8">
            Performance Optimized Glass
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HoudiniGlassCard
              title="Optimized Card"
              description="Performance-optimized effects"
              preset="minimal"
              effects={['frost']}
              showControls={true}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary mb-2">🚀 Fast Rendering</h3>
                <p className="text-primary/80 text-sm mb-4">
                  Reduced effects for maximum performance while maintaining visual appeal.
                </p>
                <div className="text-xs text-primary glass-surface-green/10 px-2 py-1 glass-radius">
                  Performance Mode Active
                </div>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard
              title="Debug Info"
              description="Performance monitoring"
              preset="minimal"
              effects={['border']}
              showControls={true}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary mb-2">📊 Performance Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary/60">FPS:</span>
                    <span className="text-primary">60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/60">Memory:</span>
                    <span className="text-primary">Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/60">Effects:</span>
                    <span className="text-primary">Optimized</span>
                  </div>
                </div>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </div>
    </HoudiniGlassProvider>
  )
};

export const CustomProperties: Story = {
  args: {
    defaultPreset: 'standard',
    enabledEffects: ['frost', 'caustics'],
    performanceMode: false,
    debugMode: true,
    defaultProperties: {
      '--glass-background': 'rgba(255, 20, 147, 0.1)',
      '--glass-border': 'rgba(255, 20, 147, 0.3)',
      '--glass-blur': '25px'
    }
  },
  render: (args) => (
    <HoudiniGlassProvider {...args}>
      <div className="glass-min-h-screen glass-gradient-primary glass-gradient-primary via-purple-900 glass-gradient-primary p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-primary text-center mb-8">
            Custom Glass Properties
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HoudiniGlassCard
              title="Custom Colors"
              description="Deep pink glass theme"
              preset="standard"
              effects={['frost', 'caustics']}
              showControls={true}
              customProperties={{
                '--glass-background': 'rgba(255, 20, 147, 0.15)',
                '--glass-border': 'rgba(255, 20, 147, 0.4)',
                '--glass-blur': '30px'
              }}
            >
              <div className="p-4">
                <div className="text-4xl mb-4">🌸</div>
                <h3 className="text-lg font-semibold text-primary mb-2">Custom Theme</h3>
                <p className="text-primary/80 text-sm">
                  Custom CSS properties allow for completely personalized glass effects.
                </p>
              </div>
            </HoudiniGlassCard>

            <HoudiniGlassCard
              title="Property Inspector"
              description="View custom properties"
              preset="standard"
              effects={['border']}
              showControls={true}
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold text-primary mb-2">🎨 Active Properties</h3>
                <div className="space-y-1 text-xs text-primary/70">
                  <div>--glass-background: rgba(255, 20, 147, 0.1)</div>
                  <div>--glass-border: rgba(255, 20, 147, 0.3)</div>
                  <div>--glass-blur: 25px</div>
                  <div>--glass-animation-speed: 1</div>
                </div>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </div>
    </HoudiniGlassProvider>
  )
};

