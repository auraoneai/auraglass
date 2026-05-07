import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HoudiniGlassCard, HoudiniGlassShowcase } from './HoudiniGlassCard';
import { HoudiniGlassProvider } from './HoudiniGlassProvider';

const meta: Meta<typeof HoudiniGlassProvider> = {
  title: 'Effects + Advanced/Houdini Glass Provider',
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

const HoudiniStoryFrame = ({
  children,
  maxWidth = 1120,
}: {
  children: ReactNode;
  maxWidth?: number;
}) => (
  <div
    className="houdini-story-frame"
    style={{
      width: '100%',
      height: '100vh',
      minHeight: 0,
      padding: 'clamp(20px, 4vw, 40px)',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      overflowY: 'auto',
      color: 'inherit',
    }}
  >
    <div style={{ width: 'min(100%, ' + maxWidth + 'px)', margin: '0 auto' }}>
      {children}
    </div>
    <style>{`
      .houdini-story-frame .glass-foundation-complete {
        background-color: rgba(15, 23, 42, 0.78) !important;
      }

      [data-storybook-preview-mode="dark"] .houdini-story-frame,
      [data-storybook-preview-mode="high-contrast"] .houdini-story-frame {
        color: #f8fafc;
      }

      [data-storybook-preview-mode="dark"] .houdini-story-frame button,
      [data-storybook-preview-mode="high-contrast"] .houdini-story-frame button {
        background: rgba(31, 41, 55, 0.76) !important;
        background-color: rgba(31, 41, 55, 0.76) !important;
        color: #f8fafc !important;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame {
        color: #0f172a;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame h1,
      [data-storybook-preview-mode="liquid"] .houdini-story-frame h2,
      [data-storybook-preview-mode="liquid"] .houdini-story-frame h3,
      [data-storybook-preview-mode="liquid"] .houdini-story-frame h4,
      [data-storybook-preview-mode="liquid"] .houdini-story-frame [class*="glass-text-primary"],
      [data-storybook-preview-mode="liquid"] .houdini-story-frame [class*="glass-text-secondary"] {
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame .glass-foundation-complete {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(226, 232, 240, 0.54)), rgba(255, 255, 255, 0.64) !important;
        background-color: rgba(255, 255, 255, 0.64) !important;
        border-color: rgba(15, 23, 42, 0.16) !important;
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame button {
        background: rgba(255, 255, 255, 0.66) !important;
        background-color: rgba(255, 255, 255, 0.66) !important;
        border-color: rgba(15, 23, 42, 0.18) !important;
        color: #0f172a !important;
      }

      [data-storybook-preview-mode="liquid"] .houdini-story-frame button [class*="glass-text-secondary"] {
        color: #334155 !important;
      }
    `}</style>
  </div>
);

export const Showcase: Story = {
  args: {
    defaultPreset: 'standard',
    enabledEffects: ['frost', 'caustics', 'border'],
    performanceMode: false,
    debugMode: true
  },
  render: (args) => (
    <HoudiniGlassProvider {...args}>
      <HoudiniStoryFrame>
        <HoudiniGlassShowcase />
      </HoudiniStoryFrame>
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
      <HoudiniStoryFrame maxWidth={1180}>
        <div>
          <h1
            className="glass-text-4xl glass-font-bold glass-text-primary glass-text-center mb-12"
            style={{ color: '#f8fafc', marginBottom: 32 }}
          >
            Houdini Glass Card Gallery
          </h1>

          <div
            className="glass-grid glass-gap-6"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 24,
            }}
          >
            <HoudiniGlassCard
              title="Standard Glass"
              description="Clean, balanced glass effect"
              preset="standard"
              effects={['frost']}
              showControls={true}
              interactive={true}
            >
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">✨</div>
                <p className="glass-text-primary/80 glass-text-sm">
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
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">❄️</div>
                <p className="glass-text-primary/80 glass-text-sm">
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
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">💎</div>
                <p className="glass-text-primary/80 glass-text-sm">
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
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">🔮</div>
                <p className="glass-text-primary/80 glass-text-sm">
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
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">🌟</div>
                <p className="glass-text-primary/80 glass-text-sm">
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
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">⚡</div>
                <p className="glass-text-primary/80 glass-text-sm">
                  Performance-optimized glass with reduced effects for smooth rendering.
                </p>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </HoudiniStoryFrame>
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
      <HoudiniStoryFrame maxWidth={900}>
        <div>
          <h1
            className="glass-text-3xl glass-font-bold glass-text-primary glass-text-center mb-8"
            style={{ color: '#f8fafc', marginBottom: 28 }}
          >
            Performance Optimized Glass
          </h1>

          <div
            className="glass-grid glass-gap-6"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            <HoudiniGlassCard
              title="Optimized Card"
              description="Performance-optimized effects"
              preset="minimal"
              effects={['frost']}
              showControls={true}
            >
              <div className="glass-p-4">
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">🚀 Fast Rendering</h3>
                <p className="glass-text-primary/80 glass-text-sm glass-mb-4">
                  Reduced effects for maximum performance while maintaining visual appeal.
                </p>
                <div className="glass-text-xs glass-text-primary glass-surface-green/10 glass-px-2 glass-py-1 glass-radius">
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
              <div className="glass-p-4">
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">📊 Performance Stats</h3>
                <div className="glass-space-y-2 glass-text-sm">
                  <div className="glass-flex glass-justify-between">
                    <span className="glass-text-primary/60">FPS:</span>
                    <span className="glass-text-primary">60</span>
                  </div>
                  <div className="glass-flex glass-justify-between">
                    <span className="glass-text-primary/60">Memory:</span>
                    <span className="glass-text-primary">Low</span>
                  </div>
                  <div className="glass-flex glass-justify-between">
                    <span className="glass-text-primary/60">Effects:</span>
                    <span className="glass-text-primary">Optimized</span>
                  </div>
                </div>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </HoudiniStoryFrame>
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
      <HoudiniStoryFrame maxWidth={900}>
        <div>
          <h1
            className="glass-text-3xl glass-font-bold glass-text-primary glass-text-center mb-8"
            style={{ color: '#f8fafc', marginBottom: 28 }}
          >
            Custom Glass Properties
          </h1>

          <div
            className="glass-grid glass-gap-6"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
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
              <div className="glass-p-4">
                <div className="glass-text-4xl glass-mb-4">🌸</div>
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">Custom Theme</h3>
                <p className="glass-text-primary/80 glass-text-sm">
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
              <div className="glass-p-4">
                <h3 className="glass-text-lg glass-font-semibold glass-text-primary glass-mb-2">🎨 Active Properties</h3>
                <div className="space-y-1 glass-text-xs glass-text-primary/70">
                  <div>--glass-background: rgba(255, 20, 147, 0.1)</div>
                  <div>--glass-border: rgba(255, 20, 147, 0.3)</div>
                  <div>--glass-blur: 25px</div>
                  <div>--glass-animation-speed: 1</div>
                </div>
              </div>
            </HoudiniGlassCard>
          </div>
        </div>
      </HoudiniStoryFrame>
    </HoudiniGlassProvider>
  )
};
